import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { PATHS } from '../../app/routes';
import { FaPhone } from 'react-icons/fa';
import config from '../../config/config';
import { useLanguage } from '../../context/LanguageContext';

const ContactCTA = ({ id, className = '', title, subtitle, primary = {} }) => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const location = useLocation();

    const onPrimary = () => {
        // If primary.href is provided and is an in-page anchor, prefer scrolling to the
        // ContactSection on the HOME route. If we're not on HOME, navigate there with
        // a `state.scrollTo` so the central ScrollHandler will scroll after navigation.
        if (primary.href) {
            if (primary.href.startsWith('#')) {
                const target = primary.href.replace(/^#/, '');
                if (location && location.pathname === PATHS.HOME) {
                    try {
                        scroller.scrollTo(target, { smooth: true, duration: 600, offset: -80 });
                        return;
                    } catch (e) {
                        const el = document.getElementById(target) || document.getElementsByName(target)[0];
                        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        return;
                    }
                }

                // Not on HOME — navigate there and let ScrollHandler do the scroll.
                navigate(PATHS.HOME, { state: { scrollTo: target } });
                return;
            }

            // external or internal route
            try {
                navigate(primary.href);
                return;
            } catch (e) {
                window.location.href = primary.href;
                return;
            }
        }

        // Default: navigate to home and open contact section
        if (location && location.pathname === PATHS.HOME) {
            try { scroller.scrollTo('contact', { smooth: true, duration: 600, offset: -80 }); } catch (e) {
                const el = document.getElementById('contact') || document.getElementsByName('contact')[0];
                if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }

        navigate(PATHS.HOME, { state: { scrollTo: 'contact' } });
    };

    return (
        <div id={id} className={`${className} mt-8`}>
            <div className="relative z-20 mx-auto w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-10 sm:p-12 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {title || t('services.ctaTitle') || 'Ready to start a project?'}
                </h3>
                {subtitle && (
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                        {subtitle}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                    <button
                        onClick={onPrimary}
                        className="px-5 py-3 rounded-lg bg-gradient-to-r from-brand to-brand-secondary text-white font-semibold shadow-md hover:brightness-95 transition-colors inline-flex items-center gap-2"
                    >
                        {primary.label || t('cta.getStarted') || 'Get Started'}
                    </button>

                    <a
                        href={`tel:${config.contact.phone.replace(/\s+/g, '')}`}
                        className="px-5 py-3 rounded-lg border border-brand text-brand-dark hover:bg-brand-secondary transition-colors inline-flex items-center gap-2"
                    >
                        <FaPhone className="text-base" />
                        <span className="ml-2">{primary.callLabel || t('cta.callUs') || 'Call Us'}</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactCTA;
