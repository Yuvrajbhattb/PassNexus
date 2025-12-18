import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { PasswordEntry, Friend, SharedHistoryItem } from '../types/index';
import type { CreditCard } from '../types';
import { encryptData, decryptData, deriveMasterKey } from '../utils/encryption';
import { uploadToIPFS } from '../utils/ipfs';
import type { Account } from "thirdweb/wallets";

const STORAGE_KEY = 'passnexus_vault';
const FRIENDS_KEY = 'passnexus_friends';
const SHARED_HISTORY_KEY = 'passnexus_shared_history';

export function useStorage(account: Account | undefined, onNotify?: (message: string) => void) {
    const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
    const [cards, setCards] = useState<CreditCard[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [sharedHistory, setSharedHistory] = useState<SharedHistoryItem[]>([]);
    const [masterKey, setMasterKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const walletAddress = account?.address || null;

    // Load passwords, cards, friends, and shared history from localStorage
    useEffect(() => {
        if (walletAddress) {
            const stored = localStorage.getItem(`${STORAGE_KEY}_${walletAddress}`);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setPasswords(parsed.passwords || parsed || []);
                    setCards(parsed.cards || []);
                } catch (error) {
                    console.error('Failed to load vault data:', error);
                }
            }

            // Load friends list
            const friendsStored = localStorage.getItem(`${FRIENDS_KEY}_${walletAddress}`);
            if (friendsStored) {
                try {
                    const parsed = JSON.parse(friendsStored);
                    setFriends(parsed || []);
                } catch (error) {
                    console.error('Failed to load friends data:', error);
                }
            }

            // Load shared history
            const historyStored = localStorage.getItem(`${SHARED_HISTORY_KEY}_${walletAddress}`);
            if (historyStored) {
                try {
                    const parsed = JSON.parse(historyStored);
                    setSharedHistory(parsed || []);
                } catch (error) {
                    console.error('Failed to load shared history:', error);
                }
            }
        }
    }, [walletAddress]);

    // Save passwords and cards to localStorage
    const saveToLocalStorage = useCallback((entries: PasswordEntry[], cardEntries: CreditCard[]) => {
        if (walletAddress) {
            const vaultData = { passwords: entries, cards: cardEntries };
            localStorage.setItem(`${STORAGE_KEY}_${walletAddress}`, JSON.stringify(vaultData));
        }
    }, [walletAddress]);

    // Initialize master key from wallet signature
    const initializeMasterKey = useCallback(async (mode: 'standard' | 'argon2' = 'standard') => {
        if (!account || !walletAddress) {
            return null;
        }

        setIsLoading(true);
        try {
            // Request signature for key derivation
            const message = `PassNexus Master Key Derivation\nAddress: ${walletAddress}\nTimestamp: ${Date.now()}`;
            const signature = await account.signMessage({ message });

            const key = await deriveMasterKey(walletAddress, signature, mode);
            setMasterKey(key);
            return key;
        } catch (error) {
            console.error('Failed to initialize master key:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [account, walletAddress]);

    // Add a new password
    const addPassword = useCallback(async (
        title: string,
        username: string,
        password: string,
        url?: string,
        encryptionMode: 'standard' | 'argon2' = 'standard'
    ): Promise<boolean> => {
        if (!walletAddress) {
            throw new Error('Wallet not connected');
        }

        setIsLoading(true);
        try {
            // Get or create master key with specified encryption mode
            let key = masterKey;
            if (!key) {
                key = await initializeMasterKey(encryptionMode);
                if (!key) {
                    throw new Error('Failed to initialize encryption key');
                }
            }

            // Encrypt the password
            const encryptedPassword = encryptData(password, key);

            // Upload to IPFS
            const ipfsData = {
                title,
                username,
                encryptedPassword,
                url,
                encryptionMode,
                timestamp: Date.now()
            };
            const ipfsCid = await uploadToIPFS(ipfsData);

            // Create password entry
            const entry: PasswordEntry = {
                id: `pwd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title,
                username,
                encryptedPassword,
                url,
                ipfsCid,
                encryptionMode,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            // Update state and storage
            const updated = [...passwords, entry];
            setPasswords(updated);
            saveToLocalStorage(updated, cards);

            // Trigger notification
            onNotify?.('New Password added to Vault');

            return true;
        } catch (error) {
            console.error('Failed to add password:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [walletAddress, masterKey, passwords, initializeMasterKey, saveToLocalStorage]);

    // Decrypt a password
    const decryptPassword = useCallback(async (entry: PasswordEntry): Promise<string> => {
        const toastId = toast.loading('Decrypting...');
        setIsLoading(true);
        try {
            // Get encryption mode (default to 'standard' for backward compatibility)
            const mode = entry.encryptionMode || 'standard';

            // Initialize master key with the same mode used for encryption
            let key = masterKey;
            if (!key) {
                key = await initializeMasterKey(mode);
                if (!key) {
                    throw new Error('Failed to initialize decryption key');
                }
            }

            const decrypted = decryptData<string>(entry.encryptedPassword, key);
            toast.success('Successfully Decrypted!', { id: toastId });
            return decrypted;
        } catch (error) {
            console.error('Failed to decrypt password:', error);
            toast.error('Decryption Failed: Wrong Key', { id: toastId });
            throw new Error('Decryption failed');
        } finally {
            setIsLoading(false);
        }
    }, [masterKey, initializeMasterKey]);

    // Delete a password
    const deletePassword = useCallback(async (id: string) => {
        try {
            const updated = passwords.filter(p => p.id !== id);

            // Update state and local storage immediately
            setPasswords(updated);
            saveToLocalStorage(updated, cards);

            // Note: Each password has its own IPFS CID stored in entry.ipfsCid
            // The password list itself doesn't need re-uploading to IPFS
            // Individual passwords are uploaded when created and CIDs are stored locally

            // Trigger notification
            onNotify?.('Password removed from Vault');

            return true;
        } catch (error) {
            console.error('Failed to delete password:', error);
            return false;
        }
    }, [passwords, cards, saveToLocalStorage, onNotify]);

    // Update a password
    const updatePassword = useCallback(async (
        id: string,
        updates: Partial<Pick<PasswordEntry, 'title' | 'username' | 'url'>>
    ) => {
        const updated = passwords.map(p =>
            p.id === id
                ? { ...p, ...updates, updatedAt: Date.now() }
                : p
        );
        setPasswords(updated);
        saveToLocalStorage(updated, cards);
    }, [passwords, cards, saveToLocalStorage]);

    // Add a new credit card
    const addCard = useCallback(async (
        itemName: string,
        folder: string,
        cardholderName: string,
        cardNumber: string,
        brand: 'Visa' | 'Mastercard' | 'Amex' | 'Discover',
        expiryMonth: string,
        expiryYear: string,
        cvv: string,
        notes?: string
    ): Promise<void> => {
        if (!walletAddress) {
            throw new Error('Wallet not connected');
        }

        setIsLoading(true);
        try {
            // Get or create master key
            let key = masterKey;
            if (!key) {
                key = await initializeMasterKey('standard');
                if (!key) {
                    throw new Error('Failed to initialize encryption key');
                }
            }

            // Encrypt sensitive fields for local storage/display
            const encryptedCardNumber = encryptData(cardNumber, key);
            const encryptedCVV = encryptData(cvv, key);

            // Create card entry
            const card: CreditCard = {
                id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                itemName,
                folder,
                cardholderName,
                cardNumber: encryptedCardNumber,
                brand,
                expiryMonth,
                expiryYear,
                cvv: encryptedCVV,
                notes,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Prepare data for IPFS - Encrypt the ENTIRE object as a string
            const cardDataToEncrypt = JSON.stringify(card);
            const encryptedIPFSPayload = encryptData(cardDataToEncrypt, key);

            // Upload encrypted string to IPFS
            const ipfsCid = await uploadToIPFS(encryptedIPFSPayload);

            // Add CID to card object (optional, if we want to track it locally)
            // For now, we just ensure it's uploaded as requested

            // Update state and storage
            const updated = [...cards, card];
            setCards(updated);
            saveToLocalStorage(passwords, updated);

            // Trigger notification
            onNotify?.('New Card added to Vault');
        } catch (error) {
            console.error('Failed to add card:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [walletAddress, masterKey, cards, passwords, initializeMasterKey, saveToLocalStorage]);

    // Decrypt a card
    const decryptCard = useCallback(async (id: string): Promise<{ cardNumber: string; cvv: string }> => {
        const toastId = toast.loading('Decrypting...');
        setIsLoading(true);
        try {
            const card = cards.find(c => c.id === id);
            if (!card) {
                throw new Error('Card not found');
            }

            // Initialize master key
            let key = masterKey;
            if (!key) {
                key = await initializeMasterKey('standard');
                if (!key) {
                    throw new Error('Failed to initialize decryption key');
                }
            }

            const decryptedCardNumber = decryptData<string>(card.cardNumber, key);
            const decryptedCVV = decryptData<string>(card.cvv, key);

            toast.success('Successfully Decrypted!', { id: toastId });
            return { cardNumber: decryptedCardNumber, cvv: decryptedCVV };
        } catch (error) {
            console.error('Failed to decrypt card:', error);
            toast.error('Decryption Failed: Wrong Key', { id: toastId });
            throw new Error('Decryption failed');
        } finally {
            setIsLoading(false);
        }
    }, [cards, masterKey, initializeMasterKey]);

    // Delete a card
    const deleteCard = useCallback((id: string) => {
        const updated = cards.filter(c => c.id !== id);
        setCards(updated);
        saveToLocalStorage(passwords, updated);

        // Trigger notification
        onNotify?.('Card removed from Vault');
    }, [cards, passwords, saveToLocalStorage, onNotify]);

    // Save friends to localStorage and IPFS
    const saveFriendsToStorage = useCallback(async (friendsList: Friend[]) => {
        if (!walletAddress) return;

        // Save to localStorage
        localStorage.setItem(`${FRIENDS_KEY}_${walletAddress}`, JSON.stringify(friendsList));

        // Optionally encrypt and upload to IPFS for backup
        try {
            let key = masterKey;
            if (!key) {
                key = await initializeMasterKey('standard');
            }
            if (key) {
                const encryptedFriends = encryptData(friendsList, key);
                await uploadToIPFS(encryptedFriends);
            }
        } catch (error) {
            console.error('Failed to backup friends to IPFS:', error);
            // Non-critical, continue with localStorage
        }
    }, [walletAddress, masterKey, initializeMasterKey]);

    // Add a friend
    const addFriend = useCallback(async (address: string, name?: string, email?: string): Promise<boolean> => {
        if (!walletAddress) {
            throw new Error('Wallet not connected');
        }

        // Check if friend already exists
        const existingFriend = friends.find(f => f.address.toLowerCase() === address.toLowerCase());
        if (existingFriend) {
            onNotify?.('Friend already added');
            return false;
        }

        // Generate UUID
        const uuid = `friend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const newFriend: Friend = {
            id: uuid,
            address,
            name: name || email || 'Unknown Wallet',
            email: email,
            addedAt: Date.now()
        };

        // Update state IMMEDIATELY for instant UI feedback
        const updatedFriends = [...friends, newFriend];
        setFriends(updatedFriends);
        console.log('Friend added to state:', newFriend);
        console.log('Updated friends list:', updatedFriends);

        // Then save to storage asynchronously
        try {
            await saveFriendsToStorage(updatedFriends);
            onNotify?.('Friend added successfully');
            return true;
        } catch (error) {
            console.error('Failed to save friend to storage:', error);
            // State is already updated, just log the error
            return true; // Still return true since friend was added to local state
        }
    }, [walletAddress, friends, saveFriendsToStorage, onNotify]);

    // Update friend's nickname
    const updateFriend = useCallback(async (address: string, name: string) => {
        // Update state IMMEDIATELY for instant UI feedback
        const updated = friends.map(f =>
            f.address.toLowerCase() === address.toLowerCase()
                ? { ...f, name }
                : f
        );
        setFriends(updated);
        console.log('Friend name updated in state:', { address, name });
        console.log('Updated friends list:', updated);

        // Then save to storage asynchronously
        try {
            await saveFriendsToStorage(updated);
            onNotify?.('Friend updated');
        } catch (error) {
            console.error('Failed to save friend update to storage:', error);
            // State is already updated, just log the error
        }
    }, [friends, saveFriendsToStorage, onNotify]);

    // Delete a friend
    const deleteFriend = useCallback(async (address: string) => {
        // Update state IMMEDIATELY for instant UI feedback
        const updated = friends.filter(f => f.address.toLowerCase() !== address.toLowerCase());
        setFriends(updated);
        console.log('Friend deleted from state:', address);
        console.log('Updated friends list:', updated);

        // Then save to storage asynchronously
        try {
            await saveFriendsToStorage(updated);
            onNotify?.('Friend removed');
            return true;
        } catch (error) {
            console.error('Failed to save friend deletion to storage:', error);
            // State is already updated, just log the error
            return true; // Still return true since friend was removed from local state
        }
    }, [friends, saveFriendsToStorage, onNotify]);

    // === Shared History Functions ===

    // Save shared history to localStorage
    const saveSharedHistoryToStorage = useCallback((history: SharedHistoryItem[]) => {
        if (!walletAddress) return;
        localStorage.setItem(`${SHARED_HISTORY_KEY}_${walletAddress}`, JSON.stringify(history));
    }, [walletAddress]);

    // Add a shared history item
    const addSharedHistoryItem = useCallback((item: Omit<SharedHistoryItem, 'id'>) => {
        const newItem: SharedHistoryItem = {
            ...item,
            id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        const updated = [...sharedHistory, newItem];
        setSharedHistory(updated);
        saveSharedHistoryToStorage(updated);
        return newItem;
    }, [sharedHistory, saveSharedHistoryToStorage]);

    // Update shared history item status
    const updateSharedHistoryStatus = useCallback((itemId: string, status: SharedHistoryItem['status']) => {
        const updated = sharedHistory.map(item =>
            item.id === itemId ? { ...item, status } : item
        );
        setSharedHistory(updated);
        saveSharedHistoryToStorage(updated);
    }, [sharedHistory, saveSharedHistoryToStorage]);

    // Remove a shared history item (for ignored requests)
    const removeSharedHistoryItem = useCallback((itemId: string) => {
        const updated = sharedHistory.filter(item => item.id !== itemId);
        setSharedHistory(updated);
        saveSharedHistoryToStorage(updated);
    }, [sharedHistory, saveSharedHistoryToStorage]);

    return {
        passwords,
        cards,
        friends,
        sharedHistory,
        isLoading,
        addPassword,
        decryptPassword,
        deletePassword,
        updatePassword,
        addCard,
        decryptCard,
        deleteCard,
        addFriend,
        updateFriend,
        deleteFriend,
        addSharedHistoryItem,
        updateSharedHistoryStatus,
        removeSharedHistoryItem,
        initializeMasterKey
    };
}
