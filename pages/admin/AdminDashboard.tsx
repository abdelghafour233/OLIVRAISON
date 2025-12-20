import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Order } from '../../types';
import { generateProductDescription, analyzeStoreData } from '../../services/geminiService';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { orders, products, addProduct, updateProduct, deleteProduct, settings, updateSettings, updateOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

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
          <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center p-4">
              <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-[10px] border-primary">
                  <div className="text-center mb-10">
                      <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🔐</span>
                      </div>
                      <h1 className="text-3xl font-black text-gray-800">متجر النخبة</h1>
                      <p className="text-gray-400 mt-2">لوحة التحكم الإدارية</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-6">
                      <input 
                          type="password" 
                          autoFocus
                          value={passwordInput} 
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="w-full bg-gray-50 border-0 px-5 py-4 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-center text-xl tracking-widest"
                          placeholder="كلمة المرور"
                      />
                      {loginError && <p className="text-red-500 text-sm text-center font-bold">{loginError}</p>}
                      <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:bg-teal-800 transition-all">
                          دخول النظام
                      </button>
                      <button type="button" onClick={() => navigate('/')} className="w-full text-gray-400 hover:text-gray-600 transition-colors text-sm">
                          العودة للمتجر
                      </button>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f1f5f9]">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-white shadow-2xl flex-shrink-0 z-20">
        <div className="p-8 bg-primary text-white flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-3 text-3xl">🛍️</div>
            <span className="text-xl font-black">لوحة الإدارة</span>
            <span className="text-xs opacity-70 mt-1">v2.0 - نسخة النخبة</span>
        </div>
        <nav className="p-6 space-y-2">
          <SidebarLink active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="الإحصائيات" icon="📊" />
          <SidebarLink active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="الطلبات" badge={orders.length} icon="📦" />
          <SidebarLink active={activeTab === 'products'} onClick={() => setActiveTab('products')} label="المنتجات" icon="🛒" />
          <SidebarLink active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="الإعدادات" icon="⚙️" />
          <div className="pt-10">
              <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all">
                  <span>🚪</span> تسجيل الخروج
              </button>
          </div>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-grow p-4 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
            {activeTab === 'overview' && <OverviewTab orders={orders} productsCount={products.length} />}
            {activeTab === 'orders' && <OrdersTab orders={orders} updateOrderStatus={updateOrderStatus} />}
            {activeTab === 'products' && <ProductsTab products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />}
            {activeTab === 'settings' && <SettingsTab settings={settings} updateSettings={updateSettings} products={products} />}
        </div>
      </div>
    </div>
  );
};

const SidebarLink: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string; badge?: number }> = ({ active, onClick, label, icon, badge }) => (
    <button 
        onClick={onClick} 
        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${active ? 'bg-primary text-white shadow-lg translate-x-1' : 'text-gray-500 hover:bg-gray-100'}`}
    >
        <div className="flex items-center gap-4">
            <span className="text-xl">{icon}</span>
            <span className="font-bold">{label}</span>
        </div>
        {badge !== undefined && badge > 0 && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                {badge}
            </span>
        )}
    </button>
);

const OverviewTab: React.FC<{ orders: Order[], productsCount: number }> = ({ orders, productsCount }) => {
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.total, 0);
  const [aiAdvice, setAiAdvice] = useState<string>("جاري تحليل البيانات...");

  useEffect(() => {
    analyzeStoreData(orders.length, totalRevenue).then(setAiAdvice);
  }, [orders.length, totalRevenue]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox label="مبيعات مؤكدة" value={`${totalRevenue} د.م`} icon="💰" color="bg-green-500" />
          <StatBox label="طلبات جديدة" value={orders.filter(o => o.status === 'pending').length} icon="📥" color="bg-blue-500" />
          <StatBox label="إجمالي المنتجات" value={productsCount} icon="📦" color="bg-amber-500" />
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border-r-8 border-teal-600 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-teal-50 rounded-full -translate-x-16 -translate-y-16 opacity-50"></div>
          <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> نصيحة الذكاء الاصطناعي
          </h3>
          <p className="text-gray-600 leading-relaxed text-lg italic">{aiAdvice}</p>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string | number; icon: string; color: string }> = ({ label, value, icon, color }) => (
    <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg`}>{icon}</div>
        <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">{label}</div>
        <div className="text-3xl font-black text-gray-800 mt-1">{value}</div>
    </div>
);

