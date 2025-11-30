import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (
        itemName: string,
        folder: string,
        cardholderName: string,
        cardNumber: string,
        brand: 'Visa' | 'Mastercard' | 'Amex' | 'Discover',
        expiryMonth: string,
        expiryYear: string,
        cvv: string,
        notes?: string
    ) => Promise<void>;
}

export default function AddCardModal({ isOpen, onClose, onSave }: AddCardModalProps) {
    const [itemName, setItemName] = useState('');
    const [folder, setFolder] = useState('No folder');
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [brand, setBrand] = useState<'Visa' | 'Mastercard' | 'Amex' | 'Discover'>('Visa');
    const [expiryMonth, setExpiryMonth] = useState('01');
    const [expiryYear, setExpiryYear] = useState('2025');
    const [cvv, setCvv] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(itemName, folder, cardholderName, cardNumber, brand, expiryMonth, expiryYear, cvv, notes || undefined);
            // Reset form
            setItemName('');
            setFolder('No folder');
            setCardholderName('');
            setCardNumber('');
            setBrand('Visa');
            setExpiryMonth('01');
            setExpiryYear('2025');
            setCvv('');
            setNotes('');
            onClose();
        } catch (error) {
            console.error('Failed to save card:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const years = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-slate-800 rounded-xl p-6 max-w-lg w-full mx-4 border border-neon-blue/20 max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-2xl font-bold text-neon-blue mb-4">Add Credit Card</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Item Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Item Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                                    placeholder="My Credit Card"
                                />
                            </div>

                            {/* Folder */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Folder</label>
                                <select
                                    value={folder}
                                    onChange={(e) => setFolder(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                                >
                                    <option value="No folder">No folder</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Work">Work</option>
                                </select>
                            </div>

                            {/* Cardholder Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Cardholder Name</label>
                                <input
                                    type="text"
                                    value={cardholderName}
                                    onChange={(e) => setCardholderName(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Card Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                                        maxLength={16}
                                        className="w-full px-3 py-2 pl-10 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                                        placeholder="1234567812345678"
                                    />
                                    <span className="absolute left-3 top-2.5 text-xl">💳</span>
                                </div>
                            </div>

                            {/* Brand */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Brand</label>
                                <select
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value as any)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                                >
                                    <option value="Visa">Visa</option>
                                    <option value="Mastercard">Mastercard</option>
                                    <option value="Amex">American Express</option>
                                    <option value="Discover">Discover</option>
                                </select>
                            </div>

                            {/* Expiration Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Expiration Date</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={expiryMonth}
                                        onChange={(e) => setExpiryMonth(e.target.value)}
                                        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                                    >
                                        {months.map(month => (
                                            <option key={month} value={month}>{month}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={expiryYear}
                                        onChange={(e) => setExpiryYear(e.target.value)}
                                        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* CVV */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Security Code (CVV)</label>
                                <input
                                    type="password"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    maxLength={4}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                                    placeholder="123"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-neon-blue resize-none"
                                    placeholder="Additional notes..."
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !itemName}
                                    className="flex-1 px-4 py-2 bg-neon-blue text-slate-900 rounded-lg hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                                >
                                    {isLoading ? 'Saving...' : 'Save Card'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
