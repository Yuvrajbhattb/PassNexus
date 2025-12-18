import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    const howItWorksSteps = [
        {
            icon: '🔌',
            title: 'Connect',
            description: 'Login via Ethereum or Social Email. No database account creation required.'
        },
        {
            icon: '🔐',
            title: 'Encrypt',
            description: 'Your data is salted with Argon2 and locked with AES-256 locally on your device.'
        },
        {
            icon: '📦',
            title: 'Store',
            description: 'Encrypted blobs are pinned to IPFS, ensuring 100% uptime and censorship resistance.'
        },
        {
            icon: '🤝',
            title: 'Share',
            description: 'Exchange credentials securely using the XMTP messaging layer.'
        }
    ];

    const features = [
        {
            icon: '🔒',
            title: 'Zero-Knowledge Architecture',
            description: 'We don\'t know your password. We can\'t know your password. Math guarantees it.'
        },
        {
            icon: '🌐',
            title: 'Censorship Resistant',
            description: 'Your vault lives on the InterPlanetary File System. No government or corporation can delete your data.'
        },
        {
            icon: '📡',
            title: 'Secure Sharing',
            description: 'Share credentials with friends using XMTP. No more texting passwords insecurely.'
        },
        {
            icon: '🎯',
            title: 'Legacy Proof',
            description: 'Pass down your digital assets to trusted wallets via smart contract inheritance.',
            badge: 'Roadmap'
        }
    ];

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Matrix Grid Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Animated Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-green-500/20 rounded-full blur-[120px] animate-pulse" />

            <div className="relative z-10">
                {/* Section 1: Enhanced Hero */}
                <section className="min-h-screen flex items-center justify-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-5xl"
                    >
                        {/* Logo/Brand */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mb-8"
                        >
                            <h1 className="text-7xl md:text-8xl font-bold mb-4 neon-text-green">
                                PassNexus
                            </h1>
                            <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-green-500 to-transparent" />
                        </motion.div>

                        {/* Enhanced Headline */}
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-4xl md:text-6xl font-bold text-white mb-6"
                        >
                            The Last Password Manager You Will Ever Need.
                        </motion.h2>

                        {/* Enhanced Sub-headline */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed"
                        >
                            Decentralized identity meets military-grade encryption. PassNexus removes the central server,
                            giving you <span className="text-green-400 font-semibold">absolute ownership</span> of your digital life.
                        </motion.p>

                        {/* CTA Button */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 65, 0.5)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/app')}
                            className="px-12 py-5 bg-gradient-to-r from-green-500 to-blue-500 text-black text-xl font-bold rounded-lg shadow-2xl hover:shadow-green-500/50 transition-all duration-300 neon-border-green"
                        >
                            Launch PassNexus →
                        </motion.button>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
                        >
                            <div className="flex items-center gap-2">
                                <span>✓</span>
                                <span>Audited by Smart Contract Logic</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>✓</span>
                                <span>Open Source</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>✓</span>
                                <span>Gas-Optimized</span>
                            </div>
                        </motion.div>

                        {/* Scroll Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="mt-20 text-gray-600"
                        >
                            <p className="text-sm mb-2">Scroll to explore</p>
                            <div className="w-6 h-10 border-2 border-gray-700 rounded-full mx-auto flex items-start justify-center p-2">
                                <motion.div
                                    animate={{ y: [0, 12, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-1.5 h-1.5 bg-green-500 rounded-full"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Section 2: How It Works Pipeline */}
                <section className="py-32 px-6 bg-gradient-to-b from-transparent to-slate-950/30">
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-center mb-4 neon-text-blue"
                        >
                            How It Works
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="h-1 w-48 mx-auto mb-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                        />

                        {/* Horizontal Process Flow */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                            {/* Connection Lines (desktop only) */}
                            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                            {howItWorksSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2, duration: 0.6 }}
                                    className="relative"
                                >
                                    {/* Step Number Badge */}
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-cyan-500 text-black rounded-full flex items-center justify-center font-bold text-sm z-10">
                                        {index + 1}
                                    </div>

                                    {/* Card */}
                                    <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 text-center hover:border-cyan-500/60 transition-all duration-300 h-full">
                                        <div className="text-6xl mb-4">{step.icon}</div>
                                        <h3 className="text-2xl font-bold text-white mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 3: Expanded Feature Grid */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-center mb-4 neon-text-green"
                        >
                            Why Choose PassNexus?
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="h-1 w-48 mx-auto mb-20 bg-gradient-to-r from-transparent via-green-500 to-transparent"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15, duration: 0.6 }}
                                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                    className="bg-slate-900/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 hover:border-green-500/60 transition-all duration-300 relative"
                                >
                                    {feature.badge && (
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-xs text-purple-300 font-semibold">
                                            {feature.badge}
                                        </div>
                                    )}
                                    <div className="text-6xl mb-6">{feature.icon}</div>
                                    <h3 className="text-2xl font-bold text-white mb-4 neon-text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 4: Security Specs (Terminal Style) */}
                <section className="py-32 px-6 bg-gradient-to-b from-slate-950/30 to-transparent">
                    <div className="max-w-4xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-center mb-4 neon-text-blue"
                        >
                            Security Specifications
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="h-1 w-48 mx-auto mb-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-black/80 border border-green-500/50 rounded-xl p-8 font-mono text-sm"
                        >
                            {/* Terminal Header */}
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-green-500/30">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="ml-4 text-green-400">passnexus.tech-stack</span>
                            </div>

                            {/* Terminal Content */}
                            <div className="space-y-3">
                                <div className="flex">
                                    <span className="text-green-400 mr-3">&gt;</span>
                                    <span className="text-cyan-300">Algorithm:</span>
                                    <span className="text-white ml-2">AES-GCM 256-bit</span>
                                </div>
                                <div className="flex">
                                    <span className="text-green-400 mr-3">&gt;</span>
                                    <span className="text-cyan-300">KDF:</span>
                                    <span className="text-white ml-2">Argon2id (Memory Hard)</span>
                                </div>
                                <div className="flex">
                                    <span className="text-green-400 mr-3">&gt;</span>
                                    <span className="text-cyan-300">Network:</span>
                                    <span className="text-white ml-2">Ethereum Sepolia / Polygon</span>
                                </div>
                                <div className="flex">
                                    <span className="text-green-400 mr-3">&gt;</span>
                                    <span className="text-cyan-300">Messaging:</span>
                                    <span className="text-white ml-2">XMTP V3 (MLS)</span>
                                </div>
                                <div className="flex">
                                    <span className="text-green-400 mr-3">&gt;</span>
                                    <span className="text-cyan-300">Storage:</span>
                                    <span className="text-white ml-2">IPFS (Pinata)</span>
                                </div>
                                <div className="mt-6 text-gray-500">
                                    <span className="text-green-400 mr-3">&gt;</span>
                                    <span className="animate-pulse">█</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to Take Control?
                        </h2>
                        <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
                            Join the decentralized security revolution. No subscriptions, no middlemen, just you and cryptography.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/app')}
                            className="px-12 py-5 bg-gradient-to-r from-green-500 to-blue-500 text-black text-xl font-bold rounded-lg shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
                        >
                            Launch PassNexus →
                        </motion.button>
                    </motion.div>
                </section>

                {/* Section 5: Footer */}
                <footer className="py-12 px-6 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto">
                        {/* Footer Links */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                            <div>
                                <h4 className="text-white font-semibold mb-4">Resources</h4>
                                <ul className="space-y-2 text-gray-500 text-sm">
                                    <li><a href="#" className="hover:text-green-400 transition-colors">GitHub Repo</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Documentation</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Whitepaper</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Blockchain</h4>
                                <ul className="space-y-2 text-gray-500 text-sm">
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Smart Contract</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Etherscan</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Audit Report</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Community</h4>
                                <ul className="space-y-2 text-gray-500 text-sm">
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Discord</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Twitter</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Forum</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Contact</h4>
                                <ul className="space-y-2 text-gray-500 text-sm">
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Developer</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Support</a></li>
                                    <li><a href="#" className="hover:text-green-400 transition-colors">Report Bug</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="text-center pt-8 border-t border-gray-800">
                            <p className="text-gray-600 text-sm mb-2">
                                © 2025 PassNexus Decentralized Protocol
                            </p>
                            <p className="text-gray-700 text-xs">
                                Decentralized • Open Source • Unstoppable
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            <style>{`
                .neon-text-green {
                    color: #00ff41;
                    text-shadow: 0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41;
                }
                .neon-text-blue {
                    color: #60a5fa;
                    text-shadow: 0 0 10px #60a5fa, 0 0 20px #60a5fa, 0 0 30px #60a5fa;
                }
                .neon-text-white {
                    color: #ffffff;
                    text-shadow: 0 0 5px #ffffff, 0 0 10px #60a5fa;
                }
                .neon-border-green {
                    box-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
                }
            `}</style>
        </div>
    );
}
