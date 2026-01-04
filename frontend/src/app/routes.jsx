import React, { Suspense } from 'react';
import Navbar from '../components/layout/Navbar';

// Footer is somewhat heavier so lazy-load it to keep initial bundle small
const Footer = React.lazy(() => import('../components/layout/Footer'));

export function HeaderFooterLayout({ children, headerProps }) {
    return (
        <div className="transition-colors duration-300 min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Navbar {...(headerProps || {})} />
            <main className="flex-grow block pt-20">
                {children}
            </main>
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default HeaderFooterLayout;

// Centralized route patterns and helpers
export const PATHS = {
    HOME: '/',
    SERVICE_PATTERN: '/service/:serviceId',
    SERVICE: (id) => `/service/${id}`,
    EQUIPMENT_PATTERN: '/equipment/:slug',
    EQUIPMENT: (slug) => `/equipment/${slug}`,
    VIDEOS: '/videos',
    PRIVACY: '/privacy',
    TERMS: '/terms',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_SUBMISSIONS: '/admin/submissions',
    ADMIN_SUBMISSION_DETAIL_PATTERN: '/admin/submissions/:id',
    ADMIN_SUBMISSION_DETAIL: (id) => `/admin/submissions/${id}`,
};
