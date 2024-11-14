// app.js
const express = require("express");
const session = require("express-session");

const path = require("path");
const app = express();

// Importar rutas
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
// Agrega otras rutas si es necesario


// Configuración del middleware de sesión
app.use(session({
    secret: "tu_secreto_seguro", // Usa una clave segura; en producción, configúrala en variables de entorno.
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // Expira en 15 segundos
  }));


// Middleware para parsear JSON y datos de formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes); // Usa las rutas de admin

// Ruta por defecto para la página de inicio
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


const PORT = process.env.PORT || 3000;
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});