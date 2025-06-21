import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { TaskItem } from '../types/TaskItem';
import { useTaskItems } from '../hooks/useTaskItems';

//A React context that will hold task-related state and functionality.
type TaskItemContextType = {
  taskItems: TaskItem[];
  loading: boolean;
  error: string | null;
  reorderTaskItems: (startIndex: number, endIndex: number) => void;
}

const TaskItemContext = createContext<TaskItemContextType | undefined>(undefined);

// A custom hook - providing a safe way to access the context
export const useTaskItemContext = () => {
  const context = useContext(TaskItemContext);
  if (context === undefined) {
    throw new Error('useTaskItemContext must be used within a TaskItemProvider');
  }
  return context;
};


type TaskItemProviderProps = {
  children: ReactNode;
}
export const TaskItemProvider = ({ children }: TaskItemProviderProps) => {
  // Original data from the API (via hook)
  const { taskItems: fetchedTaskItems, loading, error } = useTaskItems();
  // Local state that can be modified (for reordering)
  const [taskItems, setTaskItems] = useState<TaskItem[]>([]);

  // Updating the local state whenever new data is fetched
  useEffect(() => {
    if (fetchedTaskItems && !loading) {
      setTaskItems([...fetchedTaskItems]);
    }
  }, [fetchedTaskItems, loading]);

  const reorderTaskItems = (startIndex: number, endIndex: number) => {
    const result = Array.from(taskItems); // Creating an array from taskItems state
    const [removed] = result.splice(startIndex, 1); // Removing item from current position
    result.splice(endIndex, 0, removed); // Adding item to new position
    setTaskItems(result); // Updating the local state
  };

  const value = {
    taskItems: taskItems,
    loading,
    error,
    reorderTaskItems: reorderTaskItems,
  };

  return (
      <TaskItemContext.Provider value={value}>
        {children}
      </TaskItemContext.Provider>
  );
};
