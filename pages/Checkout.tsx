import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

export const Checkout: React.FC = () => {
  const { cart, placeOrder, settings } = useStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    await placeOrder(formData);
    
    // Trigger Pixel Events (Simulation)
    if(settings.facebookPixelId) console.log("FB Pixel: Purchase Event Fired");
    if(settings.tiktokPixelId) console.log("TikTok Pixel: PlaceOrder Event Fired");

    setLoading(false);
    alert('تم استلام طلبك بنجاح! شكراً لثقتكم.');
    navigate('/');
  };

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          إتمام الطلب
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
           أنت على بعد خطوة واحدة من الحصول على منتجاتك
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <div className="mb-6 bg-blue-50 p-4 rounded text-sm text-blue-700">
            <p>مجموع الطلب: <strong>{total} درهم مغربي</strong></p>
            <p className="text-xs mt-1">الدفع عند الاستلام</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                الاسم الكامل
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="محمد أحمد"
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                المدينة
              </label>
              <div className="mt-1">
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="الدار البيضاء"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                رقم الهاتف
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="06XXXXXXXX"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'جاري المعالجة...' : 'تأكيد الطلب'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};