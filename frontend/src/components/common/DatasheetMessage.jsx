import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../app/routes';
import { useLanguage } from '../../context/LanguageContext';

export default function DatasheetMessage() {
    const navigate = useNavigate();
    const { language } = useLanguage();

    const contactText = language === 'ar' ? 'اتصل بنا' : 'contact us';

    return (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {language === 'ar' ? 'إذا لم تتوفر ورقة البيانات، ' : 'If the datasheet is not available, '}
            <button
                onClick={() => navigate(PATHS.HOME, { state: { scrollTo: 'contact' } })}
                className="text-brand hover:text-brand/80 underline font-medium"
            >
                {contactText}
            </button>
            {language === 'ar' ? ' وسنوفرها لك.' : " and we'll provide it."}
        </p>
    );
}
