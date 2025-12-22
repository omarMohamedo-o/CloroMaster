import React from 'react';
import { FaLinkedin, FaFacebookF, FaInstagram, FaTwitter, FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { scroller } from 'react-scroll';
import config from '../../config/config';

export default function Footer() {
    const navigate = useNavigate();
    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const goHome = (scrollTo) => {
        if (window.location.pathname === '/') {
            // already on home - use react-scroll scroller if available, else fallback to element scrolling
            setTimeout(() => {
                try {
                    if (typeof scrollTo === 'string' && scrollTo) {
                        scroller.scrollTo(scrollTo, { smooth: true, duration: 600, offset: -80 });
                        return;
                    }
                } catch (e) {
                    // ignore and fallback
                }

                const el = document.getElementById(scrollTo) || document.getElementsByName(scrollTo)[0];
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 50);
        } else {
            navigate('/', { state: { scrollTo } });
        }
    };

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo & description */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/images/chloromaster-logo.png" alt={config.app.name} className="w-12 h-12 object-contain block" />
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">Leading the green revolution with innovative sustainable solutions. We combine technology and nature to create a better future for all.</p>

                        <div className="flex items-center gap-3 mt-6">
                            <a className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm text-gray-700 hover:text-brand transition-colors" href="#" aria-label="linkedin"><FaLinkedin /></a>
                            <a className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm text-gray-700 hover:text-brand transition-colors" href="#" aria-label="facebook"><FaFacebookF /></a>
                            <a className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm text-gray-700 hover:text-brand transition-colors" href="#" aria-label="instagram"><FaInstagram /></a>
                            <a className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm text-gray-700 hover:text-brand transition-colors" href="#" aria-label="twitter"><FaTwitter /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-teal-600 font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => goHome()} className="hover:underline">Home</button></li>
                            <li><button onClick={() => goHome('services')} className="hover:underline">Services</button></li>
                            <li><button onClick={() => goHome('about')} className="hover:underline">About</button></li>
                            <li><button onClick={() => goHome('faq')} className="hover:underline">FAQ</button></li>
                            <li><button onClick={() => goHome('contact')} className="hover:underline">Contact</button></li>
                        </ul>
                    </div>

                    {/* Contact info */}
                    <div>
                        <h4 className="text-teal-600 font-semibold mb-4">Contact Info</h4>
                        <div className="text-sm space-y-3">
                            <div>{config.contact.address}</div>
                            <div>{config.contact.phone}</div>
                            <div><a className="hover:underline" href={`mailto:${config.contact.email}`}>{config.contact.email}</a></div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm">© {new Date().getFullYear()}. All rights reserved.</div>

                        <div className="flex items-center gap-6">
                            <a href="/privacy" className="text-sm hover:underline">Privacy Policy</a>
                            <a href="/terms" className="text-sm hover:underline">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating scroll-to-top button */}
            <button onClick={scrollTop} aria-label="scroll to top" className="fixed right-6 bottom-6 w-10 h-10 rounded-md bg-teal-500 text-white shadow-lg flex items-center justify-center hover:bg-teal-600 transition-colors">
                <FaArrowUp />
            </button>
        </footer>
    );
}

