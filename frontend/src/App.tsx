import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { PageLoader } from './components/ui/Skeleton';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useEffect } from 'react';

// Public Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
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

  return (
    <>
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
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Route>

            {/* Admin Dashboard — Protected (admin only) */}
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="projects/:id" element={<AdminProjectDetail />} />
              <Route path="invoices" element={<AdminInvoices />} />
              <Route path="leads" element={<AdminPlaceholder />} />
              <Route path="services" element={<AdminPlaceholder />} />
              <Route path="portfolio" element={<AdminPlaceholder />} />
              <Route path="blog" element={<AdminPlaceholder />} />
              <Route path="testimonials" element={<AdminPlaceholder />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="pricing" element={<AdminPlaceholder />} />
              <Route path="analytics" element={<AdminPlaceholder />} />
              <Route path="settings" element={<AdminPlaceholder />} />
            </Route>

            {/* Client Dashboard — Protected (client only) */}
            <Route path="/dashboard" element={<ProtectedRoute role="client"><ClientLayout /></ProtectedRoute>}>
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
    </>
  );
}
