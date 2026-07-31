import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiExternalLink, HiEye } from 'react-icons/hi';
import SectionHeading from '@/components/ui/SectionHeading';
import SEOHead from '@/components/ui/SEOHead';
import CTASection from '@/components/home/CTASection';

const categories = ['All', 'Website', 'E-commerce', 'Branding', 'SEO', 'Social Media', 'Mobile App'];

const portfolioItems = [
    { id: 1, title: 'TechFlow SaaS Platform', category: 'Website', desc: 'Complete redesign and development of a SaaS platform serving 10,000+ users.', color: 'from-blue-500 to-indigo-600', results: ['200% traffic increase', '150% conversion boost'] },
    { id: 2, title: 'CloudBase E-commerce', category: 'E-commerce', desc: 'Built a scalable online store handling $2M+ in monthly transactions.', color: 'from-purple-500 to-pink-600', results: ['300% revenue growth', '45% lower bounce rate'] },
    { id: 3, title: 'VivaNova Brand Identity', category: 'Branding', desc: 'Complete brand refresh including logo, guidelines, and marketing collateral.', color: 'from-orange-500 to-red-600', results: ['Brand recognition up 250%', 'Social media growth 400%'] },
    { id: 4, title: 'DataSync SEO Campaign', category: 'SEO', desc: 'Comprehensive SEO strategy that dominated competitive keywords.', color: 'from-green-500 to-teal-600', results: ['#1 ranking for 15 keywords', 'Organic traffic up 340%'] },
    { id: 5, title: 'PixelEdge Social Campaign', category: 'Social Media', desc: 'Multi-platform social media strategy reaching 2M+ monthly impressions.', color: 'from-pink-500 to-rose-600', results: ['2M+ monthly impressions', 'Engagement rate up 180%'] },
    { id: 6, title: 'IronClad Mobile App', category: 'Mobile App', desc: 'Cross-platform mobile app with 50,000+ downloads in first month.', color: 'from-cyan-500 to-blue-600', results: ['50K+ downloads', '4.8★ App Store rating'] },
    { id: 7, title: 'SkyReach Corporate Site', category: 'Website', desc: 'Enterprise website with custom CMS and multi-language support.', color: 'from-indigo-500 to-purple-600', results: ['60% faster load time', '90% client satisfaction'] },
    { id: 8, title: 'BlueShift Online Store', category: 'E-commerce', desc: 'High-converting e-commerce platform with AI-powered recommendations.', color: 'from-teal-500 to-emerald-600', results: ['Average order value up 35%', 'Cart abandonment down 40%'] },
    { id: 9, title: 'NovaTech Brand Launch', category: 'Branding', desc: 'From concept to market: a complete brand strategy for a tech startup.', color: 'from-amber-500 to-orange-600', results: ['Featured in TechCrunch', 'Series A funding secured'] },
];

export default function PortfolioPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = portfolioItems
        .filter((item) => activeCategory === 'All' || item.category === activeCategory)
        .filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <>
            <SEOHead
                title="Portfolio"
                description="Explore our portfolio of successful digital marketing projects including websites, e-commerce, branding, and more."
                canonical="/portfolio"
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
                            Our Portfolio
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-dark-900 mb-6">
                            Work That Speaks <span className="gradient-text">Volumes</span>
                        </h1>
                        <p className="text-lg text-dark-500 leading-relaxed">
                            Explore our curated collection of projects that showcase our expertise in delivering extraordinary digital solutions.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="section-padding bg-white pt-8">
                <div className="container-custom">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat
                                            ? 'gradient-bg text-white shadow-lg shadow-primary-500/20'
                                            : 'bg-gray-100 text-dark-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-72">
                            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search projects..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover"
                                >
                                    {/* Image Placeholder */}
                                    <div className={`relative h-56 bg-gradient-to-br ${item.color} overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-white/50 text-5xl font-heading font-bold">{item.title.slice(0, 2)}</span>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                                <HiEye className="w-5 h-5" />
                                            </button>
                                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                                <HiExternalLink className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-medium">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="font-heading font-semibold text-lg text-dark-900 mb-2 group-hover:text-primary-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-dark-500 text-sm leading-relaxed mb-4 line-clamp-2">
                                            {item.desc}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.results.map((result) => (
                                                <span key={result} className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-600 text-xs font-medium">
                                                    {result}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filtered.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-dark-400 text-lg">No projects found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </section>

            <CTASection />
        </>
    );
}
