export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5103/api';

// Error Messages
export const ERROR_MESSAGES = {
    FETCH_TASKS_FAILED: 'Failed to fetch task items',
    CREATE_TASK_FAILED: 'Failed to create task item',
    UPDATE_TASK_FAILED: 'Failed to update task item',
    DELETE_TASK_FAILED: 'Failed to delete task item',
    NETWORK_ERROR: 'Network error occurred',
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
    LOADING_TASKS: 'Loading tasks...',
    CREATING_TASK: 'Creating task...',
    UPDATING_TASK: 'Updating task...',
    DELETING_TASK: 'Deleting task...',
} as const;