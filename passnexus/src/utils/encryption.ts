import CryptoJS from 'crypto-js';

/**
 * Encrypt data using AES-256-CBC
 * @param data - Data to encrypt (will be stringified)
 * @param masterKey - Master encryption key
 * @returns Encrypted string
 */
export function encryptData(data: any, masterKey: string): string {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, masterKey).toString();
    return encrypted;
}

/**
 * Decrypt data using AES-256-CBC
 * @param encryptedData - Encrypted string
 * @param masterKey - Master encryption key
 * @returns Decrypted data
 */
export function decryptData<T = any>(encryptedData: string, masterKey: string): T {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, masterKey);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
}

/**
 * Generate a master key from wallet signature
 * @param walletAddress - User's wallet address
 * @param signature - Signature from wallet
 * @param mode - Encryption mode ('standard' or 'argon2')
 * @returns Master key for encryption
 */
export async function deriveMasterKey(
    walletAddress: string,
    signature: string,
    mode: 'standard' | 'argon2' = 'standard'
): Promise<string> {
    // For backward compatibility, if mode is not specified, use SHA-256
    // This ensures existing passwords can still be decrypted
    if (!mode) {
        const hash = CryptoJS.SHA256(signature + walletAddress);
        return hash.toString();
    }

    // Use wallet address as deterministic salt
    const salt = CryptoJS.SHA256(walletAddress).toString().substring(0, 32);

    // Import deriveKey from crypto utilities
    const { deriveKey } = await import('./crypto');

    // Derive key using selected mode
    return await deriveKey(signature, salt, mode);
}

/**
 * Encrypt password for sharing with friend's public key
 * For demo purposes, using symmetric encryption with derived key
 * In production, use asymmetric encryption (RSA/ECDH)
 */
export function encryptForFriend(data: any, friendPublicKey: string): string {
    // Simplified: Use public key as encryption key
    // In production: Implement proper asymmetric encryption
    const derivedKey = CryptoJS.SHA256(friendPublicKey).toString();
    return encryptData(data, derivedKey);
}

/**
 * Decrypt password received from friend
 */
export function decryptFromFriend(encryptedData: string, ownPrivateKey: string): any {
    // Simplified: Use private key to derive decryption key
    // In production: Implement proper asymmetric decryption
    const derivedKey = CryptoJS.SHA256(ownPrivateKey).toString();
    return decryptData(encryptedData, derivedKey);
}
