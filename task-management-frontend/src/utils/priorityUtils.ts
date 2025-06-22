import { Priority } from '../enums/Priority';

export const getPriorityLabel = (priority: Priority): string => {
    switch (priority) {
        case Priority.Low:
            return 'Low';
        case Priority.Medium:
            return 'Medium';
        case Priority.High:
            return 'High';
    }
};

export const getPriorityClass = (priority: Priority): string => {
    switch (priority) {
        case Priority.Low:
            return 'bg-blue-100 text-blue-800';
        case Priority.Medium:
            return 'bg-yellow-100 text-yellow-800';
        case Priority.High:
            return 'bg-red-100 text-red-800';
    }
};
