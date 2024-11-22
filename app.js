const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");
const { Open, testConnection } = require("./config/configbd"); // Asegúrate de que la ruta sea correcta




// Importar funciones y rutas
const crudRoutes = require('./routes/registros');
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const entitiesRoutes = require('./routes/entities'); // Nueva ruta para las entidades
const registrosRoutes = require('./routes/registros');
const reportesRoutes = require('./routes/reportes');

// Crear la aplicación Express
const app = express();

// Verificar conexión con la base de datos antes de iniciar el servidor


// Configuración del middleware de sesión
app.use(
    session({
        secret: process.env.SESSION_SECRET || "clave_super_segura",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 15 * 60 * 1000, // 15 minutos en milisegundos
            secure: false, // Cambiar a true si usas HTTPS
            httpOnly: true,
        },
    })
);

// Middlewares necesarios
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, "public")));


// Rutas de prueba
app.get("/test-db", async (req, res) => {
    try {
        await testConnection(); // Probar conexión
        res.json({ success: true, message: "Conexión exitosa" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/execute-query", async (req, res) => {
    const sql = "SELECT table_name FROM user_tables WHERE table_name LIKE 'SA_JS_JO_NR%'"; // Cambia a tu consulta
    try {
        const result = await Open(sql);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});



app.use("/auth", authRoutes); // Autenticación
app.use("/admin", adminRoutes); // Administración
app.use('/api', crudRoutes); // Rutas para CRUD (Registros)
app.use('/entities', entitiesRoutes); // Asegúrate de que esta línea esté en app.js
app.use('/api/tables', registrosRoutes); // Rutas para tablas con prefijo
app.use('/api/reportes', reportesRoutes); // Rutas específicas para reportes



// Ruta por defecto para la página de inicio
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error("Error en el servidor:", err);
    res.status(err.status || 500).json({ message: "Ocurrió un error en el servidor" });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
