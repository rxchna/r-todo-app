const fs = require('fs').promises;
const path = require('path');

const tasksFilePath = path.resolve(__dirname, '../data/tasks.json');

// Function to read tasks from JSON file
const readTasksFromFile = async () => {
    try {
        const data = await fs.readFile(tasksFilePath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error('Error reading tasks file:', err);
        return [];
    }
};

// Function to write tasks to JSON file
const writeTasksToFile = async (tasks) => {
    try {
        await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
    } catch (err) {
        console.error('Error writing tasks file:', err);
    }
};

module.exports = { readTasksFromFile, writeTasksToFile };