import type {TaskItem} from '../types/TaskItem';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    taskItem: TaskItem;
    isSubmitting: boolean;
    submitError: string | null;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

export const DeleteConfirmationModal = ({
                                            isOpen,
                                            taskItem,
                                            isSubmitting,
                                            submitError,
                                            onConfirm,
                                            onCancel
                                        }: DeleteConfirmationModalProps) => {
    if (!isOpen || !taskItem) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onCancel}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
                <p className="mb-6 text-gray-600">
                    Are you sure you want to delete "{taskItem.title}"? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
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