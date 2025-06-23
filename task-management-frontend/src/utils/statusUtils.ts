import { Status } from '../enums/Status';

/**
 * Returns a label for a status value
 */
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

/**
 * Returns CSS classes for styling
 */
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

/**
 * Status options for filter dropdowns
 */
export const getStatusOptions = () => [
    { value: null, label: 'All' },
    { value: Status.Incomplete, label: getStatusLabel(Status.Incomplete) },
    { value: Status.InProgress, label: getStatusLabel(Status.InProgress) },
    { value: Status.Complete, label: getStatusLabel(Status.Complete) }
];