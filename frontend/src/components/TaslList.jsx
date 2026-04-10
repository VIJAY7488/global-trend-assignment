import TaskItem from "./TaskItem";


export default function TaskList({ tasks, loading, error, onToggle, onDelete, onEdit, onRetry }) {
    if (loading) {
        return (
            <div className="state-box state-box--loading" aria-live="polite">
                <span className="spinner" aria-hidden="true" />
                <span>Loading tasks…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="state-box state-box--error" role="alert">
                <p>⚠️ {error}</p>
                <button type="button" className="retry-btn" onClick={onRetry}>Retry</button>
            </div>
        );
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="state-box state-box--empty">
                <p>No tasks here. Add one above!</p>
            </div>
        );
    }

    return (
        <ul className="task-list" aria-label="Task list">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </ul>
    );
}