import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import { PATHS } from '../../app/routes';
import { useLanguage } from '../../context/LanguageContext';
import config from '../../config/config';
import InfoRow from '../../components/admin/InfoRow';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminCard from '../../components/admin/AdminCard';
import LoadingOrError from '../../components/admin/LoadingOrError';
import StatusBadge from '../../components/admin/StatusBadge';

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
            await import('../../services/adminSubmissions').then(m => m.markSubmissionRead(id, isRead));
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
            await import('../../services/adminSubmissions').then(m => m.deleteSubmission(id));
            navigate(PATHS.ADMIN_SUBMISSIONS);
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return <LoadingOrError loading loadingMessage={t('admin.loading')} />;
    }

    if (error || !submission) {
        return (
            <LoadingOrError error title={t('admin.error')} message={error || 'Submission not found'}>
                <BackButton className="mt-4" />
            </LoadingOrError>
        );
    }

    // InfoRow moved to shared component

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminPageHeader
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
                    <StatusBadge isRead={submission.isRead} t={t} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <AdminCard icon="👤" title={t('admin.contactInfo')}>
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
                    </AdminCard>

                    {/* Company Information */}
                    <AdminCard icon="🏢" title={t('admin.companyInfo')}>
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
                    </AdminCard>

                    {/* Message */}
                    <AdminCard icon="💬" title={t('admin.message')} className="lg:col-span-2">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-800 whitespace-pre-wrap">
                                {submission.message}
                            </p>
                        </div>
                    </AdminCard>

                    {/* Metadata */}
                    <AdminCard icon="📊" title={t('admin.metadata')} className="lg:col-span-2">
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
                    </AdminCard>
                </div>
            </main>
        </div>
    );
};

export default SubmissionDetail;
