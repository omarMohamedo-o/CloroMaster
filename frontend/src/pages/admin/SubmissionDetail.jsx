import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import { PATHS } from '../../app/routes';
import { useLanguage } from '../../context/LanguageContext';
import config from '../../config/config';
import InfoRow from '../../components/admin/InfoRow';

const SubmissionDetail = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { id } = useParams();

    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSubmissionDetail = useCallback(async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate(PATHS.ADMIN_LOGIN);
            return;
        }

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
    }, [id, navigate]);

    useEffect(() => {
        fetchSubmissionDetail();
    }, [fetchSubmissionDetail]);

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
        if (!window.confirm(t('admin.deleteConfirm'))) {
            return;
        }

        try {
            const response = await fetch(
                `${config.api.baseURL}/admin/submissions/${id}`,
                { method: 'DELETE' }
            );

            if (!response.ok) throw new Error('Failed to delete');

            navigate(PATHS.ADMIN_SUBMISSIONS);
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
                        {t('admin.loading')}
                    </p>
                </div>
            </div>
        );
    }

    if (error || !submission) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">{t('admin.error')}</h3>
                    <p>{error || 'Submission not found'}</p>
                    <BackButton className="mt-4" />
                </div>
            </div>
        );
    }

    // InfoRow moved to shared component

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader
                showBack
                backClassName="mb-2 text-blue-600"
                title={t('admin.submissionDetail')}
                actions={[
                    { label: submission.isRead ? t('admin.markAsUnread') : t('admin.markAsRead'), onClick: () => handleMarkAsRead(!submission.isRead), className: 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700' },
                    { label: t('admin.delete'), onClick: handleDelete, className: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700' }
                ]}
            />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Status Badge */}
                <div className="mb-6">
                    {submission.isRead ? (
                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                            {t('admin.readStatus')}
                        </span>
                    ) : (
                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {t('admin.newStatus')}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span>👤</span>
                            {t('admin.contactInfo')}
                        </h2>
                        <dl>
                            <InfoRow
                                label={t('admin.firstName')}
                                value={submission.firstName}
                            />
                            <InfoRow
                                label={t('admin.lastName')}
                                value={submission.lastName}
                            />
                            <InfoRow
                                label={t('admin.email')}
                                value={submission.email}
                            />
                            <InfoRow
                                label={t('admin.phone')}
                                value={submission.phone}
                            />
                        </dl>
                    </div>

                    {/* Company Information */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span>🏢</span>
                            {t('admin.companyInfo')}
                        </h2>
                        <dl>
                            <InfoRow
                                label={t('admin.company')}
                                value={submission.company}
                            />
                            <InfoRow
                                label={t('admin.industry')}
                                value={submission.industry}
                            />
                            <InfoRow
                                label={t('admin.country')}
                                value={submission.country}
                            />
                            <InfoRow
                                label={t('admin.postalCode')}
                                value={submission.postalCode}
                            />
                        </dl>
                    </div>

                    {/* Message */}
                    <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span>💬</span>
                            {t('admin.message')}
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
                            {t('admin.metadata')}
                        </h2>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoRow
                                label={t('admin.submittedAt')}
                                value={new Date(submission.submittedAt).toLocaleString()}
                            />
                            <InfoRow
                                label={t('admin.ipAddress')}
                                value={submission.ipAddress}
                            />
                            <div className="md:col-span-2">
                                <InfoRow
                                    label={t('admin.userAgent')}
                                    value={submission.userAgent}
                                />
                            </div>
                            <InfoRow
                                label={t('admin.receiveEmails')}
                                value={submission.receiveEmails
                                    ? t('admin.yes')
                                    : t('admin.no')
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
