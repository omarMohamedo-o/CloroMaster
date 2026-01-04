import React from 'react';
import SubpageLayout from '../components/layout/SubpageLayout';
import StaticInfoPage from '../components/common/StaticInfoPage';

export default function TermsOfService() {

    const content = {
        en: {
            title: 'Terms of Service',
            lastUpdated: 'Last Updated: January 3, 2026',
            sections: [
                {
                    title: 'Agreement to Terms',
                    content: 'By accessing and using the ChloroMaster website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.'
                },
                {
                    title: 'Use License',
                    content: 'Permission is granted to temporarily download one copy of the materials on ChloroMaster\'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:',
                    list: [
                        'Modify or copy the materials',
                        'Use the materials for any commercial purpose or public display',
                        'Attempt to reverse engineer any software contained on the website',
                        'Remove any copyright or other proprietary notations from the materials',
                        'Transfer the materials to another person or mirror the materials on any other server'
                    ]
                },
                {
                    title: 'Services Description',
                    content: 'ChloroMaster provides:',
                    list: [
                        'Engineering services for chlorine systems',
                        'Electromechanical installation and commissioning',
                        'Supply of chlorine handling equipment',
                        'Technical consulting and support',
                        'Product datasheets and technical documentation'
                    ]
                },
                {
                    title: 'User Responsibilities',
                    content: 'When using our website and services, you agree to:',
                    list: [
                        'Provide accurate and complete information in all forms',
                        'Maintain the security of your account credentials',
                        'Notify us immediately of any unauthorized use of your account',
                        'Use our services only for lawful purposes',
                        'Not attempt to gain unauthorized access to our systems',
                        'Not transmit any malicious code or viruses'
                    ]
                },
                {
                    title: 'Intellectual Property',
                    content: 'All content on this website, including but not limited to text, graphics, logos, images, technical drawings, and software, is the property of ChloroMaster or its content suppliers and is protected by international copyright laws. Unauthorized use of any materials may violate copyright, trademark, and other laws.'
                },
                {
                    title: 'Disclaimer',
                    content: 'The materials on ChloroMaster\'s website are provided on an \'as is\' basis. ChloroMaster makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.'
                },
                {
                    title: 'Limitations of Liability',
                    content: 'In no event shall ChloroMaster or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ChloroMaster\'s website, even if ChloroMaster or a ChloroMaster authorized representative has been notified orally or in writing of the possibility of such damage.'
                },
                {
                    title: 'Accuracy of Materials',
                    content: 'The materials appearing on ChloroMaster\'s website could include technical, typographical, or photographic errors. ChloroMaster does not warrant that any of the materials on its website are accurate, complete, or current. ChloroMaster may make changes to the materials contained on its website at any time without notice.'
                },
                {
                    title: 'Links to Third-Party Sites',
                    content: 'ChloroMaster has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ChloroMaster of the site. Use of any such linked website is at the user\'s own risk.'
                },
                {
                    title: 'Modifications to Terms',
                    content: 'ChloroMaster may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.'
                },
                {
                    title: 'Governing Law',
                    content: 'These terms and conditions are governed by and construed in accordance with the laws of Egypt, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.'
                },
                {
                    title: 'Contact Information',
                    content: 'If you have any questions about these Terms of Service, please contact us at:',
                    contactInfo: {
                        company: 'ChloroMaster Engineering, Contracting & Supplies Co. Ltd',
                        email: 'info@chloromaster.com',
                        phone: '+20 122 215 5310'
                    }
                }
            ]
        },
        ar: {
            title: 'شروط الخدمة',
            lastUpdated: 'آخر تحديث: 3 يناير 2026',
            sections: [
                {
                    title: 'الموافقة على الشروط',
                    content: 'باستخدام موقع ChloroMaster، فإنك توافق على الالتزام بشروط وأحكام هذه الاتفاقية. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام خدماتنا.'
                },
                {
                    title: 'ترخيص الاستخدام',
                    content: 'يُسمح لك بتنزيل نسخة واحدة من المواد على موقع ChloroMaster للعرض الشخصي وغير التجاري فقط. وبموجب هذا الترخيص، لا يجوز لك:',
                    list: [
                        'تعديل أو نسخ المواد',
                        'استخدام المواد لأي غرض تجاري أو عرض عام',
                        'محاولة الهندسة العكسية لأي برنامج موجود على الموقع',
                        'إزالة أي حقوق طبع أو ملاحظات ملكية أخرى من المواد',
                        'نقل المواد إلى شخص آخر أو نسخ المواد على أي خادم آخر'
                    ]
                },
                {
                    title: 'وصف الخدمات',
                    content: 'تقدم ChloroMaster:',
                    list: [
                        'خدمات هندسية لأنظمة الكلور',
                        'تركيب وتشغيل الأنظمة الكهروميكانيكية',
                        'توريد معدات التعامل مع الكلور',
                        'الاستشارات الفنية والدعم',
                        'نشرات بيانات المنتجات والوثائق الفنية'
                    ]
                },
                {
                    title: 'مسؤوليات المستخدم',
                    content: 'عند استخدام موقعنا وخدماتنا، فإنك توافق على:',
                    list: [
                        'تقديم معلومات دقيقة وكاملة في جميع النماذج',
                        'الحفاظ على أمان بيانات اعتماد حسابك',
                        'إخطارنا فورًا بأي استخدام غير مصرح به لحسابك',
                        'استخدام خدماتنا فقط للأغراض القانونية',
                        'عدم محاولة الوصول غير المصرح به إلى أنظمتنا',
                        'عدم نقل أي رمز ضار أو فيروسات'
                    ]
                },
                {
                    title: 'الملكية الفكرية',
                    content: 'جميع المحتويات على هذا الموقع، بما في ذلك النصوص والرسومات والشعارات والصور والرسومات الفنية والبرامج، هي ملك لـ ChloroMaster ومحمية بموجب قوانين حقوق النشر الدولية.'
                },
                {
                    title: 'إخلاء المسؤولية',
                    content: 'يتم توفير المواد على موقع ChloroMaster على أساس "كما هي". لا تقدم ChloroMaster أي ضمانات، صريحة أو ضمنية، وتخلي بموجب هذا مسؤوليتها عن جميع الضمانات الأخرى.'
                },
                {
                    title: 'حدود المسؤولية',
                    content: 'لن تكون ChloroMaster أو مورديها مسؤولين عن أي أضرار (بما في ذلك فقدان البيانات أو الأرباح) الناشئة عن استخدام أو عدم القدرة على استخدام المواد على موقع ChloroMaster.'
                },
                {
                    title: 'دقة المواد',
                    content: 'قد تحتوي المواد الموجودة على موقع ChloroMaster على أخطاء فنية أو طباعية أو تصويرية. لا تضمن ChloroMaster أن أيًا من المواد على موقعها دقيقة أو كاملة أو حديثة.'
                },
                {
                    title: 'روابط لمواقع الطرف الثالث',
                    content: 'لم تراجع ChloroMaster جميع المواقع المرتبطة بموقعها على الويب وليست مسؤولة عن محتويات أي موقع مرتبط. لا يعني إدراج أي رابط موافقة ChloroMaster على الموقع.'
                },
                {
                    title: 'تعديلات الشروط',
                    content: 'قد تقوم ChloroMaster بمراجعة شروط الخدمة هذه لموقعها على الويب في أي وقت دون إشعار. باستخدام هذا الموقع، فإنك توافق على الالتزام بالنسخة الحالية من شروط الخدمة هذه.'
                },
                {
                    title: 'القانون الحاكم',
                    content: 'تخضع هذه الشروط والأحكام وتفسر وفقًا لقوانين مصر، وأنت توافق بشكل لا رجعة فيه على الاختصاص الحصري للمحاكم في ذلك الموقع.'
                },
                {
                    title: 'معلومات الاتصال',
                    content: 'إذا كان لديك أي أسئلة حول شروط الخدمة هذه، يرجى الاتصال بنا على:',
                    contactInfo: {
                        company: 'شركة ChloroMaster للهندسة والمقاولات والتوريدات',
                        email: 'info@chloromaster.com',
                        phone: '+20 122 215 5310'
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
