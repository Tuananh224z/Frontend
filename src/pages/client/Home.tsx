import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import chatbotService from '../../services/chatbotService';
import { ShoppingCart, Star, Cpu, HardDrive, Smartphone, ChevronRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
  specs: {
    cpu?: string;
    ram?: string;
    storage?: string;
    screenSize?: string;
  };
  brand?: {
    name: string;
  };
  isFeatured?: boolean;
}

interface Brand {
  _id: string;
  name: string;
  logo?: string;
  logoUrl?: string;
  description?: string;
}

const BACKEND_URL = 'http://localhost:5000';

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [systemSettings, setSystemSettings] = useState<any>(null);

  // Dữ liệu mẫu (fallback) để đảm bảo giao diện luôn hiển thị tuyệt đẹp
  const mockProducts: Product[] = [
    {
      _id: '6a0f2810d604d6c5e101ce5d',
      name: 'ASUS ROG Strix G16 (2024)',
      price: 32990000,
      discountPrice: 36990000,
      images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'],
      slug: 'asus-rog-strix-g16-2024',
      specs: {
        cpu: 'Intel Core i9-13980HX',
        ram: '16GB DDR5',
        storage: '512GB SSD NVMe',
        screenSize: '16 inch FHD+ 165Hz'
      },
      brand: { name: 'ASUS' }
    },
    {
      _id: '6a0f2810d604d6c5e101ce61',
      name: 'MacBook Air M3 13 inch (2024)',
      price: 28990000,
      discountPrice: 32990000,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
      slug: 'macbook-air-m3-13-inch',
      specs: {
        cpu: 'Apple M3 8-core CPU',
        ram: '8GB Unified Memory',
        storage: '256GB SSD',
        screenSize: '13.6 inch Liquid Retina'
      },
      brand: { name: 'Apple' }
    },
    {
      _id: '6a0f2810d604d6c5e101ce5f',
      name: 'Dell XPS 15 9530',
      price: 48990000,
      images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500'],
      slug: 'dell-xps-15-9530',
      specs: {
        cpu: 'Intel Core i7-13700H',
        ram: '16GB DDR5',
        storage: '1TB SSD NVMe',
        screenSize: '15.6 inch OLED 3.5K'
      },
      brand: { name: 'Dell' }
    },
    {
      _id: '6a0f2810d604d6c5e101ce60',
      name: 'Lenovo Legion 5 Pro 16IRX8',
      price: 34990000,
      discountPrice: 38990000,
      images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500'],
      slug: 'lenovo-legion-5-pro-16irx8',
      specs: {
        cpu: 'Intel Core i7-13700HX',
        ram: '16GB DDR5',
        storage: '512GB SSD NVMe',
        screenSize: '16 inch WQXGA 240Hz'
      },
      brand: { name: 'Lenovo' }
    },
    {
      _id: '6a0f2810d604d6c5e101ce5e',
      name: 'MSI Prestige 14 Evo',
      price: 21990000,
      discountPrice: 24990000,
      images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'],
      slug: 'msi-prestige-14-evo',
      specs: {
        cpu: 'Intel Core i5-1240P',
        ram: '16GB LPDDR5',
        storage: '512GB SSD NVMe',
        screenSize: '14 inch FHD+'
      },
      brand: { name: 'MSI' }
    }
  ];

  const mockBrands: Brand[] = [
    { _id: 'b1', name: 'ASUS', description: 'Đỉnh cao gaming và độ bền bỉ.' },
    { _id: 'b2', name: 'Apple', description: 'Đẳng cấp sang trọng, hiệu năng tối ưu.' },
    { _id: 'b3', name: 'Dell', description: 'Bền bỉ, hiệu năng làm việc vượt trội.' },
    { _id: 'b4', name: 'HP', description: 'Thiết kế tinh tế, tin cậy cho doanh nghiệp.' },
    { _id: 'b5', name: 'MSI', description: 'Cỗ máy chiến game thực thụ.' },
    { _id: 'b6', name: 'Lenovo', description: 'Bàn phím hoàn hảo, tối ưu trải nghiệm.' }
  ];

  const getBannerImageUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BACKEND_URL}${cleanPath}`;
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return 'text-purple-400';
    const cat = category.toLowerCase();
    if (cat.includes('game') || cat.includes('đồ họa') || cat.includes('gaming')) return 'text-rose-400';
    if (cat.includes('văn phòng') || cat.includes('sinh viên') || cat.includes('office')) return 'text-emerald-400';
    if (cat.includes('workstation') || cat.includes('creator') || cat.includes('trạm')) return 'text-amber-400';
    return 'text-indigo-400';
  };

  // Fetch dữ liệu từ API Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, brandRes, settingsRes] = await Promise.all([
          productService.getProducts({ limit: 5 }),
          productService.getBrands(),
          chatbotService.getSystemSettings().catch(() => null)
        ]);

        const prodData = prodRes.data?.products || prodRes.data?.data || (Array.isArray(prodRes.data) ? prodRes.data : []);
        if (prodData && prodData.length > 0) {
          setProducts(prodData.slice(0, 5));
        } else {
          setProducts(mockProducts);
        }

        const brandData = brandRes.data?.data || (Array.isArray(brandRes.data) ? brandRes.data : []);
        if (brandData && brandData.length > 0) {
          setBrands(brandData);
        } else {
          setBrands(mockBrands);
        }

        if (settingsRes && settingsRes.data?.status === 'success') {
          setSystemSettings(settingsRes.data.data);
        }
      } catch (err) {
        console.warn('Lỗi kết nối API Backend, đang hiển thị dữ liệu mẫu:', err);
        setProducts(mockProducts);
        setBrands(mockBrands);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  // Tính phần trăm giảm giá (discountPrice là giá cũ, price là giá mới)
  const getDiscountPercent = (price: number, discountPrice: number) => {
    if (discountPrice <= price) return 0;
    return Math.round(((discountPrice - price) / discountPrice) * 100);
  };

  // Định dạng tiền tệ
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Helper lấy URL ảnh của sản phẩm
  const getProductImage = (images: string[]) => {
    if (!images || images.length === 0) return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500';
    const firstImg = images[0];
    if (firstImg.startsWith('http://') || firstImg.startsWith('https://')) return firstImg;
    const cleanPath = firstImg.startsWith('/') ? firstImg : `/${firstImg}`;
    return `${BACKEND_URL}${cleanPath}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* 1. Big Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28 px-6 lg:px-16 rounded-3xl">
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src="/hero_banner.png"
              alt="Hero Laptop Banner"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wider uppercase text-amber-300 bg-amber-400/10 rounded-full border border-amber-300/30">
              <Star className="w-3.5 h-3.5 fill-current" /> Laptop chính hãng 100%
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Đỉnh Cao Hiệu Năng <br />
              <span className="bg-linear-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Vượt Mọi Giới Hạn
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Trải nghiệm các dòng máy tính xách tay cấu hình cực đại thế hệ mới nhất. Nhận tư vấn dòng máy phù hợp nhất bằng Trợ lý AI ở góc phải màn hình của bạn!
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => {
                  document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 text-sm font-bold text-slate-950 bg-linear-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 rounded-xl shadow-lg shadow-amber-300/10 hover:scale-102 transition-all cursor-pointer"
              >
                Mua ngay hôm nay
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

      {/* 2. Three Sub-Category/Promo Banners */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Banner 1: Gaming */}
          <div className="group relative h-48 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
            <img
              src="/gaming_banner.png"
              alt="Laptop Gaming"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/45 to-transparent"></div>
            <div className="absolute bottom-5 left-5 right-5 text-left">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-rose-400">Gaming & Đồ Họa</span>
              <h3 className="text-lg font-bold text-white mt-1">Cấu Hình Chiến Game</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-1">Trang bị GPU RTX thế hệ mới, màn hình tần số quét cực cao.</p>
            </div>
          </div>

          {/* Banner 2: Office */}
          <div className="group relative h-48 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
            <img
              src="/office_banner.png"
              alt="Laptop Văn Phòng"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/45 to-transparent"></div>
            <div className="absolute bottom-5 left-5 right-5 text-left">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-400">Văn Phòng & Sinh Viên</span>
              <h3 className="text-lg font-bold text-white mt-1">Mỏng Nhẹ & Sang Trọng</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-1">Thời lượng pin bền bỉ, màn hình sắc nét siêu mỏng.</p>
            </div>
          </div>

          {/* Banner 3: Creator */}
          <div className="group relative h-48 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
            <img
              src="/workstation_banner.png"
              alt="Laptop Đồ Họa"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/45 to-transparent"></div>
            <div className="absolute bottom-5 left-5 right-5 text-left">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-amber-400">Workstation</span>
              <h3 className="text-lg font-bold text-white mt-1">Sáng Tạo Không Giới Hạn</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-1">Độ phủ màu tuyệt đối 100% sRGB/DCI-P3, CPU đa nhân xử lý mượt mà.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Featured Products (Max 5 products) */}
      <section id="featured-products" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Sản phẩm nổi bật</h2>
            <p className="text-sm text-slate-500 mt-1">Danh sách laptop hàng đầu được khách hàng săn đón nhất</p>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all cursor-pointer">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
                <div className="bg-slate-200 h-40 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                </div>
                <div className="h-6 bg-slate-200 rounded-md w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((prod) => {
              const hasDiscount = prod.discountPrice ? prod.discountPrice > prod.price : false;

              return (
                <div
                  key={prod._id}
                  className="flex flex-col bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Product Image & Badge */}
                  <Link
                    to={`/product/${prod.slug}`}
                    className="relative block pt-[75%] bg-slate-100 overflow-hidden shrink-0"
                  >
                    <img
                      src={getProductImage(prod.images)}
                      alt={prod.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {hasDiscount && (
                      <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-extrabold text-white bg-rose-500 rounded-lg">
                        -{getDiscountPercent(prod.price, prod.discountPrice!)}%
                      </span>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {prod.brand?.name || 'Laptop'}
                      </span>
                      <Link to={`/product/${prod.slug}`} className="block">
                        <h4 className="font-bold text-sm text-slate-800 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
                          {prod.name}
                        </h4>
                      </Link>
                    </div>

                    {/* Tech specs info */}
                    <div className="space-y-1.5 py-2 border-y border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Cpu className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="line-clamp-1">{prod.specs?.cpu || 'Thiết bị phụ kiện'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <HardDrive className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="line-clamp-1">
                          {prod.specs ? `${prod.specs.ram || 'N/A'} | ${prod.specs.storage || 'N/A'}` : 'Chính hãng'}
                        </span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline flex-wrap gap-1.5 pt-1">
                      <span className="font-extrabold text-sm text-rose-500">
                        {formatPrice(prod.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatPrice(prod.discountPrice!)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart button */}
                    <button 
                      onClick={() => addToCart(prod)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-xl transition-all duration-300 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Thêm giỏ hàng</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Featured Brands Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Thương hiệu nổi bật</h2>
          <p className="text-sm text-slate-500 mt-1">Các hãng laptop uy tín thế giới được phân phối chính hãng</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {brands.slice(0, 5).map((brand) => (
            <div
              key={brand._id}
              className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              {/* Brand Logo */}
              <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center mb-3 group-hover:border-indigo-500/30 transition-all duration-300">
                {brand.logo ? (
                  <img
                    src={brand.logo.startsWith('http') ? brand.logo : `${BACKEND_URL}${brand.logo}`}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-600 group-hover:text-indigo-600">
                    <Smartphone className="w-6 h-6" />
                  </div>
                )}
              </div>
              <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">
                {brand.name}
              </h4>
              <p className="text-[10px] text-slate-400 text-center line-clamp-1 mt-1">
                {brand.description || 'Chính hãng'}
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
