import { useState } from 'react';
import { Button } from './Button';
import { Input } from './FormElements';
import { X, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AuthMode = 'signin' | 'signup';

export function SignInModal({
    onSubmit,
    onClose,
}: {
    onSubmit: (data: { fullName: string; email: string }) => void;
    onClose: () => void;
}) {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const storedUsers: Record<string, { fullName: string; email: string; password: string }> =
            JSON.parse(localStorage.getItem('scholartrack_users') || '{}');

        if (mode === 'signup') {
            // Sign Up
            if (!fullName.trim() || !email.trim() || !password.trim()) {
                setError('Please fill in all fields.');
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters.');
                return;
            }
            if (storedUsers[email]) {
                setError('An account with this email already exists. Please sign in.');
                return;
            }

            storedUsers[email] = { fullName: fullName.trim(), email: email.trim(), password };
            localStorage.setItem('scholartrack_users', JSON.stringify(storedUsers));
            localStorage.setItem('scholartrack_session', JSON.stringify({ fullName: fullName.trim(), email: email.trim() }));
            onSubmit({ fullName: fullName.trim(), email: email.trim() });
        } else {
            // Sign In
            if (!email.trim() || !password.trim()) {
                setError('Please enter your email and password.');
                return;
            }
            const user = storedUsers[email.trim()];
            if (!user) {
                setError('No account found with this email. Please sign up first.');
                return;
            }
            if (user.password !== password) {
                setError('Incorrect password. Please try again.');
                return;
            }

            localStorage.setItem('scholartrack_session', JSON.stringify({ fullName: user.fullName, email: user.email }));
            onSubmit({ fullName: user.fullName, email: user.email });
        }
    };

    const switchMode = () => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
        setError('');
        setFullName('');
        setEmail('');
        setPassword('');
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
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-academic-blue text-white shadow-lg">
                        <GraduationCap className="h-7 w-7" />
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold text-slate-900">
                                {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {mode === 'signin'
                                    ? 'Sign in to continue discovering scholarships.'
                                    : 'Join ScholarTrack to find scholarships matched to you.'}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Mode Toggle Tabs */}
                <div className="mb-6 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                    {(['signin', 'signup'] as const).map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => { setMode(m); setError(''); }}
                            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${mode === m
                                ? 'bg-white text-academic-blue shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {m === 'signin' ? 'Sign In' : 'Sign Up'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                        {mode === 'signup' && (
                            <motion.div
                                key="name-field"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="relative">
                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100"
                        >
                            {error}
                        </motion.p>
                    )}

                    <Button type="submit" size="lg" className="w-full">
                        {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        type="button"
                        onClick={switchMode}
                        className="font-semibold text-academic-blue hover:underline"
                    >
                        {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}
