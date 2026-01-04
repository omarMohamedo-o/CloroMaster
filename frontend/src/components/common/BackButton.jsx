import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import resolveParentPath from '../../lib/backNavigation';
import { PATHS } from '../../app/routes';
import { ensureExitStyle, triggerExitAndNavigate } from '../../lib/exitAnimation';

export default function BackButton({ className = 'mb-8' }) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const { t, language } = useLanguage();
    const isRTL = typeof language === 'string' && language.toLowerCase().startsWith('ar');

    const handleClick = (e) => {
        e && e.preventDefault && e.preventDefault();

        // determine parent route using centralized resolver
        const parent = resolveParentPath({ pathname: location.pathname, params }) || PATHS.HOME;
        // ensure the animation CSS exists and trigger exit animation + navigate
        ensureExitStyle();
        triggerExitAndNavigate(navigate, parent);
    };

    return (
        <div className={`py-4 ${className}`}>
            <div className="relative inline-block group">
                <span className="absolute -inset-1 rounded-full bg-brand/10 backdrop-blur-sm opacity-0 transform scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 pointer-events-none shadow-lg" aria-hidden="true" />
                <button
                    data-back-button="true"
                    onClick={handleClick}
                    className="relative z-10 inline-flex items-center gap-3 text-brand hover:text-brand-secondary bg-transparent border-0 px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-md"
                >
                    {isRTL ? (
                        <>
                            <span className="text-sm font-medium text-brand">{t('common_ui.back') || 'Back'}</span>
                            <FaArrowRight className="text-brand text-base" />
                        </>
                    ) : (
                        <>
                            <FaArrowLeft className="text-brand text-base" />
                            <span className="text-sm font-medium text-brand">{t('common_ui.back') || 'Back'}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
