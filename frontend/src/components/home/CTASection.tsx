import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

export default function CTASection() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700" />
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-[100px]" />

            <div className="container-custom relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Limited Spots Available This Month
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 text-balance">
                        Ready to Transform Your{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-200 to-accent-200">
                            Digital Future?
                        </span>
                    </h2>
                    <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
                        Join 150+ brands that chose Scalax Labs to accelerate their growth. Let's discuss how we can help you achieve extraordinary results.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/book-consultation"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-700 font-semibold shadow-2xl shadow-black/20 hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 group"
                        >
                            Book Free Consultation
                            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

