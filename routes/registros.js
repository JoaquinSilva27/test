const { Router } = require('express');
const router = Router();
const BD = require('../config/configbd');

// CREATE: Llama a `INSERT_TABLA`
router.post('/:table', async (req, res) => {
    const { table } = req.params;
    const data = req.body;

    console.log(`Datos recibidos para la tabla ${table}:`, data); // Log para verificar los datos

    const procedure = `AGREGAR_${table.toUpperCase()}`;
    const binds = { ...data };
    console.log(`Llamando al procedimiento ${procedure} con parámetros:`, binds); // Depuración
    try {
        await BD.OpenProcedure(procedure, binds, true);
        res.status(201).json({ message: `Agregado exitosamente` });
    } catch (error) {
        console.error(`Error al agregar ${table}:`, error);
        res.status(500).json({ error: `Error al agregar ${table}: ${error.message}` });
    }
});


// UPDATE: Llama a `UPDATE_TABLA`
router.put('/:table', async (req, res) => {
    const { table } = req.params;
    const data = req.body;

    // Obtener la clave primaria y los datos del cuerpo de la solicitud
    const { pk, ...rest } = data;

    if (!pk) {
        return res.status(400).json({ error: 'La clave primaria es obligatoria para actualizar el registro.' });
    }

    // Construir el nombre del procedimiento
    const procedure = `ACTUALIZAR_${table.toUpperCase()}`;

    // Agregar la PK y los demás datos como binds
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
router.delete('/:table/:id', async (req, res) => {
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
router.get('/columns/:table', async (req, res) => {
    const { table } = req.params;
    // Agrega el prefijo al nombre de la tabla
    const fullTableName = `SA_JS_JO_NR_${table.toUpperCase()}`;
    const sql = `
        SELECT COLUMN_NAME, DATA_TYPE, COLUMN_ID
        FROM USER_TAB_COLUMNS
        WHERE TABLE_NAME = :tableName
        ORDER BY COLUMN_ID
    `;

    try {
        const result = await BD.Open(sql, [fullTableName], false);
        // Mapea las columnas y marca si es la primera fila (y no es RUT)
        const columns = result.rows.map((row, index) => ({
            name: row.COLUMN_NAME,
            type: row.DATA_TYPE.includes('NUMBER') ? 'number' : 'text',
            isPrimaryKey: index === 0 && row.COLUMN_NAME !== 'RUT_USUARIO', // La primera fila es PK, excepto si es RUT
        }));

        console.log(`Columnas de la tabla ${table}:`, columns);
        res.status(200).json(columns);
    } catch (err) {
        console.error('Error al obtener columnas:', err);
        res.status(500).json({ error: 'No se pudieron obtener las columnas de la tabla.' });
    }
});

router.get('/:table/suggestions', async (req, res) => {
    const { table } = req.params;
    const { query } = req.query;

    // Nombre completo de la tabla con prefijo
    const fullTableName = `SA_JS_JO_NR_${table.toUpperCase()}`;

    try {
        // Obtener columnas específicas de la tabla seleccionada
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

        // Usar la primera columna como PK y la segunda como nombre
        const pkColumn = columns[0];
        const searchableColumn = columns[1];

        console.log(`Tabla: ${fullTableName}, PK Column: ${pkColumn}, Searchable Column: ${searchableColumn}`);

        // Consulta de sugerencias
        const suggestionQuery = `
            SELECT ${pkColumn} AS pk, ${searchableColumn} AS nombre
            FROM ${fullTableName}
            WHERE LOWER(${searchableColumn}) LIKE :query OR TO_CHAR(${pkColumn}) LIKE :query
            FETCH NEXT 10 ROWS ONLY
        `;
        const suggestionBinds = { query: `%${query.toLowerCase()}%` };

        const suggestionResult = await BD.Open(suggestionQuery, suggestionBinds, false);

        // Formatear las sugerencias
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


router.get('/:table/:pk', async (req, res) => {
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
            return res.status(404).json({ error: `No se encontraron registros para la clave primaria ${pk}` });
        }

        res.status(200).json(result); // Devuelve los registros obtenidos
    } catch (error) {
        console.error(`Error al leer datos de la tabla ${table}:`, error);
        res.status(500).json({ error: `Error al leer datos de la tabla ${table}: ${error.message}` });
    }
});




router.get('/:table/data/:pk', async (req, res) => {
    const { table, pk } = req.params;

    // Convertir la clave primaria a número
    const numericPk = Number(pk);
    if (Number.isNaN(numericPk)) {
        return res.status(400).json({ error: 'La clave primaria proporcionada no es válida.' });
    }

    // Agregar prefijo al nombre de la tabla
    const fullTableName = `SA_JS_JO_NR_${table.toUpperCase()}`;

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

        // Construir consulta para obtener todos los datos incluyendo la PK
        const sql = `
            SELECT *
            FROM ${fullTableName}
            WHERE ${pkColumn} = :pk
        `;
        const result = await BD.Open(sql, [numericPk], false);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron registros para el criterio proporcionado.' });
        }

        // Devuelve los datos completos incluyendo la PK
        const row = result.rows[0];

        console.log('Resultado de la consulta (con PK):', row);

        // Adjunta información adicional para el frontend (ejemplo: marcar PK como no editable)
        const formattedResult = Object.entries(row).map(([key, value]) => ({
            columnName: key,
            value: value,
            editable: key !== pkColumn, // La PK no es editable
        }));

        return res.status(200).json({ pkColumn, data: formattedResult });
    } catch (error) {
        console.error('Error ejecutando la consulta:', error);
        res.status(500).json({ error: 'Error ejecutando consulta.' });
    }
});



module.exports = router;