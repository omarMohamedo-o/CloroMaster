import React, { useState } from 'react';
import config from '../../config/config';
import { useLanguage } from '../../context/LanguageContext';
import { PATHS } from '../../app/routes';

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
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!firstName.trim() && !lastName.trim()) {
            newErrors.name = t ? t('contact.errors.nameRequired') : 'Name is required';
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = t ? t('contact.errors.emailRequired') : 'Valid email is required';
        }
        if (!phone.trim()) {
            newErrors.phone = t ? t('contact.errors.phoneRequired') : 'Phone number is required';
        }
        if (!message.trim()) {
            newErrors.message = t ? t('contact.errors.messageRequired') || 'Message is required' : 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

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
                // Fallback: when no API configured, consider submission accepted in dev
            }

            setSent(true);
            // reset fields
            setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setCompany(''); setMarket(''); setCountry(''); setPostalCode(''); setMessage(''); setSubscribe(false);
            setErrors({});
        } catch (err) {
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
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">
                {t ? (
                    <>
                        {t('contact.title')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">{t('contact.titleHighlight')}</span>
                    </>
                ) : (
                    'Send us a message'
                )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name - Required */}
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t ? t('contact.form.firstName') : 'First Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={t ? t('contact.form.firstNamePlaceholder') : 'Ahmed'}
                        className={`w-full p-3 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20`}
                        aria-label="First Name"
                        required
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t ? t('contact.form.lastName') : 'Last Name'}
                    </label>
                    <input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={t ? t('contact.form.lastNamePlaceholder') : 'Mohamed'}
                        className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20"
                        aria-label="Last Name"
                    />
                </div>

                {/* Email - Required */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t ? t('contact.form.email') : 'Your Email'} <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t ? t('contact.form.emailPlaceholder') : 'Email Address'}
                        type="email"
                        className={`w-full p-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20`}
                        aria-label="Email Address"
                        required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone - Required */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t ? t('contact.form.phone') : 'Phone Number'} <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t ? t('contact.form.phonePlaceholder') : 'Phone Number'}
                        className={`w-full p-3 rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20`}
                        aria-label="Phone Number"
                        required
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Company */}
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t ? t('contact.form.company') : 'Company Name'}
                    </label>
                    <input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder={t ? t('contact.form.companyPlaceholder') : 'Company Name'}
                        className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20"
                        aria-label="Company Name"
                    />
                </div>

                {/* Market/Industry */}
                <div>
                    <label htmlFor="market" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t ? t('contact.form.marketPlaceholder') : 'Market/Industry'}
                    </label>
                    <input
                        id="market"
                        value={market}
                        onChange={(e) => setMarket(e.target.value)}
                        placeholder={t ? t('contact.form.marketPlaceholder') : 'Market/Industry'}
                        className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20"
                        aria-label="Market/Industry"
                    />
                </div>

                {/* Country */}
                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t ? t('contact.form.countryPlaceholder') : 'Country'}
                    </label>
                    <input
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder={t ? t('contact.form.countryPlaceholder') : 'Country'}
                        className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20"
                        aria-label="Country"
                    />
                </div>

                {/* Postal Code */}
                <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t ? t('contact.form.postalCodePlaceholder') : 'Postal Code'}
                    </label>
                    <input
                        id="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder={t ? t('contact.form.postalCodePlaceholder') : 'Postal Code'}
                        className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20"
                        aria-label="Postal Code"
                    />
                </div>

                {/* Message - Required */}
                <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t ? t('contact.form.message') : 'Your Message'} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t ? t('contact.form.messagePlaceholder') : 'Message'}
                        rows={6}
                        className={`w-full p-3 rounded-md border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20`}
                        aria-label="Message"
                        required
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
            </div>

            {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}

            <div className="flex items-start gap-3 mt-4">
                <input id="subscribe" type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} className="w-4 h-4 mt-1 accent-brand" />
                <label htmlFor="subscribe" className="text-sm text-gray-700 dark:text-gray-200">{t ? t('contact.form.subscribe') : 'I would like to receive periodic emails from ChloroMaster'}</label>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">Review our <a href={PATHS.PRIVACY} className="underline text-gray-700 dark:text-gray-200">{t ? t('footer.privacy') : 'Privacy and Cookie Policy'}</a> for more detailed information on the data we collect, how we use it, and the safeguards that we put in place to protect your data.</div>

            <div className="flex flex-col items-center mt-6 gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-brand to-brand-secondary hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                    {loading ? (t ? t('contact.form.sending') : 'Sending...') : (t ? t('contact.form.send') : 'Send')}
                </button>

                <small className="text-xs text-gray-500 dark:text-gray-400 text-center">Or email us at <a className="underline text-gray-700 dark:text-gray-200" href={`mailto:${config.contact.email}`}>{config.contact.email}</a></small>
            </div>
        </form>
    );
}

