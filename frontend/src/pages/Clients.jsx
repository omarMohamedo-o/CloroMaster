import React from 'react';
import { motion } from 'framer-motion';
import { FaHandshake } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import clientsAssets from '../i18n/clients.assets';
import SectionHeader from '../components/common/SectionHeader';
import { serviceCardsContainer, staggerItem } from '../lib/animations';
import OptimizedImage from '../components/common/OptimizedImage';

export default function Clients() {
    const { t } = useLanguage();

    // textual items come from translations; assets (logo, website) come from clients.assets
    const translatedItems = t('clients.items') || [];
    const assetMap = new Map(clientsAssets.map(a => [a.id, a]));

    const clients = translatedItems.map(item => ({
        id: item.id,
        name: item.name,
        alt: item.alt || item.name,
        logo: assetMap.get(item.id)?.logo || '',
        website: assetMap.get(item.id)?.website || '#'
    }));

    // use centralized motion variants (imports are at file top)

    return (
        <section id="clients" className="py-8 bg-white dark:bg-gray-900 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <SectionHeader
                    badgeIcon={FaHandshake}
                    badge={t('clients.badge')}
                    title={t('clients.title')}
                    titleHighlight={t('clients.titleHighlight')}
                    subtitle={t('clients.subtitle')}
                />

                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto justify-items-center"
                    variants={serviceCardsContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {clients.map((client, index) => (
                        <motion.a
                            key={client.id}
                            href={client.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1 w-full max-w-[260px]"
                            variants={staggerItem}
                            custom={index}
                            style={{ flex: '1 1 auto', willChange: 'transform' }}
                        >
                            {/* Client Logo — use image's original background (no forced white) */}
                            <div className="relative z-10 w-full h-28 flex items-center justify-center">
                                {client.logo ? (
                                    <OptimizedImage
                                        src={client.logo}
                                        alt={client.alt}
                                        className="max-w-full max-h-full object-contain transform transition-transform duration-300 group-hover:scale-110"
                                        style={{ imageRendering: 'crisp-edges' }}
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <div className="text-center px-4">
                                        <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm transition-colors duration-300">
                                            {client.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.a>
                    ))}
                </motion.div>

                {/* Commitment Message */}
                <motion.div
                    className="mt-12 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerItem}
                >
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto italic">
                        {t('clients.commitment')}
                    </p>
                </motion.div>

                {/* Stats Section */}
                <motion.div className="mt-20 flex flex-wrap justify-center gap-8 max-w-4xl mx-auto" variants={serviceCardsContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <motion.div className="text-center min-w-[180px] flex-1" variants={staggerItem} custom={0}>
                        <h3 className="text-4xl lg:text-5xl font-bold text-brand mb-2">
                            8+
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">{t('clients.stats.partners')}</p>
                    </motion.div>
                    <motion.div className="text-center min-w-[180px] flex-1" variants={staggerItem} custom={1}>
                        <h3 className="text-4xl lg:text-5xl font-bold text-brand mb-2">
                            100%
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">{t('clients.stats.satisfaction')}</p>
                    </motion.div>
                    <motion.div className="text-center min-w-[180px] flex-1" variants={staggerItem} custom={2}>
                        <h3 className="text-4xl lg:text-5xl font-bold text-brand mb-2">
                            50+
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">{t('clients.stats.projects')}</p>
                    </motion.div>
                </motion.div>
            </div>
        </section >
    );
}
