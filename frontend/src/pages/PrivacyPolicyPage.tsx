import SEOHead from '@/components/ui/SEOHead';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
    return (
        <>
            <SEOHead title="Privacy Policy" description="Read our privacy policy to understand how NexusDigital collects and uses your data." canonical="/privacy-policy" />
            <section className="pt-32 pb-16 bg-gradient-to-b from-primary-50/50 to-white">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                        <h1 className="text-4xl font-heading font-bold text-dark-900 mb-4">Privacy Policy</h1>
                        <p className="text-dark-500">Last updated: January 1, 2024</p>
                    </motion.div>
                </div>
            </section>
            <section className="section-padding bg-white pt-8">
                <div className="container-custom max-w-3xl prose prose-lg prose-dark-600">
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">1. Information We Collect</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">We collect information you provide directly, including name, email, phone number, company name, and project details when you fill out forms, create an account, or contact us.</p>
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">2. How We Use Your Information</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">We use collected information to provide and improve our services, communicate with you, process transactions, send marketing communications (with consent), and ensure security.</p>
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">3. Data Security</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information.</p>
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">4. Cookies</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">We use cookies and similar technologies to enhance your experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.</p>
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">5. Third-Party Services</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">We may share information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, only as necessary.</p>
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">6. Your Rights</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time by contacting us.</p>
                    <h2 className="font-heading text-2xl font-bold text-dark-900 mt-8 mb-4">7. Contact Us</h2>
                    <p className="text-dark-600 leading-relaxed">For any privacy-related questions, please contact us at privacy@nexusdigital.com or through our contact page.</p>
                </div>
            </section>
        </>
    );
}
