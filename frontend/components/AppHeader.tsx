'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useQuote } from '@/context/QuoteContext';
import { useSearch } from '@/context/SearchContext';

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, setDrawerOpen: setQuoteDrawerOpen } = useQuote();
  const { searchQuery, setSearchQuery, setFilterMenuOpen } = useSearch();

  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 90 && currentScrollY > lastScrollY) {
        setIsHidden(true); // Hide when scrolling down
      } else {
        setIsHidden(false); // Show when scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (pathname !== '/products') {
      router.push('/products');
    }
  };

  return (
    <header className={`main-header ${isHidden ? 'header-hidden' : ''}`}>
      <div className="header-left">
        <button 
          className="mobile-burger-btn"
          onClick={() => setFilterMenuOpen(true)}
          aria-label="Open filter menu"
        >
          ☰
        </button>

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
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>&times;</button>
          )}
        </div>
      </div>

      <nav className="nav-links">
        <Link href="/products" className="nav-link desktop-only">Catalog</Link>
        <button 
          className="quote-draft-btn"
          onClick={() => setQuoteDrawerOpen(true)}
        >
          <span className="quote-icon">📋</span>
          <span className="quote-text">Quote Draft</span>
          {totalItems > 0 && <span className="quote-badge">{totalItems}</span>}
        </button>
      </nav>
    </header>
  );
}
