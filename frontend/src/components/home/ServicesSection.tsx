import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HiCode, HiShoppingCart, HiColorSwatch, HiTrendingUp,
    HiSpeakerphone, HiCursorClick, HiPencilAlt, HiLightningBolt,
    HiDeviceMobile, HiMail, HiArrowRight,
} from 'react-icons/hi';
import SectionHeading from '@/components/ui/SectionHeading';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    HiCode, HiShoppingCart, HiColorSwatch, HiTrendingUp,
    HiSpeakerphone, HiCursorClick, HiPencilAlt, HiLightningBolt,
    HiDeviceMobile, HiMail,
};

const featuredServices = [
    {
        title: 'Website Development',
        desc: 'Custom, high-performance websites with cutting-edge technology and stunning design.',
        icon: 'HiCode',
        color: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-50',
        textColor: 'text-blue-600',
        href: '/services/website-development',
    },
    {
        title: 'E-commerce Solutions',
        desc: 'Scalable online stores optimized for conversions and seamless shopping experiences.',
        icon: 'HiShoppingCart',
        color: 'from-purple-500 to-violet-600',
        bg: 'bg-purple-50',
        textColor: 'text-purple-600',
        href: '/services/ecommerce-development',
    },
    {
        title: 'Social Media',
        desc: 'Strategic campaigns that build communities and drive meaningful engagement.',
        icon: 'HiSpeakerphone',
        color: 'from-orange-500 to-amber-600',
        bg: 'bg-orange-50',
        textColor: 'text-orange-600',
        href: '/services/social-media-marketing',
    },
    {
        title: 'Google Ads',
        desc: 'High-ROI paid advertising campaigns that deliver qualified traffic and conversions.',
        icon: 'HiCursorClick',
        color: 'from-cyan-500 to-blue-600',
        bg: 'bg-cyan-50',
        textColor: 'text-cyan-600',
        href: '/services/google-ads',
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
    },
};

export default function ServicesSection() {
    return (
        <section className="section-padding bg-gray-50/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-100/20 rounded-full blur-[100px]" />

            <div className="container-custom relative">
                <SectionHeading
                    badge="Our Services"
                    title="Solutions That Drive"
                    highlight="Results"
                    description="From strategy to execution, we deliver comprehensive digital marketing solutions tailored to your unique business goals."
                />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {featuredServices.map((service) => {
                        const Icon = iconMap[service.icon] || HiCode;
                        return (
                            <motion.div key={service.title} variants={itemVariants}>
                                <Link
                                    to={service.href}
                                    className="group block bg-white rounded-2xl p-7 border border-gray-100 card-hover relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500"
                                        style={{ backgroundImage: `linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))` }}
                                    />

                                    <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-6 h-6 ${service.textColor}`} />
                                    </div>

                                    <h3 className="text-lg font-heading font-semibold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-dark-500 text-sm leading-relaxed mb-4">
                                        {service.desc}
                                    </p>
                                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-3 transition-all">
                                        Learn More <HiArrowRight className="w-4 h-4" />
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-12"
                >
                    <Link to="/services" className="btn-secondary">
                        View All Services <HiArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