const OrdersTab: React.FC<{ orders: Order[], updateOrderStatus: any }> = ({ orders, updateOrderStatus }) => {
    const getStatusStyle = (status: Order['status']) => {
        switch(status) {
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const getStatusLabel = (status: Order['status']) => {
        switch(status) {
            case 'completed': return 'تم التوصيل';
            case 'cancelled': return 'ملغى';
            default: return 'قيد الانتظار';
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-500">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-2xl font-black text-gray-800">سجل الطلبات</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
                        <tr>
                            <th className="p-6">المعرف / التاريخ</th>
                            <th className="p-6">الزبون</th>
                            <th className="p-6">المدينة / الهاتف</th>
                            <th className="p-6">المجموع</th>
                            <th className="p-6">الحالة</th>
                            <th className="p-6">إجراء</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.length === 0 ? (
                            <tr><td colSpan={6} className="p-20 text-center text-gray-300 font-bold">لا توجد طلبات بعد</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-gray-400 text-xs">#{order.id}</div>
                                        <div className="text-[10px] mt-1">{new Date(order.date).toLocaleDateString('ar-MA')}</div>
                                    </td>
                                    <td className="p-6 font-black text-gray-700">{order.customerName}</td>
                                    <td className="p-6">
                                        <div className="text-sm font-bold">{order.city}</div>
                                        <div className="text-xs text-gray-400 font-mono">{order.phone}</div>
                                    </td>
                                    <td className="p-6 text-primary font-black">{order.total} د.م</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getStatusStyle(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                            className="bg-white border border-gray-200 rounded-lg text-xs p-1 focus:ring-1 focus:ring-primary outline-none"
                                        >
                                            <option value="pending">انتظار</option>
                                            <option value="completed">توصيل</option>
                                            <option value="cancelled">إلغاء</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ProductsTab: React.FC<{ products: Product[], addProduct: any, updateProduct: any, deleteProduct: any }> = ({ products, addProduct, updateProduct, deleteProduct }) => {
  const [form, setForm] = useState<Partial<Product>>({ name: '', price: 0, category: 'electronics', description: '', image: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleAI = async () => {
      if (!form.name) return alert("يرجى كتابة اسم المنتج");
      setLoadingAI(true);
      const desc = await generateProductDescription(form.name, form.category || 'electronics');
      setForm(prev => ({ ...prev, description: desc }));
      setLoadingAI(false);
  };

  const handleSave = () => {
      if (!form.name || !form.price) return;
      if (editId) updateProduct({ ...form, id: editId } as Product);
      else addProduct({ ...form, id: Date.now().toString(), image: form.image || `https://picsum.photos/400/400?random=${Math.random()}` } as Product);
      reset();
  };

  const reset = () => { setForm({ name: '', price: 0, category: 'electronics', description: '', image: '' }); setIsEditing(false); setEditId(null); };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-800">إدارة المنتجات</h2>
        {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="bg-primary text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-teal-800 transition-all active:scale-95">
                + إضافة منتج
            </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border-t-[10px] border-secondary animate-in slide-in-from-top duration-300">
            <h3 className="text-xl font-black mb-6">{editId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input type="text" placeholder="اسم المنتج" className="w-full bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <input type="number" placeholder="السعر (د.م)" className="w-full bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})} />
                <select className="w-full bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary" value={form.category} onChange={e => setForm({...form, category: e.target.value as any})}>
                    <option value="electronics">إلكترونيات</option>
                    <option value="home">منزلية</option>
                    <option value="cars">سيارات</option>
                </select>
                <input type="text" placeholder="رابط الصورة (اختياري)" className="w-full bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
            </div>
            <div className="mb-6 relative">
                <textarea placeholder="وصف المنتج" className="w-full bg-gray-50 p-4 rounded-xl h-32 outline-none focus:ring-2 focus:ring-primary" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                <button onClick={handleAI} disabled={loadingAI} className="absolute bottom-4 left-4 bg-teal-100 text-teal-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-200 flex items-center gap-2">
                    {loadingAI ? '🪄 جاري التوليد...' : '🪄 كتابة وصف ذكي'}
                </button>
            </div>
            <div className="flex gap-4">
                <button onClick={handleSave} className="flex-grow bg-primary text-white py-4 rounded-2xl font-black shadow-lg">حفظ المنتج</button>
                <button onClick={reset} className="px-10 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold">إلغاء</button>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(p => (
            <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm group hover:shadow-xl transition-all relative border border-gray-100">
                <div className="h-44 relative">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setForm(p); setEditId(p.id); setIsEditing(true); window.scrollTo(0,0); }} className="bg-white/90 p-2 rounded-xl text-blue-600 shadow-xl">✏️</button>
                        <button onClick={() => deleteProduct(p.id)} className="bg-white/90 p-2 rounded-xl text-red-600 shadow-xl">🗑️</button>
                    </div>
                </div>
                <div className="p-5">
                    <h4 className="font-black text-gray-800 truncate">{p.name}</h4>
                    <p className="text-primary font-black text-lg mt-1">{p.price} د.م</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

const SettingsTab: React.FC<{ settings: any, updateSettings: any, products: Product[] }> = ({ settings, updateSettings, products }) => {
    const handleExport = () => {
        const productsHtml = products.map(p => `
            <div class="card">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p class="price">${p.price} MAD</p>
                <p class="desc">${p.description}</p>
                <button>أضف للسلة</button>
            </div>
        `).join('');

        const fullHtml = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>${settings.storeName}</title>
    <style>
        body { font-family: sans-serif; background: #f4f7f6; padding: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        .card { background: white; padding: 20px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; }
        img { width: 100%; height: 200px; object-fit: cover; border-radius: 15px; }
        .price { color: #0f766e; font-weight: 900; font-size: 1.2rem; }
    </style>
    ${settings.facebookPixelId ? `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${settings.facebookPixelId}');fbq('track', 'PageView');</script>` : ''}
</head>
<body>
    <h1>${settings.storeName}</h1>
    <div class="grid">${productsHtml}</div>
</body>
</html>`;
        
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `store_${settings.storeName}.html`;
        a.click();
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-800">إعدادات المتجر الفنية</h2>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
                <h3 className="font-black text-primary border-b pb-4">🌐 النطاق والـ DNS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="اسم النطاق (Domain)" value={settings.domainName} onChange={v => updateSettings({domainName: v})} placeholder="example.ma" />
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-gray-400 uppercase">النم سيرفر (Nameservers)</label>
                        <textarea className="bg-gray-50 p-4 rounded-xl h-24 font-mono text-sm outline-none focus:ring-2 focus:ring-primary" value={settings.nameservers} onChange={e => updateSettings({nameservers: e.target.value})} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
                <h3 className="font-black text-blue-600 border-b pb-4">📊 أكواد التتبع (Pixels)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Facebook Pixel ID" value={settings.facebookPixelId} onChange={v => updateSettings({facebookPixelId: v})} />
                    <InputField label="TikTok Pixel ID" value={settings.tiktokPixelId} onChange={v => updateSettings({tiktokPixelId: v})} />
                    <div className="md:col-span-2">
                        <InputField label="Google Analytics ID" value={settings.googlePixelId} onChange={v => updateSettings({googlePixelId: v})} />
                    </div>
                </div>
            </div>

            <div className="bg-[#0f172a] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-x-32 -translate-y-32"></div>
                <h3 className="text-2xl font-black mb-4">🚀 تصدير المتجر النهائي</h3>
                <p className="text-gray-400 mb-8 max-w-lg">اضغط لتحميل نسخة كاملة من متجرك كملف HTML واحد يحتوي على جميع منتجاتك وإعدادات البيكسل، جاهز للرفع الفوري على استضافتك.</p>
                <button onClick={handleExport} className="bg-primary hover:bg-teal-600 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center gap-3 active:scale-95">
                    📥 تحميل الموقع الآن (HTML)
                </button>
            </div>
        </div>
    );
};

const InputField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
        <input type="text" className="bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-bold" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
);