import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import config from '../../config/config';

const AdminLogin = () => {
    const { language, translations } = useLanguage();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${config.api.baseURL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store auth data
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify({
                username: data.username,
                email: data.email,
                fullName: data.fullName
            }));

            // Redirect to dashboard
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">
                        ChloroMaster
                    </h1>
                    <p className="text-gray-600">Admin Panel</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {language === 'ar' ? 'تسجيل الدخول' : 'Admin Login'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder={language === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {language === 'ar' ? 'كلمة المرور' : 'Password'}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? (language === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...')
                                : (language === 'ar' ? 'تسجيل الدخول' : 'Login')
                            }
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        {language === 'ar'
                            ? '© 2025 كلورو ماستر. جميع الحقوق محفوظة.'
                            : '© 2025 ChloroMaster. All rights reserved.'
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
