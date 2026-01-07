import React from 'react';

export default function LoadingOrError({ loading, error, title, message, loadingMessage, children }) {
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{loadingMessage || 'Loading...'}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
                    {title && <h3 className="font-semibold mb-2">{title}</h3>}
                    <p>{message || error}</p>
                    <div className="mt-4">
                        {children}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
