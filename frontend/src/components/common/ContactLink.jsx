import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { PATHS } from '../../app/routes';

// Clickable wrapper that navigates to the contact section on the home page.
// If already on the home page, it smooth-scrolls to the anchor; otherwise
// it navigates to HOME with a `state.scrollTo` so the central ScrollHandler
// will perform the scroll after routing.
export default function ContactLink({ children, target = 'contact', className = '', asButton = false }) {
    const navigate = useNavigate();
    const location = useLocation();

    const onClick = (e) => {
        e?.preventDefault();
        const targetId = String(target || 'contact');
        if (location && location.pathname === PATHS.HOME) {
            try {
                scroller.scrollTo(targetId, { smooth: true, duration: 600, offset: -80 });
                return;
            } catch (err) {
                const el = document.getElementById(targetId) || document.getElementsByName(targetId)[0];
                if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
        }

        navigate(PATHS.HOME, { state: { scrollTo: targetId } });
    };

    if (asButton) {
        return (
            <button onClick={onClick} className={className}>
                {children}
            </button>
        );
    }

    return (
        <a href={`#${target}`} onClick={onClick} className={className}>
            {children}
        </a>
    );
}
