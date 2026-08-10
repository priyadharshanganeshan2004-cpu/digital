import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiArrowRight, HiPlay } from 'react-icons/hi';

// ─── CMS Fallback defaults ─────────────────────────────────────────────────
// These values are ONLY used when the CMS API hasn't returned yet (loading)
// or if a field is missing from the database document.
// They are NOT business content — treat as last-resort safety-net values.
const FALLBACK = {
    badge: 'Digital growth partner for ambitious brands',
    titleLine1: 'Growth-driven',
    titleLine2: 'digital',
    highlight: 'strategy',
    description:
        'We blend strategy, creative execution, and measurable performance to help brands grow with clarity and confidence.',
    primaryCta: 'Start your project',
    primaryCtaLink: '/book-consultation',
    secondaryCta: 'See our work',
    secondaryCtaLink: '/portfolio',
    trustedLabel: 'Trusted by Industry Leaders',
    trustedBrands: [
        { name: 'TechFlow', logo: '' },
        { name: 'CloudBase', logo: '' },
        { name: 'DataSync', logo: '' },
        { name: 'PixelEdge', logo: '' },
        { name: 'VivaNova', logo: '' },
        { name: 'BlueShift', logo: '' },
    ],
};
// ──────────────────────────────────────────────────────────────────────────

interface TrustedBrand {
    name: string;
    logo?: string;
    _id?: string;
}

interface HeroSettings {
    heroBadge?: string;
    heroTitleLine1?: string;
    heroTitleLine2?: string;
    heroHighlight?: string;
    heroDescription?: string;
    heroPrimaryCta?: string;
    heroPrimaryCtaLink?: string;
    heroSecondaryCta?: string;
    heroSecondaryCtaLink?: string;
    heroTrustedLabel?: string;
    heroTrustedBrands?: TrustedBrand[];
}

interface HeroSectionProps {
    settings?: HeroSettings | null;
    isLoading?: boolean;
}

export default function HeroSection({ settings, isLoading }: HeroSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const initParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Array<{
            x: number; y: number; size: number; speedX: number; speedY: number; opacity: number;
        }> = [];

        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }

        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
                ctx.fill();
            });

            particles.forEach((a, i) => {
                particles.slice(i + 1).forEach((b) => {
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.05 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationId);
    }, []);

    useEffect(() => {
        const cleanup = initParticles();
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            cleanup?.();
            window.removeEventListener('resize', handleResize);
        };
    }, [initParticles]);

    // ── Resolve CMS values (fall back to FALLBACK constants) ──────────────
    const badge = settings?.heroBadge || FALLBACK.badge;
    const titleLine1 = settings?.heroTitleLine1 || FALLBACK.titleLine1;
    const titleLine2 = settings?.heroTitleLine2 || FALLBACK.titleLine2;
    const highlight = settings?.heroHighlight || FALLBACK.highlight;
    const description = settings?.heroDescription || FALLBACK.description;
    const primaryCta = settings?.heroPrimaryCta || FALLBACK.primaryCta;
    const primaryLink = settings?.heroPrimaryCtaLink || FALLBACK.primaryCtaLink;
    const secondaryCta = settings?.heroSecondaryCta || FALLBACK.secondaryCta;
    const secondaryLink = settings?.heroSecondaryCtaLink || FALLBACK.secondaryCtaLink;
    const trustedLabel = settings?.heroTrustedLabel || FALLBACK.trustedLabel;
    const trustedBrands: TrustedBrand[] =
        settings?.heroTrustedBrands && settings.heroTrustedBrands.length > 0
            ? settings.heroTrustedBrands
            : FALLBACK.trustedBrands;
    // ──────────────────────────────────────────────────────────────────────

    return (
        <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-white">
            {/* Particle Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

            {/* Gradient Orbs */}
            <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-accent-400/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-200/10 rounded-full blur-[150px]" />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            <motion.div style={{ y, opacity }} className="relative container-custom pt-32 pb-20">
                <div className="max-w-4xl mx-auto text-center">

                    {/* ── Badge ─────────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {isLoading ? (
                            <div className="inline-block h-8 w-80 rounded-full bg-gray-100 animate-pulse mb-8" />
                        ) : (
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold mb-8">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                                </span>
                                {badge}
                            </span>
                        )}
                    </motion.div>

                    {/* ── Heading ───────────────────────────────────────── */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold tracking-tight text-dark-900 mb-6"
                    >
                        {isLoading ? (
                            <>
                                <div className="h-16 w-72 rounded-xl bg-gray-100 animate-pulse mx-auto mb-3" />
                                <div className="h-16 w-56 rounded-xl bg-gray-100 animate-pulse mx-auto" />
                            </>
                        ) : (
                            <>
                                {/* Line 1 — plain text */}
                                <span className="block">{titleLine1}</span>
                                {/* Line 2 — plain + highlighted */}
                                <span className="block">
                                    {titleLine2 && <span>{titleLine2} </span>}
                                    <span className="gradient-text">{highlight}</span>
                                </span>
                            </>
                        )}
                    </motion.h1>

                    {/* ── Description ───────────────────────────────────── */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-lg sm:text-xl text-dark-500 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        {isLoading ? (
                            <span className="block h-14 rounded-xl bg-gray-100 animate-pulse" />
                        ) : (
                            description
                        )}
                    </motion.p>

                    {/* ── CTAs ──────────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        {isLoading ? (
                            <>
                                <div className="h-14 w-44 rounded-xl bg-gray-100 animate-pulse" />
                                <div className="h-14 w-36 rounded-xl bg-gray-100 animate-pulse" />
                            </>
                        ) : (
                            <>
                                <Link
                                    to={primaryLink}
                                    className="btn-primary text-base px-8 py-4 group"
                                >
                                    {primaryCta}
                                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to={secondaryLink}
                                    className="btn-secondary text-base px-8 py-4 group"
                                >
                                    <HiPlay className="w-5 h-5" />
                                    {secondaryCta}
                                </Link>
                            </>
                        )}
                    </motion.div>

                    {/* ── Trusted Brands ────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="mt-16 pt-12 border-t border-gray-100"
                    >
                        {isLoading ? (
                            <div className="h-4 w-48 rounded bg-gray-100 animate-pulse mx-auto mb-6" />
                        ) : (
                            <p className="text-sm text-dark-400 mb-6 font-medium uppercase tracking-wider">
                                {trustedLabel}
                            </p>
                        )}
                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                            {isLoading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-8 w-20 rounded-lg bg-gray-100 animate-pulse" />
                                ))
                                : trustedBrands.map((brand, i) => (
                                    <motion.div
                                        key={brand._id || brand.name + i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 0.4, y: 0 }}
                                        whileHover={{ opacity: 0.8 }}
                                        transition={{ delay: 1.2 + i * 0.1 }}
                                        className="flex items-center gap-2 transition-opacity cursor-default"
                                    >
                                        {brand.logo ? (
                                            <img
                                                src={brand.logo}
                                                alt={brand.name}
                                                className="h-8 w-auto object-contain opacity-60"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <span className="text-xs font-bold text-dark-500">
                                                    {brand.name.slice(0, 2)}
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-sm font-semibold text-dark-600 hidden sm:block">
                                            {brand.name}
                                        </span>
                                    </motion.div>
                                ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-6 h-10 rounded-full border-2 border-dark-300/30 flex items-start justify-center p-1.5"
                >
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-dark-400" />
                </motion.div>
            </motion.div>
        </section>
    );
}
