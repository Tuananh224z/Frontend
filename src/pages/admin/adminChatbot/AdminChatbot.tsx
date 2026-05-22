import { useState, useEffect } from 'react';
import chatbotService from '../../../services/chatbotService';
import { Search, Award, CheckCircle2, AlertCircle, Loader2, ThumbsUp, ThumbsDown, Calendar, Bot, User, Settings, Sparkles, MessageCircle } from 'lucide-react';

export default function AdminChatbot() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [popularQuestions, setPopularQuestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'sessions' | 'questions' | 'config'>('sessions');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Selected Session details
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Chatbot configuration states
  const [model, setModel] = useState('llama-3.1-8b-instant');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const fetchSessionsAndQuestions = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [sessionsRes, questionsRes, settingsRes] = await Promise.all([
        chatbotService.getChatSessions(),
        chatbotService.getPopularQuestions(),
        chatbotService.getSystemSettings(),
      ]);

      if (sessionsRes.data?.status === 'success') {
        setSessions(sessionsRes.data.data);
      }
      if (questionsRes.data?.status === 'success') {
        setPopularQuestions(questionsRes.data.data);
      }
      if (settingsRes.data?.status === 'success') {
        const config = settingsRes.data.data?.chatbotConfig || {};
        setModel(config.model || 'llama-3.1-8b-instant');
        setSystemPrompt(config.systemPrompt || '');
        setTemperature(config.temperature ?? 0.7);
        setMaxTokens(config.maxTokens ?? 500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể tải thông tin chatbot');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionsAndQuestions();
  }, []);

  const fetchSessionMessages = async (sessionToken: string) => {
    try {
      setIsLoadingMessages(true);
      const response = await chatbotService.getSessionMessages(sessionToken);
      if (response.data?.status === 'success') {
        setMessages(response.data.data);
      }
    } catch (err: any) {
      setError('Không thể tải tin nhắn của phiên trò chuyện này');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSelectSession = (session: any) => {
    setSelectedSession(session);
    fetchSessionMessages(session.sessionToken);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingConfig(true);
      setError('');
      setSuccess('');

      const response = await chatbotService.updateSystemSettings({
        chatbotConfig: {
          model,
          systemPrompt,
          temperature: parseFloat(temperature.toString()),
          maxTokens: parseInt(maxTokens.toString(), 10),
        },
      });

      if (response.data?.status === 'success') {
        setSuccess('Cập nhật cấu hình Chatbot AI thành công!');
        // Refresh values
        const config = response.data.data?.chatbotConfig || {};
        setModel(config.model || 'llama-3.1-8b-instant');
        setSystemPrompt(config.systemPrompt || '');
        setTemperature(config.temperature ?? 0.7);
        setMaxTokens(config.maxTokens ?? 500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lưu cấu hình thất bại');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredSessions = sessions.filter((session) => {
    const userMatches =
      session.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      session.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      session.sessionToken.toLowerCase().includes(search.toLowerCase());
    return userMatches;
  });

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-6 py-3 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${activeTab === 'sessions'
            ? 'border-purple-500 text-white'
            : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
          Lịch sử trò chuyện
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-6 py-3 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${activeTab === 'questions'
            ? 'border-purple-500 text-white'
            : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
          Câu hỏi phổ biến (FAQs)
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-6 py-3 text-sm font-extrabold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${activeTab === 'config'
            ? 'border-purple-500 text-white'
            : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
          <Settings className="w-4 h-4" />
          Cấu hình Chatbot AI
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/20 text-emerald-400 text-sm font-semibold rounded-xl border border-emerald-900">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-950/20 text-red-400 text-sm font-semibold rounded-xl border border-red-900">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state for main data */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <>
          {/* TAB 1: Chat sessions history */}
          {activeTab === 'sessions' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sessions List */}
              <div className="lg:col-span-1 space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm tên, email hoặc token..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-bold text-slate-250"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 max-h-[600px] overflow-y-auto space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Phiên hoạt động ({filteredSessions.length})</h3>
                  {filteredSessions.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500 font-semibold">Không tìm thấy phiên nào</div>
                  ) : (
                    filteredSessions.map((session) => (
                      <div
                        key={session._id}
                        onClick={() => handleSelectSession(session)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${selectedSession?._id === session._id
                          ? 'bg-purple-950/40 border-purple-800/80 text-white shadow-xs'
                          : 'bg-slate-950 border-slate-850 hover:bg-slate-850/30'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-200">
                            {session.user?.fullName || 'Khách vãng lai'}
                          </span>
                          {session.feedback && (
                            <span>
                              {session.feedback === 'like' ? (
                                <ThumbsUp className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/10" />
                              ) : (
                                <ThumbsDown className="w-3.5 h-3.5 text-red-400 fill-red-500/10" />
                              )}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate font-semibold">Token: {session.sessionToken.slice(0, 18)}...</div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formatDate(session.updatedAt)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat details window */}
              <div className="lg:col-span-2">
                {selectedSession ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-[650px]">
                    {/* Header */}
                    <div className="border-b border-slate-850 pb-4 flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-extrabold text-sm text-white">
                          Hội thoại với {selectedSession.user?.fullName || 'Khách vãng lai'}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                          Email: {selectedSession.user?.email || 'Chưa đăng ký'} | Token: {selectedSession.sessionToken}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider block">Phản hồi:</span>
                        <span className={`text-xs font-bold ${selectedSession.feedback === 'like' ? 'text-emerald-400' : selectedSession.feedback === 'dislike' ? 'text-red-400' : 'text-slate-400'
                          }`}>
                          {selectedSession.feedback === 'like' ? 'Hài lòng 👍' : selectedSession.feedback === 'dislike' ? 'Chưa hài lòng 👎' : 'Chưa đánh giá'}
                        </span>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
                      {isLoadingMessages ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center py-12 text-xs text-slate-500 font-bold">Không có tin nhắn nào trong phiên này</div>
                      ) : (
                        messages.map((msg, index) => {
                          const isBot = msg.sender === 'bot';
                          return (
                            <div key={index} className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                              {/* Avatar */}
                              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold ${isBot
                                ? 'bg-purple-950 border-purple-900 text-purple-400'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                                }`}>
                                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                              </div>

                              {/* Message bubble */}
                              <div className="space-y-1.5">
                                <div className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${isBot
                                  ? 'bg-slate-955 bg-slate-950 border border-slate-850 text-slate-200 rounded-tl-none'
                                  : 'bg-purple-650 bg-purple-600 text-white rounded-tr-none'
                                  }`}>
                                  {msg.text}
                                </div>
                                <span className="text-[9px] text-slate-500 font-bold block text-right px-1">
                                  {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </span>

                                {/* Suggested Products in Message */}
                                {isBot && msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                                  <div className="mt-2.5 space-y-1.5">
                                    <span className="text-[10px] text-slate-400 font-bold block">✨ Sản phẩm đề xuất trong cuộc thoại:</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {msg.suggestedProducts.map((p: any, idx: number) => (
                                        <div key={idx} className="bg-slate-950 border border-slate-850 rounded-xl p-2 flex items-center gap-2">
                                          <img
                                            src={p.images?.[0]?.startsWith('http') ? p.images[0] : `http://localhost:5000${p.images?.[0]}`}
                                            alt={p.name}
                                            className="w-8 h-8 object-contain bg-slate-900 rounded-lg p-0.5"
                                          />
                                          <div className="min-w-0 text-[10px]">
                                            <div className="font-bold text-slate-200 truncate">{p.name}</div>
                                            <div className="text-purple-400 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[650px] flex flex-col items-center justify-center text-slate-550 text-slate-500">
                    <MessageCircle className="w-16 h-16 text-slate-800 mb-4 animate-pulse" />
                    <p className="font-bold text-sm">Vui lòng chọn một phiên trò chuyện ở danh sách bên trái</p>
                    <p className="text-xs text-slate-600 mt-1">để kiểm tra chi tiết nội dung tin nhắn và gợi ý AI</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Popular inquiries FAQs */}
          {activeTab === 'questions' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="border-b border-slate-850 pb-3 flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Top câu hỏi khách hàng hay đặt cho AI
                </h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold px-2 py-0.5 rounded-full">FAQs</span>
              </div>

              {popularQuestions.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm font-semibold">Chưa thu thập đủ dữ liệu câu hỏi từ khách hàng</div>
              ) : (
                <div className="space-y-4">
                  {popularQuestions.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-850">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-purple-950 border border-purple-900 text-purple-400 flex items-center justify-center font-extrabold text-xs shrink-0 select-none">
                          {idx + 1}
                        </div>
                        <p className="text-xs font-semibold text-slate-200 italic truncate max-w-xl">"{item.question}"</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Tần suất:</span>
                        <span className="text-sm font-black text-white bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl">{item.count} lần</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Chatbot Configuration systemPrompt */}
          {activeTab === 'config' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl mx-auto space-y-6">
              <div className="border-b border-slate-850 pb-3">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Cấu hình Prompt & Tham số AI Chatbot
                </h3>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Chọn Model AI <span className="text-purple-400">*</span>
                    </label>
                    <select
                      value={['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'].includes(model) ? model : 'custom'}
                      onChange={(e) => {
                        if (e.target.value !== 'custom') {
                          setModel(e.target.value);
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-bold text-slate-200"
                    >
                      <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Mặc định - Phản hồi nhanh)</option>
                      <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Mạnh mẽ - Phản hồi tốt hơn)</option>
                      <option value="custom">Tùy chọn khác (Nhập thủ công bên cạnh)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Nhập Model tùy chỉnh
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: llama-3.1-8b-instant"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-bold text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    System Instruction / Prompt (Chỉ dẫn hệ thống) <span className="text-purple-400">*</span>
                  </label>
                  <p className="text-[10px] text-slate-500 font-bold mb-2">
                    Quyết định tính cách, phạm vi tư vấn và thái độ của AI Chatbot đối với người mua hàng.
                  </p>
                  <textarea
                    rows={6}
                    required
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Ví dụ: Bạn là một nhân viên kỹ thuật cửa hàng laptop thân thiện..."
                    className="w-full px-4 py-3 bg-slate-955 bg-slate-950 border border-slate-850 rounded-2xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200 leading-relaxed resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Temperature */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Độ sáng tạo (Temperature): <span className="text-white font-extrabold">{temperature}</span>
                    </label>
                    <p className="text-[9px] text-slate-500 font-bold mb-3">
                      Giá trị thấp (0.1 - 0.5) giúp câu trả lời nhất quán, thực tế. Giá trị cao (0.8 - 1.2) giúp trả lời linh hoạt, bay bổng.
                    </p>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="flex-1 accent-purple-600 h-1 bg-slate-850 rounded-lg cursor-pointer appearance-none"
                      />
                    </div>
                  </div>

                  {/* Max Tokens */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Giới hạn độ dài phản hồi (Max Tokens)
                    </label>
                    <p className="text-[9px] text-slate-500 font-bold mb-3">
                      Độ dài phản hồi tối đa của Chatbot (1 token ≈ 4 ký tự tiếng Việt).
                    </p>
                    <input
                      type="number"
                      min="100"
                      max="2000"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-bold text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-850">
                  <button
                    type="submit"
                    disabled={isSavingConfig}
                    className="px-5 py-2.5 bg-purple-650 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors border-0 shadow-lg shadow-purple-550/15 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSavingConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lưu cấu hình hệ thống'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
