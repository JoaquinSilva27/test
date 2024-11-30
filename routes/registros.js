const { Router } = require('express');
const router = Router();
const BD = require('../config/configbd');
const { isAuthenticated, authorizeRoles } = require('../middleware/sessionMiddleware');



// Agregar prefijo para evitar conflictos (por ejemplo, "/tables")
const PREFIX = '/tables';

// CREATE: Llama a `INSERT_TABLA`
router.post(`${PREFIX}/:table`, isAuthenticated, authorizeRoles('admin'), async (req, res) => {
    const { table } = req.params;
    const data = req.body;
    console.log(`<< Ruta para agregar`);
    console.log(`Datos recibidos para la tabla ${table}:`, data);

    const procedure = `AGREGAR_${table.toUpperCase()}`;
    const binds = { ...data };

    // Función para convertir formato de fecha
    const convertirFormatoFecha = (fechaISO) => {
        const [year, month, day] = fechaISO.split('-');
        return `${day}-${month}-${year}`;
    };

    // Iterar sobre los datos para convertir fechas
    Object.keys(binds).forEach(key => {
        if (key.toLowerCase().includes('fecha') && /^\d{4}-\d{2}-\d{2}$/.test(binds[key])) {
            binds[key] = convertirFormatoFecha(binds[key]);
        }
    });

    console.log(`Llamando al procedimiento ${procedure} con parámetros:`, binds);

    try {
        await BD.OpenProcedure(procedure, binds, true);
        res.status(201).json({ message: `Agregado exitosamente` });
    } catch (error) {
        console.error(`Error al agregar ${table}:`, error);
        res.status(500).json({ error: `Error al agregar ${table}: ${error.message}` });
    }
});

// UPDATE: Llama a `UPDATE_TABLA`
router.put(`${PREFIX}/:table`, isAuthenticated, authorizeRoles('admin'), async (req, res) => {
    const { table } = req.params;
    const data = req.body;

    const { pk, ...rest } = data;

    if (!pk) {
        return res.status(400).json({ error: 'La clave primaria es obligatoria para actualizar el registro.' });
    }

    const procedure = `ACTUALIZAR_${table.toUpperCase()}`;
    const binds = { P_PK: pk, ...rest };

    console.log(`Llamando al procedimiento ${procedure} con datos:`, binds);

    try {
        await BD.OpenProcedure(procedure, binds, true);
        res.status(200).json({ message: `${table} actualizado exitosamente.` });
    } catch (error) {
        console.error(`Error al actualizar la tabla ${table}:`, error);
        res.status(500).json({ error: `Error al actualizar ${table}: ${error.message}` });
    }
});

// DELETE: Llama a `ELIMINAR_TABLA`
router.delete(`${PREFIX}/:table/:id`, isAuthenticated, authorizeRoles('admin'), async (req, res) => {
    const { table, id } = req.params;

    const procedure = `ELIMINAR_${table.toUpperCase()}`;
    const binds = { P_PK: parseInt(id, 10) };

    if (isNaN(binds.P_PK)) {
        return res.status(400).json({ error: 'La clave primaria proporcionada no es válida.' });
    }

    try {
        console.log(`Llamando al procedimiento ${procedure} con PK: ${binds.P_PK}`);
        await BD.OpenProcedure(procedure, binds, true);
        res.status(200).json({ message: `Registro eliminado con éxito de la tabla ${table}.` });
    } catch (error) {
        console.error(`Error al eliminar registro de la tabla ${table}:`, error);
        res.status(500).json({ error: `Error al eliminar registro de la tabla ${table}: ${error.message}` });
    }
});

// Endpoint para obtener las columnas de una tabla
router.get(`${PREFIX}/columns/:table`, async (req, res) => {
    const { table } = req.params;
    const fullTableName = `SA_JS_JO_NR_${table.toUpperCase()}`;

    const sql = `
        SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, COLUMN_ID
        FROM USER_TAB_COLUMNS
        WHERE TABLE_NAME = :tableName
        ORDER BY COLUMN_ID
    `;

    try {
        const result = await BD.Open(sql, [fullTableName], false);

        const columns = result.rows.map((row, index) => ({
            name: row.COLUMN_NAME,
            type: row.DATA_TYPE.includes('NUMBER') ? 'number' :
                row.DATA_TYPE.includes('DATE') ? 'date' : 'text',
            maxLength: row.DATA_TYPE.includes('CHAR') || row.DATA_TYPE.includes('VARCHAR2') ? row.DATA_LENGTH : null,
            isPrimaryKey: index === 0 && row.COLUMN_NAME !== 'RUT_USUARIO',
        }));

        console.log(`Columnas de la tabla ${table}:`, columns);
        res.status(200).json(columns);
    } catch (err) {
        console.error('Error al obtener columnas:', err);
        res.status(500).json({ error: 'No se pudieron obtener las columnas de la tabla.' });
    }
});

