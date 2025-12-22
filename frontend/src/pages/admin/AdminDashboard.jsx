import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import config from '../../config/config';

const AdminDashboard = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        fetchDashboardStats();
    }, [navigate]);

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch(`${config.api.baseURL}/admin/dashboard/stats`);

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard stats');
            }

            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
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

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Error</h3>
                    <p>{error}</p>
                    <button
                        onClick={fetchDashboardStats}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                    </button>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, subtitle, icon, color }) => (
        <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className="text-4xl opacity-20">{icon}</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
                            </h1>
                            <p className="text-sm text-gray-600">
                                ChloroMaster Analytics
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin/submissions')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {language === 'ar' ? 'الرسائل' : 'Submissions'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title={language === 'ar' ? 'إجمالي الزوار' : 'Total Visitors'}
                        value={stats.totalVisitors.toLocaleString()}
                        subtitle={language === 'ar' ? `اليوم: ${stats.todayVisitors}` : `Today: ${stats.todayVisitors}`}
                        icon="👥"
                        color="border-blue-500"
                    />

                    <StatCard
                        title={language === 'ar' ? 'إجمالي الرسائل' : 'Total Submissions'}
                        value={stats.totalSubmissions.toLocaleString()}
                        subtitle={language === 'ar' ? `اليوم: ${stats.todaySubmissions}` : `Today: ${stats.todaySubmissions}`}
                        icon="📧"
                        color="border-green-500"
                    />

                    <StatCard
                        title={language === 'ar' ? 'رسائل غير مقروءة' : 'Unread Messages'}
                        value={stats.unreadSubmissions}
                        icon="📬"
                        color="border-yellow-500"
                    />

                    <StatCard
                        title={language === 'ar' ? 'معدل التحويل' : 'Conversion Rate'}
                        value={`${stats.conversionRate}%`}
                        icon="📊"
                        color="border-purple-500"
                    />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Traffic Sources */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {language === 'ar' ? 'أهم مصادر الزيارات' : 'Top Traffic Sources'}
                        </h2>
                        {stats.topTrafficSources && stats.topTrafficSources.length > 0 ? (
                            <div className="space-y-3">
                                {stats.topTrafficSources.map((source, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700 truncate">
                                                {source.source}
                                            </p>
                                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${source.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <span className="ml-4 text-sm font-semibold text-gray-600">
                                            {source.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                {language === 'ar' ? 'لا توجد بيانات' : 'No data available'}
                            </p>
                        )}
                    </div>

                    {/* Top Pages */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {language === 'ar' ? 'الصفحات الأكثر زيارة' : 'Top Pages'}
                        </h2>
                        {stats.topPages && stats.topPages.length > 0 ? (
                            <div className="space-y-2">
                                {stats.topPages.map((page, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-sm text-gray-700 truncate flex-1">
                                            {page.page}
                                        </span>
                                        <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                            {page.views}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                {language === 'ar' ? 'لا توجد بيانات' : 'No data available'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/admin/submissions?filter=unread')}
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                        >
                            <div className="text-2xl mb-2">📬</div>
                            <h3 className="font-semibold text-gray-800">
                                {language === 'ar' ? 'عرض الرسائل غير المقروءة' : 'View Unread Messages'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {stats.unreadSubmissions} {language === 'ar' ? 'رسالة' : 'messages'}
                            </p>
                        </button>

                        <button
                            onClick={() => navigate('/admin/submissions')}
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
                        >
                            <div className="text-2xl mb-2">📋</div>
                            <h3 className="font-semibold text-gray-800">
                                {language === 'ar' ? 'جميع الرسائل' : 'All Submissions'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {stats.totalSubmissions} {language === 'ar' ? 'إجمالي' : 'total'}
                            </p>
                        </button>

                        <button
                            onClick={fetchDashboardStats}
                            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                        >
                            <div className="text-2xl mb-2">🔄</div>
                            <h3 className="font-semibold text-gray-800">
                                {language === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {language === 'ar' ? 'تحديث الإحصائيات' : 'Update statistics'}
                            </p>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
