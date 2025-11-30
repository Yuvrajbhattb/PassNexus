import { argon2id } from 'hash-wasm';

export type EncryptionMode = 'standard' | 'argon2';

/**
 * Generate a random salt for key derivation
 * @returns Hex string salt
 */
export function generateSalt(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Convert hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

/**
 * Convert Uint8Array to hex string
 */
function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Derive encryption key using Argon2id (High Security, Slower)
 * @param password - Password or signature to derive from
 * @param salt - Salt value (hex string)
 * @returns Derived key as hex string (256 bits)
 */
export async function deriveKeyArgon2(password: string, salt: string): Promise<string> {
    const key = await argon2id({
        password,
        salt,
        parallelism: 1,
        iterations: 2,
        memorySize: 1024, // 1 MB
        hashLength: 32, // 256 bits
        outputType: 'hex',
    });
    return key;
}

/**
 * Derive encryption key using PBKDF2 (Standard Security, Fast)
 * @param password - Password or signature to derive from
 * @param salt - Salt value (hex string)
 * @returns Derived key as hex string (256 bits)
 */
export async function deriveKeyPBKDF2(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = hexToBytes(salt);

    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    // Derive key using PBKDF2
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: saltBuffer.buffer as ArrayBuffer,
            iterations: 100000, // OWASP recommendation
            hash: 'SHA-256',
        },
        keyMaterial,
        256 // 256 bits
    );

    // Convert to hex string
    const derivedArray = new Uint8Array(derivedBits);
    return bytesToHex(derivedArray);
}

/**
 * Derive encryption key using specified mode
 * @param password - Password or signature to derive from
 * @param salt - Salt value (hex string)
 * @param mode - Encryption mode ('standard' or 'argon2')
 * @returns Derived key as hex string (256 bits)
 */
export async function deriveKey(
    password: string,
    salt: string,
    mode: EncryptionMode = 'standard'
): Promise<string> {
    if (mode === 'argon2') {
        return deriveKeyArgon2(password, salt);
    } else {
        return deriveKeyPBKDF2(password, salt);
    }
}
