import {LOADING_MESSAGES} from "../constants";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    TouchSensor
} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {SortableTaskItem} from './SortableTaskItem';
import {TaskItemModal} from "./TaskItemModal";
import {DeleteConfirmationModal} from "./DeleteConfirmationModal";
import {TaskStatusFilter} from './TaskItemStatusFilter';
import {useTaskItemHandlers} from '../hooks/useTaskItemHandlers';
import {getStatusLabel} from "../utils/statusUtils.ts";

export const TaskItemList = () => {
    const {
        // State
        taskItems,
        loading,
        error,
        isModalOpen,
        selectedTaskItem,
        isSubmitting,
        submitError,
        isDeleteModalOpen,
        statusFilter,

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
    } = useTaskItemHandlers();

    // Configuring drag and drop sensors
    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            }
        }),
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            }
        })
    );

    // Showing the loading state
    if (loading) {
        return <div className="text-center py-8 text-gray-600">{LOADING_MESSAGES.LOADING_TASKS}</div>;
    }

    // Showing the error state
    if (error) {
        return <div className="text-center py-8 text-red-600">Error: {error}</div>;
    }

    return (
        <>
            {/* Main container with styling */}
            <div className="bg-white rounded-lg shadow">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">My Tasks</h2>
                    <div
                        className="flex flex-col items-end sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <TaskStatusFilter
                            selectedStatus={statusFilter}
                            onStatusChange={handleStatusFilterChange}
                        />

                        {/* Add new task button */}
                        <button
                            onClick={handleAddNewTaskBtn}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                            Add New Task
                        </button>
                    </div>
                </div>
                {/* Drag and Drop Context Provider */}
                <DndContext
                    sensors={sensors} // Use configured sensors
                    collisionDetection={closestCenter} // Determine drop target
                    onDragEnd={handleDragEnd} // Handle drag completion
                >
                    {/*Sortable Context for list management*/}
                    <SortableContext
                        items={taskItems.map(taskItem => taskItem.id.toString())}
                        strategy={verticalListSortingStrategy}
                    >
                        {/*If no taskItems are present*/}
                        {taskItems.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {statusFilter !== null
                                    ? `No ${getStatusLabel(statusFilter)} tasks found.`
                                    : 'No tasks yet. Create one to get started!'}
                            </div>

                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {/*Mapping existing taskItems into SortableTaskItem*/}
                                {taskItems.map((taskItem) => (
                                    <SortableTaskItem
                                        key={taskItem.id}
                                        taskItem={taskItem}
                                        onEdit={handleTaskItemEditBtn}
                                        onDelete={handleTaskItemDeleteBtn}
                                    />
                                ))}
                            </ul>
                        )}
                    </SortableContext>
                </DndContext>
            </div>

            <TaskItemModal
                isModalOpen={isModalOpen}
                onModalClose={handleModalCloseBtn}
                onModalSubmit={(taskItemData) => {
                    if (selectedTaskItem) {
                        handleEditSubmitBtn(taskItemData); //Handling edit
                    } else {
                        handleCreateSubmitBtn(taskItemData); //Handling create
                    }
                }}
                taskItem={selectedTaskItem} //Passing selected task for editing
                isSubmitting={isSubmitting} //Loading state
                submitError={submitError} //Error state
            />
            {selectedTaskItem && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    taskItem={selectedTaskItem!}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                    onConfirm={handleDeleteConfirmBtn}
                    onCancel={handleDeleteCancelBtn}
                />
            )}
        </>
    );
};
