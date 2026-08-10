import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiClock, HiUser, HiHeart } from 'react-icons/hi';
import SEOHead from '@/components/ui/SEOHead';
import api from '@/lib/api';

export default function BlogDetailPage() {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPost = async () => {
            try {
                setError('');
                const { data } = await api.get(`/cms/blog/${slug}`);
                setPost(data.data);
            } catch (err: any) {
                setPost(null);
                setError(err.response?.data?.message || 'Blog post not found.');
            }
        };

        if (slug) {
            loadPost();
        }
    }, [slug]);

    return (
        <>
            <SEOHead
                title={post?.title || 'Blog Post'}
                description={post?.excerpt || 'Insights from the Scalax Labs Team.'}
                canonical={`/blog/${slug}`}
            />

            <section className="relative pt-32 pb-16 bg-gradient-to-b from-primary-50/50 to-white overflow-hidden">
                <div className="container-custom relative">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mb-6">
                            <HiArrowLeft className="w-4 h-4" /> Back to Blog
                        </Link>
                        {error && !post ? (
                            <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
                                <h1 className="text-3xl font-heading font-bold text-dark-900">Blog post unavailable</h1>
                                <p className="mt-3 text-dark-500">{error}</p>
                            </div>
                        ) : (
                            <>
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6 border border-primary-100">
                                    {post?.category || 'Blog'}
                                </span>
                                <h1 className="text-4xl sm:text-5xl font-heading font-bold text-dark-900 mb-4">{post?.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-dark-400">
                                    <span className="flex items-center gap-1"><HiUser className="w-4 h-4" /> {post?.author || 'Scalax Labs Team'}</span>
                                    <span className="flex items-center gap-1"><HiClock className="w-4 h-4" /> {post?.readTime || 5} min read</span>
                                    <span className="flex items-center gap-1"><HiHeart className="w-4 h-4" /> {post?.likes || 0}</span>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {post && (
                <section className="section-padding bg-white pt-8">
                    <div className="container-custom max-w-4xl">
                        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/50">
                            <div className="mb-8 h-72 rounded-2xl overflow-hidden" style={{ backgroundImage: `linear-gradient(135deg, ${post.color || '#3b82f6'}, #4f46e5)` }}>
                                <div className="flex h-full items-center justify-center text-white/25 text-8xl font-heading font-bold">{post.title?.slice(0, 1)}</div>
                            </div>
                            <p className="text-lg leading-8 text-dark-600">{post.excerpt}</p>
                            <div className="prose prose-slate mt-8 max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
