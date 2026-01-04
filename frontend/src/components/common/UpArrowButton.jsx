import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import resolveParentPath from '../../lib/backNavigation';
import { PATHS } from '../../app/routes';
import { ensureExitStyle, triggerExitAndNavigate } from '../../lib/exitAnimation';

export default function UpArrowButton({ parentRoute = null, className = '' }) {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const { language, t } = useLanguage();
    const isRTL = typeof language === 'string' && language.toLowerCase().startsWith('ar');

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            setShow(scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    const handleClick = (e) => {
        e && e.preventDefault && e.preventDefault();

        // determine parent route using resolver unless parentRoute prop supplied
        const resolved = parentRoute || resolveParentPath({ pathname: location.pathname, params }) || PATHS.HOME;

        ensureExitStyle();
        triggerExitAndNavigate(navigate, resolved);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    key="up-arrow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.24 }}
                    onClick={handleClick}
                    aria-label={t ? (t('common_ui.back') || 'Back') : 'Back'}
                    title={t ? (t('common_ui.back') || 'Back') : 'Back'}
                    className={`fixed bottom-4 z-50 p-3 rounded-lg bg-brand text-white shadow-lg hover:opacity-95 focus:outline-none ${className}`}
                    style={{ right: isRTL ? 'auto' : 16, left: isRTL ? 16 : 'auto' }}
                >
                    <FaArrowUp />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
