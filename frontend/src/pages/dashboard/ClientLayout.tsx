import { motion } from 'framer-motion';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    HiHome, HiCollection, HiCurrencyDollar,
    HiChat, HiCalendar, HiCog, HiLogout, HiMenu, HiX, HiBell,
} from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';
import { APP_NAME } from '@/lib/constants';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const clientLinks = [
    { label: 'Overview', icon: HiHome, href: '/dashboard' },
    { label: 'Projects', icon: HiCollection, href: '/dashboard/projects' },
    { label: 'Invoices', icon: HiCurrencyDollar, href: '/dashboard/invoices' },
    { label: 'Messages', icon: HiChat, href: '/dashboard/messages' },
    { label: 'Meetings', icon: HiCalendar, href: '/dashboard/meetings' },
    { label: 'Notifications', icon: HiBell, href: '/dashboard/notifications' },
    { label: 'Settings', icon: HiCog, href: '/dashboard/settings' },
];

export default function ClientLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    const { data: siteSettings } = useQuery({
        queryKey: ['cms-settings'],
        queryFn: async () => {
            const { data } = await api.get('/cms/settings');
            return data.data;
        },
        staleTime: 0,
    });

    // Query unread count for badge
    const { data: notificationsData } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data } = await api.get('/notifications');
            return data;
        },
        refetchInterval: 30000, // Refresh notifications badge every 30s
    });

    const unreadCount = notificationsData?.unreadCount || 0;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{
                                    background: `linear-gradient(135deg, ${siteSettings?.logo?.colorFrom || '#9333ea'}, ${siteSettings?.logo?.colorTo || '#4f46e5'})`
                                }}
                            >
                                <span className="text-white font-bold text-sm">
                                    {siteSettings?.logo?.text || 'N'}
                                </span>
                            </div>
                            <span className="font-heading font-bold text-dark-900">
                                {siteSettings?.logo?.siteName || APP_NAME}
                            </span>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-dark-400">
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                        {clientLinks.map((link) => {
                            const isActive = location.pathname === link.href;
                            const isNotifications = link.label === 'Notifications';
                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-600' : 'text-dark-500 hover:text-dark-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <link.icon className="w-5 h-5 flex-shrink-0" />
                                        <span>{link.label}</span>
                                    </div>
                                    {isNotifications && unreadCount > 0 && (
                                        <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold min-w-5 text-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-xs">
                                {user?.name?.slice(0, 2).toUpperCase() || 'CL'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-dark-900 truncate">{user?.name || 'Client'}</p>
                                <p className="text-xs text-dark-400 truncate">{user?.email || 'client@company.com'}</p>
                            </div>
                        </div>
                        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <HiLogout className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-dark-500 hover:bg-gray-100">
                                <HiMenu className="w-5 h-5" />
                            </button>
                            <h1 className="text-lg font-heading font-semibold text-dark-900 capitalize">
                                {location.pathname === '/dashboard' ? 'Overview' : location.pathname.split('/').pop()?.replace(/-/g, ' ')}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-dark-700 hover:border-primary-200 hover:text-primary-600 transition-colors">
                                View Site
                            </Link>
                            <Link to="/dashboard/notifications" className="relative p-2 rounded-lg text-dark-500 hover:bg-gray-100">
                                <HiBell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                                )}
                            </Link>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
