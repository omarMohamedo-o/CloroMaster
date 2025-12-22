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
