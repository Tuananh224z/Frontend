import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ChevronDown, X, ChevronLeft, ChevronRight, LayoutGrid, List, ShoppingCart, Heart, Eye, ShoppingBag } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockProducts = [
  { id: 1,  name: 'Laptop ASUS ROG Strix G15 Ryzen 9 RTX 4080',      sku: 'ROG-G15',    brand: 'ASUS',    category: 'laptop',    price: 59990000, oldPrice: 67990000, rating: 4.8, reviews: 247, views: 3420, purchases: 125, desc: 'AMD Ryzen 9 7945HX, 32GB DDR5, RTX 4080, QHD+ 240Hz. Đỉnh cao gaming.',     img: 'https://placehold.co/300x220/1a1a2e/white?text=ROG+G15',    inStock: true },
  { id: 2,  name: 'Laptop Dell XPS 15 i7-13700H RTX 4060',            sku: 'XPS-15',     brand: 'Dell',    category: 'laptop',    price: 47990000, oldPrice: 52990000, rating: 4.7, reviews: 183, views: 2810, purchases: 98,  desc: 'Intel Core i7-13700H, 16GB DDR5, RTX 4060, OLED 3.5K. Siêu đẹp.',     img: 'https://placehold.co/300x220/16213e/white?text=Dell+XPS',   inStock: true },
  { id: 3,  name: 'Laptop MacBook Pro M3 Pro 16 inch',                 sku: 'MBP-M3',     brand: 'Apple',   category: 'laptop',    price: 69990000, oldPrice: null,     rating: 4.9, reviews: 312, views: 5600, purchases: 210, desc: 'Apple M3 Pro, 18GB RAM, 512GB SSD, Liquid Retina XDR. Đỉnh.',           img: 'https://placehold.co/300x220/1d1d1d/white?text=MacBook',    inStock: true },
  { id: 4,  name: 'PC Gaming ASUS ROG Strix G35CA i9-13900K',          sku: 'ROG-G35',    brand: 'ASUS',    category: 'pc',        price: 55990000, oldPrice: 61990000, rating: 4.6, reviews: 98,  views: 1540, purchases: 45,  desc: 'Core i9-13900K, 32GB RAM, RTX 4080, 1TB NVMe. Hiệu năng đỉnh cao.',  img: 'https://placehold.co/300x220/0f3460/white?text=ROG+PC',     inStock: true },
  { id: 5,  name: 'Màn hình LG 27" 4K UltraFine IPS 144Hz',           sku: 'LG-27UP',    brand: 'LG',      category: 'monitor',   price: 18990000, oldPrice: 21990000, rating: 4.7, reviews: 156, views: 2300, purchases: 189, desc: '27 inch, 4K UHD, IPS, 144Hz, HDR600. Màu sắc chuẩn.',              img: 'https://placehold.co/300x220/533483/white?text=LG+4K',      inStock: true },
  { id: 6,  name: 'Màn hình Samsung Odyssey G7 27" QHD 240Hz',         sku: 'SAM-G7',     brand: 'Samsung', category: 'monitor',   price: 15990000, oldPrice: 18990000, rating: 4.5, reviews: 201, views: 1880, purchases: 134, desc: '27 inch, QHD 1440p, 240Hz, 1ms, QLED. Gaming đỉnh.',              img: 'https://placehold.co/300x220/1b262c/white?text=Odyssey',    inStock: false },
  { id: 7,  name: 'Chuột Logitech G Pro X Superlight 2',               sku: 'LGT-GPX2',   brand: 'Logitech',category: 'peripheral', price: 2790000,  oldPrice: 3290000,  rating: 4.9, reviews: 421, views: 6700, purchases: 380, desc: '60g siêu nhẹ, Hero 25K sensor, không dây 2.4GHz. Chuẩn pro.',       img: 'https://placehold.co/300x220/2d2d2d/white?text=G+Pro',      inStock: true },
  { id: 8,  name: 'Bàn phím cơ Keychron Q1 Pro QMK',                   sku: 'KC-Q1PRO',   brand: 'Keychron',category: 'peripheral', price: 3490000,  oldPrice: null,     rating: 4.8, reviews: 178, views: 2400, purchases: 156, desc: 'QMK/VIA, Gasket mount, Knob, South-facing RGB. Build chắc.',       img: 'https://placehold.co/300x220/354259/white?text=Keychron',   inStock: true },
  { id: 9,  name: 'SSD Samsung 990 Pro 2TB NVMe PCIe 4.0',             sku: 'SAM-990P2T', brand: 'Samsung', category: 'storage',   price: 3190000,  oldPrice: 3890000,  rating: 4.9, reviews: 534, views: 8900, purchases: 670, desc: 'Read 7430 MB/s, Write 6900 MB/s. Nhanh nhất Gen4.',               img: 'https://placehold.co/300x220/1c1c1c/white?text=990+Pro',    inStock: true },
  { id: 10, name: 'RAM Corsair Vengeance DDR5 32GB 6000MHz',            sku: 'COR-V32G6',  brand: 'Corsair', category: 'component', price: 2390000,  oldPrice: 2790000,  rating: 4.7, reviews: 267, views: 3100, purchases: 245, desc: '2x16GB DDR5, 6000MHz CL36, RGB, Intel XMP 3.0.',                img: 'https://placehold.co/300x220/22223a/white?text=Corsair',    inStock: true },
  { id: 11, name: 'Laptop Lenovo ThinkPad X1 Carbon i7 vPro',          sku: 'TP-X1C',     brand: 'Lenovo',  category: 'laptop',    price: 42990000, oldPrice: 48990000, rating: 4.6, reviews: 145, views: 1960, purchases: 89,  desc: 'Core i7 vPro, 16GB, 512GB, 14" IPS. Doanh nhân cao cấp.',         img: 'https://placehold.co/300x220/2a2a2a/white?text=ThinkPad',   inStock: true },
  { id: 12, name: 'Tai nghe Sony WH-1000XM5 Chống ồn ANC',             sku: 'SNY-XM5',    brand: 'Sony',    category: 'peripheral', price: 7990000,  oldPrice: 9490000,  rating: 4.8, reviews: 389, views: 5400, purchases: 312, desc: 'ANC class-leading, 30h pin, Multipoint, LDAC Hi-Res Audio.',   img: 'https://placehold.co/300x220/1a1a2e/white?text=WH-1000XM5', inStock: false },
];

