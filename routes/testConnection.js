const express = require("express");
const oracledb = require("oracledb");
const router = express.Router();
const dbConfig = require("../config/configbd");

// Ruta para probar la conexión
router.get("/test", async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);

    // Ejemplo de una consulta básica para verificar la conexión
    const result = await connection.execute("SELECT * FROM dual");

    console.log("Resultado de la prueba de conexión:", result.rows);

    // Cierra la conexión después de la consulta
    await connection.close();

    // Responde con éxito si la conexión y consulta funcionan
    res.status(200).json({
      message: "Conexión exitosa y consulta ejecutada.",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error al conectarse a la base de datos:", err);

    // Responde con un error si algo falla
    res.status(500).json({
      message: "Error al conectarse a la base de datos",
      error: err.message,
    });
  }
});

module.exports = router;