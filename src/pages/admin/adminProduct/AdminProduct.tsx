import React, { useState, useEffect } from 'react';
import productService from '../../../services/productService';
import {
  Laptop,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Sparkles,
  Filter,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  ArrowLeft,
  Star,
  Flame,
  Zap,
} from 'lucide-react';

// Helper to convert legacy spec object to specGroups structure for backward compatibility
const convertSpecsToGroups = (specs: any) => {
  if (!specs) return [];
  const items: any[] = [];
  if (specs.cpu) items.push({ key: 'CPU', value: specs.cpu });
  if (specs.ram) items.push({ key: 'RAM', value: specs.ram });
  if (specs.storage) items.push({ key: 'Ổ cứng', value: specs.storage });
  if (specs.vga) items.push({ key: 'Card đồ họa', value: specs.vga });
  if (specs.screenSize) items.push({ key: 'Màn hình', value: specs.screenSize });
  if (specs.battery) items.push({ key: 'Pin', value: specs.battery });
  if (specs.weight) items.push({ key: 'Trọng lượng (kg)', value: String(specs.weight) });
  if (specs.os) items.push({ key: 'Hệ điều hành', value: specs.os });

  if (items.length > 0) {
    return [{ name: 'Cấu hình chi tiết', items }];
  }
  return [];
};

