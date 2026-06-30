'use client';

import React from 'react';
import { useSearch } from '@/context/SearchContext';

interface FilterDrawerProps {
  categories: string[];
  brands: string[];
  totalResults: number;
}

export function FilterDrawer({ categories, brands, totalResults }: FilterDrawerProps) {
  const {
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
  } = useSearch();

  if (!isFilterMenuOpen) return null;

  return (
    <div className="filter-drawer-overlay" onClick={() => setFilterMenuOpen(false)}>
      <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="filter-drawer-header">
          <div>
            <h3>☰ Wholesale Filter Menu</h3>
            <p className="filter-drawer-subtitle">{totalResults} items available</p>
          </div>
          <button className="drawer-close-btn" onClick={() => setFilterMenuOpen(false)} aria-label="Close menu">
            &times;
          </button>
        </div>

        <div className="filter-drawer-body">
          <div className="sidebar-section">
            <h4 className="sidebar-title">Search Keyword / SKU</h4>
            <input
              type="text"
              className="filter-input"
              placeholder="Type iPhone, Dell, OLED..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-title">Sort By</h4>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Featured Wholesale</option>
              <option value="price-asc">Unit Price: Low to High</option>
              <option value="price-desc">Unit Price: High to Low</option>
              <option value="name-asc">Product Name (A-Z)</option>
            </select>
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-title">Categories</h4>
            <div className="filter-pills">
              <button
                className={`filter-pill ${selectedCategory === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('ALL')}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-title">Brands</h4>
            <select
              className="filter-select"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="ALL">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-drawer-footer">
          <button
            className="reset-filters-btn inline-btn"
            onClick={() => {
              resetFilters();
            }}
          >
            Reset All
          </button>
          <button
            className="submit-quote-btn"
            onClick={() => setFilterMenuOpen(false)}
          >
            Show {totalResults} Results &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
