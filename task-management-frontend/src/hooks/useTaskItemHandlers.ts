import {useMemo, useState} from 'react';
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

    /**
     * Handles the creation of a new task
     * @param taskItemData - Data for the new task
     */
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
            setSubmitError(error instanceof Error ? error.message : ERROR_MESSAGES.CREATE_TASK_FAILED);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handles the update of an existing task
     * @param taskItemData - Updated data for the task
     */
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
            setSubmitError(error instanceof Error ? error.message : ERROR_MESSAGES.UPDATE_TASK_FAILED);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Opens the edit modal for a selected task
     * @param taskItem - The task to edit
     */
    const handleTaskItemEditBtn = (taskItem: TaskItem) => {
        setSelectedTaskItem(taskItem);
        setSubmitError(null);
        setIsModalOpen(true);
    };

    /**
     * Opens the delete confirmation modal for a selected taskItem
     * @param taskItem - The taskItem to delete
     */
    const handleTaskItemDeleteBtn = (taskItem: TaskItem) => {
        setSelectedTaskItem(taskItem);
        setSubmitError(null);
        setIsDeleteModalOpen(true);
    };

    /**
     * Confirms and executes task deletion
     */
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
            setSubmitError(error instanceof Error ? error.message : ERROR_MESSAGES.DELETE_TASK_FAILED);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handles task reordering after drag and drop
     * @param event - Drag end event containing source and destination info
     */
    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            const oldIndex = taskItems.findIndex(taskItem => taskItem.id.toString() === active.id);
            const newIndex = taskItems.findIndex(taskItem => taskItem.id.toString() === over.id);
            reorderTaskItems(oldIndex, newIndex);
        }
    };

    /**
     * Opens the task creation modal
     */
    const handleAddNewTaskBtn = () => {
        setSelectedTaskItem(undefined);
        setSubmitError(null);
        setIsModalOpen(true);
    };

    /**
     * Closes the task modal (create/edit/delete)
     */
    const handleModalCloseBtn = () => {
        setIsModalOpen(false);
        setSelectedTaskItem(undefined);
        setSubmitError(null);
    };

    /**
     * Filters tasks based on selected status
     * Memoized to prevent unnecessary recalculation
     */
    const filteredTaskItems = useMemo(() => {
        if (statusFilter === null) {
            return taskItems;
        }
        return taskItems.filter(task => task.status === statusFilter);
    }, [taskItems, statusFilter]);

    /**
     * Updates the status filter
     * @param status - The status to filter by, or null for all tasks
     */
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
        handleDragEnd,
        handleAddNewTaskBtn,
        handleModalCloseBtn,
        handleStatusFilterChange
    };
};
