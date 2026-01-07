import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import config from '../../config/config';
import { PATHS } from '../../app/routes';
import SubmissionsTable from '../../components/admin/SubmissionsTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminCard from '../../components/admin/AdminCard';
import LoadingOrError from '../../components/admin/LoadingOrError';

const SubmissionsList = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
    });

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        isRead: searchParams.get('filter') === 'unread' ? 'false' : ''
    });

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page,
                pageSize: pagination.pageSize,
                ...(filters.search && { search: filters.search }),
                ...(filters.isRead && { isRead: filters.isRead })
            });

            const response = await fetch(
                `${config.api.baseURL}/admin/submissions?${params}`
            );

            if (!response.ok) throw new Error('Failed to fetch submissions');

            const data = await response.json();
            setSubmissions(data.data);
            setPagination((prev) => ({
                ...prev,
                total: data.total,
                totalPages: data.totalPages
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.pageSize, filters]);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate(PATHS.ADMIN_LOGIN);
            return;
        }

        fetchSubmissions();
    }, [fetchSubmissions, navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination({ ...pagination, page: 1 });
    };

    const handleFilterChange = (isRead) => {
        setFilters({ ...filters, isRead });
        setPagination({ ...pagination, page: 1 });
    };

    const handleMarkAsRead = async (id, isRead) => {
        try {
            await import('../../services/adminSubmissions').then(m => m.markSubmissionRead(id, isRead));
            fetchSubmissions();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.deleteConfirm'))) {
            return;
        }

        try {
            await import('../../services/adminSubmissions').then(m => m.deleteSubmission(id));
            fetchSubmissions();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminPageHeader
                title={t('admin.submissions')}
                subtitle={`${pagination.total} ${t('admin.total')}`}
                actions={[
                    { label: t('admin.dashboard'), onClick: () => navigate(PATHS.ADMIN_DASHBOARD) },
                    { label: t('admin.logout'), onClick: () => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); navigate(PATHS.ADMIN_LOGIN); } }
                ]}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <AdminCard title={t('admin.filters')} className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    placeholder={t('admin.searchPlaceholder')}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {t('admin.search')}
                                </button>
                            </div>
                        </form>

                        {/* Filter buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleFilterChange('')}
                                className={`px-4 py-2 rounded-lg ${filters.isRead === ''
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {t('admin.all')}
                            </button>
                            <button
                                onClick={() => handleFilterChange('false')}
                                className={`px-4 py-2 rounded-lg ${filters.isRead === 'false'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {t('admin.unread')}
                            </button>
                            <button
                                onClick={() => handleFilterChange('true')}
                                className={`px-4 py-2 rounded-lg ${filters.isRead === 'true'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {t('admin.read')}
                            </button>
                        </div>
                    </div>
                </AdminCard>

                {/* Submissions Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {loading ? (
                        <LoadingOrError loading loadingMessage={t('admin.loading')} />
                    ) : error ? (
                        <LoadingOrError error title={t('admin.error')} message={error} />
                    ) : submissions.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">{t('admin.noSubmissions')}</div>
                    ) : (
                        <SubmissionsTable
                            submissions={submissions}
                            t={t}
                            navigate={navigate}
                            onView={(id) => navigate(PATHS.ADMIN_SUBMISSION_DETAIL(id))}
                            onMark={handleMarkAsRead}
                            onDelete={handleDelete}
                            pagination={pagination}
                            setPagination={setPagination}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default SubmissionsList;
