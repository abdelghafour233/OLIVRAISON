import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const { cart, settings } = useStore();
  const location = useLocation();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path ? "text-secondary font-bold" : "text-white hover:text-gray-200";

  return (
    <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
           <span>🛍️</span>
           <span>{settings.storeName}</span>
        </Link>
        
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className={isActive('/')}>الرئيسية</Link>
          <Link to="/electronics" className={isActive('/electronics')}>إلكترونيات</Link>
          <Link to="/home" className={isActive('/home')}>المنزل</Link>
          <Link to="/cars" className={isActive('/cars')}>السيارات</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition">
             لوحة التحكم
          </Link>
          <Link to="/cart" className="relative group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      {/* Mobile Menu Bar - Simplified */}
      <div className="md:hidden flex justify-around bg-teal-800 py-2 text-sm">
          <Link to="/" className="text-white">الكل</Link>
          <Link to="/electronics" className="text-white">إلكترونيات</Link>
          <Link to="/home" className="text-white">المنزل</Link>
          <Link to="/cars" className="text-white">السيارات</Link>
      </div>
    </nav>
  );
};