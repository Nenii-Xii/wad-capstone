// File: src/controllers/tasks.controller.js
const store = require('../data/tasks.store');

const tasksController = {
  // Sesuai rute: ctrl.listTasks
  listTasks(req, res) {
    const { status, priority, sort, order, limit, offset } = req.query;
    
    const { data, total } = store.findAll({
      status,
      priority,
      sort,
      order,
      limit: limit ? parseInt(limit) : 10,
      offset: offset ? parseInt(offset) : 0
    });

    return res.status(200).json({
      status: 'success',
      data,
      pagination: {
        total,
        limit: limit ? parseInt(limit) : 10,
        offset: offset ? parseInt(offset) : 0
      }
    });
  },

  // Sesuai rute: ctrl.getTask
  getTask(req, res) {
    const task = store.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        status: 'fail',
        error: {
          code: 'NOT_FOUND',
          message: `Task dengan ID ${req.params.id} tidak ditemukan.`
        }
      });
    }
    return res.status(200).json({ status: 'success', data: task });
  },

  // Sesuai rute: ctrl.createTask
  createTask(req, res) {
    const newTask = store.create(req.body);
    res.setHeader('Location', `/api/v1/tasks/${newTask.id}`);
    return res.status(201).json({
      status: 'success',
      data: newTask
    });
  },

  // Sesuai rute: ctrl.replaceTask
  replaceTask(req, res) {
    const updatedTask = store.replace(req.params.id, req.body);
    if (!updatedTask) {
      return res.status(404).json({
        status: 'fail',
        error: {
          code: 'NOT_FOUND',
          message: `Task dengan ID ${req.params.id} tidak ditemukan.`
        }
      });
    }
    return res.status(200).json({ status: 'success', data: updatedTask });
  },

  // Sesuai rute: ctrl.updateTask
  updateTask(req, res) {
    const updatedTask = store.update(req.params.id, req.body);
    if (!updatedTask) {
      return res.status(404).json({
        status: 'fail',
        error: {
          code: 'NOT_FOUND',
          message: `Task dengan ID ${req.params.id} tidak ditemukan.`
        }
      });
    }
    return res.status(200).json({ status: 'success', data: updatedTask });
  },

  // Sesuai rute: ctrl.deleteTask
  deleteTask(req, res) {
    const success = store.remove(req.params.id);
    if (!success) {
      return res.status(404).json({
        status: 'fail',
        error: {
          code: 'NOT_FOUND',
          message: `Task dengan ID ${req.params.id} tidak ditemukan.`
        }
      });
    }
    return res.status(204).send();
  }
};

module.exports = tasksController;