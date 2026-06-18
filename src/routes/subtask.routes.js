// File: src/routes/subtask.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/subtask.controller');
const validate = require('../middleware/validate');
const { createSubtaskSchema, updateSubtaskSchema } = require('../validators/subtask.validator');

/**
 * @swagger
 * tags:
 *   name: Subtasks
 *   description: Manajemen Komponen Subtask (Dekomposisi Tugas)
 */

/**
 * @swagger
 * /api/v1/tasks/subtasks:
 *   post:
 *     summary: Membuat subtask baru di bawah sebuah task utama
 *     tags: [Subtasks]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', validate(createSubtaskSchema), ctrl.createSubtask);

/**
 * @swagger
 * /api/v1/tasks/subtasks/{id}:
 *   put:
 *     summary: Memperbarui data atau status kelar subtask
 *     tags: [Subtasks]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Menghapus subtask mandiri
 *     tags: [Subtasks]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', validate(updateSubtaskSchema), ctrl.updateSubtask);
router.delete('/:id', ctrl.deleteSubtask);

module.exports = router;