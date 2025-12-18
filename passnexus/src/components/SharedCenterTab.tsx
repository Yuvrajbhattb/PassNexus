import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useXMTP } from '../hooks/useXMTP';
import { useStorage } from '../hooks/useStorage';
import { decryptData } from '../utils/encryption';
import type { Account } from 'thirdweb/wallets';

interface SharedPasswordCardProps {
    title: string;
    username: string;
    encryptedPassword: string;
    sharedBy: string;
    ipfsCid: string;
    masterKey: string | null;
    onDecrypt: (password: string) => void;
}

function SharedPasswordCard({ title, username, encryptedPassword, sharedBy, masterKey, onDecrypt }: SharedPasswordCardProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);

    const handleReveal = async () => {
        if (isRevealed) {
            setIsRevealed(false);
            setDecryptedPassword(null);
        } else {
            const toastId = toast.loading('Decrypting shared password...');
            setIsDecrypting(true);
            try {
                if (!masterKey) {
                    throw new Error('Master key not initialized');
                }

                // Decrypt the password using the master key
                const password = decryptData<string>(encryptedPassword, masterKey);
                setDecryptedPassword(password);
                setIsRevealed(true);
                onDecrypt(password);
                toast.success('Successfully Decrypted!', { id: toastId });
            } catch (error) {
                console.error('Failed to decrypt:', error);
                toast.error('Decryption Failed: Wrong Key', { id: toastId });
            } finally {
                setIsDecrypting(false);
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
                        <p className="text-neon-blue font-mono mb-2">{decryptedPassword}</p>
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                            <span className="text-lg">✓</span>
                            <span className="font-medium">Verified & Decrypted from IPFS</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button
                onClick={handleReveal}
                disabled={isDecrypting || !masterKey}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isDecrypting ? (
                    <>⏳ Decrypting...</>
                ) : isRevealed ? (
                    <>👁️ Hide Password</>
                ) : (
                    <>👁️ Reveal Password</>
                )}
            </button>
        </motion.div>
    );
}

interface IncomingPasswordCardProps {
    title: string;
    username: string;
    encryptedPassword: string;
    sharedBy: string;
    ipfsCid: string;
    masterKey: string | null;
    onSaveToVault: () => Promise<void>;
}

function IncomingPasswordCard({ title, username, encryptedPassword, sharedBy, masterKey, onSaveToVault }: IncomingPasswordCardProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleView = async () => {
        if (isRevealed) {
            setIsRevealed(false);
            setDecryptedPassword(null);
        } else if (!masterKey) {
            toast.error('Master key not initialized');
            return;
        } else {
            const toastId = toast.loading('Decrypting password...');
            setIsDecrypting(true);
            try {
                const password = decryptData<string>(encryptedPassword, masterKey);
                setDecryptedPassword(password);
                setIsRevealed(true);
                toast.success('Successfully Decrypted!', { id: toastId });
            } catch (error) {
                console.error('Failed to decrypt:', error);
                toast.error('Decryption Failed', { id: toastId });
            } finally {
                setIsDecrypting(false);
            }
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSaveToVault();
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-6"
        >
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔑</span>
                <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">Incoming Credential</h4>
                    <p className="text-sm text-gray-400">From: {sharedBy.slice(0, 6)}...{sharedBy.slice(-4)}</p>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Title</label>
                    <p className="text-white font-medium">{title}</p>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Username</label>
                    <p className="text-white">{username}</p>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Password</label>
                    {isRevealed && decryptedPassword ? (
                        <div>
                            <p className="text-neon-blue font-mono mb-2">{decryptedPassword}</p>
                            <div className="flex items-center gap-2 text-green-400 text-sm">
                                <span className="text-lg">✓</span>
                                <span className="font-medium">Decrypted</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400">••••••••</p>
                    )}
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleView}
                    disabled={isDecrypting}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isDecrypting ? '⏳' : isRevealed ? '👁️' : '👁️'}
                    {isDecrypting ? 'Decrypting...' : isRevealed ? 'Hide' : 'View'}
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 bg-neon-blue hover:bg-blue-400 text-slate-900 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? '⏳' : '💾'}
                    {isSaving ? 'Saving...' : 'Save to Vault'}
                </button>
            </div>
        </motion.div>
    );
}

