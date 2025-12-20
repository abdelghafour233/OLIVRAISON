import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { useParams, Link } from 'react-router-dom';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useStore();

  return (
    <div className="bg-white rounded-[32px] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-50 flex flex-col group h-full">
      <Link to={`/product/${product.id}`} className="block h-56 overflow-hidden relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-primary tracking-widest shadow-sm">
            {product.category === 'electronics' ? 'إلكترونيات' : product.category === 'home' ? 'منزل' : 'سيارات'}
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
             <h3 className="text-lg font-black text-gray-800 mb-2 group-hover:text-primary transition-colors leading-tight line-clamp-2">{product.name}</h3>
        </Link>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">{product.description}</p>
        <div className="flex justify-between items-center mt-auto border-t border-gray-50 pt-4">
          <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold">السعر</span>
              <span className="text-xl font-black text-primary">{product.price} <span className="text-xs">د.م</span></span>
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="bg-[#0f172a] text-white p-4 rounded-2xl hover:bg-primary active:scale-90 transition-all shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const { products } = useStore();
  const { category } = useParams<{ category?: string }>();

  const filteredProducts = useMemo(() => {
    if (!category) return products;
    return products.filter(p => p.category === category);
  }, [products, category]);

  const getTitle = () => {
    switch(category) {
        case 'electronics': return 'عالم الإلكترونيات';
        case 'home': return 'أناقة المنزل';
        case 'cars': return 'اكسسوارات السيارات';
        default: return 'اكتشف مجموعتنا المميزة';
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section Placeholder */}
      <div className="relative h-64 md:h-80 rounded-[40px] overflow-hidden mb-16 bg-gradient-to-r from-teal-700 to-teal-900 flex items-center justify-center text-center p-8">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl translate-x-32 translate-y-32"></div>
          </div>
          <div className="relative z-10">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">{getTitle()}</h1>
              <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
              <p className="text-teal-100 mt-4 text-sm md:text-lg max-w-xl mx-auto">أفضل المنتجات بجودة عالية وتوصيل سريع لجميع أنحاء المغرب</p>
          </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-32">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-400 font-bold">عذراً، لم نجد أي منتجات في هذا القسم حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};