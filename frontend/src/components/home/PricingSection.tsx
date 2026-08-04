import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheck, HiArrowRight } from 'react-icons/hi';
import SectionHeading from '@/components/ui/SectionHeading';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(false);
    const { data: plans = [] } = useQuery({
        queryKey: ['cms-pricing'],
        queryFn: async () => {
            const { data } = await api.get('/cms/pricing');
            return data.data || [];
        },
        staleTime: 5 * 60 * 1000,
    });

    return (
        <section className="section-padding bg-white relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-50/40 rounded-full blur-[200px]" />

            <div className="container-custom relative">
                <SectionHeading
                    badge="Pricing"
                    title="Transparent"
                    highlight="Pricing"
                    description="Choose the perfect plan for your business. No hidden fees, no contracts. Scale up or down anytime."
                />

                {/* Toggle */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <span className={`text-sm font-medium ${!isAnnual ? 'text-dark-900' : 'text-dark-400'}`}>Monthly</span>
                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-primary-500' : 'bg-gray-300'}`}
                    >
                        <motion.div
                            layout
                            className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
                            style={{ left: isAnnual ? '1.75rem' : '0.125rem' }}
                        />
                    </button>
                    <span className={`text-sm font-medium ${isAnnual ? 'text-dark-900' : 'text-dark-400'}`}>
                        Annual <span className="text-primary-500 font-semibold">(Save 20%)</span>
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {(plans.length ? plans : []).map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className={`relative rounded-3xl p-8 ${plan.isPopular
                                    ? 'bg-dark-900 text-white border-2 border-primary-500/30 shadow-2xl shadow-primary-500/10 scale-105 z-10'
                                    : 'bg-white border border-gray-100 card-hover'
                                }`}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1.5 rounded-full gradient-bg text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary-500/30">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className={`font-heading font-semibold text-xl mb-2 ${plan.isPopular ? 'text-white' : 'text-dark-900'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm ${plan.isPopular ? 'text-dark-300' : 'text-dark-500'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-8">
                                <span className={`text-4xl font-heading font-bold ${plan.isPopular ? 'text-white' : 'text-dark-900'}`}>
                                    {plan.price}
                                </span>
                                <span className={`text-sm ${plan.isPopular ? 'text-dark-400' : 'text-dark-400'}`}>
                                    {plan.period}
                                </span>
                                {isAnnual && (
                                    <div className="text-xs text-primary-400 mt-1 font-medium">
                                        Billed annually (save 20%)
                                    </div>
                                )}
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.isPopular ? 'bg-primary-500/20' : 'bg-primary-50'
                                            }`}>
                                            <HiCheck className={`w-3 h-3 ${plan.isPopular ? 'text-primary-400' : 'text-primary-600'}`} />
                                        </div>
                                        <span className={`text-sm ${plan.isPopular ? 'text-dark-200' : 'text-dark-600'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/book-consultation"
                                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${plan.isPopular
                                        ? 'btn-primary'
                                        : 'btn-secondary'
                                    }`}
                            >
                                {plan.ctaText}
                                <HiArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
