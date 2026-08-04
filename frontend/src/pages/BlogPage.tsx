import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiClock, HiUser, HiArrowRight, HiHeart } from 'react-icons/hi';
import SectionHeading from '@/components/ui/SectionHeading';
import SEOHead from '@/components/ui/SEOHead';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const categories = ['All', 'SEO', 'Marketing', 'Design', 'Development', 'Social Media', 'Branding'];

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: blogPosts = [] } = useQuery({
        queryKey: ['cms-blog'],
        queryFn: async () => {
            const { data } = await api.get('/cms/blog');
            return data.data || [];
        },
        staleTime: 5 * 60 * 1000,
    });

    const filtered = blogPosts
        .filter((post) => activeCategory === 'All' || post.category === activeCategory)
        .filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <>
            <SEOHead
                title="Blog"
                description="Expert insights, tips, and strategies on digital marketing, SEO, web development, and more from the NexusDigital team."
                canonical="/blog"
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
                            Our Blog
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-dark-900 mb-6">
                            Insights & <span className="gradient-text">Expertise</span>
                        </h1>
                        <p className="text-lg text-dark-500 leading-relaxed">
                            Expert perspectives on digital marketing, design, development, and everything in between.
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
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((post, i) => (
                            <motion.article
                                key={post._id || post.slug}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (i % 3) * 0.1 }}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover"
                            >
                                <Link to={`/blog/${post.slug}`}>
                                    <div className="h-48 relative" style={{ backgroundImage: `linear-gradient(135deg, ${post.color || '#3b82f6'}, #4f46e5)` }}>
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center text-white/30 text-6xl font-heading font-bold">
                                            {post.title.slice(0, 1)}
                                        </div>
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-medium">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-3 text-xs text-dark-400">
                                        <span className="flex items-center gap-1">
                                            <HiUser className="w-3.5 h-3.5" />
                                            {post.author || 'NexusDigital Team'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <HiClock className="w-3.5 h-3.5" />
                                            {post.readTime || 5} min read
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <HiHeart className="w-3.5 h-3.5" />
                                            {post.likes || 0}
                                        </span>
                                    </div>

                                    <Link to={`/blog/${post.slug}`}>
                                        <h3 className="font-heading font-semibold text-lg text-dark-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                    </Link>
                                    <p className="text-dark-500 text-sm leading-relaxed mb-4 line-clamp-2">
                                        {post.excerpt}
                                    </p>

                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-3 transition-all"
                                    >
                                        Read More <HiArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-dark-400 text-lg">No articles found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
