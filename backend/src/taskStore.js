const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/tasks.json");

// Ensure data directory and file exist
function ensureDataFile() {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}


function loadTasks() {
    try {
        ensureDataFile();
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(raw);
    } catch (error) {
        return [];
    }
}

function saveTasks(tasks) {
    try {
        ensureDataFile();
        fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
    } catch (error) {
        console.error("Failed to persist tasks:", error.message);
    }
}

let tasks = loadTasks();

const TaskStore = {
    getAll() {
        return [...tasks];
    },

    getById(id) {
        const task = tasks.find((t) => t.id === id);
        return task ? { ...task } : null;
    },

    create({ title }) {
        const task = {
            id: uuidv4(),
            title: title.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
        };
        tasks.push(task);
        saveTasks(tasks);
        return task;
    },

    update(id, fields) {
        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) return null;
        tasks[index] = {
            ...tasks[index],
            ...fields,
            updatedAt: new Date().toISOString()
        };
        saveTasks(tasks);
        return tasks[index];
    },

    delete(id) {
        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) return false;
        tasks.splice(index, 1);
        saveTasks(tasks);
        return true;
    },
};


module.exports = TaskStore;


