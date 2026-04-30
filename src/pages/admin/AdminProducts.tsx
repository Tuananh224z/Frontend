import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

type Product = typeof mockProducts[0];

const mockProducts = [
  { id: 1, sku: 'ROG-G15', name: 'Laptop ASUS ROG Strix G15', category: 'Laptop', brand: 'ASUS', price: 59990000, stock: 14, status: 'Đang bán' },
  { id: 2, sku: 'XPS-15', name: 'Laptop Dell XPS 15 i7', category: 'Laptop', brand: 'Dell', price: 47990000, stock: 8, status: 'Đang bán' },
  { id: 3, sku: 'MBP-M3', name: 'MacBook Pro M3 Pro 16"', category: 'Laptop', brand: 'Apple', price: 69990000, stock: 0, status: 'Hết hàng' },
  { id: 4, sku: 'LG-27UP', name: 'Màn hình LG 27" 4K UltraFine', category: 'Màn hình', brand: 'LG', price: 18990000, stock: 22, status: 'Đang bán' },
  { id: 5, sku: 'LGT-GPX2', name: 'Chuột Logitech G Pro X Superlight 2', category: 'Phụ kiện', brand: 'Logitech', price: 2790000, stock: 45, status: 'Đang bán' },
  { id: 6, sku: 'KC-Q1PRO', name: 'Bàn phím cơ Keychron Q1 Pro', category: 'Phụ kiện', brand: 'Keychron', price: 3490000, stock: 3, status: 'Sắp hết' },
  { id: 7, sku: 'SAM-990P', name: 'SSD Samsung 990 Pro 2TB', category: 'Ổ cứng', brand: 'Samsung', price: 3190000, stock: 67, status: 'Đang bán' },
  { id: 8, sku: 'COR-V32G', name: 'RAM Corsair Vengeance DDR5 32GB', category: 'Linh kiện', brand: 'Corsair', price: 2390000, stock: 0, status: 'Hết hàng' },
];

const statusColor: Record<string, string> = {
  'Đang bán': 'bg-green-100 text-green-700',
  'Hết hàng': 'bg-red-100 text-red-700',
  'Sắp hết': 'bg-yellow-100 text-yellow-700',
};

const AdminProducts = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const filtered = mockProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} sản phẩm</p>
        </div>
        <button onClick={() => navigate('/admin/products/new')} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" /> Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, SKU..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
          <select className="border border-gray-200 rounded-xl text-sm px-3 py-2 focus:ring-1 focus:ring-primary-500 outline-none">
            <option>Tất cả danh mục</option>
            <option>Laptop</option><option>Màn hình</option><option>Phụ kiện</option><option>Ổ cứng</option>
          </select>
          <select className="border border-gray-200 rounded-xl text-sm px-3 py-2 focus:ring-1 focus:ring-primary-500 outline-none">
            <option>Tất cả trạng thái</option>
            <option>Đang bán</option><option>Hết hàng</option><option>Sắp hết</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Tên sản phẩm</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Danh mục</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Thương hiệu</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Giá</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Tồn kho</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                  <td className="px-5 py-3 font-medium text-gray-900 max-w-[220px] truncate">{p.name}</td>
                  <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{p.category}</td>
                  <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{p.brand}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900">{p.price.toLocaleString('vi-VN')}₫</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock < 5 ? 'text-yellow-600' : 'text-gray-700'}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => navigate(`/admin/products/${p.id}/edit`)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Hiển thị 1–{filtered.length} / {filtered.length}</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-semibold text-xs">1</button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {deleteTarget && (
        <DeleteConfirmModal
          title="Xóa sản phẩm"
          message={`Bạn có chắc muốn xóa sản phẩm "${deleteTarget.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={() => {}}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminProducts;
