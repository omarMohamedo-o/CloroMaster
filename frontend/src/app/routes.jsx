import React, { Suspense, lazy } from 'react';
import Navbar from '../components/layout/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';

// Footer is somewhat heavier so lazy-load it to keep initial bundle small
const Footer = lazy(() => import('../components/layout/Footer'));

export function HeaderFooterLayout({ children, headerProps }) {
    return (
        <div className="transition-colors duration-300 min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Navbar {...(headerProps || {})} />
            <main className="flex-grow block pt-20">
                {children}
            </main>
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default HeaderFooterLayout;

// Centralized route patterns and helpers
export const PATHS = {
    HOME: '/',
    // Convenience contact path — redirects to HOME and triggers scroll-to
    CONTACT: '/contact',
    SERVICE_PATTERN: '/service/:serviceId',
    SERVICE: (id) => `/service/${id}`,
    EQUIPMENT_PATTERN: '/equipment/:slug',
    EQUIPMENT: (slug) => `/equipment/${slug}`,
    VIDEOS: '/videos',
    PRIVACY: '/privacy',
    TERMS: '/terms',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_SUBMISSIONS: '/admin/submissions',
    ADMIN_SUBMISSION_DETAIL_PATTERN: '/admin/submissions/:id',
    ADMIN_SUBMISSION_DETAIL: (id) => `/admin/submissions/${id}`,
};

// Lazy-loaded page components for route mapping. Keep them here so all routes live in one place.
const Hero = lazy(() => import('../components/common/Hero'));
const ServicesGrid = lazy(() => import('../components/common/ServicesGrid'));
const About = lazy(() => import('../pages/About'));
const Clients = lazy(() => import('../pages/Clients'));
const FAQ = lazy(() => import('../pages/FAQ'));
const ContactSection = lazy(() => import('../components/common/ContactSection'));
const ServiceDetail = lazy(() => import('../pages/services/ServiceDetail'));
const EquipmentDetail = lazy(() => import('../pages/equipment/EquipmentDetail'));
const Videos = lazy(() => import('../pages/Videos'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const SubmissionsList = lazy(() => import('../pages/admin/SubmissionsList'));
const SubmissionDetail = lazy(() => import('../pages/admin/SubmissionDetail'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../pages/TermsOfService'));

function HomePage() {
    return (
        <>
            <Hero />
            <ServicesGrid />
            <About />
            <Clients />
            <FAQ />
            <ContactSection />
        </>
    );
}

export function AppRoutes({ fallback = null }) {
    return (
        <Suspense fallback={fallback}>
            <Routes>
                <Route path={PATHS.HOME} element={<HomePage />} />
                {/* Support direct /contact URL by redirecting to home and asking ScrollHandler to open contact */}
                <Route path={PATHS.CONTACT} element={<Navigate to={PATHS.HOME} replace state={{ scrollTo: 'contact' }} />} />
                <Route path={PATHS.SERVICE_PATTERN} element={<ServiceDetail />} />
                <Route path={PATHS.EQUIPMENT_PATTERN} element={<EquipmentDetail />} />
                <Route path={PATHS.VIDEOS} element={<Videos />} />
                <Route path={PATHS.PRIVACY} element={<PrivacyPolicy />} />
                <Route path={PATHS.TERMS} element={<TermsOfService />} />
                <Route path={PATHS.ADMIN_LOGIN} element={<AdminLogin />} />
                <Route path={PATHS.ADMIN_DASHBOARD} element={<AdminDashboard />} />
                <Route path={PATHS.ADMIN_SUBMISSIONS} element={<SubmissionsList />} />
                <Route path={PATHS.ADMIN_SUBMISSION_DETAIL_PATTERN} element={<SubmissionDetail />} />
            </Routes>
        </Suspense>
    );
}
