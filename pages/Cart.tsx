import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity } = useStore();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">سلة المشتريات فارغة</h2>
        <Link to="/" className="text-primary hover:underline">تصفح المنتجات</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">سلة المشتريات</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {cart.map(item => (
              <div key={item.id} className="p-4 flex items-center gap-4 border-b last:border-0">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-primary font-bold">{item.price} د.م</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
            <div className="flex justify-between mb-2 text-gray-600">
              <span>المجموع الفرعي</span>
              <span>{total} د.م</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600">
              <span>الشحن</span>
              <span className="text-green-600 font-bold">مجاني</span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center mb-6">
              <span className="text-xl font-bold">الإجمالي</span>
              <span className="text-2xl font-bold text-primary">{total} د.م</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary text-white py-4 rounded-lg font-bold shadow-lg hover:bg-teal-800 transition transform hover:-translate-y-1"
            >
              إتمام الطلب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};