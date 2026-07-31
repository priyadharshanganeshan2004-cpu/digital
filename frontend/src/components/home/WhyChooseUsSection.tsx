import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { STATS } from '@/lib/constants';
import SectionHeading from '@/components/ui/SectionHeading';
import {
    HiShieldCheck, HiLightningBolt, HiChartBar,
    HiUserGroup, HiClock, HiSupport,
} from 'react-icons/hi';

function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let startTime: number;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

const reasons = [
    {
        icon: HiShieldCheck,
        title: 'Proven Track Record',
        desc: '500+ successful projects delivered with measurable results.',
    },
    {
        icon: HiLightningBolt,
        title: 'Cutting-Edge Tech',
        desc: 'We stay ahead of the curve, implementing the latest tools and strategies.',
    },
    {
        icon: HiChartBar,
        title: 'Data-Driven Approach',
        desc: 'Every decision is backed by analytics and real-time performance data.',
    },
    {
        icon: HiUserGroup,
        title: 'Dedicated Team',
        desc: 'A team of 50+ experts committed to your brand\'s success.',
    },
    {
        icon: HiClock,
        title: 'On-Time Delivery',
        desc: 'We respect deadlines and deliver projects on schedule, every time.',
    },
    {
        icon: HiSupport,
        title: '24/7 Support',
        desc: 'Round-the-clock support to keep your digital assets running perfectly.',
    },
];

export default function WhyChooseUsSection() {
    return (
        <section className="section-padding bg-white relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-50/50 rounded-full blur-[200px]" />

            <div className="container-custom relative">
                <SectionHeading
                    badge="Why Choose Us"
                    title="Why Brands Trust"
                    highlight="NexusDigital"
                    description="We don't just deliver services — we build partnerships that transform businesses and drive sustainable growth."
                />

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
                >
                    {STATS.map((stat) => (
                        <div
                            key={stat.label}
                            className="relative bg-white rounded-2xl p-8 text-center border border-gray-100 card-hover group"
                        >
                            <div className="absolute inset-0 rounded-2xl gradient-border opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="text-4xl sm:text-5xl font-heading font-bold gradient-text mb-2">
                                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="text-dark-500 text-sm font-medium">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Reasons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reasons.map((reason, i) => (
                        <motion.div
                            key={reason.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="group p-7 rounded-2xl bg-white border border-gray-100 card-hover"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-500 transition-colors duration-300">
                                <reason.icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="font-heading font-semibold text-lg text-dark-900 mb-2">
                                {reason.title}
                            </h3>
                            <p className="text-dark-500 text-sm leading-relaxed">
                                {reason.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
