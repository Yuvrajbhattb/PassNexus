import { useState } from 'react';
import { motion } from 'framer-motion';
import ZKVerificationModal from './ZKVerificationModal';

/**
 * Demo component to showcase the ZK Verification Modal
 * without requiring wallet connection
 */
export default function ZKModalDemo() {
    const [showModal, setShowModal] = useState(false);

    const handleDemo = () => {
        setShowModal(true);

        // Auto-hide after verification completes
        setTimeout(() => {
            setShowModal(false);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <h1 className="text-4xl font-bold text-neon-blue neon-glow mb-4">
                    ZK Verification Modal Demo
                </h1>
                <p className="text-gray-400 mb-8">
                    Click the button below to see the Matrix-style verification modal
                </p>

                <button
                    onClick={handleDemo}
                    disabled={showModal}
                    className="px-8 py-4 bg-neon-blue text-slate-900 font-bold text-lg rounded-lg hover:bg-neon-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {showModal ? 'Verifying...' : '🛡️ Show ZK Verification Modal'}
                </button>

                <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700 max-w-md mx-auto">
                    <p className="text-sm text-gray-400">
                        <strong className="text-white">Note:</strong> This is a demo mode.
                        In the actual app, this modal appears after connecting your wallet
                        and entering your password.
                    </p>
                </div>
            </motion.div>

            <ZKVerificationModal isOpen={showModal} />
        </div>
    );
}
