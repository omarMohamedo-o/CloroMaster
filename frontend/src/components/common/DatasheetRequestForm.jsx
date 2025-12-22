import React, { useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function DatasheetRequestForm({ slug, title, onClose }) {
    const { t } = useLanguage();
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
            // create contact record then open the datasheet
            if (api && api.createContact) {
                await api.createContact({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    company: form.company,
                    message: `${form.message}\n\nRequested datasheet: ${slug}`,
                    subscribe: !!form.subscribe,
                    source: 'datasheet-download'
                });
            }

            setSubmitted(true);

            const url = `/files/datasheets/${slug}.pdf`;
            window.open(url, '_blank', 'noopener');
        } catch (err) {
            console.error('Failed to submit contact before download', err);
            setErrors({ form: err.message || 'Failed to submit. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                {t ? t('common_ui.datasheetSubmitted') : 'Thank you — the datasheet download should begin. Check your email for a copy.'}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t ? t('contact.form.name') : 'Name'} *</label>
                <input value={form.name} onChange={handleChange('name')} className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t ? t('contact.form.email') : 'Email Address'} *</label>
                <input value={form.email} onChange={handleChange('email')} className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t ? t('contact.form.phone') : 'Phone Number'} *</label>
                <input value={form.phone} onChange={handleChange('phone')} className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t ? t('contact.form.company') : 'Company Name'}</label>
                <input value={form.company} onChange={handleChange('company')} className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t ? t('contact.form.message') : 'Message'}</label>
                <textarea value={form.message} onChange={handleChange('message')} rows={3} className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2" />
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
                <input id="subscribe" type="checkbox" checked={form.subscribe} onChange={handleChange('subscribe')} />
                <label htmlFor="subscribe" className="text-sm text-gray-700 dark:text-gray-300">{t ? t('contact.form.subscribe') : 'I would like to receive periodic emails from ChloroMaster'}</label>
            </div>

            {errors.form && <div className="md:col-span-2 text-sm text-red-600">{errors.form}</div>}

            <div className="md:col-span-2 flex items-center gap-3">
                <button type="submit" disabled={submitting} className="inline-flex items-center px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors">
                    {submitting ? (t ? t('contact.form.sending') : 'Sending...') : (t ? t('common_ui.requestDatasheet') + (title ? ` — ${title}` : '') : `Request Datasheet${title ? ` — ${title}` : ''}`)}
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">{t ? t('common_ui.fieldsRequired') : 'Fields marked * are required.'}</span>
            </div>
        </form>
    );
}
