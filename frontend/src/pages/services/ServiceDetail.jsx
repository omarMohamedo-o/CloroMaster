import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PATHS } from '../../app/routes';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import servicesMaster from '../../i18n/services.master';
const SubpageLayout = React.lazy(() => import('../../components/layout/SubpageLayout'));
import BackButton from '../../components/common/BackButton';
import DatasheetRequestForm from '../../components/common/DatasheetRequestForm';
import ContactCTA from '../../components/common/ContactCTA';
import DatasheetMessage from '../../components/common/DatasheetMessage';
import GalleryCard from '../../components/gallery/GalleryCard';
import Lightbox from '../../components/gallery/Lightbox';
import { motion } from 'framer-motion';
import { imageVariant, serviceCardsContainer } from '../../lib/animations';

export default function ServiceDetail() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    // Find service from servicesMaster (which has slugs)
    let masterService;
    let shouldRedirect = false;

    if (!isNaN(serviceId)) {
        // Numeric ID - find service and redirect to slug-based URL
        masterService = servicesMaster.find(s => s.id === parseInt(serviceId));
        shouldRedirect = true;
    } else {
        // Slug-based lookup
        masterService = servicesMaster.find(s => s.slug === serviceId);
    }

    // Use masterService directly as it contains all data including localization
    const service = masterService;
    const canonicalService = masterService;

    // All hooks must be called before any early returns
    const [showDatasheet, setShowDatasheet] = React.useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
    const [projectImageIndexes, setProjectImageIndexes] = useState({});

    useEffect(() => {
        // Check if there's a hash in the URL (for scrolling to specific project)
        const hash = window.location.hash.slice(1); // Remove the '#'
        if (hash) {
            // Wait for the page to render, then scroll to the element
            setTimeout(() => {
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.scrollTo(0, 0);
                }
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }, [serviceId]);

    // Redirect numeric IDs to slug-based URLs
    useEffect(() => {
        if (shouldRedirect && masterService && masterService.slug) {
            navigate(PATHS.SERVICE(masterService.slug), { replace: true });
        }
    }, [shouldRedirect, masterService, navigate]);

    // Image discovery effect - must be before early return
    useEffect(() => {
        async function checkUrl(url) {
            try {
                const res = await fetch(url, { method: 'HEAD' });
                return res && res.ok;
            } catch (e) {
                return false;
            }
        }

        async function discoverForLocation(loc) {
            // derive candidate service folder from the service main image if available
            const firstImg = (service && service.images && service.images[0]) || '';
            const parts = firstImg.split('/').filter(Boolean);
            const serviceFolder = parts[3] || (service && service.slug) || '';

            const titleHint = (loc.title && (loc.title.en || '')) || '';
            const candidates = new Set();
            if (loc.key) candidates.add(loc.key);
            if (loc.key) candidates.add(loc.key.replace(/-/g, ' '));
            if (loc.key) candidates.add(loc.key.replace(/-/g, '-'));
            if (titleHint) candidates.add(titleHint.split('—')[0].trim());
            // Capitalize variants
            Array.from(candidates).forEach(c => {
                if (typeof c === 'string') {
                    const cap = c.split(/[- ]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    candidates.add(cap);
                }
            });

            const maxImages = 12;
            const found = [];

            for (const candidate of candidates) {
                if (!candidate) continue;
                const base = `/images/services/${serviceFolder}/${candidate}`;
                // try numbered jpg first, then webp
                for (let i = 1; i <= maxImages; i++) {
                    const jpg = `${base}/${i}.jpg`;
                    const webp = `${base}/${i}.webp`;
                    if (await checkUrl(jpg)) found.push(jpg);
                    else if (await checkUrl(webp)) found.push(webp);
                    // stop early if we found many
                    if (found.length >= 8) break;
                }
                if (found.length) break; // prefer first matching folder
            }

            // Images discovered but not used in current implementation
        }

        if (service && service.locations && Array.isArray(service.locations)) {
            service.locations.forEach(loc => {
                if (!loc.images || loc.images.length === 0) {
                    discoverForLocation(loc);
                }
            });
        }
    }, [service, language]);

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Service Not Found</h2>
                    <BackButton className="mx-auto" />
                </div>
            </div>
        );
    }

    // const Icon = iconMap[service.category] || FaCog;

    // Localized title/description
    const displayTitle = typeof service.title === 'object' ? (service.title?.[language] || service.title?.en || Object.values(service.title || {})[0]) : service.title;
    const displayDesc = typeof service.desc === 'object' ? (service.desc?.[language] || service.desc?.en || Object.values(service.desc || {})[0]) : service.desc;
    // Optional localized highlighted word from canonical service data
    const displayTitleHighlight = (service && service.titleHighlight && (service.titleHighlight[language] || service.titleHighlight.en))
        || (canonicalService && canonicalService.titleHighlight && (canonicalService.titleHighlight[language] || canonicalService.titleHighlight.en))
        || '';

    return (
        <React.Suspense fallback={<div className="container mx-auto px-6">Loading...</div>}>
            <SubpageLayout
                title={displayTitle}
                titleHighlight={displayTitleHighlight}
                subtitle={displayDesc}
            >
                {/* Special layout for Systems Installation and Commissioning service (id=2) */}
                {service.id === 2 && canonicalService && canonicalService.products && Array.isArray(canonicalService.products) ? (
                    <div className="space-y-6 mb-6">
                        {canonicalService.products.map((project, projectIndex) => {
                            const projectTitle = project.title?.[language] || project.title?.en || 'Project';
                            const projectTitleHighlight = project.titleHighlight?.[language] || project.titleHighlight?.en || '';
                            const projectImages = project.images && project.images.length > 0 ? project.images : (project.image ? [project.image] : []);
                            const currentImageIndex = projectImageIndexes[project.id] || 0;

                            const nextImage = () => {
                                setProjectImageIndexes(prev => ({
                                    ...prev,
                                    [project.id]: ((prev[project.id] || 0) + 1) % projectImages.length
                                }));
                            };

                            const prevImage = () => {
                                setProjectImageIndexes(prev => ({
                                    ...prev,
                                    [project.id]: ((prev[project.id] || 0) - 1 + projectImages.length) % projectImages.length
                                }));
                            };

                            // Render title with highlight
                            const renderProjectTitle = () => {
                                if (projectTitleHighlight && projectTitleHighlight.trim() !== '') {
                                    const highlightIndex = projectTitle.indexOf(projectTitleHighlight);
                                    if (highlightIndex !== -1) {
                                        const beforeHighlight = projectTitle.substring(0, highlightIndex);
                                        const afterHighlight = projectTitle.substring(highlightIndex + projectTitleHighlight.length);
                                        return (
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {beforeHighlight}
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">
                                                    {projectTitleHighlight}
                                                </span>
                                                {afterHighlight}
                                            </h3>
                                        );
                                    }
                                }
                                return (
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {projectTitle}
                                    </h3>
                                );
                            };

                            return (
                                <motion.div
                                    key={project.id || projectIndex}
                                    id={project.slug || `project-${project.id}`}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden scroll-mt-24"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: projectIndex * 0.1 }}
                                >
                                    <div className="grid md:grid-cols-2 gap-4 p-4">
                                        {/* Left: Image Carousel */}
                                        <div className="relative">
                                            {projectImages.length > 0 ? (
                                                <div className="relative bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden">
                                                    <img
                                                        src={projectImages[currentImageIndex]}
                                                        alt={`${projectTitle} - ${currentImageIndex + 1}`}
                                                        className="w-full h-[400px] object-cover"
                                                    />

                                                    {/* Navigation arrows - only show if multiple images */}
                                                    {projectImages.length > 1 && (
                                                        <>
                                                            <button
                                                                onClick={prevImage}
                                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors z-10"
                                                                aria-label="Previous image"
                                                            >
                                                                <FaChevronLeft size={20} />
                                                            </button>
                                                            <button
                                                                onClick={nextImage}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors z-10"
                                                                aria-label="Next image"
                                                            >
                                                                <FaChevronRight size={20} />
                                                            </button>

                                                            {/* Image counter */}
                                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                                                                {currentImageIndex + 1} / {projectImages.length}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-gradient-to-br from-brand/10 to-brand-secondary/10 rounded-xl h-[400px] flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="text-6xl mb-4 text-brand">🏗️</div>
                                                        <p className="text-gray-600 dark:text-gray-400">{projectTitle}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Project Details */}
                                        <div className="flex flex-col justify-center space-y-4">
                                            {renderProjectTitle()}

                                            {project.scope && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-brand uppercase mb-1">
                                                        {language === 'ar' ? 'نطاق العمل' : 'Scope'}
                                                    </h4>
                                                    <p className="text-gray-700 dark:text-gray-300">
                                                        {project.scope[language] || project.scope.en}
                                                    </p>
                                                </div>
                                            )}

                                            {project.workExecuted && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-brand uppercase mb-1">
                                                        {language === 'ar' ? 'الأعمال المنفذة' : 'Work Executed'}
                                                    </h4>
                                                    <p className="text-gray-700 dark:text-gray-300">
                                                        {project.workExecuted[language] || project.workExecuted.en}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                {project.capacity && (
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                                                            {language === 'ar' ? 'القدرة' : 'Capacity'}
                                                        </h4>
                                                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                                                            {project.capacity}
                                                        </p>
                                                    </div>
                                                )}

                                                {project.client && (
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                                                            {language === 'ar' ? 'العميل' : 'Client'}
                                                        </h4>
                                                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                                                            {project.client}
                                                        </p>
                                                    </div>
                                                )}

                                                {project.year && (
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                                                            {language === 'ar' ? 'السنة' : 'Year'}
                                                        </h4>
                                                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                                                            {project.year}
                                                        </p>
                                                    </div>
                                                )}

                                                {project.location && (
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                                                            {language === 'ar' ? 'الموقع' : 'Location'}
                                                        </h4>
                                                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                                                            {project.location[language] || project.location.en}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <>
                        {/* Service Images - either per-location galleries (preferred) or fall back to existing equipment gallery */}
                        {service.locations && Array.isArray(service.locations) && service.locations.length > 0 ? (
                            <motion.div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 mb-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={serviceCardsContainer}>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{
                                    (service && service.locationsTitle && (service.locationsTitle[language] || service.locationsTitle.en))
                                    || (canonicalService && canonicalService.locationsTitle && (canonicalService.locationsTitle[language] || canonicalService.locationsTitle.en))
                                    || t('services.locationsTitle') || 'Locations'
                                }</h2>
                                <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
                                    {service.locations.map((loc, idx) => {
                                        const imgs = (loc.images || []).filter(Boolean);
                                        if (!imgs || imgs.length === 0) return null;
                                        const title = (loc.title && (loc.title[language] || loc.title.en)) || loc.key || (`Location ${idx + 1}`);

                                        return (
                                            <motion.div key={loc.key || idx} className="col-span-1" variants={imageVariant} custom={idx}>
                                                <GalleryCard
                                                    src={imgs[0]}
                                                    name={title}
                                                    onClick={() => {
                                                        setLightboxImages(imgs);
                                                        setLightboxStartIndex(0);
                                                        setLightboxOpen(true);
                                                    }}
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            (() => {
                                const rawImages = (service.images || []).filter(Boolean);
                                if (!rawImages || rawImages.length === 0) return null;

                                const normalize = (s) => s.toString().toLowerCase().replace(/\.(jpeg|jpg|png|webp)$/i, '').replace(/[^a-z0-9]+/g, ' ').trim();
                                // Use slug (language neutral) to identify the main/hero image
                                const serviceNameKey = normalize(service.slug || displayTitle || '');
                                const filtered = rawImages.filter(img => {
                                    const name = img.split('/').pop() || '';
                                    return normalize(name) !== serviceNameKey; // exclude main/hero image
                                }).filter(Boolean);
                                if (!filtered || filtered.length === 0) return null;

                                const uniqueImgs = Array.from(new Set(filtered));

                                const formatName = (src) => {
                                    const name = (src.split('/').pop() || '').replace(/\.(jpeg|jpg|png|webp)$/i, '');
                                    return name.replace(/[-_]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                                };

                                return (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('common_ui.equipmentGallery') || 'Equipment Gallery'}</h2>
                                        <div className={`grid ${uniqueImgs.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                                            {uniqueImgs.map((src, idx) => {
                                                const name = formatName(src);
                                                // Find matching product for this image to use the correct slug and translated title
                                                let matchedSlug = null;
                                                let matchedProduct = null;
                                                if (canonicalService && canonicalService.products && Array.isArray(canonicalService.products)) {
                                                    // First, try to match by exact image path
                                                    const exactMatch = canonicalService.products.find(p => p.image === src);
                                                    if (exactMatch) {
                                                        matchedSlug = exactMatch.slug;
                                                        matchedProduct = exactMatch;
                                                    } else {
                                                        // Fallback: try to match by title
                                                        const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, '');
                                                        const match = canonicalService.products.find(p => {
                                                            const titleEn = p.title?.en || '';
                                                            const titleNormalized = titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '');
                                                            // Check for exact match first, then check if titles are similar
                                                            return normalized === titleNormalized ||
                                                                (normalized.length > 10 && titleNormalized.length > 10 &&
                                                                    (normalized.includes(titleNormalized) || titleNormalized.includes(normalized)));
                                                        });
                                                        if (match) {
                                                            matchedSlug = match.slug;
                                                            matchedProduct = match;
                                                        }
                                                    }
                                                }
                                                // Get translated title if product was matched, otherwise use filename
                                                const displayName = matchedProduct ? (matchedProduct.title?.[language] || matchedProduct.title?.en || name) : name;
                                                // Fallback: generate slug from name
                                                const slug = matchedSlug || name.toString().toLowerCase().replace(/[_-]?\d+$/i, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                                                return (
                                                    <GalleryCard key={idx} src={src} name={displayName} slug={slug} />
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()
                        )}
                    </>
                )}

                {/* Contact / Quote CTA */}
                <ContactCTA />

                {/* Datasheet request modal */}
                {showDatasheet && (
                    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 md:p-6">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDatasheet(null)} />
                        <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-auto">
                            <div className="relative mb-6">
                                <button
                                    onClick={() => setShowDatasheet(null)}
                                    className="absolute right-0 top-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Close"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="text-center pr-8">
                                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Get In Touch</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Please fill the form below to receive the datasheet.</p>
                                </div>
                            </div>

                            <DatasheetRequestForm slug={showDatasheet} title={service.title} onClose={() => setShowDatasheet(null)} />

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <DatasheetMessage />
                            </div>
                        </div>
                    </div>
                )}
                {/* Lightbox modal for viewing location images */}
                {lightboxOpen && (
                    <Lightbox images={lightboxImages} startIndex={lightboxStartIndex} onClose={() => setLightboxOpen(false)} />
                )}
            </SubpageLayout>
        </React.Suspense>
    );
}


// GalleryCard component moved to shared component: ../../components/gallery/GalleryCard

// Helper functions removed: service detail pages now only show Equipment Gallery, Resources (download) and Contact CTA
