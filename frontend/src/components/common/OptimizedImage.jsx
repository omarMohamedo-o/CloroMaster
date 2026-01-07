import React from 'react';

/**
 * OptimizedImage component that serves WebP with PNG fallback
 * Automatically handles WebP conversion - just use the .png path
 */
export default function OptimizedImage({ src, alt, className = '', ...props }) {
    if (!src) return null;

    // Convert .png to .webp for the WebP source
    const webpSrc = src.replace(/\.png$/i, '.webp');
    const isPng = /\.png$/i.test(src);

    // If not a PNG, just render regular img
    if (!isPng) {
        return <img src={src} alt={alt} className={className} {...props} />;
    }

    // Use picture element for WebP with PNG fallback
    return (
        <picture>
            <source srcSet={webpSrc} type="image/webp" />
            <img src={src} alt={alt} className={className} {...props} />
        </picture>
    );
}
