import { lazy, Suspense } from 'react';
import SEOHead from '@/components/ui/SEOHead';
import HeroSection from '@/components/home/HeroSection';
import { PageLoader } from '@/components/ui/Skeleton';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const ServicesSection = lazy(() => import('@/components/home/ServicesSection'));
const WhyChooseUsSection = lazy(() => import('@/components/home/WhyChooseUsSection'));
const ProcessSection = lazy(() => import('@/components/home/ProcessSection'));
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection'));
const PricingSection = lazy(() => import('@/components/home/PricingSection'));
const CTASection = lazy(() => import('@/components/home/CTASection'));

export default function HomePage() {
    const { data: siteSettings, isLoading: settingsLoading } = useQuery({
        queryKey: ['cms-settings'],
        queryFn: async () => {
            const { data } = await api.get('/cms/settings', {
                // Prevent HTTP-level caching so admin changes are always reflected
                headers: { 'Cache-Control': 'no-cache' },
            });
            return data.data;
        },
        // staleTime: 0 — immediately refetch on every mount so admin changes
        // appear on the public homepage without a Vercel rebuild.
        staleTime: 0,
        // Keep previous data visible while revalidating (no flicker)
        placeholderData: (prev) => prev,
    });

    return (
        <>
            <SEOHead
                title={siteSettings?.seoTitle || 'Home'}
                description={
                    siteSettings?.seoDescription ||
                    'Scalax Labs is a premier digital marketing agency delivering innovative solutions in web development, SEO, social media marketing, and more. Transform your digital presence today.'
                }
                keywords="digital marketing agency, web development, SEO, social media marketing, branding"
                canonical="/"
            />
            {/* Pass both the settings data AND the loading state so HeroSection
                can show inline skeleton loaders instead of a blank flash */}
            <HeroSection settings={siteSettings} isLoading={settingsLoading} />
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
