import { useState } from 'react';
import { Search, Trash2, Gift, X, Settings, Save } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

type Tier = { name: string; min: number; max: number; color: string; icon: string; discount: number };

const DEFAULT_TIERS: Tier[] = [
  { name: 'Đồng',     min: 0,         max: 5000000,   color: 'bg-orange-100 text-orange-700',  icon: '🥉', discount: 2  },
  { name: 'Bạc',      min: 5000000,   max: 20000000,  color: 'bg-gray-100 text-gray-600',      icon: '🥈', discount: 3  },
  { name: 'Vàng',     min: 20000000,  max: 50000000,  color: 'bg-yellow-100 text-yellow-700',  icon: '🥇', discount: 5  },
  { name: 'Bạch kim', min: 50000000,  max: 100000000, color: 'bg-blue-100 text-blue-700',      icon: '💎', discount: 7  },
  { name: 'Kim cương',min: 100000000, max: 999999999, color: 'bg-violet-100 text-violet-700',  icon: '💠', discount: 10 },
];

const mockMembers = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nva@email.com', phone: '0901234567', joined: '01/01/2025', totalSpent: 145000000, points: 1450, orders: 12 },
  { id: 2, name: 'Trần Thị B',   email: 'ttb@email.com', phone: '0912345678', joined: '15/02/2025', totalSpent: 48000000,  points: 480,  orders: 5  },
  { id: 3, name: 'Lê Văn C',     email: 'lvc@email.com', phone: '0923456789', joined: '20/03/2025', totalSpent: 22000000,  points: 220,  orders: 8  },
  { id: 4, name: 'Phạm Thị D',   email: 'ptd@email.com', phone: '0934567890', joined: '05/04/2025', totalSpent: 7000000,   points: 70,   orders: 3  },
  { id: 5, name: 'Hoàng Văn E',  email: 'hve@email.com', phone: '0945678901', joined: '10/04/2025', totalSpent: 1500000,   points: 15,   orders: 2  },
];
type Member = typeof mockMembers[0];

const fmt = (n: number) => (n / 1000000).toFixed(0) + 'M';

