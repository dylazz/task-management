import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import type {TaskItem} from '../types/TaskItem';
import {useTaskItems} from '../hooks/useTaskItems';

//A React context that will hold task-related state and functionality.
type TaskItemContextType = {
    taskItems: TaskItem[];
    loading: boolean;
    error: string | null;
    reorderTaskItems: (startIndex: number, endIndex: number) => void;
    createTaskItem: (taskItem: Omit<TaskItem, 'id' | 'createdDate'>) => Promise<TaskItem>;
    updateTaskItem: (taskItem: TaskItem) => Promise<TaskItem>;
    deleteTaskItem: (id: number) => Promise<void>;
    fetchTaskItems: () => Promise<void>;
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
export const TaskItemProvider = ({children}: TaskItemProviderProps) => {
    const hookData = useTaskItems();
    const [localTaskItems, setLocalTaskItems] = useState<TaskItem[]>([]);

    useEffect(() => {
        setLocalTaskItems(hookData.taskItems);
    }, [hookData.taskItems]);

    const reorderTaskItems = (startIndex: number, endIndex: number) => {
        const result = [...localTaskItems];
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        setLocalTaskItems(result);
    };

    const value = {
        ...hookData,
        taskItems: localTaskItems,
        reorderTaskItems,
    };

    return (
        <TaskItemContext.Provider value={value}>
            {children}
        </TaskItemContext.Provider>
    );
};
