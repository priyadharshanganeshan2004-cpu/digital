import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiLocationMarker, HiBriefcase, HiClock, HiArrowRight } from 'react-icons/hi';
import SEOHead from '@/components/ui/SEOHead';
import CTASection from '@/components/home/CTASection';

const openPositions = [
    { title: 'Senior React Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', experience: '5+ years' },
    { title: 'UI/UX Designer', department: 'Design', location: 'San Francisco, CA', type: 'Full-time', experience: '3+ years' },
    { title: 'SEO Specialist', department: 'Marketing', location: 'Remote', type: 'Full-time', experience: '2+ years' },
    { title: 'Content Marketing Manager', department: 'Marketing', location: 'Remote', type: 'Full-time', experience: '4+ years' },
    { title: 'Social Media Strategist', department: 'Marketing', location: 'San Francisco, CA', type: 'Full-time', experience: '2+ years' },
    { title: 'Full-Stack Developer', department: 'Engineering', location: 'Remote', type: 'Contract', experience: '4+ years' },
];

const perks = [
    { emoji: '🏠', title: 'Remote First', desc: 'Work from anywhere in the world' },
    { emoji: '💰', title: 'Competitive Pay', desc: 'Top market salaries + equity' },
    { emoji: '🏥', title: 'Health Benefits', desc: 'Full medical, dental, vision' },
    { emoji: '📚', title: 'Learning Budget', desc: '$2,000/year for courses & conferences' },
    { emoji: '🏖️', title: 'Unlimited PTO', desc: 'Take time off when you need it' },
    { emoji: '💻', title: 'Equipment', desc: 'Latest MacBook + peripherals' },
];

export default function CareersPage() {
    return (
        <>
            <SEOHead title="Careers" description="Join the Scalax Labs Team. We're looking for talented people who are passionate about digital marketing." canonical="/careers" />

            <section className="relative pt-32 pb-16 bg-gradient-to-b from-primary-50/50 to-white">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6 border border-primary-100">We're Hiring!</span>
                        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-dark-900 mb-6">
                            Build the Future <span className="gradient-text">With Us</span>
                        </h1>
                        <p className="text-lg text-dark-500">Join a team of passionate creators and builders who love what they do.</p>
                    </motion.div>
                </div>
            </section>

            {/* Perks */}
            <section className="section-padding bg-white pt-8">
                <div className="container-custom">
                    <h2 className="text-2xl font-heading font-bold text-dark-900 text-center mb-10">Why Work at Scalax Labs</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
                        {perks.map((perk, i) => (
                            <motion.div key={perk.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="text-3xl mb-2">{perk.emoji}</div>
                                <h3 className="font-heading font-semibold text-sm text-dark-900 mb-1">{perk.title}</h3>
                                <p className="text-dark-400 text-xs">{perk.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Positions */}
                    <h2 className="text-2xl font-heading font-bold text-dark-900 text-center mb-10">Open Positions</h2>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {openPositions.map((pos, i) => (
                            <motion.div key={pos.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group bg-white rounded-xl p-6 border border-gray-100 card-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-heading font-semibold text-lg text-dark-900 group-hover:text-primary-600 transition-colors">{pos.title}</h3>
                                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-dark-400">
                                        <span className="flex items-center gap-1"><HiBriefcase className="w-3.5 h-3.5" /> {pos.department}</span>
                                        <span className="flex items-center gap-1"><HiLocationMarker className="w-3.5 h-3.5" /> {pos.location}</span>
                                        <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5" /> {pos.type}</span>
                                        <span>{pos.experience}</span>
                                    </div>
                                </div>
                                <Link to="/contact" className="btn-secondary text-xs px-4 py-2 flex-shrink-0">
                                    Apply <HiArrowRight className="w-3 h-3" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}

