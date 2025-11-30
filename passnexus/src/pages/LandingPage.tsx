import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    const features = [
        {
            icon: '🔒',
            title: 'Zero-Knowledge Architecture',
            description: 'We never see your password. Encryption happens on your device using AES-256.'
        },
        {
            icon: '🌐',
            title: 'Unstoppable Storage',
            description: 'Your vault lives on IPFS. No central server means no central point of failure.'
        },
        {
            icon: '📡',
            title: 'Secure Sharing',
            description: 'Share credentials with friends using XMTP. No more texting passwords insecurely.'
        }
    ];

    const advantages = [
        { icon: '📖', text: 'Open Source Transparency' },
        { icon: '💰', text: 'No Subscription Fees' },
        { icon: '🔑', text: 'Identity via Ethereum / Email' }
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
                {/* Hero Section */}
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

                        {/* Headline */}
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-6"
                        >
                            The Unhackable, Decentralized Vault
                        </motion.h2>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
                        >
                            Your data, your keys. Stored on <span className="text-blue-400 font-semibold">IPFS</span>,
                            secured by <span className="text-green-400 font-semibold">Math</span>,
                            shared via <span className="text-purple-400 font-semibold">Blockchain</span>.
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
                            Let's Start →
                        </motion.button>

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

                {/* Features Section */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-center mb-4 neon-text-blue"
                        >
                            Why Choose PassNexus?
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="h-1 w-48 mx-auto mb-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2, duration: 0.6 }}
                                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                    className="bg-slate-900/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 hover:border-green-500/60 transition-all duration-300"
                                >
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

                {/* Advantages Section */}
                <section className="py-24 px-6 bg-gradient-to-b from-transparent to-slate-950/50">
                    <div className="max-w-5xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-center mb-4 neon-text-green"
                        >
                            Built Different
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="h-1 w-48 mx-auto mb-16 bg-gradient-to-r from-transparent via-green-500 to-transparent"
                        />

                        <div className="space-y-6">
                            {advantages.map((advantage, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15, duration: 0.5 }}
                                    className="bg-slate-900/30 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 flex items-center gap-6 hover:border-blue-500/50 transition-all duration-300"
                                >
                                    <div className="text-5xl flex-shrink-0">{advantage.icon}</div>
                                    <p className="text-xl text-gray-300 font-medium">{advantage.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="py-24 px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Take Control?
                        </h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Join the decentralized security revolution today.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/app')}
                            className="px-10 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-black text-lg font-bold rounded-lg shadow-xl hover:shadow-green-500/50 transition-all duration-300"
                        >
                            Launch PassNexus
                        </motion.button>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="py-8 px-6 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
                        <p>PassNexus © 2025 • Decentralized • Open Source • Unstoppable</p>
                        <p className="mt-2">Built with ❤️ for Final Year Project</p>
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
