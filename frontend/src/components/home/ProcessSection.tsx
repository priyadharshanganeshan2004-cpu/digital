import { motion } from 'framer-motion';
import { PROCESS_STEPS } from '@/lib/constants';
import SectionHeading from '@/components/ui/SectionHeading';
import { HiSearch, HiLightBulb, HiCog, HiChartBar } from 'react-icons/hi';

const stepIcons = [HiSearch, HiLightBulb, HiCog, HiChartBar];

export default function ProcessSection() {
    return (
        <section className="section-padding bg-dark-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5"
                style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(168,85,247,0.3) 0%, transparent 50%)`,
                }}
            />

            <div className="container-custom relative">
                <SectionHeading
                    badge="Our Process"
                    title="How We Deliver"
                    highlight="Excellence"
                    description="A proven four-step process that ensures every project exceeds expectations and delivers measurable results."
                />

                {/* Override heading colors for dark section */}
                <style>{`
          .section-padding.bg-dark-900 h2 { color: white; }
          .section-padding.bg-dark-900 p { color: #94a3b8; }
          .section-padding.bg-dark-900 .text-dark-500 { color: #94a3b8; }
        `}</style>

                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600/20 via-primary-500/40 to-accent-500/20 -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {PROCESS_STEPS.map((step, i) => {
                            const Icon = stepIcons[i];
                            return (
                                <motion.div
                                    key={step.step}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.6 }}
                                    className="relative group"
                                >
                                    <div className="bg-dark-800/60 backdrop-blur border border-white/5 rounded-2xl p-8 text-center group-hover:border-primary-500/30 transition-all duration-500 h-full">
                                        {/* Step Number */}
                                        <div className="relative mx-auto w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                                            <Icon className="w-7 h-7 text-white" />
                                            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-dark-900 border border-white/10 flex items-center justify-center">
                                                <span className="text-xs font-bold text-primary-400">{step.step.toString().padStart(2, '0')}</span>
                                            </div>
                                        </div>

                                        <h3 className="font-heading font-semibold text-lg text-white mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-dark-400 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
