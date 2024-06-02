const mongoose = require('mongoose');

const Task = require('../models/task');
const {createError} = require('../helpers/error');

const getTasks = async (req, res, next) => {
    let tasks;

    try {
        // get all tasks
        tasks = await Task.find({});
    } catch (err) {
        const error = createError('Failed to fetch tasks.', 500);
        return next(error);
    }

    res
        .status(200)
        .json({tasks: tasks.map((task) => task.toObject({getters: true}))});
};


const deleteTask = async (req, res, next) => {
    try {
        const result = await Task.deleteMany({});

        if (result.deletedCount === 0) {
            const error = createError('No tasks found to delete.', 404);
            return next(error);
        }

        res.status(200).json({message: 'All tasks deleted!'});
    } catch (err) {
        const error = createError('Failed to delete tasks.', 500);
        return next(error);
    }
};

const createTask = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    const newTask = new Task({
        title, text
    });

    let savedTask;

    try {
        savedTask = await newTask.save();
    } catch (err) {
        const error = createError('Failed to save task.', 500);
        return next(error);
    }

    res.status(201).json({task: savedTask.toObject()});
};


exports.getTasks = getTasks;
exports.deleteTask = deleteTask;
exports.createTask = createTask;
