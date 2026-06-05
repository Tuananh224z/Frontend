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
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs"
      >
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm laptop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-800"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-700 cursor-pointer"
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
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-700 cursor-pointer"
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
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Lọc</span>
          </button>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer border-0 shadow-md shadow-purple-600/15"
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
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400 font-semibold text-sm shadow-xs">
          <Laptop className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          Không tìm thấy sản phẩm nào
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold bg-slate-50/75">
                    <th className="px-6 py-4">Hình ảnh</th>
                    <th className="px-6 py-4">Tên sản phẩm</th>
                    <th className="px-6 py-4">Phân loại</th>
                    <th className="px-6 py-4">Đơn giá</th>
                    <th className="px-6 py-4">Kho hàng</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => {
                    const hasPromo = product.discountPrice > product.price;
                    return (
                      <tr key={product._id} className="hover:bg-slate-50/50 transition-colors text-sm">
                        {/* Image */}
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 p-1 border border-slate-100 flex items-center justify-center">
                            <img
                              src={getProductImage(product.images)}
                              alt={product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4 font-bold text-slate-900 max-w-xs truncate">
                          <div className="flex flex-col">
                            <span>{product.name}</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.isFeatured && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[8px] font-black bg-amber-50 text-amber-700 rounded-md border border-amber-200/50">
                                  <Sparkles className="w-2 h-2" /> Nổi bật
                                </span>
                              )}
                              {product.isBestSeller && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[8px] font-black bg-orange-50 text-orange-700 rounded-md border border-orange-200/50">
                                  <Flame className="w-2 h-2" /> Bán chạy
                                </span>
                              )}
                              {product.isNewArrival && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[8px] font-black bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200/50">
                                  <Sparkles className="w-2 h-2" /> Hàng mới
                                </span>
                              )}
                              {product.isHot && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[8px] font-black bg-red-50 text-red-700 rounded-md border border-red-200/50">
                                  <Zap className="w-2 h-2" /> Hot
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category & Brand */}
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-slate-700">{product.category?.name}</span>
                            <span>{product.brand?.name}</span>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 text-xs font-bold text-slate-900">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-purple-600 font-extrabold">
                              {formatPrice(product.price)}
                            </span>
                            {hasPromo && (
                              <span className="text-[10px] text-slate-400 line-through font-medium">
                                {formatPrice(product.discountPrice)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4 text-xs font-bold">
                          {product.stock > 0 ? (
                            <span className="text-slate-700">{product.stock} chiếc</span>
                          ) : (
                            <span className="text-red-600 font-extrabold">Hết hàng</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => onToggleStatus(product)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border cursor-pointer select-none transition-colors ${
                              product.isActive !== false
                                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                : 'text-slate-500 bg-slate-100 border-slate-200'
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
                              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete(product._id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
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
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-bold">Tổng số: {totalProducts} laptop</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage && setPage((prev: number) => Math.max(prev - 1, 1))}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer border border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="flex items-center justify-center px-4 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl select-none">
                  Trang {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage && setPage((prev: number) => Math.min(prev + 1, totalPages))}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer border border-slate-200"
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
