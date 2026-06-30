'use client';

import React from 'react';
import { QuoteProvider } from '@/context/QuoteContext';
import { SearchProvider } from '@/context/SearchContext';
import { AppHeader } from '@/components/AppHeader';
import { QuoteDrawer } from '@/components/QuoteDrawer';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <QuoteProvider>
        <div className="app-container">
          <AppHeader />
          <main className="main-content">
            {children}
          </main>
          <QuoteDrawer />
        </div>
      </QuoteProvider>
    </SearchProvider>
  );
}
