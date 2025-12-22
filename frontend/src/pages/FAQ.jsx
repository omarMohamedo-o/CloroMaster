import React, { useState } from 'react';
import { FaQuestionCircle, FaChevronDown, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

export default function FAQ() {
    const { t } = useLanguage();
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: t('faq.items.service.question'),
            answer: t('faq.items.service.answer')
        },
        {
            question: t('faq.items.capacity.question'),
            answer: t('faq.items.capacity.answer')
        },
        {
            question: t('faq.items.safety.question'),
            answer: t('faq.items.safety.answer')
        },
        {
            question: t('faq.items.installation.question'),
            answer: t('faq.items.installation.answer')
        },
        {
            question: t('faq.items.maintenance.question'),
            answer: t('faq.items.maintenance.answer')
        },
        {
            question: t('faq.items.emergency.question'),
            answer: t('faq.items.emergency.answer')
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-12 bg-white dark:bg-gray-900 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div
                    className="text-center mb-10"
                    data-aos="fade-up"
                    data-aos-duration="700"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-medium mb-4">
                        <FaQuestionCircle className="text-base" />
                        {t('faq.badge')}
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        {(() => {
                            const title = t('faq.title');
                            const titleKey = 'faq.title';
                            const titleHighlight = t('faq.titleHighlight');
                            const titleHighlightKey = 'faq.titleHighlight';

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
                        {t('faq.subtitle')}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="mb-4"
                            data-aos="fade-up"
                            data-aos-duration="600"
                            data-aos-delay={index * 50}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-left hover:bg-gray-100 dark:hover:bg-gray-750 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                                        {faq.question}
                                    </h3>
                                    <div
                                        className="flex-shrink-0"
                                        style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                                    >
                                        <FaChevronDown className="text-brand text-xl" />
                                    </div>
                                </div>
                                {openIndex === index && (
                                    <div className="overflow-hidden">
                                        <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div
                    className="text-center mt-16"
                    data-aos="fade-up"
                    data-aos-duration="700"
                    data-aos-delay="200"
                >
                    <div className="bg-gradient-to-r from-brand/10 to-brand-secondary/10 rounded-2xl p-8 border border-brand/20">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('faq.ctaTitle')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                            {t('faq.ctaSubtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+201234567890"
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-brand to-brand-secondary text-white font-semibold shadow-lg hover-lift"
                            >
                                <FaPhone className="text-lg" />
                                {t('faq.callButton')}
                            </a>
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-brand text-brand font-semibold hover:bg-brand hover:text-white transition-all duration-300"
                            >
                                <FaEnvelope className="text-lg" />
                                {t('faq.emailButton')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
