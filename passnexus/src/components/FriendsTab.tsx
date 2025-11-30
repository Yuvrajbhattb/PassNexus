import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'react-qr-code';
import { getAddressByEmail, getEmailByAddress, addFriend, isEmailRegistered } from '../contracts/UserRegistry';
import { useSendTransaction } from 'thirdweb/react';
import type { Account } from 'thirdweb/wallets';

interface FriendsTabProps {
    account: Account | undefined;
    userEmail: string | null;
}

export default function FriendsTab({ account, userEmail }: FriendsTabProps) {
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResult, setSearchResult] = useState<{ email: string; address: string } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [friendAdded, setFriendAdded] = useState(false);
    const { mutate: sendTransaction } = useSendTransaction();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchEmail) return;

        setIsSearching(true);
        setSearchResult(null);
        setFriendAdded(false);

        try {
            const isRegistered = await isEmailRegistered(searchEmail);
            if (isRegistered) {
                const address = await getAddressByEmail(searchEmail);
                setSearchResult({ email: searchEmail, address });
            } else {
                alert('Email not found. User may not be registered yet.');
            }
        } catch (error) {
            console.error('Search failed:', error);
            alert('Failed to search for user');
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddFriend = async () => {
        if (!searchResult || !account) return;

        try {
            const transaction = await addFriend(account, searchResult.address);
            sendTransaction(transaction, {
                onSuccess: () => {
                    setFriendAdded(true);
                },
                onError: (error) => {
                    console.error('Failed to add friend:', error);
                    alert('Failed to add friend');
                }
            });
        } catch (error) {
            console.error('Failed to add friend:', error);
            alert('Failed to add friend');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Search */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Find Friends</h3>
                    <p className="text-gray-400 text-sm">Search for friends by their registered email</p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Search by Gmail
                        </label>
                        <input
                            type="email"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            placeholder="friend@gmail.com"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSearching || !searchEmail}
                        className="w-full px-6 py-3 bg-neon-blue text-slate-900 font-semibold rounded-lg hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {/* Search Result */}
                {searchResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800 border border-neon-blue/30 rounded-xl p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">👤</span>
                                    <h4 className="text-lg font-semibold text-white">{searchResult.email}</h4>
                                </div>
                                <p className="text-sm text-gray-400 font-mono">
                                    {searchResult.address.slice(0, 6)}...{searchResult.address.slice(-4)}
                                </p>
                            </div>
                            <div>
                                {friendAdded ? (
                                    <div className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-400/50 rounded-lg font-medium flex items-center gap-2">
                                        <span>✓</span>
                                        Connected Successfully
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleAddFriend}
                                        className="px-4 py-2 bg-neon-blue text-slate-900 rounded-lg hover:bg-blue-400 transition-colors font-semibold"
                                    >
                                        Add Friend
                                    </button>
                                )}
                            </div>
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
                    {/* QR Code */}
                    <div className="bg-white p-6 rounded-lg mb-6 flex justify-center">
                        {userEmail ? (
                            <QRCodeSVG
                                value={userEmail}
                                size={200}
                                level="H"
                            />
                        ) : (
                            <div className="w-[200px] h-[200px] flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <p className="text-sm">No email registered</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Email</label>
                            <p className="text-white font-medium">
                                {userEmail || 'Not registered'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Wallet Address</label>
                            <p className="text-white font-mono text-sm">
                                {account?.address ? (
                                    `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
                                ) : (
                                    'Not connected'
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
