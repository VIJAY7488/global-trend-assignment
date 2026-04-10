const express = require("express");
const TaskStore = require("../taskStore");
const { validateCreateTask, validateUpdateTask } = require('../middleware/validation');

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

// POST /tasks - Create a new task
router.post("/", validateCreateTask, (req, res) => {
    const task = TaskStore.create({ title: req.body.title });
    res.status(201).json({ data: task });
});


// PATCH /tasks/:id - Update title and/or completed status
router.patch("/:id", validateUpdateTask, (req, res) => {
    const { id } = req.params;
    const { completed, title } = req.body;

    const fields = {};
    if(completed !== undefined) fields.completed = completed;
    if(title !== undefined) fields.title = title.trim();

    const updated = TaskStore.updated(id, fields);

    if(!updated) {
        res.status(400).json({
            error: "Not found",
            message: `Task with id '${id}' does not exist.`,
        });
    }

    res.json({ data:updated });
});


// DELETE /tasks/:id - Delete a task
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const deleted = TaskStore.delete(id);

    if(!deleted) {
        return res.status(400).json({
            error: "Not found",
            message: `Task with id '${id}' does not exist.`,
        });
    }

    res.json({ message: `Task '${id}' deleted successfully.`})
});

module.exports = router;