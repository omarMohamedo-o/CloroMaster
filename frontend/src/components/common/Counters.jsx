import React from 'react';

const data = [
    { id: 1, label: 'Projects', value: 120 },
    { id: 2, label: 'Clients', value: 60 },
    { id: 3, label: 'Years', value: 15 },
];

export default function Counters() {
    return (
        <section className="py-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                    {data.map(d => (
                        <div key={d.id} className="bg-white dark:bg-gray-800 p-4 rounded">
                            <div className="text-2xl font-bold">{d.value}</div>
                            <div className="text-sm text-gray-500">{d.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
