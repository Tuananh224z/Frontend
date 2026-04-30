import { useState, useRef } from 'react';
import { Search, X, Send, MessageCircle, Image, Film } from 'lucide-react';

type Ticket = {
  id: string; customer: string; email: string; subject: string;
  priority: 'low' | 'medium' | 'high'; status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string; lastReply: string; unread: number;
  messages: { sender: 'customer' | 'staff'; text: string; time: string }[];
};

const mockTickets: Ticket[] = [
  { id: 'TK-001', customer: 'Nguyễn Văn A', email: 'nva@email.com', subject: 'Laptop bị lỗi màn hình sau 2 tuần sử dụng', priority: 'high', status: 'open', createdAt: '01/04/2026 09:15', lastReply: '01/04/2026 10:30', unread: 2, messages: [
    { sender: 'customer', text: 'Cho tôi hỏi laptop mua được 2 tuần thì bị sọc màn hình, phải làm sao ạ?', time: '09:15' },
    { sender: 'staff', text: 'Chào bạn! Bạn có thể chụp ảnh màn hình và gửi cho chúng tôi không? Chúng tôi sẽ hỗ trợ bảo hành ngay.', time: '09:45' },
    { sender: 'customer', text: 'Đây ạ [ảnh đính kèm]. Bị như thế này từ hôm qua.', time: '10:30' },
  ]},
  { id: 'TK-002', customer: 'Trần Thị B', email: 'ttb@email.com', subject: 'Chưa nhận được đơn hàng sau 5 ngày', priority: 'high', status: 'in_progress', createdAt: '31/03/2026 14:00', lastReply: '01/04/2026 08:00', unread: 0, messages: [
    { sender: 'customer', text: 'Đơn #ORD-002 đặt từ 27/03 mà vẫn chưa nhận được hàng ạ.', time: '14:00' },
    { sender: 'staff', text: 'Xin lỗi vì sự bất tiện này! Chúng tôi đang liên hệ với đơn vị vận chuyển để kiểm tra.', time: '15:30' },
  ]},
  { id: 'TK-003', customer: 'Lê Văn C', email: 'lvc@email.com', subject: 'Hỏi về chính sách đổi trả RAM', priority: 'low', status: 'resolved', createdAt: '30/03/2026 10:00', lastReply: '30/03/2026 11:00', unread: 0, messages: [
    { sender: 'customer', text: 'RAM tôi mua có được đổi trả không nếu không tương thích?', time: '10:00' },
    { sender: 'staff', text: 'Bạn có thể đổi trả trong 7 ngày nếu sản phẩm không tương thích. Mang theo hóa đơn nhé!', time: '10:30' },
    { sender: 'customer', text: 'Cảm ơn bạn nhiều!', time: '11:00' },
  ]},
  { id: 'TK-004', customer: 'Phạm Thị D', email: 'ptd@email.com', subject: 'Yêu cầu hoàn tiền đơn hàng', priority: 'medium', status: 'open', createdAt: '01/04/2026 16:00', lastReply: '01/04/2026 16:00', unread: 1, messages: [
    { sender: 'customer', text: 'Tôi muốn hoàn tiền đơn #ORD-004 vì hàng không như mô tả.', time: '16:00' },
  ]},
];

const priorityStyle: Record<string, string> = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low:    'bg-gray-100 text-gray-600',
};
const statusStyle: Record<string, string> = {
  open:        'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  resolved:    'bg-green-100 text-green-700',
  closed:      'bg-gray-100 text-gray-500',
};
const statusLabel: Record<string, string> = { open: 'Mở', in_progress: 'Đang xử lý', resolved: 'Đã giải quyết', closed: 'Đóng' };