const brands    = ['ASUS', 'Dell', 'Apple', 'LG', 'Samsung', 'Logitech', 'Keychron', 'Corsair', 'Lenovo', 'Sony'];
const categories = [
  { id: 'all',        label: 'Tất cả' },
  { id: 'laptop',     label: 'Laptop' },
  { id: 'pc',         label: 'PC Gaming' },
  { id: 'monitor',    label: 'Màn hình' },
  { id: 'peripheral', label: 'Phụ kiện' },
  { id: 'storage',    label: 'Ổ cứng / SSD' },
  { id: 'component',  label: 'Linh kiện' },
];
const sortOptions = [
  { id: 'popular',   label: 'Phổ biến nhất' },
  { id: 'newest',    label: 'Mới nhất' },
  { id: 'price_asc', label: 'Giá tăng dần' },
  { id: 'price_desc',label: 'Giá giảm dần' },
  { id: 'rating',    label: 'Đánh giá cao' },
];

// ─── Product Card (Home-style) ──────────────────────────────────────────────
const ProductCard = ({ p, listView }: { p: typeof mockProducts[0]; listView: boolean }) => {
  const [wished, setWished] = useState(false);
  const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

  if (listView) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex gap-4 p-4 hover:shadow-md transition-shadow group relative">
        <div className="relative shrink-0 w-32 h-28 bg-white flex items-center justify-center rounded-xl border border-gray-100 overflow-hidden">
          {discount > 0 && (
            <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">-{discount}%</span>
          )}
          <img src={p.img} alt={p.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="text-xs text-gray-500 mb-0.5">SKU: {p.sku}</div>
            <Link to={`/product/${p.id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 text-sm">{p.name}</h3>
            </Link>
            <p className="text-xs text-gray-500 line-clamp-1 mt-1">{p.desc}</p>
            <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1.5">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-medium">{p.rating}</span>
                <span className="text-gray-400">({p.reviews})</span>
              </div>
              <div className="flex items-center gap-1"><Eye className="w-3 h-3" /><span>{p.views}</span></div>
              <div className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" /><span>Đã bán {p.purchases}</span></div>
              {!p.inStock && <span className="text-red-500 font-medium">Hết hàng</span>}
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div className="flex flex-col">
              <span className="text-primary-600 font-bold text-base leading-tight">{p.price.toLocaleString('vi-VN')}₫</span>
              {p.oldPrice && <span className="text-gray-400 text-xs line-through">{p.oldPrice.toLocaleString('vi-VN')}₫</span>}
            </div>
            <button disabled={!p.inStock} title="Thêm vào giỏ hàng" className="bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white disabled:opacity-40 p-2.5 rounded-xl transition-colors shadow-sm border border-primary-100">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
        <button onClick={() => setWished(v => !v)} className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 shadow-sm transition-all opacity-0 group-hover:opacity-100 ${wished ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
          <Heart className={`w-4 h-4 ${wished ? 'fill-red-500' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 group relative flex flex-col">
      <button onClick={() => setWished(v => !v)} className={`absolute top-3 right-3 z-30 p-2 rounded-full shadow-sm bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 ${wished ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
        <Heart className={`w-5 h-5 ${wished ? 'fill-red-500' : ''}`} />
      </button>

      <div className="relative overflow-hidden aspect-[4/3] p-6 bg-white flex items-center justify-center">
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          {discount > 0 ? `-${discount}%` : p.inStock ? 'Hot' : 'Hết'}
        </span>
        {!p.inStock && (
          <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full">Hết hàng</span>
          </div>
        )}
        <img src={p.img} alt={p.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
      </div>

      <div className="p-4 border-t border-gray-50 flex-grow flex flex-col">
        <div className="text-xs text-gray-500 mb-1">SKU: {p.sku}</div>
        <Link to={`/product/${p.id}`} className="block">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-primary-600 transition-colors">{p.name}</h3>
        </Link>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{p.desc}</p>

        <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-3">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="font-medium">{p.rating}</span>
            <span className="text-gray-400">({p.reviews})</span>
          </div>
          <div className="flex items-center gap-1"><Eye className="w-3 h-3" /><span>{p.views}</span></div>
          <div className="flex items-center gap-1 truncate"><ShoppingBag className="w-3 h-3 shrink-0" /><span className="truncate">Đã bán {p.purchases}</span></div>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-primary-600 font-bold text-lg leading-tight">{p.price.toLocaleString('vi-VN')}₫</span>
            {p.oldPrice && <span className="text-gray-400 text-sm line-through decoration-gray-300">{p.oldPrice.toLocaleString('vi-VN')}₫</span>}
          </div>
          <button disabled={!p.inStock} title="Thêm vào giỏ hàng" className="bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white disabled:opacity-40 p-2.5 rounded-xl transition-colors self-end shadow-sm border border-primary-100">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Products = () => {
  const [search, setSearch]             = useState('');
  const [activeCategory, setCategory]   = useState('all');
  const [selectedBrands, setBrands]     = useState<string[]>([]);
  const [priceRange, setPriceRange]     = useState([0, 100000000]);
  const [sortBy, setSortBy]             = useState('popular');
  const [showFilter, setShowFilter]     = useState(false);
  const [listView, setListView]         = useState(false);
  const [page, setPage]                 = useState(1);
  const perPage = 8;

  const toggleBrand = (b: string) =>
    setBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);

  const clearFilters = () => {
    setCategory('all');
    setBrands([]);
    setPriceRange([0, 100000000]);
    setSearch('');
  };

  const filtered = mockProducts
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc')  return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating')     return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);
  const activeFilterCount = (activeCategory !== 'all' ? 1 : 0) + selectedBrands.length;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Danh mục</h3>
        <ul className="space-y-1.5">
          {categories.map(c => (
            <li key={c.id}>
              <button
                onClick={() => { setCategory(c.id); setPage(1); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${activeCategory === c.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Thương hiệu</h3>
        <div className="flex flex-wrap gap-2">
          {brands.map(b => (
            <button
              key={b}
              onClick={() => { toggleBrand(b); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${selectedBrands.includes(b) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Khoảng giá</h3>
        <div className="space-y-2">
          {[
            [0, 5000000, 'Dưới 5 triệu'],
            [5000000, 20000000, '5 – 20 triệu'],
            [20000000, 50000000, '20 – 50 triệu'],
            [50000000, 100000000, 'Trên 50 triệu'],
          ].map(([min, max, label]) => (
            <button
              key={String(label)}
              onClick={() => { setPriceRange([min as number, max as number]); setPage(1); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${priceRange[0] === min && priceRange[1] === max ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {label as string}
            </button>
          ))}
          <button onClick={() => setPriceRange([0, 100000000])} className="text-xs text-primary-600 hover:underline pl-3">
            Xoá khoảng giá
          </button>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearFilters} className="w-full flex items-center justify-center gap-1.5 text-sm text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-xl py-2 transition-colors">
          <X className="w-4 h-4" /> Xoá tất cả bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-[1200px] mx-auto px-4 pt-6">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 flex items-center gap-1 mb-5">
          <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Tất cả sản phẩm</span>
        </nav>

        <div className="flex gap-6">
          {/* ── Sidebar Filter (desktop) ────────────────────────────────── */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Bộ lọc</h2>
                {activeFilterCount > 0 && (
                  <span className="text-xs bg-primary-600 text-white font-bold px-2 py-0.5 rounded-full">{activeFilterCount}</span>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* ── Main Content ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3 mb-5 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[160px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Tìm trong danh sách..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Mobile filter button */}
              <button onClick={() => setShowFilter(true)} className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl px-3 py-2">
                <SlidersHorizontal className="w-4 h-4" />
                Lọc
                {activeFilterCount > 0 && <span className="bg-primary-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none border border-gray-200 rounded-xl text-sm px-3 py-2 pr-8 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-700 font-medium cursor-pointer"
                >
                  {sortOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View toggle */}
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setListView(false)} className={`p-2 transition-colors ${!listView ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setListView(true)} className={`p-2 transition-colors ${listView ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-gray-500 ml-auto">{filtered.length} sản phẩm</span>
            </div>

            {/* Grid / List */}
            {paginated.length > 0 ? (
              <div className={listView ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'}>
                {paginated.map(p => <ProductCard key={p.id} p={p} listView={listView} />)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Không tìm thấy sản phẩm phù hợp</p>
                <button onClick={clearFilters} className="mt-3 text-sm text-primary-600 hover:underline">Xoá bộ lọc</button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)} className={`w-9 h-9 rounded-xl border text-sm font-semibold transition-colors ${n === page ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
          <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-5 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-lg">Bộ lọc</h2>
              <button onClick={() => setShowFilter(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel />
            <button onClick={() => setShowFilter(false)} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl mt-6 transition-colors">
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
