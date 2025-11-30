import { useState, useCallback } from 'react';
import { poseidonHash, generateProof, verifyProof, verificationKey } from '../../zk-circuit/mock-zk';

/**
 * Zero-Knowledge Proof structure (Groth16 format)
 */
export interface ZKProof {
    proof: {
        pi_a: string[];
        pi_b: string[][];
        pi_c: string[];
        protocol: string;
        curve?: string;
        _mockComputedHash?: string; // Mock-specific field
    };
    publicSignals: string[];
}

/**
 * React hook for Zero-Knowledge Proof authentication
 * 
 * Provides functions to generate and verify ZK proofs for password authentication
 * without revealing the actual password.
 * 
 * Uses Groth16 protocol with Poseidon hash function.
 */
export function useZKLogin() {
    const [isGeneratingProof, setIsGeneratingProof] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Hash a password using Poseidon hash function
     * @param password - Password to hash
     * @returns Poseidon hash as string
     */
    const hashPassword = useCallback(async (password: string): Promise<string> => {
        try {
            // Convert password string to number for hashing
            // In production, use proper encoding
            const passwordNum = password.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const hash = await poseidonHash(passwordNum);
            return hash;
        } catch (err) {
            console.error('Failed to hash password:', err);
            throw new Error('Password hashing failed');
        }
    }, []);

    /**
     * Generate a Zero-Knowledge Proof that proves knowledge of password
     * without revealing it
     * 
     * @param password - The password to prove knowledge of
     * @param storedHash - The stored hash to verify against
     * @returns ZK proof object
     */
    const generateZKProof = useCallback(async (
        password: string,
        storedHash: string
    ): Promise<ZKProof> => {
        setIsGeneratingProof(true);
        setError(null);

        try {
            // Convert password to number for circuit
            const passwordNum = password.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

            // Generate proof
            console.log('🔐 Generating Zero-Knowledge Proof...');
            const startTime = Date.now();

            const result = await generateProof({
                password: passwordNum.toString(),
                hash: storedHash
            });

            const duration = Date.now() - startTime;
            console.log(`✅ Proof generated in ${duration}ms`);
            console.log('Proof structure:', {
                protocol: result.proof.protocol,
                publicSignals: result.publicSignals
            });

            return result as ZKProof;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Proof generation failed';
            setError(errorMessage);
            console.error('Failed to generate proof:', err);
            throw new Error(errorMessage);
        } finally {
            setIsGeneratingProof(false);
        }
    }, []);

    /**
     * Verify a Zero-Knowledge Proof
     * 
     * @param proof - The ZK proof to verify
     * @returns True if proof is valid, false otherwise
     */
    const verifyZKProof = useCallback(async (
        proof: ZKProof
    ): Promise<boolean> => {
        setIsVerifying(true);
        setError(null);

        try {
            console.log('🔍 Verifying Zero-Knowledge Proof...');
            const startTime = Date.now();

            const isValid = await verifyProof(
                verificationKey,
                proof.publicSignals,
                proof.proof
            );

            const duration = Date.now() - startTime;
            console.log(`${isValid ? '✅' : '❌'} Proof verification completed in ${duration}ms`);

            return isValid;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Proof verification failed';
            setError(errorMessage);
            console.error('Failed to verify proof:', err);
            return false;
        } finally {
            setIsVerifying(false);
        }
    }, []);

    /**
     * Complete ZK authentication flow
     * Generates proof and verifies it in one step
     * 
     * @param password - Password to authenticate with
     * @param storedHash - Stored hash to verify against
     * @returns True if authentication successful
     */
    const authenticateWithZK = useCallback(async (
        password: string,
        storedHash: string
    ): Promise<boolean> => {
        try {
            // Generate proof
            const proof = await generateZKProof(password, storedHash);

            // Verify proof
            const isValid = await verifyZKProof(proof);

            return isValid;
        } catch (err) {
            console.error('ZK authentication failed:', err);
            return false;
        }
    }, [generateZKProof, verifyZKProof]);

    return {
        // State
        isGeneratingProof,
        isVerifying,
        error,

        // Functions
        hashPassword,
        generateZKProof,
        verifyZKProof,
        authenticateWithZK
    };
}
