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
    address: string;
    publicKey: string;
    addedAt: number;
}
