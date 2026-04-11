# Task Manager

A full-stack task management app with a React frontend and Node.js/Express REST API.

---

## Features

- **Create** tasks with a title
- **View** all tasks, sorted newest-first
- **Complete / uncomplete** tasks with a single click
- **Edit** task titles inline
- **Delete** tasks
- **Filter** by All / Incomplete / Completed
- **Persistent storage** — tasks survive server restarts (JSON file)
- **Loading and error states** with retry support
- **Backend tests** with Jest + Supertest
- **Docker support** for one-command deployment

---

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express app + server entry point
│   │   ├── taskStore.js          # In-memory store with JSON file persistence
│   │   ├── routes/
│   │   │   └── tasks.js          # GET / POST / PATCH / DELETE /tasks
│   │   └── middleware/
│   │       └── validation.js     # Request body validators
│   ├── tests/
│   │   └── tasks.test.js         # API integration tests
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js                # Root component
│   │   ├── App.css               # Global styles
│   │   ├── api/
│   │   │   └── tasks.js          # Fetch wrapper for the REST API
│   │   ├── hooks/
│   │   │   └── useTasks.js       # Data-fetching hook (CRUD operations)
│   │   └── components/
│   │       ├── AddTaskForm.jsx   # New-task form with validation
│   │       ├── FilterBar.jsx     # All / Incomplete / Completed filter
│   │       ├── TaskList.jsx      # List renderer + loading/error/empty states
│   │       └── TaskItem.jsx      # Single task row with inline editing
│   ├── public/
│   │   └── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Prerequisites

- **Node.js** v18+ and **npm** v9+  
  *(only required for the manual setup option)*
- **Docker** + **Docker Compose**  
  *(only required for the Docker option)*

---

## Option A — Run manually (two terminals)

### 1. Backend

```bash
cd backend
npm install
npm start
# API is now running at http://localhost:4000
```

Development mode (auto-restart on file change):

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
# Opens http://localhost:5173 in your browser
```

The frontend's `package.json` includes `"proxy": "http://localhost:4000"`, so all
`/tasks` requests from the dev server are automatically forwarded to the backend.

---

## Option B — Docker (one command)

```bash
# From the repo root
docker-compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173      |
| API      | http://localhost:4000      |

Task data is stored in a named Docker volume (`task-data`) and survives container
restarts.

To stop:

```bash
docker-compose down
# To also remove the persisted data volume:
docker-compose down -v
```

---

## API Reference

Base URL: `http://localhost:4000`

### `GET /tasks`

Returns all tasks, newest first.

**Query params**

| Param    | Values                    | Description        |
|----------|---------------------------|--------------------|
| `status` | `completed`, `incomplete` | Filter by status   |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Buy groceries",
      "completed": false,
      "createdAt": "2024-04-10T12:00:00.000Z"
    }
  ],
  "total": 1
}
```

---

### `POST /tasks`

Create a new task.

**Body**
```json
{ "title": "Buy groceries" }
```

**Response `201`**
```json
{ "data": { "id": "uuid", "title": "Buy groceries", "completed": false, "createdAt": "..." } }
```

**Validation errors `400`**
- `title` missing or not a string
- `title` is blank
- `title` exceeds 200 characters

---

### `PATCH /tasks/:id`

Update a task's `completed` status and/or `title`.

**Body** (at least one field required)
```json
{ "completed": true }
{ "title": "Updated title" }
{ "completed": false, "title": "New title" }
```

**Response `200`** — returns the updated task object.  
**`404`** if the task does not exist.

---

### `DELETE /tasks/:id`

Delete a task.

**Response `200`**
```json
{ "message": "Task 'uuid' deleted successfully." }
```

**`404`** if the task does not exist.

---

## Running Tests

```bash
cd backend
npm install
npm test
```

The test suite covers:

- `GET /tasks` — empty list, all tasks, status filters, invalid filter
- `POST /tasks` — happy path, missing title, empty title, title too long
- `PATCH /tasks/:id` — toggle complete, edit title, 404, empty body, bad type
- `DELETE /tasks/:id` — happy path, 404

---

## Design Decisions

| Concern | Decision |
|---|---|
| Storage | In-memory + JSON file persistence. No database dependency, works out of the box. |
| Persistence | `tasks.json` is written on every mutation. Acceptable for a small app; a database would be the next step. |
| Validation | Express middleware functions, kept separate from route handlers. |
| Error responses | Consistent `{ error, message }` shape across all 4xx/5xx responses. |
| Frontend state | Custom `useTasks` hook centralises all async logic; components stay presentational. |
| Filtering | Implemented on the server (`?status=`) so the list is always correctly scoped. |
