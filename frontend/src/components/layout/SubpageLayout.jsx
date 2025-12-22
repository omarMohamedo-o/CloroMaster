import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaArrowLeft } from 'react-icons/fa';

export default function SubpageLayout({ title, titleHighlight, subtitle, children, onBack, headerChildren }) {
    const renderTitle = () => {
        if (!title) return null;

        const showHighlight = titleHighlight && titleHighlight.trim() !== '';

        if (showHighlight && title.includes(titleHighlight)) {
            return (
                <h1 className="text-2xl md:text-3xl font-bold mt-3 text-gray-900 dark:text-white leading-tight">
                    {title.replace(titleHighlight, '')}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">{titleHighlight}</span>
                </h1>
            );
        }

        const parts = title.split(' ');
        if (parts.length === 1) return <h1 className="text-2xl md:text-3xl font-bold mt-3 text-brand">{title}</h1>;
        const last = parts.pop();
        const rest = parts.join(' ');
        return (
            <h1 className="text-2xl md:text-3xl font-bold mt-3 text-gray-900 dark:text-white leading-tight">
                {rest + ' '}
                <span className="text-brand">{last}</span>
            </h1>
        );
    };

    const { t } = useLanguage();

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
            <div className="container mx-auto px-6">
                {onBack ? (
                    <div className="mb-8">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-brand hover:text-brand/80 transition-colors"
                        >
                            <FaArrowLeft />
                            <span>{t('common.back')}</span>
                        </button>
                    </div>
                ) : null}

                <div className="rounded-2xl overflow-hidden mb-8 shadow-xl bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
                    <div className="px-6 py-8 md:px-8 md:py-10">
                        <div className="flex-1">
                            {renderTitle()}
                            {subtitle ? (
                                <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {subtitle}
                                </p>
                            ) : null}
                        </div>
                        {headerChildren ? (
                            <div className="mt-6">
                                {headerChildren}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}
