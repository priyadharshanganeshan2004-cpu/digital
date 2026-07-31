import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
    badge?: string;
    title: string;
    highlight?: string;
    description?: string;
    centered?: boolean;
    children?: ReactNode;
}

export default function SectionHeading({
    badge,
    title,
    highlight,
    description,
    centered = true,
    children,
}: SectionHeadingProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className={`mb-16 ${centered ? 'text-center max-w-3xl mx-auto' : ''}`}
        >
            {badge && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4 border border-primary-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                    {badge}
                </span>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-900 mb-4 text-balance">
                {title}{' '}
                {highlight && <span className="gradient-text">{highlight}</span>}
            </h2>
            {description && (
                <p className="text-dark-500 text-lg leading-relaxed max-w-2xl mx-auto">
                    {description}
                </p>
            )}
            {children}
        </motion.div>
    );
}
