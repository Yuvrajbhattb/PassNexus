import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCodeSVG from 'react-qr-code';
import toast from 'react-hot-toast';
import { getAddressByEmail, isEmailRegistered } from '../contracts/UserRegistry';
import type { Account } from 'thirdweb/wallets';
import type { Friend, PasswordEntry, SharedHistoryItem } from '../types/index';
import { useXMTP } from '../hooks/useXMTP';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import SharePasswordModal from './SharePasswordModal';
import FriendCard from './FriendCard';

interface FriendsTabProps {
    account: Account | undefined;
    userEmail: string | null;
    friends: Friend[];
    passwords: PasswordEntry[];
    onAddFriend: (address: string, name?: string, email?: string) => Promise<boolean>;
    onUpdateFriend: (address: string, name: string) => Promise<void>;
    onDeleteFriend: (address: string) => Promise<boolean>;
    onSharePassword: (password: PasswordEntry, friendAddress: string) => Promise<void>;
    addSharedHistoryItem: (item: Omit<SharedHistoryItem, 'id'>) => SharedHistoryItem;
}

export default function FriendsTab({
    account,
    userEmail,
    friends,
    passwords,
    onAddFriend,
    onUpdateFriend,
    onDeleteFriend,
    onSharePassword,
    addSharedHistoryItem
}: FriendsTabProps) {
    // Debug logging to track friends list
    console.log('🔍 FriendsTab render - Current Friends List:', friends);
    console.log('🔍 Friends count:', friends.length);

    // Initialize XMTP for friend requests
    const { sendFriendRequest, initializeXMTP, isInitialized } = useXMTP(account);

    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState<{ email: string; address: string } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [friendAdded, setFriendAdded] = useState(false);
    const [requestSent, setRequestSent] = useState(false); // New state for request sent
    const [searchStatus, setSearchStatus] = useState<'found' | 'notFound' | 'duplicate' | null>(null);

    // Editing state
    const [editingAddress, setEditingAddress] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    // Delete confirmation state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [friendToDelete, setFriendToDelete] = useState<string | null>(null);

    // Share password modal state
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedFriendForShare, setSelectedFriendForShare] = useState<Friend | null>(null);

    // Check if input is a valid Ethereum address
    const isValidAddress = (input: string): boolean => {
        return /^0x[a-fA-F0-9]{40}$/.test(input);
    };

    // Check if address is already in friends list
    const isAlreadyFriend = (address: string): boolean => {
        return friends.some(f => f.address.toLowerCase() === address.toLowerCase());
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchInput) return;

        setSearchStatus(null);

        // If it's a valid address, show it immediately
        if (isValidAddress(searchInput)) {
            setSearchResult({ email: '', address: searchInput });
            setFriendAdded(false);

            // Check if already a friend
            if (isAlreadyFriend(searchInput)) {
                setSearchStatus('duplicate');
            } else {
                setSearchStatus('found');
            }
            return;
        }

        // If it contains '@', treat it as an email
        if (searchInput.includes('@')) {
            setIsSearching(true);
            setSearchResult(null);
            setFriendAdded(false);

            try {
                const isRegistered = await isEmailRegistered(searchInput);
                if (isRegistered) {
                    const address = await getAddressByEmail(searchInput);
                    // Check if address is valid (not 0x00...)
                    if (address && address !== '0x0000000000000000000000000000000000000000') {
                        setSearchResult({ email: searchInput, address });

                        // Check if already a friend
                        if (isAlreadyFriend(address)) {
                            setSearchStatus('duplicate');
                        } else {
                            setSearchStatus('found');
                        }
                    } else {
                        // User not found in registry
                        setSearchStatus('notFound');
                    }
                } else {
                    // User not found in registry
                    setSearchStatus('notFound');
                }
            } catch (error) {
                console.error('Search failed:', error);
                setSearchStatus('notFound');
            } finally {
                setIsSearching(false);
            }
        } else {
            alert('Please enter a valid email address or wallet address (0x...)');
        }
    };

    const handleCancelSearch = () => {
        setSearchInput('');
        setSearchResult(null);
        setSearchStatus(null);
        setFriendAdded(false);
    };

    const handleAddFriend = async () => {
        if (!searchResult || !account) return;

        console.log('📤 Sending friend request to:', searchResult);

        try {
            // Initialize XMTP if not connected
            if (!isInitialized) {
                const toastId = toast.loading('Initializing secure messaging...');
                const initialized = await initializeXMTP();
                toast.dismiss(toastId);

                if (!initialized) {
                    toast.error('Failed to initialize XMTP. Please try again.');
                    return;
                }
            }

            const toastId = toast.loading('Sending friend request...');

            // Send friend request via XMTP
            await sendFriendRequest(
                searchResult.address,
                searchResult.email || 'Unknown',
                account.address,
                searchResult.email
            );

            // Add to shared history
            addSharedHistoryItem({
                type: 'Friend Request',
                to: searchResult.address,
                status: 'Pending',
                timestamp: Date.now(),
                metadata: {
                    name: searchResult.email || 'Unknown Wallet',
                    email: searchResult.email
                }
            });

            toast.success('Friend request sent!', { id: toastId });
            setRequestSent(true);

            // Clear search after 2 seconds
            setTimeout(() => {
                setSearchInput('');
                setSearchResult(null);
                setRequestSent(false);
            }, 2000);

        } catch (error) {
            console.error('❌ Failed to send friend request:', error);
            toast.error('Failed to send friend request');
        }
    };

    const startEditing = (friend: Friend) => {
        setEditingAddress(friend.address);
        setEditingName(friend.name);
    };

    const saveEdit = async () => {
        if (editingAddress && editingName.trim()) {
            console.log('✏️ Saving friend name edit:', { address: editingAddress, newName: editingName.trim() });
            try {
                await onUpdateFriend(editingAddress, editingName.trim());
                console.log('✏️ Friend name updated successfully');
                setEditingAddress(null);
                setEditingName('');
            } catch (error) {
                console.error('❌ Failed to update friend:', error);
            }
        }
    };

    const cancelEdit = () => {
        setEditingAddress(null);
        setEditingName('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            saveEdit();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    };

    const confirmDelete = (address: string) => {
        setFriendToDelete(address);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (friendToDelete) {
            await onDeleteFriend(friendToDelete);
            setFriendToDelete(null);
        }
    };

    const handleOpenShareModal = (friend: Friend) => {
        setSelectedFriendForShare(friend);
        setShareModalOpen(true);
    };

    const handleSharePassword = async (password: PasswordEntry) => {
        if (!selectedFriendForShare) return;

        try {
            await onSharePassword(password, selectedFriendForShare.address);
            alert(`Password "${password.title}" shared successfully with ${selectedFriendForShare.name}!`);
        } catch (error) {
            console.error('Failed to share password:', error);
            alert('Failed to share password. Please try again.');
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Search */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Find Friends</h3>
                        <p className="text-gray-400 text-sm">Search by email or paste wallet address</p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Search by Gmail or Wallet Address
                            </label>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="friend@gmail.com or 0x..."
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSearching || !searchInput}
                            className="w-full px-6 py-3 bg-neon-blue text-slate-900 font-semibold rounded-lg hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </form>

                    {/* Search Result - User Found */}
                    {searchResult && searchStatus === 'found' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800/80 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                        >
                            <div className="flex items-center gap-4">
                                {/* Left Side - Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-2xl">🤖</span>
                                    </div>
                                </div>

                                {/* Middle - Identity Info */}
                                <div className="flex-1 min-w-0">
                                    {/* Name/Email */}
                                    <h4 className="text-xl font-bold text-white mb-1">
                                        {searchResult.email || 'Wallet User'}
                                    </h4>

                                    {/* Wallet Address with Copy Icon */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="text-sm text-gray-400 font-mono">
                                            {searchResult.address.slice(0, 6)}...{searchResult.address.slice(-4)}
                                        </p>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(searchResult.address);
                                                alert('Address copied!');
                                            }}
                                            className="text-gray-400 hover:text-neon-blue transition-colors"
                                            title="Copy address"
                                        >
                                            📋
                                        </button>
                                    </div>

                                    {/* Verified Badge (if found via email) */}
                                    {searchResult.email && (
                                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-600/20 border border-green-500/50 rounded-md text-xs text-green-400 font-medium">
                                            <span>✓</span>
                                            Registry Verified
                                        </div>
                                    )}
                                </div>

                                {/* Right Side - Action Button */}
                                <div className="flex-shrink-0">
                                    {requestSent ? (
                                        <div className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-400/50 rounded-lg font-medium flex items-center gap-2">
                                            <span>✓</span>
                                            Request Sent
                                        </div>
                                    ) : friendAdded ? (
                                        <div className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-400/50 rounded-lg font-medium flex items-center gap-2">
                                            <span>✓</span>
                                            Added Successfully
                                        </div>
                                    ) : (
                                        <motion.button
                                            onClick={handleAddFriend}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-neon-blue text-white rounded-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all font-semibold flex items-center gap-2"
                                        >
                                            <span>📤</span>
                                            Send Request
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Search Result - Already in Friends List */}
                    {searchResult && searchStatus === 'duplicate' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800 border border-yellow-500/30 rounded-xl p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">⚠️</span>
                                        <h4 className="text-lg font-semibold text-yellow-400">
                                            Already in Friends List
                                        </h4>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        {searchResult.email || 'This wallet address'} is already in your friends list.
                                    </p>
                                    <p className="text-sm text-gray-400 font-mono mt-2">
                                        {searchResult.address.slice(0, 6)}...{searchResult.address.slice(-4)}
                                    </p>
                                </div>
                                <button
                                    onClick={handleCancelSearch}
                                    className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Search Result - User Not Found */}
                    {searchStatus === 'notFound' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800 border border-red-500/30 rounded-xl p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">❌</span>
                                        <h4 className="text-lg font-semibold text-red-400">
                                            User Not Found in Registry
                                        </h4>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        The email address "{searchInput}" is not registered in the system.
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        The user may not be registered yet. Ask them to create an account first.
                                    </p>
                                </div>
                                <button
                                    onClick={handleCancelSearch}
                                    className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Column - My Identity */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">My Identity</h3>
                        <p className="text-gray-400 text-sm">Share your QR code with friends</p>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-neon-blue/30 rounded-xl p-8">
                        {account?.address ? (
                            <>
                                {/* White Frame for QR Code */}
                                <div className="bg-white p-4 rounded-xl mb-6 flex justify-center">
                                    <QRCodeSVG
                                        value={`passnexus:${account.address}`}
                                        size={150}
                                        level="H"
                                        fgColor="#000000"
                                        bgColor="#ffffff"
                                    />
                                </div>

                                {/* Identity Details */}
                                <div className="space-y-4">
                                    {/* <div>
                                        <label className="block text-xs text-gray-500 mb-1">My Nickname</label>
                                        <p className="text-white font-medium">
                                            You
                                        </p>
                                    </div> */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">My Address</label>
                                        <div className="flex items-center gap-2">
                                            <p className="text-white font-mono text-sm">
                                                {account.address.slice(0, 6)}...{account.address.slice(-4)}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(account.address);
                                                    alert('Address copied to clipboard!');
                                                }}
                                                className="text-gray-400 hover:text-neon-blue transition-colors"
                                                title="Copy address"
                                            >
                                                📋
                                            </button>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-700">
                                        <p className="text-sm text-gray-400 italic">
                                            Friends can scan this to add you instantly.
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔐</div>
                                <h4 className="text-xl font-semibold text-white mb-2">
                                    Wallet Not Connected
                                </h4>
                                <p className="text-gray-400">
                                    Connect your wallet to view your QR code
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Friends List */}
            {friends.length > 0 && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">My Friends</h3>
                        <p className="text-gray-400 text-sm">
                            {friends.length} {friends.length === 1 ? 'friend' : 'friends'} added
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <AnimatePresence>
                            {friends.map((friend) => (
                                <FriendCard
                                    key={friend.address}
                                    friend={friend}
                                    isEditing={editingAddress === friend.address}
                                    editingName={editingName}
                                    onStartEdit={() => startEditing(friend)}
                                    onSaveEdit={saveEdit}
                                    onCancelEdit={cancelEdit}
                                    onEditNameChange={setEditingName}
                                    onKeyDown={handleKeyDown}
                                    onShare={() => handleOpenShareModal(friend)}
                                    onDelete={() => confirmDelete(friend.address)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteConfirmOpen}
                onClose={() => {
                    setDeleteConfirmOpen(false);
                    setFriendToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Remove Friend?"
                message={`Remove ${friends.find(f => f.address === friendToDelete)?.name || 'this friend'}? You will need to search them again to share passwords.`}
            />

            {/* Share Password Modal */}
            {selectedFriendForShare && (
                <SharePasswordModal
                    isOpen={shareModalOpen}
                    onClose={() => {
                        setShareModalOpen(false);
                        setSelectedFriendForShare(null);
                    }}
                    friend={selectedFriendForShare}
                    passwords={passwords}
                    onShare={handleSharePassword}
                />
            )}
        </div>
    );
}
