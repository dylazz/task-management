import {useEffect, useState} from "react";
import type {TaskItem} from "../types/TaskItem.ts";
import {taskItemService} from "../services/taskItemService.ts";
import {ERROR_MESSAGES} from "../constants.ts";

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
            const response = await taskItemService.getAllTaskItems();
            setTaskItems(response.data);
            setError(null);
        } catch (err){
            setError('Failed to fetch task items');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getTaskItem = async (id: number) => {
        try {
            const response = await taskItemService.getTaskItem(id);
            return response.data;
        } catch (err) {
            setError(ERROR_MESSAGES.GET_TASK_FAILED);
            throw err;
        }
    };

    const createTaskItem = async (taskItem: Omit<TaskItem, 'id' | 'createdDate'>) => {
        try {
            const response = await taskItemService.createTaskItem(taskItem);
            setTaskItems(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            setError(ERROR_MESSAGES.CREATE_TASK_FAILED);
            throw err;
        }
    };

    const updateTaskItem = async (taskItem: TaskItem) => {
        try {
            const response = await taskItemService.updateTaskItem(taskItem);
            setTaskItems(prev => prev.map(t => t.id === taskItem.id ? response.data : t));
            return response.data;
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
        getTaskItem,
        fetchTaskItems,
        taskItems,
    };

}