import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Hero() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const goToServices = () => navigate('/', { state: { scrollTo: 'services' } });
    const goToContact = () => navigate('/', { state: { scrollTo: 'contact' } });

    return (
        <section
            className="relative text-white"
            style={{
                backgroundImage: `url('/images/water-treatment-plant.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/40" />

            <div className="relative container mx-auto px-6 text-center py-12 md:py-20" style={{ maxHeight: '60vh' }}>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">ChloroMaster — Water Treatment & Chlorination</h1>
                <p className="mb-6 max-w-2xl mx-auto">Engineering, contracting and supply of water treatment systems tailored to your needs.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={goToServices} className="inline-block bg-white text-brand px-4 py-2 rounded shadow">{t ? t('nav.services') : 'Explore Services'}</button>
                    <button onClick={goToContact} className="inline-block bg-white/20 px-4 py-2 rounded">{t ? t('nav.contact') : 'Contact Us'}</button>
                </div>
            </div>
        </section>
    );
}