/* ─── Tier Settings Modal ─── */
const TierSettingsModal = ({ tiers, onClose }: { tiers: Tier[]; onClose: (t: Tier[]) => void }) => {
  const [local, setLocal] = useState<Tier[]>(JSON.parse(JSON.stringify(tiers)));
  const update = (i: number, field: keyof Tier, val: string | number) =>
    setLocal(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: typeof val === 'string' ? Number(val) || val : val } : t));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => onClose(tiers)} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="font-extrabold text-gray-900">Cài đặt hạng thành viên</h2>
            <p className="text-xs text-gray-500 mt-0.5">Điều chỉnh mức chi tiêu & ưu đãi cho từng hạng</p>
          </div>
          <button onClick={() => onClose(tiers)} className="p-1.5 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Table header */}
          <div className="grid grid-cols-5 gap-2 px-3 text-xs font-bold text-gray-500 uppercase">
            <span>Hạng</span>
            <span>Chi tiêu từ (₫)</span>
            <span>Chi tiêu đến (₫)</span>
            <span>Chiết khấu (%)</span>
            <span>Điểm/1K₫</span>
          </div>
          {local.map((t, i) => (
            <div key={t.name} className={`grid grid-cols-5 gap-2 items-center bg-gray-50 rounded-xl p-3 border border-gray-100`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{t.icon}</span>
                <span className="text-sm font-bold text-gray-800">{t.name}</span>
              </div>
              <input
                type="number"
                value={t.min}
                onChange={e => update(i, 'min', e.target.value)}
                disabled={i === 0}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-1 focus:ring-primary-500 outline-none disabled:bg-gray-100 disabled:text-gray-400 w-full"
              />
              <input
                type="number"
                value={t.max === 999999999 ? '' : t.max}
                onChange={e => update(i, 'max', e.target.value)}
                disabled={i === local.length - 1}
                placeholder={i === local.length - 1 ? 'Không giới hạn' : ''}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-1 focus:ring-primary-500 outline-none disabled:bg-gray-100 disabled:text-gray-400 w-full"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0" max="100"
                  value={t.discount}
                  onChange={e => update(i, 'discount', e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-1 focus:ring-primary-500 outline-none w-full"
                />
                <span className="text-gray-500 text-sm shrink-0">%</span>
              </div>
              <div className="text-sm text-gray-600 font-semibold text-center">{i + 1} điểm</div>
            </div>
          ))}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
            <strong>Lưu ý:</strong> Mức chi tiêu "đến" của hạng này sẽ tự động là mức chi tiêu "từ" của hạng tiếp theo.
            Lưu cài đặt để áp dụng ngay lập tức.
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button onClick={() => onClose(tiers)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Huỷ</button>
          <button onClick={() => onClose(local)} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Point Modal ─── */
const PointModal = ({ member, onClose }: { member: Member; onClose: () => void }) => {
  const [pts, setPts] = useState('');
  const [note, setNote] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900">Cộng / Trừ điểm</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">{member.name.split(' ').slice(-1)[0][0]}</div>
            <div><p className="font-semibold text-gray-900 text-sm">{member.name}</p><p className="text-xs text-gray-500">Điểm hiện tại: <strong>{member.points} điểm</strong></p></div>
          </div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Số điểm (+/-)</label><input type="number" value={pts} onChange={e => setPts(e.target.value)} placeholder="VD: 100 hoặc -50" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Ghi chú</label><input value={note} onChange={e => setNote(e.target.value)} placeholder="Lý do..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700">Huỷ</button>
          <button onClick={onClose} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 text-sm font-semibold">Cập nhật</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main ─── */
const AdminMembership = () => {
  const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS);
  const [showSettings, setShowSettings] = useState(false);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [pointTarget, setPointTarget] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);

  const getTier = (spent: number) => tiers.slice().reverse().find(t => spent >= t.min) ?? tiers[0];

  const filtered = mockMembers.filter(m => {
    const tier = getTier(m.totalSpent);
    if (tierFilter !== 'all' && tier.name !== tierFilter) return false;
    return m.name.toLowerCase().includes(search.toLowerCase()) || m.email.includes(search);
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Quản lý hội viên</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} thành viên</p>
        </div>
        <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
          <Settings className="w-4 h-4" /> Cài đặt hạng
        </button>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {tiers.map(t => {
          const count = mockMembers.filter(m => getTier(m.totalSpent).name === t.name).length;
          return (
            <div key={t.name} onClick={() => setTierFilter(tierFilter === t.name ? 'all' : t.name)}
              className={`bg-white rounded-2xl border-2 p-4 text-center cursor-pointer transition-all hover:shadow-md ${tierFilter === t.name ? 'border-primary-500' : 'border-gray-100'}`}>
              <p className="text-2xl mb-1">{t.icon}</p>
              <p className="font-bold text-sm text-gray-800">{t.name}</p>
              <p className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${t.color}`}>{count} thành viên</p>
              <p className="text-xs text-gray-400 mt-1">-{t.discount}%</p>
              <p className="text-[10px] text-gray-400">từ {fmt(t.min)}₫</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm thành viên..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['Thành viên', 'Hạng', 'Tổng chi tiêu', 'Điểm tích lũy', 'Đơn hàng', 'Ngày tham gia', 'Thao tác'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(m => {
                const tier = getTier(m.totalSpent);
                const idx = tiers.indexOf(tier);
                const next = tiers[idx + 1];
                const progress = next ? Math.min(100, ((m.totalSpent - tier.min) / (next.min - tier.min)) * 100) : 100;
                return (
                  <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0">{m.name.split(' ').slice(-1)[0][0]}</div>
                        <div><p className="font-semibold text-gray-900">{m.name}</p><p className="text-xs text-gray-400">{m.email}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tier.color}`}>{tier.icon} {tier.name}</span>
                        {next && <div className="mt-1.5 w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${progress}%` }} /></div>}
                        {next && <p className="text-[10px] text-gray-400 mt-0.5">{((next.min - m.totalSpent) / 1000000).toFixed(1)}M₫ lên {next.name}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">{m.totalSpent.toLocaleString('vi-VN')}₫</td>
                    <td className="px-5 py-4"><span className="font-bold text-primary-600">{m.points}</span> điểm</td>
                    <td className="px-5 py-4 text-center font-semibold">{m.orders}</td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{m.joined}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => setPointTarget(m)} title="Cộng/Trừ điểm" className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-500 transition-colors"><Gift className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(m)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showSettings && <TierSettingsModal tiers={tiers} onClose={t => { setTiers(t); setShowSettings(false); }} />}
      {pointTarget   && <PointModal member={pointTarget} onClose={() => setPointTarget(null)} />}
      {deleteTarget  && <DeleteConfirmModal title="Xóa hội viên" message={`Xóa hội viên "${deleteTarget.name}"?`} onConfirm={() => {}} onClose={() => setDeleteTarget(null)} />}
    </div>
  );
};

export default AdminMembership;
