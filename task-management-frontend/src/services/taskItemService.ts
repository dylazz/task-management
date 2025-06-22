import {API_BASE_URL, ERROR_MESSAGES} from '../constants';
import type {
    GetAllTaskItemsResponse,
    GetTaskItemResponse,
    CreateTaskItemResponse,
    UpdateTaskItemResponse,
    DeleteTaskItemResponse,
    CreateTaskItemRequest,
    UpdateTaskItemRequest
} from "../types/Api.ts";

export const taskItemService = {
    getAllTaskItems: async (): Promise<GetAllTaskItemsResponse> => {
        const response = await fetch(`${API_BASE_URL}/TaskItem`);
        if (!response.ok) throw new Error(ERROR_MESSAGES.FETCH_TASKS_FAILED);
        return response.json();
    },

    getTaskItem: async (id: number): Promise<GetTaskItemResponse> => {
        const response = await fetch(`${API_BASE_URL}/TaskItem/${id}`);
        if (!response.ok) throw new Error(ERROR_MESSAGES.FETCH_TASKS_FAILED);
        return response.json();
    },

    createTaskItem: async (task: CreateTaskItemRequest): Promise<CreateTaskItemResponse> => {
        const response = await fetch(`${API_BASE_URL}/TaskItem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) throw new Error(ERROR_MESSAGES.CREATE_TASK_FAILED);
        return response.json();
    },

    updateTaskItem: async (task: UpdateTaskItemRequest): Promise<UpdateTaskItemResponse> => {
        const response = await fetch(`${API_BASE_URL}/TaskItem/${task.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) throw new Error(ERROR_MESSAGES.UPDATE_TASK_FAILED);
        return response.json();
    },

    deleteTaskItem: async (id: number): Promise<DeleteTaskItemResponse> => {
        const response = await fetch(`${API_BASE_URL}/TaskItem/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error(ERROR_MESSAGES.DELETE_TASK_FAILED);
        return null;
    },
};