interface SharedCenterTabProps {
    account: Account | undefined;
}

export default function SharedCenterTab({ account }: SharedCenterTabProps) {
    const [activeSubTab, setActiveSubTab] = useState<'received' | 'sent' | 'passwords'>('received');

    const {
        isInitialized,
        isLoading,
        error,
        sharedPasswords,
        friendRequests,
        initializeXMTP,
        refreshMessages,
        sendRequestAccepted
    } = useXMTP(account);

    const {
        initializeMasterKey,
        addFriend,
        addPassword,
        sharedHistory,
        updateSharedHistoryStatus,
        removeSharedHistoryItem
    } = useStorage(account);

    const [masterKey, setMasterKey] = useState<string | null>(null);

    const handleInitialize = async () => {
        await initializeXMTP();
        const key = await initializeMasterKey('standard');
        setMasterKey(key);
    };

    const handleRefresh = async () => {
        await refreshMessages();
        if (!masterKey) {
            const key = await initializeMasterKey('standard');
            setMasterKey(key);
        }
    };

    const handleAcceptRequest = async (request: typeof friendRequests[0]) => {
        try {
            const toastId = toast.loading('Accepting friend request...');
            await addFriend(request.from, request.name, request.email);

            if (account) {
                await sendRequestAccepted(
                    request.from,
                    request.email || 'You',
                    account.address
                );
            }

            const historyItem = sharedHistory.find(
                item => item.type === 'Friend Request' && item.from === request.from
            );
            if (historyItem) {
                updateSharedHistoryStatus(historyItem.id, 'Accepted');
            }

            toast.success('Friend request accepted!', { id: toastId });
            await refreshMessages();
        } catch (error) {
            console.error('Failed to accept friend request:', error);
            toast.error('Failed to accept friend request');
        }
    };

    const handleIgnoreRequest = async (request: typeof friendRequests[0]) => {
        try {
            const historyItem = sharedHistory.find(
                item => item.type === 'Friend Request' && item.from === request.from
            );
            if (historyItem) {
                removeSharedHistoryItem(historyItem.id);
            }

            toast.success('Friend request ignored');
            await refreshMessages();
        } catch (error) {
            console.error('Failed to ignore friend request:', error);
            toast.error('Failed to ignore friend request');
        }
    };

    const handleSaveToVault = async (share: typeof sharedPasswords[0]) => {
        try {
            if (!masterKey) {
                toast.error('Master key not initialized');
                return;
            }

            const toastId = toast.loading('Saving to vault...');

            // Decrypt the password
            const decrypted = decryptData<string>(share.encryptedPassword, masterKey);

            // Save using addPassword
            await addPassword(
                share.title,
                share.username,
                decrypted,
                undefined,
                'standard'
            );

            toast.success(`"${share.title}" saved to your vault!`, { id: toastId });
        } catch (error) {
            console.error('Failed to save to vault:', error);
            toast.error('Failed to save to vault');
        }
    };

    // Filter shared history
    const sentItems = sharedHistory.filter(item => item.to);

    const subTabs = [
        { id: 'received' as const, label: 'Received', icon: '📥', count: friendRequests.length + sharedPasswords.length },
        { id: 'sent' as const, label: 'Sent', icon: '📤', count: sentItems.length },
        { id: 'passwords' as const, label: 'Passwords', icon: '🔑', count: sharedPasswords.length },
    ];

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

            {/* Shared Passwords with Save to Vault */}
            {isInitialized && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
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
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white mb-4">
                                Incoming Credentials ({sharedPasswords.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sharedPasswords.map((share, index) => (
                                    <IncomingPasswordCard
                                        key={`${share.sharedBy}-${index}`}
                                        title={share.title}
                                        username={share.username}
                                        encryptedPassword={share.encryptedPassword}
                                        sharedBy={share.sharedBy}
                                        ipfsCid={share.ipfsCid}
                                        masterKey={masterKey}
                                        onSaveToVault={async () => await handleSaveToVault(share)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
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
