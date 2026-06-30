'use client';

import React, { useState } from 'react';

interface ProductSpecsAccordionProps {
  descriptionRaw: string;
  productName: string;
}

export function ProductSpecsAccordion({ descriptionRaw, productName }: ProductSpecsAccordionProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'delivery'>('overview');

  let parsed: {
    summary?: string;
    features?: string[];
    specs?: Record<string, Record<string, string>>;
  } | null = null;

  try {
    if (descriptionRaw && descriptionRaw.trim().startsWith('{')) {
      parsed = JSON.parse(descriptionRaw);
    }
  } catch (e) {
    // Fallback to unstructured description
  }

  const summary = parsed?.summary || descriptionRaw || `Commercial specification for ${productName}.`;
  const features = parsed?.features || [
    'Official UK commercial specification',
    "Backed by Sameer's Wholesale 3-Year Trade Warranty",
    'Supplied ready for immediate corporate deployment'
  ];
  const specs = parsed?.specs || {
    "General Specification": {
      "Model": productName,
      "Warranty": "3-Year Commercial UK B2B Replacement",
      "Compliance": "CE, UKCA, RoHS Certified"
    }
  };

  return (
    <div className="currys-accordion-wrapper">
      {/* Sticky Tab Bar */}
      <div className="accordion-tab-bar">
        <button
          className={`acc-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview & Features
        </button>
        <button
          className={`acc-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
          onClick={() => setActiveTab('specs')}
        >
          ⚙️ Technical Specifications
        </button>
        <button
          className={`acc-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ Reviews & Q&A (14)
        </button>
        <button
          className={`acc-tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivery')}
        >
          🚚 UK Delivery & Pallets
        </button>
      </div>

      {/* Tab Content Panel */}
      <div className="accordion-content-panel">
        {activeTab === 'overview' && (
          <div className="tab-pane overview-pane">
            <div className="ai-summary-card">
              <div className="ai-badge">✨ AI Executive Trade Summary</div>
              <p className="summary-text">{summary}</p>
            </div>

            <h4 className="features-header">Key Commercial Highlights</h4>
            <div className="features-grid">
              {features.map((feat, idx) => (
                <div key={idx} className="feature-item-card">
                  <span className="feat-check">✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="tab-pane specs-pane">
            <h3 className="specs-main-title">Full Manufacturer & Commercial Specifications</h3>
            {Object.entries(specs).map(([catName, attributes], idx) => (
              <div key={idx} className="spec-category-section">
                <h4 className="spec-category-header">{catName}</h4>
                <table className="currys-spec-table">
                  <tbody>
                    {Object.entries(attributes).map(([key, val], sIdx) => (
                      <tr key={sIdx}>
                        <th className="spec-key">{key}</th>
                        <td className="spec-val">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="tab-pane reviews-pane">
            <div className="reviews-overview">
              <div className="overall-score-box">
                <div className="score-num">4.8</div>
                <div className="score-stars">★★★★★</div>
                <div className="score-count">Based on 14 verified UK trade purchases</div>
              </div>
              <div className="dimension-scores">
                <div className="dim-row">
                  <span>Hardware Performance</span>
                  <div className="dim-bar"><div className="dim-fill" style={{ width: '96%' }} /></div>
                  <span>4.8 / 5</span>
                </div>
                <div className="dim-row">
                  <span>Commercial Reliability</span>
                  <div className="dim-bar"><div className="dim-fill" style={{ width: '98%' }} /></div>
                  <span>4.9 / 5</span>
                </div>
                <div className="dim-row">
                  <span>Wholesale Value</span>
                  <div className="dim-bar"><div className="dim-fill" style={{ width: '94%' }} /></div>
                  <span>4.7 / 5</span>
                </div>
              </div>
            </div>

            <div className="sample-reviews-list">
              <div className="review-card">
                <div className="review-meta">
                  <strong>Apex IT Resellers (Manchester)</strong>
                  <span className="verified-trade-tag">✅ Verified Wholesale Order (25 units)</span>
                </div>
                <p className="review-comment">
                  "Flawless batch. All units arrived palletized next day exactly as described. Clean white packaging and zero defects across our client deployment."
                </p>
              </div>
              <div className="review-card">
                <div className="review-meta">
                  <strong>TechHub London Corporate Procurement</strong>
                  <span className="verified-trade-tag">✅ Verified Wholesale Order (10 units)</span>
                </div>
                <p className="review-comment">
                  "Sameer's Trade Portal made RFQ checkout effortless. The 3-year advance commercial warranty gives our enterprise clients total peace of mind."
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="tab-pane delivery-pane">
            <div className="delivery-info-grid">
              <div className="deliv-card">
                <h4>⚡ Next-Day UK Courier / Pallet Dispatch</h4>
                <p>All orders placed before 4:00 PM GMT are dispatched same day from our Manchester or Birmingham distribution hubs.</p>
              </div>
              <div className="deliv-card">
                <h4>📦 Standard Retail vs Palletized Freight</h4>
                <p>Single retail units ship via insured DPD Next-Day. Bulk trade orders (over 10 units) ship strapped and shrink-wrapped via Palletways UK with tail-lift delivery.</p>
              </div>
              <div className="deliv-card">
                <h4>🛡️ 3-Year Advance Replacement Warranty</h4>
                <p>If a hardware defect occurs within 3 years, trade partners receive an immediate replacement dispatched prior to return collection.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
