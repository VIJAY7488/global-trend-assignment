const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path(__dirname, "../data/tasks.json");

// Ensure data directory and file exist
function ensureDtatFile() {
    const dir = path.dirname(DATA_FILE);
    if(!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
    if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}


function loadTasks() {
    try {
        ensureDtatFile();
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(raw);
    } catch (error) {
        return [];
    }
}

function saveTasks(tasks) {
    try {
        ensureDtatFile();
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
        return tasks.find((t) => t.id === id) || null;
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
        if(index === -1) return null;
        tasks[index] = { ...tasks[index], ...fields};
        saveTasks(tasks);
        return tasks[index];
    },

    delete(id) {
        const index = tasks.findIndex((t) => t.id === id);
        if(index === -1) return false;
        tasks.splice(index, 1);
        saveTasks(tasks);
        return true;
    },
};


module.exports = TaskStore;


