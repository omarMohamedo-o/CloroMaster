import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { FaMoon, FaGlobe } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar({ darkMode, toggleDark }) {
    const { t, toggleLanguage, language } = useLanguage();
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
            if (typeof scrollTo === 'string') navigate('/', { state: { scrollTo } }); else navigate('/');
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur z-50 border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-6 py-3 grid grid-cols-3 items-center">
                {/* left - logo/brand (kept for spacing) */}
                <div className="flex items-center">
                    <button onClick={() => goHome()} aria-label="Home" className="hidden sm:inline p-0 bg-transparent border-0">
                        <img src="/images/chloromaster-logo.png" alt="ChloroMaster" className="w-12 h-12 object-contain block" />
                    </button>
                </div>

                {/* center - navigation links */}
                <nav className="flex items-center justify-center space-x-8">
                    <button onClick={() => goHome()} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t ? t('nav.home') : 'Home'}</button>
                    <button onClick={() => goHome('services')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t ? t('nav.services') : 'Services'}</button>
                    <button onClick={() => goHome('about')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t ? t('nav.about') : 'About'}</button>
                    <button onClick={() => goHome('clients')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t ? t('nav.clients') : 'Clients'}</button>
                    <button onClick={() => goHome('faq')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t ? t('nav.faq') : 'FAQ'}</button>
                    <button onClick={() => goHome('contact')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t ? t('nav.contact') : 'Contact'}</button>
                </nav>

                {/* right - actions */}
                <div className="flex items-center justify-end">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleLanguage}
                            aria-pressed={language === 'ar'}
                            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm hover:shadow transition-colors"
                            title={language === 'en' ? (t ? t('nav.switchToArabic') : 'Switch to Arabic') : (t ? t('nav.switchToEnglish') : 'Switch to English')}
                        >
                            {/* show target language code (when on EN show AR, and vice-versa) */}
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{language === 'en' ? 'AR' : 'EN'}</span>
                        </button>

                        <button
                            onClick={toggleDark}
                            aria-pressed={darkMode}
                            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm hover:shadow transition-colors"
                            title={darkMode ? 'Switch to light' : 'Switch to dark'}
                        >
                            <FaMoon className="text-gray-600 dark:text-gray-200" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
