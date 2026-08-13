import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiMail, HiPhone, HiLocationMarker, HiClock, HiPaperAirplane } from 'react-icons/hi';
import SEOHead from '@/components/ui/SEOHead';
import { BUDGET_OPTIONS, SERVICES_DATA } from '@/lib/constants';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    company: z.string().optional(),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    budget: z.string().optional(),
    service: z.string().min(1, 'Please select a service'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const { data: settings = {} } = useQuery({
        queryKey: ['cms-settings'],
        queryFn: async () => {
            const { data } = await api.get('/cms/settings');
            return data.data || {};
        },
        staleTime: 0,
    });
    const contactInfo = [
        { icon: HiMail, label: 'Email', value: settings.contactEmail || 'priyadharshanganeshan2004@gmail.com', href: settings.contactEmail ? `mailto:${settings.contactEmail}` : 'mailto:priyadharshanganeshan2004@gmail.com' },
        { icon: HiPhone, label: 'Phone', value: settings.phone || '+91 9080399984', href: settings.phone ? `tel:${settings.phone.replace(/\s+/g, '')}` : 'tel:+919080399984' },
        { icon: HiLocationMarker, label: 'Address', value: settings.address || '123 Innovation Drive, San Francisco, CA 94105', href: null },
        { icon: HiClock, label: 'Working Hours', value: settings.workingHours || 'Mon - Fri: 9:00 AM - 6:00 PM', href: null },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        try {
            setSubmitError('');
            await api.post('/leads', data);
            setIsSubmitted(true);
            reset();
            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (error: any) {
            console.error('Failed to submit form', error);
            setSubmitError(error.response?.data?.message || 'Failed to submit form. Please try again later.');
        }
    };

    const inputClasses = 'w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-dark-900 placeholder:text-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm';

    return (
        <>
            <SEOHead
                title="Contact Us"
                description="Get in touch with Scalax Labs. We'd love to hear about your project and discuss how we can help."
                canonical="/contact"
            />

            {/* Hero */}
            <section className="relative pt-32 pb-16 bg-gradient-to-b from-primary-50/50 to-white overflow-hidden">
                <div className="container-custom relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6 border border-primary-100">
                            Contact Us
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-dark-900 mb-6">
                            Let's Start a <span className="gradient-text">Conversation</span>
                        </h1>
                        <p className="text-lg text-dark-500 leading-relaxed">
                            Have a project in mind? We'd love to hear about it. Drop us a line and let's create something extraordinary together.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="section-padding bg-white pt-8">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            {contactInfo.map((info, i) => (
                                <motion.div
                                    key={info.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                        <info.icon className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-dark-400 mb-1">{info.label}</p>
                                        {info.href ? (
                                            <a href={info.href} className="text-dark-900 font-medium hover:text-primary-600 transition-colors">
                                                {info.value}
                                            </a>
                                        ) : (
                                            <p className="text-dark-900 font-medium">{info.value}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Map Placeholder */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mt-8 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 text-center"
                            >
                                <div className="text-4xl mb-3">📍</div>
                                <p className="text-dark-600 font-medium">San Francisco Office</p>
                                <p className="text-sm text-dark-400 mt-1">
                                    Visit us for a coffee and strategy session
                                </p>
                            </motion.div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-2">
                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                onSubmit={handleSubmit(onSubmit)}
                                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50"
                            >
                                {isSubmitted && (
                                    <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-100">
                                        ✓ Your message has been sent successfully! We'll get back to you within 24 hours.
                                    </div>
                                )}

                                {submitError && (
                                    <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                                        {submitError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-700 mb-2">Name *</label>
                                        <input
                                            {...register('name')}
                                            placeholder="John Doe"
                                            className={inputClasses}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-700 mb-2">Company</label>
                                        <input
                                            {...register('company')}
                                            placeholder="Your Company"
                                            className={inputClasses}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-700 mb-2">Email *</label>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            placeholder="john@company.com"
                                            className={inputClasses}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-700 mb-2">Phone</label>
                                        <input
                                            {...register('phone')}
                                            type="tel"
                                            placeholder="+1 (234) 567-890"
                                            className={inputClasses}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-700 mb-2">Service *</label>
                                        <select {...register('service')} className={inputClasses}>
                                            <option value="">Select a service</option>
                                            {SERVICES_DATA.map((s) => (
                                                <option key={s.id} value={s.id}>{s.title}</option>
                                            ))}
                                        </select>
                                        {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-700 mb-2">Budget</label>
                                        <select {...register('budget')} className={inputClasses}>
                                            <option value="">Select budget range</option>
                                            {BUDGET_OPTIONS.map((b) => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className="block text-sm font-medium text-dark-700 mb-2">Message *</label>
                                    <textarea
                                        {...register('message')}
                                        rows={5}
                                        placeholder="Tell us about your project, goals, and timeline..."
                                        className={inputClasses}
                                    />
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary mt-6 w-full sm:w-auto disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    <HiPaperAirplane className="w-4 h-4 rotate-90" />
                                </button>
                            </motion.form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

