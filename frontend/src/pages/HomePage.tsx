import { lazy, Suspense, useEffect, useState } from 'react';
import SEOHead from '@/components/ui/SEOHead';
import HeroSection from '@/components/home/HeroSection';
import { PageLoader } from '@/components/ui/Skeleton';
import api from '@/lib/api';

const ServicesSection = lazy(() => import('@/components/home/ServicesSection'));
const WhyChooseUsSection = lazy(() => import('@/components/home/WhyChooseUsSection'));
const ProcessSection = lazy(() => import('@/components/home/ProcessSection'));
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection'));
const PricingSection = lazy(() => import('@/components/home/PricingSection'));
const CTASection = lazy(() => import('@/components/home/CTASection'));

export default function HomePage() {
    const [siteSettings, setSiteSettings] = useState<any>(null);

    useEffect(() => {
        const loadSiteSettings = async () => {
            try {
                const { data } = await api.get('/cms/settings');
                setSiteSettings(data.data);
            } catch {
                setSiteSettings(null);
            }
        };
        loadSiteSettings();
    }, []);

    return (
        <>
            <SEOHead
                title={siteSettings?.seoTitle || 'Home'}
                description={siteSettings?.seoDescription || 'NexusDigital is a premier digital marketing agency delivering innovative solutions in web development, SEO, social media marketing, and more. Transform your digital presence today.'}
                keywords="digital marketing agency, web development, SEO, social media marketing, branding"
                canonical="/"
            />
            <HeroSection settings={siteSettings} />
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
