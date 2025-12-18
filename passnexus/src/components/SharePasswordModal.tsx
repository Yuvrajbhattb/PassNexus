import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Friend } from '../types/index';
import type { PasswordEntry } from '../types/index';

interface SharePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    friend: Friend;
    passwords: PasswordEntry[];
    onShare: (password: PasswordEntry) => Promise<void>;
    isLoading?: boolean;
}

export default function SharePasswordModal({
    isOpen,
    onClose,
    friend,
    passwords,
    onShare,
    isLoading = false
}: SharePasswordModalProps) {
    const [selectedPasswordId, setSelectedPasswordId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!selectedPasswordId) {
            alert('Please select a password to share');
            return;
        }

        const password = passwords.find(p => p.id === selectedPasswordId);
        if (!password) return;

        setIsSending(true);
        try {
            await onShare(password);
            onClose();
            setSelectedPasswordId(null);
        } catch (error) {
            console.error('Failed to share password:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full mx-4 border border-neon-blue/30 shadow-lg max-h-[80vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">📤</span>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Share Password</h2>
                                <p className="text-sm text-gray-400">
                                    with {friend.name} ({friend.address.slice(0, 6)}...{friend.address.slice(-4)})
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Password List */}
                    <div className="space-y-3 mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select a password to share:
                        </label>

                        {passwords.length === 0 ? (
                            <div className="bg-slate-700/30 rounded-lg p-8 text-center">
                                <p className="text-gray-400">No passwords available to share</p>
                                <p className="text-sm text-gray-500 mt-2">Add passwords to your vault first</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {passwords.map((password) => (
                                    <motion.div
                                        key={password.id}
                                        whileHover={{ scale: 1.02 }}
                                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedPasswordId === password.id
                                                ? 'bg-neon-blue/10 border-neon-blue'
                                                : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                                            }`}
                                        onClick={() => setSelectedPasswordId(password.id)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        checked={selectedPasswordId === password.id}
                                                        onChange={() => setSelectedPasswordId(password.id)}
                                                        className="text-neon-blue"
                                                    />
                                                    <h3 className="font-semibold text-white">{password.title}</h3>
                                                </div>
                                                <p className="text-sm text-gray-400 ml-6 mt-1">
                                                    Username: {password.username}
                                                </p>
                                                {password.url && (
                                                    <p className="text-xs text-gray-500 ml-6 mt-1">
                                                        {password.url}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {password.encryptionMode === 'argon2' && (
                                                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded">
                                                        Argon2
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isSending}
                            className="flex-1 px-4 py-3 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors font-semibold disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!selectedPasswordId || isSending || passwords.length === 0}
                            className="flex-1 px-4 py-3 bg-neon-blue text-slate-900 rounded-lg hover:bg-blue-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSending ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <span>📤</span>
                                    Send Password
                                </>
                            )}
                        </button>
                    </div>

                    {/* Info */}
                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                        <p className="text-xs text-blue-300">
                            🔒 The password will be encrypted and sent via XMTP. Only {friend.name} will be able to decrypt it.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
