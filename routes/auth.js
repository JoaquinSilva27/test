const express = require("express");
const router = express.Router();
const { Open } = require("../config/configbd");

// Datos de usuarios de prueba
const users = [
  { rut: "admin", password: "admin", rol: "admin" },
  { rut: "user", password: "user", rol: "user" }
];

// Función de autenticación local
function authenticateUser(rut, password) {
  return users.find(user => user.rut === rut && user.password === password);
}

// Ruta para procesar el inicio de sesión
router.post("/login", async (req, res) => {
  const { rut, password } = req.body;

  if (!rut || !password) {
    return res.status(400).json({ success: false, message: "Rut y contraseña son obligatorios." });
  }

  // Verificar en los datos locales
  const localUser = authenticateUser(rut, password);
  if (localUser) {
    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso.",
      data: {
        rut: localUser.rut,
        rol: localUser.rol
      }
    });
  }

  try {
    // Consulta a la base de datos
    const query = `
      SELECT ROL_CUENTA, CONTRASEÑA_CUENTA
      FROM SA_JS_JO_NR_CUENTAS
      WHERE RUT_CUENTA = :rut
    `;
    const result = await Open(query, { rut });

    console.log("Resultados de la consulta:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado en la base de datos." });
    }

    // Obtener los datos del usuario
    const user = result.rows[0];
    const rol = user["ROL_CUENTA"]?.trim().toLowerCase(); // Normalizar rol
    const storedPassword = user["CONTRASEÑA_CUENTA"]?.trim(); // Limpiar espacios en la contraseña

    console.log("Rol recuperado:", rol);
    console.log("Contraseña recuperada:", storedPassword);

    // Validar la contraseña
    if (storedPassword !== password.trim()) {
      return res.status(401).json({ success: false, message: "Contraseña incorrecta." });
    }

    // Validar el rol
    if (rol === "admin" || rol === "user") {
      return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso.",
        data: { rut, rol }
      });
    } else {
      return res.status(400).json({ success: false, message: `Rol desconocido: ${rol}` });
    }

  } catch (error) {
    console.error("Error en inicio de sesión:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
});

// Ruta de logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error al cerrar sesión." });
    }
    res.json({ success: true, message: "Sesión cerrada exitosamente." });
  });
});

// Ruta para verificar si hay una sesión activa
router.get("/verify-session", (req, res) => {
  if (req.session?.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false });
  }
});

// Ruta para verificar el estado de la sesión
router.get("/check-session", (req, res) => {
  if (req.session?.user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "La sesión ha expirado." });
  }
});

module.exports = router;
