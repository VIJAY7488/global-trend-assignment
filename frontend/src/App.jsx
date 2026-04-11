import AddTaskForm from "./components/AddTaskForm";
import "./App.css"
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import { useMemo, useState } from "react";
import { useTasks } from "./hooks/useTasks";


export default function App() {
  const [filter, setFilter] = useState("all");
  const { tasks: allTasks, loading, error, addTask, toggleTask, editTask, deleteTask, refetch } = useTasks("all");

  const tasks = useMemo(() => {
    if (filter === "all") return allTasks;
    if (filter === "completed") return allTasks.filter(t => t.completed);
    if (filter === "incomplete") return allTasks.filter(t => !t.completed);
    return allTasks;
  }, [allTasks, filter]);

  const counts = useMemo(() => ({
    all: allTasks.length,
    completed: allTasks.filter(t => t.completed).length,
    incomplete: allTasks.filter(t => !t.completed).length,
  }), [allTasks]);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">task Manager</h1>
      </header>

      <main className="app__main">
        <AddTaskForm onAdd={addTask} />

        <div className="app__controls">
          <FilterBar active={filter} onChange={setFilter} counts={counts} />
        </div>

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
          onRetry={refetch}
        />
      </main>
    </div>
  )
}