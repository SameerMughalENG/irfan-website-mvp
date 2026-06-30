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
  const { searchQuery, setSearchQuery, isFilterMenuOpen, setFilterMenuOpen, selectedCategory, setSelectedCategory } = useSearch();

  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 120 && currentScrollY > lastScrollY) {
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

  const handleCategoryNav = (cat: string) => {
    setSelectedCategory(cat);
    if (pathname !== '/products') {
      router.push('/products');
    }
  };

  const categories = [
    { name: 'All Categories', key: 'ALL' },
    { name: 'Laptops & Computing', key: 'Laptops' },
    { name: 'Monitors & Displays', key: 'Monitors' },
    { name: 'Audio & Studio', key: 'Headphones' },
    { name: 'Webcams & Peripherals', key: 'Accessories' },
    { name: 'Enterprise Storage', key: 'Storage' },
  ];

  return (
    <header className={`main-header-wrapper ${isHidden ? 'header-hidden' : ''}`}>
      {/* Band 1: UK Retailer Top Support Strip */}
      <div className="uk-top-strip">
        <div className="uk-top-strip-inner">
          <div className="strip-left">
            <span>🛡️ Sameer's B2B Trade Warranty</span>
            <span className="strip-divider">|</span>
            <span>⚡ Free Next-Day UK Pallet Dispatch</span>
          </div>
          <div className="strip-right">
            <button className="strip-link" onClick={() => alert("Help & Support Center: Live wholesale chat available 8am-6pm GMT.")}>Help & Support</button>
            <span className="strip-divider">|</span>
            <button className="strip-link" onClick={() => alert("Sameer's Flexpay: 30-day interest-free credit accounts available for verified UK businesses.")}>Flexpay & Credit</button>
            <span className="strip-divider">|</span>
            <button className="strip-link" onClick={() => alert("UK Trade Account Portal: Integrated with Supabase Auth.")}>Trade Portal</button>
          </div>
        </div>
      </div>

      {/* Band 2: Main Search & Utility Cluster Banner */}
      <div className="uk-main-banner">
        <div className="uk-main-banner-inner">
          <div className="header-left">
            <button 
              className="mobile-burger-btn"
              onClick={() => setFilterMenuOpen(!isFilterMenuOpen)}
              aria-label="Toggle menu"
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

          <div className="uk-utility-cluster">
            <button 
              className="uk-utility-item desktop-only"
              onClick={() => alert("Store Locator: Manchester, Birmingham & London Distribution Hubs open 24/7 for trade collection.")}
            >
              <span className="utility-icon">📍</span>
              <span className="utility-label">Stores</span>
            </button>

            <button 
              className="uk-utility-item"
              onClick={() => alert("Supabase Auth / Trade Portal Demo: Login modal functionality ready for next integration phase.")}
            >
              <span className="utility-icon">👤</span>
              <span className="utility-label">Account</span>
            </button>

            <button 
              className="uk-utility-item desktop-only"
              onClick={() => alert("Saved Trade Lists: 0 SKUs currently saved in quick re-order template.")}
            >
              <span className="utility-icon">♡</span>
              <span className="utility-label">Saved</span>
            </button>

            <button 
              className="uk-utility-item utility-basket"
              onClick={() => setQuoteDrawerOpen(true)}
            >
              <span className="utility-icon">🛒</span>
              <span className="utility-label">
                Basket <span className="basket-count">({totalItems})</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Band 3: Navy Category Navigation Strip */}
      <nav className="uk-category-bar">
        <div className="uk-category-bar-inner">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`category-tab-btn ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => handleCategoryNav(cat.key)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

