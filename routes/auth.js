const express = require("express");
const router = express.Router();
const { Open } = require("../config/configbd");


// Datos de usuarios de prueba
const users = [
  { rut: "admin", password: "admin", rol: "admin" },
  { rut: "user", password: "user", rol: "user" }
];

const deudaCache = {}

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
  console.log("Estado actual del cache:", deudaCache);
  try {
      let deudaConInteres;
      const hoy = new Date().toISOString().split("T")[0]; // Fecha actual sin la hora

      // Verificar si la deuda está en el cache y si fue actualizada hoy
      if (deudaCache[rut] && deudaCache[rut].ultimaActualizacion === hoy) {
          console.log(`Deuda para el RUT ${rut} obtenida desde el cache.`);
          deudaConInteres = deudaCache[rut].deudaConInteres;
      } else {
          console.log(`Consulta a la base de datos para calcular deuda para el RUT ${rut}.`);

          // Paso 1: Obtener el código de cuota asociado al usuario
          const obtenerCuotaQuery = `
              SELECT COD_CUOTA 
              FROM SA_JS_JO_NR_USUARIOS 
              WHERE RUT_USUARIO = :rut
          `;
          const cuotaResult = await Open(obtenerCuotaQuery, { rut });

          if (cuotaResult.rows.length === 0) {
              return res.status(404).json({ success: false, message: "No se encontraron cuotas pendientes para este usuario." });
          }

          const codCuota = cuotaResult.rows[0].COD_CUOTA;

          // Paso 2: Calcular la deuda con interés
          const calcularInteresQuery = `
              SELECT TRUNC(calcular_total_con_interes(:codCuota, :rut), 0) AS deudaConInteres 
              FROM DUAL
          `;
          const bindsInteres = {
              codCuota: codCuota,
              rut: rut
          };

          const interesResult = await Open(calcularInteresQuery, bindsInteres);
          deudaConInteres = interesResult.rows[0].DEUDACONINTERES;

          console.log("Deuda con interés calculada:", deudaConInteres);

          // Actualizar la deuda en la base de datos
          const actualizarDeudaQuery = `
              UPDATE SA_JS_JO_NR_USUARIOS
              SET DEUDA = :deudaConInteres
              WHERE RUT_USUARIO = :rut
          `;
          const resultado = await Open(actualizarDeudaQuery, { deudaConInteres, rut });
          console.log("Resultado de la actualización:", resultado);

          // Almacenar la deuda calculada y la fecha de actualización en el cache
          deudaCache[rut] = {
              deudaConInteres,
              ultimaActualizacion: hoy
          };
      }

      // Paso 3: Obtener los datos del perfil del usuario
      const perfilQuery = `
          SELECT 
              U.NOMBRE_USUARIO || ' ' || U.APELLIDO1_USUARIO || ' ' || U.APELLIDO2_USUARIO AS NOMBRE_COMPLETO,
              COALESCE(C.NOMBRE_CANAL, 'No asociado') AS NOMBRE_CANAL,
              COALESCE(D.NOMBRE_DIRECTIVA, 'No asociado') AS NOMBRE_DIRECTIVA,
              CM.NOMBRE_COMUNA,
              R.NOMBRE_REGION,
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
      const perfilResult = await Open(perfilQuery, { rut });

      if (perfilResult.rows.length === 0) {
          return res.status(404).json({ success: false, message: "Usuario no encontrado." });
      }

      const profile = perfilResult.rows.map(row => ({
          nombreCompleto: row["NOMBRE_COMPLETO"],
          canal: row["NOMBRE_CANAL"],
          directiva: row["NOMBRE_DIRECTIVA"],
          comuna: row["NOMBRE_COMUNA"],
          region: row["NOMBRE_REGION"],
          correo: row["CORREO"],
          telefono: row["TELEFONO"],
          deuda: deudaConInteres // Usar la deuda con interés calculada o almacenada
      }))[0];

      console.log("Perfil del usuario:", profile);
      res.status(200).json({ success: true, profile });

  } catch (error) {
      console.error("Error al obtener el perfil:", error);
      return res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
});

router.post("/pay", async (req, res) => {
  const { rut, cantidad } = req.body;

  if (!rut || !cantidad) {
      return res.status(400).json({ success: false, message: "RUT y cantidad son obligatorios." });
  }

  try {
      // Paso 1: Procesar el pago llamando al procedimiento almacenado PAGAR
      const pagarQuery = `
          BEGIN
              PAGAR(:rut, :cantidad);
          END;
      `;
      const bindsPago = { rut, cantidad };

      await Open(pagarQuery, bindsPago);

      // Paso 2: Actualizar el cache
      const hoy = new Date().toISOString().split("T")[0]; // Fecha actual sin la hora

      if (deudaCache[rut] && deudaCache[rut].ultimaActualizacion === hoy) {
          // Si ya hay un cache para el día actual, actualiza la deuda
          const nuevaDeuda = deudaCache[rut].deudaConInteres - cantidad;

          // Asegúrate de que la deuda no sea negativa
          deudaCache[rut] = {
              deudaConInteres: nuevaDeuda > 0 ? nuevaDeuda : 0,
              ultimaActualizacion: hoy
          };

          console.log(`Cache actualizado para el RUT ${rut}:`, deudaCache[rut]);
      } else {
          // Si no hay cache, simplemente elimínalo (opcional)
          delete deudaCache[rut];
          console.log(`Cache eliminado para el RUT ${rut}.`);
      }

      res.status(200).json({
          success: true,
          message: "Pago exitoso."
      });
  } catch (error) {
      console.error("Error al realizar el pago:", error);

      if (error.errorNum === 20020) {
          res.status(400).json({ success: false, message: "El monto excede la deuda actual." });
      } else if (error.errorNum === 20021) {
          res.status(404).json({ success: false, message: "Usuario no encontrado." });
      } else if (error.errorNum === 20023) {
          res.status(400).json({ success: false, message: "La cantidad debe ser positiva." });
      } else {
          res.status(500).json({ success: false, message: "Error al procesar el pago." });
      }
  }
});

// Ruta para obtener el historial de pagos de un usuario
router.get("/payment-history/:rut", async (req, res) => {
  const { rut } = req.params;

  if (!rut) {
    return res.status(400).json({ success: false, message: "RUT es obligatorio." });
  }

  try {
    const query = `
      SELECT 
        COD_HISTORIAL_PAGO,
        TO_CHAR(FECHA_PAGO, 'DD/MM/YYYY') AS FECHA_PAGO,
        PAGO
      FROM SA_JS_JO_NR_HISTORIAL_PAGOS
      WHERE RUT_USUARIO = :rut
      ORDER BY FECHA_PAGO DESC
    `;

    const result = await Open(query, { rut });

    if (!result || !result.rows || result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No hay historial de pagos disponible para este usuario." });
    }

    const history = result.rows.map((row) => ({
      id: row["COD_HISTORIAL_PAGO"],
      fecha: row["FECHA_PAGO"],
      monto: row["PAGO"],
    }));

    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error("Error al obtener el historial de pagos:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor. Verifica los logs para más detalles." });
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



// Endpoint para ver el estado del cache
router.get("/cache/deuda", (req, res) => {
  res.status(200).json({
      success: true,
      cache: deudaCache,
  });
});

// Endpoint para eliminar el cache de un usuario específico
router.delete("/cache/deuda/:rut", (req, res) => {
  const { rut } = req.params;

  if (!deudaCache[rut]) {
      return res.status(404).json({
          success: false,
          message: `No se encontró cache para el RUT ${rut}.`,
      });
  }

  delete deudaCache[rut];
  res.status(200).json({
      success: true,
      message: `Cache eliminado para el RUT ${rut}.`,
  });
});

// Endpoint para eliminar todo el cache
router.delete("/cache/deuda", (req, res) => {
  for (const key in deudaCache) {
      delete deudaCache[key];
  }

  res.status(200).json({
      success: true,
      message: "Cache de todas las deudas eliminado.",
  });
});

module.exports = router;
