import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiCalendar, HiClock, HiUser, HiMail, HiPhone, HiArrowRight } from 'react-icons/hi';
import SEOHead from '@/components/ui/SEOHead';
import { SERVICES_DATA } from '@/lib/constants';
import api from '@/lib/api';

const bookingSchema = z.object({
    name: z.string().min(2, 'Required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Invalid phone'),
    service: z.string().min(1, 'Select a service'),
    date: z.string().min(1, 'Select a date'),
    time: z.string().min(1, 'Select a time'),
    message: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

export default function BookConsultationPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
    });

    const onSubmit = async (data: BookingFormData) => {
        try {
            setSubmitError('');
            // Formatting the message to include booking date/time for the backend
            const leadData = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                service: data.service,
                message: `Consultation Booked for ${data.date} at ${data.time}.\n\nAdditional Message: ${data.message || 'None'}`
            };
            await api.post('/leads', leadData);
            setIsSubmitted(true);
            reset();
        } catch (error: any) {
            console.error('Failed to book consultation', error);
            setSubmitError(error.response?.data?.message || 'Failed to book consultation. Please try again.');
        }
    };

    const inputClasses = 'w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-dark-900 placeholder:text-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm';

    if (isSubmitted) {
        return (
            <>
                <SEOHead title="Booking Confirmed" description="Your consultation has been booked." canonical="/book-consultation" />
                <div className="min-h-screen flex items-center justify-center bg-white pt-20">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md p-8">
                        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">✓</span>
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-dark-900 mb-4">Booking Confirmed!</h1>
                        <p className="text-dark-500 mb-8">We've sent a confirmation email with all the details. Our team will reach out to you shortly.</p>
                        <button onClick={() => setIsSubmitted(false)} className="btn-primary">Book Another Call</button>
                    </motion.div>
                </div>
            </>
        );
    }

    return (
        <>
            <SEOHead title="Book a Consultation" description="Schedule a free consultation with our digital marketing experts." canonical="/book-consultation" />

            <section className="relative pt-32 pb-16 bg-gradient-to-b from-primary-50/50 to-white">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6 border border-primary-100">Free Consultation</span>
                        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-dark-900 mb-6">
                            Book Your Free <span className="gradient-text">Strategy Call</span>
                        </h1>
                        <p className="text-lg text-dark-500">Pick a time that works for you and let's discuss how we can accelerate your growth.</p>
                    </motion.div>
                </div>
            </section>

            <section className="section-padding bg-white pt-8">
                <div className="container-custom max-w-3xl">
                    <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                        {submitError && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                                {submitError}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">Full Name *</label>
                                <div className="relative">
                                    <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input {...register('name')} placeholder="John Doe" className={`${inputClasses} pl-11`} />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">Email *</label>
                                <div className="relative">
                                    <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input {...register('email')} type="email" placeholder="john@company.com" className={`${inputClasses} pl-11`} />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">Phone *</label>
                                <div className="relative">
                                    <HiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input {...register('phone')} placeholder="+1 (234) 567-890" className={`${inputClasses} pl-11`} />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">Service *</label>
                                <select {...register('service')} className={inputClasses}>
                                    <option value="">Select a service</option>
                                    {SERVICES_DATA.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                                </select>
                                {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">Preferred Date *</label>
                                <div className="relative">
                                    <HiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input {...register('date')} type="date" className={`${inputClasses} pl-11`} />
                                </div>
                                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">Preferred Time *</label>
                                <div className="relative">
                                    <HiClock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <select {...register('time')} className={`${inputClasses} pl-11`}>
                                        <option value="">Select a time</option>
                                        {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                            </div>
                        </div>
                        <div className="mt-5">
                            <label className="block text-sm font-medium text-dark-700 mb-2">Message (optional)</label>
                            <textarea {...register('message')} rows={3} placeholder="Tell us a bit about your project..." className={inputClasses} />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 w-full sm:w-auto disabled:opacity-50">
                            {isSubmitting ? 'Booking...' : 'Book Consultation'} <HiArrowRight className="w-4 h-4" />
                        </button>
                    </motion.form>
                </div>
            </section>
        </>
    );
}
