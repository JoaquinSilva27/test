const { Router } = require('express');
const router = Router();
const BD = require('../config/configbd');

// CREATE: Llama a `INSERT_TABLA`
router.post('/:table', async (req, res) => {
    const { table } = req.params;
    const data = req.body;

    const procedure = `INSERT_${table.toUpperCase()}`;
    const binds = { ...data };

    try {
        await BD.OpenProcedure(procedure, binds, true);
        res.status(201).json({ message: `${table} agregado exitosamente` });
    } catch (error) {
        res.status(500).json({ error: `Error al agregar ${table}: ${error.message}` });
    }
});

// READ: Llama a `LEER_TABLA`
router.get('/:table', async (req, res) => {
    const { table } = req.params;
    const procedure = `LEER_${table.toUpperCase()}`;

    try {
        const rows = await BD.OpenCursorProcedure(procedure, {});
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: `Error al leer ${table}: ${error.message}` });
    }
});

// UPDATE: Llama a `UPDATE_TABLA`
router.put('/:table', async (req, res) => {
    const { table } = req.params;
    const data = req.body;

    const procedure = `UPDATE_${table.toUpperCase()}`;
    const binds = { ...data };

    try {
        await BD.OpenProcedure(procedure, binds, true);
        res.status(200).json({ message: `${table} actualizado exitosamente` });
    } catch (error) {
        res.status(500).json({ error: `Error al actualizar ${table}: ${error.message}` });
    }
});

// DELETE: Llama a `ELIMINAR_TABLA`
router.delete('/:table/:id', async (req, res) => {
    const { table, id } = req.params;

    const procedure = `ELIMINAR_${table.toUpperCase()}`;
    const binds = { P_COD_REGION: id };

    try {
        await BD.OpenProcedure(procedure, binds, true);
        res.status(200).json({ message: `${table} eliminado exitosamente` });
    } catch (error) {
        res.status(500).json({ error: `Error al eliminar ${table}: ${error.message}` });
    }
});

module.exports = router;