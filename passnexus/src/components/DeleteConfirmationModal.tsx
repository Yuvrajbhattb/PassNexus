import { motion, AnimatePresence } from 'framer-motion';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Item?",
    message = "Are you sure you want to delete this item? This action cannot be undone."
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-red-500/30 shadow-lg shadow-red-900/20"
                >
                    <div className="flex items-center gap-3 mb-4 text-red-400">
                        <span className="text-3xl">⚠️</span>
                        <h2 className="text-xl font-bold">{title}</h2>
                    </div>

                    <p className="text-gray-300 mb-6">
                        {message}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
