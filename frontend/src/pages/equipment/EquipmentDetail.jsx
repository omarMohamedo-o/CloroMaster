import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { FaPhone } from 'react-icons/fa';
const SubpageLayout = React.lazy(() => import('../../components/layout/SubpageLayout'));
import DatasheetRequestForm from '../../components/common/DatasheetRequestForm';
import GalleryCard from '../../components/gallery/GalleryCard';

function slugToName(slug) {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function EquipmentDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Prefer localized services from translations; fall back to canonical data
    const localized = t('services.items');
    const services = Array.isArray(localized) && localized.length ? localized : require('../../data/services').default;

    // Find all images and services that reference this equipment slug
    const matched = [];
    services.forEach(s => {
        (s.images || []).forEach(img => {
            const name = img.split('/').pop();
            const base = name.replace(/\.(jpeg|jpg|png|webp)$/i, '').replace(/[_-]?\d+$/i, '').trim();
            const itemSlug = base.toString()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');
            if (itemSlug === slug) {
                matched.push({ service: s, img, base });
            }
        });
    });

    if (matched.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Equipment not found</h2>
                    <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-brand text-white rounded">Back</button>
                </div>
            </div>
        );
    }

    const title = slugToName(matched[0].base.replace(/[_-]?\d+$/i, ''));
    const images = Array.from(new Set(matched.map(m => m.img)));
    const relatedServices = Array.from(new Map(matched.map(m => [m.service.id, m.service])).values());

    const { language } = useLanguage();
    const [showForm, setShowForm] = useState(false);

    // removed last-modified fetch — do not display 'Last updated' on equipment pages

    return (
        <React.Suspense fallback={<div className="container mx-auto px-6">Loading...</div>}>
            <SubpageLayout
                title={title}
                subtitle={`${title} is a high-quality, corrosion-resistant component designed for chlorine system applications and industrial gas handling.`}
                onBack={() => navigate(-1)}
                headerChildren={(
                    <>
                        <div className={`grid ${images.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                            {images.map((src, i) => (
                                <GalleryCard key={i} src={src} name={`${title} ${i + 1}`} disableLink={true} />
                            ))}
                        </div>

                        <div className="mt-6">
                            <p className="text-gray-700 dark:text-gray-300 mb-4">Manufactured to industry standards with configurable options for materials and sizes. For full technical details, download the datasheet below.</p>

                            <div className="mb-6">
                                {!showForm ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setShowForm(true);
                                            }}
                                            className="inline-flex items-center px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
                                        >
                                            Request Datasheet
                                        </button>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{t ? t('common_ui.datasheetUnavailable') : 'If the datasheet is not available, contact us and we\'ll provide it.'}</p>
                                    </>
                                ) : null}

                                {showForm && (
                                    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-6">
                                        <div className="absolute inset-0 bg-black/50" onClick={() => {
                                            // close modal when clicking backdrop
                                            setShowForm(false);
                                        }} />

                                        <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 overflow-auto">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Get In Touch</h3>
                                                <button onClick={() => {
                                                    setShowForm(false);
                                                }} className="text-gray-500 hover:text-gray-700 dark:text-gray-300">
                                                    ✕
                                                </button>
                                            </div>

                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Please fill the form below to receive the datasheet.</p>
                                            <DatasheetRequestForm slug={slug} title={title} onClose={() => {
                                                setShowForm(false);
                                            }} />

                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{t ? t('common_ui.datasheetUnavailable') : 'If the datasheet is not available, contact us and we\'ll provide it.'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            >
                <div className="p-0">
                    {/* Contact / Quote CTA */}
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

                                <a href={`tel:${require('../../config/config').default.contact.phone.replace(/\s+/g, '')}`} className="px-5 py-3 rounded-lg border border-teal-500 text-teal-700 hover:bg-teal-50 transition-colors inline-flex items-center gap-2">
                                    <FaPhone />
                                    {t('cta.callUs') || 'Call Us'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </SubpageLayout>
        </React.Suspense>
    );
}

function DownloadContactForm({ slug, title, onClose }) {
    const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '', subscribe: false });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Valid email is required';
        if (!form.phone.trim()) e.phone = 'Phone number is required';
        return e;
    };

    const handleChange = (key) => (e) => setForm(prev => ({ ...prev, [key]: (key === 'subscribe') ? e.target.checked : e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) return;
        setSubmitting(true);
        // After creating the contact, open the datasheet in a new tab/window.
        try {
            // Create a contact record before allowing download
            await api.createContact({
                name: form.name,
                email: form.email,
                phone: form.phone,
                company: form.company,
                message: `${form.message}\n\nRequested datasheet: ${slug}`,
                subscribe: !!form.subscribe,
                source: 'datasheet-download'
            });

            setSubmitted(true);

            // Open the PDF in the prepared window (or a new tab as fallback)
            const url = `/files/datasheets/${slug}.pdf`;
            // Open the datasheet in a new tab/window (user-initiated by form submit)
            window.open(url, '_blank', 'noopener');
        } catch (err) {
            console.error('Failed to submit contact before download', err);
            setErrors({ form: err.message || 'Failed to submit. Please try again.' });
            // nothing to close — we didn't open a temporary window
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                Thank you — the datasheet download should begin. Check your email for a copy.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                <input value={form.name} onChange={handleChange('name')} className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address *</label>
                <input value={form.email} onChange={handleChange('email')} className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number *</label>
                <input value={form.phone} onChange={handleChange('phone')} className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                <input value={form.company} onChange={handleChange('company')} className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea value={form.message} onChange={handleChange('message')} rows={3} className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
                <input id="subscribe" type="checkbox" checked={form.subscribe} onChange={handleChange('subscribe')} />
                <label htmlFor="subscribe" className="text-sm text-gray-700 dark:text-gray-300">I would like to receive periodic emails from ChloroMaster</label>
            </div>

            {errors.form && <div className="md:col-span-2 text-sm text-red-600">{errors.form}</div>}

            <div className="md:col-span-2 flex items-center gap-3">
                <button type="submit" disabled={submitting} className="inline-flex items-center px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors">
                    {submitting ? 'Sending...' : 'Request Datasheet'}
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">Fields marked * are required.</span>
            </div>
        </form>
    );
}
