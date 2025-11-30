import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';

export default function Notifications() {
    const { notifications, unreadCount, markAllRead } = useNotifications();

    // Show ALL notifications (persistent audit log)
    const allNotifications = notifications;

    return (
        <div className="space-y-6">
            {/* Header with Mark All Read Button */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Audit Log</h2>
                    <p className="text-gray-400 text-sm">
                        Complete history of vault activity
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="px-4 py-2 bg-neon-blue text-slate-900 rounded-lg hover:bg-blue-400 transition-colors font-semibold text-sm"
                    >
                        Mark all as Read ({unreadCount})
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {allNotifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-12 text-center"
                        >
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">
                                No Activity Yet
                            </h3>
                            <p className="text-gray-500">
                                Vault actions will be logged here
                            </p>
                        </motion.div>
                    ) : (
                        allNotifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className={`rounded-lg p-4 border transition-all ${notification.read
                                        ? 'bg-slate-800/30 border-slate-700'
                                        : 'bg-gradient-to-r from-neon-blue/10 to-slate-800/50 border-neon-blue/30'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Unread Indicator */}
                                    {!notification.read && (
                                        <div className="mt-1">
                                            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1">
                                        <p className={`font-medium ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                                            {notification.message}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            {notification.formattedTime}
                                        </p>
                                    </div>

                                    {/* Icon */}
                                    <div className={notification.read ? 'text-gray-600' : 'text-neon-blue'}>
                                        <span className="text-2xl">📢</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Stats Footer */}
            {allNotifications.length > 0 && (
                <div className="text-center text-sm text-gray-500 pt-4 border-t border-slate-700">
                    <p>
                        {allNotifications.length} total {allNotifications.length === 1 ? 'event' : 'events'}
                        {unreadCount > 0 && ` • ${unreadCount} unread`}
                    </p>
                </div>
            )}
        </div>
    );
}
