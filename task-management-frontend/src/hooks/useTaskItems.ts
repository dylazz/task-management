import {useEffect, useState} from "react";
import type {TaskItem} from "../types/TaskItem.ts";
import {taskItemService} from "../services/taskItemService.ts";

export const useTaskItems = () => {
    const [taskItems, setTaskItems] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTaskItems();
    }, []);

    const fetchTaskItems = async () => {
        try {
            setLoading(true);
            const data = await taskItemService.getAllTaskItems();
            setTaskItems(data);
            setError(null);
        } catch (err){
            setError('Failed to fetch task items');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createTaskItem = async (taskItem: Omit<TaskItem, 'id' | 'createdDate'>) => {
        try {
            const newTaskItem = await taskItemService.createTaskItem(taskItem);
            setTaskItems(prev => [...prev, newTaskItem]);
            return newTaskItem;
        } catch (err) {
            setError('Failed to create task item');
            throw err;
        }
    };

    const updateTaskItem = async (taskItem: TaskItem) => {
        try {
            const updatedTaskItem = await taskItemService.updateTaskItem(taskItem);
            setTaskItems(prev => prev.map(t => t.id === taskItem.id ? updatedTaskItem : t));
            return updatedTaskItem;
        } catch (err) {
            setError('Failed to update task item');
            throw err;
        }
    };

    const deleteTaskItem = async (id: number) => {
        try {
            await taskItemService.deleteTaskItem(id);
            setTaskItems(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            setError('Failed to delete task item');
            throw err;
        }
    };

    return {
        loading,
        error,
        createTaskItem,
        updateTaskItem,
        deleteTaskItem,
        fetchTaskItems,
        taskItems,
    };

}