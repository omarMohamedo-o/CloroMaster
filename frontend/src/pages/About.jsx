import React from 'react';
import { Link } from 'react-scroll';
import { FaCheckCircle, FaUsers, FaAward, FaGlobe, FaLightbulb, FaHeart, FaBuilding } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const features = [
    {
      icon: FaCheckCircle,
      title: t('about.features.quality.title'),
      description: t('about.features.quality.desc')
    },
    {
      icon: FaUsers,
      title: t('about.features.team.title'),
      description: t('about.features.team.desc')
    },
    {
      icon: FaAward,
      title: t('about.features.track.title'),
      description: t('about.features.track.desc')
    },
    {
      icon: FaGlobe,
      title: t('about.features.global.title'),
      description: t('about.features.global.desc')
    }
  ];

  return (
    <section id="about" className="py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Content - Text slides from left */}
          <div className="space-y-6" data-aos="fade-right" data-aos-duration="700">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-medium">
                <FaBuilding className="text-lg" />
                {t('about.badge')}
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {(() => {
                  const title = t('about.title');
                  const titleKey = 'about.title';
                  const titleHighlight = t('about.titleHighlight');
                  const titleHighlightKey = 'about.titleHighlight';

                  const showTitle = title && title.trim() !== '' && title !== titleKey;
                  const showHighlight = titleHighlight && titleHighlight !== titleHighlightKey;

                  if (!showTitle) return null;
                  if (showHighlight) {
                    return (
                      <>
                        {title.replace(titleHighlight, '')}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">{titleHighlight}</span>
                      </>
                    );
                  }

                  const parts = title.split(' ');
                  if (parts.length === 1) return <span className="text-brand">{title}</span>;
                  const last = parts.pop();
                  const rest = parts.join(' ');
                  return (
                    <>
                      {rest + ' '}
                      <span className="text-brand">{last}</span>
                    </>
                  );
                })()}
              </h2>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('about.paragraph1')}
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('about.paragraph2')}
            </p>

            {/* Features Grid - Staggered */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
                  data-aos="fade-up"
                  data-aos-duration="700"
                  data-aos-delay={index * 100}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-brand-secondary flex items-center justify-center">
                    <feature.icon className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div data-aos="fade-up" data-aos-duration="700" data-aos-delay="300">
              <Link to="contact" smooth duration={600} offset={-80}>
                <button className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-brand to-brand-secondary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover-lift">
                  <FaHeart className="text-lg" />
                  {t('about.cta')}
                </button>
              </Link>
            </div>
          </div>

          {/* Right Content - Image slides from right */}
          <div className="relative" data-aos="fade-left" data-aos-duration="800" data-aos-delay="80">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/ChloroMaster-about.png"
                alt="ChloroMaster about image"
                className="w-full h-full object-contain float-slow"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}