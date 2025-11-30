import React, { createContext, useContext, useState, useCallback } from 'react';

interface Notification {
    id: string;
    message: string;
    timestamp: number;
    formattedTime: string;
    read: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (message: string) => void;
    markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: string) => {
        const now = new Date();
        const newNotification: Notification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            message,
            timestamp: Date.now(),
            formattedTime: now.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            read: false
        };

        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAllRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
