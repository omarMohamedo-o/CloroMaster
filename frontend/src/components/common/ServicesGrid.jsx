import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSeedling,
    FaBolt,
    FaLeaf,
    FaTint,
    FaClipboardList,
    FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { PATHS } from '../../app/routes';

import { useLanguage } from '../../context/LanguageContext';
import servicesFallback from '../../i18n/services.fallback';
import servicesMaster from '../../i18n/services.master';
import SectionHeader from './SectionHeader';
import ContactCTA from './ContactCTA';
import { serviceCardsContainer, serviceCardItem, servicesHeaderVariant, filtersContainer, filterItem } from '../../lib/animations';

export default function ServicesGrid() {
    const { t, language } = useLanguage();
    const allLabel = t('common_ui.all') || (language === 'ar' ? 'الكل' : 'All');
    const [active, setActive] = useState(allLabel);

    // Helper function to get slug from service id
    const getServiceSlug = (serviceId) => {
        const masterService = servicesMaster.find(s => s.id === serviceId);
        return masterService ? masterService.slug : serviceId;
    };

    // Prefer localized services
    const localized = t('services.items');
    const servicesAll =
        Array.isArray(localized) && localized.length
            ? localized
            : servicesFallback;

    const cats = useMemo(() => {
        const set = new Set(
            servicesAll
                .map(s => {
                    if (!s) return null;
                    // title may be a string or an object {en, ar}
                    if (typeof s.title === 'string') return s.title;
                    if (typeof s.title === 'object') return s.title[language] || s.title.en || Object.values(s.title)[0];
                    return null;
                })
                .filter(Boolean)
        );
        return [allLabel, ...Array.from(set)];
    }, [servicesAll, language, allLabel]);

    const filtered =
        active === allLabel
            ? servicesAll
            : servicesAll.filter(s => {
                const titleVal = (typeof s.title === 'string')
                    ? s.title
                    : (s.title?.[language] || s.title?.en || Object.values(s.title || {})[0]);
                return titleVal === active;
            });

    // use shared variants from animations.js for consistent motion

    const getIcon = (category) => {
        if (!category) return FaLeaf;
        const v = category.toLowerCase();
        if (v.includes('water') || v.includes('treat') || v.includes('waste') || v.includes('wastewater') || v.includes('مياه') || v.includes('معالجة')) return FaTint;
        if (v.includes('agri') || v.includes('plant') || v.includes('bio')) return FaSeedling;
        if (v.includes('energy') || v.includes('power') || v.includes('elec')) return FaBolt;
        return FaLeaf;
    };

    return (
        <section
            id="services"
            className="py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transform-gpu"
        >
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Header */}
                <motion.div
                    variants={servicesHeaderVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <SectionHeader
                        Icon={FaClipboardList}
                        badge={t('nav.services') || 'Services'}
                        title={
                            <span>
                                <span className="text-gray-900 dark:text-white">{(t('services.title') || t('nav.services') || 'Our')}{' '}</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">{t('services.titleHighlight') || ''}</span>
                            </span>
                        }
                        subtitle={t('services.subtitle') || 'Comprehensive sustainable solutions designed to transform your business while protecting our planet for future generations.'}
                    />
                </motion.div>

                {/* Filters */}
                <motion.div
                    className="flex justify-center gap-3 mb-12 flex-wrap"
                    variants={filtersContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {cats.map(cat => (
                        <motion.button
                            key={cat}
                            onClick={() => setActive(cat)}
                            variants={filterItem}
                            whileHover="hover"
                            whileTap="tap"
                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${active === cat
                                ? 'bg-gradient-to-r from-brand to-brand-secondary text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                                }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        variants={serviceCardsContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        exit="hidden"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-6xl mx-auto"
                    >
                        {filtered.map(service => {
                            const Icon = getIcon(service.category);
                            const img =
                                service.images?.[0] || '/images/placeholder-service.png';
                            // Compute product count excluding the main service image (which is usually the hero/main image)
                            const imgs = Array.isArray(service.images) ? service.images.filter(Boolean) : [];
                            const serviceTitle = (() => {
                                if (!service) return '';
                                if (typeof service.title === 'string') return service.title;
                                // title may be an object with locales
                                return service.title?.[language] || service.title?.en || Object.values(service.title || {})[0] || '';
                            })();



                            const normalize = (s) =>
                                (s || '')
                                    .toString()
                                    .toLowerCase()
                                    .replace(/\.(jpeg|jpg|png|webp|gif|svg)$/i, '')
                                    .replace(/[^a-z0-9]+/g, ' ')
                                    .trim();

                            // Use the service slug to determine the main/hero image key (slug is language-neutral)
                            const mainKey = normalize(service.slug || serviceTitle);
                            const productCount = imgs.filter((img) => {
                                const name = (img.split('/').pop() || '');
                                return normalize(name) !== mainKey;
                            }).length;

                            return (
                                <Link
                                    key={service.id}
                                    to={PATHS.SERVICE(getServiceSlug(service.id))}
                                    className="block w-full"
                                >
                                    <motion.article
                                        layout
                                        variants={serviceCardItem}
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[340px] sm:h-[360px] md:h-[380px]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Image */}
                                        <div className="w-full h-[65%] bg-gray-100 overflow-hidden">
                                            <img
                                                src={encodeURI(img)}
                                                alt={service.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => (e.currentTarget.src = '/images/placeholder-service.png')}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 sm:p-5 flex flex-col h-[35%] justify-between">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand transition-colors">
                                                {serviceTitle}
                                            </h3>

                                            <div className="flex items-center justify-between mt-auto flex-wrap gap-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-gray-700 text-brand text-xs font-medium flex items-center gap-1">
                                                        <Icon className="text-sm" />
                                                        <span className="hidden sm:inline">{service.category}</span>
                                                    </span>
                                                    {service.id !== 2 && (
                                                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{productCount > 0 ? `${productCount} ${t('common_ui.products') || 'products'}` : (t('common_ui.none') || '—')}</span>
                                                    )}
                                                </div>

                                                <FaArrowRight className="text-lg sm:text-xl text-brand transition-transform group-hover:translate-x-1 flex-shrink-0" />
                                            </div>
                                        </div>
                                    </motion.article>
                                </Link>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* CTA */}
                <ContactCTA
                    className="mt-12"
                    title={t('services.ctaTitle') || 'Ready to Start Your Journey?'}
                    subtitle={
                        t('services.ctaSubtitle') ||
                        'Let’s discuss how we can help you build reliable and sustainable solutions.'
                    }
                    primary={{ label: t('cta.getStarted') || 'Get Started', href: '#contact', type: 'anchor' }}
                />
            </div>
        </section>
    );
}
