const oracledb = require('oracledb');
require("dotenv").config(); // Carga las variables del archivo .env

const cns = {
    user: process.env.DB_USER || "system",
    password: process.env.DB_PASSWORD || "basededatos",
    connectString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=xe)))",
};

async function OpenProcedure(procedure, binds, autoCommit = false) {
    let cnn;
    try {
        cnn = await oracledb.getConnection(cns);
        const sql = `BEGIN ${procedure}(:OUT_RESULT); END;`;

        const result = await cnn.execute(sql, binds, { autoCommit });
        return result.outBinds.OUT_RESULT;
    } catch (err) {
        console.error(err);
        throw new Error("Error ejecutando procedimiento");
    } finally {
        if (cnn) await cnn.close();
    }
}

async function OpenCursorProcedure(procedure, binds) {
    let cnn;
    try {
        cnn = await oracledb.getConnection(cns);
        const sql = `BEGIN ${procedure}(:P_CURSOR); END;`;
        const options = { P_CURSOR: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }, ...binds };

        const result = await cnn.execute(sql, options);
        const cursor = result.outBinds.P_CURSOR;

        const rows = [];
        let row;
        while ((row = await cursor.getRow())) {
            rows.push(row);
        }
        await cursor.close();

        return rows;
    } catch (err) {
        console.error(err);
        throw new Error("Error ejecutando procedimiento con cursor");
    } finally {
        if (cnn) await cnn.close();
    }
}

async function testConnection() {
    try {
        const connection = await oracledb.getConnection(cns);
        console.log("Conexión exitosa a la base de datos.");
        await connection.close();
        return true;
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error.message);
        return false;
    }
}

module.exports = {
    Open: async (sql, binds, autoCommit) => {
        let cnn = await oracledb.getConnection(cns);
        let result = await cnn.execute(sql, binds, { autoCommit });
        cnn.release();
        return result;
    },
    testConnection
};