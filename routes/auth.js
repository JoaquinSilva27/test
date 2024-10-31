const express = require('express');
const router = express.Router();

// Usuario de prueba (rut y contraseña hardcoded)
const testUser = {
    rut: "test",       // Cambia esto al RUT que quieras para pruebas
    password: "test"    // Cambia esto a la contraseña que prefieras
};

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
    const { rut, password } = req.body;

    // Validación contra el usuario de prueba
    if (rut === testUser.rut && password === testUser.password) {
        console.log("rut:", rut, "rut ingresado:", testUser.rut);
        console.log("clave:", password, "pass ingresada:", testUser.password);
        res.json({ success: true, message: "Inicio de sesión exitoso" });
    } else {
        console.log("rut:", rut, "rut ingresado:", testUser.rut);
        console.log("clave:", password, "pass ingresada:", testUser.password);
        res.json({ success: false, message: "Rut o contraseña incorrectos" });
    }
});

module.exports = router;