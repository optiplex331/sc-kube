const mongoose = require('mongoose');

// Define a schema for tasks
const taskSchema = new mongoose.Schema({
  title: String,
  text: String,
})

// Create a model based on the schema and export it
module.exports = mongoose.model('Task', taskSchema);