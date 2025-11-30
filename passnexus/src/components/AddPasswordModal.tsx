import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, username: string, password: string, url?: string, encryptionMode?: 'standard' | 'argon2') => Promise<void>;
}

export default function AddPasswordModal({ isOpen, onClose, onSave }: AddPasswordModalProps) {
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [url, setUrl] = useState('');
    const [encryptionMode, setEncryptionMode] = useState<'standard' | 'argon2'>('standard');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !username || !password) {
            alert('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            await onSave(title, username, password, url || undefined, encryptionMode);
            // Reset form
            setTitle('');
            setUsername('');
            setPassword('');
            setUrl('');
            setEncryptionMode('standard');
            onClose();
        } catch (error) {
            console.error('Failed to save password:', error);
            alert('Failed to save password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-white mb-6">Add New Password</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Title <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Gmail Account"
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue"
                                        required
                                    />
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Username/Email <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="user@example.com"
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Password <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                {/* URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Website URL (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue"
                                    />
                                </div>

                                {/* Encryption Mode */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Encryption Method
                                    </label>
                                    <select
                                        value={encryptionMode}
                                        onChange={(e) => setEncryptionMode(e.target.value as 'standard' | 'argon2')}
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                                    >
                                        <option value="standard">🔒 Standard (AES-256 + PBKDF2) - Fast</option>
                                        <option value="argon2">🛡️ Quantum Resistant (AES-256 + Argon2) - Maximum Security</option>
                                    </select>
                                </div>

                                {/* Argon2 Warning */}
                                {encryptionMode === 'argon2' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3"
                                    >
                                        <p className="text-sm text-amber-300">
                                            ⚠️ <strong>Note:</strong> Decrypting this password will take 1-2 seconds due to high security.
                                        </p>
                                    </motion.div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 bg-neon-blue text-slate-900 font-semibold rounded-lg hover:bg-neon-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading
                                            ? (encryptionMode === 'argon2' ? 'Encrypting (High Security)...' : 'Saving...')
                                            : 'Save Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
