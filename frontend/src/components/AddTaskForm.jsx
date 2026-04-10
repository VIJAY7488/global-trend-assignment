import { useState } from "react";


export default function AddTaskForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = title.trim();
        if(!trimmed) {
            setFormError("Task title can not be empty.");
            return;
        }
        setSubmitting(true);
        setFormError(null);
        try {
            await onAdd(trimmed);
            setTitle("");
        } catch (error) {
            setFormError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="add-form" action="" onSubmit={handleSubmit}>
            <div className="add-form__row">
                <input 
                    className="add-form__input"
                    type="text"
                    placeholder="Add a new task..."
                    value={title}
                    maxLength={200}
                    onChange={(e) => { setTitle(e.target.value); setFormError(null); }}
                    disabled={submitting}
                    aria-label="New task title"
                />
                <button className="add-form__btn" type="submit" disabled={submitting}>
                    {submitting ? "Adding..." : "+ Add"}
                </button>
            </div>
            {formError && <p className="add-form__error" role="alert">{formError}</p>}
        </form>
    )
}