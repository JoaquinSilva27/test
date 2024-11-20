const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");
const { testConnection } = require("./config/configbd");

const dotenv = require("dotenv");
dotenv.config(); // Carga las variables de entorno

// Importar rutas
const crudRoutes = require('./routes/registros');
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const entitiesRoutes = require('./routes/entities'); // Nueva ruta para las entidades

// Crear la aplicación Express
const app = express();

// Verifica la conexión con la base de datos al iniciar el servidor
(async () => {
    const connected = await testConnection();
    if (!connected) {
        console.error("No se pudo establecer la conexión con la base de datos. Verifica tus credenciales.");
        process.exit(1); // Finaliza el servidor si no hay conexión
    }
})();



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

// Registrar rutas
app.use('/api', crudRoutes); // Operaciones CRUD generales
app.use("/auth", authRoutes); // Autenticación
app.use("/admin", adminRoutes); // Administración
app.use("/api/entities", entitiesRoutes); // Nueva ruta para las entidades

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
