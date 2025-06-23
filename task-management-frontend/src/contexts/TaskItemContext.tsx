import {createContext, useContext, type ReactNode} from 'react';
import type {TaskItem} from '../types/TaskItem';
import {useTaskItemData} from '../hooks/useTaskItemData.ts';
import {arrayMove} from "@dnd-kit/sortable";

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
    const hookData = useTaskItemData();

    const reorderTaskItems = (startIndex: number, endIndex: number) => {
        hookData.setTaskItems(prev => arrayMove(prev, startIndex, endIndex));
    };

    const value = {
        ...hookData,
        reorderTaskItems,
    };

    return (
        <TaskItemContext.Provider value={value}>
            {children}
        </TaskItemContext.Provider>
    );
};
