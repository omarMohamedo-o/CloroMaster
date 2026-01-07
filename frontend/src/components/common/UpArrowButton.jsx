import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import resolveParentPath from '../../lib/backNavigation';
import { PATHS } from '../../app/routes';
import { ensureExitStyle, triggerExitAndNavigate } from '../../lib/exitAnimation';
import useScrollVisibility from '../../hooks/useScrollVisibility';

export default function UpArrowButton({ parentRoute = null, className = '' }) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const { language, t } = useLanguage();
    const isRTL = language?.toLowerCase().startsWith('ar');

    const show = useScrollVisibility(100); // shows after 100px

    const handleClick = (e) => {
        e?.preventDefault();
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
                    transition={{ duration: 0.25 }}
                    onClick={handleClick}
                    aria-label={t?.('common_ui.back') || 'Back'}
                    title={t?.('common_ui.back') || 'Back'}
                    className={`fixed bottom-4 z-[9999] p-3 rounded-lg bg-brand text-white shadow-lg hover:opacity-95 focus:outline-none ${className}`}
                    style={{ right: isRTL ? 'auto' : 16, left: isRTL ? 16 : 'auto' }}
                >
                    <FaArrowUp size={20} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
