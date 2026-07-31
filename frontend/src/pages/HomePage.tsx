import { lazy, Suspense } from 'react';
import SEOHead from '@/components/ui/SEOHead';
import HeroSection from '@/components/home/HeroSection';
import { PageLoader } from '@/components/ui/Skeleton';

const ServicesSection = lazy(() => import('@/components/home/ServicesSection'));
const WhyChooseUsSection = lazy(() => import('@/components/home/WhyChooseUsSection'));
const ProcessSection = lazy(() => import('@/components/home/ProcessSection'));
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection'));
const PricingSection = lazy(() => import('@/components/home/PricingSection'));
const CTASection = lazy(() => import('@/components/home/CTASection'));

export default function HomePage() {
    return (
        <>
            <SEOHead
                title="Home"
                description="NexusDigital is a premier digital marketing agency delivering innovative solutions in web development, SEO, social media marketing, and more. Transform your digital presence today."
                keywords="digital marketing agency, web development, SEO, social media marketing, branding"
                canonical="/"
            />
            <HeroSection />
            <Suspense fallback={<PageLoader />}>
                <ServicesSection />
                <WhyChooseUsSection />
                <ProcessSection />
                <TestimonialsSection />
                <PricingSection />
                <CTASection />
            </Suspense>
        </>
    );
}
