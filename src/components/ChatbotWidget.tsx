import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Link } from 'react-router-dom';
import chatbotService from '../services/chatbotService';
import { MessageCircle, X, Send, Sparkles, Laptop, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { ChatMessage as Message } from '../types/chatbot';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const getAvatarUrl = (avatar?: string) => {
  if (!avatar) return '';
  if (avatar.startsWith('http')) return avatar;
  return `${BACKEND_URL}${avatar.startsWith('/') ? '' : '/'}${avatar}`;
};

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Lấy hoặc tạo sessionToken mới lưu vào localStorage dựa trên user
  const [sessionToken, setSessionToken] = useState('');

  useEffect(() => {
    const key = user?._id ? `chatSessionToken_${user._id}` : 'chatSessionToken_guest';
    let token = localStorage.getItem(key);
    if (!token) {
      token = `session-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;
      localStorage.setItem(key, token);
    }
    setSessionToken(token);
  }, [user?._id]);

  // Khởi tạo Socket.io & Tải lịch sử tin nhắn
  useEffect(() => {
    if (!sessionToken) return;
    setMessages([]);

    // 1. Tải lịch sử chat
    const fetchHistory = async () => {
      try {
        const response = await chatbotService.getSessionMessages(sessionToken);
        if (response.data?.status === 'success') {
          setMessages(response.data.data);
        }
      } catch (err) {
        console.error('Không thể tải lịch sử chat:', err);
      }
    };
    fetchHistory();

    // 2. Kết nối Socket.io
    const socket = io(BACKEND_URL, {
      transports: ['websocket'],
      upgrade: false
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Nhận câu trả lời từ chatbot
    socket.on('receiveMessage', (data: Message) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, data]);
      setFeedback(null); // Reset feedback cho câu hỏi mới
    });

    // Lắng nghe sự kiện xác nhận feedback
    socket.on('feedbackUpdated', (data: { status: string; feedback: 'like' | 'dislike' | null }) => {
      if (data.status === 'success') {
        setFeedback(data.feedback);
      }
    });

    socket.on('error', (err: { message: string }) => {
      setIsTyping(false);
      console.error('Lỗi socket:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionToken]);

  // Tự động cuộn xuống dưới khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Gửi tin nhắn
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessageText = inputText;
    setInputText('');

    // Thêm tin nhắn của User vào danh sách hiển thị
    const newUserMessage: Message = {
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);

    // Gửi tin nhắn qua Socket
    if (socketRef.current) {
      socketRef.current.emit('sendMessage', {
        sessionToken,
        messageText: userMessageText,
        userId: user?._id || null // Gửi kèm userId nếu người dùng đã đăng nhập
      });
    }
  };

  // Gửi feedback thích/không thích câu trả lời của AI
  const handleFeedback = (type: 'like' | 'dislike') => {
    if (socketRef.current) {
      socketRef.current.emit('sendFeedback', {
        sessionToken,
        feedback: feedback === type ? null : type // Nếu bấm lại lần nữa thì cancel feedback
      });
    }
  };

  // Helper to parse simple markdown links [text](url) and raw internal paths /product/slug
  const formatMessageText = (text: string) => {
    if (!text) return '';
    
    // Regex to match either markdown link [text](url) OR raw product path /product/slug
    const regex = /\[([^\]]+)\]\(([^)]+)\)|(\/product\/[a-zA-Z0-9-]+)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      
      // Append text before the match
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }
      
      if (match[3]) {
        // Raw internal link
        const rawUrl = match[3];
        parts.push(
          <Link
            key={`link-${matchIndex}`}
            to={rawUrl}
            className="text-amber-400 hover:text-amber-300 font-extrabold underline underline-offset-2 hover:decoration-amber-300 transition-colors duration-200"
          >
            Xem chi tiết sản phẩm
          </Link>
        );
      } else {
        const linkText = match[1];
        const linkUrl = match[2];
        
        // Check if it's an internal link
        const isInternal = linkUrl.startsWith('/');
        
        if (isInternal) {
          parts.push(
            <Link
              key={`link-${matchIndex}`}
              to={linkUrl}
              className="text-amber-400 hover:text-amber-300 font-extrabold underline underline-offset-2 hover:decoration-amber-300 transition-colors duration-200"
            >
              {linkText}
            </Link>
          );
        } else {
          parts.push(
            <a
              key={`link-${matchIndex}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-extrabold underline underline-offset-2 hover:decoration-amber-300 transition-colors duration-200"
            >
              {linkText}
            </a>
          );
        }
      }
      
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <>
      {/* Floating Buttons Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 items-center">
        
        {/* Zalo Button */}
        <a
          href="https://zalo.me/0342055095"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#0068ff] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center font-extrabold text-[13px] tracking-tight cursor-pointer"
          title="Chat qua Zalo"
        >
          Zalo
        </a>

        {/* Messenger Button */}
        <a
          href="https://m.me"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-gradient-to-tr from-[#a855f7] via-[#ec4899] to-[#3b82f6] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
          title="Chat qua Messenger"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.46 5.518 3.753 7.184.197.143.327.368.327.618v2.445c0 .39.426.633.766.44l2.748-1.554a.89.89 0 0 1 .494-.094c.628.12 1.28.181 1.912.181 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.258 12.39-2.316-2.47a.453.453 0 0 0-.648-.024l-3.32 2.5a.31.31 0 0 1-.462-.396l3.32-4.4a.453.453 0 0 0-.016-.54l-2.3-2.454a.453.453 0 0 1 .64-.645l2.316 2.47a.453.453 0 0 0 .648.024l3.32-2.5a.31.31 0 0 1 .462.396l-3.32 4.4a.453.453 0 0 0 .016.54l2.3 2.454a.453.453 0 0 1-.64.645z"/>
          </svg>
        </a>

        {/* Phone Button */}
        <a
          href="tel:0123456789"
          className="w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer animate-pulse"
          style={{ animationDuration: '3s' }}
          title="Gọi điện hotline"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>

        {/* AI Chatbot Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-linear-to-tr from-violet-600 to-indigo-600 text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center relative cursor-pointer"
          title="Trợ lý AI tư vấn"
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5 animate-pulse" />}
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          )}
        </button>

      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden glass-panel-dark border border-slate-700/50 transition-all duration-300 animate-slide-up">
          
          {/* Header */}
          <div className="p-4 bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  Trợ Lý AI Tư Vấn
                </h3>
                <span className="text-[10px] text-indigo-200 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                  {isConnected ? 'Trực tuyến' : 'Mất kết nối'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/65 custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center py-8 px-4 space-y-3">
                <div className="w-12 h-12 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto text-indigo-400 border border-indigo-500/20">
                  <Laptop className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">Chào mừng bạn đến với TechStore!</h4>
                <p className="text-xs text-slate-500 max-w-[250px] mx-auto leading-relaxed">
                  Tôi có thể tư vấn dòng máy phù hợp nhất theo ngân sách, sở thích chơi game hoặc nhu cầu văn phòng của bạn. Hãy thử hỏi tôi nhé!
                </p>
              </div>
            )}

            {/* Message List */}
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              if (isUser) {
                return (
                  <div
                    key={index}
                    className="flex items-start justify-end gap-2.5 w-full"
                  >
                    <div className="flex flex-col items-end gap-1 max-w-[80%]">
                      <span className="text-[10px] text-slate-400 font-bold mr-1">Bạn</span>
                      <div className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-900/10">
                        <p className="whitespace-pre-wrap">{formatMessageText(msg.text)}</p>
                      </div>
                    </div>
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200 text-xs font-black shadow-xs overflow-hidden select-none">
                      {user?.avatar ? (
                        <img src={getAvatarUrl(user.avatar)} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        (user?.fullName || 'Guest')[0].toUpperCase()
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 w-full"
                  >
                    {/* Bot Avatar */}
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 border border-indigo-400/30 text-white shadow-xs select-none">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <div className="flex flex-col items-start gap-1 max-w-[80%]">
                      <span className="text-[10px] text-slate-400 font-bold ml-1">TechStore AI</span>
                      <div className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-slate-800/80 text-slate-100 rounded-bl-none border border-slate-700/30">
                        <p className="whitespace-pre-wrap">{formatMessageText(msg.text)}</p>
                      </div>

                      {/* Feedback buttons for bot answers (Only for the latest bot message) */}
                      {index === messages.length - 1 && (
                        <div className="flex items-center gap-2 mt-1 pl-1">
                          <button
                            onClick={() => handleFeedback('like')}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              feedback === 'like'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'bg-transparent text-slate-500 border-slate-800 hover:text-slate-300'
                            }`}
                            title="Câu trả lời hữu ích"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback('dislike')}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              feedback === 'dislike'
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                : 'bg-transparent text-slate-500 border-slate-800 hover:text-slate-300'
                            }`}
                            title="Câu trả lời chưa tốt"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-2.5 w-full">
                {/* Bot Avatar */}
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 border border-indigo-400/30 text-white shadow-xs select-none">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="flex flex-col items-start gap-1 max-w-[80%]">
                  <span className="text-[10px] text-slate-400 font-bold ml-1">TechStore AI</span>
                  <div className="bg-slate-800/80 border border-slate-700/30 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-225"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
