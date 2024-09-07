const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, getTaskById, updateTaskById, deleteTaskById } = require('../controllers/taskController');

// Define routes
router.get('/', getAllTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTaskById);
router.delete('/:id', deleteTaskById);

module.exports = router;