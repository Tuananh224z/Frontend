import React from 'react';
import {
  ArrowLeft,
  Loader2,
  Upload,
  X,
  Plus,
  Trash2,
  Flame,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { getProductImage } from '../../utils/productHelper';

interface AdminProductFormProps {
  viewMode: 'add' | 'edit';
  setViewMode: (mode: 'list' | 'add' | 'edit') => void;
  name: string;
  sku: string;
  setSku: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  price: string | number;
  setPrice: (val: string) => void;
  discountPrice: string | number;
  setDiscountPrice: (val: string) => void;
  stock: string | number;
  setStock: (val: string) => void;
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  sortOrder: string | number;
  setSortOrder: (val: string) => void;
  shortDesc: string;
  setShortDesc: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  images: string[];
  isUploading: boolean;
  isSaving: boolean;
  categories: any[];
  brands: any[];
  category: string;
  setCategory: (val: string) => void;
  brand: string;
  setBrand: (val: string) => void;
  isBestSeller: boolean;
  setIsBestSeller: (val: boolean) => void;
  isNewArrival: boolean;
  setIsNewArrival: (val: boolean) => void;
  isFeatured: boolean;
  setIsFeatured: (val: boolean) => void;
  isHot: boolean;
  setIsHot: (val: boolean) => void;
  tagsString: string;
  setTagsString: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  specGroups: any[];
  onNameChange: (val: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => void;
  onRemoveImage: (idx: number) => void;
  onAddGroup: () => void;
  onUpdateGroupName: (gIdx: number, val: string) => void;
  onRemoveGroup: (gIdx: number) => void;
  onAddItem: (gIdx: number) => void;
  onUpdateItem: (gIdx: number, iIdx: number, field: 'key' | 'value', val: string) => void;
  onRemoveItem: (gIdx: number, iIdx: number) => void;
  onSave: (e: React.FormEvent) => void;
}

export default function AdminProductForm({
  viewMode,
  setViewMode,
  name,
  sku,
  setSku,
  slug,
  setSlug,
  price,
  setPrice,
  discountPrice,
  setDiscountPrice,
  stock,
  setStock,
  isActive,
  setIsActive,
  sortOrder,
  setSortOrder,
  shortDesc,
  setShortDesc,
  description,
  setDescription,
  images,
  isUploading,
  isSaving,
  categories,
  brands,
  category,
  setCategory,
  brand,
  setBrand,
  isBestSeller,
  setIsBestSeller,
  isNewArrival,
  setIsNewArrival,
  isFeatured,
  setIsFeatured,
  isHot,
  setIsHot,
  tagsString,
  setTagsString,
  summary,
  setSummary,
  specGroups,
  onNameChange,
  onImageUpload,
  onRemoveImage,
  onAddGroup,
  onUpdateGroupName,
  onRemoveGroup,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onSave,
}: AdminProductFormProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left">
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
            <p className="text-xs font-semibold text-slate-450 mt-0.5 text-slate-400">Điền thông tin chi tiết sản phẩm laptop</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-slate-200 text-slate-350 font-extrabold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs transition-colors border-0 shadow-lg shadow-red-550/15 flex items-center gap-1.5 cursor-pointer bg-red-600"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lưu sản phẩm'}
          </button>
        </div>
      </div>

      {/* 2-Column Grid */}
      <form onSubmit={onSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                onChange={(e) => onNameChange(e.target.value)}
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
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
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
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-400 cursor-pointer"
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
              onDrop={onImageUpload}
              className="flex flex-col items-center justify-center gap-3 p-8 bg-slate-950 border border-dashed border-slate-800 rounded-xl transition-all hover:border-purple-500/50"
            >
              <Upload className="w-8 h-8 text-slate-400 shrink-0" />
              <div className="text-center">
                <span className="text-sm font-bold text-slate-200 block">
                  Kéo thả hoặc{' '}
                  <label className="text-red-500 hover:text-red-400 cursor-pointer underline inline">
                    chọn file
                    <input
                      type="file"
                      multiple
                      onChange={onImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </span>
                <span className="text-xs font-bold block mt-1 text-slate-450">
                  PNG, JPG, WEBP — tối đa 5MB/ảnh, 10 ảnh
                </span>
              </div>
              {isUploading && <Loader2 className="w-5 h-5 animate-spin text-purple-550 mt-1" />}
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
                      src={getProductImage(img)}
                      alt="preview"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(idx)}
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
                onClick={onAddGroup}
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
                  <div key={gIdx} className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-955">
                    {/* Group Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 border-b border-slate-800/80">
                      <input
                        type="text"
                        required
                        value={group.name}
                        onChange={(e) => onUpdateGroupName(gIdx, e.target.value)}
                        placeholder="Tên nhóm (VD: Bộ xử lý, Màn hình)"
                        className="flex-1 bg-transparent border-0 focus:outline-hidden text-sm font-bold text-white placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveGroup(gIdx)}
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
                            onChange={(e) => onUpdateItem(gIdx, iIdx, 'key', e.target.value)}
                            placeholder="Tên thông số (VD: Hãng CPU)"
                            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                          />
                          <input
                            type="text"
                            required
                            value={item.value}
                            onChange={(e) => onUpdateItem(gIdx, iIdx, 'value', e.target.value)}
                            placeholder="Giá trị (VD: Intel Core i7)"
                            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => onRemoveItem(gIdx, iIdx)}
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
                        onClick={() => onAddItem(gIdx)}
                        className="text-xs font-extrabold text-red-500 hover:text-red-400 flex items-center gap-1 mt-1 border-0 bg-transparent cursor-pointer"
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
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-400 cursor-pointer"
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
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-400 cursor-pointer"
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
