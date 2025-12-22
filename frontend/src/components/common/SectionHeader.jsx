import React from 'react';

export default function SectionHeader({ Icon, badge, title, subtitle }) {
    return (
        <div className="text-center">
            {badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-medium mb-4">
                    {Icon ? <Icon className="w-4 h-4" /> : null}
                    <span>{badge}</span>
                </div>
            )}

            <div className="max-w-3xl mx-auto">
                <div className="mb-3 text-3xl md:text-4xl font-extrabold leading-tight">
                    {title}
                </div>
                {subtitle && (
                    <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">{subtitle}</p>
                )}
            </div>
        </div>
    );
}
