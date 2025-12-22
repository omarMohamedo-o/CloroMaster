import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import config from '../../config/config';

const SubmissionsList = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

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

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        fetchSubmissions();
    }, [pagination.page, filters]);

    const fetchSubmissions = async () => {
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
            setPagination({
                ...pagination,
                total: data.total,
                totalPages: data.totalPages
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
            const response = await fetch(
                `${config.api.baseURL}/admin/submissions/${id}/read`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(isRead)
                }
            );

            if (!response.ok) throw new Error('Failed to update status');

            // Refresh list
            fetchSubmissions();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
            return;
        }

        try {
            const response = await fetch(
                `${config.api.baseURL}/admin/submissions/${id}`,
                { method: 'DELETE' }
            );

            if (!response.ok) throw new Error('Failed to delete');

            fetchSubmissions();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {language === 'ar' ? 'الرسائل' : 'Submissions'}
                            </h1>
                            <p className="text-sm text-gray-600">
                                {pagination.total} {language === 'ar' ? 'رسالة' : 'total'}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('adminToken');
                                    localStorage.removeItem('adminUser');
                                    navigate('/admin/login');
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {language === 'ar' ? 'بحث' : 'Search'}
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
                                {language === 'ar' ? 'الكل' : 'All'}
                            </button>
                            <button
                                onClick={() => handleFilterChange('false')}
                                className={`px-4 py-2 rounded-lg ${filters.isRead === 'false'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {language === 'ar' ? 'غير مقروءة' : 'Unread'}
                            </button>
                            <button
                                onClick={() => handleFilterChange('true')}
                                className={`px-4 py-2 rounded-lg ${filters.isRead === 'true'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {language === 'ar' ? 'مقروءة' : 'Read'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-center text-red-600">
                            {error}
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            {language === 'ar' ? 'لا توجد رسائل' : 'No submissions found'}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                {language === 'ar' ? 'الاسم' : 'Name'}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                {language === 'ar' ? 'البريد' : 'Email'}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                {language === 'ar' ? 'الشركة' : 'Company'}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                {language === 'ar' ? 'التاريخ' : 'Date'}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                {language === 'ar' ? 'الحالة' : 'Status'}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                {language === 'ar' ? 'الإجراءات' : 'Actions'}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {submissions.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {sub.fullName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600">{sub.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600">{sub.company || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">
                                                        {new Date(sub.submittedAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {sub.isRead ? (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                            {language === 'ar' ? 'مقروءة' : 'Read'}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            {language === 'ar' ? 'جديدة' : 'New'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/submissions/${sub.id}`)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            {language === 'ar' ? 'عرض' : 'View'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleMarkAsRead(sub.id, !sub.isRead)}
                                                            className="text-green-600 hover:text-green-800"
                                                        >
                                                            {sub.isRead
                                                                ? (language === 'ar' ? 'غير مقروءة' : 'Unread')
                                                                : (language === 'ar' ? 'مقروءة' : 'Read')
                                                            }
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(sub.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            {language === 'ar' ? 'حذف' : 'Delete'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    {language === 'ar'
                                        ? `عرض ${(pagination.page - 1) * pagination.pageSize + 1} - ${Math.min(pagination.page * pagination.pageSize, pagination.total)} من ${pagination.total}`
                                        : `Showing ${(pagination.page - 1) * pagination.pageSize + 1} - ${Math.min(pagination.page * pagination.pageSize, pagination.total)} of ${pagination.total}`
                                    }
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {language === 'ar' ? 'السابق' : 'Previous'}
                                    </button>
                                    <span className="px-4 py-2 text-gray-700">
                                        {pagination.page} / {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                        disabled={pagination.page >= pagination.totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {language === 'ar' ? 'التالي' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SubmissionsList;
