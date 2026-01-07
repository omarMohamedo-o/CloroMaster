import React from 'react';

export default function StatusBadge({ isRead, small = false, t }) {
    const base = small ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';
    if (isRead) {
        return (
            <span className={`${base} font-semibold rounded-full bg-green-100 text-green-800`}>
                {t ? t('admin.readStatus') : 'Read'}
            </span>
        );
    }

    return (
        <span className={`${base} font-semibold rounded-full bg-yellow-100 text-yellow-800`}>
            {t ? t('admin.newStatus') : 'New'}
        </span>
    );
}
