import React from 'react';
import StatusBadge from './StatusBadge';

export default function SubmissionsTable({ submissions = [], t, onView, onMark, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.name')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.email')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.company')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.date')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.status')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('admin.actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{sub.fullName}</div>
                            </td>
                            <td className="px-6 py-4"><div className="text-sm text-gray-600">{sub.email}</div></td>
                            <td className="px-6 py-4"><div className="text-sm text-gray-600">{sub.company || '-'}</div></td>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{new Date(sub.submittedAt).toLocaleDateString()}</div></td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge isRead={sub.isRead} t={t} small />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex gap-2">
                                    <button onClick={() => onView(sub.id)} className="text-blue-600 hover:text-blue-800">{t('admin.view')}</button>
                                    <button onClick={() => onMark(sub.id, !sub.isRead)} className="text-green-600 hover:text-green-800">{sub.isRead ? t('admin.markAsUnread') : t('admin.markAsRead')}</button>
                                    <button onClick={() => onDelete(sub.id)} className="text-red-600 hover:text-red-800">{t('admin.delete')}</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
