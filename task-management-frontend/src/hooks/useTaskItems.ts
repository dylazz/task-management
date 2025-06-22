import {useEffect, useState} from "react";
import type {TaskItem} from "../types/TaskItem";
import {taskItemService} from "../services/taskItemService";
import {ERROR_MESSAGES} from "../constants";

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
        } catch (err) {
            setError(ERROR_MESSAGES.FETCH_TASKS_FAILED);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createTaskItem = async (taskItem: Omit<TaskItem, 'id' | 'createdDate'>) => {
        try {
            const data = await taskItemService.createTaskItem(taskItem);
            setTaskItems(prev => [...prev, data]);
            return data;
        } catch (err) {
            setError(ERROR_MESSAGES.CREATE_TASK_FAILED);
            throw err;
        }
    };

    const updateTaskItem = async (taskItem: TaskItem) => {
        try {
            const data = await taskItemService.updateTaskItem(taskItem);
            setTaskItems(prev => prev.map(t => t.id === taskItem.id ? data : t));
            return data;
        } catch (err) {
            setError(ERROR_MESSAGES.UPDATE_TASK_FAILED);
            throw err;
        }
    };

    const deleteTaskItem = async (id: number) => {
        try {
            await taskItemService.deleteTaskItem(id);
            setTaskItems(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            setError(ERROR_MESSAGES.DELETE_TASK_FAILED);
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