export default function AdminProduct() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 8;

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form View States
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Product Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState<string | number>('');
  const [discountPrice, setDiscountPrice] = useState<string | number>('');
  const [stock, setStock] = useState<string | number>('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string | number>('');
  const [summary, setSummary] = useState('');
  const [tagsString, setTagsString] = useState('');

  // Badges
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isHot, setIsHot] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Dynamic Specs State
  const [specGroups, setSpecGroups] = useState<any[]>([]);

  // Image Uploading State
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchFilters = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        productService.getCategories(true),
        productService.getBrands(true),
      ]);
      if (catRes.data?.status === 'success') setCategories(catRes.data.data);
      if (brandRes.data?.status === 'success') setBrands(brandRes.data.data);
    } catch (err) {
      console.error('Lỗi tải danh mục/thương hiệu:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError('');

      const params: Record<string, string | number | boolean> = {
        page,
        limit,
        showAll: true,
      };

      if (search) params.search = search;
      if (selectedCatFilter) params.category = selectedCatFilter;
      if (selectedBrandFilter) params.brand = selectedBrandFilter;

      const response = await productService.getProducts(params);
      if (response.data?.status === 'success') {
        const targetData = response.data.data || response.data;
        const { products: pList, pages, total } = targetData;
        setProducts(pList || []);
        setTotalPages(pages || 1);
        setTotalProducts(total || 0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCatFilter, selectedBrandFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setName('');
    setSku('');
    setSlug('');
    setPrice('');
    setDiscountPrice('');
    setStock('');
    setCategory(categories[0]?._id || '');
    setBrand(brands[0]?._id || '');
    setShortDesc('');
    setDescription('');
    setImages([]);
    setSortOrder('');
    setSummary('');
    setTagsString('');
    setIsBestSeller(false);
    setIsNewArrival(false);
    setIsFeatured(false);
    setIsHot(false);
    setIsActive(true);

    // Initial spec group with common specs
    setSpecGroups([
      {
        name: 'Bộ xử lý (CPU)',
        items: [{ key: 'CPU', value: '' }],
      },
      {
        name: 'Bộ nhớ & Lưu trữ',
        items: [
          { key: 'RAM', value: '' },
          { key: 'Ổ cứng', value: '' },
        ],
      },
    ]);

    setViewMode('add');
    setError('');
    setSuccess('');
  };

  const handleOpenEditModal = (product: any) => {
    setSelectedProduct(product);
    setName(product.name);
    setSku(product.sku || '');
    setSlug(product.slug);
    setPrice(product.price !== undefined ? product.price : '');
    setDiscountPrice(product.discountPrice || '');
    setStock(product.stock !== undefined ? product.stock : '');
    setCategory(product.category?._id || product.category || '');
    setBrand(product.brand?._id || product.brand || '');
    setShortDesc(product.shortDesc || '');
    setDescription(product.description || '');
    setImages(product.images || []);
    setSortOrder(product.sortOrder !== undefined ? product.sortOrder : '');
    setSummary(product.summary || '');
    setTagsString(product.tags ? product.tags.join(', ') : '');
    setIsBestSeller(product.isBestSeller || false);
    setIsNewArrival(product.isNewArrival || false);
    setIsFeatured(product.isFeatured || false);
    setIsHot(product.isHot || false);
    setIsActive(product.isActive !== false);

    // Dynamic Specs
    if (product.specGroups && product.specGroups.length > 0) {
      setSpecGroups(product.specGroups);
    } else {
      const groups = convertSpecsToGroups(product.specs);
      setSpecGroups(
        groups.length > 0
          ? groups
          : [
              {
                name: 'Cấu hình chi tiết',
                items: [{ key: '', value: '' }],
              },
            ]
      );
    }

    setViewMode('edit');
    setError('');
    setSuccess('');
  };

  // Drag & drop / click upload images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: FileList | null = null;
    if ('dataTransfer' in e) {
      e.preventDefault();
      files = e.dataTransfer.files;
    } else if ('target' in e) {
      files = e.target.files;
    }
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      setIsUploading(true);
      setError('');
      const response = await productService.uploadImage(formData);
      if (response.data?.status === 'success') {
        const uploadedUrls = response.data.urls || response.data.data;
        if (uploadedUrls) {
          setImages((prev) => [...prev, ...uploadedUrls]);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Tải ảnh lên thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove Vietnamese diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generatedSlug);
  };

  // Specs groups actions
  const handleAddGroup = () => {
    setSpecGroups([...specGroups, { name: '', items: [{ key: '', value: '' }] }]);
  };

  const handleUpdateGroupName = (gIdx: number, val: string) => {
    const updated = [...specGroups];
    updated[gIdx].name = val;
    setSpecGroups(updated);
  };

  const handleRemoveGroup = (gIdx: number) => {
    setSpecGroups(specGroups.filter((_, idx) => idx !== gIdx));
  };

  const handleAddItem = (gIdx: number) => {
    const updated = [...specGroups];
    updated[gIdx].items.push({ key: '', value: '' });
    setSpecGroups(updated);
  };

  const handleUpdateItem = (gIdx: number, iIdx: number, field: 'key' | 'value', val: string) => {
    const updated = [...specGroups];
    updated[gIdx].items[iIdx][field] = val;
    setSpecGroups(updated);
  };

  const handleRemoveItem = (gIdx: number, iIdx: number) => {
    const updated = [...specGroups];
    updated[gIdx].items = updated[gIdx].items.filter((_: any, idx: number) => idx !== iIdx);
    setSpecGroups(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !brand) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      // Build legacy specs mapping from specGroups to keep existing frontend pages working
      const legacySpecs: any = {
        cpu: '',
        ram: '',
        storage: '',
        vga: '',
        screenSize: '',
        battery: '',
        weight: 0,
        os: 'Windows 11',
      };

      specGroups.forEach((g: any) => {
        g.items.forEach((item: any) => {
          const k = item.key.toLowerCase().trim();
          if (k.includes('cpu') || k.includes('bộ vi xử lý')) legacySpecs.cpu = item.value;
          else if (k === 'ram') legacySpecs.ram = item.value;
          else if (k.includes('ổ cứng') || k.includes('ssd') || k.includes('hdd') || k.includes('dung lượng')) legacySpecs.storage = item.value;
          else if (k.includes('card') || k.includes('vga') || k.includes('đồ họa')) legacySpecs.vga = item.value;
          else if (k.includes('màn hình') || k.includes('kích thước màn')) legacySpecs.screenSize = item.value;
          else if (k.includes('pin') || k.includes('battery')) legacySpecs.battery = item.value;
          else if (k.includes('trọng lượng') || k.includes('cân nặng')) {
            const w = parseFloat(item.value);
            if (!isNaN(w)) legacySpecs.weight = w;
          } else if (k.includes('hệ điều hành') || k === 'os') legacySpecs.os = item.value;
        });
      });

      const parsedTags = tagsString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        name,
        sku,
        slug: slug || undefined,
        price: price === '' ? 0 : Number(price),
        discountPrice: discountPrice === '' ? 0 : Number(discountPrice),
        stock: stock === '' ? 0 : Number(stock),
        category,
        brand,
        shortDesc,
        description,
        images,
        sortOrder: sortOrder === '' ? 0 : Number(sortOrder),
        summary,
        isFeatured,
        isBestSeller,
        isNewArrival,
        isHot,
        isActive,
        tags: parsedTags,
        specGroups,
        specs: legacySpecs, // Keep legacy specs updated
      };

      if (selectedProduct) {
        // Edit Product
        const response = await productService.updateProduct(selectedProduct._id, payload);
        if (response.data?.status === 'success') {
          setSuccess('Cập nhật sản phẩm thành công!');
        }
      } else {
        // Create Product
        const response = await productService.createProduct(payload);
        if (response.data?.status === 'success') {
          setSuccess('Thêm sản phẩm mới thành công!');
        }
      }

      setViewMode('list');
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lưu sản phẩm thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      return;
    }
    try {
      setError('');
      setSuccess('');
      const response = await productService.deleteProduct(id);
      if (response.data?.status === 'success') {
        setSuccess('Xóa sản phẩm thành công!');
        fetchProducts();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Xóa sản phẩm thất bại');
    }
  };

  const toggleStatus = async (product: any) => {
    try {
      setError('');
      setSuccess('');
      const response = await productService.updateProduct(product._id, {
        ...product,
        isActive: !product.isActive,
      });
      if (response.data?.status === 'success') {
        setSuccess(`Đã ${!product.isActive ? 'hiển thị' : 'ẩn'} sản phẩm thành công!`);
        fetchProducts();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Render add/edit form view
  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl text-slate-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-xl font-extrabold text-white">
                {viewMode === 'add' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
              </h3>
              <p className="text-xs font-semibold text-slate-450 mt-0.5">Điền thông tin chi tiết sản phẩm laptop</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-5 py-2.5 bg-slate-900 border border-slate-805 border-slate-800 hover:bg-slate-850 hover:text-slate-200 text-slate-350 font-extrabold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs transition-colors border-0 shadow-lg shadow-red-550/15 flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lưu sản phẩm'}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-950/20 text-red-400 text-sm font-semibold rounded-xl border border-red-900 animate-in fade-in duration-200">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 2-Column Grid */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Basic Info, Images, Specifications) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card 1: Thông tin cơ bản */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
              <h4 className="text-base font-extrabold text-white border-b border-slate-800/80 pb-3">Thông tin cơ bản</h4>

              {/* Tên sản phẩm */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Nhập tên sản phẩm..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
                />
              </div>

              {/* SKU & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Ví dụ: ROG-G15"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Ví dụ: rog-g15"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
                  />
                </div>
              </div>

              {/* Price, DiscountPrice, Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Giá mới / Giá bán (VNĐ) *</label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => {
                      const val = e.target.value;
                      const cleaned = val.replace(/\D/g, '');
                      setPrice(cleaned);
                    }}
                    placeholder="Nhập giá bán..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-855 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Giá cũ (VNĐ)</label>
                  <input
                    type="text"
                    value={discountPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      const cleaned = val.replace(/\D/g, '');
                      setDiscountPrice(cleaned);
                    }}
                    placeholder="Nhập giá cũ..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Số lượng kho *</label>
                  <input
                    type="text"
                    required
                    value={stock}
                    onChange={(e) => {
                      const val = e.target.value;
                      const cleaned = val.replace(/\D/g, '');
                      setStock(cleaned);
                    }}
                    placeholder="Nhập số lượng..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
                  />
                </div>
              </div>

              {/* Hiển thị & Thứ tự */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hiển thị</label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-400"
                  >
                    <option value="true">Đang hiển thị (Bán)</option>
                    <option value="false">Ẩn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Thứ tự</label>
                  <input
                    type="text"
                    value={sortOrder}
                    onChange={(e) => {
                      const val = e.target.value;
                      let cleaned = val.replace(/[^\d-]/g, '');
                      if (cleaned.startsWith('-')) {
                        cleaned = '-' + cleaned.slice(1).replace(/-/g, '');
                      } else {
                        cleaned = cleaned.replace(/-/g, '');
                      }
                      setSortOrder(cleaned);
                    }}
                    placeholder="Nhập thứ tự..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
                  />
                </div>
              </div>

              {/* Mô tả ngắn */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Hiển thị ở trang danh sách..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200 resize-none"
                />
              </div>

              {/* Mô tả chi tiết */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mô tả chi tiết</label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả đầy đủ..."
                  className="w-full px-4 py-2.5 bg-slate-955 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200 resize-none"
                />
              </div>
            </div>

            {/* Card 2: Hình ảnh sản phẩm */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
              <h4 className="text-base font-extrabold text-white border-b border-slate-800/80 pb-3">Hình ảnh sản phẩm</h4>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleImageUpload}
                className="flex flex-col items-center justify-center gap-3 p-8 bg-slate-950 border border-dashed border-slate-800 rounded-xl transition-all hover:border-purple-500/50"
              >
                <Upload className="w-8 h-8 text-slate-450 shrink-0" />
                <div className="text-center">
                  <span className="text-sm font-bold text-slate-200 block">
                    Kéo thả hoặc{' '}
                    <label className="text-red-500 hover:text-red-400 cursor-pointer underline inline">
                      chọn file
                      <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </span>
                  <span className="text-xs text-slate-455 font-bold block mt-1 text-slate-400">
                    PNG, JPG, WEBP — tối đa 5MB/ảnh, 10 ảnh
                  </span>
                </div>
                {isUploading && <Loader2 className="w-5 h-5 animate-spin text-purple-500 mt-1" />}
              </div>

              {/* Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square bg-slate-950 border border-slate-850 rounded-xl overflow-hidden group p-1.5 flex items-center justify-center"
                    >
                      <img
                        src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                        alt="preview"
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-red-600/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity border-0 cursor-pointer rounded-xl"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Card 3: Thông số kỹ thuật */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-extrabold text-white">Thông số kỹ thuật</h4>
                <button
                  type="button"
                  onClick={handleAddGroup}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-extrabold rounded-lg text-xs transition-colors cursor-pointer border-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm nhóm</span>
                </button>
              </div>

              {/* Specs Groups */}
              {specGroups.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs font-semibold">
                  Chưa có thông số kỹ thuật nào. Bấm "Thêm nhóm" để bắt đầu.
                </div>
              ) : (
                <div className="space-y-4">
                  {specGroups.map((group, gIdx) => (
                    <div key={gIdx} className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
                      {/* Group Header */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 border-b border-slate-800/80">
                        <input
                          type="text"
                          required
                          value={group.name}
                          onChange={(e) => handleUpdateGroupName(gIdx, e.target.value)}
                          placeholder="Tên nhóm (VD: Bộ xử lý, Màn hình)"
                          className="flex-1 bg-transparent border-0 focus:outline-hidden text-sm font-bold text-white placeholder:text-slate-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGroup(gIdx)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                          title="Xóa nhóm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Group Items */}
                      <div className="p-4 space-y-3">
                        {group.items.map((item: any, iIdx: number) => (
                          <div key={iIdx} className="flex items-center gap-3">
                            <input
                              type="text"
                              required
                              value={item.key}
                              onChange={(e) => handleUpdateItem(gIdx, iIdx, 'key', e.target.value)}
                              placeholder="Tên thông số (VD: Hãng CPU)"
                              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                            />
                            <input
                              type="text"
                              required
                              value={item.value}
                              onChange={(e) => handleUpdateItem(gIdx, iIdx, 'value', e.target.value)}
                              placeholder="Giá trị (VD: Intel Core i7)"
                              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(gIdx, iIdx)}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                              title="Xóa thông số"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {/* Add Item Button */}
                        <button
                          type="button"
                          onClick={() => handleAddItem(gIdx)}
                          className="text-xs font-extrabold text-red-500 hover:text-red-400 flex items-center gap-1 mt-1 border-0 bg-transparent cursor-pointer animate-pulse"
                        >
                          + Thêm thông số
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Categorization, Summary) */}
          <div className="space-y-6">
            {/* Card 4: Phân loại */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
              <h4 className="text-base font-extrabold text-white border-b border-slate-800/80 pb-3">Phân loại</h4>

              {/* Danh mục */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Danh mục *</label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-405 text-slate-400"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Thương hiệu */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Thương hiệu *</label>
                <select
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-855 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-405 text-slate-400"
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map((br) => (
                    <option key={br._id} value={br._id}>
                      {br.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nhãn sản phẩm */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nhãn sản phẩm</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      id: 'isBestSeller',
                      label: 'Bán chạy',
                      icon: Flame,
                      checked: isBestSeller,
                      setter: setIsBestSeller,
                      activeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
                    },
                    {
                      id: 'isNewArrival',
                      label: 'Hàng mới',
                      icon: Sparkles,
                      checked: isNewArrival,
                      setter: setIsNewArrival,
                      activeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                    },
                    {
                      id: 'isFeatured',
                      label: 'Nổi bật',
                      icon: Star,
                      checked: isFeatured,
                      setter: setIsFeatured,
                      activeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
                    },
                    {
                      id: 'isHot',
                      label: 'Hot',
                      icon: Zap,
                      checked: isHot,
                      setter: setIsHot,
                      activeClass: 'bg-red-500/10 text-red-400 border-red-500/30',
                    },
                  ].map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <button
                        key={badge.id}
                        type="button"
                        onClick={() => badge.setter(!badge.checked)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer select-none ${
                          badge.checked
                            ? badge.activeClass
                            : 'bg-slate-950 text-slate-400 border-slate-850 hover:bg-slate-850/50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tags / Từ khoá</label>
                <input
                  type="text"
                  value={tagsString}
                  onChange={(e) => setTagsString(e.target.value)}
                  placeholder="gaming, laptop, rtx4080 (cách bằng dấu phẩy)"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                />
                <span className="text-[10px] text-slate-500 mt-1 block font-medium">
                  Giúp tìm kiếm và lọc sản phẩm dễ dàng hơn
                </span>
              </div>
            </div>

            {/* Card 5: Tóm tắt */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
              <h4 className="text-base font-extrabold text-white border-b border-slate-800/80 pb-3">Tóm tắt</h4>
              <div>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Nhập tóm tắt nhanh thuộc tính sản phẩm..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200 resize-none"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Otherwise, render default product list view
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search and Filters Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 p-5 rounded-3xl border border-slate-800/80"
      >
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm laptop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-955 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-405 text-slate-400"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div className="relative">
          <select
            value={selectedBrandFilter}
            onChange={(e) => setSelectedBrandFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-405 text-slate-400"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((br) => (
              <option key={br._id} value={br._id}>
                {br.name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-extrabold rounded-xl text-xs transition-colors cursor-pointer border-0"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Lọc</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer border-0 shadow-lg shadow-purple-550/15"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </form>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/20 text-emerald-400 text-sm font-semibold rounded-xl border border-emerald-900 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-950/20 text-red-400 text-sm font-semibold rounded-xl border border-red-900 animate-in fade-in duration-200">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table Data */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800/80 text-slate-400 font-semibold text-sm">
          <Laptop className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          Không tìm thấy sản phẩm nào
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-450 font-bold bg-slate-900/50">
                    <th className="px-6 py-4">Hình ảnh</th>
                    <th className="px-6 py-4">Tên sản phẩm</th>
                    <th className="px-6 py-4">Phân loại</th>
                    <th className="px-6 py-4">Đơn giá</th>
                    <th className="px-6 py-4">Kho hàng</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {products.map((product) => {
                    const hasPromo = product.discountPrice > product.price;
                    return (
                      <tr key={product._id} className="hover:bg-slate-850/40 transition-colors text-sm">
                        {/* Image */}
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-950 p-1 border border-slate-800 flex items-center justify-center">
                            <img
                              src={
                                product.images?.[0]?.startsWith('http')
                                  ? product.images[0]
                                  : `http://localhost:5000${product.images?.[0]}`
                              }
                              alt={product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4 font-bold text-white max-w-xs truncate">
                          <div className="flex flex-col">
                            <span>{product.name}</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.isFeatured && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[8px] font-black bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20">
                                  <Sparkles className="w-2 h-2" /> Nổi bật
                                </span>
                              )}
                              {product.isBestSeller && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[8px] font-black bg-orange-500/10 text-orange-400 rounded-md border border-orange-500/20">
                                  <Flame className="w-2 h-2" /> Bán chạy
                                </span>
                              )}
                              {product.isNewArrival && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[8px] font-black bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
                                  <Sparkles className="w-2 h-2" /> Hàng mới
                                </span>
                              )}
                              {product.isHot && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[8px] font-black bg-red-500/10 text-red-400 rounded-md border border-red-500/20">
                                  <Zap className="w-2 h-2" /> Hot
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category & Brand */}
                        <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-slate-300">{product.category?.name}</span>
                            <span>{product.brand?.name}</span>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 text-xs font-bold text-white">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-purple-400 font-extrabold">
                              {formatPrice(product.price)}
                            </span>
                            {hasPromo && (
                              <span className="text-[10px] text-slate-500 line-through font-medium">
                                {formatPrice(product.discountPrice)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4 text-xs font-bold">
                          {product.stock > 0 ? (
                            <span className="text-slate-300">{product.stock} chiếc</span>
                          ) : (
                            <span className="text-red-400">Hết hàng</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(product)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border cursor-pointer select-none ${
                              product.isActive !== false
                                ? 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40'
                                : 'text-slate-400 bg-slate-800/20 border-slate-700/40'
                            }`}
                            title="Click để ẩn/hiển thị sản phẩm"
                          >
                            {product.isActive !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{product.isActive !== false ? 'Hiển thị' : 'Ẩn'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="p-2 text-slate-450 hover:text-purple-400 hover:bg-purple-950/20 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 text-slate-450 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                              title="Xóa laptop"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-slate-900 px-6 py-4 rounded-3xl border border-slate-800/80">
              <span className="text-xs text-slate-400 font-bold">Tổng số: {totalProducts} laptop</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer border-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="flex items-center justify-center px-4 text-xs font-bold text-white bg-slate-950 border border-slate-855 rounded-xl select-none">
                  Trang {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer border-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
