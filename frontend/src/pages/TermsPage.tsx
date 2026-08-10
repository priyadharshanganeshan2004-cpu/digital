import SEOHead from '@/components/ui/SEOHead';
import { motion } from 'framer-motion';

export default function TermsPage() {
    return (
        <>
            <SEOHead title="Terms & Conditions" description="Read the terms and conditions for using Scalax Labs services." canonical="/terms" />
            <section className="pt-32 pb-16 bg-gradient-to-b from-primary-50/50 to-white">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                        <h1 className="text-4xl font-heading font-bold text-dark-900 mb-4">Terms & Conditions</h1>
                        <p className="text-dark-500">Last updated: January 1, 2024</p>
                    </motion.div>
                </div>
            </section>
            <section className="section-padding bg-white pt-8">
                <div className="container-custom max-w-3xl">
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">By accessing and using Scalax Labs's website and services, you accept and agree to be bound by these Terms and Conditions.</p>
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">2. Services</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">We provide digital marketing services as described on our website. Specific terms for individual services will be outlined in separate service agreements.</p>
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">3. Payment Terms</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">Payment terms are net 30 days unless otherwise agreed. All fees are non-refundable unless explicitly stated in the service agreement.</p>
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">4. Intellectual Property</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">All content, designs, and materials created by Scalax Labs remain our property until full payment is received, at which point ownership transfers to the client.</p>
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">5. Limitation of Liability</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">Scalax Labs shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">6. Termination</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">Either party may terminate services with 30 days written notice. Outstanding payments remain due regardless of termination.</p>
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">7. Contact</h2>
                    <p className="text-dark-600 leading-relaxed">For questions about these terms, contact us at legal@Scalax Labs.com.</p>
                </div>
            </section>
        </>
    );
}

