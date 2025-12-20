import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, StoreSettings, INITIAL_SETTINGS, MOCK_PRODUCTS } from '../types';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  settings: StoreSettings;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customerDetails: { name: string; city: string; phone: string }) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  useEffect(() => {
    const savedSettings = localStorage.getItem('store_settings');
    if (savedSettings) setSettings({...INITIAL_SETTINGS, ...JSON.parse(savedSettings)});

    const savedProducts = localStorage.getItem('store_products');
    setProducts(savedProducts ? JSON.parse(savedProducts) : MOCK_PRODUCTS);

    const savedOrders = localStorage.getItem('store_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  useEffect(() => { localStorage.setItem('store_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('store_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('store_orders', JSON.stringify(orders)); }, [orders]);

  const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
  const updateProduct = (product: Product) => setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.id !== productId));
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (customerDetails: { name: string; city: string; phone: string }) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: customerDetails.name,
      city: customerDetails.city,
      phone: customerDetails.phone,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      date: new Date().toISOString(),
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => setSettings(prev => ({ ...prev, ...newSettings }));

  return (
    <StoreContext.Provider value={{
      products, cart, orders, settings,
      addProduct, updateProduct, deleteProduct,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      placeOrder, updateOrderStatus, updateSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};