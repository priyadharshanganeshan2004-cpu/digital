import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiUserGroup, HiLightBulb, HiHeart, HiGlobe } from 'react-icons/hi';
import SectionHeading from '@/components/ui/SectionHeading';
import SEOHead from '@/components/ui/SEOHead';
import CTASection from '@/components/home/CTASection';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const values = [
    { icon: HiLightBulb, title: 'Innovation', desc: 'We push boundaries and embrace cutting-edge technologies to deliver forward-thinking solutions.' },
    { icon: HiHeart, title: 'Passion', desc: 'Every project gets our full dedication. We\'re genuinely passionate about our clients\' success.' },
    { icon: HiUserGroup, title: 'Collaboration', desc: 'We believe in partnerships, not transactions. Your goals become our mission.' },
    { icon: HiGlobe, title: 'Impact', desc: 'We measure success by the tangible impact we create for our clients\' businesses.' },
];

const fallbackTeam = [
    { name: 'Alex Morgan', role: 'CEO & Founder', initials: 'AM' },
    { name: 'Jessica Lee', role: 'Creative Director', initials: 'JL' },
    { name: 'Ryan Patel', role: 'Head of Engineering', initials: 'RP' },
    { name: 'Sofia Chen', role: 'Marketing Director', initials: 'SC' },
    { name: 'Marcus Williams', role: 'SEO Strategist', initials: 'MW' },
    { name: 'Emma Davis', role: 'UI/UX Lead', initials: 'ED' },
];

export default function AboutPage() {
    const { data: siteSettings } = useQuery({
        queryKey: ['cms-settings'],
        queryFn: async () => {
            const { data } = await api.get('/cms/settings');
            return data.data;
        },
        staleTime: 0,
    });

    const { data: teamMembers } = useQuery({
        queryKey: ['cms-team'],
        queryFn: async () => {
            const { data } = await api.get('/cms/team');
            return data.data;
        },
        staleTime: 0,
    });

    const renderTeam = teamMembers && teamMembers.length > 0 ? teamMembers : fallbackTeam;
    return (
        <>
            <SEOHead
                title="About Us"
                description="Learn about Scalax Labs - a premier digital marketing agency with 12+ years of experience transforming brands through innovative digital solutions."
                canonical="/about"
            />

            {/* Hero */}
            <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary-50/50 to-white overflow-hidden">
                <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 rounded-full blur-[100px]" />
                <div className="container-custom relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6 border border-primary-100">
                            About Us
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-dark-900 mb-6">
                            {siteSettings?.aboutHeading || (
                                <>
                                    We Build Digital{' '}
                                    <span className="gradient-text">Experiences</span>{' '}
                                    That Matter
                                </>
                            )}
                        </h1>
                        <p className="text-lg text-dark-500 leading-relaxed max-w-2xl">
                            {siteSettings?.aboutDescription || 'Founded in 2012, Scalax Labs has grown from a small team of passionate digital enthusiasts to a full-service agency serving 150+ clients worldwide.'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-dark-900 mb-6">
                                {siteSettings?.aboutStoryTitle || (
                                    <>
                                        Our <span className="gradient-text">Story</span>
                                    </>
                                )}
                            </h2>
                            <div className="space-y-4 text-dark-500 leading-relaxed">
                                <p>
                                    {siteSettings?.aboutStoryText1 || "What started as a passion project in a small garage has evolved into one of the most trusted digital marketing agencies in the industry. Our journey has been fueled by curiosity, innovation, and an unwavering commitment to our clients' success."}
                                </p>
                                <p>
                                    {siteSettings?.aboutStoryText2 || "Over the past 12 years, we've delivered 500+ successful projects across various industries — from ambitious startups to Fortune 500 companies. We've built websites, designed brands, launched campaigns, and most importantly, created lasting partnerships."}
                                </p>
                                <p>
                                    {siteSettings?.aboutStoryText3 || "Today, our team of 50+ experts continues to push boundaries, embracing new technologies and strategies to help businesses thrive in an ever-evolving digital landscape."}
                                </p>
                            </div>
                            <Link to="/portfolio" className="btn-primary mt-8">
                                See Our Work <HiArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="bg-primary-50 rounded-2xl p-8 text-center">
                                        <div className="text-4xl font-heading font-bold gradient-text mb-1">{siteSettings?.aboutStatYears || '12+'}</div>
                                        <div className="text-sm text-dark-500 font-medium">Years Experience</div>
                                    </div>
                                    <div className="bg-accent-50 rounded-2xl p-8 text-center">
                                        <div className="text-4xl font-heading font-bold gradient-text mb-1">{siteSettings?.aboutStatProjects || '500+'}</div>
                                        <div className="text-sm text-dark-500 font-medium">Projects Delivered</div>
                                    </div>
                                </div>
                                <div className="space-y-4 mt-8">
                                    <div className="bg-blue-50 rounded-2xl p-8 text-center">
                                        <div className="text-4xl font-heading font-bold gradient-text mb-1">{siteSettings?.aboutStatClients || '150+'}</div>
                                        <div className="text-sm text-dark-500 font-medium">Happy Clients</div>
                                    </div>
                                    <div className="bg-green-50 rounded-2xl p-8 text-center">
                                        <div className="text-4xl font-heading font-bold gradient-text mb-1">{siteSettings?.aboutStatSatisfaction || '98%'}</div>
                                        <div className="text-sm text-dark-500 font-medium font-heading">Client Satisfaction</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-padding bg-gray-50/50">
                <div className="container-custom">
                    <SectionHeading
                        badge="Our Values"
                        title="What Drives"
                        highlight="Us"
                        description="Our core values shape everything we do — from how we work to the results we deliver."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, i) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-7 border border-gray-100 card-hover group text-center"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary-500 transition-colors duration-300">
                                    <value.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="font-heading font-semibold text-lg text-dark-900 mb-2">{value.title}</h3>
                                <p className="text-dark-500 text-sm leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <SectionHeading
                        badge="Our Team"
                        title="Meet the"
                        highlight="Experts"
                        description="A diverse team of creative thinkers, strategists, and tech wizards dedicated to your success."
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {renderTeam.map((member: any, i: number) => (
                            <motion.div
                                key={member._id || member.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="text-center group"
                            >
                                <div className="w-24 h-24 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                                    {member.initials}
                                </div>
                                <h4 className="font-heading font-semibold text-dark-900 text-sm">{member.name}</h4>
                                <p className="text-dark-400 text-xs mt-1">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}

