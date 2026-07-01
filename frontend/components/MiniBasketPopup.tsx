'use client';

import React from 'react';
import { useTrade } from '@/context/TradeContext';
import { useRouter } from 'next/navigation';

export function MiniBasketPopup() {
  const {
    retailItems,
    isMiniBasketOpen,
    setMiniBasketOpen,
    totalRetailItems,
    totalRetailPrice
  } = useTrade();
  
  const router = useRouter();

  if (!isMiniBasketOpen) return null;

  const handleGoToBasket = () => {
    setMiniBasketOpen(false);
    router.push('/basket');
  };

  return (
    <div className="mini-basket-overlay" onClick={() => setMiniBasketOpen(false)}>
      <div className="mini-basket-popup" onClick={(e) => e.stopPropagation()}>
        <div className="mini-basket-header">
          <div className="header-status">
            <span className="success-icon">✓</span>
            <h3>Added to Basket!</h3>
          </div>
          <button className="popup-close-btn" onClick={() => setMiniBasketOpen(false)}>
            &times;
          </button>
        </div>

        <div className="mini-basket-body">
          <p className="basket-summary-text">
            You have <strong>{totalRetailItems}</strong> {totalRetailItems === 1 ? 'item' : 'items'} in your basket.
          </p>

          <div className="mini-items-list">
            {retailItems.slice(-3).reverse().map((item) => (
              <div key={item.id} className="mini-item-row">
                <div className="mini-item-img">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="mini-img-placeholder">🛒</div>
                  )}
                </div>
                <div className="mini-item-details">
                  <h4 className="mini-item-name">{item.name}</h4>
                  <span className="mini-item-meta">Qty: {item.quantity} &times; £{item.priceRaw.toFixed(2)}</span>
                </div>
              </div>
            ))}
            {retailItems.length > 3 && (
              <div className="mini-items-more">
                + {retailItems.length - 3} more items in basket
              </div>
            )}
          </div>

          <div className="mini-total-row">
            <span>Basket Total (Inc. VAT):</span>
            <strong>£{totalRetailPrice.toFixed(2)}</strong>
          </div>
        </div>

        <div className="mini-basket-actions">
          <button className="btn-continue-shopping" onClick={() => setMiniBasketOpen(false)}>
            Continue Shopping
          </button>
          <button className="btn-view-basket" onClick={handleGoToBasket}>
            View Basket &amp; Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
