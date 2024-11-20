const { Router } = require('express');
const router = Router();
const BD = require('../config/configbd');

// Endpoint para obtener las entidades de la base de datos
router.get('/getEntities', async (req, res) => {
    try {
        const sql = `SELECT table_name FROM user_tables WHERE table_name LIKE 'SA_JS_JO_NR%'`;
        const result = await BD.Open(sql, [], false);

        console.log('Datos obtenidos:', result.rows);

        // Extraer correctamente los nombres de las tablas
        const entities = result.rows.map(row => row.TABLE_NAME);

        res.status(200).json(entities); // Devolver la lista de nombres de tablas
    } catch (err) {
        console.error('Error al obtener las tablas:', err);
        res.status(500).send('Error al obtener las entidades desde la base de datos');
    }
});

module.exports = router;

