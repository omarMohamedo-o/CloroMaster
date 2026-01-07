import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATHS } from '../../app/routes';
import { scroller } from 'react-scroll';
import { FaMoon, FaSearch } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { useSearch } from '../../context/SearchContext';
import OptimizedImage from '../common/OptimizedImage';

export default function Navbar({ darkMode, toggleDark }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { t, toggleLanguage, language } = useLanguage();
    const { openSearch } = useSearch();
    const navigate = useNavigate();
    const location = useLocation();

    const goHome = (scrollTo) => {
        // If already on home, scroll directly. Otherwise navigate and let ScrollToState handle it.
        if (location && location.pathname === '/') {
            if (typeof scrollTo === 'string') {
                setTimeout(() => scroller.scrollTo(scrollTo, { smooth: true, duration: 600, offset: -80 }), 50);
            } else {
                // scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            if (typeof scrollTo === 'string') navigate(PATHS.HOME, { state: { scrollTo } }); else navigate(PATHS.HOME);
        }
    };

    // close mobile menu on route change
    useEffect(() => {
        // avoid calling setState synchronously inside effect body to satisfy lint rules
        // close the mobile menu on route change — only run when pathname changes
        const id = setTimeout(() => setMobileOpen(false), 0);
        return () => clearTimeout(id);
    }, [location.pathname]);

    // helper to navigate from mobile menu and close it
    const mobileNavigate = (scrollTo) => {
        setMobileOpen(false);
        goHome(scrollTo);
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur z-50 border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-6 py-3 h-24 overflow-hidden flex items-center justify-center">
                {/* center - logo */}
                <div className="flex items-center justify-center h-full absolute left-6 z-50">
                    <button onClick={() => goHome()} aria-label="Home" className="p-0 bg-transparent border-0 -my-4 inline-flex items-center">
                        <OptimizedImage src="/images/chloromaster-logo.png" alt="ChloroMaster" className="w-[220px] h-auto object-contain block" />
                    </button>
                </div>

                {/* center - navigation links (hidden on small screens) */}
                <nav dir={language === 'ar' ? 'rtl' : 'ltr'} className="hidden sm:flex items-center justify-center gap-6">
                    <button onClick={() => goHome()} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t('nav.home')}</button>
                    <button onClick={() => goHome('services')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t('nav.services')}</button>
                    <button onClick={() => goHome('about')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t('nav.about')}</button>
                    <button onClick={() => goHome('clients')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t('nav.clients')}</button>
                    <button onClick={() => goHome('faq')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t('nav.faq')}</button>
                    <button onClick={() => goHome('contact')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t('nav.contact')}</button>
                </nav>

                {/* right - actions (hidden on small screens; mobile uses hamburger) */}
                <div className="hidden sm:flex items-center absolute right-6">
                    {/* keep control icons in the same visual order regardless of page direction */}
                    <div className="flex items-center gap-3" dir="ltr" style={{ direction: 'ltr' }}>
                        <button
                            onClick={() => openSearch()}
                            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm hover:shadow transition-colors"
                            title={t('hero.search') || 'Search'}
                            aria-label={t('hero.search') || 'Search'}
                        >
                            <FaSearch className="text-gray-600 dark:text-gray-200" />
                        </button>

                        <button
                            onClick={toggleLanguage}
                            aria-pressed={language === 'ar'}
                            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm hover:shadow transition-colors"
                            title={language === 'en' ? t('nav.switchToArabic') : t('nav.switchToEnglish')}
                        >
                            {/* show target language code (when on EN show AR, and vice-versa) */}
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{language === 'en' ? 'AR' : 'EN'}</span>
                        </button>

                        <button
                            onClick={toggleDark}
                            aria-pressed={darkMode}
                            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm hover:shadow transition-colors"
                            title={darkMode ? t('common_ui.switchToLight') : t('common_ui.switchToDark')}
                        >
                            <FaMoon className="text-gray-600 dark:text-gray-200" />
                        </button>
                    </div>
                </div>

                {/* mobile menu button (visible on small screens) - move to right so logo stays on left */}
                <div className="absolute right-6 sm:hidden z-50">
                    <button
                        aria-expanded={mobileOpen}
                        aria-label={mobileOpen ? t('common_ui.close') || 'Close menu' : t('common_ui.open') || 'Open menu'}
                        onClick={() => setMobileOpen(v => !v)}
                        className="w-10 h-10 flex flex-col items-center justify-center gap-1"
                    >
                        <span className={`block w-6 h-0.5 bg-gray-700 dark:bg-gray-200 transform transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-200 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
                        <span className={`block w-6 h-0.5 bg-gray-700 dark:bg-gray-200 transform transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                    </button>
                </div>

                {/* mobile menu panel */}
                {mobileOpen && (
                    <div className="sm:hidden absolute left-0 right-0 top-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-40">
                        <div className="container mx-auto px-6 py-4">
                            <div className="flex flex-col gap-3">
                                <button onClick={() => mobileNavigate()} className="text-left text-base text-gray-800 dark:text-gray-200 py-4 border-b border-gray-100">{t('nav.home')}</button>
                                <button onClick={() => mobileNavigate('services')} className="text-left text-base text-gray-800 dark:text-gray-200 py-4 border-b border-gray-100">{t('nav.services')}</button>
                                <button onClick={() => mobileNavigate('about')} className="text-left text-base text-gray-800 dark:text-gray-200 py-4 border-b border-gray-100">{t('nav.about')}</button>
                                <button onClick={() => mobileNavigate('clients')} className="text-left text-base text-gray-800 dark:text-gray-200 py-4 border-b border-gray-100">{t('nav.clients')}</button>
                                <button onClick={() => mobileNavigate('faq')} className="text-left text-base text-gray-800 dark:text-gray-200 py-4 border-b border-gray-100">{t('nav.faq')}</button>
                                <button onClick={() => mobileNavigate('contact')} className="text-left text-base text-gray-800 dark:text-gray-200 py-4">{t('nav.contact')}</button>
                                <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => { setMobileOpen(false); openSearch(); }} className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm"> <FaSearch className="text-gray-600 dark:text-gray-200" /></button>
                                        <button onClick={() => { setMobileOpen(false); toggleLanguage(); }} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">{language === 'en' ? 'AR' : 'EN'}</button>
                                        <button onClick={() => { setMobileOpen(false); toggleDark(); }} className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"> <FaMoon className="text-gray-600 dark:text-gray-200" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
