import AddTaskForm from "./components/AddTaskForm";
import "./App.css"
import FilterBar from "./components/FilterBar";


export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">task Manager</h1>
      </header>

      <main className="app__main">
        <AddTaskForm />

        <div className="app__controls">
          <FilterBar />
        </div>
      </main>
    </div>
  )
}