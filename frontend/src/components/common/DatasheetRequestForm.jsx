import React, { useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const sanitizeSlug = (value) => {
    const trimmed = String(value || '').trim();
    return /^[A-Za-z0-9._-]+$/.test(trimmed) ? trimmed : null;
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
        try {
            const safeSlug = sanitizeSlug(slug);
            if (!safeSlug) {
                setErrors({ form: t ? t('common_ui.invalidRequest') : 'Invalid datasheet request.' });
                return;
            }
            // create contact record then open the datasheet
            if (api && api.createContact) {
                await api.createContact({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    company: form.company,
                    message: `${form.message}\n\nRequested datasheet: ${safeSlug}`,
                    subscribe: !!form.subscribe,
                    source: 'datasheet-download'
                });
            }

            setSubmitted(true);

            const url = `/files/datasheets/${safeSlug}.pdf`;
            // Try to fetch the PDF as a blob and trigger a direct download via an anchor element.
            try {
                const resp = await fetch(url, { method: 'GET' });
                if (!resp.ok) throw new Error('Failed to fetch file');
                const blob = await resp.blob();
                const blobUrl = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = blobUrl;
                // Prefer a meaningful filename for download
                a.download = `${safeSlug}.pdf`;
                // Append to DOM to make the click work in all browsers
                document.body.appendChild(a);
                a.click();
                a.remove();
                // Revoke the blob URL later to allow the download to complete
                setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
            } catch (fetchErr) {
                // If fetching as blob fails (CORS or server issues), fall back to opening the file URL directly.
                window.open(url, '_blank', 'noopener');
            }
        } catch (err) {
            // Log error to monitoring service in production
            setErrors({ form: err.message || 'Failed to submit. Please try again.' });
        } finally {
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
