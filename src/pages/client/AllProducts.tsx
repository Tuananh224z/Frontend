import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import { useCart } from '../../contexts/CartContext';
import {
  LayoutGrid,
  List,
  ShoppingBag,
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';

import type { Product } from '../../types/product';
import type { Brand } from '../../types/brand';
import type { Category } from '../../types/category';
import ProductCard from '../../components/common/ProductCard';

export default function AllProducts() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  // State arrays
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(() => {
    return searchParams.get('brand') || 'all';
  });
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('ratings');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);


  // Price ranges mapping
  const priceRanges = [
    { id: 'under-5', label: 'Dưới 5 triệu', min: 0, max: 5000000 },
    { id: '5-20', label: '5 – 20 triệu', min: 5000000, max: 20000000 },
    { id: '20-50', label: '20 – 50 triệu', min: 20000000, max: 50000000 },
    { id: 'above-50', label: 'Trên 50 triệu', min: 50000000, max: 999999999 }
  ];

  // Sync categorySlug from URL Route Parameter
  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    } else {
      setSelectedCategory('all');
    }
  }, [categorySlug]);

  // Sync brand query parameter from URL
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam) {
      setSelectedBrand(brandParam);
    } else {
      setSelectedBrand('all');
    }
  }, [searchParams]);

  // Load categories & brands once on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          productService.getCategories(),
          productService.getBrands()
        ]);
        const catData = catRes.data?.data || (Array.isArray(catRes.data) ? catRes.data : []);
        const brandData = brandRes.data?.data || (Array.isArray(brandRes.data) ? brandRes.data : []);
        setCategories(catData);
        setBrands(brandData);
      } catch (err) {
        console.error('Lỗi khi tải danh mục/thương hiệu:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    let active = true;

    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, string | number | boolean> = {
          limit: 100 // Load full products as requested
        };

        // 1. Category filter
        if (selectedCategory && selectedCategory !== 'all') {
          params.category = selectedCategory;
        }

        // 2. Brand filter
        if (selectedBrand && selectedBrand !== 'all') {
          params.brand = selectedBrand;
        }

        // 3. Price filter
        if (selectedPriceRange && selectedPriceRange !== 'all') {
          const rangeObj = priceRanges.find(r => r.id === selectedPriceRange);
          if (rangeObj) {
            params.minPrice = rangeObj.min;
            params.maxPrice = rangeObj.max;
          }
        }

        // 4. Search query from URL
        const searchQuery = searchParams.get('search');
        if (searchQuery) {
          params.search = searchQuery;
        }

        // 5. Sorting
        if (sortBy) {
          params.sortBy = sortBy;
        }

        const res = await productService.getProducts(params);
        if (!active) return;

        if (res.data?.products) {
          setProducts(res.data.products);
        } else if (res.data?.data) {
          setProducts(res.data.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        if (!active) return;
        console.error('Lỗi khi tải danh sách sản phẩm:', err);
        setProducts([]);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchFilteredProducts();

    return () => {
      active = false;
    };
  }, [selectedCategory, selectedBrand, selectedPriceRange, sortBy, searchParams]);

  // Helpers


  const activeCategoryObj = categories.find(c => c.slug === selectedCategory || c._id === selectedCategory);
  const breadcrumbCategoryName = activeCategoryObj ? activeCategoryObj.name : '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mb-6 bg-transparent py-2">
          <Link to="/" className="hover:text-red-650 transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          {breadcrumbCategoryName ? (
            <>
              <Link to="/products" className="hover:text-red-650 transition-colors">Tất cả sản phẩm</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-extrabold text-slate-800">{breadcrumbCategoryName}</span>
            </>
          ) : (
            <span className="font-extrabold text-slate-800">Tất cả sản phẩm</span>
          )}
        </nav>

        {/* Layout Wrapper */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 1. Sidebar - Left Filter (Desktop) */}
          <aside className="hidden lg:block w-64 lg:w-72 shrink-0 text-left">
            <div className="bg-white rounded-3xl border border-slate-200/60 p-6 space-y-8 sticky top-28 shadow-xs">
              
              {/* Filter Section Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-red-600" />
                  Bộ lọc
                </h3>
                {(selectedCategory !== 'all' || selectedBrand !== 'all' || selectedPriceRange !== 'all' || searchParams.get('search')) && (
                  <button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                      setSelectedPriceRange('all');
                      setSearchParams({});
                    }}
                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Xoá tất cả
                  </button>
                )}
              </div>

              {/* 1.1 Categories Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Danh mục</h4>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-red-50 text-red-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    Tất cả
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                        selectedCategory === cat.slug || selectedCategory === cat._id
                          ? 'bg-red-50 text-red-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1.2 Brands Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Thương hiệu</h4>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => {
                    const isSelected = selectedBrand === b.slug || selectedBrand === b._id;
                    return (
                      <button
                        key={b._id}
                        onClick={() => {
                          const nextBrand = isSelected ? 'all' : (b.slug || b._id || '');
                          const newParams = new URLSearchParams(searchParams);
                          if (nextBrand === 'all') {
                            newParams.delete('brand');
                          } else {
                            newParams.set('brand', nextBrand);
                          }
                          setSearchParams(newParams);
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 border-red-600 text-red-600'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-500'
                        }`}
                      >
                        {b.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1.3 Price Range Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Khoảng giá</h4>
                <div className="flex flex-col gap-2">
                  {priceRanges.map((range) => {
                    const isSelected = selectedPriceRange === range.id;
                    return (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(isSelected ? 'all' : range.id)}
                        className={`w-full text-left py-1 text-xs font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'text-red-600 font-extrabold'
                            : 'text-slate-600 hover:text-red-600'
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                  {selectedPriceRange !== 'all' && (
                    <button
                      onClick={() => setSelectedPriceRange('all')}
                      className="text-left text-xs font-extrabold text-red-600 hover:underline cursor-pointer mt-2"
                    >
                      Xoá khoảng giá
                    </button>
                  )}
                </div>
              </div>

            </div>
          </aside>

          {/* 2. Main Content Area */}
          <main className="flex-1">
            
            {/* Top Toolbar */}
            <div className="bg-white rounded-3xl border border-slate-200/60 p-4 mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between shadow-xs">
              
              {/* Sort & Filter Toggle (Mobile) */}
              <div className="flex items-center gap-3 justify-between sm:justify-start">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 text-red-600" />
                  Bộ lọc
                </button>

                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold hidden md:inline">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold bg-white text-slate-800 focus:outline-hidden focus:border-red-500 cursor-pointer"
                  >
                    <option value="ratings">Phổ biến nhất</option>
                    <option value="priceAsc">Giá: Thấp đến Cao</option>
                    <option value="priceDesc">Giá: Cao đến Thấp</option>
                    <option value="new">Mới nhất</option>
                  </select>
                </div>
              </div>

              {/* Toolbar Actions (Grid/List & Count) */}
              <div className="flex items-center justify-between sm:justify-end gap-6">
                
                {/* View Switcher */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden p-0.5 bg-slate-50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-700 bg-transparent'
                    }`}
                    title="Hiển thị dạng lưới"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-700 bg-transparent'
                    }`}
                    title="Hiển thị danh sách"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Count */}
                <span className="text-xs font-bold text-slate-500">
                  {isLoading ? 'Đang tìm kiếm...' : `${products.length} sản phẩm`}
                </span>
              </div>
            </div>

            {/* Active search filter banner */}
            {searchParams.get('search') && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-6 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">
                  Đang hiển thị kết quả tìm kiếm cho: <span className="font-extrabold">"{searchParams.get('search')}"</span>
                </span>
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('search');
                    setSearchParams(newParams);
                  }}
                  className="p-1 text-amber-800 hover:bg-amber-100 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Products Render Grid/List */}
            {isLoading ? (
              // Loading Skeleton
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "flex flex-col gap-4"
              }>
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-slate-200/60 p-4 space-y-4 animate-pulse">
                    <div className="bg-slate-200 pt-[70%] rounded-2xl w-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                    </div>
                    <div className="h-8 bg-slate-200 rounded-md w-full"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Không tìm thấy sản phẩm nào</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm của bạn để tìm sản phẩm phù hợp.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setSelectedPriceRange('all');
                    setSearchParams({});
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-full text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              // GRID VIEW
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    product={prod}
                    onAddToCart={addToCart}
                    viewMode="grid"
                  />
                ))}
              </div>
            ) : (
              // LIST VIEW
              <div className="flex flex-col gap-4">
                {products.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    product={prod}
                    onAddToCart={addToCart}
                    viewMode="list"
                  />
                ))}
              </div>
            )}
          </main>

        </div>
      </div>

      {/* 3. Mobile Filter Slide-over Menu */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Sidebar Drawer */}
          <div className="relative w-80 max-w-full bg-white h-full flex flex-col p-6 shadow-2xl animate-in slide-in-from-left duration-300 z-10 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-red-600" />
                Bộ lọc
              </h3>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-2">
              
              {/* Category */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Danh mục</h4>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-red-50 text-red-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Tất cả
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                        selectedCategory === cat.slug || selectedCategory === cat._id
                          ? 'bg-red-50 text-red-600'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Thương hiệu</h4>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => {
                    const isSelected = selectedBrand === b.slug || selectedBrand === b._id;
                    return (
                      <button
                        key={b._id}
                        onClick={() => {
                          const nextBrand = isSelected ? 'all' : (b.slug || b._id || '');
                          const newParams = new URLSearchParams(searchParams);
                          if (nextBrand === 'all') {
                            newParams.delete('brand');
                          } else {
                            newParams.set('brand', nextBrand);
                          }
                          setSearchParams(newParams);
                          setIsMobileFilterOpen(false);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 border-red-600 text-red-600'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {b.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Khoảng giá</h4>
                <div className="flex flex-col gap-2">
                  {priceRanges.map((range) => {
                    const isSelected = selectedPriceRange === range.id;
                    return (
                      <button
                        key={range.id}
                        onClick={() => {
                          setSelectedPriceRange(isSelected ? 'all' : range.id);
                          setIsMobileFilterOpen(false);
                        }}
                        className={`w-full text-left py-1 text-xs font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'text-red-600 font-extrabold'
                            : 'text-slate-600'
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Clear All Button on Mobile */}
            <div className="pt-4 border-t border-slate-100 mt-6">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setSelectedPriceRange('all');
                  setSearchParams({});
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Đặt lại toàn bộ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
