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
    // Guardar en la sesión
    req.session.user = { rut: localUser.rut, rol: localUser.rol };
    console.log("Sesión iniciada:", req.session.user);  // Verifica que la sesión está activa

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
      SELECT PRIVILEGIOS, CONTRASEÑA
      FROM SA_JS_JO_NR_CUENTAS
      WHERE NOMBRE_USUARIO = :rut
    `;
    const result = await Open(query, { rut });

    console.log("Resultados de la consulta:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado en la base de datos." });
    }

    // Obtener los datos del usuario
    const user = result.rows[0];
    const rol = user["PRIVILEGIOS"]?.trim().toLowerCase();
    const storedPassword = user["CONTRASEÑA"]?.trim();


    console.log("Rol recuperado:", rol);
    console.log("Contraseña recuperada:", storedPassword);

    // Validar la contraseña
    if (storedPassword !== password.trim()) {
      return res.status(401).json({ success: false, message: "Contraseña incorrecta." });
    }

    // Validar el rol
    if (rol === "admin" || rol === "user") {
      // Guardar en la sesión
      req.session.user = { rut, rol };
  
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

router.get("/profile/:rut", async (req, res) => {
  const { rut } = req.params;
  if (!rut) {
    return res.status(400).json({ success: false, message: "RUT es obligatorio." });
  }
  try {
    // Consulta SQL para obtener los datos del perfil del usuario
    const query = `
      SELECT 
        U.NOMBRE_USUARIO || ' ' || U.APELLIDO1_USUARIO || ' ' || U.APELLIDO2_USUARIO AS NOMBRE_COMPLETO,
        COALESCE(C.NOMBRE_CANAL, 'No asociado') AS NOMBRE_CANAL,
        COALESCE(D.NOMBRE_DIRECTIVA, 'No asociado') AS NOMBRE_DIRECTIVA,
        CM.NOMBRE_COMUNA,
        R.NOMBRE_REGION,
        U.ROL AS ROL,
        U.CORREO_USUARIO AS CORREO,
        TO_CHAR(U.TELEFONO_USUARIO) AS TELEFONO
      FROM 
        SA_JS_JO_NR_USUARIOS U
        LEFT JOIN SA_JS_JO_NR_CANALES C ON U.COD_REGION = C.COD_CANAL
        LEFT JOIN SA_JS_JO_NR_DIRECTIVAS D ON C.COD_CANAL = D.COD_CANAL
        LEFT JOIN SA_JS_JO_NR_COMUNAS CM ON U.COD_REGION = CM.COD_REGION
        LEFT JOIN SA_JS_JO_NR_REGIONES R ON CM.COD_REGION = R.COD_REGION
      WHERE U.RUT_USUARIO = :rut
    `;
    const result = await Open(query, { rut });
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }
    // Mapeamos los resultados a un objeto
    const profile = result.rows.map(row => ({
      nombreCompleto: row["NOMBRE_COMPLETO"],
      canal: row["NOMBRE_CANAL"],
      directiva: row["NOMBRE_DIRECTIVA"],
      comuna: row["NOMBRE_COMUNA"],
      region: row["NOMBRE_REGION"],
      rol: row["ROL"],                    // Añadir el rol
      correo: row["CORREO"],      // Añadir el correo
      telefono: row["TELEFONO"],  // Añadir el teléfono
    }))[0]; // Solo obtenemos el primer resultado
    

    console.log("Perfil del usuario:", profile);
    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
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

router.get("/session", (req, res) => {
  if (req.session?.user) {
      res.json({ success: true, user: req.session.user });
  } else {
      res.json({ success: false, message: "Sesión no activa" });
  }
});


module.exports = router;
