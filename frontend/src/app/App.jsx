import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { HeaderFooterLayout } from './routes';
import Hero from '../components/common/Hero';
const ServicesGrid = lazy(() => import('../components/common/ServicesGrid'));
const About = lazy(() => import('../pages/About'));
const Clients = lazy(() => import('../pages/Clients'));
const FAQ = lazy(() => import('../pages/FAQ'));
const ContactForm = lazy(() => import('../components/common/ContactForm'));
const ContactSection = lazy(() => import('../components/common/ContactSection'));
const Footer = lazy(() => import('../components/layout/Footer'));
const ServiceDetail = lazy(() => import('../pages/services/ServiceDetail'));
const EquipmentDetail = lazy(() => import('../pages/equipment/EquipmentDetail'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const SubmissionsList = lazy(() => import('../pages/admin/SubmissionsList'));
const SubmissionDetail = lazy(() => import('../pages/admin/SubmissionDetail'));
import { LanguageProvider, useLanguage } from '../context/LanguageContext';

function LoadingFallback() {
    // This component is rendered inside LanguageProvider so useLanguage will be available.
    try {
        const { t } = useLanguage();
        return (
            <div className="h-screen flex items-center justify-center"><div className="text-brand text-xl">{t('common.loading')}</div></div>
        );
    } catch (e) {
        return (
            <div className="h-screen flex items-center justify-center"><div className="text-brand text-xl">Loading...</div></div>
        );
    }
}

export default function App() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        if (dark) root.classList.add('dark'); else root.classList.remove('dark');
    }, [dark]);

    // Initialize AOS with smooth UX-focused settings
    useEffect(() => {
        AOS.init({
            duration: 700,           // Standard duration for smooth feel
            easing: 'ease-out',      // Natural easing
            once: true,              // Animate only once
            offset: 100,             // Trigger 100px before element in view
            delay: 0,                // No global delay
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches, // Respect user preferences
        });
    }, []);

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
            <Router>
                <ScrollToState />
                <HeaderFooterLayout headerProps={{ darkMode: dark, toggleDark }}>
                    <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/service/:serviceId" element={<ServiceDetail />} />
                            <Route path="/equipment/:slug" element={<EquipmentDetail />} />
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/submissions" element={<SubmissionsList />} />
                            <Route path="/admin/submissions/:id" element={<SubmissionDetail />} />
                        </Routes>
                    </Suspense>
                </HeaderFooterLayout>
            </Router>
        </LanguageProvider>
    );
}
