import { useState, useEffect, useRef } from 'react';

// Hook: returns a boolean indicating whether the page (or main container)
// has been scrolled beyond the given threshold (in pixels).
export function useScrollVisibility(threshold = 100) {
    const [visible, setVisible] = useState(false);
    const ticking = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const container = document.querySelector('main') || window;

        const getScrollY = () => {
            if (container === window) {
                return window.pageYOffset || document.documentElement.scrollTop || 0;
            }
            try {
                return container.scrollTop || 0;
            } catch (e) {
                return 0;
            }
        };

        const update = () => {
            const y = getScrollY();
            setVisible(y > threshold);
            ticking.current = false;
        };

        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;
            // use rAF for better performance
            window.requestAnimationFrame(update);
        };

        // Attach listeners
        try {
            if (container === window) window.addEventListener('scroll', onScroll, { passive: true });
            else container.addEventListener('scroll', onScroll, { passive: true });
        } catch (e) {
            // ignore attach errors
        }

        // initial check
        update();

        return () => {
            try {
                if (container === window) window.removeEventListener('scroll', onScroll);
                else container.removeEventListener('scroll', onScroll);
            } catch (e) { /* ignore */ }
        };
    }, [threshold]);

    return visible;
}

export default useScrollVisibility;
