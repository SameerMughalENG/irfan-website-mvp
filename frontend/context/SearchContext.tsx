'use client';

import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  isFilterMenuOpen: boolean;
  setFilterMenuOpen: (open: boolean) => void;
  resetFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [sortBy, setSortBy] = useState('default');
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedBrand('ALL');
    setSortBy('default');
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedBrand,
        setSelectedBrand,
        sortBy,
        setSortBy,
        isFilterMenuOpen,
        setFilterMenuOpen,
        resetFilters,
      }}
    >
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
