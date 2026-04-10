import { useState } from "react";


export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.title);
    const [busy, setBusy] = useState(false);
    const [itemError, setItemError] = useState(null);

    const handleToggle = async () => {
        setBusy(true);
        setItemError(null);
        try {
            await onToggle(task.id, !task.completed);
        } catch (error) {
            setItemError(error.message);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        setBusy(true);
        setItemError(null);
        try {
            await onDelete(task.id);
        } catch (error) {
            setItemError(error.message);
            setBusy(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const trimmed = editValue.trim();
        if (!trimmed || trimmed === task.title) { setEditing(false); return; }
        setBusy(true);
        setItemError(null);
        try {
            await onEdit(task.id, trimmed);
            setEditing(false);
        } catch (error) {
            setItemError(error.message);
        } finally {
            setBusy(false);
        }
    };

    const handleEditKeyDown = (e) => {
        if (e.key === "Escape") { setEditing(false); setEditValue(task.title); };
    };

    const dateStr = new Date(task.createdAt).toLocaleDateString(undefined, {
        month: "short", day: "numeric", year: "numeric",
    });

    return (
        <li className={`task-item${task.completed ? " task-item--done" : ""}${busy ? " task-item--busy" : ""}`}>
            <button
                className="task-item__checkbox"
                onClick={handleToggle}
                disabled={busy}
                aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                title={task.completed ? "Mark incomplete" : "Mark complete"}
            >
                <span>{task.completed ? "✓" : ""}</span>
            </button>

            <div className="task-item__body">
                {editing ? (
                    <form className="task-item__edit-form" onSubmit={handleEditSubmit}>
                        <input
                            className="task-item__edit-input"
                            value={editValue}
                            maxLength={200}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleEditKeyDown}
                            disabled={busy}
                            autoFocus
                            aria-label="Edit task title"
                        />
                        <button className="task-item__edit-save" type="submit" disabled={busy}>Save</button>
                        <button className="task-item__edit-cancel" type="button" onClick={() => { setEditing(false); setEditValue(task.title); }}>Cancel</button>
                    </form>
                ) : (
                    <>
                        <span className="task-item__title">{task.title}</span>
                        <span className="task-item__date">{dateStr}</span>
                    </>
                )}
                {itemError && <span className="task-item__error" role="alert">{itemError}</span>}
            </div>

            {!editing && (
                <div className="task-item__actions">
                    <button
                        className="task-item__btn task-item__btn--edit"
                        onClick={() => { setEditing(true); setEditValue(task.title); }}
                        disabled={busy}
                        aria-label="Edit task"
                        title="Edit"
                    >✏️</button>
                    <button
                        className="task-item__btn task-item__btn--delete"
                        onClick={handleDelete}
                        disabled={busy}
                        aria-label="Delete task"
                        title="Delete"
                    >🗑</button>
                </div>
            )}
        </li>
    )
}