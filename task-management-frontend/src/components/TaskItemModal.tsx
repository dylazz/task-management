import {useState, useEffect} from 'react';
import {type TaskItem} from '../types/TaskItem';
import {Priority} from '../enums/Priority';
import {Status} from '../enums/Status';
import * as React from "react";

interface TaskItemModalProps {
    isModalOpen: boolean;
    onModalClose: () => void;
    onModalSubmit: (task: Partial<TaskItem>) => void;
    taskItem?: TaskItem; // Optional task for editing mode
    isSubmitting: boolean;
    submitError: string | null;
}

export const TaskItemModal = ({isModalOpen, onModalClose, onModalSubmit, taskItem}: TaskItemModalProps) => {
    const [formData, setFormData] = useState<Partial<TaskItem>>({
        title: '',
        description: '',
        priority: Priority.Low,
        status: Status.Todo
    });

    // Reset form when modal opens/closes or when task changes
    useEffect(() => {
        if (taskItem) {
            setFormData(taskItem);
        } else {
            setFormData({
                title: '',
                description: '',
                priority: Priority.Low,
                status: Status.Todo
            });
        }
    }, [taskItem, isModalOpen]);

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onModalSubmit(formData);
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                        {taskItem ? 'Edit Task' : 'Create New Task'}
                    </h3>
                    <button
                        onClick={onModalClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleModalSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                            Priority
                        </label>
                        <select
                            id="priority"
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: Number(e.target.value) as Priority})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value={Priority.Low}>Low</option>
                            <option value={Priority.Medium}>Medium</option>
                            <option value={Priority.High}>High</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: Number(e.target.value) as Status})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value={Status.Todo}>To Do</option>
                            <option value={Status.InProgress}>In Progress</option>
                            <option value={Status.Done}>Done</option>
                        </select>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onModalClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                            {taskItem ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

