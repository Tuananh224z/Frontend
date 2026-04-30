import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Store, Image, Film, Minimize2, Maximize2 } from 'lucide-react';

/* ─── Types ─── */
type Msg = {
  id: string;
  sender: 'user' | 'bot' | 'staff';
  text?: string;
  media?: { url: string; type: 'image' | 'video'; name: string };
  time: string;
};

/* ─── Mock AI responses ─── */
const AI_RESPONSES: Record<string, string> = {
  default: 'Xin chào! Tôi là trợ lý AI của TechStore. Tôi có thể giúp bạn tư vấn sản phẩm, so sánh cấu hình, hay giải đáp thắc mắc về đơn hàng. Bạn cần hỗ trợ gì ạ?',
  laptop: 'Với nhu cầu của bạn, tôi gợi ý dòng laptop gaming ASUS ROG hoặc MSI. Nếu bạn làm đồ họa, Dell XPS hay MacBook Pro sẽ phù hợp hơn. Bạn muốn tôi so sánh chi tiết không?',
  giá: 'Tôi có thể giúp bạn tìm sản phẩm trong ngưỡng giá mong muốn. Bạn có thể cho tôi biết budget của bạn là bao nhiêu không ạ?',
  ram: 'RAM khuyến nghị cho gaming là 16GB DDR5. Nếu dùng đồ họa nặng, 32GB sẽ tốt hơn. TechStore đang có RAM Corsair 32GB giảm 15%!',
  bảo: 'Tất cả sản phẩm tại TechStore đều có bảo hành chính hãng 12-24 tháng. Laptop thường 24 tháng, phụ kiện 12 tháng.',
  ship: 'TechStore giao hàng nhanh 2 giờ nội thành HCM & Hà Nội. Miễn phí ship đơn từ 300.000₫!',
  đổi: 'Chính sách đổi trả 7 ngày nếu sản phẩm lỗi kỹ thuật. Sản phẩm phải còn nguyên hộp và phụ kiện đầy đủ.',
};

