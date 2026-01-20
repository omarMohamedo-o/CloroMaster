import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
// AOS removed in favor of centralized framer-motion variants

import { HeaderFooterLayout, AppRoutes } from './routes';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { SearchProvider } from '../context/SearchContext';
const SearchModal = lazy(() => import('../components/search/SearchModal'));

function LoadingFallback() {
    // Always call hooks at the top level
    const { t } = useLanguage();
    return (
        <div className="h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <img src="/images/chloromaster-logo.png" alt="ChloroMaster" className="w-48 md:w-64 mx-auto mb-6 object-contain float-slow" />
                <span className="sr-only" aria-live="polite">{t('common.loading')}</span>
            </div>
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

    // HomePage and other route elements are provided via AppRoutes (centralized in ./routes)

    // Component that handles scroll behavior on route changes.
    // - If `location.state.scrollTo` is provided (used by in-app anchors), scroll to that target.
    // - If a hash is present in the URL, scroll to the element with that id.
    // - Otherwise scroll to the top of the page.
    function ScrollHandler() {
        const location = useLocation();
        const { pathname, hash, state } = location || {};

        useEffect(() => {
            // If navigating to home with a scrollTo state, use the react-scroll scroller (keeps smooth offset behavior)
            if (pathname === '/' && state && state.scrollTo) {
                const target = state.scrollTo;
                setTimeout(() => {
                    scroller.scrollTo(target, { smooth: true, duration: 600, offset: -80 });
                    try { window.history.replaceState({}, document.title, '/'); } catch (e) { /* ignore */ }
                }, 60);
                return;
            }

            // If URL contains a hash (#anchor), try to scroll to the element with that id.
            if (hash) {
                const id = hash.replace(/^#/, '');
                setTimeout(() => {
                    const el = document.getElementById(id);
                    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 80);
                return;
            }

            // Default: scroll to top immediately
            try {
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            } catch (e) {
                /* ignore */
            }
        }, [pathname, hash, state]);

        return null;
    }

    return (
        <LanguageProvider>
            <SearchProvider>
                <Router>
                    <ScrollHandler />
                    <HeaderFooterLayout headerProps={{ darkMode: dark, toggleDark }}>
                        <AppRoutes fallback={<LoadingFallback />} />
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
