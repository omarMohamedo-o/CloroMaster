import React, { useState } from 'react';
import config from '../../config/config';
import { useLanguage } from '../../context/LanguageContext';

export default function ContactForm() {
    const { t } = useLanguage();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [market, setMarket] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [message, setMessage] = useState('');
    const [subscribe, setSubscribe] = useState(false);
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            firstName,
            lastName,
            email,
            phone,
            company,
            market,
            country,
            postalCode,
            message,
            subscribe
        };

        try {
            setLoading(true);
            if (config.api && config.api.baseURL) {
                await fetch(`${config.api.baseURL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                // Fallback: log to console
                console.log('Contact submit', payload);
            }

            setSent(true);
            // reset fields
            setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setCompany(''); setMarket(''); setCountry(''); setPostalCode(''); setMessage(''); setSubscribe(false);
        } catch (err) {
            console.error('Contact submit failed', err);
            alert('Failed to send message.');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t ? t('contact.success') : 'Thanks — message sent!'}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t ? t('contact.subtitle') : 'We will get back to you soon.'}</p>
            </div>
        );
    }

    return (
        <form id="contact" name="contact" onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full text-gray-900 dark:text-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{t ? t('contact.title') : 'Send us a message'}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t ? t('contact.form.namePlaceholder') : 'First Name'} className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="First Name" />
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t ? t('contact.form.namePlaceholder') : 'Last Name'} className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="Last Name" />

                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t ? t('contact.form.emailPlaceholder') : 'Email Address'} type="email" className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 md:col-span-1 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="Email Address" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t ? t('contact.form.phonePlaceholder') : 'Phone Number'} className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="Phone Number" />

                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name" className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="Company Name" />
                <input value={market} onChange={(e) => setMarket(e.target.value)} placeholder="Market/Industry" className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="Market/Industry" />

                <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="Country" />
                <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="Postal Code" />

                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t ? t('contact.form.messagePlaceholder') : 'Message'} rows={6} className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-teal-400" aria-label="Message" />
            </div>

            <div className="flex items-start gap-3 mt-4">
                <input id="subscribe" type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} className="w-4 h-4 mt-1 accent-teal-500" />
                <label htmlFor="subscribe" className="text-sm text-gray-700 dark:text-gray-200">{t ? t('contact.form.subscribe') : 'I would like to receive periodic emails from ChloroMaster'}</label>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">Review our <a href="/privacy" className="underline text-gray-700 dark:text-gray-200">Privacy and Cookie Policy</a> for more detailed information on the data we collect, how we use it, and the safeguards that we put in place to protect your data.</div>

            <div className="flex items-center justify-between mt-6">
                <button type="submit" disabled={loading} className="bg-brand text-white px-6 py-2 rounded-md hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-teal-400">{loading ? (t ? t('contact.form.sending') : 'Sending...') : (t ? t('contact.form.send') : 'Send')}</button>
                <small className="text-xs text-gray-500 dark:text-gray-400">Or email us at <a className="underline text-gray-700 dark:text-gray-200" href={`mailto:${config.contact.email}`}>{config.contact.email}</a></small>
            </div>
        </form>
    );
}

