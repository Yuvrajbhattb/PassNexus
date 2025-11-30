import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PasswordEntry } from '../types';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface VaultItemProps {
    entry: PasswordEntry;
    onDecrypt: (entry: PasswordEntry) => Promise<string>;
    onDelete: (id: string) => void;
}

export default function VaultItem({ entry, onDecrypt, onDelete }: VaultItemProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleTogglePassword = async () => {
        if (!showPassword && !decryptedPassword) {
            setIsDecrypting(true);
            try {
                const password = await onDecrypt(entry);
                setDecryptedPassword(password);
                setShowPassword(true);
            } catch (error) {
                console.error('Failed to decrypt:', error);
                alert('Failed to decrypt password');
            } finally {
                setIsDecrypting(false);
            }
        } else {
            setShowPassword(!showPassword);
        }
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        await onDelete(entry.id);
        setShowDeleteModal(false);
    };

    // Get encryption mode (default to 'standard' for backward compatibility)
    const encryptionMode = entry.encryptionMode || 'standard';
    const isArgon2 = encryptionMode === 'argon2';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-neon-blue/30 transition-colors"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                        {/* Encryption Mode Badge */}
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full ${isArgon2
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}
                            title={isArgon2 ? 'Quantum Resistant (Argon2)' : 'Standard (PBKDF2)'}
                        >
                            {isArgon2 ? '🛡️ Quantum' : '🔒 Standard'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">{entry.username}</p>
                    {entry.url && (
                        <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-neon-blue hover:underline mt-1 inline-block"
                        >
                            {entry.url}
                        </a>
                    )}
                </div>
                <button
                    onClick={handleDelete}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                    title="Delete"
                >
                    🗑️
                </button>
            </div>

            <div className="space-y-2">
                {/* Password field */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-700/50 rounded px-3 py-2 font-mono text-sm">
                        {isDecrypting ? (
                            <span className="text-gray-400">
                                {isArgon2 ? 'Decrypting (High Security)...' : 'Decrypting...'}
                            </span>
                        ) : showPassword && decryptedPassword ? (
                            <span className="text-white">{decryptedPassword}</span>
                        ) : (
                            <span className="text-gray-500">••••••••••••</span>
                        )}
                    </div>

                    <button
                        onClick={handleTogglePassword}
                        disabled={isDecrypting}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors disabled:opacity-50"
                        title={showPassword ? 'Hide' : 'Show'}
                    >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>

                    <button
                        onClick={() => handleCopy(decryptedPassword || '')}
                        disabled={!decryptedPassword}
                        className="px-3 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Copy"
                    >
                        {copied ? '✓' : '📋'}
                    </button>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-slate-700">
                    <span>Created: {new Date(entry.createdAt).toLocaleDateString()}</span>
                    {entry.ipfsCid && (
                        <span className="font-mono" title={entry.ipfsCid}>
                            IPFS: {entry.ipfsCid.substring(0, 8)}...
                        </span>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Password?"
                message={`Are you sure you want to delete "${entry.title}"? This action cannot be undone.`}
            />
        </motion.div>
    );
}
