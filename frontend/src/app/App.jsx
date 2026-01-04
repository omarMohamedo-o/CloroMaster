import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
// AOS removed in favor of centralized framer-motion variants

import { HeaderFooterLayout, PATHS } from './routes';
import Hero from '../components/common/Hero';
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
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { SearchProvider } from '../context/SearchContext';
const SearchModal = lazy(() => import('../components/search/SearchModal'));

function LoadingFallback() {
    // Always call hooks at the top level
    const { t } = useLanguage();
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="text-brand text-xl">{t('common.loading')}</div>
        </div>
    );
}

export default function App() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        if (dark) root.classList.add('dark'); else root.classList.remove('dark');
    }, [dark]);

    // AOS removed — animations are centralized via framer-motion variants

    const toggleDark = () => setDark(d => !d);

    const HomePage = () => (
        <>
            <Hero />
            <Suspense fallback={<LoadingFallback />}>
                <ServicesGrid />
                <About />
                <Clients />
                <FAQ />
                <ContactSection />
            </Suspense>
        </>
    );

    // Component that listens for navigation state and scrolls to the requested section
    function ScrollToState() {
        const location = useLocation();

        useEffect(() => {
            if (location && location.pathname === '/' && location.state && location.state.scrollTo) {
                const target = location.state.scrollTo;
                // small timeout to ensure mounted content is present
                setTimeout(() => {
                    scroller.scrollTo(target, { smooth: true, duration: 600, offset: -80 });
                    // clear history state so subsequent navigations aren't affected
                    try { window.history.replaceState({}, document.title, '/'); } catch (e) { /* ignore */ }
                }, 50);
            }
        }, [location]);

        return null;
    }

    return (
        <LanguageProvider>
            <SearchProvider>
                <Router>
                    <ScrollToState />
                    <HeaderFooterLayout headerProps={{ darkMode: dark, toggleDark }}>
                        <Suspense fallback={<LoadingFallback />}>
                            <Routes>
                                <Route path={PATHS.HOME} element={<HomePage />} />
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
                        {/* Search Modal */}
                        <Suspense fallback={null}>
                            <SearchModal />
                        </Suspense>
                    </HeaderFooterLayout>
                </Router>
            </SearchProvider>
        </LanguageProvider>
    );
}
