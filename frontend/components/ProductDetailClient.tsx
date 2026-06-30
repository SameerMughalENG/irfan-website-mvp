'use client';

import React, { useState } from 'react';
import { useQuote } from '@/context/QuoteContext';

interface ProductDetailClientProps {
  id: string;
  name: string;
  slug: string;
  priceRaw: number;
  priceFormatted: string;
  description: string;
  brandName: string;
  categoryName: string;
  stockQty: number;
  imageUrl?: string | null;
}

export function ProductDetailClient({
  id,
  name,
  slug,
  priceRaw,
  priceFormatted,
  description,
  brandName,
  categoryName,
  stockQty,
  imageUrl,
}: ProductDetailClientProps) {
  const { addItem } = useQuote();
  const [quantity, setQuantity] = useState<number>(10); // Standard wholesale minimum order quantity

  // Calculate volume discount tier
  const unitDiscount = quantity >= 100 ? 0.15 : quantity >= 50 ? 0.08 : 0;
  const discountedUnit = priceRaw * (1 - unitDiscount);
  const totalPrice = discountedUnit * quantity;

  return (
    <div className="detail-split-layout">
      {/* Left Column: Studio Product Image */}
      <div className="detail-image-panel">
        <div className="detail-image-wrap">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="detail-image" />
          ) : (
            <div className="card-image-placeholder">No Image Available</div>
          )}
        </div>
        <div className="guarantee-badges">
          <div className="badge-item">
            <span className="badge-icon">🛡️</span>
            <span>2-Year Sameer's Wholesale Warranty</span>
          </div>
          <div className="badge-item">
            <span className="badge-icon">🚚</span>
            <span>Dispatch Within 24 Hours</span>
          </div>
          <div className="badge-item">
            <span className="badge-icon">📦</span>
            <span>Pallet &amp; Fleet Ready Packaging</span>
          </div>
        </div>
      </div>

      {/* Right Column: Specs & B2B Quote Widget */}
      <div className="detail-info-panel">
        <div className="detail-meta">
          <span className="category-tag">{categoryName}</span>
          <span className="brand-pill">{brandName}</span>
          <span className={`stock-status ${stockQty > 0 ? 'in-stock' : 'low-stock'}`}>
            {stockQty > 0 ? `● ${stockQty} Units Available` : '● Backorder Available'}
          </span>
        </div>

        <h1 className="detail-title">{name}</h1>

        <div className="pricing-box">
          <div className="price-main">
            <span className="detail-price">£{discountedUnit.toFixed(2)}</span>
            <span className="price-sub">/ unit (Excl. VAT)</span>
          </div>
          {unitDiscount > 0 && (
            <span className="discount-tag">
              🎉 {unitDiscount * 100}% Wholesale Volume Discount Applied
            </span>
          )}
        </div>

        {/* Volume Tiers Table */}
        <div className="volume-tiers-box">
          <h4>Wholesale Tier Pricing</h4>
          <div className="tiers-grid">
            <div className={`tier-card ${quantity < 50 ? 'active' : ''}`} onClick={() => setQuantity(10)}>
              <span className="tier-range">10 - 49 units</span>
              <span className="tier-price">£{priceRaw.toFixed(2)} / u</span>
            </div>
            <div className={`tier-card ${quantity >= 50 && quantity < 100 ? 'active' : ''}`} onClick={() => setQuantity(50)}>
              <span className="tier-range">50 - 99 units</span>
              <span className="tier-price">£{(priceRaw * 0.92).toFixed(2)} / u</span>
            </div>
            <div className={`tier-card ${quantity >= 100 ? 'active' : ''}`} onClick={() => setQuantity(100)}>
              <span className="tier-range">100+ units</span>
              <span className="tier-price">£{(priceRaw * 0.85).toFixed(2)} / u</span>
            </div>
          </div>
        </div>

        {/* Quantity Selector & Quote Action */}
        <div className="quote-action-box">
          <div className="qty-input-group">
            <label htmlFor="order-qty">Batch Quantity:</label>
            <div className="qty-controls big-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 5))}>-5</button>
              <input 
                id="order-qty" 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
              />
              <button onClick={() => setQuantity(quantity + 5)}>+5</button>
            </div>
          </div>

          <div className="total-summary">
            <span>Total Quote Value:</span>
            <strong>£{totalPrice.toFixed(2)}</strong>
          </div>

          <button 
            className="add-to-quote-btn-primary"
            onClick={() => addItem({
              id,
              name,
              slug,
              priceFormatted: `£${discountedUnit.toFixed(2)}`,
              imageUrl
            }, quantity)}
          >
            📋 Add {quantity} Units to Quote Draft
          </button>
        </div>

        {/* Description Section */}
        <section className="specs-section">
          <h3 className="specs-title">Technical Specifications &amp; Features</h3>
          <div className="detail-description">{description}</div>
        </section>
      </div>
    </div>
  );
}
