import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPhone } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { textBlockVariant } from '../../lib/animations';
import config from '../../config/config';
import { PATHS } from '../../app/routes';

export default function ContactCTA({ title, subtitle, primary = null, secondary = null, className = 'mt-8' }) {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const titleText = title ?? (t('cta.title') || 'Get a Quote or Consultation');
    const subtitleText = subtitle ?? (t('cta.subtitle') || 'Contact our team for project-specific enquiries, quotes, or site visits.');

    const renderPrimary = () => {
        if (primary && primary.label) {
            // tel link
            if (primary.type === 'tel' || (primary.href && primary.href.startsWith('tel:'))) {
                return (
                    <a href={primary.href} className="px-6 py-3 rounded-lg text-white shadow-md bg-gradient-to-r from-brand to-brand-medium hover:from-brand-dark hover:to-brand transition-colors">
                        {primary.label}
                    </a>
                );
            }

            // anchor link
            if (primary.type === 'anchor' || (primary.href && typeof primary.href === 'string')) {
                return (
                    <a href={primary.href} className="px-6 py-3 rounded-lg text-white shadow-md bg-gradient-to-r from-brand to-brand-medium hover:from-brand-dark hover:to-brand transition-colors">
                        {primary.label}
                    </a>
                );
            }
        }

        // default: navigate to contact section
        return (
            <button
                onClick={() => navigate(PATHS.HOME, { state: { scrollTo: 'contact' } })}
                className="px-6 py-3 rounded-lg text-white shadow-md bg-gradient-to-r from-brand to-brand-medium hover:from-brand-dark hover:to-brand transition-colors"
            >
                {t('cta.contactForm') || 'Contact Form'}
            </button>
        );
    };

    const renderSecondary = () => {
        if (secondary && secondary.label) {
            if (secondary.type === 'tel' || (secondary.href && secondary.href.startsWith('tel:'))) {
                return (
                    <a href={secondary.href} className="px-5 py-3 rounded-lg border border-brand text-brand-dark hover:bg-brand-secondary transition-colors inline-flex items-center gap-2">
                        <FaPhone />
                        {secondary.label}
                    </a>
                );
            }

            if (secondary.href) {
                return (
                    <a href={secondary.href} className="px-5 py-3 rounded-lg border border-brand text-brand-dark hover:bg-brand-secondary transition-colors inline-flex items-center gap-2">
                        {secondary.label}
                    </a>
                );
            }
        }

        // default: call us
        return (
            <a href={`tel:${config.contact.phone.replace(/\s+/g, '')}`} className="px-5 py-3 rounded-lg border border-brand text-brand-dark hover:bg-brand-secondary transition-colors inline-flex items-center gap-2">
                <FaPhone />
                {t('cta.callUs') || 'Call Us'}
            </a>
        );
    };

    return (
        <div className={className}>
            <motion.div
                className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={textBlockVariant}
            >
                <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    {titleText}
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
                    {subtitleText}
                </p>

                <div className="flex items-center justify-center gap-4 mt-6">
                    {renderPrimary()}
                    {renderSecondary()}
                </div>
            </motion.div>
        </div>
    );
}
