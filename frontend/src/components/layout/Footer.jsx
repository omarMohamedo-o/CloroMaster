import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaFacebookF, FaInstagram, FaTwitter, FaArrowUp, FaWhatsapp, FaPhone } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { footerVariant } from '../../lib/animations';
import formatPhoneForDisplay from '../../lib/formatPhone';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../app/routes';
import { scroller } from 'react-scroll';
import config from '../../config/config';
import { useLanguage } from '../../context/LanguageContext';
import OptimizedImage from '../common/OptimizedImage';

export default function Footer() {
    const { t, language } = useLanguage();
    const isRTL = typeof language === 'string' && language.toLowerCase().startsWith('ar');
    const navigate = useNavigate();
    // Show the scroll-top control only after the user scrolls down a bit.
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Scroll-to-top - simple and direct
    const scrollTop = () => {
        // prefer a smooth scroll and do not immediately mutate scrollTop
        // as that can cancel the animation in some browsers
        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
            // fallback
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }
    };

    useEffect(() => {
        const listenerOptions = { passive: true };
        const docListenerOptions = { passive: true, capture: true };

        const container = document.querySelector('main') || document.querySelector('#cm-page-wrapper') || document.querySelector('.cm-subpage') || document.scrollingElement || window;

        const getContainerScroll = () => {
            try {
                if (!container || container === window) return 0;
                return container.scrollTop || 0;
            } catch (e) {
                return 0;
            }
        };

        const getWindowScroll = () => Math.max(window.pageYOffset || 0, window.scrollY || 0, document.documentElement?.scrollTop || 0, document.body?.scrollTop || 0);

        const handleScroll = () => {
            // Take the maximum of window scroll and container scroll to cover all cases
            const scrollY = Math.max(getWindowScroll(), getContainerScroll());
            setShowScrollTop(scrollY > 20);
        };

        // Attach listener to the main scroll container (if any) and fallback to window/document
        try {
            if (container && container.addEventListener && container !== window) {
                container.addEventListener('scroll', handleScroll, listenerOptions);
            }
        } catch (e) { /* ignore */ }
        // Always attach to window/document as well to catch global scrolls
        window.addEventListener('scroll', handleScroll, listenerOptions);
        document.addEventListener('scroll', handleScroll, docListenerOptions);

        // Also run on load and a couple of delayed ticks to catch layout shifts and lazy images
        window.addEventListener('load', handleScroll, listenerOptions);
        handleScroll();
        const retry1 = setTimeout(handleScroll, 50);
        const retry2 = setTimeout(handleScroll, 500);
        const interval = setInterval(handleScroll, 250);

        return () => {
            try {
                if (container && container.removeEventListener && container !== window) container.removeEventListener('scroll', handleScroll);
            } catch (e) { /* ignore */ }
            window.removeEventListener('scroll', handleScroll, listenerOptions);
            document.removeEventListener('scroll', handleScroll, docListenerOptions);
            window.removeEventListener('load', handleScroll, listenerOptions);
            clearTimeout(retry1);
            clearTimeout(retry2);
            clearInterval(interval);
        };
    }, []);

    const goHome = (scrollTo) => {
        if (window.location.pathname === PATHS.HOME) {
            // already on home - use react-scroll scroller if available, else fallback to element scrolling
            setTimeout(() => {
                try {
                    if (typeof scrollTo === 'string' && scrollTo) {
                        scroller.scrollTo(scrollTo, { smooth: true, duration: 600, offset: -80 });
                        return;
                    }
                } catch (e) {
                    // ignore and fallback
                }

                const el = document.getElementById(scrollTo) || document.getElementsByName(scrollTo)[0];
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 50);
        } else {
            navigate(PATHS.HOME, { state: { scrollTo } });
        }
    };

    return (
        <motion.footer className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={footerVariant}
        >
            <div className="container mx-auto px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo & description */}
                    <div>
                        <div className="flex items-start justify-start mb-3">
                            <button onClick={() => goHome()} aria-label="Home" className="p-0 bg-transparent border-0 cursor-pointer">
                                <OptimizedImage src="/images/chloromaster-logo.png" alt={config.app.name} className="w-[120px] md:w-[140px] lg:w-[160px] h-auto object-contain" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('footer.description')}</p>

                        <div className="flex items-center gap-3">
                            <a className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm text-gray-700 hover:text-brand transition-colors" href={`https://wa.me/${config.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="whatsapp"><FaWhatsapp /></a>
                            <a className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm text-gray-700 hover:text-brand transition-colors" href="#" aria-label="linkedin"><FaLinkedin /></a>
                            <a className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm text-gray-700 hover:text-brand transition-colors" href="#" aria-label="facebook"><FaFacebookF /></a>
                            <a className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm text-gray-700 hover:text-brand transition-colors" href="#" aria-label="instagram"><FaInstagram /></a>
                            <a className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm text-gray-700 hover:text-brand transition-colors" href="#" aria-label="twitter"><FaTwitter /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-brand-medium font-semibold mb-3">{t('footer.quickLinks')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><button onClick={() => goHome()} className="hover:underline">{t('nav.home')}</button></li>
                            <li><button onClick={() => goHome('services')} className="hover:underline">{t('nav.services')}</button></li>
                            <li><button onClick={() => goHome('about')} className="hover:underline">{t('nav.about')}</button></li>
                            <li><button onClick={() => goHome('faq')} className="hover:underline">{t('nav.faq')}</button></li>
                            <li><button onClick={() => goHome('contact')} className="hover:underline">{t('nav.contact')}</button></li>
                        </ul>
                    </div>

                    {/* Contact info */}
                    <div>
                        <h4 className="text-brand-medium font-semibold mb-3">{t('footer.contactInfo')}</h4>
                        <div className="text-sm space-y-2">
                            <div>{config.contact.address}</div>
                            <div className="space-y-2">
                                <a href={`tel:${formatPhoneForDisplay(config.contact.phone).replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:underline">
                                    <FaPhone className="text-brand" />
                                    <span dir="ltr">{formatPhoneForDisplay(config.contact.phone)}</span>
                                </a>
                                <a href={`https://wa.me/${config.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                                    <FaWhatsapp className="text-brand" />
                                    <span dir="ltr">{formatPhoneForDisplay(config.contact.phone2)}</span>
                                </a>
                            </div>
                            <div><a className="hover:underline" href={`mailto:${config.contact.email}`}>{config.contact.email}</a></div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                        <div className="text-sm">{t('footer.copyright')}</div>

                        <div className="flex items-center gap-6">
                            <a href={PATHS.PRIVACY} className="text-sm hover:underline">{t('footer.privacy')}</a>
                            <a href={PATHS.TERMS} className="text-sm hover:underline">{t('footer.terms')}</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating scroll-to-top button recreated with robust detection */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.16 }}
                        className={isRTL ? 'fixed left-4 bottom-4 z-[100]' : 'fixed right-4 bottom-4 z-[100]'}
                    >
                        <button
                            onClick={scrollTop}
                            aria-label="scroll to top"
                            title={t('common_ui.scrollTop') || 'Back to top'}
                            className="w-10 h-10 rounded-lg bg-brand hover:bg-brand-medium text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                        >
                            <FaArrowUp className="text-sm" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.footer>
    );
}

