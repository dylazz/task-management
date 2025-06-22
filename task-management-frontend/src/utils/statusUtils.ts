import { Status } from '../enums/Status';

export const getStatusLabel = (status: Status): string => {
    switch (status) {
        case Status.Incomplete:
            return 'Incomplete';
        case Status.InProgress:
            return 'In Progress';
        case Status.Complete:
            return 'Complete';
    }
};

export const getStatusClass = (status: Status): string => {
    switch (status) {
        case Status.Incomplete:
            return 'bg-gray-100 text-gray-800';
        case Status.InProgress:
            return 'bg-purple-100 text-purple-800';
        case Status.Complete:
            return 'bg-green-100 text-green-800';
    }
};
