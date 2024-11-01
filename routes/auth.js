// routes/auth.js
const express = require("express");
const router = express.Router();

// Datos del usuario de prueba (simulación para pruebas)
const testUser = {
  rut: "test", // rut de prueba
  password: "test", // contraseña de prueba
};

// Ruta para procesar el inicio de sesión
router.post("/login", (req, res) => {
  const { rut, password } = req.body;

  // Validación contra el usuario de prueba
  if (rut === testUser.rut && password === testUser.password) {
    res.json({ success: true, message: "Inicio de sesión exitoso owo" });
  } else {
    res.json({ success: false, message: "Rut o contraseña incorrectos" });
  }
});

module.exports = router;
