import { motion } from 'framer-motion';
import SEOHead from '@/components/ui/SEOHead';
import CTASection from '@/components/home/CTASection';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

const caseStudies = [
    { id: 1, title: 'How TechFlow Increased ARR by 340%', client: 'TechFlow Inc.', industry: 'SaaS', services: ['SEO', 'Content Marketing', 'PPC'], results: ['+340% ARR', '+200% organic traffic', '-45% customer acquisition cost'], color: 'from-blue-500 to-indigo-600' },
    { id: 2, title: 'CloudBase: From Startup to $2M Monthly Revenue', client: 'CloudBase Solutions', industry: 'E-commerce', services: ['Web Development', 'Google Ads', 'Email Marketing'], results: ['$2M monthly revenue', '+150% conversion rate', '300K daily visitors'], color: 'from-purple-500 to-pink-600' },
    { id: 3, title: 'VivaNova: Building a Healthcare Brand', client: 'VivaNova Health', industry: 'Healthcare', services: ['Branding', 'Social Media', 'Content'], results: ['250% brand awareness', '400% social growth', 'Featured in Forbes'], color: 'from-emerald-500 to-teal-600' },
];

export default function CaseStudiesPage() {
    return (
        <>
            <SEOHead title="Case Studies" description="Explore our client success stories and see how we've helped brands achieve extraordinary results." canonical="/case-studies" />

            <section className="relative pt-32 pb-16 bg-gradient-to-b from-primary-50/50 to-white">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6 border border-primary-100">Case Studies</span>
                        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-dark-900 mb-6">
                            Real Results, <span className="gradient-text">Real Impact</span>
                        </h1>
                        <p className="text-lg text-dark-500">Deep dives into how we've helped our clients achieve extraordinary growth.</p>
                    </motion.div>
                </div>
            </section>

            <section className="section-padding bg-white pt-8">
                <div className="container-custom">
                    <div className="space-y-12">
                        {caseStudies.map((cs, i) => (
                            <motion.div key={cs.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-white rounded-3xl border border-gray-100 overflow-hidden card-hover">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className={`h-64 lg:h-auto bg-gradient-to-br ${cs.color} relative flex items-center justify-center`}>
                                        <span className="text-white/20 text-8xl font-heading font-bold">{cs.client.slice(0, 2)}</span>
                                    </div>
                                    <div className="p-8 lg:p-12">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">{cs.industry}</span>
                                            <span className="text-dark-400 text-xs">• {cs.client}</span>
                                        </div>
                                        <h2 className="text-2xl font-heading font-bold text-dark-900 mb-4">{cs.title}</h2>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {cs.services.map((s) => <span key={s} className="px-3 py-1 rounded-lg bg-gray-100 text-dark-600 text-xs font-medium">{s}</span>)}
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            {cs.results.map((r) => (
                                                <div key={r} className="text-center p-3 rounded-xl bg-primary-50">
                                                    <span className="block font-heading font-bold text-primary-600 text-lg">{r.split(' ')[0]}</span>
                                                    <span className="text-xs text-dark-500">{r.split(' ').slice(1).join(' ')}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Link to="/contact" className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm hover:gap-3 transition-all">
                                            Read Full Case Study <HiArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}
