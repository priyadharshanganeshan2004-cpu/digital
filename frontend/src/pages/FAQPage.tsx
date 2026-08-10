import { useState } from 'react';
import { motion } from 'framer-motion';
import SEOHead from '@/components/ui/SEOHead';
import CTASection from '@/components/home/CTASection';

const faqCategories = ['General', 'Services', 'Pricing', 'Process', 'Support'];

const faqs: Record<string, { q: string; a: string }[]> = {
    General: [
        { q: 'What services does Scalax Labs offer?', a: 'We offer a full spectrum of digital marketing services including web development, SEO, social media marketing, Google Ads, content marketing, branding, mobile app development, and more.' },
        { q: 'How long have you been in business?', a: 'Scalax Labs has been operating for over 12 years, serving 150+ clients worldwide across various industries.' },
        { q: 'Do you work with international clients?', a: 'Yes! We work with clients globally. Our team is equipped to handle projects across different time zones and markets.' },
        { q: 'What industries do you specialize in?', a: 'We have experience across tech, healthcare, e-commerce, finance, real estate, education, and more. Our strategies are customized for each industry.' },
    ],
    Services: [
        { q: 'Can I start with just one service?', a: 'Absolutely! You can start with a single service and scale as needed. Many clients begin with one service and expand as they see results.' },
        { q: 'Do you offer custom packages?', a: 'Yes, we create custom packages tailored to your business goals, budget, and timeline.' },
        { q: 'How do you measure success?', a: 'We track KPIs specific to each service — organic traffic, conversion rates, ROI, engagement metrics, and more. You receive detailed monthly reports.' },
    ],
    Pricing: [
        { q: 'Are there any hidden fees?', a: 'No hidden fees whatsoever. Our pricing is transparent and discussed upfront before any work begins.' },
        { q: 'Do you require long-term contracts?', a: 'No. While we recommend a minimum 3-month engagement for best results, we don\'t lock you into long-term contracts.' },
        { q: 'What payment methods do you accept?', a: 'We accept credit/debit cards, bank transfers, PayPal, and Stripe. We also support milestone-based payments.' },
    ],
    Process: [
        { q: 'What does the onboarding process look like?', a: 'It starts with a discovery call, followed by a strategy presentation, then agreement and kickoff. The entire process takes about 1-2 weeks.' },
        { q: 'How often will I get updates?', a: 'Depending on your plan, you\'ll receive weekly or bi-weekly updates, plus detailed monthly reports with analytics and insights.' },
        { q: 'Who will be my main point of contact?', a: 'You\'ll have a dedicated account manager who serves as your primary contact throughout the engagement.' },
    ],
    Support: [
        { q: 'What kind of support do you offer?', a: 'We offer email, phone, and chat support. Enterprise clients get 24/7 priority support with a dedicated team.' },
        { q: 'How quickly do you respond to inquiries?', a: 'We aim to respond to all inquiries within 2-4 business hours during working days.' },
        { q: 'Can I schedule a call to discuss my project?', a: 'Yes! You can book a free consultation through our booking page or contact us directly.' },
    ],
};

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState('General');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <>
            <SEOHead title="FAQ" description="Find answers to frequently asked questions about our services, pricing, and process." canonical="/faq" />

            <section className="relative pt-32 pb-16 bg-gradient-to-b from-primary-50/50 to-white">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6 border border-primary-100">FAQ</span>
                        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-dark-900 mb-6">
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h1>
                        <p className="text-lg text-dark-500">Everything you need to know about our services. Can't find what you're looking for? Contact us.</p>
                    </motion.div>
                </div>
            </section>

            <section className="section-padding bg-white pt-8">
                <div className="container-custom max-w-4xl">
                    <div className="flex flex-wrap gap-2 justify-center mb-10">
                        {faqCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => { setActiveCategory(cat); setOpenFaq(null); }}
                                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === cat ? 'gradient-bg text-white shadow-lg shadow-primary-500/20' : 'bg-gray-100 text-dark-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {faqs[activeCategory]?.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left font-medium text-dark-900 hover:text-primary-600 transition-colors"
                                >
                                    <span className="pr-4">{faq.q}</span>
                                    <span className={`text-xl transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                                </button>
                                {openFaq === i && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5">
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

