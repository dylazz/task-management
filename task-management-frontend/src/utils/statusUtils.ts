import { Status } from '../enums/Status';

export const getStatusLabel = (status: Status): string => {
    switch (status) {
        case Status.Todo:
            return 'To Do';
        case Status.InProgress:
            return 'In Progress';
        case Status.Done:
            return 'Done';
    }
};

export const getStatusClass = (status: Status): string => {
    switch (status) {
        case Status.Todo:
            return 'bg-gray-100 text-gray-800';
        case Status.InProgress:
            return 'bg-purple-100 text-purple-800';
        case Status.Done:
            return 'bg-green-100 text-green-800';
    }
};
