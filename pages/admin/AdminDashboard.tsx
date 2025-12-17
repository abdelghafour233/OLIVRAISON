import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { generateProductDescription, analyzeStoreData } from '../../services/geminiService';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { orders, products, addProduct, updateProduct, deleteProduct, settings, updateSettings } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Simple Check for "admin" password
  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordInput === 'admin') {
          setIsAuthenticated(true);
          setLoginError('');
      } else {
          setLoginError('كلمة المرور غير صحيحة');
      }
  };

  if (!isAuthenticated) {
      return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
              <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                  <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">تسجيل الدخول للوحة التحكم</h1>
                  <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                          <input 
                              type="password" 
                              value={passwordInput} 
                              onChange={(e) => setPasswordInput(e.target.value)}
                              className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
                              placeholder="أدخل كلمة المرور"
                          />
                      </div>
                      {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                      <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-teal-800 transition">
                          دخول
                      </button>
                      <button type="button" onClick={() => navigate('/')} className="w-full text-gray-500 text-sm hover:text-gray-700">
                          العودة للمتجر
                      </button>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4 flex justify-between items-center bg-gray-900">
            <span className="text-xl font-bold">لوحة التحكم</span>
            <button onClick={() => setIsAuthenticated(false)} className="text-xs bg-red-600 px-2 py-1 rounded">خروج</button>
        </div>
        <nav className="p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full text-right px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-primary' : 'hover:bg-gray-700'}`}>نظرة عامة</button>
          <button onClick={() => setActiveTab('orders')} className={`w-full text-right px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-primary' : 'hover:bg-gray-700'}`}>الطلبات ({orders.length})</button>
          <button onClick={() => setActiveTab('products')} className={`w-full text-right px-4 py-2 rounded ${activeTab === 'products' ? 'bg-primary' : 'hover:bg-gray-700'}`}>المنتجات والأسعار</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full text-right px-4 py-2 rounded ${activeTab === 'settings' ? 'bg-primary' : 'hover:bg-gray-700'}`}>الإعدادات والدومين</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-y-auto">
        {activeTab === 'overview' && <OverviewTab orders={orders} productsCount={products.length} />}
        {activeTab === 'orders' && <OrdersTab orders={orders} />}
        {activeTab === 'products' && <ProductsTab products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />}
        {activeTab === 'settings' && <SettingsTab settings={settings} updateSettings={updateSettings} products={products} />}
      </div>
    </div>
  );
};

// --- Sub Components ---

const OverviewTab: React.FC<{ orders: any[], productsCount: number }> = ({ orders, productsCount }) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const [aiAdvice, setAiAdvice] = useState<string>("جاري تحليل البيانات...");

  useEffect(() => {
    analyzeStoreData(orders.length, totalRevenue).then(setAiAdvice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">ملخص المتجر</h2>
      
      {/* AI Insight Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
            ✨ مساعد الذكاء الاصطناعي
        </h3>
        <p className="text-indigo-100 leading-relaxed">{aiAdvice}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-r-4 border-green-500">
          <div className="text-gray-500 text-sm">إجمالي المبيعات</div>
          <div className="text-3xl font-bold text-gray-800">{totalRevenue} د.م</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-r-4 border-blue-500">
          <div className="text-gray-500 text-sm">عدد الطلبات</div>
          <div className="text-3xl font-bold text-gray-800">{orders.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-r-4 border-yellow-500">
          <div className="text-gray-500 text-sm">المنتجات النشطة</div>
          <div className="text-3xl font-bold text-gray-800">{productsCount}</div>
        </div>
      </div>
    </div>
  );
};

const OrdersTab: React.FC<{ orders: any[] }> = ({ orders }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">سجل الطلبات</h2>
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-right">
        <thead className="bg-gray-50 text-gray-600 font-medium">
          <tr>
            <th className="p-4">رقم الطلب</th>
            <th className="p-4">الزبون</th>
            <th className="p-4">المدينة</th>
            <th className="p-4">الهاتف</th>
            <th className="p-4">المجموع</th>
            <th className="p-4">التاريخ</th>
            <th className="p-4">الحالة</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <tr><td colSpan={7} className="p-8 text-center text-gray-500">لا توجد طلبات حتى الآن</td></tr>
          ) : (
            orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 text-xs font-mono text-gray-500">#{order.id}</td>
                <td className="p-4 font-medium">{order.customerName}</td>
                <td className="p-4">{order.city}</td>
                <td className="p-4" dir="ltr">{order.phone}</td>
                <td className="p-4 text-primary font-bold">{order.total} د.م</td>
                <td className="p-4 text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                <td className="p-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">قيد الانتظار</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const ProductsTab: React.FC<{ products: Product[], addProduct: any, updateProduct: any, deleteProduct: any }> = ({ products, addProduct, updateProduct, deleteProduct }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  
  const initialFormState: Partial<Product> = {
    name: '', price: 0, category: 'electronics', description: '', image: 'https://picsum.photos/400/400?random=' + Math.floor(Math.random() * 100)
  };
  const [productForm, setProductForm] = useState<Partial<Product>>(initialFormState);

  const handleGenerateDescription = async () => {
    if (!productForm.name || !productForm.category) return alert("اكتب اسم المنتج وتصنيفه أولاً");
    setLoadingAI(true);
    const desc = await generateProductDescription(productForm.name, productForm.category);
    setProductForm(prev => ({ ...prev, description: desc }));
    setLoadingAI(false);
  };

  const startEdit = (product: Product) => {
      setProductForm(product);
      setEditingId(product.id);
      setIsEditing(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    if(productForm.name && productForm.price) {
        if (editingId) {
            // Update existing
            updateProduct({ ...productForm, id: editingId } as Product);
        } else {
            // Add new
            addProduct({ ...productForm, id: Date.now().toString() } as Product);
        }
        
        // Reset
        setIsEditing(false);
        setEditingId(null);
        setProductForm(initialFormState);
    }
  };

  const cancelEdit = () => {
      setIsEditing(false);
      setEditingId(null);
      setProductForm(initialFormState);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة المنتجات والأسعار</h2>
        {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="bg-primary text-white px-4 py-2 rounded hover:bg-teal-800">
                إضافة منتج جديد +
            </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200 border-t-4 border-t-secondary">
            <h3 className="font-bold mb-4 text-lg">{editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">اسم المنتج</label>
                    <input type="text" className="w-full border p-2 rounded" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">السعر (د.م)</label>
                    <input type="number" className="w-full border p-2 rounded" value={productForm.price || ''} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">التصنيف</label>
                    <select className="w-full border p-2 rounded" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value as any})}>
                        <option value="electronics">إلكترونيات</option>
                        <option value="home">منزل</option>
                        <option value="cars">سيارات</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">رابط الصورة</label>
                    <input type="text" className="w-full border p-2 rounded" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} />
                </div>
            </div>
            <div className="mb-4 relative">
                <label className="block text-xs text-gray-500 mb-1">الوصف</label>
                <textarea className="w-full border p-2 rounded h-24" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                <button 
                    onClick={handleGenerateDescription}
                    disabled={loadingAI}
                    className="absolute bottom-3 left-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 flex items-center gap-1"
                >
                    {loadingAI ? 'جاري الكتابة...' : '✨ توليد وصف AI'}
                </button>
            </div>
            <div className="flex gap-2">
                <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex-grow">{editingId ? 'حفظ التعديلات' : 'نشر المنتج'}</button>
                <button onClick={cancelEdit} className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300">إلغاء</button>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => (
            <div key={p.id} className="bg-white p-4 rounded shadow border border-gray-100 relative group hover:shadow-md transition">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => startEdit(p)} className="bg-blue-100 text-blue-600 p-1 rounded hover:bg-blue-200" title="تعديل">✏️</button>
                    <button onClick={() => deleteProduct(p.id)} className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200" title="حذف">🗑️</button>
                </div>
                <img src={p.image} alt={p.name} className="h-32 w-full object-cover rounded mb-2" />
                <h4 className="font-bold text-gray-800 line-clamp-1">{p.name}</h4>
                <p className="text-primary font-bold">{p.price} د.م</p>
            </div>
        ))}
      </div>
    </div>
  );
};

const SettingsTab: React.FC<{ settings: any, updateSettings: any, products: Product[] }> = ({ settings, updateSettings, products }) => {
    
    // Function to generate a downloadable static HTML file
    const handleDownloadSite = () => {
        const productsJson = JSON.stringify(products);
        const settingsJson = JSON.stringify(settings);
        
        const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${settings.storeName}</title>
    <style>body{font-family:sans-serif;text-align:right;padding:20px;background:#f8f9fa} .product{border:1px solid #ddd;padding:15px;margin:10px;background:white;border-radius:8px}</style>
    ${settings.facebookPixelId ? `<script>console.log('FB Pixel ${settings.facebookPixelId}');</script>` : ''}
    ${settings.customHeadJs}
</head>
<body>
    <h1>${settings.storeName} - نسخة ثابتة</h1>
    <div id="products-container"></div>
    <script>
        const products = ${productsJson};
        const container = document.getElementById('products-container');
        products.forEach(p => {
            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = '<h2>'+p.name+'</h2><p>'+p.price+' MAD</p><p>'+p.description+'</p>';
            container.appendChild(div);
        });
    </script>
</body>
</html>`;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shop_export.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">الإعدادات</h2>
            
            <div className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
                <h3 className="font-bold border-b pb-2 text-gray-700">النطاق والسيرفر (Domain & DNS)</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">اسم النطاق (Domain Name)</label>
                    <input 
                        type="text" 
                        className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-primary" 
                        value={settings.domainName} 
                        onChange={(e) => updateSettings({ domainName: e.target.value })} 
                        placeholder="example.ma"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">أسماء السيرفرات (Nameservers)</label>
                    <textarea 
                        className="w-full border p-2 rounded mt-1 h-20 font-mono text-sm bg-gray-50 focus:bg-white transition" 
                        value={settings.nameservers || ''} 
                        onChange={(e) => updateSettings({ nameservers: e.target.value })}
                        placeholder="ns1.hosting.com&#10;ns2.hosting.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">قم بتحديث هذه البيانات لتطابق استضافتك.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
                <h3 className="font-bold border-b pb-2 text-gray-700">أكواد التتبع (Pixels)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-blue-800">Facebook Pixel ID</label>
                        <input type="text" placeholder="Ex: 123456789" className="w-full border p-2 rounded mt-1" value={settings.facebookPixelId} onChange={(e) => updateSettings({ facebookPixelId: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black">TikTok Pixel ID</label>
                        <input type="text" placeholder="Ex: CXXXXXXX" className="w-full border p-2 rounded mt-1" value={settings.tiktokPixelId} onChange={(e) => updateSettings({ tiktokPixelId: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-orange-600">Google Analytics / Pixel</label>
                        <input type="text" placeholder="Ex: G-XXXXXXXX" className="w-full border p-2 rounded mt-1" value={settings.googlePixelId} onChange={(e) => updateSettings({ googlePixelId: e.target.value })} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
                <h3 className="font-bold border-b pb-2 text-gray-700">اسم المتجر والربط</h3>
                <div>
                    <label className="block text-sm font-medium">اسم المتجر</label>
                    <input type="text" className="w-full border p-2 rounded mt-1" value={settings.storeName} onChange={(e) => updateSettings({ storeName: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-green-700">رابط Google Sheets Webhook</label>
                    <input type="text" placeholder="https://script.google.com/macros/s/..." className="w-full border p-2 rounded mt-1" value={settings.googleSheetsUrl} onChange={(e) => updateSettings({ googleSheetsUrl: e.target.value })} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-t-4 border-secondary">
                <h3 className="font-bold mb-4">تصدير الموقع</h3>
                <p className="text-sm text-gray-600 mb-4">يمكنك تحميل نسخة HTML من متجرك تحتوي على جميع المنتجات الحالية لرفعها على استضافة ساكنة.</p>
                <button onClick={handleDownloadSite} className="bg-gray-800 text-white px-6 py-3 rounded flex items-center gap-2 hover:bg-black transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    تحميل الموقع (HTML)
                </button>
            </div>
        </div>
    );
};