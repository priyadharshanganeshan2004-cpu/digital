import { useState } from 'react';
import { Link, useSearchParams, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import SEOHead from '@/components/ui/SEOHead';
import { APP_NAME } from '@/lib/constants';
import emailApi from '@/services/emailApi';
import api from '@/lib/api';

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const params = useParams();
    const location = useLocation();
    const presetEmail = searchParams.get('email') || '';
    const presetOtp = params.token || '';
    const isFirstLogin = searchParams.get('firstLogin') === 'true';
    const locationState = location.state as { email?: string; currentPassword?: string } | null;
    const otpSchema = z.object({
        email: z.string().email('Please enter a valid email'),
        otp: z.string().min(4, 'Enter the OTP from your email'),
        currentPassword: z.string().optional(),
        password: z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'Needs uppercase').regex(/[0-9]/, 'Needs number'),
        confirmPassword: z.string(),
    }).refine((d) => d.password === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });
    const firstLoginSchema = z.object({
        email: z.string().optional(),
        otp: z.string().optional(),
        currentPassword: z.string().min(1, 'Temporary password is required'),
        password: z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'Needs uppercase').regex(/[0-9]/, 'Needs number'),
        confirmPassword: z.string(),
    }).refine((d) => d.password === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(isFirstLogin ? firstLoginSchema : otpSchema),
        defaultValues: { email: presetEmail || locationState?.email || '', otp: presetOtp, currentPassword: locationState?.currentPassword || '' },
    });

    const onSubmit = async (data: { email: string; otp: string; currentPassword?: string; password: string }) => {
        try {
            setError('');
            if (isFirstLogin) {
                await api.put('/auth/password', {
                    currentPassword: data.currentPassword,
                    newPassword: data.password,
                });
            } else {
                await emailApi.resetPassword({
                    email: data.email,
                    otp: data.otp,
                    password: data.password,
                });
            }
            setIsReset(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Unable to reset password.');
        }
    };

    return (
        <>
            <SEOHead title="Reset Password" description="Set a new password for your Scalax Labs account." canonical="/reset-password" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/50 border border-gray-100">
                    <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
                        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center"><span className="text-white font-bold text-lg">N</span></div>
                        <span className="font-heading font-bold text-xl text-dark-900">{APP_NAME}</span>
                    </Link>

                    {isReset ? (
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4"><span className="text-3xl">✅</span></div>
                            <h1 className="text-2xl font-heading font-bold text-dark-900 mb-2">Password Reset!</h1>
                            <p className="text-dark-500 text-sm mb-6">Your password has been successfully reset.</p>
                            <Link to="/login" className="btn-primary w-full">Sign In Now</Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-heading font-bold text-dark-900 mb-2 text-center">Reset Password</h1>
                            <p className="text-dark-500 text-sm mb-6 text-center">
                                {isFirstLogin ? 'Set a new password before continuing to your account.' : 'Enter the OTP from your email and choose a new password.'}
                            </p>
                            {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {!isFirstLogin && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-dark-700 mb-2">Email</label>
                                            <input {...register('email')} type="email" placeholder="name@company.com" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{String(errors.email.message)}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-dark-700 mb-2">OTP</label>
                                            <input {...register('otp')} type="text" inputMode="numeric" placeholder="123456" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                                            {errors.otp && <p className="text-red-500 text-xs mt-1">{String(errors.otp.message)}</p>}
                                        </div>
                                    </>
                                )}
                                {isFirstLogin && (
                                    <div>
                                        <label className="block text-sm font-medium text-dark-700 mb-2">Current Password</label>
                                        <input {...register('currentPassword')} type="password" placeholder="Temporary password" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                                        {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{String(errors.currentPassword.message)}</p>}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">New Password</label>
                                    <div className="relative">
                                        <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                        <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400">
                                            {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{String(errors.password.message)}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                        <input {...register('confirmPassword')} type="password" placeholder="••••••••" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{String(errors.confirmPassword.message)}</p>}
                                </div>
                                <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 disabled:opacity-50">
                                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </>
    );
}

