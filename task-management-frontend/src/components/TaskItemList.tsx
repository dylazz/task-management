import { Status } from '../enums/Status';
import { Priority } from '../enums/Priority';
import {useTaskItems} from "../hooks/useTaskItems.ts";
import {LOADING_MESSAGES} from "../constants.ts";

export const TaskItemList = () => {
  const { taskItems, loading, error } = useTaskItems();
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

  if (loading) {
    return <div>{LOADING_MESSAGES.LOADING_TASKS}</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {taskItems.map((taskItem) => (
        <li key={taskItem.id} className="py-4">
          <h3 className="font-medium">{taskItem.title}</h3>
          <p className="text-gray-600 mt-1">{taskItem.description}</p>
          <div className="mt-2 flex gap-2 text-sm">
            <span>{getPriorityLabel(taskItem.priority)}</span>
            <span>•</span>
            <span>{getStatusLabel(taskItem.status)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};