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

