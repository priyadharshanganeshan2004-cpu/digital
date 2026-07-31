import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';
import { NAV_LINKS, APP_NAME } from '@/lib/constants';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setActiveDropdown(null);
    }, [location]);

    const toggleDropdown = useCallback((label: string) => {
        setActiveDropdown(prev => prev === label ? null : label);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/[0.03] border-b border-gray-200/50'
                    : 'bg-transparent'
                }`}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                            <span className="text-white font-bold text-lg font-heading">N</span>
                            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className={`font-heading font-bold text-xl tracking-tight ${isScrolled ? 'text-dark-900' : 'text-dark-900'}`}>
                            {APP_NAME}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <div
                                key={link.label}
                                className="relative"
                                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    to={link.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1 ${location.pathname === link.href
                                            ? 'text-primary-600 bg-primary-50'
                                            : 'text-dark-600 hover:text-primary-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.label}
                                    {link.children && (
                                        <HiChevronDown
                                            className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''
                                                }`}
                                        />
                                    )}
                                </Link>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {link.children && activeDropdown === link.label && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden py-2"
                                        >
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    to={child.href}
                                                    className="block px-4 py-2.5 text-sm text-dark-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden lg:flex items-center gap-3">
                        {isAuthenticated ? (
                            <Link
                                to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                                className="btn-primary text-sm"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-5 py-2.5 text-sm font-medium text-dark-600 hover:text-primary-600 transition-colors rounded-lg"
                                >
                                    Sign In
                                </Link>
                                <Link to="/book-consultation" className="btn-primary text-sm">
                                    Book a Call
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 rounded-lg text-dark-600 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="container-custom py-6 space-y-1">
                            {NAV_LINKS.map((link) => (
                                <div key={link.label}>
                                    {link.children ? (
                                        <>
                                            <button
                                                onClick={() => toggleDropdown(link.label)}
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-dark-700 hover:bg-gray-50 font-medium transition-colors"
                                            >
                                                {link.label}
                                                <HiChevronDown
                                                    className={`w-5 h-5 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {activeDropdown === link.label && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="pl-4 space-y-1 overflow-hidden"
                                                    >
                                                        {link.children.map((child) => (
                                                            <Link
                                                                key={child.href}
                                                                to={child.href}
                                                                className="block px-4 py-2.5 rounded-lg text-sm text-dark-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                                            >
                                                                {child.label}
                                                            </Link>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <Link
                                            to={link.href}
                                            className={`block px-4 py-3 rounded-xl font-medium transition-colors ${location.pathname === link.href
                                                    ? 'text-primary-600 bg-primary-50'
                                                    : 'text-dark-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                            <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
                                {isAuthenticated ? (
                                    <Link to="/dashboard" className="btn-primary w-full text-center">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/login" className="btn-secondary w-full text-center">
                                            Sign In
                                        </Link>
                                        <Link to="/book-consultation" className="btn-primary w-full text-center">
                                            Book a Call
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
