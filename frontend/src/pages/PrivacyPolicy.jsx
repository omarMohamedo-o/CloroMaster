import React from 'react';
import SubpageLayout from '../components/layout/SubpageLayout';
import StaticInfoPage from '../components/common/StaticInfoPage';

export default function PrivacyPolicy() {

    const content = {
        en: {
            title: 'Privacy Policy',
            lastUpdated: 'Last Updated: January 3, 2026',
            sections: [
                {
                    title: 'Who We Are',
                    content: 'ChloroMaster Engineering, Contracting & Supplies Co. Ltd is a dedicated engineering firm specializing in chlorine systems and electromechanical installation and commissioning. Our website address is: https://chloromaster.com'
                },
                {
                    title: 'What Data We Collect',
                    content: 'We collect information that you voluntarily provide to us when you:',
                    list: [
                        'Fill out contact forms (Name, Email, Phone Number, Company Name, Message)',
                        'Request product datasheets (Name, Email, Phone Number, Company Name)',
                        'Subscribe to our newsletter (Email)',
                        'Visit our website (IP address, browser type, pages visited, time spent)'
                    ]
                },
                {
                    title: 'How We Use Your Data',
                    content: 'We use the collected data for the following purposes:',
                    list: [
                        'To respond to your inquiries and provide requested information',
                        'To send product datasheets and technical documentation',
                        'To send periodic emails about our services (if you opted in)',
                        'To improve our website and services',
                        'To maintain security and prevent fraud'
                    ]
                },
                {
                    title: 'Cookies',
                    content: 'Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device. We use cookies for:',
                    list: [
                        'Session management (keeping you logged in)',
                        'User preferences (language selection, theme)',
                        'Analytics (understanding how visitors use our site)',
                        'Security (preventing fraudulent activity)'
                    ],
                    additional: 'You can control and/or delete cookies through your browser settings. However, please note that disabling cookies may affect the functionality of our website.'
                },
                {
                    title: 'Data Retention',
                    content: 'We retain your personal data for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law. Specifically:',
                    list: [
                        'Contact form submissions: Retained for up to 3 years for customer relationship management',
                        'Newsletter subscriptions: Until you unsubscribe',
                        'Website analytics: Anonymized after 26 months',
                        'Datasheet requests: Retained for 2 years for marketing purposes'
                    ]
                },
                {
                    title: 'Data Sharing',
                    content: 'We do not sell, trade, or rent your personal information to third parties. We may share your data with:',
                    list: [
                        'Service providers who assist us in operating our website and conducting our business (hosting providers, email services)',
                        'Legal authorities when required by law or to protect our rights',
                        'Business partners for joint projects (only with your explicit consent)'
                    ]
                },
                {
                    title: 'Your Rights',
                    content: 'Under applicable data protection laws, you have the following rights:',
                    list: [
                        'Access: Request a copy of the personal data we hold about you',
                        'Correction: Request correction of inaccurate or incomplete data',
                        'Deletion: Request deletion of your personal data',
                        'Objection: Object to the processing of your data',
                        'Portability: Request transfer of your data to another service',
                        'Withdrawal: Withdraw consent for data processing at any time'
                    ],
                    additional: 'To exercise these rights, please contact us at: info@chloromaster.com'
                },
                {
                    title: 'Data Security',
                    content: 'We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:',
                    list: [
                        'SSL/TLS encryption for data transmission',
                        'Secure servers with regular security updates',
                        'Access controls and authentication',
                        'Regular security audits and monitoring',
                        'Employee training on data protection'
                    ]
                },
                {
                    title: 'Third-Party Links',
                    content: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.'
                },
                {
                    title: 'Children\'s Privacy',
                    content: 'Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete such information.'
                },
                {
                    title: 'Changes to This Policy',
                    content: 'We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date.'
                },
                {
                    title: 'Contact Us',
                    content: 'If you have any questions, concerns, or requests regarding this privacy policy or our data practices, please contact us at:',
                    contactInfo: {
                        company: 'ChloroMaster Engineering, Contracting & Supplies Co. Ltd',
                        email: 'info@chloromaster.com',
                        phone: '+20 122 215 5310',
                        address: 'Egypt'
                    }
                }
            ]
        },
        ar: {
            title: 'سياسة الخصوصية',
            lastUpdated: 'آخر تحديث: 3 يناير 2026',
            sections: [
                {
                    title: 'من نحن',
                    content: 'شركة ChloroMaster للهندسة والمقاولات والتوريدات هي شركة هندسية متخصصة في أنظمة الكلور وتركيب وتشغيل الأنظمة الكهروميكانيكية. عنوان موقعنا الإلكتروني: https://chloromaster.com'
                },
                {
                    title: 'البيانات التي نجمعها',
                    content: 'نجمع المعلومات التي تقدمها لنا طواعية عندما:',
                    list: [
                        'تملأ نماذج الاتصال (الاسم، البريد الإلكتروني، رقم الهاتف، اسم الشركة، الرسالة)',
                        'تطلب نشرات بيانات المنتجات (الاسم، البريد الإلكتروني، رقم الهاتف، اسم الشركة)',
                        'تشترك في نشرتنا الإخبارية (البريد الإلكتروني)',
                        'تزور موقعنا (عنوان IP، نوع المتصفح، الصفحات المزورة، الوقت المستغرق)'
                    ]
                },
                {
                    title: 'كيف نستخدم بياناتك',
                    content: 'نستخدم البيانات المجمعة للأغراض التالية:',
                    list: [
                        'للرد على استفساراتك وتقديم المعلومات المطلوبة',
                        'لإرسال نشرات بيانات المنتجات والوثائق التقنية',
                        'لإرسال رسائل بريد إلكتروني دورية حول خدماتنا (إذا اخترت ذلك)',
                        'لتحسين موقعنا وخدماتنا',
                        'للحفاظ على الأمان ومنع الاحتيال'
                    ]
                },
                {
                    title: 'ملفات تعريف الارتباط',
                    content: 'يستخدم موقعنا ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح. نستخدم ملفات تعريف الارتباط لـ:',
                    list: [
                        'إدارة الجلسات (إبقائك مسجل الدخول)',
                        'تفضيلات المستخدم (اختيار اللغة، السمة)',
                        'التحليلات (فهم كيفية استخدام الزوار لموقعنا)',
                        'الأمان (منع النشاط الاحتيالي)'
                    ],
                    additional: 'يمكنك التحكم في ملفات تعريف الارتباط أو حذفها من خلال إعدادات المتصفح الخاص بك.'
                },
                {
                    title: 'الاحتفاظ بالبيانات',
                    content: 'نحتفظ ببياناتك الشخصية للمدة اللازمة لتحقيق الأغراض المذكورة في سياسة الخصوصية هذه:',
                    list: [
                        'استمارات الاتصال: الاحتفاظ بها لمدة تصل إلى 3 سنوات',
                        'اشتراكات النشرة الإخبارية: حتى تقوم بإلغاء الاشتراك',
                        'تحليلات الموقع: مجهولة المصدر بعد 26 شهرًا',
                        'طلبات نشرات البيانات: الاحتفاظ بها لمدة سنتين'
                    ]
                },
                {
                    title: 'مشاركة البيانات',
                    content: 'لا نبيع أو نتاجر أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك بياناتك مع:',
                    list: [
                        'مزودي الخدمات الذين يساعدوننا في تشغيل موقعنا',
                        'السلطات القانونية عند الطلب بموجب القانون',
                        'شركاء الأعمال للمشاريع المشتركة (فقط بموافقتك الصريحة)'
                    ]
                },
                {
                    title: 'حقوقك',
                    content: 'بموجب قوانين حماية البيانات المعمول بها، لديك الحقوق التالية:',
                    list: [
                        'الوصول: طلب نسخة من البيانات الشخصية التي نحتفظ بها عنك',
                        'التصحيح: طلب تصحيح البيانات غير الدقيقة أو غير الكاملة',
                        'الحذف: طلب حذف بياناتك الشخصية',
                        'الاعتراض: الاعتراض على معالجة بياناتك',
                        'قابلية النقل: طلب نقل بياناتك إلى خدمة أخرى',
                        'السحب: سحب الموافقة على معالجة البيانات في أي وقت'
                    ],
                    additional: 'لممارسة هذه الحقوق، يرجى الاتصال بنا على: info@chloromaster.com'
                },
                {
                    title: 'أمن البيانات',
                    content: 'نطبق تدابير أمنية تقنية وتنظيمية مناسبة لحماية بياناتك الشخصية:',
                    list: [
                        'تشفير SSL/TLS لنقل البيانات',
                        'خوادم آمنة مع تحديثات أمنية منتظمة',
                        'ضوابط الوصول والمصادقة',
                        'عمليات تدقيق ومراقبة أمنية منتظمة',
                        'تدريب الموظفين على حماية البيانات'
                    ]
                },
                {
                    title: 'روابط الطرف الثالث',
                    content: 'قد يحتوي موقعنا على روابط لمواقع الطرف الثالث. نحن لسنا مسؤولين عن ممارسات الخصوصية أو محتوى هذه المواقع الخارجية.'
                },
                {
                    title: 'خصوصية الأطفال',
                    content: 'خدماتنا ليست موجهة للأفراد الذين تقل أعمارهم عن 18 عامًا. لا نجمع عن قصد معلومات شخصية من الأطفال.'
                },
                {
                    title: 'التغييرات على هذه السياسة',
                    content: 'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات مهمة عن طريق نشر السياسة الجديدة على هذه الصفحة.'
                },
                {
                    title: 'اتصل بنا',
                    content: 'إذا كان لديك أي أسئلة أو استفسارات بخصوص سياسة الخصوصية هذه، يرجى الاتصال بنا على:',
                    contactInfo: {
                        company: 'شركة ChloroMaster للهندسة والمقاولات والتوريدات',
                        email: 'info@chloromaster.com',
                        phone: '+20 122 215 5310',
                        address: 'مصر'
                    }
                }
            ]
        }
    };

    return (
        <SubpageLayout>
            <StaticInfoPage content={content} />
        </SubpageLayout>
    );
}
