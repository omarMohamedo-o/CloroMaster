// =======================================================
// SERVICES MASTER (Single Source of Truth - Localized)
// =======================================================

import chlorineProducts from './chlorine.products';
import installationProducts from './installation.products';

const servicesMaster = [
    {
        id: 1,
        slug: 'chlorine-system-solutions',
        title: {
            en: 'Chlorine System Solutions',
            ar: 'حلول أنظمة الكلور'
        },
        titleHighlight: {
            en: 'Solutions',
            ar: 'حلول'
        },
        category: {
            en: 'Water Treatment',
            ar: 'معالجة المياه'
        },
        desc: {
            en: 'Complete chlorine system solutions including valves, gauges, safety devices, drum handling equipment, and filtration assemblies. Engineered for safety, reliability, and regulatory compliance in municipal and industrial applications.',
            ar: 'حلول متكاملة لأنظمة الكلور تشمل الصمامات، العدادات، أجهزة الأمان، معدات تداول الأسطوانات، ووحدات الترشيح. مصممة لتحقيق أعلى مستويات السلامة والاعتمادية والالتزام بالمعايير في التطبيقات البلدية والصناعية.'
        },
        images: [
            '/images/services/Chlorine System Solutions/Chlorine System Solutions.webp',
            ...chlorineProducts.map(p => p.image)
        ],
        products: chlorineProducts,

        features: {
            en: [
                'Integrated chlorine handling systems',
                'Corrosion-resistant materials',
                'Advanced safety and pressure monitoring'
            ],
            ar: [
                'تكامل كامل لأنظمة الكلور',
                'مواد مقاومة للتآكل',
                'أنظمة أمان ومراقبة ضغط متقدمة'
            ]
        },

    },

    {
        id: 2,
        slug: 'systems-installation-commissioning',
        title: {
            en: 'Systems Installation and Commissioning',
            ar: 'تركيب وتشغيل الأنظمة'
        },
        titleHighlight: {
            en: 'Commissioning',
            ar: 'تشغيل'
        },
        category: {
            en: 'Water Treatment',
            ar: 'معالجة المياه'
        },
        desc: {
            en: 'During the second half of 2025, ChloroMaster transformed the challenges of high-risk chlorine systems into safely delivered, high-performance projects. Explore our work.',
            ar: 'تم تنفيذ وتسليم جميع المشروعات الموضحة أدناه خلال النصف الثاني من عام 2025، في الفترة من يونيو إلى ديسمبر، بما يعكس كفاءة كلوروماستر في إنجاز مشروعات متخصصة عالية الخطورة وفق أعلى معايير الأمان والجودة.'
        },
        images: [
            '/images/services/Systems Installation and Commissioning/Systems Installation and Commissioning.webp',
            ...installationProducts.map(p => p.image)
        ],
        products: installationProducts,

        features: {
            en: [
                'On-site installation and start-up',
                'Performance testing and verification',
                'Operator training and documentation'
            ],
            ar: [
                'التركيب والتشغيل في الموقع',
                'اختبارات الأداء والتحقق',
                'تدريب المشغلين والتوثيق'
            ]
        }
    }
];

export default servicesMaster;