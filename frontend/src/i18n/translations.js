import servicesMaster from './services.master';
import enText from './translations-en';
import arText from './translations-ar';

const translations = {
    en: enText,
    ar: arText
};

// Available languages for the UI
export const availableLanguages = ['en', 'ar'];

// Deep-merge helper: fills missing keys in `target` from `source` recursively.
function fillMissingKeys(source, target) {
    if (typeof source !== 'object' || source === null) return target;
    if (typeof target !== 'object' || target === null) return source;

    const out = Array.isArray(source) ? [...source] : { ...source };

    Object.keys(source).forEach(key => {
        const sVal = source[key];
        const tVal = target[key];

        if (tVal === undefined || tVal === null) {
            out[key] = sVal;
        } else if (typeof sVal === 'object' && sVal !== null && !Array.isArray(sVal)) {
            out[key] = fillMissingKeys(sVal, tVal);
        } else {
            out[key] = tVal;
        }
    });

    // Include any extra keys present in target but not in source
    Object.keys(target).forEach(k => {
        if (out[k] === undefined) out[k] = target[k];
    });

    return out;
}

// Build normalized translations and add dynamic service items at runtime
export const normalizedTranslations = {
    en: {
        ...translations.en,
        hero: {
            ...(translations.en.hero || {}),
            // hero.items are derived from services.master (images remain there)
            items: servicesMaster.map(s => ({
                id: s.id,
                slug: s.slug,
                title: s.title?.en || '',
                category: s.category?.en || '',
                desc: s.desc?.en || '',
                // images kept in services.master and used by gallery components directly
                images: s.images || [],
                features: s.features?.en || []
            }))
        },
        services: {
            ...(translations.en.services || {}),
            items: servicesMaster.map(s => ({
                id: s.id,
                slug: s.slug,
                title: s.title?.en || '',
                category: s.category?.en || '',
                desc: s.desc?.en || '',
                images: s.images || [],
                products: s.products || [],
                features: s.features?.en || [],
                locations: (s.locations || []).map(loc => ({
                    key: loc.key,
                    title: (loc.title && loc.title.en) || loc.key,
                    images: loc.images || []
                }))
            }))
        }
    },
    ar: fillMissingKeys(
        // source is English base
        {
            ...translations.en,
            hero: {
                ...(translations.en.hero || {}),
                items: servicesMaster.map(s => ({
                    id: s.id,
                    slug: s.slug,
                    title: s.title?.ar || '',
                    category: s.category?.ar || '',
                    desc: s.desc?.ar || '',
                    images: s.images || [],
                    features: s.features?.ar || []
                }))
            },
            services: {
                ...(translations.en.services || {}),
                items: servicesMaster.map(s => ({
                    id: s.id,
                    slug: s.slug,
                    title: s.title?.ar || '',
                    category: s.category?.ar || '',
                    desc: s.desc?.ar || '',
                    images: s.images || [],
                    products: s.products || [],
                    features: s.features?.ar || [],
                    locations: (s.locations || []).map(loc => ({
                        key: loc.key,
                        title: (loc.title && loc.title.ar) || loc.key,
                        images: loc.images || []
                    }))
                }))
            }
        },
        translations.ar
    )
};

// Helper to get translation object for a language (falls back to English)
export function getTranslation(lang) {
    return normalizedTranslations[lang] || normalizedTranslations.en;
}

export default normalizedTranslations;