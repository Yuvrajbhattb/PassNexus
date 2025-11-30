import { useState } from 'react';
import { motion } from 'framer-motion';
import type { CreditCard } from '../types';

interface CardItemProps {
    card: CreditCard;
    onDelete: (id: string) => void;
    onDecrypt: (id: string) => Promise<{ cardNumber: string; cvv: string }>;
}

export default function CardItem({ card, onDelete, onDecrypt }: CardItemProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [decryptedData, setDecryptedData] = useState<{ cardNumber: string; cvv: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleReveal = async () => {
        if (isRevealed) {
            setIsRevealed(false);
            setDecryptedData(null);
        } else {
            setIsLoading(true);
            try {
                const data = await onDecrypt(card.id);
                setDecryptedData(data);
                setIsRevealed(true);
            } catch (error) {
                console.error('Failed to decrypt card:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const maskCardNumber = (number: string) => {
        if (number.length < 4) return '****';
        return `**** **** **** ${number.slice(-4)}`;
    };

    const formatCardNumber = (number: string) => {
        return number.replace(/(\d{4})/g, '$1 ').trim();
    };

    const getBrandIcon = (brand: string) => {
        const icons: Record<string, string> = {
            'Visa': '💳',
            'Mastercard': '💳',
            'Amex': '💳',
            'Discover': '💳'
        };
        return icons[brand] || '💳';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-neon-blue/20 hover:border-neon-blue/40 transition-all"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-3xl">{getBrandIcon(card.brand)}</span>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{card.itemName}</h3>
                        <p className="text-sm text-gray-400">{card.brand}</p>
                    </div>
                </div>
                <button
                    onClick={() => onDelete(card.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Delete card"
                >
                    🗑️
                </button>
            </div>

            {/* Card Number */}
            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Card Number</p>
                <p className="text-xl font-mono text-white tracking-wider">
                    {isRevealed && decryptedData
                        ? formatCardNumber(decryptedData.cardNumber)
                        : maskCardNumber(card.cardNumber)}
                </p>
            </div>

            {/* Cardholder & Expiry */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Cardholder</p>
                    <p className="text-sm text-white">{card.cardholderName || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Expires</p>
                    <p className="text-sm text-white">{card.expiryMonth}/{card.expiryYear}</p>
                </div>
            </div>

            {/* CVV (when revealed) */}
            {isRevealed && decryptedData && (
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">CVV</p>
                    <p className="text-sm text-white font-mono">{decryptedData.cvv}</p>
                </div>
            )}

            {/* Notes */}
            {card.notes && (
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-sm text-gray-300">{card.notes}</p>
                </div>
            )}

            {/* Folder */}
            {card.folder && card.folder !== 'No folder' && (
                <div className="mb-4">
                    <span className="inline-block px-2 py-1 bg-slate-700 text-xs text-gray-300 rounded">
                        📁 {card.folder}
                    </span>
                </div>
            )}

            {/* Action Button */}
            <button
                onClick={handleReveal}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isLoading ? (
                    'Decrypting...'
                ) : isRevealed ? (
                    <>👁️ Hide Details</>
                ) : (
                    <>👁️ Reveal Details</>
                )}
            </button>
        </motion.div>
    );
}
