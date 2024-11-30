// routes/admin.js
const express = require("express");
const path = require("path");
const router = express.Router();


const { isAuthenticated, authorizeRoles } = require("../middleware/sessionMiddleware");


// Ruta protegida para el administrador
router.get("/mantenedor", isAuthenticated, authorizeRoles("admin"), (req, res) => {
    res.json({ success: true, message: "Acceso al mantenedor" });
  });

router.post("/crear", isAuthenticated, authorizeRoles("admin"), (req, res) => {
  res.json({ success: true, message: "Recurso creado por admin" });
});


module.exports = router;