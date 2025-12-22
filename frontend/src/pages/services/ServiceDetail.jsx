import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaCog, FaIndustry, FaTools, FaShieldAlt, FaPhone } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import config from '../../config/config';
import servicesData from '../../data/services';
const SubpageLayout = React.lazy(() => import('../../components/layout/SubpageLayout'));
import DatasheetRequestForm from '../../components/common/DatasheetRequestForm';
import GalleryCard from '../../components/gallery/GalleryCard';
import Lightbox from '../../components/gallery/Lightbox';
const iconMap = {
    'Water Treatment': FaIndustry,
    'معالجة المياه': FaIndustry,
    'Safety Systems': FaShieldAlt,
    'أنظمة السلامة': FaShieldAlt,
    'Engineering': FaCog,
    'الهندسة': FaCog,
    'Manufacturing': FaTools,
    'التصنيع': FaTools,
    'Maintenance': FaTools,
    'الصيانة': FaTools,
    'Project Management': FaCheckCircle,
    'إدارة المشاريع': FaCheckCircle
};

export default function ServiceDetail() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    // Prefer localized services from translations; fall back to the canonical data file
    const localized = t('services.items');
    const services = Array.isArray(localized) && localized.length ? localized : servicesData;
    const service = services.find(s => s.id === parseInt(serviceId)) || services[parseInt(serviceId) - 1];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [serviceId]);

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Service Not Found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const Icon = iconMap[service.category] || FaCog;
    const [showDatasheet, setShowDatasheet] = React.useState(null);

    // Localized title/description
    const displayTitle = typeof service.title === 'object' ? (service.title?.[language] || service.title?.en || Object.values(service.title || {})[0]) : service.title;
    const displayDesc = typeof service.desc === 'object' ? (service.desc?.[language] || service.desc?.en || Object.values(service.desc || {})[0]) : service.desc;

    // discoveredImages: dynamic discovery of images placed under public/images for locations
    const [discoveredImages, setDiscoveredImages] = useState({});

    // Lightbox state for per-location galleries
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

    useEffect(() => {
        let mounted = true;

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
            const firstImg = (service.images && service.images[0]) || '';
            const parts = firstImg.split('/').filter(Boolean);
            const serviceFolder = parts[3] || service.slug || '';

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

            if (mounted) {
                setDiscoveredImages(prev => ({ ...prev, [loc.key]: found }));
            }
        }

        if (service && service.locations && Array.isArray(service.locations)) {
            service.locations.forEach(loc => {
                if (!loc.images || loc.images.length === 0) {
                    discoverForLocation(loc);
                }
            });
        }

        return () => { mounted = false; };
    }, [service, language]);

    return (
        <React.Suspense fallback={<div className="container mx-auto px-6">Loading...</div>}>
            <SubpageLayout
                title={displayTitle}
                subtitle={displayDesc}
                onBack={() => navigate(-1)}
            >
                {/* Service Images - either per-location galleries (preferred) or fall back to existing equipment gallery */}
                {service.locations && Array.isArray(service.locations) && service.locations.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('services.locationsTitle') || 'Locations'}</h2>
                        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
                            {service.locations.map((loc, idx) => {
                                const imgs = (loc.images || []).filter(Boolean);
                                if (!imgs || imgs.length === 0) return null;
                                const title = (loc.title && (loc.title[language] || loc.title.en)) || loc.key || (`Location ${idx + 1}`);

                                return (
                                    <div key={loc.key || idx} className="col-span-1">
                                        <GalleryCard
                                            src={imgs[0]}
                                            name={title}
                                            onClick={() => {
                                                setLightboxImages(imgs);
                                                setLightboxStartIndex(0);
                                                setLightboxOpen(true);
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
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
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('common_ui.equipmentGallery') || 'Equipment Gallery'}</h2>
                                <div className={`grid ${uniqueImgs.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                                    {uniqueImgs.map((src, idx) => {
                                        const name = formatName(src);
                                        // normalize slug the same way EquipmentDetail expects (strip trailing numeric suffixes)
                                        const slug = name.toString().toLowerCase().replace(/[_-]?\d+$/i, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                                        return (
                                            <GalleryCard key={idx} src={src} name={name} slug={slug} />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()
                )}

                {/* Contact / Quote CTA */}
                {/* Downloads */}
                {service.datasheets && service.datasheets.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Downloads</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {service.datasheets.map(ds => (
                                <div key={ds.slug} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{(ds.title && (ds.title[language] || ds.title.en)) || ds.slug}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-300">{ds.path}</div>
                                    </div>
                                    <div>
                                        <button onClick={() => setShowDatasheet(ds.slug)} className="px-4 py-2 bg-brand text-white rounded-md">Request</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{t('cta.title') || 'Get a Quote or Consultation'}</h3>
                        <p className="text-center text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">{t('cta.subtitle') || 'Contact our team for project-specific enquiries, quotes, or site visits.'}</p>

                        <div className="flex items-center justify-center gap-4 mt-6">
                            <button
                                onClick={() => navigate('/', { state: { scrollTo: 'contact' } })}
                                className="px-6 py-3 rounded-lg text-white shadow-md bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 transition-colors"
                            >
                                {t('cta.contactForm') || 'Contact Form'}
                            </button>

                            <a href={`tel:${config.contact.phone.replace(/\s+/g, '')}`} className="px-5 py-3 rounded-lg border border-teal-500 text-teal-700 hover:bg-teal-50 transition-colors inline-flex items-center gap-2">
                                <FaPhone />
                                {t('cta.callUs') || 'Call Us'}
                            </a>
                        </div>
                    </div>
                </div>
                {/* Datasheet request modal */}
                {showDatasheet && (
                    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setShowDatasheet(null)} />
                        <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 overflow-auto">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Get In Touch</h3>
                                <button onClick={() => setShowDatasheet(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300">✕</button>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Please fill the form below to receive the datasheet.</p>
                            <DatasheetRequestForm slug={showDatasheet} title={service.title} onClose={() => setShowDatasheet(null)} />

                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{t ? t('common_ui.datasheetUnavailable') : 'If the datasheet is not available, contact us and we\'ll provide it.'}</p>
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
