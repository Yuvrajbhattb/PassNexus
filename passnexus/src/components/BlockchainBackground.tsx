import type { ReactNode } from 'react';

interface BlockchainBackgroundProps {
    children: ReactNode;
}

export default function BlockchainBackground({ children }: BlockchainBackgroundProps) {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Layer 1: The Void - Deep Dark Background */}
            <div className="fixed inset-0 bg-gradient-radial from-slate-900 via-slate-950 to-black" />

            {/* Layer 2: The Mesh - Animated Cyber Grid */}
            <div
                className="fixed inset-0 opacity-10"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    animation: 'gridPan 20s linear infinite'
                }}
            />

            {/* Layer 3: The Energy - Gradient Blobs */}
            {/* Blob 1 - Top Left (Purple/Blue) */}
            <div
                className="fixed -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"
                style={{
                    animation: 'float 15s ease-in-out infinite, pulse 8s ease-in-out infinite'
                }}
            />

            {/* Blob 2 - Bottom Right (Cyan/Blue) */}
            <div
                className="fixed -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-tl from-cyan-500 via-blue-600 to-purple-600 rounded-full blur-3xl opacity-20"
                style={{
                    animation: 'float 18s ease-in-out infinite reverse, pulse 10s ease-in-out infinite'
                }}
            />

            {/* Blob 3 - Center (Accent) */}
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-10"
                style={{
                    animation: 'pulse 12s ease-in-out infinite'
                }}
            />

            {/* Layer 4: Blockchain Accents - Hexagons */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Hexagon 1 */}
                <div
                    className="absolute top-20 right-20 w-32 h-32 opacity-5"
                    style={{
                        clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        animation: 'rotate 30s linear infinite'
                    }}
                />

                {/* Hexagon 2 */}
                <div
                    className="absolute bottom-32 left-32 w-24 h-24 opacity-5"
                    style={{
                        clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                        background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                        animation: 'rotate 25s linear infinite reverse'
                    }}
                />

                {/* Node Connections - Dots */}
                <svg className="absolute inset-0 w-full h-full opacity-10">
                    {/* Connection Lines */}
                    <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="#3b82f6" strokeWidth="1" />
                    <line x1="30%" y1="40%" x2="50%" y2="30%" stroke="#3b82f6" strokeWidth="1" />
                    <line x1="50%" y1="30%" x2="70%" y2="50%" stroke="#3b82f6" strokeWidth="1" />
                    <line x1="70%" y1="50%" x2="85%" y2="70%" stroke="#3b82f6" strokeWidth="1" />

                    {/* Nodes */}
                    <circle cx="10%" cy="20%" r="3" fill="#3b82f6" className="animate-pulse" />
                    <circle cx="30%" cy="40%" r="3" fill="#06b6d4" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <circle cx="50%" cy="30%" r="3" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: '1s' }} />
                    <circle cx="70%" cy="50%" r="3" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
                    <circle cx="85%" cy="70%" r="3" fill="#06b6d4" className="animate-pulse" style={{ animationDelay: '2s' }} />
                </svg>
            </div>

            {/* Foreground Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Custom Animations */}
            <style>
                {`
                    @keyframes gridPan {
                        0% {
                            background-position: 0 0;
                        }
                        100% {
                            background-position: 50px 50px;
                        }
                    }

                    @keyframes float {
                        0%, 100% {
                            transform: translate(0, 0) scale(1);
                        }
                        33% {
                            transform: translate(30px, -30px) scale(1.1);
                        }
                        66% {
                            transform: translate(-20px, 20px) scale(0.9);
                        }
                    }

                    @keyframes rotate {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }

                    .bg-gradient-radial {
                        background: radial-gradient(circle at center, var(--tw-gradient-stops));
                    }
                `}
            </style>
        </div>
    );
}
