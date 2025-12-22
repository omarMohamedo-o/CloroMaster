// Single source of truth for services content (localized fields).
// Edit titles/descs/features here to update both English and Arabic outputs.
const servicesMaster = [
    {
        id: 1,
        slug: 'chlorine-system-solutions',
        title: {
            en: 'Chlorine System Solutions',
            ar: 'حلول أنظمة الكلور'
        },
        category: {
            en: 'Water Treatment',
            ar: 'معالجة المياه'
        },
        desc: {
            en: 'Complete chlorine system solutions including valves, gauges, drum handling, and filtration assemblies. Engineered for safety and reliability in municipal and industrial applications.',
            ar: 'حلول شاملة لأنظمة الكلور تشمل الصمامات والمقاييس والتعامل مع الأسطوانات ومجموعات الترشيح. مصممة للسلامة والموثوقية في التطبيقات البلدية والصناعية.'
        },
        images: [
            '/images/services/Chlorine System Solutions/Chlorine System Solutions.png',
            '/images/services/Chlorine System Solutions/Chlorine Drum Lifting Beam.png',
            '/images/services/Chlorine System Solutions/Chlorine Drum Trunnion.png',
            '/images/services/Chlorine System Solutions/Chlorine Line Valve Monel K400.png',
            '/images/services/Chlorine System Solutions/Chlorine-Flexible Connection.png',
            '/images/services/Chlorine System Solutions/Chlorine-Threaded-ball-valve-3PCS.png',
            '/images/services/Chlorine System Solutions/Diaphragm Pressure Gauge with contact.png',
            '/images/services/Chlorine System Solutions/EMERGENCY-SAFETY-SHOWER-AND-EYE-WASH.png',
            '/images/services/Chlorine System Solutions/Emergency kit.png',
            '/images/services/Chlorine System Solutions/Expansion-tube-with-rupture-disc.png',
            '/images/services/Chlorine System Solutions/Gas Container Change Over Unit.png',
            '/images/services/Chlorine System Solutions/Neutralization-System-(Wet-scrubber).png',
            '/images/services/Chlorine System Solutions/Nitrogen-flushing-system.png',
            '/images/services/Chlorine System Solutions/liquid-chlorine-trap-and-chlorine-gas-filter.png',
            '/images/services/Chlorine System Solutions/Auxiliary & header Valve.png'
        ],
        features: {
            en: [
                'Complete system integration',
                'High-quality corrosion-resistant materials',
                'Pressure monitoring and safety interlocks'
            ],
            ar: [
                'تكامل كامل للنظام',
                'مواد عالية الجودة مقاومة للتآكل',
                'مراقبة الضغط وأجهزة السلامة المتشابكة'
            ]
        }
        ,
        // Optional service-level datasheets (files placed in public/files/datasheets)
        datasheets: [
            { slug: 'neutralization-system', path: '/files/datasheets/neutralization-system.pdf', title: { en: 'Neutralization System', ar: 'نظام المعادلة' } },
            { slug: 'change-over-unit', path: '/files/datasheets/change-over-unit.pdf', title: { en: 'Change Over Unit', ar: 'وحدة تبديل الأسطوانات' } },
            { slug: 'drum-lifting-beam', path: '/files/datasheets/drum-lifting-beam.pdf', title: { en: 'Drum Lifting Beam', ar: 'عارضة رفع الأسطوانة' } },
            { slug: 'drum-trunnion', path: '/files/datasheets/drum-trunnion.pdf', title: { en: 'Drum Trunnion', ar: 'محور الأسطوانة' } },
            { slug: 'chlorine-line-valve-monel-k400', path: '/files/datasheets/chlorine-line-valve-monel-k400.pdf', title: { en: 'Chlorine Line Valve (Monel K400)', ar: 'صمام خط الكلور (مونيل K400)' } },
            { slug: 'chlorine-flexible-connection-3-4', path: '/files/datasheets/chlorine-flexible-connection-3-4.pdf', title: { en: 'Flexible Connection 3/4', ar: 'وصل مرن 3/4' } },
            { slug: 'diaphragm-pressure-gauge-with-contact', path: '/files/datasheets/diaphragm-pressure-gauge-with-contact.pdf', title: { en: 'Diaphragm Pressure Gauge with Contact', ar: 'مقياس ضغط بالحجاب الحاجز مع جهة اتصال' } },
            { slug: 'safety-shower-eyewash', path: '/files/datasheets/safety-shower-eyewash.pdf', title: { en: 'Safety Shower & Eyewash', ar: 'دش أمان وغسل العيون' } },
            { slug: 'emergency-kit', path: '/files/datasheets/emergency-kit.pdf', title: { en: 'Emergency Kit', ar: 'عدة الطوارئ' } },
            { slug: 'expansion-tube-with-rupture-disc', path: '/files/datasheets/expansion-tube-with-rupture-disc.pdf', title: { en: 'Expansion Tube with Rupture Disc', ar: 'أنبوب توسع مع قرص تمزق' } },
            { slug: 'line-ball-valve-s-s-316-l', path: '/files/datasheets/line-ball-valve-s-s-316-l.pdf', title: { en: 'Line Ball Valve (S.S 316 L)', ar: 'صمام كروي خطي (S.S 316 L)' } },
            { slug: 'liquid-trap', path: '/files/datasheets/liquid-trap.pdf', title: { en: 'Liquid Trap', ar: 'فخ سائل' } },
            { slug: 'nitrogen-flushing-system', path: '/files/datasheets/nitrogen-flushing-system.pdf', title: { en: 'Nitrogen Flushing System', ar: 'نظام تطهير بالنيتروجين' } },
            { slug: 'chlorine-auxiliary-header-valve', path: '/files/datasheets/chlorine-auxiliary-header-valve.pdf', title: { en: 'Auxiliary & Header Valve', ar: 'صمام مساعد ورأس' } }
        ]
    },
    {
        id: 2,
        slug: 'systems-installation-commissioning',
        title: {
            en: 'Systems Installation and Commissioning',
            ar: 'تركيب وتشغيل الأنظمة'
        },
        category: {
            en: 'Water Treatment',
            ar: 'معالجة المياه'
        },
        desc: {
            en: 'Professional installation, testing, and commissioning services for water treatment and gas handling systems, delivered by our experienced engineering teams.',
            ar: 'خدمات احترافية للتركيب والاختبار والتشغيل لأنظمة معالجة المياه والتعامل مع الغازات، تقدمها فرق الهندسة ذات الخبرة لدينا.'
        },
        images: [
            '/images/services/Systems Installation and Commissioning/Systems Installation and Commissioning.png'
        ],
        // Location-specific project galleries
        locations: [
            {
                key: 'benghazi',
                title: { en: 'Benghazi — Libya', ar: 'بنغازي - ليبيا' },
                images: [
                    '/images/services/Systems Installation and Commissioning/Libya/Benghazi-Libya/Picture1.jpg',
                    '/images/services/Systems Installation and Commissioning/Libya/Benghazi-Libya/Picture2.jpg',
                    '/images/services/Systems Installation and Commissioning/Libya/Benghazi-Libya/Picture3.jpg',
                    '/images/services/Systems Installation and Commissioning/Libya/Benghazi-Libya/Picture4.jpg',
                    '/images/services/Systems Installation and Commissioning/Libya/Benghazi-Libya/Picture5.jpg',
                    '/images/services/Systems Installation and Commissioning/Libya/Benghazi-Libya/Picture6.jpg',
                    '/images/services/Systems Installation and Commissioning/Libya/Benghazi-Libya/Picture7.jpg',
                    '/images/services/Systems Installation and Commissioning/Libya/Benghazi-Libya/Picture8.jpg',
                    '/images/services/Systems Installation and Commissioning/Libya/Benghazi-Libya/Picture9.jpg'
                ]
            },
            {
                key: 'otv-10th-of-ramadan',
                title: { en: 'OTV — 10th of Ramadan, Egypt', ar: 'OTV - العاشر من رمضان - مصر' },
                images: [
                    '/images/services/Systems Installation and Commissioning/Egypt/OTV-10th-of-Ramadan-Egypt/Picture10.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/OTV-10th-of-Ramadan-Egypt/Picture11.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/OTV-10th-of-Ramadan-Egypt/Picture13.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/OTV-10th-of-Ramadan-Egypt/Picture14.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/OTV-10th-of-Ramadan-Egypt/Picture15.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/OTV-10th-of-Ramadan-Egypt/Picture16.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/OTV-10th-of-Ramadan-Egypt/Picture17.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/OTV-10th-of-Ramadan-Egypt/Picture18.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/OTV-10th-of-Ramadan-Egypt/Picture19.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/OTV-10th-of-Ramadan-Egypt/Picture20.jpg'
                ]
            },
            {
                key: 'damietta',
                title: { en: 'Damietta — Egypt', ar: 'دمياط - مصر' },
                images: [
                    '/images/services/Systems Installation and Commissioning/Egypt/Damietta-Egypt/Picture21.jpg'
                ]
            },
            {
                key: 'port-said',
                title: { en: 'Port Said — Egypt', ar: 'بورسعيد - مصر' },
                images: [
                    '/images/services/Systems Installation and Commissioning/Egypt/PortSaid-Egypt/Picture22.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/PortSaid-Egypt/Picture23.jpg'
                ]
            },
            {
                key: 'aswan',
                title: { en: 'Aswan — Egypt', ar: 'أسوان - مصر' },
                images: [
                    '/images/services/Systems Installation and Commissioning/Egypt/Aswan-Egypt/Picture24.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Aswan-Egypt/Picture25.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Aswan-Egypt/Picture26.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Aswan-Egypt/Picture27.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Aswan-Egypt/Picture28.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Aswan-Egypt/Picture29.jpg'
                ]
            },
            {
                key: 'giza',
                title: { en: 'Giza — Egypt', ar: 'الجيزة - مصر' },
                images: [
                    '/images/services/Systems Installation and Commissioning/Egypt/Giza-Egypt/Picture30.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Giza-Egypt/Picture31.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Giza-Egypt/Picture32.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Giza-Egypt/Picture33.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Giza-Egypt/Picture34.jpg'
                ]
            },
            {
                key: 'minya',
                title: { en: 'Minya — Egypt', ar: 'المنيا - مصر' },
                images: [
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture35.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture36.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture37.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture38.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture39.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture40.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture41.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture42.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture43.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture44.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture45.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture46.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture47.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture48.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Minya-Egypt/Picture49.jpg'
                ]
            },
            {
                key: 'dabaa',
                title: { en: 'Dabaa — Egypt', ar: 'الضبعة - مصر' },
                images: [
                    '/images/services/Systems Installation and Commissioning/Egypt/Dabaa-Egypt/Picture50.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Dabaa-Egypt/Picture51.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Dabaa-Egypt/Picture52.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Dabaa-Egypt/Picture53.jpg',
                    '/images/services/Systems Installation and Commissioning/Egypt/Dabaa-Egypt/Picture54.jpg'
                ]
            }
        ],
        features: {
            en: ['Site installation and start-up', 'Testing and performance verification', 'Operator training and documentation'],
            ar: ['تركيب في الموقع والتشغيل الأولي', 'الاختبار والتحقق من الأداء', 'تدريب المشغلين والتوثيق']
        }
    }
];

export default servicesMaster;
