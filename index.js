require('dotenv').config();
const express = require('express');
const path = require('path');
const todoRoutes = require('./src/routes/todoRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use('/node_modules', express.static('node_modules'));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// Routes
app.use(todoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 4000; // todo .env file
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});