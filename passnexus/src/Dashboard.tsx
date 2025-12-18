import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStorage } from './hooks/useStorage';
import { ConnectButton, useActiveAccount, useDisconnect, useActiveWallet } from "thirdweb/react";
import { client } from "./client";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import AddPasswordModal from './components/AddPasswordModal';
import VaultItem from './components/VaultItem';
import ZKLoginScreen from './components/ZKLoginScreen';
import CardVault from './components/CardVault';
import FriendsTab from './components/FriendsTab';
import SharedCenterTab from './components/SharedCenterTab';
import Notifications from './components/Notifications';
import Generator from './components/Generator';
import { useNotifications } from './context/NotificationContext';
import { useXMTP } from './hooks/useXMTP';
import type { PasswordEntry } from './types/index';
import BlockchainBackground from './components/BlockchainBackground';

interface DashboardProps { }

const Dashboard: React.FC<DashboardProps> = () => {
    const [activeTab, setActiveTab] = useState('vault');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const account = useActiveAccount();
    const walletAddress = account?.address || null;
    const { disconnect } = useDisconnect();
    const wallet = useActiveWallet();
    const [showAddModal, setShowAddModal] = useState(false);

    // Notifications context
    const { addNotification, unreadCount } = useNotifications();

    // Initialize XMTP for sharing passwords
    const { sharePassword, isInitialized: isXMTPInitialized, initializeXMTP } = useXMTP(account);

    // Initialize storage hook with notification callback
    const {
        passwords,
        cards,
        friends,
        addPassword,
        decryptPassword,
        deletePassword,
        addCard,
        decryptCard,
        deleteCard,
        addFriend,
        updateFriend,
        deleteFriend,
        addSharedHistoryItem,
    } = useStorage(account, addNotification);

    const handleAddPassword = async (
        title: string,
        username: string,
        password: string,
        url?: string,
        encryptionMode?: 'standard' | 'argon2'
    ) => {
        if (!walletAddress) {
            alert('Please connect your wallet first');
            return;
        }
        await addPassword(title, username, password, url, encryptionMode);
    };

    const handleAddCard = async (
        itemName: string,
        folder: string,
        cardholderName: string,
        cardNumber: string,
        brand: 'Visa' | 'Mastercard' | 'Amex' | 'Discover',
        expiryMonth: string,
        expiryYear: string,
        cvv: string,
        notes?: string
    ) => {
        if (!walletAddress) {
            alert('Please connect your wallet first');
            return;
        }
        await addCard(itemName, folder, cardholderName, cardNumber, brand, expiryMonth, expiryYear, cvv, notes);
    };

    const handleDownloadBackup = () => {
        const backup = {
            version: '1.0',
            walletAddress,
            exportDate: new Date().toISOString(),
            passwords: passwords,
            cards: cards,
            note: 'This backup contains encrypted vault data. Keep it secure!'
        };
        const blob = new Blob([JSON.stringify(backup, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `passnexus-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSharePassword = async (password: PasswordEntry, friendAddress: string) => {
        if (!walletAddress) {
            alert('Please connect your wallet first');
            return;
        }

        // Initialize XMTP if not already initialized
        if (!isXMTPInitialized) {
            const initialized = await initializeXMTP();
            if (!initialized) {
                throw new Error('Failed to initialize XMTP. Please try again.');
            }
        }

        // Decrypt the password to share (decryptPassword takes PasswordEntry, returns string)
        const decryptedPasswordString = await decryptPassword(password);
        if (!decryptedPasswordString) {
            throw new Error('Failed to decrypt password');
        }

        // Send via XMTP (send the decrypted password string)
        await sharePassword(
            friendAddress,
            password.title,
            password.username,
            decryptedPasswordString,
            password.ipfsCid || '',
            walletAddress
        );

        addNotification(`Password "${password.title}" shared successfully!`);
    };

    const handleDisconnect = () => {
        if (wallet) {
            disconnect(wallet);
            alert('Wallet disconnected successfully');
        }
    };

    const tabs = [
        { id: 'vault', label: 'My Vault', icon: '🔐' },
        { id: 'cards', label: 'Cards', icon: '💳' },
        { id: 'generator', label: 'Generator', icon: '✨' },
        { id: 'notifications', label: 'Notifications', icon: '🔔', badge: unreadCount },
        { id: 'shared', label: 'Shared Center', icon: '🤝' },
        { id: 'friends', label: 'Friends', icon: '👥' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    // Show ZK login screen if wallet connected but not authenticated
    if (walletAddress && !isAuthenticated) {
        return (
            <ZKLoginScreen
                walletAddress={walletAddress}
                onAuthenticated={() => setIsAuthenticated(true)}
            />
        );
    }

    return (
        <BlockchainBackground>
            <div className="min-h-screen flex">
                {/* Sidebar - Fixed with Glassmorphism */}
                <motion.aside
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    className="fixed top-0 left-0 h-screen w-64 bg-slate-900/60 backdrop-blur-xl border-r border-white/10 p-6 z-50 overflow-y-auto"
                >
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neon-blue neon-glow">PassNexus</h1>
                        <p className="text-gray-400 text-sm mt-1">Decentralized Security</p>
                    </div>

                    <nav className="space-y-2">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.05, x: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                                    ? 'bg-neon-blue/20 text-neon-blue neon-border'
                                    : 'text-gray-400 hover:bg-slate-700/50 hover:text-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{tab.icon}</span>
                                    <span className="font-medium">{tab.label}</span>
                                </div>
                                {tab.badge !== undefined && tab.badge > 0 && (
                                    <div className="bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                                        {tab.badge >= 3 ? '3+' : `+${tab.badge}`}
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-8 border-t border-slate-700">
                        <div className="text-xs text-gray-500">
                            <p>Powered by Blockchain</p>
                            <p className="mt-1">IPFS • XMTP • Ethereum</p>
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content - Offset for fixed sidebar with Glassmorphism */}
                <div className="flex-1 flex flex-col ml-64">
                    {/* Header with Glass Effect */}
                    <header className="bg-slate-900/40 backdrop-blur-xl border-b border-white/10 px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {tabs.find((t) => t.id === activeTab)?.label}
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    Secure, decentralized password management
                                </p>
                            </div>

                            <ConnectButton
                                client={client}
                                wallets={[
                                    inAppWallet({
                                        auth: {
                                            options: ["google", "email"],
                                        },
                                    }),
                                    createWallet("io.metamask"),
                                    createWallet("io.rabby"),
                                ]}
                                theme="dark"
                            />
                        </div>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 p-8 overflow-y-auto">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'vault' && (
                                <div>
                                    {/* Add Password Button */}
                                    {walletAddress && (
                                        <div className="mb-6 flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    Your Passwords ({passwords.length})
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    Encrypted and stored securely on IPFS
                                                </p>
                                            </div>
                                            <motion.button
                                                onClick={() => setShowAddModal(true)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-6 py-3 bg-neon-blue text-slate-900 font-semibold rounded-lg hover:bg-neon-blue/90 transition-all"
                                            >
                                                + Add Password
                                            </motion.button>
                                        </div>
                                    )}

                                    {/* Password List */}
                                    {!walletAddress ? (
                                        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
                                            <div className="text-6xl mb-4">🔐</div>
                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                Connect Your Wallet
                                            </h3>
                                            <p className="text-gray-400">
                                                Connect your wallet to access your secure password vault
                                            </p>
                                        </div>
                                    ) : passwords.length === 0 ? (
                                        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center">
                                            <div className="text-6xl mb-4">🔐</div>
                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                Your Vault is Empty
                                            </h3>
                                            <p className="text-gray-400 mb-6">
                                                Start by adding your first password entry
                                            </p>
                                            <motion.button
                                                onClick={() => setShowAddModal(true)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-6 py-3 bg-neon-blue text-slate-900 font-semibold rounded-lg hover:bg-neon-blue/90 transition-all"
                                            >
                                                Add Password
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {passwords.map((entry) => (
                                                <VaultItem
                                                    key={entry.id}
                                                    entry={entry}
                                                    onDecrypt={decryptPassword}
                                                    onDelete={deletePassword}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'cards' && (
                                <CardVault
                                    cards={cards}
                                    onAddCard={handleAddCard}
                                    onDeleteCard={deleteCard}
                                    onDecryptCard={decryptCard}
                                />
                            )}

                            {activeTab === 'generator' && (
                                <Generator />
                            )}

                            {activeTab === 'notifications' && (
                                <Notifications />
                            )}

                            {activeTab === 'friends' && (
                                <FriendsTab
                                    account={account}
                                    userEmail={null}
                                    friends={friends}
                                    passwords={passwords}
                                    onAddFriend={addFriend}
                                    onUpdateFriend={updateFriend}
                                    onDeleteFriend={deleteFriend}
                                    onSharePassword={handleSharePassword}
                                    addSharedHistoryItem={addSharedHistoryItem}
                                />
                            )}

                            {activeTab === 'shared' && (
                                <SharedCenterTab account={account} />
                            )}

                            {activeTab === 'settings' && (
                                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                                    <h3 className="text-xl font-bold text-white mb-6">Settings</h3>
                                    <div className="space-y-4">
                                        {/* Wallet Connection */}
                                        <div className="bg-slate-700/30 p-4 rounded-lg">
                                            <h4 className="font-semibold text-white mb-2">
                                                Wallet Connection
                                            </h4>
                                            <p className="text-gray-400 text-sm mb-3">
                                                {walletAddress
                                                    ? `Connected: ${walletAddress}`
                                                    : 'No wallet connected'}
                                            </p>
                                            {walletAddress && (
                                                <motion.button
                                                    onClick={handleDisconnect}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-400/50 rounded-lg hover:bg-red-600/30 transition-all text-sm"
                                                >
                                                    Disconnect Wallet
                                                </motion.button>
                                            )}
                                        </div>

                                        {/* Storage */}
                                        <div className="bg-slate-700/30 p-4 rounded-lg">
                                            <h4 className="font-semibold text-white mb-2">Storage</h4>
                                            <p className="text-gray-400 text-sm">
                                                IPFS Decentralized Storage
                                            </p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                {passwords.length} passwords, {cards.length} cards stored
                                            </p>
                                        </div>

                                        {/* Messaging */}
                                        <div className="bg-slate-700/30 p-4 rounded-lg">
                                            <h4 className="font-semibold text-white mb-2">Messaging</h4>
                                            <p className="text-gray-400 text-sm">
                                                XMTP Encrypted Messaging
                                            </p>
                                        </div>

                                        {/* Backup */}
                                        {walletAddress && (passwords.length > 0 || cards.length > 0) && (
                                            <div className="bg-slate-700/30 p-4 rounded-lg">
                                                <h4 className="font-semibold text-white mb-2">Backup</h4>
                                                <p className="text-gray-400 text-sm mb-3">
                                                    Download an encrypted backup of your vault
                                                </p>
                                                <motion.button
                                                    onClick={handleDownloadBackup}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="px-4 py-2 bg-neon-blue/20 text-neon-blue border border-neon-blue rounded-lg hover:bg-neon-blue/30 transition-all text-sm"
                                                >
                                                    📥 Download Backup
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </main>
                </div>

                {/* Add Password Modal */}
                <AddPasswordModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddPassword}
                />
            </div>
        </BlockchainBackground>
    );
};

export default Dashboard;
