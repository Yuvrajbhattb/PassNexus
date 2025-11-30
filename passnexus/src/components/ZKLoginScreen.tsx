import { useState } from 'react';
import { motion } from 'framer-motion';
import { useZKLogin } from '../hooks/useZKLogin';
import ZKVerificationModal from './ZKVerificationModal';

interface ZKLoginScreenProps {
    onAuthenticated: () => void;
    walletAddress: string;
}

export default function ZKLoginScreen({ onAuthenticated, walletAddress }: ZKLoginScreenProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const { isGeneratingProof, authenticateWithZK, hashPassword } = useZKLogin();

    // Get or create stored hash
    const getStoredHash = async () => {
        const storageKey = `passnexus_zk_hash_${walletAddress}`;
        let storedHash = localStorage.getItem(storageKey);

        if (!storedHash) {
            // First time setup - use default password "demo123"
            // In production, prompt user to set password
            const defaultPassword = 'demo123';
            storedHash = await hashPassword(defaultPassword);
            localStorage.setItem(storageKey, storedHash);
            console.log('🔑 First time setup: Default password is "demo123"');
        }

        return storedHash;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!password) {
            setError('Please enter a password');
            return;
        }

        try {
            // Get stored hash
            const storedHash = await getStoredHash();

            // Show verification modal - it will handle the verification flow
            setShowVerificationModal(true);

            // Authenticate with ZK proof in background
            const isValid = await authenticateWithZK(password, storedHash);

            // Store result for modal callback
            if (!isValid) {
                setShowVerificationModal(false);
                setError('Invalid password. Proof verification failed.');
                console.log('❌ Zero-Knowledge authentication failed');
            }
        } catch (err) {
            setShowVerificationModal(false);
            console.error('Authentication error:', err);
            setError('Authentication failed. Please try again.');
        }
    };

    const handleVerifySuccess = () => {
        console.log('✅ Zero-Knowledge authentication successful!');
        setShowVerificationModal(false);
        setTimeout(() => {
            onAuthenticated();
        }, 500);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="mb-4"
                    >
                        <h1 className="text-4xl font-bold text-neon-blue neon-glow">PassNexus</h1>
                        <p className="text-gray-400 text-sm mt-2">Zero-Knowledge Authentication</p>
                    </motion.div>

                    {/* ZK Circuit Animation */}
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="w-20 h-20 mx-auto mb-4 relative"
                    >
                        <div className="absolute inset-0 border-4 border-neon-blue/30 rounded-full"></div>
                        <div className="absolute inset-2 border-4 border-purple-500/30 rounded-full"></div>
                        <div className="absolute inset-4 border-4 border-neon-blue/50 rounded-full"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                            🛡️
                        </div>
                    </motion.div>
                </div>

                {/* Login Card */}
                <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="bg-slate-800 rounded-xl border border-slate-700 p-6"
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white mb-2">Unlock Vault</h2>
                        <p className="text-sm text-gray-400">
                            Connected: <span className="text-neon-blue font-mono text-xs">{walletAddress.substring(0, 10)}...</span>
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Master Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    disabled={isGeneratingProof}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue disabled:opacity-50"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                    disabled={isGeneratingProof}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                💡 Default password: <code className="text-neon-blue">demo123</code>
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                            >
                                <p className="text-sm text-red-300">❌ {error}</p>
                            </motion.div>
                        )}

                        {/* ZK Info */}
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                            <p className="text-xs text-purple-300">
                                🔐 <strong>Zero-Knowledge Proof:</strong> Your password is never transmitted.
                                We generate a cryptographic proof using Groth16 protocol.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isGeneratingProof || !password}
                            className="w-full px-4 py-3 bg-neon-blue text-slate-900 font-semibold rounded-lg hover:bg-neon-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isGeneratingProof ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full"
                                    />
                                    <span>Generating Zero-Knowledge Proof...</span>
                                </>
                            ) : (
                                <>
                                    <span>🛡️</span>
                                    <span>Unlock with Zero-Knowledge Proof</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Technical Details */}
                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <details className="text-xs text-gray-500">
                            <summary className="cursor-pointer hover:text-gray-400">
                                Technical Details
                            </summary>
                            <div className="mt-2 space-y-1">
                                <p>• Protocol: Groth16</p>
                                <p>• Hash Function: Poseidon</p>
                                <p>• Proof Generation: ~1-2 seconds</p>
                                <p>• Verification: ~100ms</p>
                                <p>• Circuit: auth.circom</p>
                            </div>
                        </details>
                    </div>
                </motion.div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-600 mt-4">
                    Powered by Zero-Knowledge Cryptography
                </p>
            </motion.div>

            {/* ZK Verification Modal */}
            <ZKVerificationModal
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
                onVerifySuccess={handleVerifySuccess}
            />
        </div>
    );
}
