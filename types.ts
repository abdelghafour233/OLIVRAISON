export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'electronics' | 'home' | 'cars';
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  city: string;
  phone: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface StoreSettings {
  storeName: string;
  facebookPixelId: string;
  googlePixelId: string;
  tiktokPixelId: string;
  googleSheetsUrl: string; // Webhook URL for automation
  customHeadJs: string;
  customBodyJs: string;
  domainName: string; 
  nameservers: string;
}

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: "متجر النخبة",
  facebookPixelId: "",
  googlePixelId: "",
  tiktokPixelId: "",
  googleSheetsUrl: "",
  customHeadJs: "",
  customBodyJs: "",
  domainName: "www.elitestore.ma",
  nameservers: "ns1.hosting.com\nns2.hosting.com"
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'سماعات بلوتوث احترافية',
    price: 450,
    category: 'electronics',
    image: 'https://picsum.photos/400/400?random=1',
    description: 'سماعات عالية الجودة مع عزل ضوضاء وبطارية تدوم طويلاً.'
  },
  {
    id: '2',
    name: 'خلاط مطبخ متعدد الوظائف',
    price: 800,
    category: 'home',
    image: 'https://picsum.photos/400/400?random=2',
    description: 'خلاط قوي لتحضير العصائر والأطعمة بسرعة وسهولة.'
  },
  {
    id: '3',
    name: 'مكنسة كهربائية ذكية',
    price: 2500,
    category: 'home',
    image: 'https://picsum.photos/400/400?random=3',
    description: 'تنظيف آلي للمنزل مع مستشعرات ذكية لتجنب العقبات.'
  },
  {
    id: '4',
    name: 'اكسسوارات سيارة داخلية فاخرة',
    price: 300,
    category: 'cars',
    image: 'https://picsum.photos/400/400?random=4',
    description: 'مجموعة أغطية مقاعد واكسسوارات تزيد من فخامة سيارتك.'
  },
  {
    id: '5',
    name: 'ساعة ذكية رياضية',
    price: 650,
    category: 'electronics',
    image: 'https://picsum.photos/400/400?random=5',
    description: 'تتبع نشاطك الرياضي ونبضات القلب بدقة عالية.'
  }
];