import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, ToggleLeft, ToggleRight } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

type Promo = {
  id: number; code: string; name: string; type: 'percent' | 'fixed' | 'freeship';
  value: number; minOrder: number; maxUses: number; used: number;
  startDate: string; endDate: string; active: boolean;
};

const mockPromos: Promo[] = [
  { id: 1, code: 'SALE10', name: 'Giảm 10% toàn bộ', type: 'percent', value: 10, minOrder: 500000, maxUses: 500, used: 312, startDate: '01/04/2026', endDate: '30/04/2026', active: true },
  { id: 2, code: 'NEWUSER', name: 'Tặng 100K khách mới', type: 'fixed', value: 100000, minOrder: 1000000, maxUses: 200, used: 89, startDate: '01/03/2026', endDate: '01/05/2026', active: true },
  { id: 3, code: 'FREESHIP', name: 'Miễn phí vận chuyển', type: 'freeship', value: 0, minOrder: 300000, maxUses: 1000, used: 543, startDate: '15/03/2026', endDate: '15/04/2026', active: false },
  { id: 4, code: 'FLASH50', name: 'Flash sale 50%', type: 'percent', value: 50, minOrder: 2000000, maxUses: 100, used: 100, startDate: '01/04/2026', endDate: '01/04/2026', active: false },
];

const typeLabel: Record<string, { text: string; color: string }> = {
  percent:  { text: '% Giảm giá',   color: 'bg-violet-100 text-violet-700' },
  fixed:    { text: 'Giảm tiền cố định', color: 'bg-blue-100 text-blue-700' },
  freeship: { text: 'Miễn phí ship', color: 'bg-green-100 text-green-700' },
};

const PromoModal = ({ promo, onClose }: { promo: Partial<Promo> | null; onClose: () => void }) => {
  const isNew = !promo?.id;
  const [form, setForm] = useState({
    code: promo?.code ?? '', name: promo?.name ?? '',
    type: promo?.type ?? 'percent', value: promo?.value?.toString() ?? '',
    minOrder: promo?.minOrder?.toString() ?? '', maxUses: promo?.maxUses?.toString() ?? '',
    startDate: promo?.startDate ?? '', endDate: promo?.endDate ?? '', active: promo?.active ?? true,
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-extrabold text-gray-900">{isNew ? 'Thêm khuyến mại' : 'Chỉnh sửa khuyến mại'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Mã giảm giá *</label><input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono font-bold tracking-wider focus:ring-2 focus:ring-primary-500 outline-none uppercase" placeholder="VD: SALE10" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Loại</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none">
                <option value="percent">% Giảm giá</option>
                <option value="fixed">Giảm tiền cố định</option>
                <option value="freeship">Miễn phí ship</option>
              </select>
            </div>
          </div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Tên chương trình *</label><input value={form.name} onChange={e => set('name', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Mô tả ngắn..." /></div>
          {form.type !== 'freeship' && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium text-gray-700 mb-1 block">{form.type === 'percent' ? 'Phần trăm (%)' : 'Số tiền giảm (₫)'}</label><input type="number" value={form.value} onChange={e => set('value', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
              <div><label className="text-sm font-medium text-gray-700 mb-1 block">Đơn tối thiểu (₫)</label><input type="number" value={form.minOrder} onChange={e => set('minOrder', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
            </div>
          )}
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Số lượt dùng tối đa</label><input type="number" value={form.maxUses} onChange={e => set('maxUses', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Ngày bắt đầu</label><input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Ngày kết thúc</label><input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => set('active', !form.active)}>
              {form.active ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
            </button>
            <span className="text-sm font-medium text-gray-700">{form.active ? 'Đang hoạt động' : 'Tạm dừng'}</span>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Huỷ</button>
          <button onClick={onClose} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">Lưu</button>
        </div>
      </div>
    </div>
  );
};

const AdminPromotions = () => {
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Partial<Promo> | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Promo | null>(null);
  const [filter, setFilter] = useState('all');
  const filtered = mockPromos
    .filter(p => filter === 'all' ? true : filter === 'active' ? p.active : !p.active)
    .filter(p => p.code.includes(search.toUpperCase()) || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-extrabold text-gray-900">Quản lý khuyến mại</h1><p className="text-sm text-gray-500 mt-0.5">{filtered.length} mã giảm giá</p></div>
        <button onClick={() => setModal({})} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"><Plus className="w-4 h-4" /> Thêm mã</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Tổng mã', value: mockPromos.length, color: 'text-gray-900' },
          { label: 'Đang hoạt động', value: mockPromos.filter(p => p.active).length, color: 'text-green-600' },
          { label: 'Tạm dừng', value: mockPromos.filter(p => !p.active).length, color: 'text-gray-400' },
          { label: 'Tổng lượt dùng', value: mockPromos.reduce((s, p) => s + p.used, 0), color: 'text-primary-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mã, tên..." className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm w-full focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
          {['all', 'active', 'inactive'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {f === 'all' ? 'Tất cả' : f === 'active' ? 'Đang chạy' : 'Tạm dừng'}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['Mã', 'Tên chương trình', 'Loại', 'Giá trị', 'Đã dùng', 'Thời hạn', 'Trạng thái', ''].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-primary-700 bg-primary-50/50">{p.code}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeLabel[p.type].color}`}>{typeLabel[p.type].text}</span></td>
                  <td className="px-5 py-3 font-semibold">{p.type === 'percent' ? `${p.value}%` : p.type === 'fixed' ? `${p.value.toLocaleString('vi-VN')}₫` : 'Free'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min(100, (p.used / p.maxUses) * 100)}%` }} /></div>
                      <span className="text-xs text-gray-500">{p.used}/{p.maxUses}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">{p.startDate} → {p.endDate}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.active ? 'Đang chạy' : 'Tạm dừng'}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setModal(p)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal !== undefined && <PromoModal promo={modal} onClose={() => setModal(undefined)} />}
      {deleteTarget && <DeleteConfirmModal title="Xóa mã khuyến mại" message={`Xóa mã "${deleteTarget.code}"?`} onConfirm={() => {}} onClose={() => setDeleteTarget(null)} />}
    </div>
  );
};

export default AdminPromotions;
