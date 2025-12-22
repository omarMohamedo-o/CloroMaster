import React, { useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

export default function Lightbox({ images = [], startIndex = 0, onClose }) {
    const [index, setIndex] = React.useState(startIndex || 0);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose && onClose();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [index]);

    useEffect(() => setIndex(startIndex || 0), [startIndex]);

    if (!images || images.length === 0) return null;

    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
    const next = () => setIndex((i) => (i + 1) % images.length);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <button onClick={onClose} aria-label="Close" className="absolute top-6 right-6 text-white p-2 rounded-full bg-black/40 hover:bg-black/60">
                <FaTimes />
            </button>

            <button onClick={prev} aria-label="Previous" className="absolute left-4 text-white p-3 rounded-full bg-black/40 hover:bg-black/60">
                <FaChevronLeft />
            </button>

            <div className="max-w-[90%] max-h-[90%] flex items-center justify-center">
                <img src={images[index]} alt={`Image ${index + 1}`} className="max-w-full max-h-full object-contain" />
            </div>

            <button onClick={next} aria-label="Next" className="absolute right-4 text-white p-3 rounded-full bg-black/40 hover:bg-black/60">
                <FaChevronRight />
            </button>
        </div>
    );
}
