import { useState, useRef } from 'react';
import { Plus, Send, ChevronRight, MessageCircle, Clock, CheckCircle, X, Image, Film } from 'lucide-react';

type Ticket = {
  id: string; subject: string; status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high'; createdAt: string; updatedAt: string;
  messages: { sender: 'user' | 'staff'; text: string; time: string; name: string }[];
};

const mockTickets: Ticket[] = [
  {
    id: 'TK-001', subject: 'Laptop bị lỗi màn hình sau 2 tuần sử dụng',
    status: 'in_progress', priority: 'high', createdAt: '01/04/2026 09:15', updatedAt: '01/04/2026 10:30',
    messages: [
      { sender: 'user',  text: 'Cho tôi hỏi laptop mua được 2 tuần thì bị sọc màn hình, phải làm sao ạ?', time: '09:15', name: 'Tôi' },
      { sender: 'staff', text: 'Chào bạn! Bạn có thể chụp ảnh màn hình và gửi cho chúng tôi không? Chúng tôi sẽ hỗ trợ bảo hành ngay.', time: '09:45', name: 'CSKH TechStore' },
      { sender: 'user',  text: 'Đây ạ [ảnh đính kèm]. Bị như thế này từ hôm qua.', time: '10:30', name: 'Tôi' },
    ],
  },
  {
    id: 'TK-002', subject: 'Muốn đổi màu sản phẩm đã mua',
    status: 'resolved', priority: 'low', createdAt: '28/03/2026 14:00', updatedAt: '29/03/2026 08:00',
    messages: [
      { sender: 'user',  text: 'Tôi mua bàn phím màu đen nhưng muốn đổi sang màu trắng được không ạ?', time: '14:00', name: 'Tôi' },
      { sender: 'staff', text: 'Rất tiếc, sản phẩm đã qua 7 ngày nên không đổi màu được ạ. Bạn có thể xem chính sách đổi trả của chúng tôi tại đây.', time: '14:30', name: 'CSKH TechStore' },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.FC<{ className?: string }> }> = {
  open:        { label: 'Đang chờ',      color: 'bg-blue-100 text-blue-700',   icon: Clock },
  in_progress: { label: 'Đang xử lý',   color: 'bg-amber-100 text-amber-700', icon: MessageCircle },
  resolved:    { label: 'Đã giải quyết', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  closed:      { label: 'Đã đóng',       color: 'bg-gray-100 text-gray-500',   icon: X },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  high:   { label: 'Ưu tiên cao', color: 'text-red-600' },
  medium: { label: 'Trung bình',  color: 'text-amber-600' },
  low:    { label: 'Thấp',        color: 'text-gray-400' },
};

const TOPICS = [
  'Lỗi sản phẩm / Bảo hành',
  'Đổi trả hàng',
  'Vấn đề vận chuyển / Giao hàng',
  'Thanh toán / Hoàn tiền',
  'Tài khoản & Đăng nhập',
  'Tư vấn sản phẩm',
  'Khác',
];

const NewTicketModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({ topic: '', subject: '', desc: '' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const canSubmit = form.topic && form.subject && form.desc;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-bold text-gray-900">Tạo yêu cầu hỗ trợ mới</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Chủ đề yêu cầu *</label>
            <select value={form.topic} onChange={e => set('topic', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none">
              <option value="">-- Chọn chủ đề --</option>
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Tiêu đề *</label>
            <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Mô tả ngắn gọn vấn đề của bạn..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Mô tả chi tiết *</label>
            <textarea rows={4} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Vui lòng mô tả chi tiết vấn đề, bao gồm mã đơn hàng nếu có..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Đính kèm (tùy chọn)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary-400 transition-colors cursor-pointer">
              <Image className="w-5 h-5 text-gray-300 mx-auto mb-1" />
              <p className="text-sm text-gray-500">Kéo thả hoặc <span className="text-primary-600 font-medium">chọn file</span></p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, PDF — Tối đa 5MB</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Huỷ</button>
          <button
            disabled={!canSubmit}
            onClick={onClose}
            className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileSupport = () => {
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [reply, setReply] = useState('');
  const [attachments, setAttachments] = useState<{ id: string; url: string; type: 'image' | 'video'; name: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).map(f => ({
      id: Math.random().toString(36).slice(2),
      url: URL.createObjectURL(f),
      type: f.type.startsWith('video') ? 'video' as const : 'image' as const,
      name: f.name,
    }));
    setAttachments(prev => [...prev, ...newFiles]);
  };
  const removeAttachment = (id: string) => setAttachments(prev => prev.filter(a => a.id !== id));
  const sendReply = () => { if (reply.trim() || attachments.length) { setReply(''); setAttachments([]); } };

  if (selected) {
    const cfg = statusConfig[selected.status];
    const StatusIcon = cfg.icon;
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-start gap-4">
          <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors shrink-0 mt-0.5 font-medium">
            ← Quay lại
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 truncate">{selected.subject}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                <StatusIcon className="w-3 h-3" />{cfg.label}
              </span>
              <span className="text-xs text-gray-400">#{selected.id}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">Tạo lúc {selected.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50/40">
          {selected.messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'staff' && (
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mr-3 mt-1">CS</div>
              )}
              <div className={`max-w-[78%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <p className={`text-xs font-medium mb-1 ${msg.sender === 'user' ? 'text-right text-gray-500' : 'text-gray-500'}`}>{msg.name}</p>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                  {msg.text}
                </div>
                <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ml-3 mt-1">NA</div>
              )}
            </div>
          ))}

          {selected.status === 'resolved' && (
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-2 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" /> Yêu cầu đã được giải quyết
              </div>
            </div>
          )}
        </div>

        {/* Reply box */}
        {['open', 'in_progress'].includes(selected.status) && (
          <div className="border-t border-gray-100 bg-white">
            {/* Attachment previews */}
            {attachments.length > 0 && (
              <div className="px-4 pt-3 flex flex-wrap gap-2">
                {attachments.map(a => (
                  <div key={a.id} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                    {a.type === 'image'
                      ? <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex flex-col items-center justify-center">
                          <Film className="w-5 h-5 text-gray-400" />
                          <p className="text-[9px] text-gray-400 mt-0.5 truncate px-1 w-full text-center">{a.name}</p>
                        </div>
                    }
                    <button
                      onClick={() => removeAttachment(a.id)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Input row */}
            <div className="flex items-end gap-2 p-4">
              <div className="flex flex-col gap-1">
                <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
                <button onClick={() => fileRef.current?.click()} title="Đính kèm ảnh / video" className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-colors">
                  <Image className="w-5 h-5" />
                </button>
              </div>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                placeholder="Nhập phản hồi... (Enter để gửi)"
                rows={2}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
              />
              <button
                onClick={sendReply}
                disabled={!reply.trim() && attachments.length === 0}
                className="px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 text-white rounded-xl transition-colors flex items-center gap-2 text-sm font-semibold shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="px-4 pb-3 text-xs text-gray-400">Hỗ trợ ảnh (JPG, PNG) và video (MP4, MOV). Chúng tôi phản hồi trong 24h.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hỗ trợ khách hàng</h2>
          <p className="text-sm text-gray-500 mt-0.5">Gửi yêu cầu hỗ trợ và theo dõi phản hồi từ chúng tôi</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" /> Tạo yêu cầu mới
        </button>
      </div>

      {/* Quick help */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: '📞', title: 'Hotline hỗ trợ', desc: '1800 6868 (miễn phí)', sub: 'T2–T7: 8:00–20:00' },
          { icon: '💬', title: 'Chat trực tuyến', desc: 'Nhắn tin với chúng tôi', sub: 'Phản hồi trong 5 phút' },
          { icon: '📧', title: 'Email hỗ trợ', desc: 'hotro@techstore.vn', sub: 'Phản hồi trong 24h' },
        ].map(card => (
          <div key={card.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer">
            <span className="text-2xl shrink-0">{card.icon}</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{card.title}</p>
              <p className="text-sm text-primary-600 font-medium mt-0.5">{card.desc}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Yêu cầu của tôi</h3>
          <span className="text-sm text-gray-500">{mockTickets.length} yêu cầu</span>
        </div>
        {mockTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-300">
            <MessageCircle className="w-12 h-12 mb-3" />
            <p className="text-sm font-medium">Chưa có yêu cầu nào</p>
            <button onClick={() => setShowNew(true)} className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-semibold">Tạo yêu cầu đầu tiên →</button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {mockTickets.map(ticket => {
              const cfg = statusConfig[ticket.status];
              const pri = priorityConfig[ticket.priority];
              const StatusIcon = cfg.icon;
              return (
                <button key={ticket.id} onClick={() => setSelected(ticket)} className="w-full text-left px-5 py-4 hover:bg-gray-50/70 transition-colors flex items-center gap-4 group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.color}`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 truncate">{ticket.subject}</p>
                      <span className={`text-xs font-semibold shrink-0 ${pri.color}`}>● {pri.label}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 flex-wrap">
                      <span>#{ticket.id}</span>
                      <span>·</span>
                      <span>Tạo lúc {ticket.createdAt}</span>
                      <span>·</span>
                      <span>Cập nhật {ticket.updatedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Câu hỏi thường gặp</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { q: 'Chính sách đổi trả như thế nào?', a: 'Sản phẩm lỗi do nhà sản xuất được đổi trả trong 7 ngày kể từ ngày mua.' },
            { q: 'Thời gian bảo hành là bao lâu?', a: 'Tùy theo sản phẩm, thông thường từ 12–24 tháng. Xem chi tiết trên phiếu bảo hành.' },
            { q: 'Làm sao để theo dõi đơn hàng?', a: 'Vào mục "Đơn mua" trong tài khoản hoặc sử dụng mã vận đơn giao cho bạn qua SMS/Email.' },
            { q: 'Có thể thanh toán bằng những hình thức nào?', a: 'Tiền mặt, chuyển khoản, thẻ ATM/tín dụng, ví điện tử Momo/ZaloPay/VNPay.' },
          ].map((item, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50/70 transition-colors list-none">
                <span className="font-medium text-gray-900 text-sm pr-4">{item.q}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
      </div>

      {showNew && <NewTicketModal onClose={() => setShowNew(false)} />}
    </div>
  );
};

export default ProfileSupport;
