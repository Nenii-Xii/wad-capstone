// File: src/controllers/subtask.controller.js
const subtaskRepo = require('../repositories/subtask.repository');
const taskRepo    = require('../repositories/task.repository'); // Memastikan task induk ada

const createSubtask = async (req, res, next) => {
  try {
    const { userId } = req.user; // Diambil otomatis dari token JWT langkah 8 kemarin
    const { title, parentTaskId, isCompleted } = req.body;

    // Pastikan task utama itu milik user yang sedang mengakses
    const targetTask = await taskRepo.findById(parentTaskId);
    if (!targetTask || targetTask.userId !== userId) {
      const err = new Error('Task utama tidak ditemukan atau bukan milik Anda.');
      err.statusCode = 404;
      throw err;
    }

    const subtask = await subtaskRepo.create({
      title,
      parentTaskId: Number(parentTaskId),
      userId,
      isCompleted: isCompleted || false
    });

    res.status(201).json({ message: 'Subtask berhasil dibuat.', data: subtask });
  } catch (err) { next(err); }
};

const getSubtasksByTaskId = async (req, res, next) => {
  try {
    const { id } = req.params; // ID dari Task utama
    const { userId } = req.user;

    const subtasks = await subtaskRepo.findAll({
      parentTaskId: Number(id),
      userId: userId
    });

    res.status(200).json({ data: subtasks });
  } catch (err) { next(err); }
};

const updateSubtask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const existingSubtask = await subtaskRepo.findById(id);
    if (!existingSubtask || existingSubtask.userId !== userId) {
      const err = new Error('Subtask tidak ditemukan atau otorisasi ditolak.');
      err.statusCode = 404;
      throw err;
    }

    const updatedSubtask = await subtaskRepo.update(id, req.body);
    res.status(200).json({ message: 'Subtask berhasil diperbarui.', data: updatedSubtask });
  } catch (err) { next(err); }
};

const deleteSubtask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const existingSubtask = await subtaskRepo.findById(id);
    if (!existingSubtask || existingSubtask.userId !== userId) {
      const err = new Error('Subtask tidak ditemukan atau otorisasi ditolak.');
      err.statusCode = 404;
      throw err;
    }

    await subtaskRepo.remove(id);
    res.status(200).json({ message: 'Subtask berhasil dihapus.' });
  } catch (err) { next(err); }
};

module.exports = { createSubtask, getSubtasksByTaskId, updateSubtask, deleteSubtask };