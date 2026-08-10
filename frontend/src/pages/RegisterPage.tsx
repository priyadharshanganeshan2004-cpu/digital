import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff } from 'react-icons/hi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import SEOHead from '@/components/ui/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { APP_NAME } from '@/lib/constants';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain uppercase')
        .regex(/[0-9]/, 'Must contain number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError('');
            await registerUser(data.name, data.email, data.password);
            navigate('/dashboard');
        } catch (err: any) {
            const backendMessage = err?.response?.data?.message || err?.message;
            setError(backendMessage || 'Registration failed. Please try again.');
        }
    };

    return (
        <>
            <SEOHead title="Sign Up" description="Create your Scalax Labs account." canonical="/register" />

            <div className="min-h-screen flex">
                {/* Left Panel */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 via-primary-700 to-primary-800 relative overflow-hidden items-center justify-center p-12">
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `radial-gradient(circle at 70% 70%, white 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />
                    <div className="relative text-center max-w-md">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-8 border border-white/20">
                                <span className="text-white text-2xl font-heading font-bold">N</span>
                            </div>
                            <h2 className="text-3xl font-heading font-bold text-white mb-4">Join {APP_NAME}</h2>
                            <p className="text-white/60 leading-relaxed">
                                Create your account to access project dashboards, real-time analytics, and collaborate with our expert team.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
                        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">N</span>
                            </div>
                            <span className="font-heading font-bold text-xl text-dark-900">{APP_NAME}</span>
                        </Link>

                        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark-900 mb-2">Create Account</h1>
                        <p className="text-dark-500 mb-8">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
                        </p>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">{error}</div>
                        )}

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-dark-700 font-medium text-sm hover:bg-gray-50 transition-colors">
                                <FaGoogle className="w-4 h-4 text-red-500" /> Google
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-dark-700 font-medium text-sm hover:bg-gray-50 transition-colors">
                                <FaGithub className="w-4 h-4" /> GitHub
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-dark-400 font-medium">OR</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input {...register('name')} placeholder="John Doe" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">Email</label>
                                <div className="relative">
                                    <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input {...register('email')} type="email" placeholder="name@company.com" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">Password</label>
                                <div className="relative">
                                    <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400">
                                        {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input {...register('confirmPassword')} type="password" placeholder="••••••••" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                            </div>

                            <div className="flex items-start gap-2">
                                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                <span className="text-sm text-dark-500">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-primary-600 hover:underline">Terms</Link>{' '}
                                    and{' '}
                                    <Link to="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                                </span>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 disabled:opacity-50">
                                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
}

