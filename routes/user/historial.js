//ESTO ES DEL HISTORIAL DE PAGOS DEL USUARIO
const express = require("express");
const router = express.Router();
const { Open, testConnection } = require("../../config/configbd");


// Ruta para obtener el historial de pagos
router.post("/historial-pagos", async (req, res) => {
    const { mes, anio } = req.body; // Mes y año recibidos desde el frontend

    try {
        const sql = `
            SELECT *
            FROM pagos
            WHERE EXTRACT(MONTH FROM fecha_pago) = :mes
              AND EXTRACT(YEAR FROM fecha_pago) = :anio
        `;
        const result = await Open(sql, [mes, anio]);

        res.json({ success: true, data: result.rows }); // Devuelve los resultados al cliente
    } catch (err) {
        console.error("Error al consultar historial de pagos:", err);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

module.exports = router;