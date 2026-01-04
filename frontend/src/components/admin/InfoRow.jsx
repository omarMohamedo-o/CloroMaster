import React from 'react';

export default function InfoRow({ label, value }) {
    return (
        <div className="py-3 border-b border-gray-200 last:border-0">
            <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
            <dd className="text-base text-gray-900">{value || '-'}</dd>
        </div>
    );
}
