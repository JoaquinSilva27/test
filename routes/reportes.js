const { Router } = require('express');
const router = Router();
const BD = require('../config/configbd');
const oracledb = require('oracledb');

// Informe de ingresos desde X fecha hasta Y fecha
router.get('/ingresos', async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;


    console.log(`Fechas recibidas en el servidor: inicio=${fechaInicio}, fin=${fechaFin}`);
    // Validar que las fechas sean proporcionadas
    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Debe proporcionar las fechas de inicio y fin.' });
    }

    console.log(`Fechas convertidas: inicio=${convertirFechaDDMMYY(fechaInicio)}, fin=${convertirFechaDDMMYY(fechaFin)}`);
    try {
        // Formato de fechas para Oracle: DD-MM-YY
        const binds = {
            P_FECHA_INICIO: convertirFechaDDMMYY(fechaInicio),
            P_FECHA_FIN: convertirFechaDDMMYY(fechaFin),
            P_CURSOR: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        };

        const sql = `BEGIN INFORME_INGRESOS_FECHA(:P_FECHA_INICIO, :P_FECHA_FIN, :P_CURSOR); END;`;

        console.log("Llamando al procedimiento INFORME_INGRESOS_FECHA con binds:", binds);

        // Llamar a la función Open
        const rows = await BD.Open(sql, binds);

        // Enviar los resultados al cliente
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error al obtener informe de ingresos:", error);
        res.status(500).json({ error: 'Error al obtener informe de ingresos.' });
    }
});


// Informe de deuda total por canal
router.get('/deuda-canal', async (req, res) => {
    console.log(">> Endpoint /deuda-canal invocado"); // Verificar si el endpoint es alcanzado
    try {
        console.log("Llamando al procedimiento INFORME_DEUDA_CANAL...");

        // Llama al procedimiento y obtiene los datos
        const result = await BD.OpenSimpleCursorProcedure('INFORME_DEUDA_CANAL', {});

        console.log("Resultado del procedimiento:", result);

        if (!result || result.length === 0) {
            console.log(">> No se encontraron resultados.");
            return res.status(404).json({ error: "No se encontraron datos de deuda por canal." });
        }

        console.log(">> Enviando respuesta exitosa.");
        res.status(200).json(result);
    } catch (error) {
        console.error(">> Error en el endpoint /deuda-canal:", error);
        res.status(500).json({ error: "Error al obtener el informe de deuda por canal." });
    }
});


// Informe de proyectos activos y terminados
router.get('/proyectos', async (req, res) => {
    const { estado } = req.query;

    try {
        console.log('Llamando al procedimiento almacenado INFORME_PROYECTOS...');

        const { activos, terminados } = await BD.OpenDoubleCursorProcedure(
            'INFORME_PROYECTOS',
            {},
            'P_ACTIVOS',
            'P_TERMINADOS'
        );

        console.log("Proyectos Activos:", activos);
        console.log("Proyectos Terminados:", terminados);

        // Filtrar según el estado si se proporciona
        if (estado === 'activos') {
            return res.status(200).json({ activos });
        } else if (estado === 'terminados') {
            return res.status(200).json({ terminados });
        }

        res.status(200).json({ activos, terminados });
    } catch (error) {
        console.error('Error al obtener el informe de proyectos:', error);
        res.status(500).json({ error: 'Error al obtener el informe de proyectos.' });
    }
});

function convertirFechaDDMMYY(fechaISO) {
    const [year, month, day] = fechaISO.split("-");
    return `${day}-${month}-${year.slice(-2)}`; // DD-MM-YY
}



module.exports = router;
