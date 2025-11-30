import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Generator() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [copied, setCopied] = useState(false);

    // Character sets for password generation
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';

    // Generate secure password with at least one of each character type
    const generatePassword = (passwordLength: number): string => {
        const allChars = uppercase + lowercase + numbers + special;
        let result = '';

        // Ensure at least one of each type
        result += uppercase[Math.floor(Math.random() * uppercase.length)];
        result += lowercase[Math.floor(Math.random() * lowercase.length)];
        result += numbers[Math.floor(Math.random() * numbers.length)];
        result += special[Math.floor(Math.random() * special.length)];

        // Fill the rest randomly
        for (let i = result.length; i < passwordLength; i++) {
            result += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Shuffle the result to avoid predictable patterns
        return result.split('').sort(() => Math.random() - 0.5).join('');
    };

    // Auto-generate on mount
    useEffect(() => {
        setPassword(generatePassword(length));
    }, []);

    // Auto-update when slider changes
    useEffect(() => {
        if (password) {
            setPassword(generatePassword(length));
        }
    }, [length]);

    const handleRegenerate = () => {
        setPassword(generatePassword(length));
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleClear = () => {
        setPassword('');
        setLength(16);
        setTimeout(() => setPassword(generatePassword(16)), 100);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full border border-slate-700 shadow-2xl"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🔑</div>
                    <h2 className="text-3xl font-bold text-white mb-2">Password Generator</h2>
                    <p className="text-gray-400 text-sm">
                        Create secure passwords with one click
                    </p>
                </div>

                {/* Password Display */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Generated Password
                    </label>
                    <input
                        type="text"
                        value={password}
                        readOnly
                        className="w-full px-4 py-4 bg-slate-900 border border-slate-600 rounded-lg text-neon-blue font-mono text-lg text-center focus:outline-none focus:border-neon-blue transition-colors"
                    />
                </div>

                {/* Length Slider */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-400">
                            Password Length
                        </label>
                        <span className="text-neon-blue font-semibold">
                            {length} characters
                        </span>
                    </div>
                    <input
                        type="range"
                        min="8"
                        max="64"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        style={{
                            background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${((length - 8) / (64 - 8)) * 100}%, rgb(51 65 85) ${((length - 8) / (64 - 8)) * 100}%, rgb(51 65 85) 100%)`
                        }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>8</span>
                        <span>64</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                    <motion.button
                        onClick={handleRegenerate}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-neon-blue text-slate-900 font-semibold rounded-lg hover:bg-blue-400 transition-colors"
                    >
                        <span className="text-xl">🔄</span>
                        Regenerate
                    </motion.button>

                    <motion.button
                        onClick={handleCopy}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
                    >
                        <span className="text-xl">{copied ? '✓' : '📋'}</span>
                        {copied ? 'Copied!' : 'Copy'}
                    </motion.button>

                    <motion.button
                        onClick={handleClear}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 text-gray-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors"
                    >
                        <span className="text-xl">🗑️</span>
                        Clear
                    </motion.button>
                </div>

                {/* Security Info */}
                <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-xs text-gray-400 text-center">
                        ✓ Contains uppercase • lowercase • numbers • special characters
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
