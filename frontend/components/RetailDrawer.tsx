'use client';

import React from 'react';
import { useTrade } from '@/context/TradeContext';

export function RetailDrawer() {
  const {
    retailItems,
    removeRetailItem,
    updateRetailQuantity,
    clearRetailCart,
    totalRetailItems,
    totalRetailPrice,
    isRetailDrawerOpen,
    setRetailDrawerOpen,
  } = useTrade();

  if (!isRetailDrawerOpen) return null;

  const handleCheckout = () => {
    alert(`Standard UK Retail Checkout: Proceeding to consumer payment portal for £${totalRetailPrice.toFixed(2)} (Inc. VAT).`);
    clearRetailCart();
    setRetailDrawerOpen(false);
  };

  return (
    <div className="quote-drawer-backdrop" onClick={() => setRetailDrawerOpen(false)}>
      <div className="quote-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="quote-drawer-header">
          <div>
            <h3>🛍️ Consumer Shopping Basket</h3>
            <span className="quote-subtitle">Standard Retail Pricing (Inc. VAT)</span>
          </div>
          <button className="quote-close-btn" onClick={() => setRetailDrawerOpen(false)}>
            &times;
          </button>
        </div>

        <div className="quote-drawer-body">
          {retailItems.length === 0 ? (
            <div className="quote-empty">
              <span className="empty-icon">🛒</span>
              <p>Your consumer basket is currently empty.</p>
              <button className="empty-browse-btn" onClick={() => setRetailDrawerOpen(false)}>
                Explore Retail Products
              </button>
            </div>
          ) : (
            <div className="quote-items-list">
              {retailItems.map((item) => (
                <div key={item.id} className="quote-item-card">
                  <div className="quote-item-image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className="image-placeholder">No Img</div>
                    )}
                  </div>
                  <div className="quote-item-details">
                    <h4 className="quote-item-title">{item.name}</h4>
                    <span className="quote-item-sku">SKU: {item.slug.toUpperCase()}</span>
                    <div className="quote-item-price">
                      £{item.priceRaw.toFixed(2)} inc. VAT
                    </div>
                  </div>
                  <div className="quote-item-actions">
                    <div className="qty-selector">
                      <button onClick={() => updateRetailQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateRetailQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-item-btn" onClick={() => removeRetailItem(item.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {retailItems.length > 0 && (
          <div className="quote-drawer-footer">
            <div className="quote-summary">
              <div className="summary-row">
                <span>Total Items:</span>
                <strong>{totalRetailItems} units</strong>
              </div>
              <div className="summary-row">
                <span>Delivery (Standard UK):</span>
                <strong style={{ color: '#059669' }}>FREE</strong>
              </div>
              <div className="summary-row total-row">
                <span>Total Due (Inc. VAT):</span>
                <strong className="total-amount">£{totalRetailPrice.toFixed(2)}</strong>
              </div>
            </div>

            <button className="submit-quote-btn" onClick={handleCheckout}>
              🔒 Secure Retail Checkout
            </button>
            <button className="clear-quote-btn" onClick={clearRetailCart}>
              Empty Basket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
