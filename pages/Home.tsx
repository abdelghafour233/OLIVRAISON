import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { useParams, Link } from 'react-router-dom';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useStore();

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      <Link to={`/product/${product.id}`} className="block h-48 overflow-hidden relative group">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs text-gray-500 mb-1">{product.category === 'electronics' ? 'إلكترونيات' : product.category === 'home' ? 'المنزل' : 'سيارات'}</span>
        <Link to={`/product/${product.id}`}>
             <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-primary">{product.price} د.م</span>
          <button 
            onClick={() => addToCart(product)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-800 active:scale-95 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            أضف للسلة
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
        case 'electronics': return 'الإلكترونيات';
        case 'home': return 'المنتجات المنزلية';
        case 'cars': return 'مستلزمات السيارات';
        default: return 'جميع المنتجات';
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{getTitle()}</h1>
        <div className="h-1 w-24 bg-secondary mx-auto rounded"></div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
            <p className="text-xl">لا توجد منتجات في هذا القسم حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};