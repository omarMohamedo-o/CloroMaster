const chlorineProducts = [
    {
        id: 1,
        slug: 'drum-lifting-beam',
        image: '/images/services/Chlorine System Solutions/Chlorine Drum Lifting Beam.png',
        datasheet: '/files/datasheets/chlorine-drum-lifting-beam.pdf',
        title: {
            en: 'Chlorine Drum Lifting Beam',
            ar: 'عارضة رفع أسطوانات الكلور'
        },
        titleHighlight: {
            en: 'Drum Lifting Beam',
            ar: 'عارضة رفع'
        },
        usage: {
            en: 'Engineered lifting beam designed for safe handling and positioning of chlorine cylinders during installation and maintenance.',
            ar: 'عارضة مصممة هندسيًا لرفع وتداول أسطوانات الكلور بأمان أثناء أعمال التركيب والصيانة.'
        }
    },
    {
        id: 2,
        slug: 'drum-trunnion',
        image: '/images/services/Chlorine System Solutions/Chlorine Drum Trunnion.png',
        datasheet: '/files/datasheets/chlorine-drum-trunnion.pdf',
        title: {
            en: 'Chlorine Drum Trunnion',
            ar: 'قواعد تثبيت أسطوانات الكلور (1 طن)'
        },
        titleHighlight: {
            en: 'Drum Trunnion',
            ar: 'قواعد تثبيت'
        },
        usage: {
            en: 'Heavy-duty trunnions designed to securely support chlorine drums and allow controlled rotation during operation.',
            ar: 'قواعد تثبيت قوية لتأمين أسطوانات الكلور مع السماح بالدوران الآمن أثناء التشغيل.'
        }
    },
    {
        id: 3,
        slug: 'drum-scale-frame-digital-load-cell',
        image: '/images/services/Chlorine System Solutions/ChloroMaster DRUM SCALE FRAME WITH DIGITAL LOAD CELL   (D.Sc 05).png',
        datasheet: '/files/datasheets/ChloroMaster DRUM SCALE FRAME WITH DIGITAL LOAD CELL   (D.Sc 05).pdf',
        title: {
            en: 'Drum Scale Frame with Digital Load Cell',
            ar: 'إطار وزن أسطوانات الكلور بخلايا تحميل رقمية'
        },
        titleHighlight: {
            en: 'Scale Frame',
            ar: 'إطار وزن'
        },
        usage: {
            en: 'Engineered weighing frame equipped with digital load cells for continuous and accurate monitoring of chlorine cylinder weight and consumption.',
            ar: 'إطار وزن مزود بخلايا تحميل رقمية لقياس وزن أسطوانات الكلور بدقة ومراقبة الاستهلاك بشكل مستمر.'
        }
    },
    {
        id: 4,
        slug: 'chlorine-line-valve-monel-k400',
        image: '/images/services/Chlorine System Solutions/Chlorine Line Valve Monel K400.png',
        datasheet: '/files/datasheets/chlorine-line-valve-monel-k400.pdf',
        title: {
            en: 'Chlorine Line Valve – Monel K400',
            ar: 'محبس خط كلور مونيل K400'
        },
        titleHighlight: {
            en: 'Line Valve',
            ar: 'محبس خط'
        },
        usage: {
            en: 'High-integrity Monel K400 valve providing superior corrosion resistance for chlorine gas service.',
            ar: 'محبس مونيل K400 عالي الاعتمادية ومقاوم للتآكل، مخصص لتطبيقات غاز الكلور.'
        }
    },
    {
        id: 5,
        slug: 'chlorine-flexible-connection-3-4',
        image: '/images/services/Chlorine System Solutions/Chlorine-Flexible Connection.png',
        datasheet: '/files/datasheets/chlorine-flexible-connection-3-4.pdf',
        title: {
            en: 'Chlorine Flexible Connection ¾"',
            ar: 'وصلة مرنة لغاز الكلور ¾ بوصة'
        },
        titleHighlight: {
            en: 'Flexible Connection',
            ar: 'وصلة مرنة'
        },
        usage: {
            en: 'Flexible connection designed to safely transfer chlorine gas from cylinders to the manifold.',
            ar: 'وصلة مرنة مصممة لنقل غاز الكلور بأمان من الأسطوانة إلى المانفولد.'
        }
    },
    {
        id: 6,
        slug: 'diaphragm-pressure-gauge-with-contact',
        image: '/images/services/Chlorine System Solutions/Diaphragm Pressure Gauge with contact.png',
        datasheet: '/files/datasheets/diaphragm-pressure-gauge-with-contact.pdf',
        title: {
            en: 'Diaphragm Pressure Gauge with Contact',
            ar: 'عداد ضغط غشائي مزود بجهات اتصال'
        },
        titleHighlight: {
            en: 'Pressure Gauge',
            ar: 'عداد ضغط'
        },
        usage: {
            en: 'Pressure gauge with electrical switching contacts for monitoring and alarm signaling in chlorine systems.',
            ar: 'عداد ضغط غشائي مزود بنقاط تبديل كهربائية لمراقبة الضغط وإطلاق الإنذارات.'
        }
    },
    {
        id: 7,
        slug: 'rupture-disc',
        image: '/images/services/Chlorine System Solutions/ChloroMaster Rupture Disc (R.D 05).png',
        datasheet: '/files/datasheets/ChloroMaster Rupture Disc (R.D 05).pdf',
        title: {
            en: 'Rupture Disc',
            ar: 'قرص انفجار'
        },
        titleHighlight: {
            en: 'Rupture Disc',
            ar: 'قرص'
        },
        usage: {
            en: 'Safety pressure relief device designed to instantly release excess pressure and protect chlorine systems.',
            ar: 'جهاز أمان لتفريغ الضغط الزائد بشكل فوري وحماية منظومة الكلور.'
        }
    },
    {
        id: 8,
        slug: 'expansion-tube-with-rupture-disc',
        image: '/images/services/Chlorine System Solutions/Expansion-tube-with-rupture-disc.png',
        datasheet: '/files/datasheets/expansion-tube-with-rupture-disc.pdf',
        title: {
            en: 'Expansion Tube with Rupture Disc',
            ar: 'أنبوب تمدد مزود بقرص انفجار'
        },
        titleHighlight: {
            en: 'Expansion Tube',
            ar: 'أنبوب تمدد'
        },
        usage: {
            en: 'Expansion tube assembly integrated with rupture disc to absorb pressure surges and protect system components.',
            ar: 'وحدة تمدد مزودة بقرص انفجار لامتصاص الارتفاع المفاجئ في الضغط وحماية مكونات النظام.'
        }
    },
    {
        id: 9,
        slug: 'emergency-kit',
        image: '/images/services/Chlorine System Solutions/Emergency kit.png',
        datasheet: '/files/datasheets/emergency-kit.pdf',
        title: {
            en: 'Chlorine Emergency Kit',
            ar: 'عدة طوارئ الكلور'
        },
        titleHighlight: {
            en: 'Emergency Kit',
            ar: 'عدة طوارئ'
        },
        usage: {
            en: 'Emergency response kit designed for rapid containment and control of chlorine leaks.',
            ar: 'عدة طوارئ مخصصة للتدخل السريع والسيطرة الآمنة على تسريبات الكلور.'
        }
    },
    {
        id: 10,
        slug: 'safety-shower-eyewash',
        image: '/images/services/Chlorine System Solutions/EMERGENCY-SAFETY-SHOWER-AND-EYE-WASH.png',
        datasheet: '/files/datasheets/safety-shower-eyewash.pdf',
        title: {
            en: 'Emergency Safety Shower & Eyewash',
            ar: 'دش طوارئ وغسيل عين'
        },
        titleHighlight: {
            en: 'Safety Shower',
            ar: 'دش طوارئ'
        },
        usage: {
            en: 'Emergency safety unit providing immediate decontamination for personnel exposed to hazardous chemicals.',
            ar: 'وحدة أمان للطوارئ توفر غسيلًا فوريًا للجسم والعين عند التعرض للمواد الكيميائية.'
        }
    },
    {
        id: 11,
        slug: 'neutralization-system-wet-scrubber',
        image: '/images/services/Chlorine System Solutions/Neutralization-System-(Wet-scrubber).png',
        datasheet: '/files/datasheets/neutralization-system.pdf',
        title: {
            en: 'Chlorine Neutralization System',
            ar: 'منظومة معادلة غاز الكلور'
        },
        titleHighlight: {
            en: 'Neutralization System',
            ar: 'منظومة معادلة'
        },
        usage: {
            en: 'Integrated system designed to safely neutralize leaked chlorine gas and protect personnel and environment.',
            ar: 'منظومة متكاملة لمعادلة غاز الكلور المتسرب والحد من مخاطره على الأفراد والبيئة.'
        }
    },
    {
        id: 12,
        slug: 'nitrogen-flushing-system',
        image: '/images/services/Chlorine System Solutions/Nitrogen-flushing-system.png',
        datasheet: '/files/datasheets/nitrogen-flushing-system.pdf',
        title: {
            en: 'Nitrogen Flushing System',
            ar: 'منظومة التطهير بالنيتروجين'
        },
        titleHighlight: {
            en: 'Flushing System',
            ar: 'منظومة التطهير'
        },
        usage: {
            en: 'System used to purge chlorine lines with nitrogen during maintenance and shutdown operations.',
            ar: 'نظام يستخدم النيتروجين لتطهير خطوط الكلور أثناء الصيانة والتوقف.'
        }
    },
    {
        id: 13,
        slug: 'chlorine-threaded-ball-valve-3pcs',
        image: '/images/services/Chlorine System Solutions/Chlorine-Threaded-ball-valve-3PCS.png',
        datasheet: '/files/datasheets/line-ball-valve-s-s-316-l.pdf',
        title: {
            en: 'Chlorine Threaded Ball Valve 3PCS',
            ar: 'محبس كروي ملولب للكلور 3 قطع'
        },
        titleHighlight: {
            en: 'Ball Valve',
            ar: 'محبس كروي'
        },
        usage: {
            en: 'Three-piece threaded ball valve designed for reliable chlorine gas service with full port flow.',
            ar: 'محبس كروي ملولب من 3 قطع مصمم لخدمة غاز الكلور بتدفق كامل.'
        }
    },
    {
        id: 14,
        slug: 'gas-container-change-over-unit',
        image: '/images/services/Chlorine System Solutions/Gas Container Change Over Unit.png',
        datasheet: '/files/datasheets/change-over-unit.pdf',
        title: {
            en: 'Gas Container Change Over Unit',
            ar: 'وحدة تبديل أسطوانات الغاز'
        },
        titleHighlight: {
            en: 'Change Over Unit',
            ar: 'وحدة تبديل'
        },
        usage: {
            en: 'Automatic changeover system that ensures continuous gas supply by switching between cylinders.',
            ar: 'نظام تبديل أوتوماتيكي يضمن استمرارية توريد الغاز بالتبديل بين الأسطوانات.'
        }
    },
    {
        id: 15,
        slug: 'liquid-chlorine-trap-and-gas-filter',
        image: '/images/services/Chlorine System Solutions/liquid-chlorine-trap-and-chlorine-gas-filter.png',
        datasheet: '/files/datasheets/liquid-trap.pdf',
        title: {
            en: 'Liquid Chlorine Trap and Chlorine Gas Filter',
            ar: 'مصيدة الكلور السائل وفلتر غاز الكلور'
        },
        titleHighlight: {
            en: 'Chlorine Trap',
            ar: 'مصيدة الكلور'
        },
        usage: {
            en: 'Combination unit that traps liquid chlorine carryover and filters chlorine gas before dosing.',
            ar: 'وحدة مركبة تحبس الكلور السائل المتطاير وتنقي غاز الكلور قبل الحقن.'
        }
    },
    {
        id: 16,
        slug: 'auxiliary-and-header-valve',
        image: '/images/services/Chlorine System Solutions/Auxiliary & header Valve.png',
        datasheet: '/files/datasheets/chlorine-auxiliary-header-valve.pdf',
        title: {
            en: 'Auxiliary & Header Valve',
            ar: 'محبس مساعد ومحبس رأسي'
        },
        titleHighlight: {
            en: 'Auxiliary & Header Valve',
            ar: 'محبس مساعد'
        },
        usage: {
            en: 'Specialized valves for manifold headers and auxiliary lines in chlorine distribution systems.',
            ar: 'محابس متخصصة للخطوط الرأسية والمساعدة في منظومة توزيع الكلور.'
        }
    }
];

export default chlorineProducts;
