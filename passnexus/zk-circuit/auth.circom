pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";

/**
 * PasswordAuth Circuit
 * 
 * This circuit proves that the prover knows a password whose Poseidon hash
 * matches a public hash, without revealing the password itself.
 * 
 * Inputs:
 *   - password (private): The actual password value
 *   - hash (public): The expected Poseidon hash to verify against
 * 
 * Constraints:
 *   - Poseidon(password) === hash
 * 
 * Protocol: Groth16
 * Hash Function: Poseidon (ZK-friendly)
 */
template PasswordAuth() {
    // Private input: the actual password (kept secret)
    signal input password;
    
    // Public input: the hash we're checking against (publicly visible)
    signal input hash;
    
    // Compute Poseidon hash of the password
    // Poseidon is a ZK-friendly hash function designed for use in circuits
    component poseidon = Poseidon(1);
    poseidon.inputs[0] <== password;
    
    // Constraint: The computed hash must equal the public hash
    // This proves we know the password without revealing it
    hash === poseidon.out;
}

// Main component instantiation
component main {public [hash]} = PasswordAuth();
