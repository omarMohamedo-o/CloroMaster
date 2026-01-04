import React, { useEffect, useRef } from 'react';
// navigation not needed in this page; CTA handles navigation
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import ContactCTA from '../components/common/ContactCTA';
const SubpageLayout = React.lazy(() => import('../components/layout/SubpageLayout'));

export default function Videos() {
    const videoRef = useRef(null);
    const { t, language } = useLanguage();

    useEffect(() => {
        // Dynamically load Plyr CSS and JS from CDN if not already present
        const cssId = 'plyr-css';
        if (!document.getElementById(cssId)) {
            const link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.href = 'https://cdn.plyr.io/3.7.8/plyr.css';
            document.head.appendChild(link);
        }

        const scriptId = 'plyr-js';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://cdn.plyr.io/3.7.8/plyr.polyfilled.js';
            script.async = true;
            script.onload = () => {
                try {
                    if (window.Plyr && videoRef.current) {
                        new window.Plyr(videoRef.current, {
                            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                            autoplay: false,
                            hideControls: false
                        });
                    }
                } catch (e) {
                    void e;
                }
            };
            document.body.appendChild(script);
        } else {
            if (window.Plyr && videoRef.current) {
                new window.Plyr(videoRef.current, {
                    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                    autoplay: false,
                    hideControls: false
                });
            }
        }
    }, []);

    const src = '/videos/chloromaster-video.mp4';

    return (
        <SubpageLayout
            title={t('videos.title') || (language === 'ar' ? 'مشاهدة' : 'Watch')}
            titleHighlight={t('videos.titleHighlight') || (language === 'ar' ? 'الفيديو' : 'Video')}
            subtitle={t('videos.description') || 'Explore how ChloroMaster delivers comprehensive chlorine system solutions for water treatment facilities.'}
        >
            {/* Video Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="aspect-video bg-black">
                        <video
                            ref={videoRef}
                            className="w-full h-full"
                            controls
                            crossOrigin="anonymous"
                            playsInline
                        >
                            <source src={src} type="video/mp4" />
                            {t('videos.noSupport') || 'Your browser does not support HTML5 video.'}
                        </video>
                    </div>

                    {/* Video Info Section */}
                    <div className="p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {language === 'ar'
                                ? 'حلول معالجة المياه والكلور من كلوروماستر'
                                : 'ChloroMaster Water Treatment & Chlorination Solutions'
                            }
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                            {language === 'ar'
                                ? 'تعرف على حلولنا المتكاملة لأنظمة معالجة المياه والكلور، من التصميم إلى التركيب والتشغيل والصيانة. نحن نلتزم بأعلى معايير السلامة والجودة في جميع مشاريعنا.'
                                : 'Discover our comprehensive water treatment and chlorination system solutions, from design to installation, commissioning, and maintenance. We are committed to the highest standards of safety and quality in all our projects.'
                            }
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {language === 'ar' ? 'التصميم الهندسي' : 'Engineering Design'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {language === 'ar'
                                        ? 'حلول مخصصة لكل مشروع'
                                        : 'Custom solutions for every project'
                                    }
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {language === 'ar' ? 'التركيب والتشغيل' : 'Installation & Commissioning'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {language === 'ar'
                                        ? 'فريق متخصص ومؤهل'
                                        : 'Specialized and qualified team'
                                    }
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {language === 'ar' ? 'الصيانة والدعم' : 'Maintenance & Support'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {language === 'ar'
                                        ? 'دعم مستمر وخدمة ما بعد البيع'
                                        : 'Continuous support and after-sales service'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Contact / Quote CTA */}
            <ContactCTA />
        </SubpageLayout>
    );
}
