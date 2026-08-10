import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheck, HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import SectionHeading from '@/components/ui/SectionHeading';
import SEOHead from '@/components/ui/SEOHead';
import CTASection from '@/components/home/CTASection';
import { SERVICES_DATA } from '@/lib/constants';
import { useState } from 'react';

const serviceDetails: Record<string, {
    hero: string;
    benefits: string[];
    features: string[];
    process: { step: number; title: string; desc: string }[];
    faqs: { q: string; a: string }[];
}> = {
    default: {
        hero: 'We deliver exceptional results through innovative strategies and cutting-edge technology, helping your business stand out in a crowded digital landscape.',
        benefits: [
            'Increased online visibility and brand awareness',
            'Higher conversion rates and ROI',
            'Data-driven strategies tailored to your business',
            'Dedicated team of industry experts',
            'Transparent reporting and analytics',
            'Scalable solutions that grow with you',
        ],
        features: [
            'Custom Strategy Development',
            'Performance Tracking Dashboard',
            'Competitive Analysis',
            'Monthly Progress Reports',
            'A/B Testing & Optimization',
            'Dedicated Account Manager',
            '24/7 Support',
            'ROI-Focused Campaigns',
        ],
        process: [
            { step: 1, title: 'Discovery & Research', desc: 'We analyze your business, audience, and competition to build a solid foundation.' },
            { step: 2, title: 'Strategy Development', desc: 'We craft a customized strategy aligned with your goals and budget.' },
            { step: 3, title: 'Implementation', desc: 'Our team executes the strategy with precision and creativity.' },
            { step: 4, title: 'Monitor & Optimize', desc: 'We continuously track performance and optimize for maximum results.' },
        ],
        faqs: [
            { q: 'How long does it take to see results?', a: 'Depending on the service, initial results can be seen within 2-4 weeks, with significant improvements typically within 3-6 months.' },
            { q: 'Do you offer customized packages?', a: 'Absolutely! We tailor our services to fit your specific needs, goals, and budget.' },
            { q: 'What makes your approach different?', a: 'We combine data-driven strategies with creative excellence, focusing on measurable ROI for every campaign.' },
            { q: 'How do you report on performance?', a: 'We provide detailed monthly reports with key metrics, insights, and recommendations through our analytics dashboard.' },
        ],
    },
};

export default function ServiceDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const service = SERVICES_DATA.find((s) => s.id === slug);
    const details = serviceDetails.default;
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-heading font-bold text-dark-900 mb-4">Service Not Found</h1>
                    <Link to="/services" className="btn-primary">
                        View All Services <HiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEOHead
                title={service.title}
                description={`Professional ${service.title} services by Scalax Labs. ${service.shortDesc}`}
                canonical={`/services/${slug}`}
            />

            {/* Hero */}
            <section className="relative pt-32 pb-20 bg-gradient-to-b from-dark-900 to-dark-800 overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 30% 50%, rgba(99,102,241,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(168,85,247,0.4) 0%, transparent 50%)`,
                    }}
                />
                <div className="container-custom relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <Link to="/services" className="inline-flex items-center gap-2 text-primary-400 text-sm font-medium mb-6 hover:text-primary-300 transition-colors">
                            ← Back to Services
                        </Link>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
                            {service.title}
                        </h1>
                        <p className="text-lg text-dark-300 leading-relaxed max-w-2xl">
                            {details.hero}
                        </p>
                        <div className="flex gap-4 mt-8">
                            <Link to="/book-consultation" className="btn-primary">
                                Get Started <HiArrowRight className="w-4 h-4" />
                            </Link>
                            <Link to="/contact" className="btn-secondary border-white/30 text-white hover:bg-white/10">
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Benefits */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <SectionHeading
                                badge="Benefits"
                                title="Why You Need"
                                highlight={service.title}
                                centered={false}
                            />
                            <ul className="space-y-4">
                                {details.benefits.map((benefit, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <HiCheck className="w-3.5 h-3.5 text-primary-600" />
                                        </div>
                                        <span className="text-dark-600">{benefit}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-10 text-center"
                        >
                            <div className="text-6xl font-heading font-bold gradient-text mb-4">98%</div>
                            <p className="text-dark-600 font-medium">Client Satisfaction Rate</p>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="text-2xl font-heading font-bold text-dark-900">500+</div>
                                    <p className="text-xs text-dark-400">Projects</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="text-2xl font-heading font-bold text-dark-900">150+</div>
                                    <p className="text-xs text-dark-400">Clients</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section-padding bg-gray-50/50">
                <div className="container-custom">
                    <SectionHeading badge="Features" title="What's" highlight="Included" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {details.features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl p-5 border border-gray-100 flex items-center gap-3 card-hover"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                                    <HiCheck className="w-4 h-4 text-primary-600" />
                                </div>
                                <span className="text-sm font-medium text-dark-700">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <SectionHeading badge="Our Process" title="How We" highlight="Work" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {details.process.map((step, i) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="text-center group"
                            >
                                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5 text-white text-xl font-heading font-bold shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                                    {step.step.toString().padStart(2, '0')}
                                </div>
                                <h3 className="font-heading font-semibold text-lg text-dark-900 mb-2">{step.title}</h3>
                                <p className="text-dark-500 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="section-padding bg-gray-50/50">
                <div className="container-custom max-w-3xl">
                    <SectionHeading badge="FAQ" title="Frequently Asked" highlight="Questions" />
                    <div className="space-y-3">
                        {details.faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left font-medium text-dark-900 hover:text-primary-600 transition-colors"
                                >
                                    {faq.q}
                                    <span className={`text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="px-5 pb-5"
                                    >
                                        <p className="text-dark-500 text-sm leading-relaxed">{faq.a}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}

