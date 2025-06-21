import {LOADING_MESSAGES} from "../constants";
import {useTaskItemContext} from '../contexts/TaskItemContext';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent, TouchSensor
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {SortableTaskItem} from './SortableTaskItem';

export const TaskItemList = () => {
    const {taskItems, loading, error, reorderTaskItems} = useTaskItemContext();

    const sensors = useSensors(
        useSensor(TouchSensor, {
            // Requires the user to press for 200ms before drag starts
            activationConstraint: {
                distance: 0,
            }
        }),
        useSensor(PointerSensor, {
            // For desktop devices
            activationConstraint: {
                distance: 8,
            }
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            const oldIndex = taskItems.findIndex(taskItem => taskItem.id.toString() === active.id);
            const newIndex = taskItems.findIndex(taskItem => taskItem.id.toString() === over.id);
            reorderTaskItems(oldIndex, newIndex);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">{LOADING_MESSAGES.LOADING_TASKS}</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <h2 className="text-xl font-semibold p-4 border-b">My Tasks</h2>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={taskItems.map(taskItem => taskItem.id.toString())}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="divide-y divide-gray-200">
                        {taskItems.map((taskItem) => (
                            <SortableTaskItem
                                key={taskItem.id}
                                task={taskItem}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    );
};