import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import config from '../../config/config';

const SubmissionDetail = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const { id } = useParams();

    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        fetchSubmissionDetail();
    }, [id]);

    const fetchSubmissionDetail = async () => {
        try {
            const response = await fetch(
                `${config.api.baseURL}/admin/submissions/${id}`
            );

            if (!response.ok) throw new Error('Failed to fetch submission');

            const data = await response.json();
            setSubmission(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (isRead) => {
        try {
            const response = await fetch(
                `${config.api.baseURL}/admin/submissions/${id}/read`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(isRead)
                }
            );

            if (!response.ok) throw new Error('Failed to update status');

            setSubmission({ ...submission, isRead });
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
            return;
        }

        try {
            const response = await fetch(
                `${config.api.baseURL}/admin/submissions/${id}`,
                { method: 'DELETE' }
            );

            if (!response.ok) throw new Error('Failed to delete');

            navigate('/admin/submissions');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    if (error || !submission) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Error</h3>
                    <p>{error || 'Submission not found'}</p>
                    <button
                        onClick={() => navigate('/admin/submissions')}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {language === 'ar' ? 'العودة للقائمة' : 'Back to List'}
                    </button>
                </div>
            </div>
        );
    }

    const InfoRow = ({ label, value }) => (
        <div className="py-3 border-b border-gray-200 last:border-0">
            <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
            <dd className="text-base text-gray-900">{value || '-'}</dd>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <button
                                onClick={() => navigate('/admin/submissions')}
                                className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
                            >
                                ← {language === 'ar' ? 'العودة' : 'Back'}
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {language === 'ar' ? 'تفاصيل الرسالة' : 'Submission Detail'}
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleMarkAsRead(!submission.isRead)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                {submission.isRead
                                    ? (language === 'ar' ? 'تعليم كغير مقروءة' : 'Mark Unread')
                                    : (language === 'ar' ? 'تعليم كمقروءة' : 'Mark Read')
                                }
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                {language === 'ar' ? 'حذف' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Status Badge */}
                <div className="mb-6">
                    {submission.isRead ? (
                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                            {language === 'ar' ? 'مقروءة' : 'Read'}
                        </span>
                    ) : (
                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {language === 'ar' ? 'جديدة' : 'New'}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span>👤</span>
                            {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                        </h2>
                        <dl>
                            <InfoRow
                                label={language === 'ar' ? 'الاسم الأول' : 'First Name'}
                                value={submission.firstName}
                            />
                            <InfoRow
                                label={language === 'ar' ? 'الاسم الأخير' : 'Last Name'}
                                value={submission.lastName}
                            />
                            <InfoRow
                                label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                                value={submission.email}
                            />
                            <InfoRow
                                label={language === 'ar' ? 'الهاتف' : 'Phone'}
                                value={submission.phone}
                            />
                        </dl>
                    </div>

                    {/* Company Information */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span>🏢</span>
                            {language === 'ar' ? 'معلومات الشركة' : 'Company Information'}
                        </h2>
                        <dl>
                            <InfoRow
                                label={language === 'ar' ? 'الشركة' : 'Company'}
                                value={submission.company}
                            />
                            <InfoRow
                                label={language === 'ar' ? 'الصناعة' : 'Industry'}
                                value={submission.industry}
                            />
                            <InfoRow
                                label={language === 'ar' ? 'الدولة' : 'Country'}
                                value={submission.country}
                            />
                            <InfoRow
                                label={language === 'ar' ? 'الرمز البريدي' : 'Postal Code'}
                                value={submission.postalCode}
                            />
                        </dl>
                    </div>

                    {/* Message */}
                    <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span>💬</span>
                            {language === 'ar' ? 'الرسالة' : 'Message'}
                        </h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-800 whitespace-pre-wrap">
                                {submission.message}
                            </p>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span>📊</span>
                            {language === 'ar' ? 'بيانات إضافية' : 'Metadata'}
                        </h2>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoRow
                                label={language === 'ar' ? 'تاريخ الإرسال' : 'Submitted At'}
                                value={new Date(submission.submittedAt).toLocaleString()}
                            />
                            <InfoRow
                                label={language === 'ar' ? 'عنوان IP' : 'IP Address'}
                                value={submission.ipAddress}
                            />
                            <div className="md:col-span-2">
                                <InfoRow
                                    label={language === 'ar' ? 'المتصفح' : 'User Agent'}
                                    value={submission.userAgent}
                                />
                            </div>
                            <InfoRow
                                label={language === 'ar' ? 'استقبال الرسائل' : 'Receive Emails'}
                                value={submission.receiveEmails
                                    ? (language === 'ar' ? 'نعم' : 'Yes')
                                    : (language === 'ar' ? 'لا' : 'No')
                                }
                            />
                        </dl>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SubmissionDetail;
