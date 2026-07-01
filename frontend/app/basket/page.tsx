'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTrade } from '@/context/TradeContext';
import { useRouter } from 'next/navigation';

export default function BasketPage() {
  const {
    retailItems,
    removeRetailItem,
    updateRetailQuantity,
    clearRetailCart,
    totalRetailItems,
    totalRetailPrice,
  } = useTrade();

  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // VAT calculations (VAT is 20% included in retail prices)
  const vatAmount = totalRetailPrice * 0.2;
  const subtotalExVat = totalRetailPrice - vatAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'STUDENT10') {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate payment gateway loading
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      clearRetailCart();
    }, 2000);
  };

  const finalPrice = promoApplied ? totalRetailPrice * 0.9 : totalRetailPrice;

  if (checkoutSuccess) {
    return (
      <div className="checkout-success-container">
        <div className="success-card">
          <span className="success-large-icon">🎉</span>
          <h2>Thank You for Your Order!</h2>
          <p className="order-number">Order reference: <strong>SM-{Math.floor(100000 + Math.random() * 900000)}</strong></p>
          <p className="success-desc">
            Your transaction was processed successfully. A confirmation email with tracking details has been sent to your registered address.
          </p>
          <div className="success-actions">
            <Link href="/" className="btn-success-home">
              Return to Homepage
            </Link>
            <Link href="/products" className="btn-success-catalog">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="basket-page-container">
      <header className="basket-page-header">
        <h1 className="basket-title">Shopping Basket</h1>
        <p className="basket-subtitle">Review your consumer items and proceed to checkout.</p>
      </header>

      {retailItems.length === 0 ? (
        <div className="basket-empty-state">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Basket is Empty</h2>
          <p>Get ready for summer study! Browse our top electronics products and add items to your cart.</p>
          <Link href="/products" className="btn-shop-now">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="basket-grid-layout">
          {/* Left Column: Cart Items list */}
          <div className="basket-items-panel">
            <div className="basket-items-list">
              {retailItems.map((item) => (
                <div key={item.id} className="basket-item-card">
                  <div className="basket-item-image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className="image-placeholder">💻</div>
                    )}
                  </div>

                  <div className="basket-item-info">
                    <span className="item-sku">SKU: {item.slug.toUpperCase()}</span>
                    <h3 className="item-name">
                      <Link href={`/product/${item.slug}`}>{item.name}</Link>
                    </h3>
                    <span className="item-delivery-flag">🚚 Free standard next-day UK delivery</span>
                  </div>

                  <div className="basket-item-pricing-qty">
                    <div className="item-qty-selector">
                      <button 
                        onClick={() => updateRetailQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        readOnly 
                        aria-label="Quantity"
                      />
                      <button 
                        onClick={() => updateRetailQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="item-subtotal-price">
                      <span className="unit-price-hint">£{item.priceRaw.toFixed(2)} each</span>
                      <strong>£{(item.priceRaw * item.quantity).toFixed(2)}</strong>
                    </div>

                    <button 
                      className="btn-remove-item"
                      onClick={() => removeRetailItem(item.id)}
                      aria-label="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="basket-actions-row">
              <Link href="/products" className="btn-continue-shop">
                &larr; Continue Shopping
              </Link>
              <button className="btn-clear-basket" onClick={clearRetailCart}>
                Empty Entire Basket
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary Panel */}
          <aside className="basket-summary-panel">
            <div className="summary-card">
              <h3>Order Summary</h3>

              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal (Excl. VAT)</span>
                  <span>£{subtotalExVat.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated VAT (20%)</span>
                  <span>£{vatAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery (Standard UK)</span>
                  <span className="free-shipping-tag">FREE</span>
                </div>

                {promoApplied && (
                  <div className="summary-row discount-applied">
                    <span>Promo Applied (10%)</span>
                    <span>-£{(totalRetailPrice * 0.1).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleApplyPromo} className="promo-code-form">
                <input 
                  type="text" 
                  placeholder="Enter Promo Code (e.g. STUDENT10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                />
                <button type="submit" disabled={promoApplied || !promoCode}>
                  Apply
                </button>
              </form>
              {promoApplied && <p className="promo-success-msg">Code applied successfully!</p>}
              {promoError && <p className="promo-error-msg">Invalid promo code. Try STUDENT10!</p>}

              <div className="summary-total-row">
                <span>Total (Inc. VAT)</span>
                <strong>£{finalPrice.toFixed(2)}</strong>
              </div>

              <button 
                className="btn-proceed-checkout" 
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <span className="loading-spinner">Processing...</span>
                ) : (
                  <>🔒 Secure Checkout</>
                )}
              </button>

              <div className="payment-trust-indicators">
                <span>🛡️ PCI DSS Certified checkout encryption</span>
                <span>📦 Safe delivery signature required</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
