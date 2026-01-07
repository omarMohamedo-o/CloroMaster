import React, { useState } from 'react';
// api helper removed - using fetch directly for datasheet requests
import { useLanguage } from '../../context/LanguageContext';

const sanitizeSlug = (value) => {
    // Allow filenames that may include spaces, dots, parentheses, dashes and underscores.
    // Reject any path traversal attempts or slashes.
    const trimmed = String(value || '').trim();
    if (!trimmed) return null;
    if (trimmed.includes('/') || trimmed.includes('\\')) return null;
    return /^[A-Za-z0-9 ._()-]+$/.test(trimmed) ? trimmed : null;
};

export default function DatasheetRequestForm({ slug, _title, _onClose }) {
    const { t } = useLanguage();
    // helper to avoid showing raw key strings when translation is missing
    const tr = (key, fallback) => {
        if (typeof t !== 'function') return fallback;
        try {
            const v = t(key);
            if (!v || typeof v !== 'string') return fallback;
            // if the translator returns the key itself, treat as missing
            if (v === key) return fallback;
            return v;
        } catch (e) {
            return fallback;
        }
    };
    const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '', subscribe: false });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = t ? t('contact.errors.nameRequired') : 'Name is required';
        if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = t ? t('contact.errors.emailRequired') : 'Valid email is required';
        if (!form.phone.trim()) e.phone = t ? t('contact.errors.phoneRequired') : 'Phone number is required';
        return e;
    };

    const handleChange = (key) => (e) => setForm(prev => ({ ...prev, [key]: (key === 'subscribe') ? e.target.checked : e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) return;
        setSubmitting(true);
        // Detect mobile devices — mobile browsers are more likely to block or mishandle
        // programmatic popups, so use same-tab navigation there for reliability.
        const isMobile = typeof navigator === 'object' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
        // Open a blank popup immediately to avoid popup blockers on desktop — will be navigated later
        let popup = null;
        if (!isMobile) {
            try {
                popup = window.open('about:blank', '_blank');
            } catch (err) {
                popup = null;
            }
        }

        try {
            const safeSlug = sanitizeSlug(slug);
            if (!safeSlug) {
                if (popup) try { popup.close(); } catch (e) { void 0; }
                setErrors({ form: t ? t('common_ui.invalidRequest') : 'Invalid datasheet request.' });
                setSubmitting(false);
                return;
            }

            // Split name into first and last name
            const nameParts = form.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || nameParts[0]; // Use first name as last name if only one word

            // Request datasheet from backend API
            const response = await fetch('/api/datasheet/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: form.email,
                    phone: form.phone,
                    company: form.company || '',
                    country: '', // Could be added to form if needed
                    datasheetSlug: safeSlug
                })
            });

            if (!response.ok) {
                throw new Error('Failed to request datasheet');
            }

            const data = await response.json();

            // Download the datasheet using the provided token
            if (data.downloadUrl) {
                try {
                    const parsed = new URL(data.downloadUrl, window.location.href);
                    if (parsed.origin === window.location.origin) {
                        const safeHref = parsed.href;
                        // If we're on mobile, navigate the current tab (more reliable). On desktop,
                        // prefer the popup-first approach so the user stays on the page.
                        if (isMobile) {
                            // Navigate same tab — mobile browsers typically allow this user-initiated navigation.
                            window.location.assign(safeHref);
                        } else {
                            // Desktop: if we opened a popup earlier, navigate it now (preserves user gesture).
                            if (popup) {
                                try {
                                    popup.location.href = safeHref;
                                } catch (err) {
                                    try { popup.close(); } catch (e) { void 0; }
                                    const fallbackWin = window.open(safeHref, '_blank', 'noopener');
                                    if (!fallbackWin) window.location.assign(safeHref);
                                }
                            } else {
                                // Popup was blocked — try opening now (may be blocked). As a last resort navigate current tab.
                                const newWin = window.open(safeHref, '_blank', 'noopener');
                                if (!newWin) window.location.assign(safeHref);
                            }
                        }

                        // Mark as submitted after successful navigation
                        setSubmitted(true);
                        setSubmitting(false);

                        // Auto-close modal after opening starts (give popup time to load)
                        if (_onClose) {
                            try { setTimeout(_onClose, 800); } catch (e) { void 0; }
                        }
                    } else {
                        if (popup) try { popup.close(); } catch (e) { void 0; }
                        setErrors({ form: t ? t('common_ui.datasheetInvalidUrl') : 'Received invalid download URL.' });
                        setSubmitting(false);
                    }
                } catch (err) {
                    if (popup) try { popup.close(); } catch (e) { void 0; }
                    setErrors({ form: t ? t('common_ui.datasheetInvalidUrl') : 'Received invalid download URL.' });
                    setSubmitting(false);
                }
            } else {
                // No download URL in response
                if (popup) try { popup.close(); } catch (e) { void 0; }
                setErrors({ form: 'Server did not return a download link. Please try again.' });
                setSubmitting(false);
            }
        } catch (err) {
            // Close popup on error
            if (popup) try { popup.close(); } catch (e) { void 0; }
            // Log error for debugging
            // eslint-disable-next-line no-console
            console.error('Datasheet request failed:', err);
            setErrors({ form: err.message || 'Failed to submit. Please try again.' });
            setSubmitting(false);
        }

    };

    if (submitted) {
        return (
            <div className="rounded-md bg-brand/10 border border-brand/30 p-4 text-sm text-brand-dark">
                {tr('common_ui.datasheetSubmitted', 'Thank you — the datasheet download should begin. Check your email for a copy.')}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{tr('contact.form.name', 'Your Name')} <span className="text-red-500">*</span></label>
                <input
                    value={form.name}
                    onChange={handleChange('name')}
                    className={`w-full p-3 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{tr('contact.form.email', 'Your Email')} <span className="text-red-500">*</span></label>
                <input
                    value={form.email}
                    onChange={handleChange('email')}
                    type="email"
                    className={`w-full p-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{tr('contact.form.phone', 'Phone Number')} <span className="text-red-500">*</span></label>
                <input
                    value={form.phone}
                    onChange={handleChange('phone')}
                    className={`w-full p-3 rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20`}
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{tr('contact.form.company', 'Company Name')}</label>
                <input
                    value={form.company}
                    onChange={handleChange('company')}
                    className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{tr('contact.form.message', 'Your Message')}</label>
                <textarea
                    value={form.message}
                    onChange={handleChange('message')}
                    rows={4}
                    className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
            </div>

            <div className="md:col-span-2 flex items-start gap-3 mt-2">
                <input
                    id="subscribe"
                    type="checkbox"
                    checked={form.subscribe}
                    onChange={handleChange('subscribe')}
                    className="w-4 h-4 mt-1 accent-brand"
                />
                <label htmlFor="subscribe" className="text-sm text-gray-700 dark:text-gray-300">{tr('contact.form.subscribe', 'I would like to receive periodic emails from ChloroMaster')}</label>
            </div>

            {errors.form && <div className="md:col-span-2 text-sm text-red-600 mt-2">{errors.form}</div>}

            <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-brand to-brand-secondary hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-50"
                >
                    {submitting ? tr('contact.form.sending', 'Sending...') : tr('common_ui.requestDatasheet', 'Request Datasheet')}
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">{tr('common_ui.fieldsRequired', 'Fields marked * are required.')}</span>
            </div>
        </form>
    );
}
