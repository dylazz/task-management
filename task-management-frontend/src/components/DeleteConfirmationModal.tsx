import type {TaskItem} from '../types/TaskItem';

interface DeleteConfirmationModalProps {
    isModalOpen: boolean;
    taskItem: TaskItem;
    isSubmitting: boolean;
    submitError: string | null;
    onModalConfirm: () => Promise<void>;
    onModalCancel: () => void;
}

/**
 * Modal component for confirming task deletion
 *
 * Provides a confirmation dialog before permanently deleting a task,
 * includes error handling and loading states.
 */


export const DeleteConfirmationModal = ({
                                            isModalOpen,
                                            taskItem,
                                            isSubmitting,
                                            submitError,
                                            onModalConfirm,
                                            onModalCancel
                                        }: DeleteConfirmationModalProps) => {
    // Don't render anything if modal shouldn't be shown or no task is provided
    if (!isModalOpen || !taskItem) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={onModalCancel} // Close when clicking outside the modal
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                onClick={e => e.stopPropagation()} // Prevent clicks from propagating to background
            >
                <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
                <p className="mb-6 text-gray-600">
                    Are you sure you want to delete "{taskItem.title}"? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onModalCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onModalConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>

                {submitError && (
                    <p className="mt-4 text-red-600 text-sm">{submitError}</p>
                )}
            </div>
        </div>
    );
};