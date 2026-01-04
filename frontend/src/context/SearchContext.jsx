import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const openSearch = (query = '') => {
        setSearchQuery(query);
        setIsSearchOpen(true);
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setTimeout(() => setSearchQuery(''), 300); // Clear after animation
    };

    return (
        <SearchContext.Provider value={{ isSearchOpen, searchQuery, setSearchQuery, openSearch, closeSearch }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}
