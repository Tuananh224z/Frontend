import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Send, Bell, Smartphone, Mail } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

type Notif = {
  id: number; title: string; body: string; target: 'all' | 'members' | 'specific';
  channel: ('push' | 'email' | 'sms')[]; sentAt: string | null; status: 'draft' | 'sent' | 'scheduled'; scheduled?: string;
};

const mockNotifs: Notif[] = [
  { id: 1, title: 'Flash Sale 50% cuối tuần!', body: 'Giảm đến 50% cho hơn 200 sản phẩm gaming từ 20h tối nay!', target: 'all', channel: ['push', 'email'], sentAt: '01/04/2026 09:00', status: 'sent' },
  { id: 2, title: 'Hạng thành viên của bạn được nâng cấp', body: 'Chúc mừng! Bạn đã đạt hạng Vàng với ưu đãi 5% mọi đơn hàng.', target: 'members', channel: ['push', 'email', 'sms'], sentAt: '31/03/2026 14:00', status: 'sent' },
  { id: 3, title: 'Nhắc nhở: Đơn hàng chờ xác nhận', body: 'Bạn có đơn hàng đang chờ xác nhận. Kiểm tra ngay!', target: 'specific', channel: ['push'], sentAt: null, status: 'scheduled', scheduled: '02/04/2026 08:00' },
  { id: 4, title: 'Thông báo bảo trì hệ thống', body: 'Hệ thống sẽ bảo trì từ 02:00–04:00 ngày 05/04/2026.', target: 'all', channel: ['email'], sentAt: null, status: 'draft' },
];

const statusStyle: Record<string, string> = {
  sent:      'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  draft:     'bg-gray-100 text-gray-500',
};

const NotifModal = ({ notif, onClose }: { notif: Partial<Notif> | null; onClose: () => void }) => {
  const isNew = !notif?.id;
  const [form, setForm] = useState({
    title: notif?.title ?? '', body: notif?.body ?? '',
    target: notif?.target ?? 'all', status: notif?.status ?? 'draft',
    scheduled: notif?.scheduled ?? '',
    channels: notif?.channel ?? ['push'],
  });
  const toggleChannel = (c: 'push' | 'email' | 'sms') =>
    setForm(f => ({ ...f, channels: f.channels.includes(c) ? f.channels.filter(x => x !== c) : [...f.channels, c] }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-extrabold text-gray-900">{isNew ? 'Tạo thông báo' : 'Chỉnh sửa thông báo'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Tiêu đề *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Tiêu đề thông báo..." /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Nội dung *</label><textarea rows={3} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Nội dung chi tiết..." /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-2 block">Đối tượng nhận</label>
            <div className="flex gap-2">
              {(['all', 'members', 'specific'] as const).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, target: t }))} className={`px-3 py-1.5 rounded-xl border text-sm font-semibold transition-colors ${form.target === t ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                  {t === 'all' ? '👥 Tất cả' : t === 'members' ? '👑 Hội viên' : '🎯 Cụ thể'}
                </button>
              ))}
            </div>
          </div>
          <div><label className="text-sm font-medium text-gray-700 mb-2 block">Kênh gửi</label>
            <div className="flex gap-2">
              {([{ key: 'push', icon: Bell, label: 'Push' }, { key: 'email', icon: Mail, label: 'Email' }, { key: 'sms', icon: Smartphone, label: 'SMS' }] as { key: 'push'|'email'|'sms'; icon: React.FC<{className?:string}>; label: string }[]).map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => toggleChannel(key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-colors ${form.channels.includes(key) ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                  <Icon className="w-3.5 h-3.5" />{label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Trạng thái</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Notif['status'] }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none">
                <option value="draft">Nháp</option>
                <option value="scheduled">Lên lịch</option>
                <option value="sent">Gửi ngay</option>
              </select>
            </div>
            {form.status === 'scheduled' && (
              <div><label className="text-sm font-medium text-gray-700 mb-1 block">Thời gian gửi</label><input type="datetime-local" value={form.scheduled} onChange={e => setForm(f => ({ ...f, scheduled: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" /></div>
            )}
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700">Huỷ</button>
          <button onClick={onClose} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />{form.status === 'sent' ? 'Gửi ngay' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminNotifications = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState<Partial<Notif> | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Notif | null>(null);
  const filtered = mockNotifs
    .filter(n => filter === 'all' || n.status === filter)
    .filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-extrabold text-gray-900">Quản lý thông báo</h1><p className="text-sm text-gray-500 mt-0.5">{filtered.length} thông báo</p></div>
        <button onClick={() => setModal({})} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"><Plus className="w-4 h-4" /> Tạo thông báo</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Đã gửi', value: mockNotifs.filter(n => n.status === 'sent').length, color: 'text-green-600' },
          { label: 'Lên lịch', value: mockNotifs.filter(n => n.status === 'scheduled').length, color: 'text-blue-600' },
          { label: 'Nháp', value: mockNotifs.filter(n => n.status === 'draft').length, color: 'text-gray-500' },
          { label: 'Tổng', value: mockNotifs.length, color: 'text-gray-900' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm thông báo..." className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm w-full focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
          {['all', 'sent', 'scheduled', 'draft'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {f === 'all' ? 'Tất cả' : f === 'sent' ? 'Đã gửi' : f === 'scheduled' ? 'Lên lịch' : 'Nháp'}
            </button>
          ))}
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.map(n => (
            <div key={n.id} className="px-5 py-4 hover:bg-gray-50/70 transition-colors flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0"><Bell className="w-5 h-5 text-primary-600" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900">{n.title}</p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyle[n.status]}`}>{n.status === 'sent' ? 'Đã gửi' : n.status === 'scheduled' ? 'Lên lịch' : 'Nháp'}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 truncate">{n.body}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex gap-1">
                    {n.channel.map(c => (
                      <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{c === 'push' ? '🔔 Push' : c === 'email' ? '📧 Email' : '📱 SMS'}</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{n.target === 'all' ? '👥 Tất cả' : n.target === 'members' ? '👑 Hội viên' : '🎯 Cụ thể'}</span>
                  {n.sentAt && <span className="text-xs text-gray-400">Gửi lúc {n.sentAt}</span>}
                  {n.scheduled && !n.sentAt && <span className="text-xs text-blue-500">Lên lịch {n.scheduled}</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setModal(n)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTarget(n)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal !== undefined && <NotifModal notif={modal} onClose={() => setModal(undefined)} />}
      {deleteTarget && <DeleteConfirmModal title="Xóa thông báo" message={`Xóa thông báo "${deleteTarget.title}"?`} onConfirm={() => {}} onClose={() => setDeleteTarget(null)} />}
    </div>
  );
};

export default AdminNotifications;
