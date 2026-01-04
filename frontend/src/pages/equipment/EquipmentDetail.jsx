import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import servicesMaster from '../../i18n/services.master';
// DatasheetRequestForm removed: use ContactCTA anchor instead
import ContactCTA from '../../components/common/ContactCTA';
import DatasheetRequestForm from '../../components/common/DatasheetRequestForm';
import SubpageLayout from '../../components/layout/SubpageLayout';
import BackButton from '../../components/common/BackButton';
import DatasheetMessage from '../../components/common/DatasheetMessage';

export default function EquipmentDetail() {
    const { slug } = useParams();
    const { t, language } = useLanguage();
    const isRTL = typeof language === 'string' && language.toLowerCase().startsWith('ar');
    const [showDatasheet, setShowDatasheet] = useState(null);

    // Find product by slug in servicesMaster and keep parent service for fallback navigation
    let product = null;

    // tolerant matching: try exact slug, then normalized slug, then title matches (en/ar)
    const normalize = (s = '') => String(s || '').toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/(^-|-$)/g, '');
    const trySlug = (input, p) => {
        if (!input || !p) return false;
        try {
            const raw = decodeURIComponent(String(input));
            if (String(p.slug || '') === String(raw)) return true;
        } catch (e) {
            // ignore decode errors
        }
        // normalized comparisons
        const iNorm = normalize(input);
        const pNorm = normalize(p.slug || '');
        if (iNorm && pNorm && (iNorm === pNorm || iNorm.includes(pNorm) || pNorm.includes(iNorm))) return true;

        // also compare against titles (english and arabic) normalized
        const tEn = normalize(p.title?.en || '');
        const tAr = normalize(p.title?.ar || '');
        if (iNorm && (tEn === iNorm || tEn.includes(iNorm) || iNorm.includes(tEn))) return true;
        if (iNorm && (tAr === iNorm || tAr.includes(iNorm) || iNorm.includes(tAr))) return true;

        return false;
    };

    for (const service of servicesMaster) {
        if (service.products && Array.isArray(service.products)) {
            for (const p of service.products) {
                if (trySlug(slug, p)) {
                    product = p;
                    break;
                }
            }
            if (product) break;
        }
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('common_ui.notFound') || 'Equipment not found'}</h2>
                    <BackButton className="mt-4" />
                </div>
            </div>
        );
    }

    const title = product.title?.[language] || product.title?.en || 'Product';
    const titleHighlight = product.titleHighlight?.[language] || product.titleHighlight?.en || '';
    const description = product.usage?.[language] || product.usage?.en || product.desc?.[language] || product.desc?.en || '';
    const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

    // Use product date if provided in the data file
    const dateRaw = product.date || product.publishedAt || '';
    const formattedDate = dateRaw && !isNaN(Date.parse(dateRaw)) ? new Date(dateRaw).toLocaleDateString() : dateRaw;

    // Render title using the site's standard highlight style (gradient text)
    const renderTitle = () => {
        if (!titleHighlight) return <span className="text-gray-800 dark:text-white">{title}</span>;

        if (!title.includes(titleHighlight)) return <span className="text-gray-800 dark:text-white">{title}</span>;

        const parts = title.split(titleHighlight);
        const after = parts.slice(1).join(titleHighlight);

        return (
            <>
                <span className="text-gray-800 dark:text-white">{parts[0]}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">{titleHighlight}</span>
                <span className="text-gray-800 dark:text-white">{after}</span>
            </>
        );
    };


    // Back navigation is handled centrally by the unified BackButton resolver

    return (
        <SubpageLayout
            headerChildren={(
                <div className="pb-2">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        {/* Text content - order changes based on language so image can appear on the left in LTR */}
                        <div className={`p-0 md:pe-6 flex flex-col justify-start bg-transparent order-2 md:order-${isRTL ? '1' : '2'}`}>
                            <div className="space-y-4">
                                <div>
                                    <h1 className={`text-3xl md:text-4xl font-bold mb-1 leading-tight tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                                        {renderTitle()}
                                    </h1>
                                    {formattedDate && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            {formattedDate}
                                        </div>
                                    )}
                                    <p className={`text-base text-gray-600 dark:text-gray-400 leading-normal ${isRTL ? 'text-right' : 'text-left'}`}>
                                        {description}
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => setShowDatasheet(product.slug)}
                                        className="inline-flex items-center px-6 py-2.5 bg-brand text-white rounded-lg hover:bg-brand/90 transition-all shadow-md hover:shadow-lg text-base font-semibold"
                                    >
                                        {t('common_ui.requestDatasheet') || 'Request Datasheet'}
                                    </button>
                                    <DatasheetMessage productTitle={title} />
                                </div>
                            </div>
                        </div>

                        {/* Image - order switches so it appears on the left in LTR (to match Arabic layout) */}
                        <div className={`flex items-center ${isRTL ? 'justify-end' : 'justify-start'} ps-4 md:ps-8 order-1 md:order-${isRTL ? '2' : '1'}`}>
                            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-[720px] h-[420px] flex items-center justify-center">
                                <img
                                    src={images[0]}
                                    alt={title}
                                    className="max-h-full max-w-full object-contain rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        >
            {/* Contact / Quote CTA */}
            <ContactCTA id="contact-cta" className="mt-12" />
            {/* Datasheet request modal for equipment */}
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
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{t('common_ui.getInTouch') || 'Get In Touch'}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{t('common_ui.datasheetPrompt') || 'Please fill the form below to request the datasheet.'}</p>
                            </div>
                        </div>

                        <DatasheetRequestForm slug={showDatasheet} _title={title} _onClose={() => setShowDatasheet(null)} />

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <DatasheetMessage />
                        </div>
                    </div>
                </div>
            )}
        </SubpageLayout>
    );
}

