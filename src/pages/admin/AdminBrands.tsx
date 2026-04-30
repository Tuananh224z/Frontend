import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, X, Upload } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

type Brand = { id: number; name: string; image: string; products: number; country: string; status: boolean };

const initial: Brand[] = [
  { id: 1, name: 'ASUS', image: 'https://placehold.co/80x40/1a1a2e/white?text=ASUS', products: 48, country: 'Đài Loan', status: true },
  { id: 2, name: 'Dell', image: 'https://placehold.co/80x40/0066cc/white?text=Dell', products: 32, country: 'Mỹ', status: true },
  { id: 3, name: 'Apple', image: 'https://placehold.co/80x40/1d1d1d/white?text=Apple', products: 22, country: 'Mỹ', status: true },
  { id: 4, name: 'Samsung', image: 'https://placehold.co/80x40/1428a0/white?text=Samsung', products: 55, country: 'Hàn Quốc', status: true },
  { id: 5, name: 'LG', image: 'https://placehold.co/80x40/a50034/white?text=LG', products: 18, country: 'Hàn Quốc', status: true },
  { id: 6, name: 'Logitech', image: 'https://placehold.co/80x40/00b4d8/white?text=Logitech', products: 41, country: 'Thuỵ Sĩ', status: true },
  { id: 7, name: 'Keychron', image: 'https://placehold.co/80x40/354259/white?text=Keychron', products: 14, country: 'Hồng Kông', status: true },
  { id: 8, name: 'Corsair', image: 'https://placehold.co/80x40/ffcc00/1a1a1a?text=Corsair', products: 27, country: 'Mỹ', status: false },
  { id: 9, name: 'Lenovo', image: 'https://placehold.co/80x40/e2231a/white?text=Lenovo', products: 33, country: 'Trung Quốc', status: true },
  { id: 10, name: 'Sony', image: 'https://placehold.co/80x40/0070d1/white?text=Sony', products: 16, country: 'Nhật Bản', status: true },
];

const BrandModal = ({ brand, onClose }: { brand: Partial<Brand> | null; onClose: () => void }) => {
  const isNew = !brand?.id;
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: brand?.name ?? '', country: brand?.country ?? '', status: brand?.status ?? true });
  const [preview, setPreview] = useState<string>(brand?.image ?? '');
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900">{isNew ? 'Thêm thương hiệu' : 'Chỉnh sửa thương hiệu'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Tên thương hiệu *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Nhập tên..." />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Xuất xứ</label>
            <input value={form.country} onChange={e => set('country', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Quốc gia..." />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Logo thương hiệu</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            {preview ? (
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <img
                  src={preview}
                  alt="logo"
                  className="h-12 w-auto max-w-[120px] object-contain rounded-lg border border-gray-200 bg-white p-1"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x40/e5e7eb/9ca3af?text=Logo'; }}
                />
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => fileRef.current?.click()} className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    <Upload className="w-3 h-3" /> Đổi logo
                  </button>
                  <button onClick={() => setPreview('')} className="text-xs font-semibold text-red-500 hover:text-red-600">Xoá</button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all"
              >
                <Upload className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Kéo thả hoặc <span className="text-primary-600 font-medium">chọn file</span></p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG — tối đa 2MB</p>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Trạng thái</label>
            <select value={form.status ? '1' : '0'} onChange={e => set('status', e.target.value === '1')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
              <option value="1">Hiển thị</option>
              <option value="0">Ẩn</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Huỷ</button>
          <button onClick={onClose} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">Lưu</button>
        </div>
      </div>
    </div>
  );
};

const AdminBrands = () => {
  const [brands] = useState<Brand[]>(initial);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Partial<Brand> | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Quản lý thương hiệu</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} thương hiệu</p>
        </div>
        <button onClick={() => setModal({})} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" /> Thêm thương hiệu
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm thương hiệu..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full focus:ring-1 focus:ring-primary-500 outline-none" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Logo</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Thương hiệu</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Xuất xứ</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Sản phẩm</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(b => (
              <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-5 py-3">
                  <img src={b.image} alt={b.name} className="h-8 w-auto max-w-[80px] rounded object-contain bg-gray-50 p-0.5 border border-gray-100" />
                </td>
                <td className="px-5 py-3 font-bold text-gray-900">{b.name}</td>
                <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{b.country}</td>
                <td className="px-5 py-3 text-center font-semibold text-gray-700">{b.products}</td>
                <td className="px-5 py-3 text-center">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${b.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {b.status ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => setModal(b)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteTarget(b)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== undefined && <BrandModal brand={modal} onClose={() => setModal(undefined)} />}
      {deleteTarget && (
        <DeleteConfirmModal
          title="Xoá thương hiệu"
          message={`Bạn có chắc muốn xoá thương hiệu "${deleteTarget.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={() => {}}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminBrands;
