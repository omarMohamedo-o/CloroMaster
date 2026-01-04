import servicesMaster from '../i18n/services.master';
import { PATHS } from '../app/routes';

/**
 * Resolve a parent route for the given location/params.
 * This centralizes parent-route mapping so BackButton can use
 * the same logic across the app and both language modes.
 *
 * Rules implemented:
 * - Equipment pages (/equipment/:slug) -> parent service containing product
 * - Service pages (/service/:idOrSlug) -> HOME
 * - Admin submission detail (/admin/submissions/:id) -> ADMIN_SUBMISSIONS
 * - Videos -> HOME
 * - Fallback -> HOME
 */
export function resolveParentPath({ pathname = '', params = {} } = {}) {
    try {
        // Normalize
        const originalPath = String(pathname || '').trim();
        let path = originalPath;

        // Detect optional language prefix like /ar or /en so we can reapply it
        // to the resolved parent path later. We keep `path` without prefix
        // for matching, but remember the prefix for returned paths.
        const detectLangPrefix = (p) => {
            try {
                const m = String(p || '').match(/^\/(en|ar)(?=\/|$)/i);
                return m ? `/${m[1].toLowerCase()}` : '';
            } catch (e) {
                return '';
            }
        };
        const langPrefix = detectLangPrefix(originalPath);

        // Helper to strip query/hash and trailing slashes
        const strip = (s) => String(s || '').split(/[?#]/)[0].replace(/\/$/, '');

        // Normalize path by removing language prefix if present
        path = String(path || '').replace(new RegExp(`^${langPrefix}`), '');

        // Equipment page - prefer explicit param
        const slugParam = params && (params.slug || params.id || params.serviceId) || null;

        // no debug logs
        if (path.startsWith('/equipment/') || (slugParam && typeof slugParam === 'string')) {
            const raw = slugParam && typeof slugParam === 'string' ? slugParam : (path.split('/equipment/')[1] || '');
            const productSlug = strip(raw).split('/')[0];
            // continue without debug logs
            if (productSlug) {
                // find parent service containing this product slug
                const normInput = String(productSlug || '').toLowerCase();
                // continue without debug logs
                for (const service of servicesMaster) {
                    if (service.products && Array.isArray(service.products)) {
                        for (const p of service.products) {
                            const candidateSlug = String(p.slug || '').toLowerCase();
                            if (candidateSlug === normInput) return `${langPrefix}${PATHS.SERVICE(service.slug)}`;

                            // tolerant matches: ignore non-word characters and compare
                            const normalize = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                            if (normalize(candidateSlug) === normalize(normInput)) return `${langPrefix}${PATHS.SERVICE(service.slug)}`;

                            // also compare against titles if slug mismatch
                            const titleEn = (p.title && p.title.en) ? String(p.title.en).toLowerCase() : '';
                            const titleAr = (p.title && p.title.ar) ? String(p.title.ar).toLowerCase() : '';
                            if (titleEn && normalize(titleEn) === normalize(normInput)) return `${langPrefix}${PATHS.SERVICE(service.slug)}`;
                            if (titleAr && normalize(titleAr) === normalize(normInput)) return `${langPrefix}${PATHS.SERVICE(service.slug)}`;

                            // Partial-match fallback: check if normalized candidate contains input or input contains candidate
                            // This helps when slugs were modified or truncated in URLs.
                            try {
                                const nCand = normalize(candidateSlug);
                                const nIn = normalize(normInput);
                                if (nCand && nIn && (nCand.includes(nIn) || nIn.includes(nCand))) return `${langPrefix}${PATHS.SERVICE(service.slug)}`;
                            } catch (e) {
                                // ignore and continue
                            }
                        }
                    }
                }
                // continue
            }
            // no parent found - fall back to services listing (home)
            return `${langPrefix}${PATHS.HOME}`;
        }

        // Admin submission detail
        if (path.startsWith('/admin/submissions/')) return `${langPrefix}${PATHS.ADMIN_SUBMISSIONS}`;

        // Service pages - parent is site home (services grid is on home)
        if (path.startsWith('/service/')) {
            // Extract slug and if it's numeric or non-matching, still fallback to HOME
            return `${langPrefix}${PATHS.HOME}`;
        }

        // Videos page
        if (path === PATHS.VIDEOS || path.startsWith('/videos')) return `${langPrefix}${PATHS.HOME}`;

        // Default fallback
        return `${langPrefix}${PATHS.HOME}`;
    } catch (e) {
        return PATHS.HOME;
    }
}

export default resolveParentPath;
