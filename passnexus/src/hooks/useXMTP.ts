import { useState, useCallback } from 'react';
import { Client } from '@xmtp/xmtp-js';
import type { Account } from 'thirdweb/wallets';
import { ethers } from 'ethers';
import type { FriendRequestMessage, FriendRequestAcceptMessage } from '../types';

interface XMTPMessage {
    id: string;
    senderAddress: string;
    content: string;
    sent: Date;
    metadata?: {
        type?: string;
        [key: string]: any;
    };
}

interface SharePasswordMessage {
    type: 'passnexus-share';
    title: string;
    username: string;
    encryptedPassword: string;
    ipfsCid: string;
    sharedBy: string;
}

interface FriendRequest {
    id: string;
    from: string;
    name: string;
    email?: string;
    timestamp: number;
}

export function useXMTP(account: Account | undefined) {
    const [client, setClient] = useState<Client | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<XMTPMessage[]>([]);
    const [sharedPasswords, setSharedPasswords] = useState<SharePasswordMessage[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

    /**
     * Load conversations and filter for shared passwords
     */
    const loadConversations = async (xmtpClient: Client) => {
        try {
            const conversations = await xmtpClient.conversations.list();
            const allMessages: XMTPMessage[] = [];
            const passwordShares: SharePasswordMessage[] = [];
            const requests: FriendRequest[] = [];

            for (const conversation of conversations) {
                const msgs = await conversation.messages();

                for (const msg of msgs) {
                    const messageData: XMTPMessage = {
                        id: `${conversation.peerAddress}-${msg.sent}`,
                        senderAddress: msg.senderAddress,
                        content: msg.content,
                        sent: msg.sent,
                    };

                    allMessages.push(messageData);

                    // Try to parse as JSON to check message type
                    try {
                        const parsed = JSON.parse(msg.content);

                        if (parsed.type === 'passnexus-share') {
                            passwordShares.push(parsed as SharePasswordMessage);
                        } else if (parsed.type === 'friend-request') {
                            // Only show requests from others (not sent by me)
                            if (msg.senderAddress.toLowerCase() !== account?.address.toLowerCase()) {
                                const friendReq: FriendRequest = {
                                    id: `${msg.senderAddress}-${msg.sent.getTime()}`,
                                    from: parsed.content.address,
                                    name: parsed.content.name,
                                    email: parsed.content.email,
                                    timestamp: parsed.timestamp
                                };
                                requests.push(friendReq);
                            }
                        }
                    } catch {
                        // Not a JSON message, skip
                    }
                }
            }

            setMessages(allMessages);
            setSharedPasswords(passwordShares);
            setFriendRequests(requests);
        } catch (error) {
            console.error('Failed to load conversations:', error);
            throw error;
        }
    };

    /**
     * Initialize XMTP client with wallet signer (MANUAL CALL)
     */
    const initializeXMTP = useCallback(async () => {
        if (!account) {
            setError('No wallet connected');
            return false;
        }

        if (isInitialized) {
            return true;
        }

        setIsLoading(true);
        setError(null);

        try {
            let signer = null;

            // 1. Try getting signer from window.ethereum (MetaMask/Rabby)
            if ((window as any).ethereum) {
                console.log('Using window.ethereum for XMTP signer');
                const provider = new ethers.BrowserProvider((window as any).ethereum);
                signer = await provider.getSigner();
                console.log('Signer obtained successfully:', await signer.getAddress());
            } else {
                // 2. Fallback logic for Thirdweb embedded wallets
                console.warn('No window.ethereum found. XMTP requires a standard Ethers signer.');
                setError('XMTP requires MetaMask or a similar wallet extension. Embedded wallets are not yet supported.');
                return false;
            }

            if (!signer) {
                throw new Error('Failed to obtain wallet signer');
            }

            console.log('Creating XMTP client for:', account.address);
            console.log('Using production network for XMTP V3');

            // Create XMTP client - this will trigger wallet signature
            // Using 'production' network for XMTP V3 (V2 is deprecated)
            const xmtpClient = await Client.create(signer, {
                env: 'production' // V3 requires production environment
            });

            console.log('XMTP client created successfully');

            setClient(xmtpClient);
            setIsInitialized(true);

            // Load existing conversations
            await loadConversations(xmtpClient);

            return true;
        } catch (error: any) {
            // Better error logging
            console.error('XMTP Error Details:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);

            // Handle user rejection
            if (error.message?.includes('User rejected') ||
                error.message?.includes('user rejected') ||
                error.code === 4001 ||
                error.code === 'ACTION_REJECTED') {
                setError('Signature request denied. Please approve the wallet signature to use XMTP messaging.');
            } else if (error.message?.includes('network')) {
                setError('Network error. Please check your internet connection and try again.');
            } else if (error.message?.includes('signer')) {
                setError('Wallet signer error. Please make sure you are using MetaMask or a compatible wallet.');
            } else {
                setError(`Failed to initialize XMTP: ${error.message || 'Unknown error'}`);
            }

            // Also show in alert for immediate visibility
            alert(`XMTP Initialization Failed:\n${error.message}\n\nCheck console for details.`);

            return false;
        } finally {
            setIsLoading(false);
        }
    }, [account, isInitialized]);

    /**
     * Refresh messages
     */
    const refreshMessages = useCallback(async () => {
        if (!client) {
            console.warn('XMTP client not initialized');
            return;
        }

        setIsLoading(true);
        try {
            await loadConversations(client);
        } catch (error) {
            console.error('Failed to refresh messages:', error);
            setError('Failed to refresh messages');
        } finally {
            setIsLoading(false);
        }
    }, [client]);

    /**
     * Send a password share message
     */
    const sharePassword = useCallback(async (
        recipientAddress: string,
        title: string,
        username: string,
        encryptedPassword: string,
        ipfsCid: string,
        sharedBy: string
    ) => {
        if (!client) {
            throw new Error('XMTP client not initialized');
        }

        try {
            const conversation = await client.conversations.newConversation(recipientAddress);

            const shareMessage: SharePasswordMessage = {
                type: 'passnexus-share',
                title,
                username,
                encryptedPassword,
                ipfsCid,
                sharedBy
            };

            await conversation.send(JSON.stringify(shareMessage));
            return true;
        } catch (error) {
            console.error('Failed to share password:', error);
            throw error;
        }
    }, [client]);

    /**
     * Send a friend request message
     */
    const sendFriendRequest = useCallback(async (
        recipientAddress: string,
        myName: string,
        myAddress: string,
        myEmail?: string
    ) => {
        if (!client) {
            throw new Error('XMTP client not initialized');
        }

        try {
            const conversation = await client.conversations.newConversation(recipientAddress);

            const requestMessage: FriendRequestMessage = {
                type: 'friend-request',
                content: {
                    name: myName,
                    address: myAddress,
                    email: myEmail
                },
                timestamp: Date.now()
            };

            await conversation.send(JSON.stringify(requestMessage));
            return true;
        } catch (error) {
            console.error('Failed to send friend request:', error);
            throw error;
        }
    }, [client]);

    /**
     * Send a request accepted message
     */
    const sendRequestAccepted = useCallback(async (
        recipientAddress: string,
        myName: string,
        myAddress: string
    ) => {
        if (!client) {
            throw new Error('XMTP client not initialized');
        }

        try {
            const conversation = await client.conversations.newConversation(recipientAddress);

            const acceptMessage: FriendRequestAcceptMessage = {
                type: 'request-accepted',
                content: {
                    name: myName,
                    address: myAddress
                },
                timestamp: Date.now()
            };

            await conversation.send(JSON.stringify(acceptMessage));
            return true;
        } catch (error) {
            console.error('Failed to send acceptance message:', error);
            throw error;
        }
    }, [client]);

    return {
        client,
        isInitialized,
        isLoading,
        error,
        messages,
        sharedPasswords,
        friendRequests,
        initializeXMTP,
        sharePassword,
        sendFriendRequest,
        sendRequestAccepted,
        refreshMessages
    };
}
