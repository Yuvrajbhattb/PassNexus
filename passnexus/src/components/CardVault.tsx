import { useState } from 'react';
import { motion } from 'framer-motion';
import type { CreditCard } from '../types';
import CardItem from './CardItem';
import AddCardModal from './AddCardModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface CardVaultProps {
    cards: CreditCard[];
    onAddCard: (
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
    onDeleteCard: (id: string) => void;
    onDecryptCard: (id: string) => Promise<{ cardNumber: string; cvv: string }>;
}

export default function CardVault({ cards, onAddCard, onDeleteCard, onDecryptCard }: CardVaultProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setCardToDelete(id);
    };

    const handleConfirmDelete = () => {
        if (cardToDelete) {
            onDeleteCard(cardToDelete);
            setCardToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Credit Cards</h2>
                    <p className="text-gray-400 text-sm">
                        Seamless online checkout. With cards, easily autofill payment forms securely and accurately.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-neon-blue text-slate-900 rounded-lg hover:bg-blue-400 transition-colors font-semibold flex items-center gap-2"
                >
                    <span>➕</span>
                    Add Card
                </button>
            </div>

            {/* Cards Grid */}
            {cards.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                >
                    <div className="text-6xl mb-4">💳</div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No cards yet</h3>
                    <p className="text-gray-500 mb-6">Add your first credit card to get started</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-neon-blue text-slate-900 rounded-lg hover:bg-blue-400 transition-colors font-semibold"
                    >
                        Add Your First Card
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card) => (
                        <CardItem
                            key={card.id}
                            card={card}
                            onDelete={handleDeleteClick}
                            onDecrypt={onDecryptCard}
                        />
                    ))}
                </div>
            )}

            {/* Add Card Modal */}
            <AddCardModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={onAddCard}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={!!cardToDelete}
                onClose={() => setCardToDelete(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
