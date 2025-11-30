import { useState, useEffect, useCallback } from 'react';
import type { PasswordEntry } from '../types';
import type { CreditCard } from '../types';
import { encryptData, decryptData, deriveMasterKey } from '../utils/encryption';
import { uploadToIPFS } from '../utils/ipfs';
import type { Account } from "thirdweb/wallets";

const STORAGE_KEY = 'passnexus_vault';

export function useStorage(account: Account | undefined, onNotify?: (message: string) => void) {
    const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
    const [cards, setCards] = useState<CreditCard[]>([]);
    const [masterKey, setMasterKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const walletAddress = account?.address || null;

    // Load passwords and cards from localStorage
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
            return decrypted;
        } catch (error) {
            console.error('Failed to decrypt password:', error);
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

            return { cardNumber: decryptedCardNumber, cvv: decryptedCVV };
        } catch (error) {
            console.error('Failed to decrypt card:', error);
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

    return {
        passwords,
        cards,
        isLoading,
        addPassword,
        decryptPassword,
        deletePassword,
        updatePassword,
        addCard,
        decryptCard,
        deleteCard,
        initializeMasterKey
    };
}
