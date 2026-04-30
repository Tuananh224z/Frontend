import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, X, Upload } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

type Category = { id: number; name: string; slug: string; products: number; image: string; status: boolean };

const initial: Category[] = [
  { id: 1, name: 'Laptop', slug: 'laptop', products: 45, image: '', status: true },
  { id: 2, name: 'PC Gaming', slug: 'pc-gaming', products: 28, image: '', status: true },
  { id: 3, name: 'Màn hình', slug: 'man-hinh', products: 32, image: '', status: true },
  { id: 4, name: 'Phụ kiện', slug: 'phu-kien', products: 86, image: '', status: true },
  { id: 5, name: 'Ổ cứng / SSD', slug: 'o-cung-ssd', products: 41, image: '', status: true },
  { id: 6, name: 'Linh kiện', slug: 'linh-kien', products: 53, image: '', status: false },
  { id: 7, name: 'Tai nghe', slug: 'tai-nghe', products: 19, image: '', status: true },
  { id: 8, name: 'Bàn phím', slug: 'ban-phim', products: 24, image: '', status: true },
];

const EMOJI_MAP: Record<string, string> = {
  laptop: '💻', 'pc-gaming': '🖥️', 'man-hinh': '🖨️', 'phu-kien': '🖱️',
  'o-cung-ssd': '💾', 'linh-kien': '🔧', 'tai-nghe': '🎧', 'ban-phim': '⌨️',
};

const CategoryModal = ({ cat, onClose }: { cat: Partial<Category> | null; onClose: () => void }) => {
  const isNew = !cat?.id;
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: cat?.name ?? '', slug: cat?.slug ?? '', status: cat?.status ?? true });
  const [preview, setPreview] = useState<string>(cat?.image ?? '');
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900">{isNew ? 'Thêm danh mục' : 'Chỉnh sửa danh mục'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Tên danh mục *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Nhập tên danh mục..." />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Slug (URL)</label>
            <input value={form.slug} onChange={e => set('slug', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="ten-danh-muc" />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Ảnh đại diện</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            {preview ? (
              <div className="relative group w-full h-36 rounded-xl overflow-hidden border border-gray-200">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => fileRef.current?.click()} className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1">
                    <Upload className="w-3 h-3" /> Đổi ảnh
                  </button>
                  <button onClick={() => setPreview('')} className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">Xoá</button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all"
              >
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Kéo thả hoặc <span className="text-primary-600 font-medium">chọn file</span></p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — tối đa 2MB</p>
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

const AdminCategories = () => {
  const [categories] = useState<Category[]>(initial);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Partial<Category> | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Quản lý danh mục</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} danh mục</p>
        </div>
        <button onClick={() => setModal({})} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" /> Thêm danh mục
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm danh mục..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full focus:ring-1 focus:ring-primary-500 outline-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-gray-200 transition-all">
            {/* Image */}
            <div className="w-full h-28 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl">
              {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> : (EMOJI_MAP[c.slug] || '📦')}
            </div>

            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{c.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">/{c.slug}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setModal(c)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-500">{c.products} sản phẩm</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {c.status ? 'Hiển thị' : 'Ẩn'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal !== undefined && <CategoryModal cat={modal} onClose={() => setModal(undefined)} />}
      {deleteTarget && (
        <DeleteConfirmModal
          title="Xoá danh mục"
          message={`Bạn có chắc muốn xoá danh mục "${deleteTarget.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={() => {}}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminCategories;
