import { useState } from 'react';
import SEOHead from '@/components/ui/SEOHead';
import PricingSection from '@/components/home/PricingSection';
import CTASection from '@/components/home/CTASection';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function PricingPage() {
    const { data: siteSettings } = useQuery({
        queryKey: ['cms-settings'],
        queryFn: async () => {
            const { data } = await api.get('/cms/settings');
            return data.data;
        },
        staleTime: 5 * 60 * 1000,
    });
    return (
        <>
            <SEOHead
                title={siteSettings?.seoTitle ? `Pricing | ${siteSettings.siteName}` : 'Pricing'}
                description={siteSettings?.seoDescription || 'Transparent pricing plans for every business size. No hidden fees, no contracts.'}
                canonical="/pricing"
            />

            <section className="relative pt-32 pb-8 bg-gradient-to-b from-primary-50/50 to-white overflow-hidden">
                <div className="container-custom relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6 border border-primary-100">
                            Pricing Plans
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-dark-900 mb-6">
                            Plans That Scale With <span className="gradient-text">Your Growth</span>
                        </h1>
                        <p className="text-lg text-dark-500 leading-relaxed">
                            Choose a plan that fits your needs. All plans include a dedicated account manager and 24/7 support.
                        </p>
                    </motion.div>
                </div>
            </section>

            <PricingSection />
            <CTASection />
        </>
    );
}
