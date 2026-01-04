import React from 'react';
import BackButton from '../common/BackButton';

export default function AdminHeader({ title, subtitle, actions = [], showBack = false, backClassName = '' }) {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        {showBack && <BackButton className={backClassName} />}
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                        {actions.map((a, i) => (
                            <button
                                key={i}
                                onClick={a.onClick}
                                className={a.className || 'px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'}
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}
