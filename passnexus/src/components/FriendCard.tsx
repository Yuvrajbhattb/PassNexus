import { useState } from 'react';
import { motion } from 'framer-motion';
import Blockies from 'react-blockies';
import type { Friend } from '../types/index';

interface FriendCardProps {
    friend: Friend;
    isEditing: boolean;
    editingName: string;
    onStartEdit: () => void;
    onSaveEdit: (name: string) => void;
    onCancelEdit: () => void;
    onEditNameChange: (name: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onShare: () => void;
    onDelete: () => void;
}

export default function FriendCard({
    friend,
    isEditing,
    editingName,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onEditNameChange,
    onKeyDown,
    onShare,
    onDelete
}: FriendCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyAddress = async () => {
        await navigator.clipboard.writeText(friend.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
        >
            <div className="flex items-center gap-4">
                {/* Left Section - Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-600">
                        <Blockies
                            seed={friend.address.toLowerCase()}
                            size={8}
                            scale={5}
                            className="rounded-full"
                        />
                    </div>
                </div>

                {/* Middle Section - Identity */}
                <div className="flex-1 min-w-0">
                    {/* Nickname */}
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={editingName}
                                onChange={(e) => onEditNameChange(e.target.value)}
                                onKeyDown={onKeyDown}
                                className="flex-1 px-2 py-1 bg-slate-700 border border-blue-500 rounded text-white text-sm focus:outline-none"
                                autoFocus
                            />
                            <button
                                onClick={() => onSaveEdit(editingName)}
                                className="text-green-400 hover:text-green-300 transition-colors"
                                title="Save"
                            >
                                ✓
                            </button>
                            <button
                                onClick={onCancelEdit}
                                className="text-gray-400 hover:text-gray-300 transition-colors"
                                title="Cancel"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-sm truncate">
                                {friend.name}
                            </h3>
                            {friend.email && (
                                <span className="px-1.5 py-0.5 bg-green-600/20 border border-green-500/50 rounded text-xs text-green-400 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                    Verified
                                </span>
                            )}
                        </div>
                    )}

                    {/* Wallet Address with Copy */}
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-400 font-mono">
                            {friend.address.slice(0, 6)}...{friend.address.slice(-4)}
                        </p>
                        <button
                            onClick={handleCopyAddress}
                            className="text-gray-500 hover:text-blue-400 transition-colors"
                            title="Copy address"
                        >
                            {copied ? (
                                <span className="text-green-400 text-xs">✓</span>
                            ) : (
                                <span className="text-xs">📋</span>
                            )}
                        </button>
                    </div>

                    {/* Email if available */}
                    {friend.email && !isEditing && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {friend.email}
                        </p>
                    )}
                </div>

                {/* Right Section - Actions */}
                <div className="flex-shrink-0 flex items-center gap-2">
                    {!isEditing && (
                        <>
                            {/* Primary Action - Share */}
                            <button
                                onClick={onShare}
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
                                title="Share password"
                            >
                                <span>📤</span>
                                Share
                            </button>

                            {/* Secondary Actions */}
                            <button
                                onClick={onStartEdit}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                                title="Edit name"
                            >
                                ✎
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                                title="Remove friend"
                            >
                                🗑
                            </button>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
