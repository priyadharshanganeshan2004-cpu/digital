import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiMail } from 'react-icons/hi';
import SEOHead from '@/components/ui/SEOHead';
import { APP_NAME } from '@/lib/constants';

const schema = z.object({ email: z.string().email('Please enter a valid email') });

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = async () => {
        await new Promise((r) => setTimeout(r, 1500));
        setIsSubmitted(true);
    };

    return (
        <>
            <SEOHead title="Forgot Password" description="Reset your NexusDigital password." canonical="/forgot-password" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/50 border border-gray-100">
                    <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
                        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">N</span>
                        </div>
                        <span className="font-heading font-bold text-xl text-dark-900">{APP_NAME}</span>
                    </Link>

                    {isSubmitted ? (
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4"><span className="text-3xl">✉️</span></div>
                            <h1 className="text-2xl font-heading font-bold text-dark-900 mb-2">Check Your Email</h1>
                            <p className="text-dark-500 text-sm mb-6">We've sent password reset instructions to your email address.</p>
                            <Link to="/login" className="btn-primary w-full">Back to Sign In</Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-heading font-bold text-dark-900 mb-2 text-center">Forgot Password?</h1>
                            <p className="text-dark-500 text-sm mb-6 text-center">Enter your email and we'll send you reset instructions.</p>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">Email</label>
                                    <div className="relative">
                                        <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                        <input {...register('email')} type="email" placeholder="name@company.com" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{String(errors.email.message)}</p>}
                                </div>
                                <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 disabled:opacity-50">
                                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                            <p className="text-center text-sm text-dark-500 mt-6">
                                Remember your password? <Link to="/login" className="text-primary-600 font-semibold">Sign In</Link>
                            </p>
                        </>
                    )}
                </motion.div>
            </div>
        </>
    );
}
