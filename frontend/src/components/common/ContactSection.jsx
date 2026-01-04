import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPhone, FaWhatsapp } from 'react-icons/fa';
import ContactForm from './ContactForm';
import SectionHeader from './SectionHeader';
import { motion } from 'framer-motion';
import { contactFormVariant, serviceCardsContainer, staggerItem } from '../../lib/animations';
import { useLanguage } from '../../context/LanguageContext';
import config from '../../config/config';
import formatPhoneForDisplay from '../../lib/formatPhone';

export default function ContactSection() {
    const hours = config.contact.workingHours || {};

    const InfoCard = ({ icon, title, children, href, index }) => {
        const Card = (
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 flex items-start gap-3 sm:gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                variants={staggerItem}
                custom={index}
            >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-brand to-brand-secondary text-white text-base sm:text-lg flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">{title}</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{children}</div>
                </div>
            </motion.div>
        );

        if (href) {
            return (
                <a href={href} className="block" rel="noopener noreferrer">
                    {Card}
                </a>
            );
        }

        return Card;
    };

    const { t, language } = useLanguage();

    return (
        <section className="w-full bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <SectionHeader
                        Icon={FaEnvelope}
                        badge={t ? t('contact.badge') : 'Get In Touch'}
                        title={(
                            <>
                                {t ? t('contact.title') : "Let's Work"}{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">{t ? t('contact.titleHighlight') : 'Together'}</span>
                            </>
                        )}
                        subtitle={t ? t('contact.subtitle') : 'Feel free to contact us and we will get back to you as soon as we can.'}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                    <motion.div
                        className="space-y-4 sm:space-y-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={serviceCardsContainer}
                    >

                        <InfoCard icon={<FaMapMarkerAlt />} title={t ? t('contact.info.address') : 'Address'} href={config.contact.addressLink || undefined} index={0}>
                            <span className="text-gray-700 dark:text-gray-200 break-words">{config.contact.address}</span>
                        </InfoCard>

                        <InfoCard icon={<FaPhoneAlt />} title={t ? t('contact.info.phone') : 'Phone'} index={1}>
                            <div className="space-y-2">
                                <a href={`tel:${config.contact.phone.replace(/\s+/g, '')}`} className="text-gray-700 dark:text-gray-200 hover:text-brand transition-colors flex items-center gap-2">
                                    <FaPhone className="text-brand flex-shrink-0" />
                                    <span dir="ltr">{formatPhoneForDisplay(config.contact.phone, language)}</span>
                                </a>
                                <a href={`https://wa.me/${config.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-200 hover:text-green-600 transition-colors flex items-center gap-2">
                                    <FaWhatsapp className="text-green-600 flex-shrink-0" />
                                    <span dir="ltr">{formatPhoneForDisplay(config.contact.phone2, language)}</span>
                                </a>
                            </div>
                        </InfoCard>

                        <InfoCard icon={<FaEnvelope />} title={t ? t('contact.info.email') : 'Email'} href={`mailto:${config.contact.email}`} index={2}>
                            <span className="text-gray-700 dark:text-gray-200 break-all">{config.contact.email}</span>
                        </InfoCard>

                        <InfoCard icon={<FaClock />} title={t ? t('contact.info.hours') : 'Working Hours'} index={3}>
                            <div className="text-gray-700 dark:text-gray-200">{hours.weekdays}</div>
                            {hours.saturday && <div className="mt-1 text-gray-700 dark:text-gray-200">{hours.saturday}</div>}
                        </InfoCard>
                    </motion.div>

                    <div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={contactFormVariant}>
                            <ContactForm />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
