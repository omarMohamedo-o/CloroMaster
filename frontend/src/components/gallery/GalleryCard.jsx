import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../app/routes';
import OptimizedImage from '../common/OptimizedImage';

export default function GalleryCard({ src, name, slug, disableLink = false, onClick, hideMeta = false }) {
    const navigate = useNavigate();
    const handleClick = () => {
        if (onClick) return onClick();
        if (disableLink) return;
        if (slug) navigate(PATHS.EQUIPMENT(slug));
    };

    return (
        <article
            onClick={handleClick}
            tabIndex={disableLink ? -1 : 0}
            role={disableLink ? undefined : 'button'}
            className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden ${disableLink ? '' : 'cursor-pointer'} focus:outline-none ${disableLink ? '' : 'focus:ring-2 focus:ring-brand'}`}
            onKeyDown={(e) => { if (!disableLink && (e.key === 'Enter' || e.key === ' ')) handleClick(); }}
        >
            <div className="relative h-40 overflow-hidden bg-white dark:bg-gray-700">
                <div className="flex h-full items-center justify-center p-4">
                    <OptimizedImage src={encodeURI(src)} alt={name} className="w-full h-full object-contain transform group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-500" style={{ imageRendering: 'crisp-edges' }} loading="lazy" />
                </div>
            </div>

            <div className="p-4">
                {!hideMeta && !disableLink && (
                    <>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand transition-colors duration-300">{name}</h3>

                        <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium">Equipment</span>
                            <div className="text-brand hover:text-brand-secondary transition-colors duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </article>
    );
}
