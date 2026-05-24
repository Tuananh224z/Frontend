import React from 'react';
import {
  Laptop,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Zap,
} from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { getProductImage } from '../../utils/productHelper';

interface AdminProductTableProps {
  products: any[];
  categories: any[];
  brands: any[];
  isLoading: boolean;
  search: string;
  setSearch: (val: string) => void;
  selectedCatFilter: string;
  setSelectedCatFilter: (val: string) => void;
  selectedBrandFilter: string;
  setSelectedBrandFilter: (val: string) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>> | ((page: any) => void);
  totalPages: number;
  totalProducts: number;
  onSearchSubmit: (e: React.FormEvent) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (product: any) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (product: any) => void;
}

export default function AdminProductTable({
  products,
  categories,
  brands,
  isLoading,
  search,
  setSearch,
  selectedCatFilter,
  setSelectedCatFilter,
  selectedBrandFilter,
  setSelectedBrandFilter,
  page,
  setPage,
  totalPages,
  totalProducts,
  onSearchSubmit,
  onOpenAddModal,
  onOpenEditModal,
  onDelete,
  onToggleStatus,
}: AdminProductTableProps) {
  return (
    <div className="space-y-6 text-left">
      {/* Search and Filters Bar */}
      <form
        onSubmit={onSearchSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 p-5 rounded-3xl border border-slate-800/80"
      >
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm laptop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-400 cursor-pointer"
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
            className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-400 cursor-pointer"
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
            onClick={onOpenAddModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer border-0 shadow-lg shadow-purple-550/15"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </form>

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
                  <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold bg-slate-900/50">
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
                              src={getProductImage(product.images)}
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
                            <span className="text-slate-350 text-slate-300">{product.category?.name}</span>
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
                            onClick={() => onToggleStatus(product)}
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
                              onClick={() => onOpenEditModal(product)}
                              className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-950/20 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete(product._id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
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
                  onClick={() => setPage && setPage((prev: number) => Math.max(prev - 1, 1))}
                  className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-350 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer border-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="flex items-center justify-center px-4 text-xs font-bold text-white bg-slate-950 border border-slate-850 rounded-xl select-none">
                  Trang {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage && setPage((prev: number) => Math.min(prev + 1, totalPages))}
                  className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-350 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer border-0"
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
