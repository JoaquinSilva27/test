// configdb.js
const oracledb = require('oracledb');
require("dotenv").config();

const cns = {
    user: process.env.DB_USER || "system",
    password: process.env.DB_PASSWORD || "admin",
    connectString: process.env.DB_CONNECTION || "DESKTOP-R34HRSG/XEPDB1"
};

// Configuración del formato de salida
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Función para abrir una conexión y ejecutar SQL
async function Open(sql, binds = {}, autoCommit = false) {
    let cnn;
    try {
        cnn = await oracledb.getConnection(cns);
        const result = await cnn.execute(sql, binds, { autoCommit });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("Error ejecutando consulta");
    } finally {
        if (cnn) await cnn.close();
    }
}

// Prueba de conexión
async function testConnection() {
    let connection;
    try {
        connection = await oracledb.getConnection(cns);
        console.log("Conexión exitosa a la base de datos.");
    } catch (err) {
        console.error("Error al conectar con la base de datos:", err.message);
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = {
    Open,
    testConnection
};
