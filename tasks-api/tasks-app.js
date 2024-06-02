const express = require('express');
// Middleware to parse incoming request bodies
const bodyParser = require('body-parser');
// MongoDB client
const mongoose = require('mongoose');
// Routes for tasks
const taskRoutes = require('./routes/task-routes');
// Create an Express app
const app = express();
// Parse incoming request bodies
app.use(bodyParser.json());
// Set headers to allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});
// Use the task routes
app.use(taskRoutes);

app.use((err, req, res) => {
    let code = 500;
    let message = 'Something went wrong.';
    if (err.code) {
        code = err.code;
    }

    if (err.message) {
        message = err.message;
    }

    res.status(code).json({message: message});
});

// connect to MongoDB with address stored in MONGODB_CONNECTION_URI
async function startServer() {
    try {
        const username = process.env.MONGO_INITDB_ROOT_USERNAME;
        const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
        const dbHost = process.env.DB_HOST;
        const dbPort = process.env.DB_PORT;
        const connectionUri = `mongodb://${username}:${password}@${dbHost}:${dbPort}/admin`;

        // Connect to the admin database
        await mongoose.connect(connectionUri, {});

        // Switch to the target database (tasks-db)
        mongoose.connection.useDb('tasks-db');
        console.log('Successfully connected to MongoDB.');
        app.listen(3000, () => console.log('Server running on port 3000'));
    } catch (err) {
        console.log('COULD NOT CONNECT TO MONGODB!');
        console.error(err.message);
    }
}

startServer();