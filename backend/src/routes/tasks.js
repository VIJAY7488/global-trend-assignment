const express = require("express");
const TaskStore = require("../taskStore");
const { validateCreateTask } = require('../middleware/validation');

const router = express.Router();

//GET /tasks - Return all tasks, optional ?status=completed|incomplete filter
router.get("/", (req, res) => {
    const { status } = req.query;
    let tasks = TaskStore.getAll();

    if(status === "completed") {
        tasks = tasks.filter((t) => t.completed);
    } else if(status === "incomplete") {
        tasks = tasks.filter((t) => !t.completed);
    } else if(status !== undefined) {
        return res.status(400).json({
            error: "Invalid query parameter",
            message: "Query param 'status' must be 'completed' or 'incomplete,.",
        });
    }

    // Sort newest first
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ data: tasks, total: tasks.length });
});