import { useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Save, Upload, Plus, Trash2, X, Star,
  ChevronDown, ChevronRight, Check, Tag, Package,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type ImageItem  = { id: string; url: string; isPrimary: boolean };
type SpecItem   = { id: string; key: string; value: string };
type SpecGroup  = { id: string; name: string; items: SpecItem[] };
type Attribute  = { id: string; name: string; values: string[] };
type Serial     = { id: string; code: string; status: 'stock' | 'sold'; warranty: string };
type Variant    = { id: string; label: string; combo: Record<string,string>; origPrice: string; salePrice: string; isDefault: boolean; serials: Serial[] };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8);

/** Cartesian product of attribute values → [{Color:'Đen', RAM:'8GB'}, …] */
function cartesian(attrs: Attribute[]): Record<string, string>[] {
  const valid = attrs.filter(a => a.values.length > 0);
  if (!valid.length) return [];
  return valid.reduce<Record<string,string>[]>((acc, attr) => {
    if (!acc.length) return attr.values.map(v => ({ [attr.name]: v }));
    return acc.flatMap(combo => attr.values.map(v => ({ ...combo, [attr.name]: v })));
  }, []);
}

/** Generate / sync variant list when attributes change */
function syncVariants(attrs: Attribute[], existing: Variant[]): Variant[] {
  const combos = cartesian(attrs);
  if (!combos.length) return [];
  return combos.map(combo => {
    const label = Object.values(combo).join(' / ');
    const old = existing.find(v => v.label === label);
    return old ?? { id: uid(), label, combo, origPrice: '', salePrice: '', isDefault: false, serials: [] };
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>{children}</div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${props.className ?? ''}`} />
);

const Card = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <h2 className="font-bold text-gray-900">{title}</h2>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ─── Serial mini-table ────────────────────────────────────────────────────────
const SerialTable = ({ serials, onChange }: { serials: Serial[]; onChange: (s: Serial[]) => void }) => {
  const addSerial = () => onChange([...serials, { id: uid(), code: '', status: 'stock', warranty: '12 tháng' }]);
  const upd = (i: number, k: keyof Serial, v: string) => onChange(serials.map((s, idx) => idx === i ? { ...s, [k]: v } : s));
  const del = (i: number) => onChange(serials.filter((_, idx) => idx !== i));

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase">Serial ({serials.length})</p>
        <button onClick={addSerial} className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-semibold">
          <Plus className="w-3 h-3" /> Thêm serial
        </button>
      </div>
      {serials.length > 0 ? (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-gray-500">Mã serial</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-500">Trạng thái</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-500">Bảo hành</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {serials.map((s, i) => (
                <tr key={s.id}>
                  <td className="px-3 py-2">
                    <input value={s.code} onChange={e => upd(i, 'code', e.target.value)} placeholder="VD: SN-ABC123" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary-500 outline-none" />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => upd(i, 'status', s.status === 'stock' ? 'sold' : 'stock')}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${s.status === 'stock' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                    >
                      {s.status === 'stock' ? 'Còn hàng' : 'Đã bán'}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <input value={s.warranty} onChange={e => upd(i, 'warranty', e.target.value)} placeholder="VD: 12 tháng" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary-500 outline-none" />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => del(i)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
            <span>Tồn kho: <strong className="text-green-600">{serials.filter(s => s.status === 'stock').length}</strong></span>
            <span>Đã bán: <strong className="text-red-500">{serials.filter(s => s.status === 'sold').length}</strong></span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">Chưa có serial nào.</p>
      )}
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const categories = ['Laptop', 'PC Gaming', 'Màn hình', 'Phụ kiện', 'Ổ cứng / SSD', 'Linh kiện', 'Tai nghe', 'Bàn phím'];
const brands     = ['ASUS', 'Dell', 'Apple', 'Samsung', 'LG', 'Logitech', 'Keychron', 'Corsair', 'Lenovo', 'Sony', 'MSI', 'Razer'];

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // Basic
  const [form, setForm] = useState({ name: isEdit ? 'Laptop ASUS ROG Strix G15' : '', sku: isEdit ? 'ROG-G15' : '', category: 'Laptop', brand: 'ASUS', status: 'active', shortDesc: '', description: '' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  // ── Images
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageItem[]>([]);

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    const newImgs: ImageItem[] = Array.from(files).map((f, i) => ({
      id: uid(), url: URL.createObjectURL(f), isPrimary: images.length === 0 && i === 0,
    }));
    setImages(prev => [...prev, ...newImgs]);
  };
  const setPrimary = (id: string) => setImages(imgs => imgs.map(img => ({ ...img, isPrimary: img.id === id })));
  const removeImage = (id: string) => {
    setImages(prev => {
      const next = prev.filter(img => img.id !== id);
      if (next.length && !next.some(img => img.isPrimary)) next[0].isPrimary = true;
      return next;
    });
  };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); handleImages(e.dataTransfer.files); };

  // ── Spec groups
  const [specGroups, setSpecGroups] = useState<SpecGroup[]>([
    { id: uid(), name: 'Bộ xử lý', items: [
      { id: uid(), key: 'CPU', value: isEdit ? 'AMD Ryzen 9 7945HX' : '' },
      { id: uid(), key: 'Kiến trúc', value: isEdit ? 'Zen 4' : '' },
    ]},
    { id: uid(), name: 'RAM', items: [{ id: uid(), key: 'Dung lượng', value: isEdit ? '32GB DDR5 4800MHz' : '' }] },
    { id: uid(), name: 'Màn hình', items: [{ id: uid(), key: 'Kích thước', value: isEdit ? '15.6 inch QHD+ 240Hz' : '' }] },
  ]);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(specGroups.map(g => g.id)));
  const toggleGroup = (id: string) => setOpenGroups(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const addGroup = () => { const g: SpecGroup = { id: uid(), name: '', items: [] }; setSpecGroups(s => [...s, g]); setOpenGroups(s => new Set([...s, g.id])); };
  const setGroupName = (gi: number, v: string) => setSpecGroups(gs => gs.map((g, i) => i === gi ? { ...g, name: v } : g));
  const removeGroup = (gi: number) => setSpecGroups(gs => gs.filter((_, i) => i !== gi));
  const addSpecItem = (gi: number) => setSpecGroups(gs => gs.map((g, i) => i === gi ? { ...g, items: [...g.items, { id: uid(), key: '', value: '' }] } : g));
  const setSpecItem = (gi: number, ii: number, k: 'key' | 'value', v: string) => setSpecGroups(gs => gs.map((g, i) => i === gi ? { ...g, items: g.items.map((it, j) => j === ii ? { ...it, [k]: v } : it) } : g));
  const removeSpecItem = (gi: number, ii: number) => setSpecGroups(gs => gs.map((g, i) => i === gi ? { ...g, items: g.items.filter((_, j) => j !== ii) } : g));

  // ── Variants
  const [hasVariants, setHasVariants] = useState(isEdit);
  const [attributes, setAttributes] = useState<Attribute[]>(
    isEdit ? [
      { id: uid(), name: 'Màu sắc', values: ['Đen', 'Xám'] },
      { id: uid(), name: 'Bộ nhớ', values: ['512GB', '1TB'] },
    ] : []
  );
  const [variants, setVariants] = useState<Variant[]>(() =>
    isEdit ? syncVariants(
      [{ id: '1', name: 'Màu sắc', values: ['Đen', 'Xám'] }, { id: '2', name: 'Bộ nhớ', values: ['512GB', '1TB'] }],
      []
    ).map((v, i) => ({ ...v, origPrice: '67990000', salePrice: '59990000', isDefault: i === 0 }))
    : []
  );
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null);

  // No-variant mode
  const [simplePrice, setSimplePrice] = useState({ orig: '', sale: '' });
  const [simpleSerials, setSimpleSerials] = useState<Serial[]>([]);

  // Attribute helpers
  const [attrInputs, setAttrInputs] = useState<Record<string, string>>({});
  const addAttribute = () => {
    const attr: Attribute = { id: uid(), name: '', values: [] };
    setAttributes(a => { const next = [...a, attr]; setVariants(v => syncVariants(next, v)); return next; });
  };
  const setAttrName = (i: number, v: string) => setAttributes(a => { const next = a.map((at, idx) => idx === i ? { ...at, name: v } : at); setVariants(vs => syncVariants(next, vs)); return next; });
  const addAttrValue = (i: number) => {
    const raw = attrInputs[attributes[i].id] ?? '';
    if (!raw.trim()) return;
    setAttributes(a => {
      const next = a.map((at, idx) => idx === i && !at.values.includes(raw.trim()) ? { ...at, values: [...at.values, raw.trim()] } : at);
      setVariants(v => syncVariants(next, v));
      setAttrInputs(inp => ({ ...inp, [a[i].id]: '' }));
      return next;
    });
  };
  const removeAttrValue = (i: number, vi: number) => setAttributes(a => { const next = a.map((at, idx) => idx === i ? { ...at, values: at.values.filter((_, j) => j !== vi) } : at); setVariants(v => syncVariants(next, v)); return next; });
  const removeAttribute = (i: number) => setAttributes(a => { const next = a.filter((_, idx) => idx !== i); setVariants(v => syncVariants(next, v)); return next; });

  // Variant field helpers
  const setVariantField = useCallback((vid: string, k: 'origPrice' | 'salePrice', val: string) =>
    setVariants(vs => vs.map(v => v.id === vid ? { ...v, [k]: val } : v)), []);
  const setVariantDefault = (vid: string) => setVariants(vs => vs.map(v => ({ ...v, isDefault: v.id === vid })));
  const setVariantSerials = useCallback((vid: string, serials: Serial[]) =>
    setVariants(vs => vs.map(v => v.id === vid ? { ...v, serials } : v)), []);

  const discount = (orig: string, sale: string) => {
    const o = Number(orig), s = Number(sale);
    if (!o || !s || o <= s) return null;
    return Math.round((1 - s / o) * 100);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/products')} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{isEdit ? `SKU: ${form.sku}` : 'Điền thông tin sản phẩm'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/admin/products')} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Huỷ</button>
          <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            <Save className="w-4 h-4" /> Lưu sản phẩm
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left ── */}
        <div className="xl:col-span-2 space-y-6">

          {/* Basic Info */}
          <Card title="Thông tin cơ bản">
            <div className="space-y-4">
              <Field label="Tên sản phẩm *"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Laptop ASUS ROG Strix G15" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="SKU *"><Input value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="VD: ROG-G15" /></Field>
                <Field label="Trạng thái">
                  <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                    <option value="active">Đang bán</option>
                    <option value="out_of_stock">Hết hàng</option>
                    <option value="draft">Nháp</option>
                    <option value="hidden">Ẩn</option>
                  </select>
                </Field>
              </div>
              <Field label="Mô tả ngắn"><Input value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} placeholder="Hiển thị ở trang danh sách..." /></Field>
              <Field label="Mô tả chi tiết">
                <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Mô tả đầy đủ..." />
              </Field>
            </div>
          </Card>

          {/* Images */}
          <Card title="Hình ảnh sản phẩm">
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleImages(e.target.files)} />
            {/* Upload area */}
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/20 transition-all mb-4"
            >
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Kéo thả ảnh vào đây hoặc <span className="text-primary-600 font-medium">chọn file</span></p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — Chọn nhiều ảnh cùng lúc</p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {images.map(img => (
                  <div key={img.id} className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${img.isPrimary ? 'border-primary-500 shadow-md shadow-primary-100' : 'border-gray-200 hover:border-gray-400'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" onClick={() => setPrimary(img.id)} />
                    {/* Primary badge */}
                    {img.isPrimary && (
                      <div className="absolute top-1 left-1 bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center"><Star className="w-2.5 h-2.5 fill-white" /></div>
                    )}
                    {/* Set primary on hover */}
                    {!img.isPrimary && (
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" onClick={() => setPrimary(img.id)}>
                        <span className="text-white text-xs font-semibold bg-black/50 rounded-lg px-2 py-1">Ảnh chính</span>
                      </div>
                    )}
                    {/* Remove */}
                    <button onClick={e => { e.stopPropagation(); removeImage(img.id); }} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {images.length > 0 && (
              <p className="text-xs text-gray-400 mt-3">⭐ Click vào ảnh để đặt làm ảnh chính</p>
            )}
          </Card>

          {/* Spec Groups */}
          <Card title="Thông số kỹ thuật" action={
            <button onClick={addGroup} className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-semibold">
              <Plus className="w-3.5 h-3.5" /> Thêm nhóm
            </button>
          }>
            <div className="space-y-3">
              {specGroups.map((g, gi) => {
                const open = openGroups.has(g.id);
                return (
                  <div key={g.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    {/* Group header */}
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5">
                      <button onClick={() => toggleGroup(g.id)} className="text-gray-400 hover:text-gray-600">
                        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      <input
                        value={g.name}
                        onChange={e => setGroupName(gi, e.target.value)}
                        placeholder="Tên nhóm (VD: Bộ xử lý)"
                        className="flex-1 bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400 placeholder:font-normal"
                      />
                      <span className="text-xs text-gray-400">{g.items.length} thông số</span>
                      <button onClick={() => removeGroup(gi)} className="text-red-400 hover:text-red-600 transition-colors ml-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>

                    {/* Group items */}
                    {open && (
                      <div className="p-4 space-y-2">
                        {g.items.map((it, ii) => (
                          <div key={it.id} className="flex items-center gap-2">
                            <input value={it.key} onChange={e => setSpecItem(gi, ii, 'key', e.target.value)} placeholder="Thuộc tính (VD: CPU)" className="w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none shrink-0" />
                            <input value={it.value} onChange={e => setSpecItem(gi, ii, 'value', e.target.value)} placeholder="Giá trị" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none" />
                            <button onClick={() => removeSpecItem(gi, ii)} className="text-red-400 hover:text-red-600 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <button onClick={() => addSpecItem(gi)} className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-semibold mt-1">
                          <Plus className="w-3 h-3" /> Thêm thông số
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {specGroups.length === 0 && <p className="text-xs text-gray-400 italic">Chưa có nhóm thông số. Nhấn "Thêm nhóm" để bắt đầu.</p>}
            </div>
          </Card>

          {/* Variants */}
          <Card title="Giá & Biến thể">
            {/* Mode toggle */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <div className="relative group">
                <button
                  onClick={() => { if (attributes.length === 0) { setHasVariants(false); setVariants([]); } }}
                  disabled={hasVariants && attributes.length > 0}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all
                    ${!hasVariants ? 'bg-primary-50 border-primary-500 text-primary-700' : ''}
                    ${hasVariants && attributes.length > 0 ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                >
                  <Check className={`w-4 h-4 ${!hasVariants ? 'text-primary-600' : 'text-transparent'}`} />
                  Không có biến thể
                </button>
                {hasVariants && attributes.length > 0 && (
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                      Xoá hết thuộc tính trước khi chuyển sang chế độ này
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setHasVariants(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${hasVariants ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
              >
                <Check className={`w-4 h-4 ${hasVariants ? 'text-primary-600' : 'text-transparent'}`} />
                Có biến thể (thuộc tính)
              </button>
            </div>

            {/* ── No-variant mode ── */}
            {!hasVariants && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Giá gốc"><Input type="number" value={simplePrice.orig} onChange={e => setSimplePrice(p => ({ ...p, orig: e.target.value }))} placeholder="0" /></Field>
                  <Field label="Giá bán *"><Input type="number" value={simplePrice.sale} onChange={e => setSimplePrice(p => ({ ...p, sale: e.target.value }))} placeholder="0" /></Field>
                </div>
                {simplePrice.orig && simplePrice.sale && discount(simplePrice.orig, simplePrice.sale) !== null && (
                  <p className="text-sm text-green-600 font-semibold">Giảm {discount(simplePrice.orig, simplePrice.sale)}%</p>
                )}
                <div className="border-t border-gray-100 pt-5">
                  <SerialTable serials={simpleSerials} onChange={setSimpleSerials} />
                </div>
              </div>
            )}

            {/* ── Variant mode ── */}
            {hasVariants && (
              <div className="space-y-6">
                {/* Attribute builder */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Thuộc tính</p>
                  <div className="space-y-3">
                    {attributes.map((attr, ai) => (
                      <div key={attr.id} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <input
                            value={attr.name}
                            onChange={e => setAttrName(ai, e.target.value)}
                            placeholder="Tên thuộc tính (VD: Màu sắc, RAM...)"
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-1 focus:ring-primary-500 outline-none"
                          />
                          <button onClick={() => removeAttribute(ai)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        {/* Values chips */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {attr.values.map((v, vi) => (
                            <span key={vi} className="flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-200 text-xs font-medium px-2.5 py-1 rounded-xl">
                              {v}
                              <button onClick={() => removeAttrValue(ai, vi)} className="text-primary-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            value={attrInputs[attr.id] ?? ''}
                            onChange={e => setAttrInputs(inp => ({ ...inp, [attr.id]: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && addAttrValue(ai)}
                            placeholder="Thêm giá trị rồi nhấn Enter..."
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary-500 outline-none"
                          />
                          <button onClick={() => addAttrValue(ai)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Thêm</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={addAttribute} className="mt-3 flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-semibold">
                    <Plus className="w-4 h-4" /> Thêm thuộc tính
                  </button>
                </div>

                {/* Variant table */}
                {variants.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                      Biến thể ({variants.length}) — {variants.reduce((s, v) => s + v.serials.filter(sr => sr.status === 'stock').length, 0)} còn hàng
                    </p>
                    <div className="space-y-2">
                      {variants.map(v => {
                        const disc = discount(v.origPrice, v.salePrice);
                        const stockCount = v.serials.filter(s => s.status === 'stock').length;
                        const expanded = expandedVariant === v.id;
                        return (
                          <div key={v.id} className={`border rounded-xl overflow-hidden transition-all ${v.isDefault ? 'border-primary-300 shadow-sm shadow-primary-100' : 'border-gray-100'}`}>
                            {/* Variant row */}
                            <div className="flex items-center gap-3 px-4 py-3 bg-white flex-wrap">
                              {/* Default toggle */}
                              <button
                                onClick={() => setVariantDefault(v.id)}
                                title="Đặt làm mặc định"
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${v.isDefault ? 'border-primary-600 bg-primary-600' : 'border-gray-300 hover:border-primary-400'}`}
                              >
                                {v.isDefault && <Check className="w-3 h-3 text-white" />}
                              </button>
                              {/* Label */}
                              <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                                <Package className="w-4 h-4 text-gray-400 shrink-0" />
                                <span className="text-sm font-semibold text-gray-800">{v.label}</span>
                                {v.isDefault && <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full">Mặc định</span>}
                              </div>
                              {/* Prices */}
                              <div className="flex items-center gap-2">
                                <input value={v.origPrice} onChange={e => setVariantField(v.id, 'origPrice', e.target.value)} placeholder="Giá gốc" type="number" className="w-32 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-1 focus:ring-primary-500 outline-none text-right" />
                                <input value={v.salePrice} onChange={e => setVariantField(v.id, 'salePrice', e.target.value)} placeholder="Giá bán *" type="number" className="w-32 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-1 focus:ring-primary-500 outline-none text-right font-semibold" />
                                {disc !== null && <span className="text-xs font-bold text-green-600 shrink-0">-{disc}%</span>}
                              </div>
                              {/* Stock badge */}
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${stockCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {stockCount} serial
                              </span>
                              {/* Expand serials */}
                              <button onClick={() => setExpandedVariant(expanded ? null : v.id)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors shrink-0">
                                Serial {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            {/* Serial panel */}
                            {expanded && (
                              <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-4">
                                <SerialTable serials={v.serials} onChange={serials => setVariantSerials(v.id, serials)} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">⚪ Click vòng tròn để đặt biến thể mặc định khi xem chi tiết sản phẩm</p>
                  </div>
                )}

                {variants.length === 0 && attributes.length > 0 && (
                  <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    Thêm ít nhất một giá trị cho mỗi thuộc tính để tạo biến thể.
                  </p>
                )}
              </div>
            )}
          </Card>


        </div>

        {/* ── Right ── */}
        <div className="space-y-6">
          <Card title="Phân loại">
            <div className="space-y-4">
              <Field label="Danh mục *">
                <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Thương hiệu *">
                <select value={form.brand} onChange={e => set('brand', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                  {brands.map(b => <option key={b}>{b}</option>)}
                </select>
              </Field>

              {/* Product Labels */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Nhãn sản phẩm</label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { key: 'isBestSeller', label: '🔥 Bán chạy',   color: 'orange' },
                    { key: 'isNew',        label: '🆕 Hàng mới',   color: 'green'  },
                    { key: 'isFeatured',   label: '⭐ Nổi bật',     color: 'yellow' },
                    { key: 'isHot',        label: '💥 Hot',         color: 'red'    },
                    { key: 'isSale',       label: '🏷️ Khuyến mãi', color: 'violet' },
                    { key: 'isGift',       label: '🎁 Tặng quà',   color: 'pink'   },
                    { key: 'isExclusive',  label: '💎 Độc quyền',  color: 'blue'   },
                    { key: 'isLimited',    label: '⏳ Giới hạn',   color: 'gray'   },
                  ] as { key: string; label: string; color: string }[]).map(({ key, label, color }) => {
                    const active = !!(form as Record<string, unknown>)[key];
                    const colorMap: Record<string, string> = {
                      orange: 'bg-orange-50 border-orange-400 text-orange-700',
                      green:  'bg-green-50 border-green-400 text-green-700',
                      yellow: 'bg-yellow-50 border-yellow-400 text-yellow-700',
                      red:    'bg-red-50 border-red-400 text-red-700',
                      violet: 'bg-violet-50 border-violet-400 text-violet-700',
                      pink:   'bg-pink-50 border-pink-400 text-pink-700',
                      blue:   'bg-blue-50 border-blue-400 text-blue-700',
                      gray:   'bg-gray-100 border-gray-400 text-gray-700',
                    };
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, [key]: !active }))}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border-2 transition-all select-none ${active ? colorMap[color] + ' shadow-sm' : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600'}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tags / Từ khoá</label>
                <input
                  placeholder="VD: gaming, laptop, rtx4080 (cách nhau bằng dấu phẩy)"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Giúp lọc và tìm kiếm sản phẩm dễ hơn</p>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card title="Tóm tắt">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Ảnh</span><span className="font-semibold">{images.length} ảnh</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Nhóm thông số</span><span className="font-semibold">{specGroups.length} nhóm</span></div>
              {hasVariants ? (
                <>
                  <div className="flex justify-between"><span className="text-gray-500">Thuộc tính</span><span className="font-semibold">{attributes.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Biến thể</span><span className="font-semibold">{variants.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tổng serial</span><span className="font-semibold text-green-600">{variants.reduce((s, v) => s + v.serials.filter(sr => sr.status === 'stock').length, 0)} còn hàng</span></div>
                </>
              ) : (
                <>
                  <div className="flex justify-between"><span className="text-gray-500">Giá bán</span><span className="font-bold text-primary-600">{simplePrice.sale ? Number(simplePrice.sale).toLocaleString('vi-VN') + '₫' : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Serial tồn</span><span className="font-semibold text-green-600">{simpleSerials.filter(s => s.status === 'stock').length}</span></div>
                </>
              )}
            </div>
          </Card>

          <button className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm">
            <Save className="w-4 h-4" /> {isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductEdit;
