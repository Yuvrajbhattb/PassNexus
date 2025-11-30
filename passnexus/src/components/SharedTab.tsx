import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useXMTP } from '../hooks/useXMTP';
import type { Account } from 'thirdweb/wallets';

interface SharedPasswordCardProps {
    title: string;
    username: string;
    encryptedPassword: string;
    sharedBy: string;
    ipfsCid: string;
    onDecrypt: (password: string) => void;
}

function SharedPasswordCard({ title, username, encryptedPassword, sharedBy, onDecrypt }: SharedPasswordCardProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null);

    const handleReveal = () => {
        if (isRevealed) {
            setIsRevealed(false);
            setDecryptedPassword(null);
        } else {
            try {
                // Note: In production, you'd need the proper master key
                // For now, this is a simplified approach
                const password = encryptedPassword; // Would decrypt here
                setDecryptedPassword(password);
                setIsRevealed(true);
                onDecrypt(password);
            } catch (error) {
                console.error('Failed to decrypt:', error);
                alert('Failed to decrypt password');
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-neon-blue/20 hover:border-neon-blue/40 transition-all"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🔑</span>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <p className="text-sm text-gray-400">Shared by {sharedBy}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3 mb-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Username</label>
                    <p className="text-white">{username}</p>
                </div>

                {isRevealed && decryptedPassword && (
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Password</label>
                        <p className="text-neon-blue font-mono">{decryptedPassword}</p>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button
                onClick={handleReveal}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                {isRevealed ? (
                    <>👁️ Hide Password</>
                ) : (
                    <>👁️ Reveal Password</>
                )}
            </button>
        </motion.div>
    );
}

interface SharedTabProps {
    account: Account | undefined;
}

export default function SharedTab({ account }: SharedTabProps) {
    const { isInitialized, isLoading, error, sharedPasswords, initializeXMTP, refreshMessages } = useXMTP(account);

    const handleInitialize = async () => {
        await initializeXMTP();
    };

    const handleRefresh = async () => {
        await refreshMessages();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Shared with Me</h2>
                    <p className="text-gray-400 text-sm">
                        Passwords and credentials shared with you via XMTP
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={!isInitialized || isLoading}
                    className="px-4 py-2 bg-neon-blue text-slate-900 rounded-lg hover:bg-blue-400 transition-colors font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
                    Refresh
                </button>
            </div>

            {/* XMTP Not Initialized */}
            {!isInitialized && !isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center"
                >
                    <div className="text-6xl mb-4">📡</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        XMTP Not Connected
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Initialize your secure inbox to view shared passwords
                    </p>

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 mb-4">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <motion.button
                        onClick={handleInitialize}
                        disabled={!account}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-neon-blue text-slate-900 font-semibold rounded-lg hover:bg-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {!account ? 'Connect Wallet First' : '🔐 Initialize Secure Inbox'}
                    </motion.button>
                </motion.div>
            )}

            {/* Loading State */}
            {isLoading && !isInitialized && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-800/30 backdrop-blur-sm border border-neon-blue/50 rounded-xl p-12 text-center"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                Decrypting XMTP Keys...
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Please approve the signature request in your wallet
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Shared Passwords Grid */}
            {isInitialized && !isLoading && (
                <>
                    {sharedPasswords.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center"
                        >
                            <div className="text-6xl mb-4">🤝</div>
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">
                                No shared passwords yet
                            </h3>
                            <p className="text-gray-500 mb-4">
                                When friends share passwords with you, they'll appear here
                            </p>
                            <button
                                onClick={handleRefresh}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors text-sm"
                            >
                                Check for New Shares
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sharedPasswords.map((share, index) => (
                                <SharedPasswordCard
                                    key={`${share.sharedBy}-${index}`}
                                    title={share.title}
                                    username={share.username}
                                    encryptedPassword={share.encryptedPassword}
                                    sharedBy={share.sharedBy}
                                    ipfsCid={share.ipfsCid}
                                    onDecrypt={(password) => {
                                        console.log('Decrypted:', password);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Refreshing Indicator */}
            {isInitialized && isLoading && (
                <div className="bg-neon-blue/10 border border-neon-blue/30 rounded-lg p-3 text-center">
                    <p className="text-neon-blue text-sm font-medium">
                        <span className="animate-spin inline-block mr-2">🔄</span>
                        Checking for new messages...
                    </p>
                </div>
            )}
        </div>
    );
}
