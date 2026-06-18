const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/tasks.controller');

// Pastikan nama fungsi controller-nya sesuai dengan yang di-export!
router.get('/', ctrl.listTasks);
router.post('/', ctrl.createTask);
router.get('/:id', ctrl.getTask);
router.put('/:id', ctrl.updateTask);
router.delete('/:id', ctrl.deleteTask);

module.exports = router;