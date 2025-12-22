import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSeedling,
    FaBolt,
    FaLeaf,
    FaClipboardList,
    FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useLanguage } from '../../context/LanguageContext';
import servicesFallback from '../../data/services';
import SectionHeader from './SectionHeader';
import SectionCTA from './SectionCTA';

export default function ServicesGrid() {
    const { t, language } = useLanguage();
    const [active, setActive] = useState('All');

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
        return ['All', ...Array.from(set)];
    }, [servicesAll, language]);

    const filtered =
        active === 'All'
            ? servicesAll
            : servicesAll.filter(s => {
                const titleVal = (typeof s.title === 'string')
                    ? s.title
                    : (s.title?.[language] || s.title?.en || Object.values(s.title || {})[0]);
                return titleVal === active;
            });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06 }
        }
    };

    const itemVariants = {
        hidden: { y: 14, opacity: 0.001 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const getIcon = (category) => {
        if (!category) return FaLeaf;
        const v = category.toLowerCase();
        if (v.includes('agri') || v.includes('plant') || v.includes('bio')) return FaSeedling;
        if (v.includes('energy') || v.includes('power') || v.includes('elec')) return FaBolt;
        return FaLeaf;
    };

    return (
        <section
            id="services"
            className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transform-gpu"
        >
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <SectionHeader
                        Icon={FaClipboardList}
                        badge={t('nav.services') || 'Services'}
                        title={
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">
                                {t('nav.services') || 'Our Services'}
                            </span>
                        }
                        subtitle={
                            t('services.subtitle') ||
                            'Comprehensive sustainable solutions designed to transform your business while protecting our planet for future generations.'
                        }
                    />
                </motion.div>

                {/* Filters */}
                <motion.div
                    className="flex justify-center gap-3 mb-12 flex-wrap"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    {cats.map(cat => (
                        <motion.button
                            key={cat}
                            onClick={() => setActive(cat)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
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
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8 justify-items-center"
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

                            const serviceDesc = (() => {
                                if (!service) return '';
                                if (typeof service.desc === 'string') return service.desc;
                                return service.desc?.[language] || service.desc?.en || Object.values(service.desc || {})[0] || '';
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
                                    to={`/service/${service.id}`}
                                    className="block w-full"
                                >
                                    <motion.article
                                        layout
                                        variants={itemVariants}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[340px]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Image */}
                                        <div className="w-full h-[70%] bg-gray-100 overflow-hidden">
                                            <img
                                                src={encodeURI(img)}
                                                alt={service.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.src = '/images/placeholder-service.png')}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-3 flex flex-col h-[30%]">
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-brand transition-colors">
                                                {serviceTitle}
                                            </h3>



                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-gray-700 text-brand text-xs font-medium flex items-center gap-1">
                                                        <Icon />
                                                        {service.category}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">{productCount > 0 ? `${productCount} products` : '—'}</span>
                                                </div>

                                                <FaArrowRight className="text-xl text-brand transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </motion.article>
                                </Link>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* CTA */}
                <SectionCTA
                    title={t('services.ctaTitle') || 'Ready to Start Your Journey?'}
                    subtitle={
                        t('services.ctaSubtitle') ||
                        'Let’s discuss how we can help you build reliable and sustainable solutions.'
                    }
                    primary={{ label: t('cta.getStarted') || 'Get Started', href: '#contact', type: 'anchor' }}
                    secondary={{ label: t('cta.callUs') || 'Call Us', href: 'tel:+201234567890', type: 'tel' }}
                />
            </div>
        </section>
    );
}