const getAIReply = (text: string): string => {
  const lower = text.toLowerCase();
  for (const [key, val] of Object.entries(AI_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return val;
  }
  return AI_RESPONSES.default;
};

const now = () =>
  new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

const STAFF_MSGS: Msg[] = [
  { id: 's0', sender: 'staff', text: 'Xin chào! Tôi là nhân viên tư vấn của TechStore. Bạn cần hỗ trợ gì ạ? 😊', time: now() },
];

const AI_INIT: Msg[] = [
  { id: 'a0', sender: 'bot', text: AI_RESPONSES.default, time: now() },
];

/* ─── Chat bubble component ─── */
const Bubble = ({ msg }: { msg: Msg }) => {
  const isUser = msg.sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
      {!isUser && (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1 ${msg.sender === 'bot' ? 'bg-violet-600 text-white' : 'bg-primary-600 text-white'}`}>
          {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : 'CS'}
        </div>
      )}
      <div className={`max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {msg.text && (
          <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
            {msg.text}
          </div>
        )}
        {msg.media && (
          <div className="mt-1 rounded-xl overflow-hidden border border-gray-200 max-w-[200px]">
            {msg.media.type === 'image'
              ? <img src={msg.media.url} alt={msg.media.name} className="w-full object-cover" />
              : (
                <div className="bg-gray-100 p-3 flex items-center gap-2">
                  <Film className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-xs text-gray-600 truncate">{msg.media.name}</p>
                </div>
              )
            }
          </div>
        )}
        <p className="text-[10px] text-gray-400 mt-1">{msg.time}</p>
      </div>
      {isUser && (
        <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1">
          NA
        </div>
      )}
    </div>
  );
};

/* ─── Main Widget ─── */
const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<'shop' | 'ai'>('shop');
  const [shopMsgs, setShopMsgs] = useState<Msg[]>(STAFF_MSGS);
  const [aiMsgs, setAiMsgs] = useState<Msg[]>(AI_INIT);
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<{ id: string; url: string; type: 'image' | 'video'; name: string }[]>([]);
  const [typing, setTyping] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgs = tab === 'shop' ? shopMsgs : aiMsgs;
  const setMsgs = tab === 'shop' ? setShopMsgs : setAiMsgs;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [shopMsgs, aiMsgs, typing]);

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

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;
    const t = now();

    // Add user message(s)
    const newMsgs: Msg[] = [];
    if (trimmed) newMsgs.push({ id: Date.now().toString(), sender: 'user', text: trimmed, time: t });
    attachments.forEach(a => newMsgs.push({ id: a.id + '-m', sender: 'user', media: a, time: t }));
    setMsgs(prev => [...prev, ...newMsgs]);
    setText('');
    setAttachments([]);

    // AI auto-reply
    if (tab === 'ai' && trimmed) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setAiMsgs(prev => [...prev, {
          id: Date.now().toString() + '-bot',
          sender: 'bot',
          text: getAIReply(trimmed),
          time: now(),
        }]);
      }, 1000 + Math.random() * 800);
    }

    // Staff auto-reply simulation
    if (tab === 'shop' && trimmed) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setShopMsgs(prev => [...prev, {
          id: Date.now().toString() + '-staff',
          sender: 'staff',
          text: 'Cảm ơn bạn đã liên hệ! Nhân viên của chúng tôi sẽ phản hồi trong vài phút. 🙏',
          time: now(),
        }]);
      }, 1500);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const widgetH = expanded ? 'h-[600px]' : 'h-[440px]';
  const widgetW = expanded ? 'w-96' : 'w-80';

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        title="Chat tư vấn"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] font-bold flex items-center justify-center">1</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className={`fixed bottom-22 right-5 z-50 ${widgetW} ${widgetH} bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-200`}
          style={{ bottom: '82px' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 pt-4 pb-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">TechStore</p>
                  <p className="text-primary-200 text-[11px]">● Đang hoạt động</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setExpanded(e => !e)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white">
                  {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex">
              {[
                { key: 'shop', icon: Store, label: 'Chat với Shop' },
                { key: 'ai',   icon: Bot,   label: 'AI Tư Vấn' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key as 'shop' | 'ai')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                    tab === key
                      ? 'border-white text-white'
                      : 'border-transparent text-primary-200 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/40">
            {msgs.map(msg => <Bubble key={msg.id} msg={msg} />)}

            {/* Typing indicator */}
            {typing && (
              <div className={`flex gap-2 ${tab === 'ai' ? '' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${tab === 'ai' ? 'bg-violet-600 text-white' : 'bg-primary-600 text-white'}`}>
                  {tab === 'ai' ? <Bot className="w-4 h-4" /> : 'CS'}
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* AI quick suggestions */}
            {tab === 'ai' && msgs.length <= 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {['Tư vấn laptop', 'Chính sách bảo hành', 'Miễn phí ship', 'So sánh RAM'].map(s => (
                  <button
                    key={s}
                    onClick={() => { setText(s); }}
                    className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-primary-400 hover:text-primary-600 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Attachment previews — only for Shop tab */}
          {tab === 'shop' && attachments.length > 0 && (
            <div className="px-3 pt-2 flex flex-wrap gap-1.5 bg-white border-t border-gray-100">
              {attachments.map(a => (
                <div key={a.id} className="relative group w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                  {a.type === 'image'
                    ? <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Film className="w-4 h-4 text-gray-400" /></div>
                  }
                  <button
                    onClick={() => removeAttachment(a.id)}
                    className="absolute top-0 right-0 w-4 h-4 bg-black/60 text-white rounded-bl-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-end gap-2 px-3 py-3 bg-white border-t border-gray-100">
            {/* Upload — only for Shop tab */}
            {tab === 'shop' && (
              <>
                <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
                <button onClick={() => fileRef.current?.click()} title="Đính kèm ảnh / video" className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-colors shrink-0">
                  <Image className="w-5 h-5" />
                </button>
              </>
            )}
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder={tab === 'ai' ? 'Hỏi AI tư vấn...' : 'Nhắn tin với shop...'}
              rows={1}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none resize-none max-h-24"
              style={{ overflowY: 'auto' }}
            />
            <button
              onClick={send}
              disabled={!text.trim() && (tab === 'shop' ? attachments.length === 0 : true)}
              className="p-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 text-white rounded-xl transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
