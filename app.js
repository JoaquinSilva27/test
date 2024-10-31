const express = require('express');
const path = require('path');
const app = express();
const authRoutes = require('./routes/auth');

const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página de inicio de sesión
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rutas de autenticación
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/login`);
});