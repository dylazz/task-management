import {useMemo, useState} from 'react';
import type {TaskItem} from '../types/TaskItem';
import {useTaskItemContext} from '../contexts/TaskItemContext';
import type {DragEndEvent} from '@dnd-kit/core';
import type {Status} from "../enums/Status.ts";

export const useTaskItemHandlers = () => {
    // Local state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTaskItem, setSelectedTaskItem] = useState<TaskItem | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<Status | null>(null);

    // Context access
    const {
        taskItems,
        loading,
        error,
        reorderTaskItems,
        createTaskItem,
        updateTaskItem,
        deleteTaskItem
    } = useTaskItemContext();

    // Handling submission of creating a new task
    const handleCreateSubmitBtn = async (taskItemData: Partial<TaskItem>) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // Converting partial taskItem data to required format
            const createData = taskItemData as Omit<TaskItem, 'id' | 'createdDate'>;
            // Creating task via context
            await createTaskItem(createData);
            setIsModalOpen(false);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handling submission of editing an existing task
    const handleEditSubmitBtn = async (taskItemData: Partial<TaskItem>) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            if (selectedTaskItem) {
                await updateTaskItem({...taskItemData, id: selectedTaskItem.id} as TaskItem);
                setIsModalOpen(false);
                setSelectedTaskItem(undefined);
            }
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to update task');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handling clicking on edit button
    const handleTaskItemEditBtn = (task: TaskItem) => {
        setSelectedTaskItem(task);
        setSubmitError(null);
        setIsModalOpen(true);
    };

    const handleTaskItemDeleteBtn = (task: TaskItem) => {
        setSelectedTaskItem(task);
        setSubmitError(null);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmBtn = async () => {
        if (!selectedTaskItem) {
            return;
        }
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await deleteTaskItem(selectedTaskItem.id);
            setIsDeleteModalOpen(false);
            setSelectedTaskItem(undefined);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to delete task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCancelBtn = () => {
        setIsDeleteModalOpen(false);
        setSelectedTaskItem(undefined);
        setSubmitError(null);
    };

    // Handling drag and drop reordering
    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            const oldIndex = taskItems.findIndex(taskItem => taskItem.id.toString() === active.id);
            const newIndex = taskItems.findIndex(taskItem => taskItem.id.toString() === over.id);
            reorderTaskItems(oldIndex, newIndex);
        }
    };

    // Handler for Add New Task button
    const handleAddNewTaskBtn = () => {
        setSelectedTaskItem(undefined);
        setSubmitError(null);
        setIsModalOpen(true);
    };

    // Handler for modal close
    const handleModalCloseBtn = () => {
        setIsModalOpen(false);
        setSelectedTaskItem(undefined);
        setSubmitError(null);
    };

    // Filter tasks based on the selected status
    const filteredTaskItems = useMemo(() => {
        if (statusFilter === null) {
            return taskItems;
        }
        return taskItems.filter(task => task.status === statusFilter);
    }, [taskItems, statusFilter]);

    // Handler for status filter changes
    const handleStatusFilterChange = (status: Status | null) => {
        setStatusFilter(status);
    };

    return {
        // State
        taskItems: filteredTaskItems,
        statusFilter,
        loading,
        error,
        isModalOpen,
        selectedTaskItem,
        isSubmitting,
        submitError,
        isDeleteModalOpen,

        // Handlers
        handleCreateSubmitBtn,
        handleEditSubmitBtn,
        handleTaskItemEditBtn,
        handleTaskItemDeleteBtn,
        handleDeleteConfirmBtn,
        handleDeleteCancelBtn,
        handleDragEnd,
        handleAddNewTaskBtn,
        handleModalCloseBtn,
        handleStatusFilterChange
    };
};
