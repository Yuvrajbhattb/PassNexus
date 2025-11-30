import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Matrix Rain Effect Component
const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        const interval = setInterval(draw, 33);
        return () => clearInterval(interval);
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full opacity-20" />;
};

// Main Modal Component
interface ZKModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerifySuccess: () => void;
}

export default function ZKVerificationModal({ isOpen, onVerifySuccess }: ZKModalProps) {
    const [step, setStep] = useState(0);

    const steps = [
        "Initializing Groth16 Prover...",
        "Loading Circuit: auth.wasm",
        "Generating Witness...",
        "Computing Polynomials...",
        "Verifying Proof on-chain...",
        "ACCESS GRANTED"
    ];

    useEffect(() => {
        if (isOpen) {
            setStep(0);
            const interval = setInterval(() => {
                setStep((prev) => {
                    if (prev < steps.length - 1) return prev + 1;
                    clearInterval(interval);
                    setTimeout(onVerifySuccess, 1000);
                    return prev;
                });
            }, 800);
            return () => clearInterval(interval);
        }
    }, [isOpen, onVerifySuccess, steps.length]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 text-green-500 font-mono">
            <MatrixRain />

            <div className="relative z-10 w-full max-w-lg p-6 border border-green-500 bg-black shadow-[0_0_50px_rgba(0,255,0,0.2)]">
                <h2 className="text-xl font-bold mb-4 border-b border-green-500 pb-2">
                    ZERO-KNOWLEDGE VERIFICATION
                </h2>

                <div className="space-y-2 h-48">
                    {steps.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: i <= step ? 1 : 0, x: i <= step ? 0 : -20 }}
                            className="flex items-center"
                        >
                            <span className="mr-2">{i < step ? '✓' : '>'}</span>
                            <span className={i === step ? "animate-pulse" : ""}>{s}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="w-full bg-gray-900 h-2 mt-4 border border-green-900">
                    <motion.div
                        className="h-full bg-green-500 shadow-[0_0_10px_#0F0]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </div>
    );
}