import type {TaskItem} from './TaskItem';

// Endpoint response types
export type GetAllTaskItemsResponse = TaskItem[];
export type CreateTaskItemResponse = TaskItem;
export type UpdateTaskItemResponse = TaskItem;
export type DeleteTaskItemResponse = null;

// Endpoint request types
export type CreateTaskItemRequest = Omit<TaskItem, 'id' | 'createdDate'>;
export type UpdateTaskItemRequest = TaskItem;
