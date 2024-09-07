const { readTasksFromFile, writeTasksToFile } = require('../models/taskModel');

// Get all tasks
const getAllTasks = async (req, res, next) => {
    try {
        const tasks = await readTasksFromFile();
        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

// Create new task
const createTask = async (req, res, next) => {
    try {
        const { title, description, assignedTo, dueDate, priority, status } = req.body;

        if (!title || !description || !assignedTo || !dueDate || !priority || !status) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const tasks = await readTasksFromFile();
        const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
        const newTask = { id: newId, title, description, assignedTo, dueDate, priority, status };

        tasks.push(newTask);
        await writeTasksToFile(tasks);

        res.status(201).json(newTask);
    } catch (err) {
        next(err);
    }
};

// Get single task by ID
const getTaskById = async (req, res, next) => {
    try {
        const tasks = await readTasksFromFile();
        const task = tasks.find(task => task.id === parseInt(req.params.id));
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (err) {
        next(err);
    }
};

// Update task by ID
const updateTaskById = async (req, res, next) => {
    try {
        const { title, description, assignedTo, dueDate, priority, status } = req.body;
        const tasks = await readTasksFromFile();
        const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));

        if (taskIndex !== -1) {
            if (title !== undefined) tasks[taskIndex].title = title;
            if (description !== undefined) tasks[taskIndex].description = description;
            if (assignedTo !== undefined) tasks[taskIndex].assignedTo = assignedTo;
            if (dueDate !== undefined) tasks[taskIndex].dueDate = dueDate;
            if (priority !== undefined) tasks[taskIndex].priority = priority;
            if (status !== undefined) tasks[taskIndex].status = status;

            await writeTasksToFile(tasks);
            res.json(tasks[taskIndex]);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (err) {
        next(err);
    }
};

// Delete task by ID
const deleteTaskById = async (req, res, next) => {
    try {
        let tasks = await readTasksFromFile();
        const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));

        if (taskIndex !== -1) {
            tasks = tasks.filter(task => task.id !== parseInt(req.params.id));
            await writeTasksToFile(tasks);
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllTasks, createTask, getTaskById, updateTaskById, deleteTaskById };
