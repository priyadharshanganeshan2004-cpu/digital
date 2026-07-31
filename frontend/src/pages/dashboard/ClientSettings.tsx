import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { HiUser, HiLockClosed, HiOfficeBuilding, HiPhone, HiMail } from 'react-icons/hi';

interface ProfileFormInputs {
    name: string;
    email: string;
    phone: string;
    company: string;
}

interface PasswordFormInputs {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export default function ClientSettings() {
    const { user, updateUser } = useAuth();
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors } } = useForm<ProfileFormInputs>({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            company: user?.company || '',
        }
    });

    const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPasswordForm, formState: { errors: passwordErrors } } = useForm<PasswordFormInputs>();

    const updateProfileMutation = useMutation({
        mutationFn: async (data: ProfileFormInputs) => {
            const res = await api.put('/auth/profile', data);
            return res.data.data;
        },
        onSuccess: (updatedUser) => {
            updateUser(updatedUser);
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        }
    });

    const changePasswordMutation = useMutation({
        mutationFn: async (data: PasswordFormInputs) => {
            await api.put('/auth/password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
        },
        onSuccess: () => {
            setPasswordSuccess(true);
            resetPasswordForm();
            setTimeout(() => setPasswordSuccess(false), 3000);
        }
    });

    const onProfileSubmit = (data: ProfileFormInputs) => {
        updateProfileMutation.mutate(data);
    };

    const onPasswordSubmit = (data: PasswordFormInputs) => {
        if (data.newPassword !== data.confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        changePasswordMutation.mutate(data);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-xl font-heading font-bold text-dark-900">Account Settings</h2>
                <p className="text-sm text-dark-400 mt-1">Manage your profile and security settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Information */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <HiUser className="w-5 h-5 text-primary-500" />
                        <h3 className="font-heading font-semibold text-dark-900">Profile Information</h3>
                    </div>

                    <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-dark-500 uppercase tracking-wider mb-1.5">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-400">
                                    <HiUser className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    {...registerProfile('name', { required: 'Name is required' })}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            {profileErrors.name && <p className="text-xs text-red-500 mt-1">{profileErrors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-dark-500 uppercase tracking-wider mb-1.5">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-400">
                                    <HiMail className="w-4 h-4" />
                                </span>
                                <input
                                    type="email"
                                    {...registerProfile('email', { required: 'Email is required' })}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            {profileErrors.email && <p className="text-xs text-red-500 mt-1">{profileErrors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-dark-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-400">
                                    <HiPhone className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    {...registerProfile('phone')}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-dark-500 uppercase tracking-wider mb-1.5">Company Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-400">
                                    <HiOfficeBuilding className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    {...registerProfile('company')}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        {profileSuccess && (
                            <p className="text-xs font-medium text-green-600">Profile updated successfully!</p>
                        )}

                        <button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="w-full py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 font-medium text-sm transition-colors disabled:opacity-50"
                        >
                            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <HiLockClosed className="w-5 h-5 text-primary-500" />
                        <h3 className="font-heading font-semibold text-dark-900">Change Password</h3>
                    </div>

                    <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-dark-500 uppercase tracking-wider mb-1.5">Current Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-400">
                                    <HiLockClosed className="w-4 h-4" />
                                </span>
                                <input
                                    type="password"
                                    {...registerPassword('currentPassword', { required: 'Current password is required' })}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            {passwordErrors.currentPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.currentPassword.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-dark-500 uppercase tracking-wider mb-1.5">New Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-400">
                                    <HiLockClosed className="w-4 h-4" />
                                </span>
                                <input
                                    type="password"
                                    {...registerPassword('newPassword', {
                                        required: 'New password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    })}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            {passwordErrors.newPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.newPassword.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-dark-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-400">
                                    <HiLockClosed className="w-4 h-4" />
                                </span>
                                <input
                                    type="password"
                                    {...registerPassword('confirmPassword', { required: 'Confirm new password' })}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        {passwordSuccess && (
                            <p className="text-xs font-medium text-green-600">Password changed successfully!</p>
                        )}

                        {changePasswordMutation.isError && (
                            <p className="text-xs font-medium text-red-500">Error changing password. Check current password.</p>
                        )}

                        <button
                            type="submit"
                            disabled={changePasswordMutation.isPending}
                            className="w-full py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 font-medium text-sm transition-colors disabled:opacity-50"
                        >
                            {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
