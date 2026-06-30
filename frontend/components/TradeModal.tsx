'use client';

import React, { useState } from 'react';
import { useTrade } from '@/context/TradeContext';

export function TradeModal() {
  const { isTradeModalOpen, setTradeModalOpen, isTradeMode, setTradeMode, tradeAccount, verifyTradeAccount, logoutTradeAccount } = useTrade();

  const [companyName, setCompanyName] = useState('Apex Digital UK Ltd');
  const [vatReg, setVatReg] = useState('GB991827364');
  const [sector, setSector] = useState('IT & Computing Reseller');

  if (!isTradeModalOpen) return null;

  const handleCustomVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyTradeAccount({ companyName, vatReg, sector });
  };

  const handleQuickDemo = () => {
    verifyTradeAccount({
      companyName: 'Verified Trade Partner (Demo)',
      vatReg: 'GB882910293',
      sector: 'Electronics Retailer & Distributor',
    });
  };

  return (
    <div className="trade-modal-overlay">
      <div className="trade-modal-box">
        <div className="trade-modal-header">
          <h3>🔐 UK B2B Trade Portal</h3>
          <button className="trade-modal-close" onClick={() => setTradeModalOpen(false)}>
            &times;
          </button>
        </div>

        <div className="trade-modal-body">
          {isTradeMode ? (
            <div className="trade-verified-view">
              <div className="verified-badge-banner">
                <span>✅ Verified Wholesale Trade Account Active</span>
              </div>
              <p className="account-welcome">
                Welcome back, <strong>{tradeAccount?.companyName || 'Trade Partner'}</strong>.
              </p>
              <div className="account-details-card">
                <div><strong>VAT Reg:</strong> {tradeAccount?.vatReg || 'GB882910293'}</div>
                <div><strong>Industry Sector:</strong> {tradeAccount?.sector || 'Electronics Reseller'}</div>
                <div><strong>Active Perks:</strong> Up to 15% Volume Tier Discount, Net 30 Credit Terms, Instant Pallet RFQ</div>
              </div>

              <div className="trade-mode-toggle-section">
                <p>You are currently viewing pricing in <strong>Wholesale Volume Tier Mode (Ex. VAT)</strong>.</p>
                <div className="modal-btn-group">
                  <button 
                    className="switch-mode-btn"
                    onClick={() => {
                      setTradeMode(false);
                      setTradeModalOpen(false);
                    }}
                  >
                    🛍️ Switch to Consumer Retail View
                  </button>
                  <button 
                    className="logout-trade-btn"
                    onClick={() => {
                      logoutTradeAccount();
                      setTradeModalOpen(false);
                    }}
                  >
                    Sign Out of Trade Portal
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="trade-onboarding-view">
              <p className="trade-intro">
                Sameer's Wholesale supplies UK electronics retailers, IT resellers, and corporate procurement teams. Verify your B2B trade status to unlock wholesale volume tiers (10+ units) and Request for Quote (RFQ) tools.
              </p>

              <div className="quick-demo-section">
                <div className="demo-banner-label">⚡ Client MVP Demo Instant Access</div>
                <button className="quick-demo-btn" onClick={handleQuickDemo}>
                  🚀 Unlock Wholesale Trade Portal (Instant Demo Verification)
                </button>
                <span className="demo-subtext">Click above to immediately simulate a verified B2B account login.</span>
              </div>

              <div className="modal-divider">
                <span>OR REGISTER COMPANY DETAILS</span>
              </div>

              <form onSubmit={handleCustomVerify} className="trade-form">
                <div className="form-group">
                  <label htmlFor="compName">Registered Company Name:</label>
                  <input 
                    id="compName"
                    type="text" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="vatId">UK VAT Registration Number:</label>
                  <input 
                    id="vatId"
                    type="text" 
                    value={vatReg} 
                    onChange={(e) => setVatReg(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="indSector">Trade Industry Sector:</label>
                  <input 
                    id="indSector"
                    type="text" 
                    value={sector} 
                    onChange={(e) => setSector(e.target.value)} 
                    required 
                  />
                </div>

                <button type="submit" className="trade-submit-btn">
                  Verify & Enter Wholesale Storefront
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
