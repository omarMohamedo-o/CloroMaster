import servicesMaster from './services.master';

const translations = {
    en: {
        // Branding
        brand: {
            chloro: 'Chloro',
            master: 'Master',
            tagline: 'Engineering & Water Treatment Solutions'
        },

        // Navigation
        nav: {
            lastUpdated: '2025-12-22',
            home: 'Home',
            services: 'Services',
            about: 'About',
            clients: 'Clients',
            faq: 'FAQ',
            contact: 'Contact',
            switchToArabic: 'Switch to Arabic',
            switchToEnglish: 'Switch to English'
        },

        // Hero Section
        hero: {
            lastUpdated: '2025-12-22',
            titleLine1: 'Engineering solutions',
            titleLine2: 'for water treatment and infrastructure',
            title: 'Engineering solutions for water treatment and infrastructure',
            items: servicesMaster.map(s => ({
                id: s.id,
                slug: s.slug,
                title: s.title.en,
                category: s.category.en,
                desc: s.desc.en,
                images: s.images,
                features: s.features?.en || []
            })),
            subtitle: 'We are proud to collaborate with reputable operators, institutions and engineering firms in the water and wastewater sector. Our clients trust ChloroMaster to deliver reliable, safe, and efficient chlorine and electromechanical solutions.',
            commitment: 'These partnerships reflect our commitment to quality, technical excellence, and long-term collaboration.',
            stats: {
                partners: 'Trusted Partners',
                satisfaction: 'Client Satisfaction',
                experience: 'Years Experience',
                projects: 'Projects Delivered'
            }
        },

        // Services (used by services list/detail and equipment pages)
        services: {
            lastUpdated: '2025-12-22',
            items: servicesMaster.map(s => ({
                id: s.id,
                slug: s.slug,
                title: s.title.en,
                category: s.category.en,
                desc: s.desc.en,
                images: s.images,
                features: s.features?.en || [],
                locations: (s.locations || []).map(loc => ({
                    key: loc.key,
                    title: loc.title?.en || (loc.title || {}).en || loc.key,
                    images: loc.images || []
                }))
            }))
        },

        // Contact Section
        contact: {
            lastUpdated: '2025-12-22',
            badge: 'Get In Touch',
            title: "Let's Work",
            titleHighlight: 'Together',
            subtitle: 'Have a project in mind? We would love to hear from you. Send us a message and we will respond as soon as possible.',
            form: {
                name: 'Your Name',
                namePlaceholder: 'Ahmed Mohamed',
                email: 'Your Email',
                emailPlaceholder: 'ahmed@example.com',
                phone: 'Phone Number',
                phonePlaceholder: '+20 12 3456 7890',
                company: 'Company Name',
                companyPlaceholder: 'Example Co.',
                subject: 'Subject',
                subjectPlaceholder: 'Project inquiry',
                message: 'Your Message',
                messagePlaceholder: 'Tell us about your project...',
                subscribe: 'I would like to receive periodic emails from ChloroMaster',
                send: 'Send Message',
                sending: 'Sending...'
            },
            errors: {
                nameRequired: 'Name is required',
                emailRequired: 'Valid email is required',
                phoneRequired: 'Phone number is required',
                submitFailed: 'Failed to submit. Please try again.'
            },
            success: 'Message sent successfully! We will get back to you soon.',
            error: 'Failed to send message. Please try again.',
            info: {
                address: 'Address',
                phone: 'Phone',
                email: 'Email',
                hours: 'Working Hours'
            }
        },

        // Footer
        footer: {
            lastUpdated: '2025-12-22',
            description: 'Engineering excellence in water treatment and chlorination systems. Delivering high-quality projects with a commitment to safety and excellence across the Middle East.',
            quickLinks: 'Quick Links',
            contactInfo: 'Contact Information',
            copyright: 'ChloroMaster. All rights reserved.',
            privacy: 'Privacy Policy',
            terms: 'Terms of Service'
        },

        // Counters
        counters: {
            lastUpdated: '2025-12-22',
            yearsExp: 'Years Experience',
            projectsCompleted: 'Projects Completed',
            trustedPartners: 'Trusted Partners'
        },

        // FAQ Section
        faq: {
            lastUpdated: '2025-12-22',
            badge: 'FAQ',
            title: 'Frequently',
            titleHighlight: 'Asked Questions',
            subtitle: 'Find answers to common questions about our services, systems, and support.',
            items: {
                service: {
                    question: 'How can I request service for my chlorine system?',
                    answer: 'You can request service by contacting us at +20 122 215 5310, filling the online contact form, or emailing us directly. We provide 24/7 emergency support for critical systems and respond to all service requests within 24 hours.'
                },
                capacity: {
                    question: 'What capacity range do your chlorine systems support?',
                    answer: 'Our chlorine systems range from 10 kg/hour to 120 kg/hour, suitable for small municipal facilities to large wastewater treatment plants. We can also design custom solutions for specific capacity requirements.'
                },
                safety: {
                    question: 'What safety features are included in your systems?',
                    answer: 'All our systems include comprehensive safety features: automatic gas detection, emergency venting systems up to 5000 m³/h, safety showers, eye wash stations, leak detection sensors, and automatic shutoff mechanisms. We comply with international safety standards.'
                },
                installation: {
                    question: 'How long does installation and commissioning take?',
                    answer: 'Installation time varies with system complexity and size. Typically, a standard chlorine system takes 2 to 4 weeks from delivery to full operation. We provide detailed project timelines during planning and work efficiently to minimize downtime.'
                },
                maintenance: {
                    question: 'Do you offer maintenance and overhaul services?',
                    answer: 'Yes, we offer comprehensive maintenance contracts, system overhauls, capacity upgrades, and retrofit services. Our team can service systems we installed as well as existing installations from other manufacturers.'
                },
                emergency: {
                    question: 'What should I do in a chlorine gas emergency?',
                    answer: 'Immediately activate your facility emergency response plan, evacuate the area, and contact emergency services. Our 24/7 emergency hotline +20 123 456 7890 is available for technical support. All our installations include automatic neutralization systems designed for emergency response.'
                }
            },
            ctaTitle: 'Still have questions?',
            ctaSubtitle: 'Our expert team is here to help. Contact us by phone or email for immediate assistance.',
            callButton: 'Call Us Now',
            emailButton: 'Send Email'
        },

        common: {
            loading: 'Loading...'
        },

        // Generic/common UI strings
        common_ui: {
            lastUpdated: '2025-12-22',
            back: 'Back',
            requestDatasheet: 'Request Datasheet',
            getInTouch: 'Get In Touch',
            equipmentNotFound: 'Equipment not found',
            fieldsRequired: 'Fields marked * are required.',
            serviceNotFound: 'Service Not Found',
            backToHome: 'Back to Home',
            equipmentGallery: 'Equipment Gallery',
            includedInServices: 'Included in Services',
            equipmentTag: 'Equipment',
            equipmentDescription: 'Manufactured to industry standards with configurable options for materials and sizes. For full technical details, download the datasheet below.',
            datasheetUnavailable: "If the datasheet is not available, contact us and we'll provide it.",
            datasheetPrompt: 'Please fill the form below to receive the datasheet.',
            datasheetSubmitted: 'Thank you — the datasheet download should begin. Check your email for a copy.'
        }
    },

    ar: {
        // Branding
        brand: {
            chloro: 'كلورو',
            master: 'ماستر',
            tagline: 'حلول هندسية ومعالجة المياه'
        },

        // Navigation
        nav: {
            lastUpdated: '2025-12-22',
            home: 'الرئيسية',
            services: 'الخدمات',
            about: 'من نحن',
            clients: 'العملاء',
            faq: 'الأسئلة الشائعة',
            contact: 'اتصل بنا',
            switchToArabic: 'التبديل إلى العربية',
            switchToEnglish: 'التبديل إلى الإنجليزية'
        },

        // Hero Section
        hero: {
            lastUpdated: '2025-12-22',
            titleLine1: 'حلول هندسية',
            titleLine2: 'لمعالجة المياه والبنية التحتية',
            title: 'حلول هندسية لمعالجة المياه والبنية التحتية',
            items: servicesMaster.map(s => ({
                id: s.id,
                slug: s.slug,
                title: s.title.ar,
                category: s.category.ar,
                desc: s.desc.ar,
                images: s.images,
                features: s.features?.ar || []
            })),
            subtitle: 'نحن فخورون بالتعاون مع المشغلين والمؤسسات والشركات الهندسية ذات السمعة الطيبة في قطاع المياه ومياه الصرف الصحي. يثق عملاؤنا في ChloroMaster لتقديم حلول كلور وكهروميكانيكية موثوقة وآمنة وفعالة.',
            commitment: 'تعكس هذه الشراكات التزامنا بالجودة والتميز الفني والتعاون طويل الأمد.',
            stats: {
                partners: 'شركاء موثوقون',
                satisfaction: 'رضا العملاء',
                experience: 'سنوات الخبرة',
                projects: 'المشاريع المنجزة'
            }
        },

        // Services (used by services list/detail and equipment pages)
        services: {
            lastUpdated: '2025-12-22',
            items: servicesMaster.map(s => ({
                id: s.id,
                slug: s.slug,
                title: s.title.ar,
                category: s.category.ar,
                desc: s.desc.ar,
                images: s.images,
                features: s.features?.ar || [],
                locations: (s.locations || []).map(loc => ({
                    key: loc.key,
                    title: loc.title?.ar || (loc.title || {}).ar || loc.key,
                    images: loc.images || []
                }))
            }))
        },

        // Contact Section
        contact: {
            lastUpdated: '2025-12-22',
            badge: 'تواصل معنا',
            title: 'لنعمل',
            titleHighlight: 'معاً',
            subtitle: 'لديك مشروع في الاعتبار؟ نود أن نسمع منك. أرسل لنا رسالة وسنرد في أقرب وقت ممكن.',
            form: {
                name: 'اسمك',
                namePlaceholder: 'أحمد محمد',
                email: 'بريدك الإلكتروني',
                emailPlaceholder: 'ahmed@example.com',
                phone: 'رقم الهاتف',
                phonePlaceholder: '+20 12 3456 7890',
                company: 'اسم الشركة',
                companyPlaceholder: 'مثال ش.م.م',
                subject: 'الموضوع',
                subjectPlaceholder: 'استفسار عن مشروع',
                message: 'رسالتك',
                messagePlaceholder: 'أخبرنا عن مشروعك...',
                subscribe: 'أرغب في تلقي رسائل بريد إلكتروني دورية من ChloroMaster',
                send: 'إرسال الرسالة',
                sending: 'جاري الإرسال...'
            },
            errors: {
                nameRequired: 'الاسم مطلوب',
                emailRequired: 'البريد الإلكتروني صحيح مطلوب',
                phoneRequired: 'رقم الهاتف مطلوب',
                submitFailed: 'فشل الإرسال. يرجى المحاولة مرة أخرى.'
            },
            success: 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
            error: 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.',
            info: {
                address: 'العنوان',
                phone: 'الهاتف',
                email: 'البريد الإلكتروني',
                hours: 'ساعات العمل'
            }
        },

        // Footer
        footer: {
            lastUpdated: '2025-12-22',
            description: 'التميز الهندسي في أنظمة معالجة المياه والكلور. تقديم مشاريع عالية الجودة مع الالتزام بالسلامة والتميز في جميع أنحاء الشرق الأوسط.',
            quickLinks: 'روابط سريعة',
            contactInfo: 'معلومات الاتصال',
            copyright: 'ChloroMaster. جميع الحقوق محفوظة.',
            privacy: 'سياسة الخصوصية',
            terms: 'شروط الخدمة'
        },

        // Counters
        counters: {
            lastUpdated: '2025-12-22',
            yearsExp: 'سنوات الخبرة',
            projectsCompleted: 'المشاريع المكتملة',
            trustedPartners: 'الشركاء الموثوقون'
        },

        // FAQ Section
        faq: {
            lastUpdated: '2025-12-22',
            badge: 'الأسئلة الشائعة',
            title: 'الأسئلة',
            titleHighlight: 'الشائعة',
            subtitle: 'ابحث عن إجابات للأسئلة الشائعة حول خدماتنا وأنظمتنا ودعمنا.',
            items: {
                service: {
                    question: 'كيف يمكنني طلب خدمة لنظام الكلور الخاص بي؟',
                    answer: 'يمكنك طلب الخدمة عن طريق الاتصال بنا على +20 122 215 5310، أو ملء نموذج الاتصال عبر الإنترنت، أو إرسال بريد إلكتروني مباشر إلينا. نحن نقدم دعماً طارئاً على مدار الساعة طوال أيام الأسبوع للأنظمة الحرجة ونستجيب لجميع طلبات الخدمة خلال 24 ساعة.'
                },
                capacity: {
                    question: 'ما هو نطاق السعة الذي تدعمه أنظمة الكلور الخاصة بكم؟',
                    answer: 'تتراوح أنظمة الكلور لدينا من 10 كجم/ساعة إلى 120 كجم/ساعة، وهي مناسبة للمرافق البلدية الصغيرة إلى محطات معالجة مياه الصرف الصحي الكبيرة. يمكننا أيضاً تصميم حلول مخصصة لمتطلبات سعة محددة.'
                },
                safety: {
                    question: 'ما هي ميزات السلامة المتضمنة في أنظمتكم؟',
                    answer: 'تشمل جميع أنظمتنا ميزات سلامة شاملة: كشف تلقائي للغاز، أنظمة تهوية طوارئ تصل إلى 5000 م³/ساعة، دشات أمان، محطات غسيل العيون، أجهزة استشعار التسرب، وآليات إغلاق تلقائي. نحن نلتزم بمعايير السلامة الدولية.'
                },
                installation: {
                    question: 'كم من الوقت يستغرق التركيب والتشغيل؟',
                    answer: 'يختلف وقت التركيب مع تعقيد وحجم النظام. عادةً، يستغرق نظام الكلور القياسي من 2 إلى 4 أسابيع من التسليم إلى التشغيل الكامل. نقدم جداول زمنية مفصلة للمشروع أثناء التخطيط ونعمل بكفاءة لتقليل وقت التوقف.'
                },
                maintenance: {
                    question: 'هل تقدمون خدمات الصيانة والإصلاح الشامل؟',
                    answer: 'نعم، نقدم عقود صيانة شاملة، إصلاحات شاملة للنظام، ترقيات السعة، وخدمات التحديث. يمكن لفريقنا صيانة الأنظمة التي قمنا بتركيبها بالإضافة إلى المنشآت الحالية من مصنعين آخرين.'
                },
                emergency: {
                    question: 'ماذا يجب أن أفعل في حالة طوارئ غاز الكلور؟',
                    answer: 'قم بتفعيل خطة الاستجابة للطوارئ في منشأتك فوراً، وقم بإخلاء المنطقة، واتصل بخدمات الطوارئ. خط الطوارئ لدينا على مدار الساعة طوال أيام الأسبوع +20 123 456 7890 متاح للدعم الفني. تتضمن جميع منشآتنا أنظمة معادلة تلقائية مصممة للاستجابة للطوارئ.'
                }
            },
            ctaTitle: 'هل لا زلت لديك أسئلة؟',
            ctaSubtitle: 'فريق الخبراء لدينا هنا للمساعدة. اتصل بنا عبر الهاتف أو البريد الإلكتروني للحصول على المساعدة الفورية.',
            callButton: 'اتصل بنا الآن',
            emailButton: 'إرسال بريد إلكتروني'
        },

        common: {
            loading: 'جاري التحميل...'
        },

        // Generic/common UI strings
        common_ui: {
            lastUpdated: '2025-12-22',
            back: 'رجوع',
            requestDatasheet: 'طلب ورقة البيانات',
            getInTouch: 'تواصل معنا',
            equipmentNotFound: 'المعدات غير موجودة',
            fieldsRequired: 'الحقول التي تحمل علامة * مطلوبة.',
            serviceNotFound: 'الخدمة غير موجودة',
            backToHome: 'العودة إلى الرئيسية',
            equipmentGallery: 'معرض المعدات',
            includedInServices: 'مدرج في الخدمات',
            equipmentTag: 'المعدات',
            equipmentDescription: 'مصنعة وفقاً لمعايير الصناعة مع خيارات قابلة للتكوين للمواد والأحجام. للحصول على التفاصيل الفنية الكاملة، قم بتنزيل ورقة البيانات أدناه.',
            datasheetUnavailable: 'إذا لم تكن ورقة البيانات متاحة، اتصل بنا وسنقدمها لك.',
            datasheetPrompt: 'يرجى ملء النموذج أدناه لتلقي ورقة البيانات.',
            datasheetSubmitted: 'شكراً لك - يجب أن يبدأ تنزيل ورقة البيانات. تحقق من بريدك الإلكتروني للحصول على نسخة.'
        }
    }
};

// Available languages for the UI
export const availableLanguages = ['en', 'ar'];

// Deep-merge helper: fills missing keys in `target` from `source` recursively.
function fillMissingKeys(source, target) {
    if (typeof source !== 'object' || source === null) return target;
    if (typeof target !== 'object' || target === null) return source;

    const out = Array.isArray(source) ? [...source] : { ...source };

    Object.keys(source).forEach(key => {
        const sVal = source[key];
        const tVal = target[key];

        if (tVal === undefined || tVal === null) {
            out[key] = sVal;
        } else if (typeof sVal === 'object' && sVal !== null && !Array.isArray(sVal)) {
            out[key] = fillMissingKeys(sVal, tVal);
        } else {
            out[key] = tVal;
        }
    });

    // Include any extra keys present in target but not in source
    Object.keys(target).forEach(k => {
        if (out[k] === undefined) out[k] = target[k];
    });

    return out;
}

// Normalize translations so every language has the same key structure.
export const normalizedTranslations = {
    en: translations.en,
    ar: fillMissingKeys(translations.en, translations.ar)
};

// Helper to get translation object for a language (falls back to English)
export function getTranslation(lang) {
    return normalizedTranslations[lang] || normalizedTranslations.en;
}

export default normalizedTranslations;