import AddTaskForm from "./components/AddTaskForm";
import "./App.css"


export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">task Manager</h1>
      </header>

      <main className="app__main">
        <AddTaskForm />
      </main>
    </div>
  )
}