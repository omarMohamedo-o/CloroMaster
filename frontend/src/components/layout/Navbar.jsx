import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATHS } from '../../app/routes';
import { scroller } from 'react-scroll';
import { FaMoon, FaSearch } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { useSearch } from '../../context/SearchContext';

export default function Navbar({ darkMode, toggleDark }) {
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

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur z-50 border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-6 py-3 h-24 overflow-hidden flex items-center justify-center">
                {/* center - logo */}
                <div className="flex items-center justify-center h-full absolute left-6">
                    <button onClick={() => goHome()} aria-label="Home" className="hidden sm:inline p-0 bg-transparent border-0 -my-4">
                        <img src="/images/chloromaster-logo.png" alt="ChloroMaster" className="w-[160px] md:w-[200px] lg:w-[240px] h-[160px] md:h-[200px] lg:h-[240px] object-contain block" />
                    </button>
                </div>

                {/* center - navigation links */}
                <nav dir={language === 'ar' ? 'rtl' : 'ltr'} className="flex items-center justify-center gap-6">
                    <button onClick={() => goHome()} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t('nav.home')}</button>
                    <button onClick={() => goHome('services')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t('nav.services')}</button>
                    <button onClick={() => goHome('about')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t('nav.about')}</button>
                    <button onClick={() => goHome('clients')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t('nav.clients')}</button>
                    <button onClick={() => goHome('faq')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t('nav.faq')}</button>
                    <button onClick={() => goHome('contact')} className="text-sm text-gray-700 dark:text-gray-200 hover:text-brand transition-colors">{t('nav.contact')}</button>
                </nav>

                {/* right - actions */}
                <div className="flex items-center absolute right-6">
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
            </div>
        </header>
    );
}
