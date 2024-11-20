const { Router } = require('express');
const router = Router();
const BD = require('../config/configbd');

// Endpoint para obtener las entidades de la base de datos
router.get('/getEntities', async (req, res) => {
    const sql = `
        SELECT table_name 
        FROM user_tables 
        WHERE table_name NOT LIKE 'BIN$%' -- Excluir tablas recicladas
        ORDER BY table_name
    `;

    try {
        const result = await BD.Open(sql, [], false);
        const entities = result.rows.map(row => row[0]); // Mapeo de los nombres de tablas
        res.status(200).json(entities); // Retorna las entidades como JSON
    } catch (error) {
        console.error('Error al obtener entidades:', error);
        res.status(500).json({ error: "Error al obtener entidades." });
    }
});

module.exports = router;

