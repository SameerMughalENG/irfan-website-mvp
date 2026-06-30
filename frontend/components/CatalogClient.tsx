'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useQuote } from '@/context/QuoteContext';
import { useSearch } from '@/context/SearchContext';
import { FilterDrawer } from '@/components/FilterDrawer';

interface Product {
  id: string;
  name: string;
  slug: string;
  priceRaw: number;
  priceFormatted: string;
  brandName: string;
  categoryName: string;
  imageUrl?: string | null;
}

interface CatalogClientProps {
  initialProducts: Product[];
  categories: string[];
  brands: string[];
}

export function CatalogClient({ initialProducts, categories, brands }: CatalogClientProps) {
  const { addItem } = useQuote();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    sortBy,
    setSortBy,
    setFilterMenuOpen,
    resetFilters,
  } = useSearch();

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'ALL' || p.categoryName === selectedCategory;
      const matchesBrand = selectedBrand === 'ALL' || p.brandName === selectedBrand;

      return matchesSearch && matchesCategory && matchesBrand;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceRaw - b.priceRaw;
      if (sortBy === 'price-desc') return b.priceRaw - a.priceRaw;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [initialProducts, searchQuery, selectedCategory, selectedBrand, sortBy]);

  return (
    <div className="catalog-wrapper">
      <FilterDrawer 
        categories={categories} 
        brands={brands} 
        totalResults={filteredProducts.length} 
      />

      {/* Desktop Left Sidebar Filters */}
      <aside className="catalog-sidebar desktop-sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Search Keyword / SKU</h3>
          <input 
            type="text" 
            className="filter-input"
            placeholder="Search Apple, OLED, 4K..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">Categories</h3>
          <div className="filter-pills">
            <button 
              className={`filter-pill ${selectedCategory === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('ALL')}
            >
              All Categories ({initialProducts.length})
            </button>
            {categories.map((cat) => {
              const count = initialProducts.filter(p => p.categoryName === cat).length;
              return (
                <button 
                  key={cat} 
                  className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">Brands</h3>
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

        {(searchQuery || selectedCategory !== 'ALL' || selectedBrand !== 'ALL') && (
          <button className="reset-filters-btn" onClick={resetFilters}>
            &times; Reset All Filters
          </button>
        )}
      </aside>

      {/* Right Product Grid Area */}
      <div className="catalog-main">
        {/* Mobile Toolbar Trigger */}
        <div className="mobile-filter-toolbar">
          <button className="mobile-open-menu-btn" onClick={() => setFilterMenuOpen(true)}>
            ☰ Filter Menu &amp; Categories
            {(selectedCategory !== 'ALL' || selectedBrand !== 'ALL') && (
              <span className="filter-active-dot">●</span>
            )}
          </button>
          {searchQuery && (
            <div className="mobile-active-search">
              <span>Keyword: &ldquo;{searchQuery}&rdquo;</span>
              <button onClick={() => setSearchQuery('')}>&times;</button>
            </div>
          )}
        </div>

        <div className="grid-toolbar">
          <div className="results-count">
            Showing <strong>{filteredProducts.length}</strong> of <strong>{initialProducts.length}</strong> wholesale items
          </div>
          <div className="sort-box">
            <label htmlFor="sort-select">Sort By:</label>
            <select 
              id="sort-select"
              className="filter-select sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Featured Wholesale</option>
              <option value="price-asc">Unit Price: Low to High</option>
              <option value="price-desc">Unit Price: High to Low</option>
              <option value="name-asc">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No Wholesale Products Match Your Criteria</h3>
            <p>Try clearing your keyword filters or selecting a different brand category.</p>
            <button className="reset-filters-btn inline-btn" onClick={resetFilters}>Reset All Filters</button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="product-card">
                <Link href={`/product/${prod.slug}`} className="card-image-link">
                  <div className="card-image-wrap">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.name} className="card-image" />
                    ) : (
                      <div className="card-image-placeholder">No Image Available</div>
                    )}
                  </div>
                </Link>

                <div className="card-body">
                  <div className="card-tags">
                    <span className="category-tag">{prod.categoryName}</span>
                    <span className="brand-name">{prod.brandName}</span>
                  </div>

                  <Link href={`/product/${prod.slug}`} className="card-title-link">
                    <h2 className="product-name">{prod.name}</h2>
                  </Link>

                  <div className="card-pricing">
                    <div className="price-info">
                      <span className="price-label">Wholesale Unit Price</span>
                      <span className="product-price">{prod.priceFormatted}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button 
                      className="add-quote-btn"
                      onClick={() => addItem({
                        id: prod.id,
                        name: prod.name,
                        slug: prod.slug,
                        priceFormatted: prod.priceFormatted,
                        imageUrl: prod.imageUrl
                      }, 10)}
                    >
                      + Add 10 to Quote
                    </button>
                    <Link href={`/product/${prod.slug}`} className="view-btn">
                      Specs &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
