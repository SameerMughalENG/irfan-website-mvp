'use client';

import React from 'react';
import Link from 'next/link';
import { useTrade } from '@/context/TradeContext';
import { useQuote } from '@/context/QuoteContext';
import { useSearch } from '@/context/SearchContext';
import { useRouter } from 'next/navigation';

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

interface LandingClientProps {
  studentProducts: Product[];
}

export function LandingClient({ studentProducts }: LandingClientProps) {
  const { isTradeMode, setTradeMode, setTradeModalOpen, addRetailItem, tradeAccount } = useTrade();
  const { addItem } = useQuote();
  const { setSelectedCategory, setSelectedBrand } = useSearch();
  const router = useRouter();

  const handleBrandClick = (brandName: string) => {
    setSelectedBrand(brandName);
    setSelectedCategory('ALL');
    router.push('/products');
  };

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setSelectedBrand('ALL');
    router.push('/products');
  };

  return (
    <div className="landing-container">
      {/* 1. Currys/Argos Style Seasonal Hero Banner */}
      <section className="seasonal-hero">
        <div className="hero-content">
          <span className="hero-badge">BACK TO STUDY SAVINGS</span>
          <h1 className="hero-title">Level Up Your Student Setup</h1>
          <p className="hero-subtitle">
            Get the best tech for the new academic year. Shop top-brand laptops, displays, audio, and accessories at unbeatable prices.
          </p>
          <div className="hero-ctas">
            <Link href="/products" className="btn-primary hero-btn">
              Shop Student Essentials
            </Link>
            <button className="btn-secondary hero-btn" onClick={() => setTradeMode(!isTradeMode)}>
              {isTradeMode ? 'Switch to Retail (Inc. VAT)' : 'Switch to Wholesale (Ex. VAT)'}
            </button>
          </div>
        </div>
        <div className="hero-promo-badge">
          <div className="promo-tag">Student Deals</div>
          <div className="promo-text">Up to 15% volume discounts for schools &amp; student unions</div>
        </div>
      </section>

      {/* 2. Brand Quick-Links Grid */}
      <section className="brand-ribbon-section">
        <h3 className="section-title-small">Shop by Popular Brands</h3>
        <div className="brand-logo-grid">
          {['Apple', 'Samsung', 'Dell', 'Sony', 'Logitech', 'Asus', 'Lenovo'].map((brand) => (
            <button 
              key={brand} 
              className="brand-logo-card" 
              onClick={() => handleBrandClick(brand)}
            >
              <span className="brand-logo-text">{brand}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Category Bento Grid */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid-custom">
          {[
            { name: 'Computing & Laptops', key: 'Laptops', icon: '💻', desc: 'Powerful gear for study and coding' },
            { name: 'Monitors & Displays', key: 'Monitors', icon: '🖥️', desc: 'Dual screen setups for multitasking' },
            { name: 'Audio & Headphones', key: 'Audio', icon: '🎧', desc: 'Noise cancelling to stay focused' },
            { name: 'Webcams & Accessories', key: 'Accessories', icon: '🖱️', desc: 'Keyboards, mice, and desk gear' },
            { name: 'Tablets & Work', key: 'Tablets', icon: '📱', desc: 'Note-taking and reading on the go' },
            { name: 'High-speed Storage', key: 'Storage', icon: '💾', desc: 'External SSDs and flash storage' }
          ].map((cat) => (
            <div 
              key={cat.key} 
              className="category-card-custom"
              onClick={() => handleCategoryClick(cat.key)}
            >
              <div className="category-card-icon">{cat.icon}</div>
              <div className="category-card-content">
                <h4>{cat.name}</h4>
                <p>{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Seasonal Back to School Featured Products */}
      <section className="student-deals-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Back to School Essentials</h2>
            <p className="section-subtitle">Specially curated tech to power through coursework, gaming, and research.</p>
          </div>
          <Link href="/products" className="view-all-link">
            View All Products &rarr;
          </Link>
        </div>

        <div className="student-products-grid">
          {studentProducts.map((prod) => {
            const unitPrice = isTradeMode ? prod.priceRaw * 0.88 : prod.priceRaw;
            const displayPrice = `£${unitPrice.toFixed(2)}`;

            return (
              <div key={prod.id} className="landing-product-card">
                <Link href={`/product/${prod.slug}`} className="product-image-link">
                  <div className="product-image-wrap">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.name} className="product-image" />
                    ) : (
                      <div className="product-image-placeholder">No Image Available</div>
                    )}
                  </div>
                </Link>

                <div className="product-body">
                  <span className="product-category-tag">{prod.categoryName}</span>
                  <Link href={`/product/${prod.slug}`} className="product-title-link">
                    <h3 className="product-title">{prod.name}</h3>
                  </Link>
                  <span className="product-brand-tag">{prod.brandName}</span>

                  <div className="product-pricing-row">
                    <div className="price-details">
                      <span className="price-number">{displayPrice}</span>
                      <span className="price-vat-label">{isTradeMode ? 'ex. VAT' : 'inc. VAT'}</span>
                    </div>
                  </div>

                  <div className="product-card-actions">
                    {isTradeMode ? (
                      <button 
                        className="btn-add-action"
                        onClick={() => addItem({
                          id: prod.id,
                          name: prod.name,
                          slug: prod.slug,
                          priceFormatted: `£${(prod.priceRaw * 0.88).toFixed(2)} ex. VAT`,
                          imageUrl: prod.imageUrl
                        }, 10)}
                      >
                        + Add 10 to Quote
                      </button>
                    ) : (
                      <button 
                        className="btn-add-action retail-btn"
                        onClick={() => addRetailItem({
                          id: prod.id,
                          name: prod.name,
                          slug: prod.slug,
                          priceFormatted: `£${prod.priceRaw.toFixed(2)}`,
                          priceRaw: prod.priceRaw,
                          imageUrl: prod.imageUrl
                        }, 1)}
                      >
                        🛒 Add to Basket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. UK Retailer Style Trust Banner */}
      <section className="retailer-trust-banner">
        <div className="trust-grid">
          <div className="trust-item">
            <span className="trust-icon">🚚</span>
            <div className="trust-text">
              <h4>Free UK Pallet / Courier Dispatch</h4>
              <p>On all wholesale batches or retail orders over £50</p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🛡️</span>
            <div className="trust-text">
              <h4>3-Year Sameer's Trade Warranty</h4>
              <p>Full hardware replacement and technical support warranty</p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">💳</span>
            <div className="trust-text">
              <h4>Credit &amp; Spread the Cost</h4>
              <p>Apply for Net 30 payment terms or use consumer Flexpay</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Subtle Trade Portal Gateway Teaser */}
      <section className="trade-teaser-banner">
        <div className="teaser-inner">
          <div className="teaser-content">
            <h3>Buying for a School, University, or Business?</h3>
            <p>
              Unlock trade pricing tiers, order pallet inventory, and manage invoice payments with a verified Sameer's Trade account.
            </p>
          </div>
          <div className="teaser-action">
            {isTradeMode ? (
              <div className="verified-badge-wrap">
                <span className="verified-check">✓</span>
                <span>Wholesale mode active: {tradeAccount?.companyName || 'Verified business account'}</span>
              </div>
            ) : (
              <button className="btn-primary" onClick={() => setTradeModalOpen(true)}>
                🔓 Unlock Trade Portal
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
