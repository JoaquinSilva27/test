// routes/auth.js
const express = require("express");
const router = express.Router();

// Datos de usuarios de prueba
const users = [
  { rut: "admin", password: "admin", rol: "admin" },
  { rut: "user", password: "user", rol: "user" }
];

// Ruta para procesar el inicio de sesión
router.post("/login", (req, res) => {
  const { rut, password } = req.body;

  // Validación contra la lista de usuarios
  const user = users.find(user => user.rut === rut && user.password === password);

  if (user) {
    res.json({ success: true, message: "Inicio de sesión exitoso owo", rol: user.rol });
  } else {
    res.json({ success: false, message: "Rut o contraseña incorrectos" });
  }
});

module.exports = router;