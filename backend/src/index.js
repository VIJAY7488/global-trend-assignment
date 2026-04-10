const express = require("express");
const cors = require("cors");
const tasksRourter = require("./routes/tasks");



const app = express();


// --- Middleware --------------------------------------------------------
app.use(cors());
app.use(express.json());

// -- Routes ---------------------------------------------------------------
app.use("/tasks", tasksRourter);

// -- Health Check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// 404 catch-all
app.use((req, res) => {
    res.status(404).json({ error: "Not found", message: "Route does not exist."});
});

// Global error handler 
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({error: "Internal server error", message: err.message});
})



// --- Start --------------------------------------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Task Manager API listening on http://localhost:${PORT}`);
});

module.exports = app; // exported for tests