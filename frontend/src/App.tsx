import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { PageLoader } from './components/ui/Skeleton';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// Public Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const BookConsultationPage = lazy(() => import('./pages/BookConsultationPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

// Auth Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminClients = lazy(() => import('./pages/admin/AdminClients'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminProjectDetail = lazy(() => import('./pages/admin/AdminProjectDetail'));
const AdminInvoices = lazy(() => import('./pages/admin/AdminInvoices'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminPortfolio = lazy(() => import('./pages/admin/AdminPortfolio'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminPricing = lazy(() => import('./pages/admin/AdminPricing'));
const AdminEmailManagement = lazy(() => import('./pages/admin/AdminEmailManagement'));
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));

// Client Dashboard Pages
const ClientLayout = lazy(() => import('./pages/dashboard/ClientLayout'));
const ClientDashboard = lazy(() => import('./pages/dashboard/ClientDashboard'));
const ClientProjects = lazy(() => import('./pages/dashboard/ClientProjects'));
const ClientProjectDetail = lazy(() => import('./pages/dashboard/ClientProjectDetail'));
const ClientInvoices = lazy(() => import('./pages/dashboard/ClientInvoices'));
const ClientMessages = lazy(() => import('./pages/dashboard/ClientMessages'));
const ClientBookings = lazy(() => import('./pages/dashboard/ClientBookings'));
const ClientNotifications = lazy(() => import('./pages/dashboard/ClientNotifications'));
const ClientSettings = lazy(() => import('./pages/dashboard/ClientSettings'));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout with Navbar + Footer
function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// Auth layout (no navbar/footer)
function AuthLayout() {
  return <Outlet />;
}

// Placeholder for unbuilt admin sub-pages
function AdminPlaceholder() {
  const { pathname } = useLocation();
  const section = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Section';
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📋</span>
      </div>
      <h2 className="text-xl font-heading font-bold text-dark-900 capitalize mb-2">{section}</h2>
      <p className="text-dark-400">This module is ready for backend integration. Connect your API endpoints to activate.</p>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  const { data: settings } = useQuery({
    queryKey: ['cms-settings'],
    queryFn: async () => {
      const { data } = await api.get('/cms/settings');
      return data.data;
    },
  });

  useEffect(() => {
    if (settings?.theme) {
      document.documentElement.style.setProperty('--color-primary', settings.theme.primaryColor || '#9333ea');
      document.documentElement.style.setProperty('--color-secondary', settings.theme.secondaryColor || '#4f46e5');
      document.documentElement.style.setProperty('--color-accent-text', settings.theme.accentTextColor || '#9333ea');
    }
  }, [settings]);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            {/* Public Pages */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/book-consultation" element={<BookConsultationPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Route>

            {/* Auth Pages (no navbar/footer) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Route>

            {/* Admin Dashboard — Protected (admin only) */}
            <Route path="/admin" element={<ProtectedRoute role="admin"><ErrorBoundary><AdminLayout /></ErrorBoundary></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="projects/:id" element={<AdminProjectDetail />} />
              <Route path="invoices" element={<AdminInvoices />} />
              <Route path="leads" element={<AdminPlaceholder />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="newsletter" element={<AdminEmailManagement />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="analytics" element={<AdminDashboard />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Client Dashboard — Protected (client only) */}
            <Route path="/dashboard" element={<ProtectedRoute role="client"><ErrorBoundary><ClientLayout /></ErrorBoundary></ProtectedRoute>}>
              <Route index element={<ClientDashboard />} />
              <Route path="projects" element={<ClientProjects />} />
              <Route path="projects/:id" element={<ClientProjectDetail />} />
              <Route path="invoices" element={<ClientInvoices />} />
              <Route path="messages" element={<ClientMessages />} />
              <Route path="meetings" element={<ClientBookings />} />
              <Route path="notifications" element={<ClientNotifications />} />
              <Route path="settings" element={<ClientSettings />} />
            </Route>

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-white">
                  <div className="text-center">
                    <h1 className="text-8xl font-heading font-bold gradient-text mb-4">404</h1>
                    <p className="text-xl text-dark-500 mb-8">Page not found</p>
                    <a href="/" className="btn-primary">Go Home</a>
                  </div>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </ErrorBoundary>
  );
}
