import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HiArrowRight, HiCode, HiShoppingCart, HiColorSwatch, HiTrendingUp,
    HiSpeakerphone, HiCursorClick, HiPencilAlt, HiLightningBolt,
    HiDeviceMobile, HiMail, HiLocationMarker, HiUserGroup, HiThumbUp,
    HiCamera, HiStar, HiFilm, HiPhotograph, HiSparkles, HiCog
} from 'react-icons/hi';
import SectionHeading from '@/components/ui/SectionHeading';
import SEOHead from '@/components/ui/SEOHead';
import CTASection from '@/components/home/CTASection';
import { SERVICES_DATA } from '@/lib/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    HiCode, HiShoppingCart, HiColorSwatch, HiTrendingUp,
    HiSpeakerphone, HiCursorClick, HiPencilAlt, HiLightningBolt,
    HiDeviceMobile, HiMail, HiLocationMarker, HiUserGroup, HiThumbUp,
    HiCamera, HiStar, HiFilm, HiPhotograph, HiSparkles, HiCog,
};

export default function ServicesPage() {
    return (
        <>
            <SEOHead
                title="Services"
                description="Explore our comprehensive digital marketing services including web development, SEO, social media marketing, branding, and more."
                canonical="/services"
            />

            {/* Hero */}
            <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary-50/50 to-white overflow-hidden">
                <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 rounded-full blur-[100px]" />
                <div className="container-custom relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6 border border-primary-100">
                            Our Services
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-dark-900 mb-6">
                            Comprehensive Digital{' '}
                            <span className="gradient-text">Solutions</span>
                        </h1>
                        <p className="text-lg text-dark-500 leading-relaxed max-w-2xl mx-auto">
                            From strategy to execution, we offer a full spectrum of digital marketing services designed to help your business thrive in the digital age.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* All Services Grid */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <SectionHeading
                        badge="What We Offer"
                        title="Our Full Range of"
                        highlight="Services"
                        description="Every service is crafted with precision, backed by data, and designed to deliver measurable results."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SERVICES_DATA.map((service, i) => {
                            const Icon = iconMap[service.icon] || HiCode;
                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (i % 6) * 0.08 }}
                                >
                                    <Link
                                        to={`/services/${service.id}`}
                                        className="group block bg-white rounded-2xl p-7 border border-gray-100 card-hover h-full"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-500 transition-colors duration-300">
                                            <Icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="font-heading font-semibold text-lg text-dark-900 mb-2 group-hover:text-primary-600 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-dark-500 text-sm leading-relaxed mb-4">
                                            {service.shortDesc}
                                        </p>
                                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-3 transition-all">
                                            Learn More <HiArrowRight className="w-4 h-4" />
                                        </span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}