const AdminSupport = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [attachments, setAttachments] = useState<{ id: string; url: string; type: 'image' | 'video'; name: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setAttachments(prev => [...prev, ...Array.from(files).map(f => ({
      id: Math.random().toString(36).slice(2),
      url: URL.createObjectURL(f),
      type: f.type.startsWith('video') ? 'video' as const : 'image' as const,
      name: f.name,
    }))]);
  };
  const removeAttachment = (id: string) => setAttachments(prev => prev.filter(a => a.id !== id));

  const sendReply = () => {
    if (!reply.trim() && attachments.length === 0) return;
    if (!selected) return;
    setReply('');
    setAttachments([]);
  };

  const filtered = mockTickets
    .filter((t: Ticket) => statusFilter === 'all' || t.status === statusFilter)
    .filter((t: Ticket) => t.subject.toLowerCase().includes(search.toLowerCase()) || t.customer.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 h-full">
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-extrabold text-gray-900">Hỗ trợ khách hàng</h1><p className="text-sm text-gray-500 mt-0.5">Quản lý yêu cầu hỗ trợ</p></div>
        <div className="flex gap-2">
          {['all', 'open', 'in_progress', 'resolved'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {s === 'all' ? `Tất cả (${mockTickets.length})` : s === 'open' ? `Mở (${mockTickets.filter(t => t.status === 'open').length})` : s === 'in_progress' ? 'Đang xử lý' : 'Đã giải quyết'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 h-[calc(100vh-230px)]">
        {/* Ticket list */}
        <div className={`${selected ? 'hidden lg:flex' : 'flex'} lg:col-span-2 flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden`}>
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm yêu cầu..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.map(t => (
              <button key={t.id} onClick={() => setSelected(t)} className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${selected?.id === t.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-gray-900 text-sm truncate">{t.subject}</p>
                  {t.unread > 0 && <span className="w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">{t.unread}</span>}
                </div>
                <p className="text-xs text-gray-500 mb-2">{t.customer} · {t.createdAt}</p>
                <div className="flex gap-1.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[t.status]}`}>{statusLabel[t.status]}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityStyle[t.priority]}`}>{t.priority === 'high' ? 'Cao' : t.priority === 'medium' ? 'Trung' : 'Thấp'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation */}
        <div className={`${selected ? 'flex' : 'hidden lg:flex'} lg:col-span-3 flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden`}>
          {selected ? (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-start gap-3">
                <button onClick={() => setSelected(null)} className="lg:hidden p-1 text-gray-500"><X className="w-5 h-5" /></button>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{selected.subject}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{selected.customer} · {selected.email}</p>
                </div>
                <select value={selected.status} className="border border-gray-200 rounded-xl px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-primary-500 outline-none shrink-0">
                  <option value="open">Mở</option>
                  <option value="in_progress">Đang xử lý</option>
                  <option value="resolved">Đã giải quyết</option>
                  <option value="closed">Đóng</option>
                </select>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {selected.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'staff' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'customer' && (
                      <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shrink-0 mr-2 mt-0.5">{selected.customer[0]}</div>
                    )}
                    <div className={`max-w-[75%] ${msg.sender === 'staff' ? 'bg-primary-600 text-white rounded-2xl rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'} px-4 py-3`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'staff' ? 'text-primary-200' : 'text-gray-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply */}
              <div className="border-t border-gray-100 bg-white">
                {/* Attachment previews */}
                {attachments.length > 0 && (
                  <div className="px-4 pt-3 flex flex-wrap gap-2">
                    {attachments.map(a => (
                      <div key={a.id} className="relative group w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                        {a.type === 'image'
                          ? <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex flex-col items-center justify-center">
                              <Film className="w-4 h-4 text-gray-400" />
                              <p className="text-[8px] text-gray-400 mt-0.5 truncate px-1 w-full text-center">{a.name}</p>
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
                  <div>
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
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary-500 outline-none resize-none"
                  />
                  <button
                    onClick={sendReply}
                    disabled={!reply.trim() && attachments.length === 0}
                    className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 text-white rounded-xl transition-colors flex items-center gap-1.5 text-sm font-semibold shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <MessageCircle className="w-16 h-16 mb-3" />
              <p className="text-sm font-medium">Chọn yêu cầu để xem</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
