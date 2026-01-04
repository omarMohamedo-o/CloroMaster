import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { textBlockVariant } from '../../lib/animations';

export default function StaticInfoPage({ content }) {
    const { language } = useLanguage();
    const data = content[language] || content.en;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={textBlockVariant}
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {data.title}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                        {data.lastUpdated}
                    </p>

                    <div className="space-y-8">
                        {data.sections.map((section, index) => (
                            <motion.div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                    {section.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    {section.content}
                                </p>
                                {section.list && (
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                                        {section.list.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                                {section.additional && (
                                    <p className="text-gray-600 dark:text-gray-300 mt-4">
                                        {section.additional}
                                    </p>
                                )}
                                {section.contactInfo && (
                                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {section.contactInfo.company}
                                        </p>
                                        {section.contactInfo.email && (
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}: {section.contactInfo.email}
                                            </p>
                                        )}
                                        {section.contactInfo.phone && (
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {language === 'ar' ? 'الهاتف' : 'Phone'}: {section.contactInfo.phone}
                                            </p>
                                        )}
                                        {section.contactInfo.address && (
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {language === 'ar' ? 'العنوان' : 'Address'}: {section.contactInfo.address}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
