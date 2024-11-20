const { Router } = require('express');
const router = Router();
const oracledb = require('oracledb');
const dbConfig = require('../config/configbd'); // Asegúrate de que apunta al archivo de configuración

router.get('/test', async (req, res) => {
    try {
        // Conexión a la base de datos
        const connection = await oracledb.getConnection(dbConfig);

        // Realizar una consulta básica (por ejemplo, mostrar las tablas creadas por el usuario)
        const result = await connection.execute(
            `SELECT table_name FROM user_tables WHERE table_name LIKE 'SA_JS_JO_NR%'`
        );

        // Liberar conexión
        await connection.close();

        // Devolver los resultados al cliente
        res.json(result.rows); // Enviar solo las filas como respuesta
    } catch (err) {
        console.error('Error al conectarse a la base de datos:', err);
        res.status(500).json({ error: 'Error al conectarse a la base de datos' });
    }
});

module.exports = router;