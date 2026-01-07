import React from 'react';
import { motion } from 'framer-motion';
import { sectionTitleVariant } from '../../lib/animations';

export default function SectionHeader({ badgeIcon: BadgeIcon, badge, title, titleHighlight, subtitle }) {
    const titleVal = typeof title === 'string' ? title : null;
    const titleHighlightVal = typeof titleHighlight === 'string' ? titleHighlight : null;

    return (
        <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionTitleVariant}
        >
            {badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-medium mb-4">
                    {BadgeIcon && <BadgeIcon className="text-base" />}
                    {badge}
                </div>
            )}

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {(() => {
                    // If title is not a plain string (could be React node), render it directly
                    if (titleVal === null) return title || null;

                    if (!titleVal.trim()) return null;
                    if (titleHighlightVal && titleVal.includes(titleHighlightVal)) {
                        return (
                            <>
                                {titleVal.replace(titleHighlightVal, '')}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">{titleHighlightVal}</span>
                            </>
                        );
                    }

                    // If a separate titleHighlight is provided but not included in the title string,
                    // render the title followed by the highlighted phrase to avoid incorrect last-word highlighting.
                    if (titleHighlightVal) {
                        return (
                            <>
                                {titleVal + ' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">{titleHighlightVal}</span>
                            </>
                        );
                    }

                    const parts = titleVal.split(' ');
                    if (parts.length === 1) return <span className="text-brand">{titleVal}</span>;
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

            {subtitle && <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{subtitle}</p>}
        </motion.div>
    );
}
