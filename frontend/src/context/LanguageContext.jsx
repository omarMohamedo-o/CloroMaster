import React, { createContext, useState, useContext, useEffect } from 'react';
import AOS from 'aos';
import translations from '../i18n/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        // Get saved language from localStorage or default to 'en'
        return localStorage.getItem('language') || 'en';
    });

    const [direction, setDirection] = useState(() => {
        const savedLang = localStorage.getItem('language') || 'en';
        return savedLang === 'ar' ? 'rtl' : 'ltr';
    });

    useEffect(() => {
        // Update document direction and lang attribute
        document.documentElement.dir = direction;
        document.documentElement.lang = language;

        // Save to localStorage
        localStorage.setItem('language', language);

        // Refresh AOS to re-calculate positions after language or direction changes
        try {
            if (AOS && typeof AOS.refresh === 'function') AOS.refresh();
        } catch (e) {
            // ignore if AOS not initialized yet
        }
    }, [language, direction]);

    const toggleLanguage = () => {
        setLanguage(prev => {
            const newLang = prev === 'en' ? 'ar' : 'en';
            setDirection(newLang === 'ar' ? 'rtl' : 'ltr');
            return newLang;
        });
    };

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    };

    return (
        <LanguageContext.Provider value={{ language, direction, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
