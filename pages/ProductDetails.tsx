import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart } = useStore();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="p-10 text-center">المنتج غير موجود</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-gray-600 hover:text-primary flex items-center gap-1">
         &rarr; عودة
      </button>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 p-4 bg-gray-100 flex items-center justify-center">
            <img src={product.image} alt={product.name} className="max-h-[500px] object-contain w-full rounded-lg" />
        </div>
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <span className="text-sm text-secondary font-bold uppercase tracking-wider mb-2">
                {product.category === 'electronics' ? 'إلكترونيات' : product.category === 'home' ? 'منزل' : 'سيارات'}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">{product.description}</p>
            
            <div className="flex items-center justify-between border-t border-gray-200 pt-8">
                <div>
                    <span className="block text-gray-500 text-sm">السعر</span>
                    <span className="text-3xl font-bold text-primary">{product.price} د.م</span>
                </div>
                <button 
                    onClick={() => { addToCart(product); }}
                    className="bg-secondary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-amber-600 transform hover:-translate-y-1 transition-all"
                >
                    أضف إلى السلة 🛒
                </button>
            </div>
            
            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                <p>🚚 <strong>شحن سريع:</strong> التوصيل لجميع المدن المغربية.</p>
                <p>🛡️ <strong>ضمان الجودة:</strong> استرجاع خلال 3 أيام في حالة وجود عيب.</p>
            </div>
        </div>
      </div>
    </div>
  );
};