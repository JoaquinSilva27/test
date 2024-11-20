const { Router } = require('express');
const router = Router();
const BD = require('../config/configbd');

// Endpoint para obtener las entidades de la base de datos
router.get('/getEntities', async (req, res) => {
    try {
        const sql = `SELECT table_name FROM user_tables WHERE table_name LIKE SA_JS_JO_NR%;`;
        const result = await BD.Open(sql, [], false);

        console.log('Resultado de la consulta:', result.rows);

        if (result.rows.length === 0) {
            console.log('No se encontraron tablas con el prefijo especificado.');
        }

        const entities = result.rows.map(row => row[0]); // Extraer nombres de las tablas
        res.status(200).json(entities);
    } catch (err) {
        console.error('Error al obtener las tablas:', err);
        res.status(500).send('Error al obtener las entidades desde la base de datos');
    }
});

module.exports = router;

