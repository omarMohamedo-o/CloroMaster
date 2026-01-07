import React from 'react';
import { motion } from 'framer-motion';
import ContactLink from '../components/common/ContactLink';
import { FaCheckCircle, FaUsers, FaAward, FaGlobe, FaHeart, FaBuilding } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import SectionHeader from '../components/common/SectionHeader';
import OptimizedImage from '../components/common/OptimizedImage';

import { textBlockVariant, serviceCardsContainer, staggerItem, imageVariant } from '../lib/animations';

export default function About() {
  const { t } = useLanguage();

  const features = [
    {
      icon: FaCheckCircle,
      title: t('about.features.quality.title'),
      description: t('about.features.quality.desc')
    },
    {
      icon: FaUsers,
      title: t('about.features.team.title'),
      description: t('about.features.team.desc')
    },
    {
      icon: FaAward,
      title: t('about.features.track.title'),
      description: t('about.features.track.desc')
    },
    {
      icon: FaGlobe,
      title: t('about.features.global.title'),
      description: t('about.features.global.desc')
    }
  ];

  return (
    <section id="about" className="py-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeader
          badgeIcon={FaBuilding}
          badge={t('about.badge')}
          title={t('about.title')}
          titleHighlight={t('about.titleHighlight')}
        />

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Content - Text slides from left */}
          <motion.div className="space-y-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={textBlockVariant}>
            <div className="space-y-3">
              {/* Title is rendered via SectionHeader above; keep this area for descriptive paragraphs. */}
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('about.paragraph1')}
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('about.paragraph2')}
            </p>

            {/* Features Grid - Staggered */}
            <motion.div className="flex flex-wrap justify-center gap-6 pt-8 max-w-4xl mx-auto" variants={serviceCardsContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 w-full sm:w-[calc(50%-0.75rem)] min-w-[280px] max-w-[450px]"
                  variants={staggerItem}
                  custom={index}
                  style={{ willChange: 'transform' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-brand-secondary flex items-center justify-center">
                    <feature.icon className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerItem} custom={3}>
              <ContactLink target="contact" asButton={true} className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-brand to-brand-secondary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover-lift">
                <FaHeart className="text-lg" />
                {t('about.cta')}
              </ContactLink>
            </motion.div>
          </motion.div>

          {/* Right Content - Image slides from right */}
          <motion.div className="relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={imageVariant} custom={0}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <OptimizedImage
                src="/images/ChloroMaster-about.png"
                alt="ChloroMaster about image"
                className="w-full h-full object-contain float-slow"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
          </motion.div>
        </div>
      </div >
    </section >
  );
}