import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import type {TaskItem} from '../types/TaskItem';
import { getStatusLabel, getStatusClass } from '../utils/statusUtils';
import { getPriorityLabel, getPriorityClass } from '../utils/priorityUtils';
import { ActionButton } from './ActionButton';

interface SortableTaskItemProps {
    taskItem: TaskItem;
    onEdit: (taskItem: TaskItem) => void;
    onDelete: (taskItem: TaskItem) => void;
}

export const SortableTaskItem = ({
                                     taskItem, onEdit, onDelete
                                 }: SortableTaskItemProps) => {
    // DND setup
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: taskItem.id.toString()});
    // Drag style
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

const EditIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
    </svg>
);

const DeleteIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
    </svg>
);

const DragIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"/>
    </svg>
);

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`p-4 border-l-4 ${
                isDragging
                    ? 'bg-gray-50 border-blue-500'
                    : 'border-transparent hover:bg-gray-50'
            } transition-colors duration-200`}
        >
            {/*Task Item*/}
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-medium text-lg">{taskItem.title}</h3>
                    <p className="text-gray-600 mt-1">{taskItem.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className={`px-2 py-1 rounded-full ${getPriorityClass(taskItem.priority)}`}>
              {getPriorityLabel(taskItem.priority)}
            </span>
                        <span className={`px-2 py-1 rounded-full ${getStatusClass(taskItem.status)}`}>
              {getStatusLabel(taskItem.status)}
            </span>
                    </div>
                </div>
                {/*Action buttons*/}
                <div className="ml-4 flex items-center gap-2">
                    <ActionButton
                        onClick={() => onEdit(taskItem)}
                        title="Edit task"
                        icon={<EditIcon/>}
                    />
                    <ActionButton
                        onClick={() => onDelete(taskItem)}
                        title="Delete task"
                        icon={<DeleteIcon/>}
                        hoverColor="red"
                    />
                    <ActionButton
                        title="Drag to reorder"
                        icon={<DragIcon/>}
                        {...attributes}
                        {...listeners}
                    />
                </div>
            </div>
        </li>
    );
};
