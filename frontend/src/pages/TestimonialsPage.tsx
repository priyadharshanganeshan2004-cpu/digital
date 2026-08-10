import SEOHead from '@/components/ui/SEOHead';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import { motion } from 'framer-motion';

export default function TestimonialsPage() {
    return (
        <>
            <SEOHead
                title="Testimonials"
                description="See what our clients say about working with Scalax Labs. Real reviews from real brands."
                canonical="/testimonials"
            />
            <section className="relative pt-32 pb-8 bg-gradient-to-b from-primary-50/50 to-white">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6 border border-primary-100">Client Love</span>
                        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-dark-900 mb-6">
                            What Our Clients <span className="gradient-text">Say About Us</span>
                        </h1>
                    </motion.div>
                </div>
            </section>
            <TestimonialsSection />
            <CTASection />
        </>
    );
}

