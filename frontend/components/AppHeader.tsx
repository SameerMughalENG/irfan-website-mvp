'use client';

import React from 'react';
import Link from 'next/link';
import { useQuote } from '@/context/QuoteContext';

export function AppHeader() {
  const { totalItems, setDrawerOpen } = useQuote();

  return (
    <header className="main-header">
      <div className="header-left">
        <Link href="/products" className="brand-logo">
          <span className="brand-primary">SAMEER'S</span>
          <span className="brand-secondary">WHOLESALE</span>
          <span className="brand-badge">B2B DIRECT</span>
        </Link>
      </div>

      <div className="header-center">
        <div className="header-search-bar">
          <input 
            type="text" 
            placeholder="Search wholesale SKU, brand, or category..." 
            readOnly
            onClick={() => {
              const el = document.getElementById('catalog-search-input');
              if (el) el.focus();
            }}
          />
          <span className="search-shortcut">⌘K</span>
        </div>
      </div>

      <nav className="nav-links">
        <Link href="/products" className="nav-link">Full Catalog</Link>
        <Link href="/products" className="nav-link">Volume Tiers</Link>
        <button 
          className="quote-draft-btn"
          onClick={() => setDrawerOpen(true)}
        >
          <span className="quote-icon">📋</span>
          <span>Quote Draft</span>
          {totalItems > 0 && <span className="quote-badge">{totalItems}</span>}
        </button>
      </nav>
    </header>
  );
}
