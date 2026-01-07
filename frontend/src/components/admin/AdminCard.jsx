import React from 'react';

export default function AdminCard({ icon, title, children, className = '' }) {
    return (
        <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
            {title && (
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>{icon}</span>
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
}
