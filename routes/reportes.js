
const express = require('express');
const router = express.Router();

// Ejemplo de una ruta simple
router.get('/', (req, res) => {
    res.send('Ruta de reportes');
});

module.exports = router;