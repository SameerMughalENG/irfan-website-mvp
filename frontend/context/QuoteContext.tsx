'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface QuoteItem {
  id: string;
  name: string;
  slug: string;
  priceFormatted: string;
  quantity: number;
  imageUrl?: string | null;
}

interface QuoteContextType {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, 'quantity'>, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearQuote: () => void;
  totalItems: number;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sameers_wholesale_quote');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load quote from local storage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sameers_wholesale_quote', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save quote to local storage', e);
    }
  }, [items]);

  const addItem = (item: Omit<QuoteItem, 'quantity'>, qty = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const clearQuote = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <QuoteContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearQuote,
        totalItems,
        isDrawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
}
