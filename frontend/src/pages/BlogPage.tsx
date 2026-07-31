import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiClock, HiUser, HiArrowRight, HiHeart } from 'react-icons/hi';
import SectionHeading from '@/components/ui/SectionHeading';
import SEOHead from '@/components/ui/SEOHead';

const categories = ['All', 'SEO', 'Marketing', 'Design', 'Development', 'Social Media', 'Branding'];

const blogPosts = [
    {
        id: '1',
        slug: 'seo-strategies-2024',
        title: '10 SEO Strategies That Will Dominate in 2024',
        excerpt: 'Stay ahead of the competition with these proven SEO strategies that leverage AI, voice search, and user experience signals.',
        category: 'SEO',
        author: 'Alex Morgan',
        authorInitials: 'AM',
        date: 'Jan 15, 2024',
        readTime: 8,
        likes: 124,
        color: 'from-blue-500 to-indigo-600',
    },
    {
        id: '2',
        slug: 'social-media-trends',
        title: 'Social Media Trends: What\'s Working Now',
        excerpt: 'Discover the social media trends that are driving real engagement and conversions for brands across every industry.',
        category: 'Social Media',
        author: 'Sofia Chen',
        authorInitials: 'SC',
        date: 'Jan 12, 2024',
        readTime: 6,
        likes: 89,
        color: 'from-pink-500 to-rose-600',
    },
    {
        id: '3',
        slug: 'web-design-psychology',
        title: 'The Psychology of Web Design: Colors That Convert',
        excerpt: 'Learn how color psychology influences buying decisions and how to use it to maximize your website\'s conversion rate.',
        category: 'Design',
        author: 'Emma Davis',
        authorInitials: 'ED',
        date: 'Jan 10, 2024',
        readTime: 7,
        likes: 156,
        color: 'from-purple-500 to-violet-600',
    },
    {
        id: '4',
        slug: 'content-marketing-roi',
        title: 'How to Measure Content Marketing ROI Effectively',
        excerpt: 'A comprehensive guide to tracking, measuring, and improving the return on your content marketing investments.',
        category: 'Marketing',
        author: 'Marcus Williams',
        authorInitials: 'MW',
        date: 'Jan 8, 2024',
        readTime: 10,
        likes: 67,
        color: 'from-green-500 to-teal-600',
    },
    {
        id: '5',
        slug: 'react-performance',
        title: 'React Performance Optimization: A Complete Guide',
        excerpt: 'Master React performance with these advanced techniques including lazy loading, memoization, and code splitting.',
        category: 'Development',
        author: 'Ryan Patel',
        authorInitials: 'RP',
        date: 'Jan 5, 2024',
        readTime: 12,
        likes: 203,
        color: 'from-cyan-500 to-blue-600',
    },
    {
        id: '6',
        slug: 'brand-identity-guide',
        title: 'Building a Brand Identity That Stands Out',
        excerpt: 'A step-by-step guide to creating a memorable brand identity that resonates with your target audience.',
        category: 'Branding',
        author: 'Jessica Lee',
        authorInitials: 'JL',
        date: 'Jan 3, 2024',
        readTime: 9,
        likes: 178,
        color: 'from-orange-500 to-amber-600',
    },
];

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = blogPosts
        .filter((post) => activeCategory === 'All' || post.category === activeCategory)
        .filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
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
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (i % 3) * 0.1 }}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover"
                            >
                                <Link to={`/blog/${post.slug}`}>
                                    <div className={`h-48 bg-gradient-to-br ${post.color} relative`}>
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
                                            {post.author}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <HiClock className="w-3.5 h-3.5" />
                                            {post.readTime} min read
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <HiHeart className="w-3.5 h-3.5" />
                                            {post.likes}
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
