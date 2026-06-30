'use client';

import React from 'react';
import { useQuote } from '@/context/QuoteContext';

export function QuoteDrawer() {
  const { items, removeItem, updateQuantity, clearQuote, totalItems, isDrawerOpen, setDrawerOpen } = useQuote();

  if (!isDrawerOpen) return null;

  return (
    <div className="quote-drawer-overlay" onClick={() => setDrawerOpen(false)}>
      <div className="quote-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="quote-drawer-header">
          <div>
            <h3>Wholesale Quote Draft</h3>
            <p className="quote-drawer-subtitle">{totalItems} unit(s) selected for B2B RFP</p>
          </div>
          <button className="drawer-close-btn" onClick={() => setDrawerOpen(false)} aria-label="Close drawer">
            &times;
          </button>
        </div>

        <div className="quote-drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <p>Your quote draft is currently empty.</p>
              <span>Add products from the catalog to build your wholesale order request.</span>
            </div>
          ) : (
            <ul className="quote-items-list">
              {items.map((item) => (
                <li key={item.id} className="quote-item">
                  <div className="quote-item-img-wrap">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className="quote-no-img">No Img</div>
                    )}
                  </div>
                  <div className="quote-item-details">
                    <h4 className="quote-item-title">{item.name}</h4>
                    <span className="quote-item-price">{item.priceFormatted} / unit</span>
                    <div className="quote-item-actions">
                      <div className="qty-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <button className="remove-item-btn" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="quote-drawer-footer">
            <div className="rfp-notice">
              Estimated wholesale quotes require account manager verification prior to dispatch.
            </div>
            <div className="drawer-btn-group">
              <button className="clear-quote-btn" onClick={clearQuote}>Clear Draft</button>
              <button 
                className="submit-quote-btn" 
                onClick={() => {
                  alert(`Quote draft submitted for ${totalItems} unit(s)! A Sameer's Wholesale account manager will contact you within 2 business hours.`);
                  clearQuote();
                  setDrawerOpen(false);
                }}
              >
                Request Official RFP Quote &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
