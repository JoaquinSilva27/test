const { Router } = require('express');
const router = Router();
const BD = require('../config/configbd');

// Informe de ingresos desde X fecha hasta Y fecha
router.get('/ingresos', async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    // Validar que las fechas sean proporcionadas
    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Debe proporcionar las fechas de inicio y fin.' });
    }

    try {
        const binds = {
            P_FECHA_INICIO: new Date(fechaInicio),
            P_FECHA_FIN: new Date(fechaFin),
        };

        console.log(`Llamando al procedimiento INFORME_INGRESOS_FECHA con parámetros:`, binds);

        // Llama al procedimiento almacenado
        const result = await BD.OpenCursorProcedure('INFORME_INGRESOS_FECHA', binds);

        res.status(200).json(result); // Devuelve los resultados al cliente
    } catch (error) {
        console.error('Error al obtener informe de ingresos:', error);
        res.status(500).json({ error: 'Error al obtener informe de ingresos.' });
    }
});

// Informe de proyectos activos y terminados
router.get('/proyectos', async (req, res) => {
    try {
        console.log('Llamando al procedimiento INFORME_PROYECTOS');

        // Ejecutar el procedimiento almacenado con dos cursores de salida
        const activos = await BD.OpenCursorProcedure('INFORME_PROYECTOS', {}, 'P_ACTIVOS');
        const terminados = await BD.OpenCursorProcedure('INFORME_PROYECTOS', {}, 'P_TERMINADOS');

        res.status(200).json({ activos, terminados }); // Devuelve ambos conjuntos de resultados
    } catch (error) {
        console.error('Error al obtener el informe de proyectos:', error);
        res.status(500).json({ error: 'Error al obtener el informe de proyectos.' });
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
module.exports = router;
