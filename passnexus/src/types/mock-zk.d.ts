// Type definitions for mock-zk module
declare module '../../zk-circuit/mock-zk' {
    export function poseidonHash(value: string | number | bigint): Promise<string>;

    export function generateProof(inputs: {
        password: string;
        hash: string;
    }): Promise<{
        proof: {
            pi_a: string[];
            pi_b: string[][];
            pi_c: string[];
            protocol: string;
            curve?: string;
            _mockComputedHash?: string;
        };
        publicSignals: string[];
    }>;

    export function verifyProof(
        verificationKey: any,
        publicSignals: string[],
        proof: any
    ): Promise<boolean>;

    export const verificationKey: {
        protocol: string;
        curve: string;
        nPublic: number;
        vk_alpha_1: string[];
        vk_beta_2: string[][];
        vk_gamma_2: string[][];
        vk_delta_2: string[][];
        vk_alphabeta_12: any[];
        IC: string[][];
    };
}
