const request = require("supertest");
const app = require("../backend/src/index");


// Reset in-memory stire before each test by mocking the module
jest.mock("../src/taskStore", () => {
    const { v4: uuidv4 } = require('uuid');
    let tasks = [];
    return {
        getAll: () => [...tasks],
        getById: (id) => tasks.find((t) => t.id === id) || null,
        create: ({ title }) => {
            const task = { id: uuidv4(), title: title.trim(), completed: false, createdAt: new Date().toISOString() };
            tasks.push(task);
            return task;
        },
        update: (id, fields) => {
            const i = tasks.findIndex((t) => t.id === id);
            if (i === -1) return null;
            tasks[i] = { ...tasks[i], ...fields };
            return tasks[i];
        },
        delete: (id) => {
            const i = tasks.findIndex((t) => t.id === id);
            if (i === -1) return false;
            tasks.splice(i, 1);
            return true;
        },
        _reset: () => { tasks = []; },
    };
});

const TaskStore = require("../src/taskStore");
const { beforeEach } = require("node:test");

beforeEach(() => TaskStore._reset());

// -- GET /tasks -------------------------------------------------------------------
describe("GET /tasks", () => {
    it("returns an empty list initially", async () => {
        const res = await request(app).get("/tasks");
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
        expect(res.body.total).toBe(0);
    });

    it("returns all tasks", async () => {
        TaskStore.create({ title: "Task A" });
        TaskStore.create({ title: "Task B" });
        const res = await request(app).get("/tasks");
        expect(res.status).toBe(200);
        expect(res.body.total).toBe(2);
    });

    it("filters by status=completed", async () => {
        const t = TaskStore.create({ title: "Done" });
        TaskStore.update(t.id, { completed: true });
        TaskStore.create({ title: "Pending" });
        const res = await request(app).get("/tasks?status=completed");
        expect(res.status).toBe(200);
        expect(res.body.data.every((t) => t.completed)).toBe(true);
    });

    it("filters by status=incomplete", async () => {
        const t = TaskStore.create({ title: "Done" });
        TaskStore.update(t.id, { completed: true });
        TaskStore.create({ title: "Pending" });
        const res = await request(app).get("/tasks?status=incomplete");
        expect(res.status).toBe(200);
        expect(res.body.data.every((t) => !t.completed)).toBe(true);
    });

    it("rejects invalid status param", async () => {
        const res = await request(app).get("/tasks?status=unknown");
        expect(res.status).toBe(400);
    });
});

// ── POST /tasks ───────────────────────────────────────────────────────────────
describe("POST /tasks", () => {
  it("creates a task with a valid title", async () => {
    const res = await request(app).post("/tasks").send({ title: "New task" });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("New task");
    expect(res.body.data.completed).toBe(false);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.createdAt).toBeDefined();
  });

  it("rejects missing title", async () => {
    const res = await request(app).post("/tasks").send({});
    expect(res.status).toBe(400);
  });

  it("rejects empty title", async () => {
    const res = await request(app).post("/tasks").send({ title: "   " });
    expect(res.status).toBe(400);
  });

  it("rejects title over 200 chars", async () => {
    const res = await request(app).post("/tasks").send({ title: "a".repeat(201) });
    expect(res.status).toBe(400);
  });
});

// ── PATCH /tasks/:id ──────────────────────────────────────────────────────────
describe("PATCH /tasks/:id", () => {
  it("marks a task as completed", async () => {
    const task = TaskStore.create({ title: "Do it" });
    const res = await request(app).patch(`/tasks/${task.id}`).send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.data.completed).toBe(true);
  });

  it("edits the task title", async () => {
    const task = TaskStore.create({ title: "Old title" });
    const res = await request(app).patch(`/tasks/${task.id}`).send({ title: "New title" });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("New title");
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).patch("/tasks/nonexistent").send({ completed: true });
    expect(res.status).toBe(404);
  });

  it("returns 400 for empty body", async () => {
    const task = TaskStore.create({ title: "Anything" });
    const res = await request(app).patch(`/tasks/${task.id}`).send({});
    expect(res.status).toBe(400);
  });

  it("returns 400 for non-boolean completed", async () => {
    const task = TaskStore.create({ title: "Anything" });
    const res = await request(app).patch(`/tasks/${task.id}`).send({ completed: "yes" });
    expect(res.status).toBe(400);
  });
});

// ── DELETE /tasks/:id ─────────────────────────────────────────────────────────
describe("DELETE /tasks/:id", () => {
  it("deletes an existing task", async () => {
    const task = TaskStore.create({ title: "To delete" });
    const res = await request(app).delete(`/tasks/${task.id}`);
    expect(res.status).toBe(200);
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).delete("/tasks/nonexistent");
    expect(res.status).toBe(404);
  });
});