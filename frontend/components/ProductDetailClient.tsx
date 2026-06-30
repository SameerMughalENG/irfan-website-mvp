'use client';

import React, { useState } from 'react';
import { useQuote } from '@/context/QuoteContext';
import { useTrade } from '@/context/TradeContext';
import { ProductSpecsAccordion } from '@/components/ProductSpecsAccordion';

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
  const { isTradeMode, addRetailItem } = useTrade();
  
  const [wholesaleQty, setWholesaleQty] = useState<number>(10);
  const [retailQty, setRetailQty] = useState<number>(1);

  // Calculate volume discount tier for trade
  const unitDiscount = wholesaleQty >= 100 ? 0.15 : wholesaleQty >= 50 ? 0.08 : 0;
  const discountedUnit = priceRaw * (1 - unitDiscount);
  const totalWholesalePrice = discountedUnit * wholesaleQty;
  const totalRetailPrice = priceRaw * retailQty;

  return (
    <div className="detail-page-container">
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
              <span>3-Year Sameer's Trade &amp; Consumer Warranty</span>
            </div>
            <div className="badge-item">
              <span className="badge-icon">🚚</span>
              <span>Next-Day UK Courier / Pallet Dispatch</span>
            </div>
            <div className="badge-item">
              <span className="badge-icon">📦</span>
              <span>{isTradeMode ? 'Pallet & Fleet Ready Bulk Packaging' : 'Official Retail Sealed OEM Packaging'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Specs & Buy Widget */}
        <div className="detail-info-panel">
          <div className="detail-meta">
            <span className="category-tag">{categoryName}</span>
            <span className="brand-pill">{brandName}</span>
            <span className={`stock-status ${stockQty > 0 ? 'in-stock' : 'low-stock'}`}>
              {stockQty > 0 ? `● ${stockQty} Units Available` : '● Backorder Available'}
            </span>
          </div>

          <h1 className="detail-title">{name}</h1>

          {isTradeMode ? (
            /* WHOLESALE B2B BUY BOX */
            <div className="trade-buy-section">
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

              <div className="volume-tiers-box">
                <h4>Wholesale Tier Pricing</h4>
                <div className="tiers-grid">
                  <div className={`tier-card ${wholesaleQty < 50 ? 'active' : ''}`} onClick={() => setWholesaleQty(10)}>
                    <span className="tier-range">10 - 49 units</span>
                    <span className="tier-price">£{priceRaw.toFixed(2)} / u</span>
                  </div>
                  <div className={`tier-card ${wholesaleQty >= 50 && wholesaleQty < 100 ? 'active' : ''}`} onClick={() => setWholesaleQty(50)}>
                    <span className="tier-range">50 - 99 units</span>
                    <span className="tier-price">£{(priceRaw * 0.92).toFixed(2)} / u</span>
                  </div>
                  <div className={`tier-card ${wholesaleQty >= 100 ? 'active' : ''}`} onClick={() => setWholesaleQty(100)}>
                    <span className="tier-range">100+ units</span>
                    <span className="tier-price">£{(priceRaw * 0.85).toFixed(2)} / u</span>
                  </div>
                </div>
              </div>

              <div className="quote-action-box">
                <div className="qty-input-group">
                  <label htmlFor="order-qty">Batch Quantity:</label>
                  <div className="qty-controls big-controls">
                    <button onClick={() => setWholesaleQty(Math.max(1, wholesaleQty - 5))}>-5</button>
                    <input 
                      id="order-qty" 
                      type="number" 
                      value={wholesaleQty} 
                      onChange={(e) => setWholesaleQty(Math.max(1, parseInt(e.target.value) || 1))} 
                    />
                    <button onClick={() => setWholesaleQty(wholesaleQty + 5)}>+5</button>
                  </div>
                </div>

                <div className="total-summary">
                  <span>Total Quote Value:</span>
                  <strong>£{totalWholesalePrice.toFixed(2)} ex. VAT</strong>
                </div>

                <button 
                  className="add-to-quote-btn-primary"
                  onClick={() => addItem({
                    id,
                    name,
                    slug,
                    priceFormatted: `£${discountedUnit.toFixed(2)} ex. VAT`,
                    imageUrl
                  }, wholesaleQty)}
                >
                  📋 Add {wholesaleQty} Units to Quote RFP
                </button>
              </div>
            </div>
          ) : (
            /* RETAIL CONSUMER BUY BOX */
            <div className="retail-buy-section">
              <div className="pricing-box">
                <div className="price-main">
                  <span className="detail-price">£{priceRaw.toFixed(2)}</span>
                  <span className="price-sub">inc. VAT &amp; Standard UK Delivery</span>
                </div>
              </div>

              <div className="quote-action-box retail-action-box">
                <div className="qty-input-group">
                  <label htmlFor="retail-qty">Quantity:</label>
                  <div className="qty-controls big-controls">
                    <button onClick={() => setRetailQty(Math.max(1, retailQty - 1))}>-</button>
                    <input 
                      id="retail-qty" 
                      type="number" 
                      value={retailQty} 
                      onChange={(e) => setRetailQty(Math.max(1, parseInt(e.target.value) || 1))} 
                    />
                    <button onClick={() => setRetailQty(retailQty + 1)}>+</button>
                  </div>
                </div>

                <div className="total-summary">
                  <span>Total Due:</span>
                  <strong>£{totalRetailPrice.toFixed(2)} inc. VAT</strong>
                </div>

                <button 
                  className="add-to-quote-btn-primary retail-checkout-btn"
                  onClick={() => addRetailItem({
                    id,
                    name,
                    slug,
                    priceFormatted: `£${priceRaw.toFixed(2)}`,
                    priceRaw,
                    imageUrl
                  }, retailQty)}
                >
                  🛒 Add to Basket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Currys Deep Specifications Accordion Section */}
      <section className="deep-specs-container">
        <ProductSpecsAccordion descriptionRaw={description} productName={name} />
      </section>
    </div>
  );
}
