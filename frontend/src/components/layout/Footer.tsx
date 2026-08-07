import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HiMail,
    HiPhone,
    HiLocationMarker,
} from 'react-icons/hi';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
} from 'react-icons/fa';
import { APP_NAME } from '@/lib/constants';
import { useState } from 'react';
import emailApi from '@/services/emailApi';

const footerLinks = {
    services: [
        { label: 'Website Development', href: '/services/website-development' },
        { label: 'Social Media Marketing', href: '/services/social-media-marketing' },
        { label: 'Google Ads', href: '/services/google-ads' },
        { label: 'Content Marketing', href: '/services/content-marketing' },
        { label: 'Branding', href: '/services/branding' },
    ],
    company: [
        { label: 'About Us', href: '/about' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Case Studies', href: '/case-studies' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
    ],
    support: [
        { label: 'FAQ', href: '/faq' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/terms' },
        { label: 'Book Consultation', href: '/book-consultation' },
    ],
};

const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
    { icon: FaYoutube, href: '#', label: 'YouTube' },
];

export default function Footer() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        try {
            setError('');
            setIsLoading(true);
            await emailApi.subscribeNewsletter({ email, source: 'footer' });
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Subscription failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <footer className="relative bg-dark-900 text-white overflow-hidden">
            {/* Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl" />

            {/* Newsletter Section */}
            <div className="relative border-b border-white/10">
                <div className="container-custom py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-heading font-bold mb-4"
                        >
                            Stay Ahead of the <span className="gradient-text">Curve</span>
                        </motion.h3>
                        <p className="text-dark-400 mb-8">
                            Subscribe to our newsletter for the latest digital marketing insights, tips, and exclusive offers.
                        </p>
                        {error && <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary whitespace-nowrap disabled:opacity-60"
                            >
                                {isLoading ? 'Subscribing...' : isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="relative container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                                <span className="text-white font-bold text-lg font-heading">N</span>
                            </div>
                            <span className="font-heading font-bold text-xl">{APP_NAME}</span>
                        </Link>
                        <p className="text-dark-400 mb-6 max-w-sm leading-relaxed">
                            We're a team of digital strategists, creative designers, and marketing experts dedicated to transforming your online presence.
                        </p>
                        <div className="space-y-3">
                            <a href="mailto:priyadharshanganeshan2004@gmail.com" className="flex items-center gap-3 text-dark-400 hover:text-primary-400 transition-colors">
                                <HiMail className="w-5 h-5" />
                                <span className="text-sm">priyadharshanganeshan2004@gmail.com</span>
                            </a>
                            <a href="tel:+1234567890" className="flex items-center gap-3 text-dark-400 hover:text-primary-400 transition-colors">
                                <HiPhone className="w-5 h-5" />
                                <span className="text-sm">+1 (234) 567-890</span>
                            </a>
                            <div className="flex items-center gap-3 text-dark-400">
                                <HiLocationMarker className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">123 Innovation Drive, San Francisco, CA 94105</span>
                            </div>
                        </div>
                    </div>

                    {/* Services Links */}
                    <div>
                        <h4 className="font-heading font-semibold text-lg mb-6">Services</h4>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.href}>
                                    <Link to={link.href} className="text-sm text-dark-400 hover:text-primary-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-heading font-semibold text-lg mb-6">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link to={link.href} className="text-sm text-dark-400 hover:text-primary-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-heading font-semibold text-lg mb-6">Support</h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link to={link.href} className="text-sm text-dark-400 hover:text-primary-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative border-t border-white/10">
                <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-dark-400">
                        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                aria-label={social.label}
                                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-dark-400 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-300"
                            >
                                <social.icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
