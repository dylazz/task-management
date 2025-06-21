import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Status } from '../enums/Status';
import { Priority } from '../enums/Priority';
import type { TaskItem } from '../types/TaskItem';

interface SortableTaskItemProps {
  task: TaskItem;
}

export const SortableTaskItem = ({ task }: SortableTaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case Priority.Low: return 'Low';
      case Priority.Medium: return 'Medium';
      case Priority.High: return 'High';
    }
  };

  const getStatusLabel = (status: Status) => {
    switch (status) {
      case Status.Todo: return 'To Do';
      case Status.InProgress: return 'In Progress';
      case Status.Done: return 'Done';
    }
  };

  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case Priority.Low: return 'bg-blue-100 text-blue-800';
      case Priority.Medium: return 'bg-yellow-100 text-yellow-800';
      case Priority.High: return 'bg-red-100 text-red-800';
    }
  };

  const getStatusClass = (status: Status) => {
    switch (status) {
      case Status.Todo: return 'bg-gray-100 text-gray-800';
      case Status.InProgress: return 'bg-purple-100 text-purple-800';
      case Status.Done: return 'bg-green-100 text-green-800';
    }
  };

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
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-lg">{task.title}</h3>
          <p className="text-gray-600 mt-1">{task.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className={`px-2 py-1 rounded-full ${getPriorityClass(task.priority)}`}>
              {getPriorityLabel(task.priority)}
            </span>
            <span className={`px-2 py-1 rounded-full ${getStatusClass(task.status)}`}>
              {getStatusLabel(task.status)}
            </span>
          </div>
        </div>
        <div 
          className="ml-4 flex items-center text-gray-400 cursor-move"
          {...attributes}
          {...listeners}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
          </svg>
        </div>
      </div>
    </li>
  );
};