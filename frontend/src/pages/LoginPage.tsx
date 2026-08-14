import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import SEOHead from '@/components/ui/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { APP_NAME } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { data: siteSettings } = useQuery({
        queryKey: ['cms-settings'],
        queryFn: async () => {
            const { data } = await api.get('/cms/settings');
            return data.data;
        },
        staleTime: 0,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError('');
            const user = await login(data.email, data.password);
            if (user.mustResetPassword) {
                navigate('/reset-password?firstLogin=true', {
                    state: { email: data.email, currentPassword: data.password },
                });
                return;
            }
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err: unknown) {
            // Distinguish auth errors from network/CORS/server errors
            if (
                err &&
                typeof err === 'object' &&
                'response' in err &&
                (err as { response?: { status?: number } }).response
            ) {
                const status = (err as { response: { status: number } }).response.status;
                if (status === 401) {
                    setError('Invalid email or password. Please try again.');
                } else if (status === 403) {
                    const msg =
                        (err as { response: { data?: { message?: string } } }).response.data
                            ?.message || 'You are not authorized.';
                    setError(msg);
                } else if (status === 429) {
                    setError('Too many login attempts. Please try again later.');
                } else {
                    setError('Something went wrong. Please try again later.');
                }
            } else {
                // Network error, CORS block, or server unreachable
                setError('Unable to connect to the server. Please check your connection and try again.');
            }
        }
    };

    return (
        <>
            <SEOHead title="Sign In" description={`Sign in to your ${siteSettings?.siteName || APP_NAME} account.`} canonical="/login" />

            <div className="min-h-screen flex">
                {/* Left Panel */}
                <div
                    className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 relative overflow-hidden items-center justify-center p-12"
                    style={{
                        background: siteSettings?.logo?.colorFrom && siteSettings?.logo?.colorTo
                            ? `linear-gradient(135deg, ${siteSettings?.logo?.colorFrom}, ${siteSettings?.logo?.colorTo})`
                            : undefined
                    }}
                >
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `radial-gradient(circle at 30% 30%, white 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />
                    <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-[80px]" />
                    <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent-500/20 rounded-full blur-[80px]" />

                    <div className="relative text-center max-w-md">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-lg"
                                style={{
                                    background: `linear-gradient(135deg, ${siteSettings?.logo?.colorFrom || '#9333ea'}, ${siteSettings?.logo?.colorTo || '#4f46e5'})`
                                }}
                            >
                                <span className="text-white text-2xl font-heading font-bold">{siteSettings?.logo?.text || 'N'}</span>
                            </div>
                            <h2 className="text-3xl font-heading font-bold text-white mb-4">Welcome Back</h2>
                            <p className="text-white/60 leading-relaxed">
                                Sign in to access your dashboard, manage projects, and track your digital marketing performance.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full max-w-md"
                    >
                        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                                style={{
                                    background: `linear-gradient(135deg, ${siteSettings?.logo?.colorFrom || '#9333ea'}, ${siteSettings?.logo?.colorTo || '#4f46e5'})`
                                }}
                            >
                                <span className="text-white font-bold text-lg">{siteSettings?.logo?.text || 'N'}</span>
                            </div>
                            <span className="font-heading font-bold text-xl text-dark-900">{siteSettings?.siteName || APP_NAME}</span>
                        </Link>

                        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark-900 mb-2">
                            Sign In
                        </h1>
                        <p className="text-dark-500 mb-8">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
                                Sign up
                            </Link>
                        </p>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-dark-700 font-medium text-sm hover:bg-gray-50 transition-colors">
                                <FaGoogle className="w-4 h-4 text-red-500" />
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-dark-700 font-medium text-sm hover:bg-gray-50 transition-colors">
                                <FaGithub className="w-4 h-4" />
                                GitHub
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-dark-400 font-medium">OR</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">Email</label>
                                <div className="relative">
                                    <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input
                                        {...register('email')}
                                        type="email"
                                        placeholder="name@company.com"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-dark-900 placeholder:text-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-dark-700">Password</label>
                                    <Link to="/forgot-password" className="text-xs text-primary-600 font-medium hover:text-primary-700">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 text-dark-900 placeholder:text-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
                                    >
                                        {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full py-3.5 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
}

