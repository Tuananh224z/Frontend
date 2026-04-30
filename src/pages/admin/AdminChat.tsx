import { useState } from 'react';
import { Send, Search, Circle } from 'lucide-react';

const conversations = [
  { id: 1, user: 'Nguyễn Văn A', avatar: 'NA', lastMsg: 'Laptop này có còn hàng không ạ?', time: '2 phút', unread: 2, online: true },
  { id: 2, user: 'Trần Thị B', avatar: 'TB', lastMsg: 'Cho tôi hỏi về chính sách bảo hành?', time: '15 phút', unread: 0, online: true },
  { id: 3, user: 'Lê Văn C', avatar: 'LC', lastMsg: 'Vâng, em cảm ơn shop nhiều!', time: '1 giờ', unread: 0, online: false },
  { id: 4, user: 'Phạm D', avatar: 'PD', lastMsg: 'Ship bao lâu tới Hà Nội ạ?', time: '3 giờ', unread: 1, online: false },
  { id: 5, user: 'Hoàng E', avatar: 'HE', lastMsg: 'OK anh, em đặt ngay', time: 'Hôm qua', unread: 0, online: false },
];

const mockMessages: Record<number, { from: 'user' | 'admin'; text: string; time: string }[]> = {
  1: [
    { from: 'user', text: 'Chào shop, laptop ASUS ROG G15 này còn hàng không ạ?', time: '10:20' },
    { from: 'admin', text: 'Dạ chào em! Hiện tại ROG G15 còn hàng, shop còn 14 chiếc ạ 😊', time: '10:21' },
    { from: 'user', text: 'Laptop này có còn hàng không ạ?', time: '10:23' },
  ],
  2: [
    { from: 'user', text: 'Cho tôi hỏi về chính sách bảo hành của shop?', time: '09:45' },
    { from: 'admin', text: 'Dạ shop bảo hành 12 tháng chính hãng, 30 ngày đổi trả nếu lỗi nhà sản xuất ạ.', time: '09:46' },
  ],
};

const AdminChat = () => {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  const selected = conversations.find(c => c.id === selectedId);
  const messages = mockMessages[selectedId] || [];
  const filtered = conversations.filter(c => c.user.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 h-[calc(100vh-56px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-gray-900">Tin nhắn</h1>
        <p className="text-sm text-gray-500 mt-0.5">Quản lý chat với khách hàng</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex min-h-0">
        {/* Conversation list */}
        <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm cuộc trò chuyện..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedId === c.id ? 'bg-primary-50 border-l-2 border-l-primary-600' : ''}`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-xs">{c.avatar}</div>
                  {c.online && <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-500 fill-green-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-sm">{c.user}</span>
                    <span className="text-xs text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">{c.unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-xs">{selected?.avatar}</div>
              {selected?.online && <Circle className="absolute bottom-0 right-0 w-2.5 h-2.5 text-green-500 fill-green-500" />}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{selected?.user}</p>
              <p className="text-xs text-gray-500">{selected?.online ? 'Đang trực tuyến' : 'Offline'}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${m.from === 'admin' ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
                  <p>{m.text}</p>
                  <p className={`text-[10px] mt-1 ${m.from === 'admin' ? 'text-primary-200' : 'text-gray-400'}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 flex items-center gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setInput('')}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary-500 outline-none"
            />
            <button onClick={() => setInput('')} className="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center transition-colors shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
