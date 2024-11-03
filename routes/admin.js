// routes/admin.js
const express = require("express");
const path = require("path");
const router = express.Router();

// Ruta para servir admin.html
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin.html"));
});

// Agrega otras rutas si es necesario, por ejemplo, para visualizar CRUD o gestionar datos

module.exports = router;