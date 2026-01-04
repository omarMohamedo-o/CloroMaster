import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../app/routes';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaBox, FaCog, FaArrowRight } from 'react-icons/fa';
import { useSearch } from '../../context/SearchContext';
import { useLanguage } from '../../context/LanguageContext';
import servicesMaster from '../../i18n/services.master';

export default function SearchModal() {
    const { isSearchOpen, searchQuery, closeSearch } = useSearch();
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    // Helper function to detect if query is Arabic
    const isArabicQuery = (text) => {
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text);
    };

    // Search function that searches across both languages
    const searchResults = useMemo(() => {
        if (!inputValue || inputValue.trim().length < 2) return { services: [], products: [] };

        const query = inputValue.toLowerCase().trim();
        const queryIsArabic = isArabicQuery(query);
        const results = { services: [], products: [] };

        servicesMaster.forEach(service => {
            // Search in service titles and descriptions (both languages)
            const titleEn = (service.title?.en || '').toLowerCase();
            const titleAr = (service.title?.ar || '').toLowerCase();
            const descEn = (service.desc?.en || '').toLowerCase();
            const descAr = (service.desc?.ar || '').toLowerCase();
            const categoryEn = (service.category?.en || '').toLowerCase();
            const categoryAr = (service.category?.ar || '').toLowerCase();

            const matchedInEn = titleEn.includes(query) || descEn.includes(query) || categoryEn.includes(query);
            const matchedInAr = titleAr.includes(query) || descAr.includes(query) || categoryAr.includes(query);
            const serviceMatch = matchedInEn || matchedInAr;

            if (serviceMatch) {
                // Determine which language to display based on match
                let displayLanguage = language;
                if (queryIsArabic && matchedInAr) {
                    displayLanguage = 'ar';
                } else if (!queryIsArabic && matchedInEn) {
                    displayLanguage = 'en';
                } else if (matchedInAr) {
                    displayLanguage = 'ar';
                }

                results.services.push({
                    ...service,
                    type: 'service',
                    displayLanguage,
                    matchedIn: {
                        title: titleEn.includes(query) || titleAr.includes(query),
                        description: descEn.includes(query) || descAr.includes(query),
                        category: categoryEn.includes(query) || categoryAr.includes(query)
                    }
                });
            }

            // Search in products (equipment)
            if (service.products && Array.isArray(service.products)) {
                service.products.forEach(product => {
                    const productTitleEn = (product.title?.en || '').toLowerCase();
                    const productTitleAr = (product.title?.ar || '').toLowerCase();
                    const usageEn = (product.usage?.en || '').toLowerCase();
                    const usageAr = (product.usage?.ar || '').toLowerCase();

                    const matchedInEn = productTitleEn.includes(query) || usageEn.includes(query);
                    const matchedInAr = productTitleAr.includes(query) || usageAr.includes(query);
                    const productMatch = matchedInEn || matchedInAr;

                    if (productMatch) {
                        // Determine which language to display based on match
                        let displayLanguage = language;
                        if (queryIsArabic && matchedInAr) {
                            displayLanguage = 'ar';
                        } else if (!queryIsArabic && matchedInEn) {
                            displayLanguage = 'en';
                        } else if (matchedInAr) {
                            displayLanguage = 'ar';
                        }

                        results.products.push({
                            ...product,
                            type: 'product',
                            parentService: service,
                            displayLanguage,
                            matchedIn: {
                                title: productTitleEn.includes(query) || productTitleAr.includes(query),
                                usage: usageEn.includes(query) || usageAr.includes(query)
                            }
                        });
                    }
                });
            }
        });

        return results;
    }, [inputValue, language]);

    const handleResultClick = (result) => {
        // Close search first so overlay is removed and navigation/scroll can occur
        closeSearch();

        if (result.type === 'service') {
            navigate(PATHS.SERVICE(result.slug));
            // small delay to allow route change before possible scroll
            setTimeout(() => {
                // ensure top of service page is visible
                try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { /* ignore */ }
            }, 80);
            return;
        }

        if (result.type === 'product') {
            // Service 1 (Chlorine System) products have detail pages
            if (result.parentService.id === 1) {
                // Navigate to equipment detail page for chlorine products
                navigate(PATHS.EQUIPMENT(result.slug));
                return;
            }

            // For other services we navigate to the parent service and then scroll to the product anchor
            const targetPath = PATHS.SERVICE(result.parentService.slug);
            navigate(targetPath);

            // After navigation, attempt to scroll to the element with id == product.slug
            const scrollToAnchor = () => {
                try {
                    const id = result.slug;
                    const el = document.getElementById(id) || document.querySelector(`[name="${id}"]`) || document.querySelector(`a[href="#${id}"]`);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        // Fallback to setting hash (may trigger browser scroll)
                        window.location.hash = `#${id}`;
                    }
                } catch (e) {
                    // ignore errors
                }
            };

            // Try a few times as route transition may take a short moment
            setTimeout(scrollToAnchor, 120);
            setTimeout(scrollToAnchor, 400);
            setTimeout(scrollToAnchor, 800);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchResults.services.length > 0) {
            handleResultClick(searchResults.services[0]);
        } else if (searchResults.products.length > 0) {
            handleResultClick(searchResults.products[0]);
        }
    };

    const totalResults = searchResults.services.length + searchResults.products.length;

    if (!isSearchOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeSearch}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                {/* Search Container */}
                <motion.div
                    className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Search Input */}
                    <form onSubmit={handleSubmit} className="relative border-b border-gray-200 dark:border-gray-700">
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={language === 'ar' ? 'ابحث عن الخدمات والمنتجات...' : 'Search services and products...'}
                            className="w-full px-16 py-5 text-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={closeSearch}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </form>

                    {/* Results */}
                    <div className="max-h-[60vh] overflow-y-auto p-4">
                        {inputValue.trim().length < 2 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <FaSearch className="text-4xl mx-auto mb-4 opacity-30" />
                                <p>{language === 'ar' ? 'ابدأ بكتابة حرفين على الأقل للبحث' : 'Start typing at least 2 characters to search'}</p>
                            </div>
                        ) : totalResults === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <FaSearch className="text-4xl mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium mb-2">
                                    {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                                </p>
                                <p className="text-sm">
                                    {language === 'ar' ? 'جرب كلمات مفتاحية مختلفة' : 'Try different keywords'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Services Results */}
                                {searchResults.services.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 px-2">
                                            {language === 'ar' ? 'الخدمات' : 'Services'} ({searchResults.services.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {searchResults.services.map((service) => (
                                                <motion.button
                                                    key={service.id}
                                                    onClick={() => handleResultClick(service)}
                                                    className="w-full text-left p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                                    whileHover={{ x: 4 }}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand-secondary flex items-center justify-center flex-shrink-0">
                                                            <FaCog className="text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-brand transition-colors">
                                                                {service.title?.[service.displayLanguage] || service.title?.[language] || service.title?.en}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                                {service.desc?.[service.displayLanguage] || service.desc?.[language] || service.desc?.en}
                                                            </p>
                                                            {/* Show both language matches */}
                                                            <div className="flex gap-2 mt-2">
                                                                <span className="text-xs px-2 py-1 rounded-full bg-brand/10 text-brand">
                                                                    {service.category?.[service.displayLanguage] || service.category?.[language] || service.category?.en}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <FaArrowRight className="text-gray-400 group-hover:text-brand transition-colors flex-shrink-0 mt-1" />
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Products Results */}
                                {searchResults.products.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 px-2">
                                            {language === 'ar' ? 'المنتجات' : 'Products'} ({searchResults.products.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {searchResults.products.map((product, idx) => (
                                                <motion.button
                                                    key={`${product.id}-${idx}`}
                                                    onClick={() => handleResultClick(product)}
                                                    className="w-full text-left p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                                    whileHover={{ x: 4 }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand-medium flex items-center justify-center flex-shrink-0">
                                                            <FaBox className="text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-brand transition-colors">
                                                                {product.title?.[product.displayLanguage] || product.title?.[language] || product.title?.en}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                                {product.usage?.[product.displayLanguage] || product.usage?.[language] || product.usage?.en}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                                {language === 'ar' ? 'في' : 'in'} {product.parentService?.title?.[product.displayLanguage] || product.parentService?.title?.[language] || product.parentService?.title?.en}
                                                            </p>
                                                        </div>
                                                        <FaArrowRight className="text-gray-400 group-hover:text-brand transition-colors flex-shrink-0 mt-1" />
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer hint */}
                    {totalResults > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                {language === 'ar' ? 'اضغط Enter للانتقال للنتيجة الأولى' : 'Press Enter to go to first result'}
                            </p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