// Sugerencias basadas en búsqueda
router.get(`${PREFIX}/:table/suggestions`, async (req, res) => {
    const { table } = req.params;
    const { query } = req.query;

    const fullTableName = `SA_JS_JO_NR_${table.toUpperCase()}`;

    try {
        const columnQuery = `
            SELECT COLUMN_NAME
            FROM USER_TAB_COLUMNS
            WHERE TABLE_NAME = :tableName
            ORDER BY COLUMN_ID
        `;
        const columnResult = await BD.Open(columnQuery, { tableName: fullTableName }, false);
        const columns = columnResult.rows.map(row => row.COLUMN_NAME);

        if (columns.length < 2) {
            return res.status(400).json({ error: `La tabla ${fullTableName} no tiene suficientes columnas para realizar la búsqueda.` });
        }

        const pkColumn = columns[0];
        const searchableColumn = columns[1];

        const suggestionQuery = `
            SELECT ${pkColumn} AS pk, ${searchableColumn} AS nombre
            FROM ${fullTableName}
            WHERE LOWER(${searchableColumn}) LIKE :query OR TO_CHAR(${pkColumn}) LIKE :query
            FETCH NEXT 10 ROWS ONLY
        `;
        const suggestionBinds = { query: `%${query.toLowerCase()}%` };

        const suggestionResult = await BD.Open(suggestionQuery, suggestionBinds, false);

        const formattedResults = suggestionResult.rows.map(row => ({
            pk: row.PK,
            nombre: `${row.NOMBRE} (${row.PK})`,
        }));

        res.status(200).json(formattedResults);
    } catch (error) {
        console.error(`Error al buscar sugerencias en la tabla ${fullTableName}:`, error);
        res.status(500).json({ error: `Error al buscar sugerencias: ${error.message}` });
    }
});

router.get(`${PREFIX}/:table/:pk`, async (req, res) => {
    const { table, pk } = req.params;

    // Construir el nombre del procedimiento
    const procedure = `LEER_${table.toUpperCase()}`;
    const binds = { P_PK: parseInt(pk, 10) };

    // Validar que la PK sea un número válido
    if (isNaN(binds.P_PK)) {
        return res.status(400).json({ error: 'La clave primaria proporcionada no es válida.' });
    }

    try {
        console.log(`Llamando al procedimiento ${procedure} con PK: ${binds.P_PK}`);
        const result = await BD.OpenCursorProcedure(procedure, binds);

        if (result.length === 0) {
            return res.status(404).json(`{ error: No se encontraron registros para la clave primaria ${pk} }`);
        }

        res.status(200).json(result); // Devuelve los registros obtenidos
    } catch (error) {
        console.error(`Error al leer datos de la tabla ${table}:, error`);
        res.status(500).json(`{ error: Error al leer datos de la tabla ${table}: ${error.message} }`);
    }
});




router.get(`${PREFIX}/:table/data/:pk`, async (req, res) => {
    const { table, pk } = req.params;

    // Convertir la clave primaria a número
    const numericPk = Number(pk);
    if (Number.isNaN(numericPk)) {
        return res.status(400).json({ error: 'La clave primaria proporcionada no es válida.' });
    }

    // Agregar prefijo al nombre de la tabla
    const fullTableName = `SA_JS_JO_NR_${table.toUpperCase()}`;

    // Función para convertir una fecha ISO a formato DD-MM-YYYY
    const convertirFecha = (fechaISO) => {
        if (!fechaISO) return null;
        const fecha = new Date(fechaISO);
        const day = String(fecha.getDate()).padStart(2, '0');
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const year = fecha.getFullYear();
        return `${day}-${month}-${year}`;
    };

    try {
        // Identificar la columna PK dinámica
        const pkQuery = `
            SELECT COLUMN_NAME
            FROM USER_CONS_COLUMNS
            WHERE TABLE_NAME = :tableName
              AND POSITION = 1
        `;
        const pkResult = await BD.Open(pkQuery, [fullTableName], false);

        if (pkResult.rows.length === 0) {
            return res.status(400).json({ error: 'No se pudo determinar la clave primaria de la tabla.' });
        }

        const pkColumn = pkResult.rows[0].COLUMN_NAME; // Nombre de la PK

        console.log(`Clave primaria identificada: ${pkColumn}`);

        // Consulta para obtener los datos de la fila
        const sql = `
            SELECT *
            FROM ${fullTableName}
            WHERE ${pkColumn} = :pk
        `;
        const result = await BD.Open(sql, [numericPk], false);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron registros para el criterio proporcionado.' });
        }

        const row = result.rows[0];

        // Consulta para obtener detalles de las columnas (DATA_TYPE y DATA_LENGTH)
        const columnsQuery = `
            SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH
            FROM USER_TAB_COLUMNS
            WHERE TABLE_NAME = :tableName
        `;
        const columnsResult = await BD.Open(columnsQuery, [fullTableName], false);

        const columnDetails = columnsResult.rows.reduce((acc, col) => {
            acc[col.COLUMN_NAME] = {
                type: col.DATA_TYPE.includes('NUMBER') ? 'number' :
                      col.DATA_TYPE.includes('DATE') ? 'date' : 'text',
                maxLength: col.DATA_TYPE.includes('CHAR') || col.DATA_TYPE.includes('VARCHAR2') ? col.DATA_LENGTH : null,
            };
            return acc;
        }, {});

        console.log('Detalles de columnas:', columnDetails);

        // Formatear la respuesta para incluir detalles adicionales
        const formattedResult = Object.entries(row).map(([key, value]) => ({
            columnName: key,
            value: key.toLowerCase().includes('fecha') && value ? convertirFecha(value) : value,
            editable: key !== pkColumn,
            type: columnDetails[key]?.type || 'text',
            maxLength: columnDetails[key]?.maxLength || null,
        }));

        return res.status(200).json({ pkColumn, data: formattedResult });
    } catch (error) {
        console.error('Error ejecutando la consulta:', error);
        res.status(500).json({ error: 'Error ejecutando consulta.' });
    }
});


module.exports = router;