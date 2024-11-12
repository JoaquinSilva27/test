// routes/auth.js
const express = require("express");
const router = express.Router();

// Datos de usuarios de prueba
const users = [
  { rut: "admin", password: "admin", rol: "admin" },
  { rut: "user", password: "user", rol: "user" }
];


// Función de autenticación
function authenticateUser(rut, password) {
  return users.find(user => user.rut === rut && user.password === password);
}

// Ruta para procesar el inicio de sesión
router.post("/login", (req, res) => {
  const { rut, password } = req.body;

  const user = authenticateUser(rut, password);
  // Validación contra la lista de usuarios
  if (user) {
    // Guardamos los datos del usuario en la sesión  
    req.session.user = { rut: user.rut, rol: user.rol };
    console.log("Usuario autenticado:", req.session.user);
    res.json({ success: true, message: "Inicio de sesión exitoso", rol: user.rol});
  } else {
    res.json({ success: false, message: "Rut o contraseña incorrectos" });
  }
});

// Ruta de logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error al cerrar sesión" });
    }
    res.json({ success: true, message: "Sesión cerrada exitosamente" });
  });
});


router.get("/verify-session", (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false });
  }
});


router.get("/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "La sesión ha expirado" });
  }
});

module.exports = router;