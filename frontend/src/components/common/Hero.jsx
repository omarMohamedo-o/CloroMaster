import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { heroVariant, textBlockVariant } from '../../lib/animations';
import { PATHS } from '../../app/routes';

export default function Hero() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const goToServices = () => navigate(PATHS.HOME, { state: { scrollTo: 'services' } });
    const openVideo = () => navigate(PATHS.VIDEOS);

    return (
        <section
            className="relative text-white overflow-hidden"
            style={{
                backgroundImage: `url('/images/water-treatment-plant.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '600px'
            }}
        >
            {/* Smooth Diagonal Gradient Overlay using brand colors */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-brand-dark/95 via-brand-medium/75 to-brand/20"
            />

            <div className="relative container mx-auto px-6 py-8 lg:py-10 min-h-[600px] flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
                    {/* Left Column - Content */}
                    <div className="text-left space-y-6 lg:space-y-8 z-10">
                        <motion.h1
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                            initial="hidden"
                            animate="visible"
                            variants={heroVariant}
                        >
                            <span className="text-white">{t('hero.titlePart1') || 'Engineering Safe'} </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-cyan-400 to-brand-secondary">
                                {t('hero.titlePart2') || 'Chlorine & Electromechanical'}
                                {t('hero.titlePart3') && !t('hero.titlePart3').startsWith('hero.') && ` ${t('hero.titlePart3')}`}
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl drop-shadow-sm"
                            initial="hidden"
                            animate="visible"
                            variants={textBlockVariant}
                        >
                            {t('hero.subtitle') || 'Design, manufacturing, installation, and commissioning with a strong focus on safety and efficiency.'}
                        </motion.p>

                        <motion.div
                            className="flex gap-4 flex-wrap"
                            initial="hidden"
                            animate="visible"
                            variants={textBlockVariant}
                        >
                            <button
                                onClick={goToServices}
                                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg bg-gradient-to-r from-brand-light to-brand-secondary text-brand-dark hover:from-brand-secondary hover:to-brand-light transition-all duration-300 hover:shadow-xl hover:scale-105"
                            >
                                <span className="inline-block">☰</span>
                                {t('hero.exploreServices') || 'Explore Our Services'}
                                <span className="inline-block">→</span>
                            </button>

                            <button
                                onClick={openVideo}
                                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-brand-light/90 font-semibold text-base sm:text-lg text-white hover:bg-brand-light/20 hover:border-brand-secondary transition-all duration-300 backdrop-blur-sm"
                            >
                                <span className="inline-block">▶</span>
                                {t('hero.watchVideo') || 'Watch Video'}
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column - Empty space to show clear background image */}
                    <div className="hidden lg:block relative z-10">
                        {/* This space allows the background image to show through clearly */}
                    </div>
                </div>
            </div>
        </section>
    );
}
