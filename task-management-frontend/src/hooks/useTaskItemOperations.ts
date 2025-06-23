import {useCallback, useMemo, useState} from 'react';
import type {TaskItem} from '../types/TaskItem';
import {useTaskItemContext} from '../contexts/TaskItemContext';
import type {DragEndEvent} from '@dnd-kit/core';
import type {Status} from "../enums/Status.ts";
import {ERROR_MESSAGES} from "../constants.ts";

/**
 * Custom hook to manage task item operations and state
 *
 * Provides state and handlers for task operations like create, update, delete,
 * reordering via drag-and-drop, and filtering by status.
 *
 * @returns Object containing task state and handler functions
 */

export const useTaskItemOperations = () => {
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

    const resetModalState = useCallback(() => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedTaskItem(undefined);
        setSubmitError(null);
        setIsSubmitting(false);
    }, []);

    /**
     * Filters tasks based on selected status
     * Memoized to prevent unnecessary recalculation
     */
    const filteredTaskItems = useMemo(() => {
        if (statusFilter === null) return taskItems;
        return taskItems.filter(task => task.status === statusFilter);
    }, [taskItems, statusFilter]);

    /**
     * Handles the creation of a new task
     * @param taskItemData - Data for the new task
     */
    const handleCreateSubmitBtn = useCallback(async (taskItemData: Partial<TaskItem>) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // Converting partial taskItem data to required format
            const createData = taskItemData as Omit<TaskItem, 'id' | 'createdDate'>;
            // Creating task via context
            await createTaskItem(createData);
            resetModalState();
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : ERROR_MESSAGES.CREATE_TASK_FAILED);
        } finally {
            setIsSubmitting(false);
        }
    }, [createTaskItem, resetModalState]);

    /**
     * Handles the update of an existing task
     * @param taskItemData - Updated data for the task
     */
    const handleEditSubmitBtn = useCallback(async (taskItemData: Partial<TaskItem>) => {
        if (!selectedTaskItem) return;

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await updateTaskItem({...taskItemData, id: selectedTaskItem.id} as TaskItem);
            resetModalState();
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : ERROR_MESSAGES.UPDATE_TASK_FAILED);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedTaskItem, updateTaskItem, resetModalState]);

    /**
     * Opens the edit modal for a selected task
     * @param taskItem - The task to edit
     */
    const handleTaskItemEditBtn = useCallback((taskItem: TaskItem) => {
        setSelectedTaskItem(taskItem);
        setSubmitError(null);
        setIsModalOpen(true);
    }, []);

    /**
     * Opens the delete confirmation modal for a selected taskItem
     * @param taskItem - The taskItem to delete
     */
    const handleTaskItemDeleteBtn = useCallback((taskItem: TaskItem) => {
        setSelectedTaskItem(taskItem);
        setSubmitError(null);
        setIsDeleteModalOpen(true);
    }, []);

    /**
     * Confirms and executes task deletion
     */
    const handleDeleteConfirmBtn = useCallback(async () => {
        if (!selectedTaskItem) return;

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await deleteTaskItem(selectedTaskItem.id);
            resetModalState();
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : ERROR_MESSAGES.DELETE_TASK_FAILED);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedTaskItem, deleteTaskItem, resetModalState]);

    /**
     * Handles task reordering after drag and drop
     * @param event - Drag end event containing source and destination info
     */
    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const {active, over} = event;
        if (over && active.id !== over.id) {
            const oldIndex = filteredTaskItems.findIndex(taskItem => taskItem.id.toString() === active.id);
            const newIndex = filteredTaskItems.findIndex(taskItem => taskItem.id.toString() === over.id);
            reorderTaskItems(oldIndex, newIndex);
        }
    }, [filteredTaskItems, reorderTaskItems]);


    /**
     * Opens the task creation modal
     */
    const handleAddNewTaskBtn = useCallback(() => {
        setSelectedTaskItem(undefined);
        setSubmitError(null);
        setIsModalOpen(true);
    }, []);

    /**
     * Updates the status filter
     * @param status - The status to filter by, or null for all tasks
     */
    const handleStatusFilterChange = useCallback((status: Status | null) => {
        setStatusFilter(status);
    }, []);

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
        handleDragEnd,
        handleAddNewTaskBtn,
        handleModalCloseBtn: resetModalState,
        handleStatusFilterChange
    };
};
