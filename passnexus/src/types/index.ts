export interface PasswordEntry {
    id: string;
    title: string;
    username: string;
    encryptedPassword: string;
    url?: string;
    ipfsCid?: string;
    encryptionMode?: 'standard' | 'argon2'; // Encryption method used
    createdAt: number;
    updatedAt: number;
}

export interface SharedPassword {
    id: string;
    title: string;
    username: string;
    encryptedPassword: string;
    url?: string;
    sender: string;
    receivedAt: number;
    isNew: boolean;
}

export interface Friend {
    id: string;
    address: string;
    name: string;
    email?: string;
    addedAt: number;
}

export interface CreditCard {
    id: string;
    itemName: string;
    folder: string;
    cardholderName: string;
    cardNumber: string;
    brand: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Friend Request System Types
export type FriendRequestStatus = 'Pending' | 'Accepted' | 'Ignored';

export interface SharedHistoryItem {
    id: string;
    type: 'Friend Request' | 'Password Share';
    to?: string; // For sent items
    from?: string; // For received items
    status: FriendRequestStatus;
    timestamp: number;
    metadata?: {
        name?: string;
        email?: string;
        [key: string]: any;
    };
}

// XMTP Message Types
export interface FriendRequestMessage {
    type: 'friend-request';
    content: {
        name: string;
        address: string;
        email?: string;
    };
    timestamp: number;
}

export interface FriendRequestAcceptMessage {
    type: 'request-accepted';
    content: {
        name: string;
        address: string;
    };
    timestamp: number;
}
