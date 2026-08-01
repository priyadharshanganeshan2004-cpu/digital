import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiArrowRight, HiPlay } from 'react-icons/hi';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';

export default function HeroSection({ settings }: { settings?: any }) {
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

            // Draw connections
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
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                            </span>
                            {settings?.heroBadge || '#1 Digital Marketing Agency — Trusted by 150+ Brands'}
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold tracking-tight text-dark-900 mb-6"
                    >
                        {(settings?.heroTitle || APP_TAGLINE).split(' ').map((word: string, i: number) =>
                            i === (settings?.heroTitle || APP_TAGLINE).split(' ').length - 1 ? (
                                <span key={i} className="gradient-text"> {word}</span>
                            ) : (
                                <span key={i}> {word}</span>
                            )
                        )}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-lg sm:text-xl text-dark-500 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        {settings?.heroDescription || 'We craft data-driven strategies and stunning digital experiences that turn ambitious brands into market leaders. Let\'s build something extraordinary.'}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            to="/book-consultation"
                            className="btn-primary text-base px-8 py-4 group"
                        >
                            {settings?.heroPrimaryCta || 'Start Your Project'}
                            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/portfolio"
                            className="btn-secondary text-base px-8 py-4 group"
                        >
                            <HiPlay className="w-5 h-5" />
                            {settings?.heroSecondaryCta || 'View Our Work'}
                        </Link>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="mt-16 pt-12 border-t border-gray-100"
                    >
                        <p className="text-sm text-dark-400 mb-6 font-medium uppercase tracking-wider">Trusted by Industry Leaders</p>
                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                            {['TechFlow', 'CloudBase', 'DataSync', 'PixelEdge', 'VivaNova', 'BlueShift'].map((name, i) => (
                                <motion.div
                                    key={name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 0.4, y: 0 }}
                                    whileHover={{ opacity: 0.8 }}
                                    transition={{ delay: 1.2 + i * 0.1 }}
                                    className="flex items-center gap-2 transition-opacity cursor-default"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <span className="text-xs font-bold text-dark-500">{name.slice(0, 2)}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-dark-600 hidden sm:block">{name}</span>
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
