# Zero-Knowledge Circuit for Password Authentication

## Overview

This directory contains the Circom circuit for Zero-Knowledge Proof (ZKP) based password authentication using the Groth16 protocol.

## Circuit: `auth.circom`

### Purpose
Proves knowledge of a password without revealing it by verifying that `Poseidon(password) === hash`.

### Inputs
- **password** (private): The user's actual password
- **hash** (public): The expected Poseidon hash

### How It Works
1. User enters password (kept private)
2. Circuit computes Poseidon hash of password
3. Circuit verifies hash matches the stored public hash
4. Generates a cryptographic proof
5. Proof can be verified without knowing the password

### Why Poseidon?
Poseidon is a ZK-friendly hash function specifically designed for use in zero-knowledge circuits. It's much more efficient than SHA-256 in ZK contexts.

## Compilation (Production)

To compile this circuit for production use:

```bash
# Install circom compiler
npm install -g circom

# Compile the circuit
circom auth.circom --r1cs --wasm --sym

# Generate proving and verification keys
snarkjs groth16 setup auth.r1cs pot12_final.ptau auth_0000.zkey
snarkjs zkey contribute auth_0000.zkey auth_final.zkey
snarkjs zkey export verificationkey auth_final.zkey verification_key.json
```

## Mock Implementation

Since circuit compilation requires external tools, we provide `mock-zk.js` which simulates the proof generation and verification process with realistic delays and output structure.

The mock implementation:
- Uses the same Poseidon hash function
- Simulates 1-2 second proof generation delay
- Returns Groth16-compatible proof structure
- Provides identical API to real SnarkJS

## Security

**Groth16 Protocol Benefits:**
- Constant-size proofs (~200 bytes)
- Fast verification (~10ms)
- Zero-knowledge: reveals nothing about password
- Soundness: impossible to forge valid proof without knowing password

**Current Limitations:**
- Mock implementation for demo purposes
- No trusted setup ceremony performed
- Single-use circuit (no challenge-response)

## Future Enhancements

1. Compile circuit with real Circom compiler
2. Perform trusted setup ceremony
3. Add nonce/challenge for replay protection
4. Support multiple authentication factors
5. Integrate with hardware wallets for key storage
