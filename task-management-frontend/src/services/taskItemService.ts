import type {
    GetAllTaskItemsResponse,
    GetTaskItemResponse,
    CreateTaskItemResponse,
    UpdateTaskItemResponse,
    DeleteTaskItemResponse,
    CreateTaskItemRequest,
    UpdateTaskItemRequest
} from "../types/Api.ts";


const API_BASE_URL = 'http://localhost:7265/api';

export const taskItemService = {
    getAllTaskItems: async ():Promise<GetAllTaskItemsResponse> =>{
        const response = await fetch(`${API_BASE_URL}/getAllTaskItems`);
        if(!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    getTaskItemById: async (id: number): Promise<GetTaskItemResponse> => {
        const response = await fetch(`${API_BASE_URL}/getTaskItemById/${id}`);
        if (!response.ok) throw new Error('Failed to fetch task');
        return response.json();
    },

    createTaskItem: async (task: CreateTaskItemRequest): Promise<CreateTaskItemResponse> => {
        const response = await fetch(`${API_BASE_URL}/createTaskItem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    updateTaskItem: async (task: UpdateTaskItemRequest): Promise<UpdateTaskItemResponse> => {
        const response = await fetch(`${API_BASE_URL}/updateTaskItem/${task.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    deleteTaskItem: async (id: number): Promise<DeleteTaskItemResponse> => {
        const response = await fetch(`${API_BASE_URL}/deleteTaskItem/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete task');
        return response.json();
    },
};
