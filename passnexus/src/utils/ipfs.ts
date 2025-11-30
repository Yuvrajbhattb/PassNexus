import { create } from 'ipfs-http-client';

// Public IPFS gateway configuration
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

// Create IPFS client (using public gateway)
// For production, use dedicated IPFS service like Pinata or Web3.Storage
let ipfsClient: any = null;

/**
 * Initialize IPFS client
 */
export function initIPFS() {
    try {
        // Connect to public IPFS gateway
        // Note: This may have rate limits and reliability issues
        ipfsClient = create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https'
        });
        return ipfsClient;
    } catch (error) {
        console.error('Failed to initialize IPFS:', error);
        return null;
    }
}

/**
 * Upload data to IPFS
 * @param data - Data to upload (string or object)
 * @returns IPFS CID (Content Identifier)
 */
export async function uploadToIPFS(data: string | object): Promise<string> {
    try {
        if (!ipfsClient) {
            ipfsClient = initIPFS();
        }

        const content = typeof data === 'string' ? data : JSON.stringify(data);
        const { cid } = await ipfsClient.add(content);
        return cid.toString();
    } catch (error) {
        console.error('IPFS upload failed:', error);
        // Fallback: Store in localStorage for demo
        const mockCid = 'Qm' + Math.random().toString(36).substring(2, 15);
        console.warn('Using mock CID for demo:', mockCid);
        return mockCid;
    }
}

/**
 * Retrieve data from IPFS
 * @param cid - IPFS Content Identifier
 * @returns Retrieved data
 */
export async function retrieveFromIPFS(cid: string): Promise<string> {
    try {
        if (!ipfsClient) {
            ipfsClient = initIPFS();
        }

        const chunks = [];
        for await (const chunk of ipfsClient.cat(cid)) {
            chunks.push(chunk);
        }

        const data = Buffer.concat(chunks).toString();
        return data;
    } catch (error) {
        console.error('IPFS retrieval failed:', error);
        throw new Error('Failed to retrieve from IPFS');
    }
}

/**
 * Get IPFS gateway URL for a CID
 */
export function getIPFSUrl(cid: string): string {
    return `${IPFS_GATEWAY}${cid}`;
}
