import { useState } from 'react';
import { Button } from './Button';
import { Input } from './FormElements';
import { X, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export function SignInModal({
    onSubmit,
    onClose,
}: {
    onSubmit: (data: { fullName: string; email: string }) => void;
    onClose: () => void;
}) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ fullName, email });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Close sign in"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-academic-blue text-white shadow-lg">
                        <GraduationCap className="h-7 w-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Welcome to ScholarTrack</h2>
                    <p className="mt-1 text-sm text-slate-500">Sign in to discover scholarships matched to you.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit" size="lg" className="w-full">
                        Continue
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
