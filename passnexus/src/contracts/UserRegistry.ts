import { prepareContractCall, readContract, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import type { Account } from "thirdweb/wallets";
import { client } from "../client";

// Contract ABI for PassNexusRegistry
const REGISTRY_ABI = [
    {
        "inputs": [{ "internalType": "string", "name": "_email", "type": "string" }],
        "name": "registerEmail",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "_email", "type": "string" }],
        "name": "getAddressByEmail",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "_addr", "type": "address" }],
        "name": "getEmailByAddress",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "_email", "type": "string" }],
        "name": "isEmailRegistered",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "friendAddress", "type": "address" }],
        "name": "addFriend",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getFriends",
        "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "email", "type": "string" }
        ],
        "name": "EmailRegistered",
        "type": "event"
    }
] as const;

// TODO: Deploy contract and update this address
// For now using a placeholder - will be updated after deployment
const REGISTRY_ADDRESS = "0x0000000000000000000000000000000000000000";

// Sepolia testnet chain
const sepolia = defineChain(11155111);

/**
 * Get the registry contract instance
 */
export function getRegistryContract() {
    return getContract({
        client,
        chain: sepolia,
        address: REGISTRY_ADDRESS,
        abi: REGISTRY_ABI
    });
}

/**
 * Register an email for the current user
 */
export async function registerUserEmail(account: Account, email: string) {
    const contract = getRegistryContract();
    const transaction = prepareContractCall({
        contract,
        method: "function registerEmail(string _email)",
        params: [email]
    });

    return transaction;
}

/**
 * Get wallet address by email
 */
export async function getAddressByEmail(email: string): Promise<string> {
    const contract = getRegistryContract();
    const result = await readContract({
        contract,
        method: "function getAddressByEmail(string _email) view returns (address)",
        params: [email]
    });

    return result;
}

/**
 * Get email by wallet address
 */
export async function getEmailByAddress(address: string): Promise<string> {
    const contract = getRegistryContract();
    const result = await readContract({
        contract,
        method: "function getEmailByAddress(address _addr) view returns (string)",
        params: [address]
    });

    return result;
}

/**
 * Check if an email is registered
 */
export async function isEmailRegistered(email: string): Promise<boolean> {
    const contract = getRegistryContract();
    const result = await readContract({
        contract,
        method: "function isEmailRegistered(string _email) view returns (bool)",
        params: [email]
    });

    return result;
}

/**
 * Add a friend by their wallet address
 */
export async function addFriend(account: Account, friendAddress: string) {
    const contract = getRegistryContract();
    const transaction = prepareContractCall({
        contract,
        method: "function addFriend(address friendAddress)",
        params: [friendAddress]
    });

    return transaction;
}

/**
 * Get user's friends list
 */
export async function getFriends(address: string): Promise<string[]> {
    const contract = getRegistryContract();
    const result = await readContract({
        contract,
        method: "function getFriends() view returns (address[])",
        params: []
    });

    return result as string[];
}
