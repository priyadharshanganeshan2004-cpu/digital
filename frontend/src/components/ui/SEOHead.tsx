import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '@/lib/constants';

interface SEOHeadProps {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    canonical?: string;
    type?: string;
}

export default function SEOHead({
    title,
    description,
    keywords,
    ogImage = '/og-image.png',
    canonical,
    type = 'website',
}: SEOHeadProps) {
    const fullTitle = `${title} | ${APP_NAME}`;
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://Scalax Labs.com';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:image" content={`${siteUrl}${ogImage}`} />
            {canonical && <meta property="og:url" content={`${siteUrl}${canonical}`} />}
            <meta property="og:site_name" content={APP_NAME} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: APP_NAME,
                    url: siteUrl,
                    logo: `${siteUrl}/logo.png`,
                    description: description,
                    sameAs: [
                        'https://facebook.com/Scalax Labs',
                        'https://twitter.com/Scalax Labs',
                        'https://linkedin.com/company/Scalax Labs',
                        'https://instagram.com/Scalax Labs',
                    ],
                })}
            </script>
        </Helmet>
    );
}

