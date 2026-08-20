import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import SectionHeading from '@/components/ui/SectionHeading';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    company: string;
    message: string;
    rating: number;
    avatar: string;
    isActive: boolean;
    order: number;
}

// Derive initials from a full name (e.g. "Sarah Chen" → "SC")
function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

export default function TestimonialsSection() {
    const [current, setCurrent] = useState(0);

    const { data, isLoading, isError } = useQuery<Testimonial[]>({
        queryKey: ['cms-testimonials'],
        queryFn: async () => {
            const { data } = await api.get('/cms/testimonials', {
                headers: { 'Cache-Control': 'no-cache' },
            });
            return data.data as Testimonial[];
        },
        staleTime: 0,
        placeholderData: (prev) => prev,
    });

    const testimonials = data && data.length > 0 ? data : [];

    // Keep the active index in bounds if testimonials change
    const safeIndex = testimonials.length > 0 ? current % testimonials.length : 0;

    const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    // ── Loading skeleton ───────────────────────────────────────────────
    if (isLoading) {
        return (
            <section className="section-padding bg-gray-50/50 relative overflow-hidden">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-100/50">
                            <div className="space-y-4 animate-pulse">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="w-5 h-5 rounded bg-gray-200" />
                                    ))}
                                </div>
                                <div className="h-4 bg-gray-100 rounded w-full" />
                                <div className="h-4 bg-gray-100 rounded w-5/6" />
                                <div className="h-4 bg-gray-100 rounded w-4/6" />
                                <div className="flex items-center gap-4 mt-6">
                                    <div className="w-14 h-14 rounded-full bg-gray-200" />
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-32" />
                                        <div className="h-3 bg-gray-100 rounded w-24" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // ── Empty / error state ────────────────────────────────────────────
    if (isError || testimonials.length === 0) {
        return null; // Gracefully hide the section if no testimonials exist yet
    }

    const t = testimonials[safeIndex];

    return (
        <section className="section-padding bg-gray-50/50 relative overflow-hidden">
            <div className="absolute top-20 right-0 w-72 h-72 bg-accent-100/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 left-0 w-72 h-72 bg-primary-100/30 rounded-full blur-[100px]" />

            <div className="container-custom relative">
                <SectionHeading
                    badge="Testimonials"
                    title="What Our Clients"
                    highlight="Say"
                    description="Don't just take our word for it — hear from the brands we've helped transform."
                />

                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                        {/* Quote Mark */}
                        <div className="absolute top-6 right-8 text-8xl font-heading text-primary-50 select-none leading-none">
                            "
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={safeIndex}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <HiStar key={i} className="w-5 h-5 text-yellow-400" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-lg md:text-xl text-dark-700 leading-relaxed mb-8 relative z-10">
                                    "{t.message}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    {t.avatar ? (
                                        <img
                                            src={t.avatar}
                                            alt={t.name}
                                            className="w-14 h-14 rounded-full object-cover shadow-lg shadow-primary-500/20"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/20">
                                            {getInitials(t.name)}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-heading font-semibold text-dark-900">
                                            {t.name}
                                        </h4>
                                        <p className="text-sm text-dark-500">
                                            {t.role}, {t.company}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="mt-8 flex items-center justify-between">
                            <div className="flex gap-2">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrent(i)}
                                        aria-label={`Go to testimonial ${i + 1}`}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === safeIndex
                                            ? 'bg-primary-500 w-8'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={prev}
                                    aria-label="Previous testimonial"
                                    className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-dark-500 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors"
                                >
                                    <HiChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={next}
                                    aria-label="Next testimonial"
                                    className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-dark-500 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors"
                                >
                                    <HiChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
