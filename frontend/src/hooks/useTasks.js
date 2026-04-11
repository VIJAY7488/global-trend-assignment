import { useCallback, useEffect, useState } from "react";
import { tasksApi } from "../api/tasks";


export function useTasks(filter) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await tasksApi.getAll(filter === "all" ? "" : filter);
            setTasks(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const addTask = useCallback(async (title) => {
        const { data } = await tasksApi.create(title);
        setTasks((prev) => [data, ...prev]);
        return data;
    }, []);

    const toggleTask = useCallback(async (id, completed) => {
        const { data } = await tasksApi.update(id, { completed });
        setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    }, []);

    const editTask = useCallback(async (id, title) => {
        const { data } = await tasksApi.update(id, { title });
        setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    }, []);

    const deleteTask = useCallback(async (id) => {
        await tasksApi.remove(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { tasks, loading, error, addTask, toggleTask, editTask, deleteTask, refetch: fetchTasks };
}