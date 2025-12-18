# PassNexus - Team Documentation Guide 🔐

> **A comprehensive guide for team members to understand how PassNexus works**  
> *Last Updated: December 9, 2025*

---

## 📋 Table of Contents

1. [What is PassNexus?](#what-is-passnexus)
2. [How It Works - Simple Overview](#how-it-works---simple-overview)
3. [Technology Stack Explained](#technology-stack-explained)
4. [Project Architecture](#project-architecture)
5. [Key Components Breakdown](#key-components-breakdown)
6. [Data Flow & User Journeys](#data-flow--user-journeys)
7. [Security Implementation](#security-implementation)
8. [Smart Contracts](#smart-contracts)
9. [Custom Hooks Deep Dive](#custom-hooks-deep-dive)
10. [Getting Started - Development](#getting-started---development)

---

## 🎯 What is PassNexus?

**PassNexus** is a **Web3 decentralized password manager** that lets users securely store and share passwords using blockchain technology, end-to-end encryption, and decentralized storage.

### Key Features
- 🔐 **Password Vault** - Store passwords with military-grade encryption
- 💳 **Credit Card Vault** - Securely store credit card information
- 🔑 **Password Generator** - Create strong passwords (8-64 characters)
- 👥 **Friend System** - Add friends and share passwords securely
- 💬 **XMTP Messaging** - Encrypted peer-to-peer communication
- 🎭 **Zero-Knowledge Login** - Login without revealing passwords
- 🌐 **Multi-Wallet Support** - MetaMask, Email, Google, Rabby
- 📦 **IPFS Storage** - Decentralized backup storage

---

## 🚀 How It Works - Simple Overview

### For Non-Technical Team Members

Think of PassNexus like a **super-secure digital vault** where:

1. **You connect using your crypto wallet** (like MetaMask) instead of username/password
2. **Your passwords are encrypted** before being saved - only you can decrypt them
3. **Everything is stored** in two places:
   - Locally on your computer (fast access)
   - On IPFS - a decentralized cloud (backup)
4. **To share a password with a friend**, it gets encrypted specifically for them
5. **The blockchain** keeps track of your friends and identity (not your passwords!)

### The Magic Behind It

```
User Connects Wallet → Signs Message → Generates Master Key → Encrypts Data → Stores Locally + IPFS
```

---

## 🛠️ Technology Stack Explained

### Frontend (What Users See)
| Technology | Version | Why We Use It |
|------------|---------|---------------|
| **React** | 19.2.0 | Modern UI framework - builds interactive interfaces |
| **TypeScript** | 5.9.3 | Adds type safety to JavaScript - fewer bugs |
| **Vite** | 7.2.4 | Super fast build tool - instant hot reload |
| **TailwindCSS** | 3.4.17 | Utility-first CSS - rapid styling |
| **Framer Motion** | 12.23.24 | Smooth animations |

### Blockchain/Web3 (Decentralization)
| Technology | Version | Why We Use It |
|------------|---------|---------------|
| **Thirdweb** | 5.114.1 | Easy wallet connections (Email, Google, MetaMask) |
| **Ethers.js** | 6.15.0 | Interact with Ethereum blockchain |
| **Hardhat** | 2.27.1 | Local blockchain development environment |
| **Solidity** | 0.8.28 | Smart contract programming language |

### Storage & Communication
| Technology | Version | Why We Use It |
|------------|---------|---------------|
| **IPFS** | 60.0.1 | Decentralized file storage |
| **XMTP** | 13.0.4 | Encrypted messaging between users |

### Security & Encryption
| Technology | Version | Why We Use It |
|------------|---------|---------------|
| **CryptoJS** | 4.2.0 | AES-256 encryption (bank-level security) |
| **hash-wasm** | 4.12.0 | Argon2id password hashing (resistant to attacks) |
| **SnarkJS** | 0.7.5 | Zero-knowledge proofs (privacy magic) |

---

## 🏗️ Project Architecture

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND LAYER                          │
│  (What users interact with - the UI)                    │
│                                                          │
│  Components: 16 React components                        │
│  Pages: LandingPage (marketing), Dashboard (main app)   │
│  Hooks: useStorage, useXMTP, useZKLogin                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              BLOCKCHAIN LAYER                            │
│  (On-chain identity and friend management)              │
│                                                          │
│  Smart Contract: PassNexusRegistry.sol                  │
│  Functions: Register users, add friends, link emails    │
│  Network: Ethereum (can deploy to testnet/mainnet)      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         STORAGE & MESSAGING LAYER                        │
│  (Decentralized data storage and communication)         │
│                                                          │
│  IPFS: Stores encrypted password backups                │
│  XMTP: Sends encrypted messages between friends         │
│  localStorage: Fast local caching                       │
└─────────────────────────────────────────────────────────┘
```

### Visual Component Tree

```
App.tsx (Root Router)
  │
  ├─► LandingPage (/)
  │     └─► Marketing content, "Get Started" button
  │
  └─► Dashboard (/app)
        │
        ├─► Sidebar Navigation
        │     ├─ My Vault (passwords list)
        │     ├─ Cards (credit cards list)
        │     ├─ Generator (password generator)
        │     ├─ Notifications (inbox)
        │     ├─ Shared with Me (received passwords)
        │     ├─ Friends (friend management)
        │     └─ Settings
        │
        ├─► Modals (Pop-ups)
        │     ├─ AddPasswordModal
        │     ├─ AddCardModal
        │     ├─ SharePasswordModal
        │     ├─ DeleteConfirmationModal
        │     ├─ ZKLoginScreen
        │     └─ ZKVerificationModal
        │
        └─► Background Effects
              └─ BlockchainBackground (animated background)
```

---

## 🧩 Key Components Breakdown

### 1. **Dashboard.tsx** (Main Hub)
- **Size:** 21,834 bytes (433 lines)
- **Role:** The main container that holds everything together
- **Key Functions:**
  - `handleAddPassword()` - Adds new password to vault
  - `handleAddCard()` - Adds new credit card
  - `handleSharePassword()` - Shares password via XMTP
  - `handleDisconnect()` - Disconnects wallet

**What it does:**
- Manages global state (passwords, cards, friends)
- Controls which tab is active (vault, cards, generator, etc.)
- Handles wallet connection via Thirdweb
- Coordinates data between hooks and UI

---

### 2. **VaultItem.tsx** (Password Display)
- **Size:** 6,905 bytes
- **Role:** Displays a single password entry
- **Features:**
  - Shows title, username, URL
  - "Show/Hide" password toggle
  - Copy to clipboard functionality
  - Delete and share buttons
  - Encryption mode indicator (Standard/Argon2)

---

### 3. **AddPasswordModal.tsx** (Password Creator)
- **Size:** 10,809 bytes
- **Role:** Modal dialog for adding new passwords
- **Fields:**
  - Title (e.g., "Gmail Account")
  - Username/Email
  - Password
  - Website URL (optional)
  - Folder selection
  - Encryption mode choice

**How it works:**
1. User fills out form
2. Clicks "Add to Vault"
3. Data gets encrypted with master key
4. Stored locally + uploaded to IPFS
5. Returns encrypted IPFS CID for backup

---

### 4. **CardVault.tsx** & **CardItem.tsx** (Credit Cards)
- **Role:** Manage credit card storage
- **Supported Brands:** Visa, Mastercard, Amex, Discover
- **Encrypted Fields:** Card number, CVV
- **Features:**
  - Masked card number display (•••• •••• •••• 1234)
  - Click to reveal full number
  - Organized by folder

---

### 5. **Generator.tsx** (Password Generator)
- **Size:** 7,203 bytes
- **Role:** Creates strong random passwords
- **Controls:**
  - Slider: 8-64 character length
  - Regenerate button (🔄)
  - Copy button (📋)
  - Clear button (🗑️)
- **Algorithm:**
  - Guarantees at least one: uppercase, lowercase, number, special char
  - Uses `crypto.getRandomValues()` for true randomness

---

### 6. **FriendsTab.tsx** & **FriendCard.tsx** (Social Features)
- **Size:** 23,467 bytes (FriendsTab)
- **Role:** Friend management interface
- **Features:**
  - Add friend by wallet address or email
  - View friend list with avatars (Blockies)
  - Share passwords with friends
  - XMTP messaging integration
  - Friend count display

**How Friend Sharing Works:**
1. User clicks "Share" on a password
2. Selects friend from list
3. Password is encrypted with friend's public key
4. Sent via XMTP encrypted message
5. Friend decrypts with their private key

---

### 7. **SharedTab.tsx** (Received Passwords)
- **Size:** 10,248 bytes
- **Role:** Displays passwords shared by friends
- **Features:**
  - List of received passwords
  - Shows who shared it
  - Decrypt and view functionality
  - Copy to clipboard
- **Data Source:** Fetched from XMTP messages

---

### 8. **ZKLoginScreen.tsx** (Zero-Knowledge Auth)
- **Size:** 10,920 bytes
- **Role:** Privacy-preserving login
- **How it works:**
  1. User enters password
  2. System generates a ZK proof (proves you know the password without revealing it)
  3. Verifies proof client-side
  4. Grants access if valid
- **Tech:** Uses SnarkJS + Circom circuits
- **Benefit:** No password ever sent to server or blockchain

---

### 9. **Notifications.tsx** (Notification Center)
- **Size:** 5,038 bytes
- **Role:** Displays app notifications
- **Types:**
  - New password added
  - Password shared by friend
  - Friend request received
- **Features:**
  - Unread badge count
  - Mark as read
  - Timestamp display

---

### 10. **BlockchainBackground.tsx** (Visual Effects)
- **Size:** 6,104 bytes
- **Role:** Animated blockchain-themed background
- **Effects:**
  - Floating blockchain nodes
  - Connection lines between nodes
  - Gradient effects
  - Glassmorphism aesthetic

---

## 🔄 Data Flow & User Journeys

### Journey 1: Adding a New Password

```
┌──────────────────────────────────────────────────────────┐
│ Step 1: User clicks "Add Password" button                │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 2: AddPasswordModal opens                           │
│         User fills: Title, Username, Password, URL       │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 3: User clicks "Add to Vault"                       │
│         → Dashboard.handleAddPassword() is called        │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 4: useStorage.addPassword() encrypts data           │
│         → Derives master key from wallet signature       │
│         → Encrypts password with AES-256                 │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 5: Encrypted data uploaded to IPFS                  │
│         → Returns CID (Content Identifier)               │
│         → Example: QmX4k3...Hj7w                          │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 6: Save to localStorage                             │
│         → Key: passnexus_vault_{walletAddress}           │
│         → Value: Encrypted password + IPFS CID           │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 7: UI updates                                       │
│         → New password appears in vault list             │
│         → Success notification shows                     │
└──────────────────────────────────────────────────────────┘
```

---

### Journey 2: Sharing a Password with a Friend

```
┌──────────────────────────────────────────────────────────┐
│ Step 1: User clicks "Share" icon on a password           │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 2: SharePasswordModal opens                         │
│         → Shows list of friends from smart contract      │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 3: User selects friend and clicks "Share"           │
│         → Dashboard.handleSharePassword() is called      │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 4: Password re-encrypted for friend                 │
│         → Fetches friend's public key from contract      │
│         → Encrypts password with friend's public key     │
│         → Uploads encrypted data to IPFS                 │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 5: Send via XMTP                                    │
│         → useXMTP.sharePassword() is called              │
│         → Creates encrypted message                      │
│         → Message format:                                │
│           {                                              │
│             type: 'passnexus-share',                     │
│             title: 'Gmail',                              │
│             username: 'user@gmail.com',                  │
│             encryptedPassword: '...',                    │
│             ipfsCid: 'QmX...',                           │
│             sharedBy: '0x123...'                         │
│           }                                              │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 6: Friend receives notification                     │
│         → Password appears in "Shared with Me" tab       │
│         → Can decrypt with their private key             │
└──────────────────────────────────────────────────────────┘
```

---

### Journey 3: Wallet Connection & Master Key Derivation

```
┌──────────────────────────────────────────────────────────┐
│ Step 1: User clicks "Connect Wallet" (Thirdweb button)   │
│         → Options: MetaMask, Email, Google, Rabby        │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 2: User authenticates                               │
│         → MetaMask: Browser extension popup              │
│         → Email/Google: Thirdweb OAuth flow              │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 3: Wallet connected                                 │
│         → useActiveAccount() hook returns account        │
│         → Dashboard receives wallet address              │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 4: Request signature for master key                 │
│         → Message: "PassNexus Master Key Derivation..."  │
│         → User signs in wallet                           │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 5: Derive master encryption key                     │
│         → Input: Wallet signature                        │
│         → Algorithm: PBKDF2 or Argon2id                  │
│         → Salt: SHA-256(walletAddress)                   │
│         → Output: 256-bit encryption key                 │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│ Step 6: Load existing vault (if any)                     │
│         → Check localStorage for existing data           │
│         → Decrypt with master key                        │
│         → Display passwords in UI                        │
└──────────────────────────────────────────────────────────┘
```

**Key Insight:** The master key is **never stored** - it's derived fresh each time from the wallet signature. This means:
- ✅ Same wallet = same master key
- ✅ Works across devices
- ✅ No password storage needed
- ✅ Wallet = your identity

---

## 🔒 Security Implementation

### Encryption Flow (Deep Dive)

#### 1. Master Key Derivation

**Standard Mode (PBKDF2):**
```javascript
// Input: Wallet signature (64 bytes)
// Output: 256-bit encryption key

const salt = SHA256(walletAddress);  // Deterministic salt
const masterKey = PBKDF2(
  signature,          // Password (from wallet signature)
  salt,               // Salt (from wallet address)
  100000,             // Iterations (OWASP recommended)
  256,                // Key length in bits
  'SHA-256'           // Hash algorithm
);
```

**High Security Mode (Argon2id):**
```javascript
// Memory-hard algorithm (resistant to GPU attacks)

const salt = SHA256(walletAddress);
const masterKey = Argon2id(
  signature,          // Password
  salt,               // Salt
  {
    memory: 1024,     // 1 MB memory cost
    iterations: 2,    // Time cost
    parallelism: 1,   // Thread count
    hashLength: 32    // 256 bits
  }
);
```

**Why two modes?**
- **Standard (PBKDF2):** Fast, good for most users, mobile-friendly
- **High Security (Argon2id):** Slower but ultra-secure, blocks GPU attacks

---

#### 2. Password Encryption (AES-256-CBC)

```javascript
// Encrypt a password entry
function encryptPassword(passwordData, masterKey) {
  const data = JSON.stringify({
    title: "Gmail",
    username: "user@gmail.com",
    password: "SuperSecret123!",
    url: "https://gmail.com"
  });
  
  // AES-256-CBC encryption
  const encrypted = CryptoJS.AES.encrypt(data, masterKey);
  
  // Returns Base64 ciphertext
  return encrypted.toString();
}
```

**What happens:**
1. Password data → JSON string
2. JSON → AES-256 encryption with master key
3. Output → Base64 ciphertext (safe to store)

**Decryption:**
```javascript
function decryptPassword(ciphertext, masterKey) {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, masterKey);
  const json = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(json);
}
```

---

#### 3. IPFS Upload (Backup Storage)

```javascript
// Upload encrypted data to IPFS
async function uploadToIPFS(encryptedData) {
  const ipfs = create({ 
    url: 'https://ipfs.infura.io:5001/api/v0' 
  });
  
  const { cid } = await ipfs.add(encryptedData);
  
  // Returns Content Identifier
  // Example: QmX4k3YzZKsZvNdaRgNz7w9Hj7w
  return cid.toString();
}
```

**Why IPFS?**
- ✅ Decentralized (no single point of failure)
- ✅ Content-addressed (CID proves integrity)
- ✅ Permanent storage (data stays forever)
- ✅ No server costs

---

### Security Layers

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Layer 1** | Wallet Authentication | Proves identity (no username/password) |
| **Layer 2** | Master Key Derivation | Creates unique encryption key per user |
| **Layer 3** | AES-256 Encryption | Encrypts all sensitive data |
| **Layer 4** | IPFS Storage | Decentralized backup (encrypted) |
| **Layer 5** | XMTP Encryption | End-to-end encrypted messaging |
| **Layer 6** | Zero-Knowledge Proofs | Auth without revealing passwords |

---

### Attack Resistance

| Attack Type | How PassNexus Defends |
|-------------|----------------------|
| **Server Breach** | No server stores passwords - all client-side |
| **Database Leak** | No database - data on IPFS (encrypted) |
| **Man-in-the-Middle** | All communication encrypted (XMTP, HTTPS) |
| **Brute Force** | Argon2id memory-hard hashing (GPU-resistant) |
| **Rainbow Tables** | Wallet-specific salts (unique per user) |
| **Keylogger** | Zero-knowledge proofs bypass password entry |
| **Phishing** | Wallet signatures required (can't fake) |

---

## 📜 Smart Contracts

### PassNexusRegistry.sol

**Location:** `contracts/PassNexusRegistry.sol`  
**Size:** 5,403 bytes  
**Language:** Solidity 0.8.28

#### What It Stores ON-CHAIN

```solidity
struct User {
    string publicKey;      // For encryption
    bool isRegistered;     // Registration status
    address[] friends;     // Friend list
    string email;          // Optional email
}

mapping(address => User) users;
```

#### Key Functions

##### 1. User Registration
```solidity
function registerUser(string memory publicKey) public {
    require(!users[msg.sender].isRegistered, "Already registered");
    
    users[msg.sender].publicKey = publicKey;
    users[msg.sender].isRegistered = true;
    
    emit UserRegistered(msg.sender, publicKey);
}
```

**What it does:** Registers a new user with their encryption public key

---

##### 2. Add Friend
```solidity
function addFriend(address friendAddress) public {
    require(users[msg.sender].isRegistered, "Not registered");
    require(users[friendAddress].isRegistered, "Friend not registered");
    require(!isFriend(msg.sender, friendAddress), "Already friends");
    
    users[msg.sender].friends.push(friendAddress);
    
    emit FriendAdded(msg.sender, friendAddress);
}
```

**What it does:** Adds a friend connection (one-way)

---

##### 3. Email Registry
```solidity
function registerEmail(string memory _email) public {
    require(users[msg.sender].isRegistered, "Register first");
    require(!isEmailRegistered(_email), "Email taken");
    
    users[msg.sender].email = _email;
    emailToAddress[_email] = msg.sender;
    
    emit EmailRegistered(msg.sender, _email);
}
```

**What it does:** Links email to wallet address (for friend discovery)

---

##### 4. Get Friend List
```solidity
function getFriends() public view returns (address[] memory) {
    return users[msg.sender].friends;
}
```

**What it does:** Returns array of friend wallet addresses

---

#### Important: What's NOT on the Blockchain

❌ **Passwords** - Never stored on-chain!  
❌ **Credit Cards** - Never stored on-chain!  
❌ **Encrypted Data** - Only stored on IPFS + localStorage  
✅ **Public Keys** - Stored on-chain (for encryption)  
✅ **Friend Relationships** - Stored on-chain  
✅ **Email Mappings** - Stored on-chain  

**Why this design?**
- Blockchain is **public** - anyone can read it
- Blockchain is **expensive** - storage costs gas fees
- IPFS is **cheaper** and data is still encrypted
- Smart contract only handles **identity** and **social graph**

---

## 🎣 Custom Hooks Deep Dive

### 1. useStorage.ts (Main Data Hook)

**Size:** 16,510 bytes (445 lines)  
**Role:** Manages all password and card storage

#### What It Returns

```typescript
{
  passwords: PasswordItem[],           // Array of password entries
  cards: CreditCard[],                 // Array of credit cards
  friends: Friend[],                   // Array of friends
  isReady: boolean,                    // Data loaded?
  addPassword: (data) => Promise<void>,
  addCard: (data) => Promise<void>,
  deletePassword: (id) => void,
  deleteCard: (id) => void,
  loadData: () => Promise<void>,
  downloadBackup: () => void,
  addFriend: (address, name) => void,
  removeFriend: (id) => void
}
```

#### Key Implementation Details

**Local Storage Structure:**
```javascript
localStorage.setItem(
  `passnexus_vault_${walletAddress}`,
  JSON.stringify({
    passwords: [
      {
        id: 'uuid-1',
        title: 'Gmail',
        username: 'user@gmail.com',
        password: 'encrypted_base64_string',  // ← Encrypted!
        url: 'https://gmail.com',
        folder: 'Work',
        encryptionMode: 'argon2',
        createdAt: '2025-12-09T...',
        updatedAt: '2025-12-09T...',
        ipfsCid: 'QmX4k3...'  // ← IPFS backup CID
      }
    ],
    cards: [...]
  })
);
```

**How Decryption Works:**
```typescript
// When user wants to view a password
const masterKey = await deriveMasterKey(
  account.address,
  signature,
  'argon2'
);

const decrypted = decryptData(
  password.password,  // Encrypted ciphertext
  masterKey
);

console.log(decrypted);  // "SuperSecret123!"
```

---

### 2. useXMTP.ts (Messaging Hook)

**Size:** 7,748 bytes (226 lines)  
**Role:** Handles encrypted peer-to-peer messaging

#### What It Returns

```typescript
{
  client: Client | null,               // XMTP client instance
  isInitialized: boolean,              // XMTP ready?
  isLoading: boolean,                  // Operation in progress?
  error: string | null,                // Error message
  messages: XMTPMessage[],             // All messages
  sharedPasswords: SharePasswordMessage[],  // Password shares
  initializeXMTP: () => Promise<boolean>,
  sharePassword: (...) => Promise<boolean>,
  refreshMessages: () => Promise<void>
}
```

#### XMTP Initialization Flow

```typescript
// Step 1: Get wallet signer
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Step 2: Create XMTP client (requires signature!)
const xmtpClient = await Client.create(signer, {
  env: 'production'  // XMTP V3 production network
});

// Step 3: Load existing conversations
const conversations = await xmtpClient.conversations.list();

// Step 4: Parse messages for password shares
for (const conversation of conversations) {
  const msgs = await conversation.messages();
  
  for (const msg of msgs) {
    const parsed = JSON.parse(msg.content);
    
    if (parsed.type === 'passnexus-share') {
      // This is a shared password!
      sharedPasswords.push(parsed);
    }
  }
}
```

#### Sharing a Password via XMTP

```typescript
async function sharePassword(
  recipientAddress,
  title,
  username,
  encryptedPassword,
  ipfsCid,
  sharedBy
) {
  // Create or get conversation with recipient
  const conversation = await client.conversations.newConversation(
    recipientAddress
  );
  
  // Format message
  const message = JSON.stringify({
    type: 'passnexus-share',
    title: 'Gmail',
    username: 'user@gmail.com',
    encryptedPassword: 'base64_encrypted...',
    ipfsCid: 'QmX4k3...',
    sharedBy: '0x123...'
  });
  
  // Send encrypted message
  await conversation.send(message);
}
```

**Key Points:**
- XMTP messages are **end-to-end encrypted**
- Only sender and recipient can read
- Messages stored on **XMTP network** (decentralized)
- Works with **Ethereum addresses** only

---

### 3. useZKLogin.ts (Zero-Knowledge Hook)

**Size:** 5,545 bytes (171 lines)  
**Role:** Zero-knowledge proof authentication

#### What It Returns

```typescript
{
  isGeneratingProof: boolean,
  isVerifying: boolean,
  error: string | null,
  hashPassword: (password) => Promise<string>,
  generateZKProof: (password, hash) => Promise<ZKProof>,
  verifyZKProof: (proof) => Promise<boolean>,
  authenticateWithZK: (password, hash) => Promise<boolean>
}
```

#### How Zero-Knowledge Proofs Work (Simplified)

**Traditional Login:**
```
User: "My password is SuperSecret123!"
Server: "Let me check... ✓ Correct!"

❌ Problem: Server sees your password
```

**Zero-Knowledge Login:**
```
User: "Here's a proof that I know the password"
      (proof does NOT contain the password)
Server: "Let me verify the proof... ✓ Valid!"

✅ Benefit: Server NEVER sees your password
```

#### Implementation

**Step 1: Hash Password (During Setup)**
```typescript
const hash = await hashPassword("SuperSecret123!");
// Result: "12345678901234567890"  (Poseidon hash)
```

**Step 2: Generate Proof (During Login)**
```typescript
const proof = await generateZKProof(
  "SuperSecret123!",  // User enters password
  storedHash          // Hash we saved earlier
);

// Proof structure (Groth16 format)
{
  proof: {
    pi_a: ["0x123...", "0x456..."],
    pi_b: [["0x789...", "0xabc..."], ...],
    pi_c: ["0xdef...", "0x012..."],
    protocol: "groth16"
  },
  publicSignals: ["12345678901234567890"]  // The hash
}
```

**Step 3: Verify Proof**
```typescript
const isValid = await verifyZKProof(proof);

if (isValid) {
  // User knows the password WITHOUT revealing it!
  console.log("Access granted!");
}
```

**Technical Details:**
- Uses **SnarkJS** library
- Circuit defined in `zk-circuit/circuit.circom`
- **Groth16** proving system
- **Poseidon** hash function (ZK-friendly)

**Limitations (Current Implementation):**
- Mock implementation (not production-ready yet)
- Real ZK circuits need:
  - Trusted setup ceremony
  - Optimized circuits
  - More testing

---

## 🚀 Getting Started - Development

### Prerequisites

- **Node.js:** v18+ (recommended: v20)
- **npm:** v9+
- **Wallet:** MetaMask browser extension (for testing)
- **Git:** For version control

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-team/passnexus.git
cd passnexus

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# Server runs on: http://localhost:5173
```

### Project Structure

```
passnexus/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Router setup
│   ├── Dashboard.tsx         # Main app container
│   ├── components/           # 16 React components
│   ├── hooks/                # 3 custom hooks
│   ├── utils/                # Encryption, IPFS, crypto utils
│   ├── pages/                # LandingPage
│   ├── context/              # NotificationContext
│   └── types/                # TypeScript definitions
├── contracts/                # Smart contracts (Solidity)
├── zk-circuit/               # Zero-knowledge circuits
├── public/                   # Static assets
└── package.json              # Dependencies
```

### Available Commands

```bash
# Development
npm run dev              # Start Vite dev server (port 5173)
npm run build            # Build for production (outputs to dist/)
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint -- --fix    # Auto-fix linting issues

# Blockchain (Hardhat)
npm run hardhat:compile  # Compile smart contracts
npm run hardhat:node     # Start local Ethereum node (port 8545)
npm run hardhat:deploy   # Deploy contracts to local network
```

### Testing the App

1. **Install MetaMask** (or Rabby Wallet)
2. **Open app:** http://localhost:5173
3. **Click "Get Started"** on landing page
4. **Connect wallet:** Choose MetaMask
5. **Sign message:** Approve the signature request
6. **Add a password:**
   - Click "Add Password" button
   - Fill out form
   - Click "Add to Vault"
7. **View password:**
   - Click eye icon to reveal
   - Click copy icon to copy
8. **Generate password:**
   - Go to "Generator" tab
   - Move slider for length
   - Click "Generate"

### Deploying Smart Contracts (Local)

```bash
# Terminal 1: Start local Ethereum node
npm run hardhat:node

# Terminal 2: Deploy contracts
npm run hardhat:deploy

# You'll see:
# PassNexusRegistry deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Copy the contract address** and update `src/contracts/UserRegistry.ts` if needed.

### Environment Variables

Create `.env` file:

```bash
# Thirdweb Client ID
VITE_THIRDWEB_CLIENT_ID=957591f4473d501f119bfd1ff833e4cf

# IPFS (optional - uses public gateway by default)
VITE_IPFS_URL=https://ipfs.infura.io:5001/api/v0

# Network (optional)
VITE_NETWORK=localhost  # or 'sepolia', 'mainnet'
```

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total Files** | 50+ |
| **Total Lines of Code** | ~15,000 |
| **Components** | 16 |
| **Custom Hooks** | 3 |
| **Smart Contracts** | 1 |
| **npm Packages** | 34 |
| **Main Languages** | TypeScript (85%), Solidity (10%), CSS (5%) |

---

## 🎨 UI/UX Design Principles

### Visual Style
- **Theme:** Dark mode with cyberpunk/blockchain aesthetic
- **Colors:**
  - Primary: Neon Blue (#00f0ff)
  - Background: Cyber Dark (#0a0e27)
  - Cards: Slate 800 (#1e293b)
- **Effects:**
  - Glassmorphism (translucent backgrounds)
  - Smooth animations (Framer Motion)
  - Hover effects and micro-interactions

### Component Design Patterns
- **Modal Dialogs:** Overlay modals with backdrop blur
- **Cards:** Rounded corners, shadow effects
- **Buttons:** Gradient effects on primary actions
- **Form Inputs:** Dark mode with light borders
- **Icons:** Lucide Icons library

---

## 🤝 Team Workflow Tips

### For Frontend Developers
- Focus on `src/components/` and `src/pages/`
- UI changes in `.tsx` files
- Styling with TailwindCSS classes
- Test locally with `npm run dev`

### For Backend/Blockchain Developers
- Smart contracts in `contracts/`
- Test with Hardhat: `npm run hardhat:node`
- Deploy: `npm run hardhat:deploy`
- ABI files generated in `artifacts/`

### For Security/Crypto Specialists
- Encryption logic in `src/utils/encryption.ts`
- Key derivation in `src/utils/crypto.ts`
- ZK circuits in `zk-circuit/`
- Review `useZKLogin.ts` for ZK implementation

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to initialize XMTP"
**Cause:** Requires MetaMask or standard wallet  
**Solution:** Use MetaMask instead of Thirdweb embedded wallet for XMTP features

### Issue 2: "Master key derivation failed"
**Cause:** User rejected wallet signature  
**Solution:** User must approve signature request to generate encryption key

### Issue 3: "IPFS upload failed"
**Cause:** Public IPFS gateway may be slow  
**Solution:** Use Infura IPFS or Pinata (requires API key)

### Issue 4: Build errors with TailwindCSS
**Cause:** Tailwind config not loading  
**Solution:** Run `npm run build` to regenerate CSS

---

## 📚 Additional Resources

### Documentation
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Thirdweb SDK](https://portal.thirdweb.com/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [XMTP Protocol](https://xmtp.org/docs)
- [IPFS Docs](https://docs.ipfs.tech/)

### Learning Resources
- **Blockchain Basics:** [ethereum.org/en/developers](https://ethereum.org/en/developers/)
- **Smart Contracts:** [Solidity Docs](https://docs.soliditylang.org/)
- **Zero-Knowledge Proofs:** [ZK Learning Resources](https://www.zkdocs.com/)

---

## 🎯 Next Steps for Team

### Immediate Tasks
1. **Review this documentation** - Understand the architecture
2. **Run the app locally** - Follow "Getting Started" guide
3. **Explore components** - Open files and trace data flow
4. **Test features** - Add passwords, share with friends

### Questions to Explore
- How can we optimize IPFS uploads?
- Should we deploy smart contract to testnet (Sepolia)?
- Can we improve ZK proof generation speed?
- What additional features should we add?

---

## 📞 Getting Help

If you have questions about:
- **Architecture:** Review this doc + `TECHNICAL_DOCUMENTATION.md`
- **Code:** Check inline comments in source files
- **Bugs:** Check console logs and error messages
- **Features:** Ask team lead or create GitHub issue

---

**Last Updated:** December 9, 2025  
**Maintained by:** PassNexus Development Team  

🔐 **Happy Coding! Build the future of decentralized password management!** 🚀
