'use client';

import React from 'react';
import { QuoteProvider } from '@/context/QuoteContext';
import { SearchProvider } from '@/context/SearchContext';
import { TradeProvider } from '@/context/TradeContext';
import { AppHeader } from '@/components/AppHeader';
import { QuoteDrawer } from '@/components/QuoteDrawer';
import { RetailDrawer } from '@/components/RetailDrawer';
import { TradeModal } from '@/components/TradeModal';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TradeProvider>
      <SearchProvider>
        <QuoteProvider>
          <div className="app-container">
            <AppHeader />
            <main className="main-content">
              {children}
            </main>
            <QuoteDrawer />
            <RetailDrawer />
            <TradeModal />
          </div>
        </QuoteProvider>
      </SearchProvider>
    </TradeProvider>
  );
}
