import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BackButton from '../common/BackButton';

export default function SubpageLayout({ title, titleHighlight, subtitle, children, headerChildren }) {
    useLanguage();

    // Hide any duplicate back buttons that might be injected by pages
    // so the single shared `BackButton` is always the authoritative control.
    useEffect(() => {
        const backs = Array.from(document.querySelectorAll('[data-back-button]'));
        // keep the first, hide the rest
        backs.forEach((el, idx) => {
            if (idx > 0) el.style.display = 'none';
        });
        return () => {
            backs.forEach((el) => {
                if (el && el.style) el.style.display = '';
            });
        };
    }, []);

    // Inform global UI that we're rendering a subpage so global footer
    // floating controls (like the footer scroll-top) can avoid rendering
    // duplicate controls.
    useEffect(() => {
        try { document.body.dataset.hasSubpage = '1'; } catch (e) { /* ignore */ }
        return () => { try { delete document.body.dataset.hasSubpage; } catch (e) { /* ignore */ } };
    }, []);

    // Ensure titleHighlight works even when translations provide title and highlight separately
    const effectiveTitle = (() => {
        if (!titleHighlight) return title || '';
        // If the title already contains the highlight, use it as-is
        if (typeof title === 'string' && title.includes(titleHighlight)) return title;
        // Otherwise combine them with a space if needed
        const sep = title && typeof title === 'string' && title.endsWith(' ') ? '' : ' ';
        return `${title || ''}${sep}${titleHighlight}`.trim();
    })();

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-6 cm-subpage">
            <div className="container mx-auto px-6">
                <div className="mb-0 py-4">
                    <BackButton className="mb-0" />
                </div>

                <div id="cm-page-wrapper" className="rounded-2xl overflow-hidden mb-8 shadow-xl bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
                    <div className="px-6 py-6 md:px-8 md:py-8">
                        <div className="flex-1">
                            {titleHighlight ? (
                                <h1 className="text-3xl md:text-4xl font-bold">
                                    {effectiveTitle.split(titleHighlight).map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i < arr.length - 1 && (
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">
                                                    {titleHighlight}
                                                </span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </h1>
                            ) : (
                                <h1 className="text-3xl md:text-4xl font-bold">{effectiveTitle || title}</h1>
                            )}
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
                {/* Up arrow handled globally in the Footer to provide a single consistent control */}
            </div>
        </div>
    );
}
