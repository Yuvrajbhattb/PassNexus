export interface PasswordItem {
    id: string;
    title: string;
    username: string;
    password: string; // Encrypted
    url?: string;
    notes?: string;
    folder: string;
    encryptionMode: 'standard' | 'argon2';
    createdAt: Date;
    updatedAt: Date;
}

export interface CreditCard {
    id: string;
    itemName: string;
    folder: string;
    cardholderName: string;
    cardNumber: string; // Encrypted
    brand: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
    expiryMonth: string;
    expiryYear: string;
    cvv: string; // Encrypted
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface VaultData {
    passwords: PasswordItem[];
    cards: CreditCard[];
}
