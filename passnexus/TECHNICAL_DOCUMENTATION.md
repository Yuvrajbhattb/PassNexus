# PassNexus - Complete Technical Documentation

**Project:** PassNexus - Web3 Decentralized Password Manager  
**Version:** 0.0.0  
**Date:** December 1, 2025  
**Author:** Yuvraj

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Complete File Structure](#complete-file-structure)
4. [Architecture](#architecture)
5. [Encryption Implementation](#encryption-implementation)
6. [Core Features](#core-features)
7. [Dependencies](#dependencies)
8. [Scripts & Commands](#scripts--commands)
9. [Security Features](#security-features)

---

## Project Overview

PassNexus is a **Web3-based decentralized password manager** that combines blockchain technology, IPFS storage, and end-to-end encryption to provide a secure, privacy-first password management solution.

**Key Characteristics:**
- **Frontend:** React 19.2.0 + TypeScript 5.9.3
- **Build Tool:** Vite 7.2.4
- **Blockchain:** Ethereum (Hardhat 2.27.1)
- **Storage:** IPFS (Decentralized)
- **Messaging:** XMTP (Encrypted P2P)
- **Authentication:** Thirdweb (Multi-wallet support)

---

## Technology Stack

### Frontend Framework & Build Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | ^19.2.0 | Component-based UI library |
| **React DOM** | ^19.2.0 | React rendering for browsers |
| **TypeScript** | ~5.9.3 | Type-safe JavaScript development |
| **Vite** | ^7.2.4 | Fast build tool and dev server with HMR |
| **@vitejs/plugin-react** | ^5.1.1 | React support for Vite |
| **vite-plugin-node-polyfills** | ^0.24.0 | Node.js polyfills for browser environment |

### Blockchain & Web3 Technologies

| Tool | Version | Purpose |
|------|---------|---------|
| **Thirdweb** | ^5.114.1 | Multi-wallet connection SDK (Email, Google, MetaMask, Rabby) |
| **Ethers.js** | ^6.15.0 | Ethereum blockchain interaction library |
| **Hardhat** | ^2.27.1 | Ethereum development environment |
| **@nomicfoundation/hardhat-toolbox** | ^5.0.0 | Complete Hardhat plugins bundle |
| **Solidity** | 0.8.28 | Smart contract programming language |

### Decentralized Storage & Communication

| Tool | Version | Purpose |
|------|---------|---------|
| **ipfs-http-client** | ^60.0.1 | IPFS integration for decentralized storage |
| **@xmtp/xmtp-js** | ^13.0.4 | Encrypted peer-to-peer messaging protocol |

### Cryptography & Security

| Tool | Version | Purpose |
|------|---------|---------|
| **crypto-js** | ^4.2.0 | AES-256-CBC encryption/decryption |
| **hash-wasm** | ^4.12.0 | High-performance Argon2id hashing |
| **snarkjs** | ^0.7.5 | Zero-knowledge proof generation/verification |
| **circomlibjs** | ^0.1.7 | Zero-knowledge cryptography circuits library |

### UI, Styling & Animation

| Tool | Version | Purpose |
|------|---------|---------|
| **TailwindCSS** | ^3.4.17 | Utility-first CSS framework |
| **PostCSS** | ^8.5.6 | CSS transformation and processing |
| **Autoprefixer** | ^10.4.22 | Automatic CSS vendor prefixing |
| **Framer Motion** | ^12.23.24 | Production-ready animation library |

### Routing & Additional Features

| Tool | Version | Purpose |
|------|---------|---------|
| **React Router DOM** | ^7.9.6 | Client-side routing for SPA |
| **react-qr-code** | ^2.0.18 | QR code generation for sharing |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | ^9.39.1 | JavaScript/TypeScript linting |
| **@eslint/js** | ^9.39.1 | ESLint core JavaScript rules |
| **typescript-eslint** | ^8.46.4 | TypeScript-specific ESLint rules |
| **eslint-plugin-react-hooks** | ^7.0.1 | React Hooks linting rules |
| **eslint-plugin-react-refresh** | ^0.4.24 | React Fast Refresh linting |
| **globals** | ^16.5.0 | Global variable definitions |

### Type Definitions

| Tool | Version | Purpose |
|------|---------|---------|
| **@types/react** | ^19.2.5 | TypeScript types for React |
| **@types/react-dom** | ^19.2.3 | TypeScript types for React DOM |
| **@types/node** | ^24.10.1 | TypeScript types for Node.js |
| **@types/crypto-js** | ^4.2.2 | TypeScript types for CryptoJS |

### Polyfills

| Tool | Version | Purpose |
|------|---------|---------|
| **buffer** | ^6.0.3 | Node.js Buffer polyfill for browser |

---

## Complete File Structure

```
passnexus/
│
├── 📁 Root Configuration Files
│   ├── package.json                    (1,456 bytes) - Project dependencies and scripts
│   ├── package-lock.json               (869,083 bytes) - Dependency lock file
│   ├── tsconfig.json                   (119 bytes) - Root TypeScript configuration
│   ├── tsconfig.app.json              (732 bytes) - App TypeScript configuration
│   ├── tsconfig.node.json             (653 bytes) - Node TypeScript configuration
│   ├── vite.config.ts                 (409 bytes) - Vite build configuration
│   ├── tailwind.config.js             (347 bytes) - TailwindCSS configuration
│   ├── postcss.config.js              (100 bytes) - PostCSS configuration
│   ├── eslint.config.js               (616 bytes) - ESLint configuration
│   ├── hardhat.config.js              (401 bytes) - Hardhat/Ethereum configuration
│   └── .gitignore                     (253 bytes) - Git ignore rules
│
├── 📁 Documentation
│   ├── README.md                      (2,555 bytes) - Project README
│   └── PROJECT_REPORT.md              (14,582 bytes) - Detailed project report
│
├── 📁 Entry Point
│   └── index.html                     (358 bytes) - Main HTML entry point
│
├── 📁 Smart Contracts
│   └── contracts/
│       └── PassNexusRegistry.sol      (5,403 bytes) - User registry smart contract
│
├── 📁 Build Artifacts
│   ├── artifacts/                     - Compiled smart contracts output
│   │   └── contracts/
│   │       └── PassNexusRegistry.sol/
│   └── cache/                         - Hardhat build cache
│
├── 📁 Deployment Scripts
│   └── scripts/
│       └── deploy.js                  - Smart contract deployment script
│
├── 📁 Zero-Knowledge Circuits
│   └── zk-circuit/
│       ├── circuit.circom             - ZK circuit definition
│       ├── input.json                 - Circuit input template
│       └── verification_key.json      - Verification key
│
├── 📁 Public Assets
│   └── public/
│       └── passnexus-logo.svg        - Application logo
│
├── 📁 Source Code
│   └── src/
│       │
│       ├── 📄 Core Application Files
│       │   ├── main.tsx               (459 bytes) - Application entry point
│       │   ├── App.tsx                (405 bytes) - Root component with routing
│       │   ├── App.css                (41 bytes) - Root component styles
│       │   ├── index.css              (338 bytes) - Global styles
│       │   ├── Dashboard.tsx          (18,739 bytes) - Main dashboard component
│       │   ├── Dashboard.tsx.backup   (18,433 bytes) - Dashboard backup
│       │   ├── client.ts              (153 bytes) - Thirdweb client config
│       │   ├── types.ts               (742 bytes) - Global type definitions
│       │   └── vite-env.d.ts         (92 bytes) - Vite environment types
│       │
│       ├── 📁 Pages (1 file)
│       │   └── pages/
│       │       └── LandingPage.tsx    - Landing page component
│       │
│       ├── 📁 Components (13 files)
│       │   └── components/
│       │       ├── AddCardModal.tsx           (11,797 bytes) - Modal for adding credit cards
│       │       ├── AddPasswordModal.tsx       (10,809 bytes) - Modal for adding passwords
│       │       ├── CardItem.tsx               (5,378 bytes) - Credit card display component
│       │       ├── CardVault.tsx              (3,975 bytes) - Credit cards vault container
│       │       ├── DeleteConfirmationModal.tsx (2,310 bytes) - Delete confirmation dialog
│       │       ├── FriendsTab.tsx             (8,395 bytes) - Friends management interface
│       │       ├── Generator.tsx              (7,203 bytes) - Password generator tool
│       │       ├── Notifications.tsx          (5,038 bytes) - Notification center
│       │       ├── SharedTab.tsx              (10,248 bytes) - Shared passwords view
│       │       ├── VaultItem.tsx              (6,905 bytes) - Password vault item display
│       │       ├── ZKLoginScreen.tsx          (10,920 bytes) - Zero-knowledge login
│       │       ├── ZKModalDemo.tsx            (2,154 bytes) - ZK modal demonstration
│       │       └── ZKVerificationModal.tsx    (4,260 bytes) - ZK verification modal
│       │
│       ├── 📁 Custom Hooks (3 files)
│       │   └── hooks/
│       │       ├── useStorage.ts      (11,532 bytes) - IPFS & local storage management
│       │       ├── useXMTP.ts         (7,726 bytes) - XMTP messaging integration
│       │       └── useZKLogin.ts      (5,545 bytes) - Zero-knowledge authentication
│       │
│       ├── 📁 Utilities (3 files)
│       │   └── utils/
│       │       ├── crypto.ts          (3,145 bytes) - PBKDF2 & Argon2 key derivation
│       │       ├── encryption.ts      (2,745 bytes) - AES-256 encryption/decryption
│       │       └── ipfs.ts            (2,291 bytes) - IPFS upload/download
│       │
│       ├── 📁 Context Providers (1 file)
│       │   └── context/
│       │       └── NotificationContext.tsx - Global notification state management
│       │
│       ├── 📁 Contract Interfaces (1 file)
│       │   └── contracts/
│       │       └── UserRegistry.ts    - Smart contract TypeScript interface
│       │
│       ├── 📁 Type Definitions (2 files)
│       │   └── types/
│       │       ├── index.ts           - Shared TypeScript interfaces
│       │       └── mock-zk.d.ts      - Mock ZK type declarations
│       │
│       └── 📁 Assets
│           └── assets/
│               └── react.svg          - React logo
│
├── 📁 Test Files
│   └── test-thirdweb.js              (285 bytes) - Thirdweb integration test
│
└── 📁 Dependencies
    └── node_modules/                  - All npm packages (34 total)
```

### File Count Summary

| Category | Count | Total Size |
|----------|-------|------------|
| **Components** | 13 | ~71 KB |
| **Custom Hooks** | 3 | ~25 KB |
| **Utility Modules** | 3 | ~8 KB |
| **Pages** | 1 | - |
| **Smart Contracts** | 1 | ~5 KB |
| **Context Providers** | 1 | - |
| **Configuration Files** | 11 | ~873 KB |
| **Total Source Files** | ~34 | ~100+ KB |

---

## Architecture

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│              FRONTEND LAYER (React)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  • Components (13): UI building blocks            │  │
│  │  • Pages (1): LandingPage                         │  │
│  │  • Hooks (3): useStorage, useXMTP, useZKLogin     │  │
│  │  • Context (1): NotificationContext               │  │
│  │  • Router: React Router DOM v7                    │  │
│  └───────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           BLOCKCHAIN LAYER (Ethereum)                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │  • Smart Contract: PassNexusRegistry.sol          │  │
│  │  • Wallet: Thirdweb Multi-wallet SDK              │  │
│  │  • Library: Ethers.js v6                          │  │
│  │  • Dev Environment: Hardhat 2.27.1                │  │
│  │  • Network: Ethereum (Local/Sepolia/Mainnet)      │  │
│  └───────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│     DECENTRALIZED STORAGE & MESSAGING LAYER              │
│  ┌───────────────────────────────────────────────────┐  │
│  │  • Storage: IPFS (ipfs-http-client)               │  │
│  │  • Messaging: XMTP Protocol                       │  │
│  │  • Privacy: ZK-SNARKs (SnarkJS + Circom)          │  │
│  │  • Encryption: AES-256 + Argon2/PBKDF2            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Component Architecture

```
Dashboard.tsx (Main Container)
    │
    ├─► Sidebar Navigation
    │   ├─ My Vault (VaultItem components)
    │   ├─ Cards (CardVault → CardItem components)
    │   ├─ Generator
    │   ├─ Notifications
    │   ├─ Shared with Me (SharedTab)
    │   ├─ Friends (FriendsTab)
    │   └─ Settings
    │
    ├─► Modals
    │   ├─ AddPasswordModal
    │   ├─ AddCardModal
    │   ├─ DeleteConfirmationModal
    │   ├─ ZKLoginScreen
    │   └─ ZKVerificationModal
    │
    └─► Context Providers
        └─ NotificationContext
```

---

## Encryption Implementation

### Encryption Flow

```
┌─────────────────────────────────────────────────────┐
│  Step 1: User Connects Wallet                       │
│  • MetaMask / Email / Google / Rabby                │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  Step 2: Sign Authentication Message                │
│  • Message: "PassNexus Master Key Derivation..."    │
│  • Timestamp-based for uniqueness                   │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  Step 3: Derive Master Key                          │
│  ┌──────────────────────────────────────────────┐  │
│  │  Mode 1: PBKDF2 (Standard - Fast)            │  │
│  │  • Iterations: 100,000                        │  │
│  │  • Hash: SHA-256                              │  │
│  │  • Key Size: 256 bits                         │  │
│  │  • Salt: SHA-256(walletAddress)               │  │
│  ├──────────────────────────────────────────────┤  │
│  │  Mode 2: Argon2id (High Security - Slower)   │  │
│  │  • Memory: 1024 KB                            │  │
│  │  • Iterations: 2                              │  │
│  │  • Parallelism: 1                             │  │
│  │  • Output: 256 bits                           │  │
│  └──────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  Step 4: Encrypt Data with AES-256-CBC              │
│  • Algorithm: AES-256-CBC                           │
│  • Library: CryptoJS                                │
│  • Input: JSON stringified data                     │
│  • Output: Base64 encrypted ciphertext              │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  Step 5: Upload to IPFS                             │
│  • Client: ipfs-http-client                         │
│  • Data: Encrypted ciphertext                       │
│  • Returns: Content Identifier (CID)                │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  Step 6: Store Locally                              │
│  • Storage: localStorage                            │
│  • Key: passnexus_vault_{walletAddress}             │
│  • Data: Encrypted entries + IPFS CIDs              │
└─────────────────────────────────────────────────────┘
```

### Encryption Algorithms Used

| Component | Algorithm | Details |
|-----------|-----------|---------|
| **Symmetric Encryption** | AES-256-CBC | Industry standard, CryptoJS library |
| **Key Derivation (Standard)** | PBKDF2-HMAC-SHA256 | 100,000 iterations, OWASP recommended |
| **Key Derivation (Secure)** | Argon2id | Memory-hard, resistant to GPU attacks |
| **Hashing** | SHA-256 | Wallet address salting |
| **Zero-Knowledge** | zkSNARK | Circom circuits with SnarkJS |

### File: `utils/crypto.ts` (3,145 bytes)

**Functions:**
- `generateSalt()` - Random 16-byte salt generation
- `deriveKeyPBKDF2(password, salt)` - Standard key derivation
- `deriveKeyArgon2(password, salt)` - High-security key derivation
- `deriveKey(password, salt, mode)` - Mode-based key derivation

### File: `utils/encryption.ts` (2,745 bytes)

**Functions:**
- `encryptData(data, masterKey)` - AES-256 encryption
- `decryptData(encryptedData, masterKey)` - AES-256 decryption
- `deriveMasterKey(walletAddress, signature, mode)` - Master key from wallet
- `encryptForFriend(data, friendPublicKey)` - Friend sharing encryption
- `decryptFromFriend(encryptedData, ownPrivateKey)` - Friend sharing decryption

### File: `utils/ipfs.ts` (2,291 bytes)

**Functions:**
- `uploadToIPFS(data)` - Upload encrypted data to IPFS
- Returns Content Identifier (CID) for retrieval

---

## Core Features

### 1. Password Vault Management
- **Add Passwords:** Title, username, password, URL
- **Encryption Modes:** Standard (PBKDF2) or High Security (Argon2)
- **Storage:** IPFS + localStorage
- **Decryption:** On-demand with wallet signature
- **Delete:** Remove from local storage and vault list

### 2. Credit Card Vault
- **Supported Brands:** Visa, Mastercard, Amex, Discover
- **Encrypted Fields:** Card number, CVV
- **Stored Fields:** Cardholder name, expiry month/year, notes
- **IPFS Backup:** Double-encrypted (field-level + full object)

### 3. Password Generator
- **Length:** 8-64 characters (slider control)
- **Complexity:** Uppercase, lowercase, numbers, special characters
- **Features:** Generate, Regenerate, Copy, Clear
- **UI:** Centered card design with visual feedback

### 4. Friends & Sharing
- **Add Friends:** By wallet address or email
- **Share Passwords:** Encrypted with friend's public key
- **XMTP Messaging:** Peer-to-peer encrypted communication
- **Smart Contract:** On-chain friend registry

### 5. Zero-Knowledge Authentication
- **ZK Proofs:** SnarkJS circuit-based verification
- **Privacy:** No password storage, client-side proof generation
- **Login Screen:** Custom ZK login with visual feedback

### 6. Notifications
- **Types:** New password, shared password, friend requests
- **Badge:** Unread count on sidebar
- **Context:** Global notification state management

### 7. Multi-Wallet Support
- **MetaMask:** Browser extension wallet
- **Rabby Wallet:** Multi-chain wallet
- **Email Login:** Thirdweb in-app wallet
- **Google Social:** OAuth integration via Thirdweb

---

## Dependencies

### Production Dependencies (14 packages)

```json
{
  "@xmtp/xmtp-js": "^13.0.4",          // Encrypted messaging
  "circomlibjs": "^0.1.7",             // ZK cryptography
  "crypto-js": "^4.2.0",               // Encryption library
  "ethers": "^6.15.0",                 // Blockchain interaction
  "framer-motion": "^12.23.24",        // Animations
  "hash-wasm": "^4.12.0",              // Argon2 hashing
  "ipfs-http-client": "^60.0.1",       // IPFS client
  "react": "^19.2.0",                  // UI framework
  "react-dom": "^19.2.0",              // React rendering
  "react-qr-code": "^2.0.18",          // QR code generation
  "react-router-dom": "^7.9.6",        // Routing
  "snarkjs": "^0.7.5",                 // Zero-knowledge proofs
  "thirdweb": "^5.114.1"               // Web3 wallet SDK
}
```

### Development Dependencies (20 packages)

```json
{
  "@eslint/js": "^9.39.1",
  "@nomicfoundation/hardhat-toolbox": "^5.0.0",
  "@types/crypto-js": "^4.2.2",
  "@types/node": "^24.10.1",
  "@types/react": "^19.2.5",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^5.1.1",
  "autoprefixer": "^10.4.22",
  "buffer": "^6.0.3",
  "eslint": "^9.39.1",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "globals": "^16.5.0",
  "hardhat": "^2.27.1",
  "postcss": "^8.5.6",
  "tailwindcss": "^3.4.17",
  "typescript": "~5.9.3",
  "typescript-eslint": "^8.46.4",
  "vite": "^7.2.4",
  "vite-plugin-node-polyfills": "^0.24.0"
}
```

**Total Dependencies:** 34 packages

---

## Scripts & Commands

### Development Scripts

```json
{
  "dev": "vite",                    // Start dev server (port 5173)
  "build": "tsc -b && vite build",  // Type-check + build production
  "lint": "eslint .",               // Run code linting
  "preview": "vite preview"         // Preview production build
}
```

### Blockchain Scripts

```json
{
  "hardhat:compile": "hardhat compile",              // Compile Solidity contracts
  "hardhat:node": "hardhat node",                    // Start local Ethereum node
  "hardhat:deploy": "hardhat run scripts/deploy.js --network hardhat"  // Deploy contracts
}
```

### Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Compile smart contracts
npm run hardhat:compile

# Start local blockchain
npm run hardhat:node

# Deploy contracts
npm run hardhat:deploy
```

---

## Security Features

### 1. Client-Side Encryption
- All encryption/decryption happens in the browser
- Master key never leaves the client
- Server never sees plaintext data

### 2. Zero-Knowledge Architecture
- No passwords stored anywhere
- Wallet signature proves identity
- ZK proofs for privacy-preserving authentication

### 3. Wallet-Based Authentication
- No traditional username/password
- Cryptographic signature verification
- Multi-wallet support for flexibility

### 4. Deterministic Key Derivation
- Same wallet = same encryption key
- Reproducible across devices
- Wallet address used as salt

### 5. Decentralized Storage
- IPFS immutable storage
- Content-addressed (CID-based)
- No single point of failure

### 6. End-to-End Encrypted Messaging
- XMTP protocol for friend sharing
- Asymmetric encryption for password sharing
- Public/private key cryptography

### 7. Memory-Hard Key Derivation
- Argon2id option for high security
- Resistant to GPU/ASIC attacks
- Configurable memory hardness

### 8. Smart Contract Security
- Solidity 0.8.28 (latest secure version)
- User registration validation
- Friend connection verification

---

## Smart Contract: PassNexusRegistry.sol

**Location:** `contracts/PassNexusRegistry.sol` (5,403 bytes)

### Contract Functions

#### User Registration
```solidity
function registerUser(string memory publicKey) public
```
- Registers user with encryption public key
- Ensures no duplicate registration
- Emits `UserRegistered` event

#### Friend Management
```solidity
function addFriend(address friendAddress) public
function getFriends() public view returns (address[] memory)
function isFriend(address user, address friend) public view returns (bool)
function getFriendCount(address userAddress) public view returns (uint)
```

#### Email Registry
```solidity
function registerEmail(string memory _email) public
function getAddressByEmail(string memory _email) public view returns (address)
function getEmailByAddress(address _addr) public view returns (string memory)
function isEmailRegistered(string memory _email) public view returns (bool)
```

#### Utility Functions
```solidity
function getPublicKey(address userAddress) public view returns (string memory)
function isUserRegistered(address userAddress) public view returns (bool)
```

### Contract Features
- **User Registry:** On-chain public key storage
- **Friend Connections:** Verifiable friend relationships
- **Email Mapping:** Email-to-wallet address linking
- **Security:** Multiple require checks for validation

---

## Configuration Files

### vite.config.ts
```typescript
- React plugin enabled
- Node.js polyfills (Buffer, global, process)
- Fast HMR (Hot Module Replacement)
```

### tailwind.config.js
```javascript
Custom Colors:
  - neon-blue: #00f0ff
  - cyber-dark: #0a0e27
Content: HTML + all JS/TS/JSX/TSX files
```

### hardhat.config.js
```javascript
Solidity: 0.8.28
Network: Hardhat (ChainID: 31337)
Paths: contracts/, artifacts/, cache/
```

### tsconfig.json
```json
TypeScript: 5.9.3
Module: ESNext
Target: ES2020
Strict: Enabled
```

---

## Web3 Integration Points

### Thirdweb SDK
```typescript
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";

// Client initialization
export const client = createThirdwebClient({
    clientId: "957591f4473d501f119bfd1ff833e4cf"
});

// Wallet options
- inAppWallet (Email/Google)
- MetaMask (io.metamask)
- Rabby (io.rabby)
```

### IPFS Integration
```typescript
import { create } from 'ipfs-http-client';

// Upload to IPFS
const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
const { cid } = await ipfs.add(JSON.stringify(data));
```

### XMTP Integration
```typescript
import { Client } from '@xmtp/xmtp-js';

// Initialize XMTP client
const xmtp = await Client.create(signer);
const conversation = await xmtp.conversations.newConversation(friendAddress);
await conversation.send(encryptedPassword);
```

---

## UI/UX Design

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| **Neon Blue** | #00f0ff | Primary accent, buttons, highlights |
| **Cyber Dark** | #0a0e27 | Background, dark theme |
| **Slate 900** | #0f172a | Main background |
| **Slate 800** | #1e293b | Cards, containers |

### Design Features
- **Dark Mode** with cyberpunk aesthetic
- **Glassmorphism** - Translucent cards with backdrop blur
- **Smooth Animations** - Framer Motion transitions
- **Responsive** - Mobile-first design
- **Interactive Elements** - Hover effects, scale animations
- **Badge Notifications** - Real-time unread counts
- **Modal Dialogs** - Overlay modals for actions

### Typography
- **Font Family:** Segoe UI, system fonts
- **Headings:** Bold, gradient effects
- **Body:** Regular weight, high contrast

---

## Project Metrics

| Metric | Value |
|--------|-------|
| **Total Lines of Code** | ~15,000+ |
| **Total File Size** | ~150 KB (source) |
| **Components** | 13 |
| **Custom Hooks** | 3 |
| **Utility Modules** | 3 |
| **Smart Contracts** | 1 (Solidity) |
| **Dependencies** | 34 packages |
| **Configuration Files** | 11 |
| **Total npm Packages** | ~2,000+ (with sub-dependencies) |

---

## Testing & Development

### Local Development
```bash
# Terminal 1: Start Vite dev server
npm run dev
# Runs on http://localhost:5173

# Terminal 2: Start Hardhat node (optional)
npm run hardhat:node
# Local Ethereum node on localhost:8545
```

### Building
```bash
# TypeScript type checking + Vite build
npm run build

# Output: dist/ directory
```

### Linting
```bash
# Run ESLint
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

---

## Browser Compatibility

**Supported Browsers:**
- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)
- Brave (Latest)
- Opera (Latest)

**Required Features:**
- Web3 wallet extension (for MetaMask/Rabby)
- Modern JavaScript (ES2020+)
- localStorage support
- WebCrypto API

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│   Frontend Hosting                      │
│   - Vercel / Netlify / GitHub Pages     │
│   - Static React SPA                    │
│   - Automatic HTTPS                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Blockchain Network                    │
│   - Ethereum Mainnet / Sepolia Testnet │
│   - Smart contract deployed             │
│   - Immutable & decentralized           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   IPFS Storage                          │
│   - Pinata / Infura / Web3.Storage      │
│   - Encrypted vault data                │
│   - Content-addressed storage           │
└─────────────────────────────────────────┘
```

---

## Future Enhancement Opportunities

1. **Multi-Chain Support** - Polygon, BSC, Arbitrum
2. **Mobile Apps** - React Native iOS/Android apps
3. **Browser Extension** - Chrome/Firefox extension
4. **Hardware Wallets** - Ledger, Trezor integration
5. **2FA/MFA** - Additional authentication layers
6. **Password Health** - Strength scoring, breach monitoring
7. **Family Plans** - Shared vaults with permissions
8. **Auto-fill** - Browser auto-fill integration
9. **Import/Export** - CSV, 1Password, LastPass import
10. **Biometric Auth** - Fingerprint, Face ID support

---

## License & Attribution

**Project:** PassNexus  
**Author:** Yuvraj  
**License:** Private (Not for public distribution)  
**Year:** 2024-2025

**Third-Party Libraries:**
- React (MIT License)
- Thirdweb (Apache 2.0)
- Ethers.js (MIT)
- CryptoJS (MIT)
- All other dependencies as per their respective licenses

---

## Support & Documentation

**Project Repository:** (Private)  
**Documentation:** This file + PROJECT_REPORT.md + README.md  
**Code Comments:** Extensive inline documentation  
**Type Safety:** Full TypeScript type definitions

---

**Document Generated:** December 1, 2025  
**Version:** 1.0  
**Format:** Markdown

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # Code linting

# Blockchain
npm run hardhat:compile  # Compile contracts
npm run hardhat:node     # Local Ethereum node
npm run hardhat:deploy   # Deploy contracts

# Package Management
npm install              # Install dependencies
npm update               # Update packages
npm audit                # Security audit

# Project Info
npm list --depth=0       # List installed packages
npm outdated             # Check for updates
```

---

**END OF DOCUMENTATION**
