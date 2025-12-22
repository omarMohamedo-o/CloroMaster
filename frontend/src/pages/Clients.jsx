import React from 'react';
import { FaHandshake } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

export default function Clients() {
    const { t } = useLanguage();

    const clients = [
        {
            id: 1,
            name: 'Evoqua Water Technologies',
            logo: '/images/clients/Evoqua-Water Technologies.png',
            alt: 'Evoqua Water Technologies',
            website: 'https://www.evoqua.com/'
        },
        {
            id: 2,
            name: 'Dar El Meyah',
            logo: '/images/clients/Dar-El-Meyah.png',
            alt: 'Dar El Meyah',
            website: 'https://darelmeyah.net/wp-content/uploads/2024/02/Dar-El-Meyah-Profile.pdf'
        },
        {
            id: 3,
            name: 'UWA Co.',
            logo: '/images/clients/UWAI.png',
            alt: 'UWA Co.',
            website: 'https://www.linkedin.com/company/uwa-co/'
        },
        {
            id: 4,
            name: 'Kharafi National',
            logo: '/images/clients/Kharafi National.png',
            alt: 'Kharafi National',
            website: 'https://www.kharafinational.com.eg/'
        },
        {
            id: 5,
            name: 'IETOS',
            logo: '/images/clients/IETOS.png',
            alt: 'IETOS',
            website: 'https://www.ietos.com/'
        },
        {
            id: 6,
            name: 'Veolia',
            logo: '/images/clients/Veolia.png',
            alt: 'Veolia',
            website: 'https://www.veolia.com/'
        },
        {
            id: 7,
            name: 'GEMS',
            logo: '/images/clients/GEMS.png',
            alt: 'GEMS',
            website: 'https://www.linkedin.com/company/gems-eg/'
        },
        {
            id: 8,
            name: 'Industrial Wastewater Disposal Project',
            logo: '/images/clients/Industrial-Wastewater-Disposal-Project.png',
            alt: 'Industrial Wastewater Disposal Project',
            website: 'https://www.eeaa.gov.eg/'
        }
    ];

    const containerVariants = {};

    const itemVariants = {};

    return (
        <section id="clients" className="py-12 bg-white dark:bg-gray-900 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div
                    className="text-center mb-10"
                    data-aos="fade-up"
                    data-aos-duration="700"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-medium mb-4">
                        <FaHandshake className="text-base" />
                        {t('clients.badge')}
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        {(() => {
                            const title = t('clients.title');
                            const titleKey = 'clients.title';
                            const titleHighlight = t('clients.titleHighlight');
                            const titleHighlightKey = 'clients.titleHighlight';

                            const showTitle = title && title.trim() !== '' && title !== titleKey;
                            const showHighlight = titleHighlight && titleHighlight !== titleHighlightKey;

                            if (!showTitle) return null;
                            if (showHighlight) {
                                return (
                                    <>
                                        {title.replace(titleHighlight, '')}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">{titleHighlight}</span>
                                    </>
                                );
                            }

                            const parts = title.split(' ');
                            if (parts.length === 1) return <span className="text-brand">{title}</span>;
                            const last = parts.pop();
                            const rest = parts.join(' ');
                            return (
                                <>
                                    {rest + ' '}
                                    <span className="text-brand">{last}</span>
                                </>
                            );
                        })()}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {t('clients.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {clients.map((client, index) => (
                        <a
                            key={client.id}
                            href={client.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover-lift border border-gray-100 dark:border-gray-700 flex items-center justify-center cursor-pointer btn-hover-animate"
                            data-aos="fade-up"
                            data-aos-duration="800"
                            data-aos-delay={index * 80}
                        >
                            {/* Client Logo — use image's original background (no forced white) */}
                            <div className="relative z-10 w-full h-28 flex items-center justify-center">
                                <img
                                    src={client.logo}
                                    alt={client.alt}
                                    className="max-w-full max-h-full object-contain transform transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1"
                                    style={{ imageRendering: 'crisp-edges' }}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const fallback = e.target.nextSibling;
                                        if (fallback) fallback.style.display = 'block';
                                    }}
                                />
                                <div className="text-center px-4 hidden">
                                    <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm transition-colors duration-300">
                                        {client.name}
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Commitment Message */}
                <div
                    className="mt-12 text-center"
                    data-aos="fade-up"
                    data-aos-duration="700"
                    data-aos-delay="200"
                >
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto italic">
                        {t('clients.commitment')}
                    </p>
                </div>

                {/* Stats Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div
                        className="text-center"
                        data-aos="fade-up"
                        data-aos-duration="700"
                        data-aos-delay="0"
                    >
                        <h3 className="text-4xl lg:text-5xl font-bold text-brand mb-2">
                            8+
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">{t('clients.stats.partners')}</p>
                    </div>
                    <div
                        className="text-center"
                        data-aos="fade-up"
                        data-aos-duration="700"
                        data-aos-delay="100"
                    >
                        <h3 className="text-4xl lg:text-5xl font-bold text-brand mb-2">
                            100%
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">{t('clients.stats.satisfaction')}</p>
                    </div>
                    <div
                        className="text-center"
                        data-aos="fade-up"
                        data-aos-duration="700"
                        data-aos-delay="200"
                    >
                        <h3 className="text-4xl lg:text-5xl font-bold text-brand mb-2">
                            50+
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">{t('clients.stats.projects')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
