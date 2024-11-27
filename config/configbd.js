// configdb.js
const oracledb = require("oracledb");
require("dotenv").config();

const cns = {
  user: process.env.DB_USER || "FRIKZ",
  password: process.env.DB_PASSWORD || "1234",
  connectString: process.env.DB_CONNECTION || "localhost/XE",
};

// Configuración del formato de salida
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Función para abrir una conexión y ejecutar SQL
async function Open(sql, binds = {}, autoCommit = true) {
  let cnn;
  try {
    cnn = await oracledb.getConnection(cns);
    const result = await cnn.execute(sql, binds, { autoCommit });

    // Si hay un cursor en los binds, procesarlo
    if (binds.P_CURSOR && binds.P_CURSOR.type === oracledb.CURSOR) {
      const cursor = result.outBinds.P_CURSOR;
      const rows = [];
      let row;

      while ((row = await cursor.getRow())) {
        rows.push(row);
      }
      await cursor.close(); // Asegúrate de cerrar el cursor
      return rows; // Devuelve las filas del cursor
    }
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Error ejecutando consulta");
  } finally {
    if (cnn) await cnn.close();
  }
}

// Función para ejecutar un procedimiento almacenado sin cursores
async function OpenProcedure(procedure, binds, autoCommit = false) {
  let connection;
  try {
    connection = await oracledb.getConnection(cns);

    // Genera dinámicamente los placeholders para los parámetros
    const placeholders = Object.keys(binds)
      .map((key) => `:${key}`)
      .join(", ");
    const sql = `BEGIN ${procedure}(${placeholders}); END;`;

    console.log("SQL generado:", sql); // Depuración
    console.log("Valores de binds:", binds); // Depuración

    const result = await connection.execute(sql, binds, { autoCommit });
    return result;
  } catch (err) {
    console.error("Error en OpenProcedure:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

async function OpenCursorProcedure(procedure, binds) {
  console.log("Llamando al procedimiento:", procedure);
  console.log("Binds proporcionados:", binds);
  let cnn;
  try {
    cnn = await oracledb.getConnection(cns);

    const sql = `BEGIN ${procedure}(:P_PK, :P_CURSOR); END;`;

    // Agregar el cursor como un parámetro de salida (BIND_OUT)
    const options = {
      ...binds,
      P_CURSOR: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }, // Configuración para P_CURSOR
    };

    console.log("SQL generado:", sql);
    console.log("Binds utilizados:", options);

    // Ejecutar el procedimiento almacenado
    const result = await cnn.execute(sql, options);

    // Leer los datos del cursor
    const cursor = result.outBinds.P_CURSOR;
    const rows = [];
    let row;

    while ((row = await cursor.getRow())) {
      console.log("Fila obtenida del cursor:", row);
      rows.push(row); // Agregar cada fila a la lista de resultados
    }

    await cursor.close(); // Asegúrate de cerrar el cursor
    return rows; // Devuelve las filas obtenidas
  } catch (err) {
    console.error("Error en OpenCursorProcedure:", err);
    throw err;
  } finally {
    if (cnn) await cnn.close();
  }
}

async function OpenSimpleCursorProcedure(procedure) {
  let cnn;
  try {
    cnn = await oracledb.getConnection(cns);

    const sql = `BEGIN ${procedure}(:P_CURSOR); END;`;

    const binds = {
      P_CURSOR: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }, // Solo el cursor
    };

    console.log("SQL generado:", sql); // Para depuración
    console.log("Binds utilizados:", binds); // Para depuración

    const result = await cnn.execute(sql, binds);

    // Procesar los datos del cursor
    const cursor = result.outBinds.P_CURSOR;
    const rows = [];
    let row;
    while ((row = await cursor.getRow())) {
      console.log("Fila obtenida del cursor:", row);
      rows.push(row);
    }
    await cursor.close();
    return rows; // Devuelve todas las filas del cursor
  } catch (err) {
    console.error("Error en OpenSimpleCursorProcedure:", err);
    throw err;
  } finally {
    if (cnn) await cnn.close();
  }
}

async function OpenDoubleCursorProcedure(procedure, binds, cursor1, cursor2) {
  console.log("Llamando al procedimiento:", procedure);
  console.log("Binds proporcionados:", binds);

  let cnn;
  try {
    cnn = await oracledb.getConnection(cns);

    const sql = `BEGIN ${procedure}(:${cursor1}, :${cursor2}); END;`;

    // Agregar los cursores como parámetros de salida
    const options = {
      ...binds,
      [cursor1]: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      [cursor2]: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    console.log("SQL generado:", sql);
    console.log("Binds utilizados:", options);

    // Ejecutar el procedimiento almacenado
    const result = await cnn.execute(sql, options);

    const convertirFecha = (fechaISO) => {
      if (!fechaISO) return null;
      const fecha = new Date(fechaISO);
      const day = String(fecha.getDate()).padStart(2, "0");
      const month = String(fecha.getMonth() + 1).padStart(2, "0");
      const year = fecha.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Procesar los datos del primer cursor
    const cursorActivos = result.outBinds[cursor1];
    const activos = [];
    let row;
    while ((row = await cursorActivos.getRow())) {
      activos.push({
        ...row,
        FECHA_INICIO_PROYECTO: convertirFecha(row.FECHA_INICIO_PROYECTO),
        FECHA_FIN_PROYECTO: convertirFecha(row.FECHA_FIN_PROYECTO),
      });
    }
    await cursorActivos.close();

    // Procesar los datos del segundo cursor
    const cursorTerminados = result.outBinds[cursor2];
    const terminados = [];
    while ((row = await cursorTerminados.getRow())) {
      terminados.push({
        ...row,
        FECHA_INICIO_PROYECTO: convertirFecha(row.FECHA_INICIO_PROYECTO),
        FECHA_FIN_PROYECTO: convertirFecha(row.FECHA_FIN_PROYECTO),
      });
    }
    await cursorTerminados.close();

    return { activos, terminados }; // Devuelve los dos conjuntos de datos
  } catch (err) {
    console.error("Error en OpenDoubleCursorProcedure:", err);
    throw err;
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
  testConnection,
  OpenProcedure,
  OpenCursorProcedure,
  OpenSimpleCursorProcedure,
  OpenDoubleCursorProcedure,
};
