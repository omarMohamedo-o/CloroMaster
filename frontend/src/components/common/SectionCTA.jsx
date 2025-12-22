import React from 'react';

export default function SectionCTA({ title, subtitle, primary = {}, secondary = {} }) {
    const renderButton = (btn, primaryFlag = false) => {
        if (!btn || !btn.label) return null;

        const base = primaryFlag
            ? 'inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg'
            : 'inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold';

        if (btn.type === 'tel' || (btn.href && btn.href.startsWith('tel:'))) {
            return (
                <a href={btn.href} className={`${base} border-teal-500 text-teal-700 hover:bg-teal-50`}>
                    {btn.label}
                </a>
            );
        }

        // default: anchor or internal link
        return (
            <a href={btn.href || '#'} className={`${base} ${primaryFlag ? 'bg-gradient-to-r from-brand to-brand-secondary' : 'border-gray-300 text-gray-700'} hover:opacity-95`}>
                {btn.label}
            </a>
        );
    };

    return (
        <div className="mt-12">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
                <div className="max-w-3xl mx-auto text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    {subtitle && <p className="text-gray-600 dark:text-gray-300 mt-3">{subtitle}</p>}

                    <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
                        {renderButton(primary, true)}
                        {renderButton(secondary, false)}
                    </div>
                </div>
            </div>
        </div>
    );
}
