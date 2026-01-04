import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { serviceCardsContainer, staggerItem } from '../../lib/animations';

export default function Counters() {
    const { t } = useLanguage();

    const data = [
        { id: 1, labelKey: 'counters.years', value: '15+', label: 'Years Experience' },
        { id: 2, labelKey: 'counters.projects', value: '500+', label: 'Projects Completed' },
        { id: 3, labelKey: 'counters.satisfaction', value: '98%', label: 'Client Satisfaction' },
    ];

    return (
        <section className="relative -mt-16 z-10">
            <div className="container mx-auto px-6">
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8"
                    variants={serviceCardsContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {data.map((d, index) => (
                        <motion.div
                            key={d.id}
                            className="bg-gradient-to-br from-brand/90 to-brand-dark/90 backdrop-blur-sm text-white p-6 md:p-8 rounded-xl shadow-xl border border-brand-light/30 hover:shadow-2xl transition-all duration-300"
                            variants={staggerItem}
                            custom={index}
                        >
                            <div className="text-4xl md:text-5xl font-bold text-brand-secondary mb-2">{d.value}</div>
                            <div className="text-sm md:text-base text-gray-100 font-medium">{t(d.labelKey) || d.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
