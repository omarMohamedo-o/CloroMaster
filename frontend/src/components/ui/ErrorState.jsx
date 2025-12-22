import React from 'react';

export default function ErrorState({ message = 'Something went wrong.' }) {
    return (
        <div className="p-8 text-center text-red-600">{message}</div>
    );
}
