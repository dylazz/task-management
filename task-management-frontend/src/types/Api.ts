import type { TaskItem } from './TaskItem.ts';

// Base response type for successful operations
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

// Endpoint response types
export type GetAllTaskItemsResponse = ApiResponse<TaskItem[]>;
export type GetTaskItemResponse = ApiResponse<TaskItem>;
export type CreateTaskItemResponse = ApiResponse<TaskItem>;
export type UpdateTaskItemResponse = ApiResponse<TaskItem>;
export type DeleteTaskItemResponse = ApiResponse<null>;

// Endpoint request types
export type CreateTaskItemRequest = Omit<TaskItem, 'id' | 'createdDate'>;
export type UpdateTaskItemRequest = TaskItem;
