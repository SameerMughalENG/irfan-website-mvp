'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TradeAccount {
  companyName: string;
  vatReg: string;
  sector: string;
}

export interface RetailCartItem {
  id: string;
  name: string;
  slug: string;
  priceFormatted: string;
  priceRaw: number;
  quantity: number;
  imageUrl?: string | null;
}

interface TradeContextType {
  isTradeMode: boolean;
  setTradeMode: (mode: boolean) => void;
  tradeAccount: TradeAccount | null;
  verifyTradeAccount: (account: TradeAccount) => void;
  logoutTradeAccount: () => void;
  isTradeModalOpen: boolean;
  setTradeModalOpen: (open: boolean) => void;
  
  // Retail Cart State
  retailItems: RetailCartItem[];
  addRetailItem: (item: Omit<RetailCartItem, 'quantity'>, qty?: number) => void;
  removeRetailItem: (id: string) => void;
  updateRetailQuantity: (id: string, qty: number) => void;
  clearRetailCart: () => void;
  totalRetailItems: number;
  totalRetailPrice: number;
  isRetailDrawerOpen: boolean;
  setRetailDrawerOpen: (open: boolean) => void;
  isMiniBasketOpen: boolean;
  setMiniBasketOpen: (open: boolean) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const [isTradeMode, setTradeMode] = useState<boolean>(false);
  const [tradeAccount, setTradeAccount] = useState<TradeAccount | null>(null);
  const [isTradeModalOpen, setTradeModalOpen] = useState<boolean>(false);

  const [retailItems, setRetailItems] = useState<RetailCartItem[]>([]);
  const [isRetailDrawerOpen, setRetailDrawerOpen] = useState<boolean>(false);
  const [isMiniBasketOpen, setMiniBasketOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('sameers_trade_mode');
      const savedAcc = localStorage.getItem('sameers_trade_acc');
      const savedCart = localStorage.getItem('sameers_retail_cart');
      if (savedMode === 'true') setTradeMode(true);
      if (savedAcc) setTradeAccount(JSON.parse(savedAcc));
      if (savedCart) setRetailItems(JSON.parse(savedCart));
    } catch (e) {
      console.error('Failed loading trade/retail state', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sameers_trade_mode', String(isTradeMode));
      if (tradeAccount) {
        localStorage.setItem('sameers_trade_acc', JSON.stringify(tradeAccount));
      } else {
        localStorage.removeItem('sameers_trade_acc');
      }
    } catch (e) {
      console.error('Failed saving trade state', e);
    }
  }, [isTradeMode, tradeAccount]);

  useEffect(() => {
    try {
      localStorage.setItem('sameers_retail_cart', JSON.stringify(retailItems));
    } catch (e) {
      console.error('Failed saving retail cart', e);
    }
  }, [retailItems]);

  const verifyTradeAccount = (acc: TradeAccount) => {
    setTradeAccount(acc);
    setTradeMode(true);
    setTradeModalOpen(false);
  };

  const logoutTradeAccount = () => {
    setTradeAccount(null);
    setTradeMode(false);
  };

  const addRetailItem = (item: Omit<RetailCartItem, 'quantity'>, qty = 1) => {
    setRetailItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += qty;
        return updated;
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setMiniBasketOpen(true);
  };

  const removeRetailItem = (id: string) => {
    setRetailItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateRetailQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeRetailItem(id);
      return;
    }
    setRetailItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const clearRetailCart = () => {
    setRetailItems([]);
  };

  const totalRetailItems = retailItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalRetailPrice = retailItems.reduce((sum, i) => sum + i.priceRaw * i.quantity, 0);

  return (
    <TradeContext.Provider
      value={{
        isTradeMode,
        setTradeMode,
        tradeAccount,
        verifyTradeAccount,
        logoutTradeAccount,
        isTradeModalOpen,
        setTradeModalOpen,
        retailItems,
        addRetailItem,
        removeRetailItem,
        updateRetailQuantity,
        clearRetailCart,
        totalRetailItems,
        totalRetailPrice,
        isRetailDrawerOpen,
        setRetailDrawerOpen,
        isMiniBasketOpen,
        setMiniBasketOpen,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}

export function useTrade() {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrade must be used within a TradeProvider');
  }
  return context;
}
