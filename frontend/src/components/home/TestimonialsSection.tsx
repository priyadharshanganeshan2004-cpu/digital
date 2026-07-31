import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import SectionHeading from '@/components/ui/SectionHeading';

const testimonials = [
    {
        name: 'Sarah Chen',
        position: 'CEO',
        company: 'TechFlow Inc.',
        content: 'NexusDigital transformed our online presence completely. Our organic traffic increased by 340% in just 6 months, and our conversion rate doubled. Their team is incredibly skilled and responsive.',
        rating: 5,
        initials: 'SC',
    },
    {
        name: 'Marcus Rodriguez',
        position: 'Marketing Director',
        company: 'CloudBase Solutions',
        content: 'The ROI we\'ve seen from their Google Ads campaigns has been phenomenal. They truly understand digital marketing at a deep level and bring fresh, innovative strategies to the table.',
        rating: 5,
        initials: 'MR',
    },
    {
        name: 'Emily Thompson',
        position: 'Founder',
        company: 'PixelEdge Studio',
        content: 'Working with NexusDigital has been a game-changer for our brand. The website they built is not only beautiful but performs exceptionally well. Our bounce rate dropped by 60%.',
        rating: 5,
        initials: 'ET',
    },
    {
        name: 'David Park',
        position: 'CTO',
        company: 'DataSync Corp.',
        content: 'Their team\'s technical expertise is unmatched. They built our e-commerce platform from scratch and it handles 10x the traffic we expected. Absolutely brilliant work.',
        rating: 5,
        initials: 'DP',
    },
    {
        name: 'Lisa Harrison',
        position: 'VP Marketing',
        company: 'VivaNova Health',
        content: 'NexusDigital\'s content marketing strategy put us on the map. We went from zero brand awareness to being featured in major industry publications within a year.',
        rating: 5,
        initials: 'LH',
    },
];

export default function TestimonialsSection() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

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
                                key={current}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                                        <HiStar key={i} className="w-5 h-5 text-yellow-400" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-lg md:text-xl text-dark-700 leading-relaxed mb-8 relative z-10">
                                    "{testimonials[current].content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/20">
                                        {testimonials[current].initials}
                                    </div>
                                    <div>
                                        <h4 className="font-heading font-semibold text-dark-900">
                                            {testimonials[current].name}
                                        </h4>
                                        <p className="text-sm text-dark-500">
                                            {testimonials[current].position}, {testimonials[current].company}
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
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current
                                                ? 'bg-primary-500 w-8'
                                                : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={prev}
                                    className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-dark-500 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-colors"
                                >
                                    <HiChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={next}
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
