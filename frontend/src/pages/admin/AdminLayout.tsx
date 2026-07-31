import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiHome, HiUsers, HiCollection, HiNewspaper, HiBriefcase,
    HiStar, HiMail, HiCalendar, HiCurrencyDollar, HiCog,
    HiChartBar, HiUserGroup, HiTag, HiDocumentText, HiMenu, HiX, HiLogout,
    HiTrendingUp, HiBell, HiClipboardList
} from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';
import { APP_NAME } from '@/lib/constants';

const sidebarLinks = [
    { label: 'Dashboard', icon: HiHome, href: '/admin' },
    { label: 'Clients', icon: HiUsers, href: '/admin/clients' },
    { label: 'Projects', icon: HiClipboardList, href: '/admin/projects' },
    { label: 'Leads', icon: HiTrendingUp, href: '/admin/leads' },
    { label: 'Services', icon: HiBriefcase, href: '/admin/services' },
    { label: 'Portfolio', icon: HiCollection, href: '/admin/portfolio' },
    { label: 'Blog', icon: HiNewspaper, href: '/admin/blog' },
    { label: 'Testimonials', icon: HiStar, href: '/admin/testimonials' },
    { label: 'Careers', icon: HiDocumentText, href: '/admin/careers' },
    { label: 'Team', icon: HiUserGroup, href: '/admin/team' },
    { label: 'Pricing', icon: HiTag, href: '/admin/pricing' },
    { label: 'Bookings', icon: HiCalendar, href: '/admin/bookings' },
    { label: 'Messages', icon: HiMail, href: '/admin/messages' },
    { label: 'Newsletter', icon: HiMail, href: '/admin/newsletter' },
    { label: 'Payments', icon: HiCurrencyDollar, href: '/admin/payments' },
    { label: 'Users', icon: HiUsers, href: '/admin/users' },
    { label: 'Analytics', icon: HiChartBar, href: '/admin/analytics' },
    { label: 'Settings', icon: HiCog, href: '/admin/settings' },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-5 border-b border-white/5">
                        <Link to="/admin" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">N</span>
                            </div>
                            <span className="font-heading font-bold text-white">{APP_NAME}</span>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-dark-400 hover:text-white">
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                        {sidebarLinks.map((link) => {
                            const isActive = location.pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary-500/10 text-primary-400'
                                        : 'text-dark-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <link.icon className="w-5 h-5 flex-shrink-0" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User */}
                    <div className="p-4 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-xs">
                                {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-dark-400 truncate">{user?.email || 'admin@nexus.com'}</p>
                            </div>
                        </div>
                        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark-400 hover:text-red-400 hover:bg-red-500/5 transition-colors">
                            <HiLogout className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-dark-500 hover:bg-gray-100">
                                <HiMenu className="w-5 h-5" />
                            </button>
                            <h1 className="text-lg font-heading font-semibold text-dark-900 capitalize">
                                {location.pathname === '/admin' ? 'Dashboard' : location.pathname.split('/').pop()?.replace(/-/g, ' ')}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="relative p-2 rounded-lg text-dark-500 hover:bg-gray-100">
                                <HiBell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </button>
                            <Link to="/" className="text-sm text-dark-500 hover:text-primary-600">View Site</Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
