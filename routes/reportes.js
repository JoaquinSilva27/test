const { Router } = require('express');
const router = Router();
const BD = require('../config/configbd');

// READ: Obtener registros de una tabla específica
router.get('/:table', async (req, res) => {
    const { table } = req.params;
    const sql = `SELECT * FROM ${table}`;
    try {
        const result = await BD.Open(sql, [], false);
        const rows = result.rows.map(row => {
            return row.reduce((acc, value, index) => {
                acc[result.metaData[index].name.toLowerCase()] = value;
                return acc;
            }, {});
        });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los registros" });
    }
});

// CREATE: Agregar un nuevo registro
router.post('/:table', async (req, res) => {
    const { table } = req.params;
    const data = req.body;

    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data).map(col => `:${col}`).join(", ");
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

    try {
        await BD.Open(sql, Object.values(data), true);
        res.status(201).json({ message: "Registro agregado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el registro" });
    }
});

// UPDATE: Actualizar un registro existente
router.put('/:table', async (req, res) => {
    const { table } = req.params;
    const { id, ...data } = req.body;

    const updates = Object.keys(data).map(col => `${col} = :${col}`).join(", ");
    const sql = `UPDATE ${table} SET ${updates} WHERE id = :id`;

    try {
        await BD.Open(sql, [...Object.values(data), id], true);
        res.json({ message: "Registro actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el registro" });
    }
});

// DELETE: Eliminar un registro por su clave primaria
router.delete('/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const sql = `DELETE FROM ${table} WHERE id = :id`;

    try {
        await BD.Open(sql, [id], true);
        res.json({ message: "Registro eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el registro" });
    }
});

module.exports = router;