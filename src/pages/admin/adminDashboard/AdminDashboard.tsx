import { useState, useEffect } from 'react';
import chatbotService from '../../../services/chatbotService';
import { DollarSign, ShoppingCart, Users, MessageSquare, TrendingUp, AlertCircle, Loader2, Award, Compass } from 'lucide-react';

export default function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [chatbot, setChatbot] = useState<any>(null);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [summaryRes, chatbotRes, userRes] = await Promise.all([
          chatbotService.getStatsSummary(),
          chatbotService.getStatsChatbot(),
          chatbotService.getStatsUsers(),
        ]);

        if (summaryRes.data?.status === 'success') setSummary(summaryRes.data.data);
        if (chatbotRes.data?.status === 'success') setChatbot(chatbotRes.data.data);
        if (userRes.data?.status === 'success') setUserGrowth(userRes.data.data);

      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Lỗi tải dữ liệu thống kê');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-purple-550 text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-950/20 text-red-400 rounded-2xl border border-red-900 max-w-xl mx-auto">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span className="font-semibold">{error}</span>
      </div>
    );
  }

  // Calculate chatbot helpfulness percentage
  const totalFeedback = (chatbot?.feedbackStats?.like || 0) + (chatbot?.feedbackStats?.dislike || 0);
  const helpfulness = totalFeedback > 0 ? Math.round((chatbot.feedbackStats.like / totalFeedback) * 100) : 100;

  return (
    <div className="space-y-8">
      {/* 4 Cards: Revenue, Orders, Users, Chatbot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between shadow-xs hover:border-slate-700 transition-colors">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doanh thu giao hàng</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">{formatPrice(summary?.totalRevenue || 0)}</h3>
            <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Thành công: {summary?.successfulOrdersCount} đơn</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 flex items-center justify-center text-emerald-450 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between shadow-xs hover:border-slate-700 transition-colors">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số đơn hàng</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">{summary?.totalOrders || 0}</h3>
            <p className="text-[10px] text-purple-400 font-bold flex items-center gap-0.5">
              <span>Hệ thống TechStore</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-450 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Users */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between shadow-xs hover:border-slate-700 transition-colors">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng khách hàng</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">{summary?.totalUsers || 0}</h3>
            <p className="text-[10px] text-blue-450 text-blue-450/80 font-bold text-blue-400">
              <span>Đã đăng ký tài khoản</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-450 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* AI Sessions */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex items-center justify-between shadow-xs hover:border-slate-700 transition-colors">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cuộc gọi AI Chatbot</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">{chatbot?.totalSessions || 0}</h3>
            <p className="text-[10px] text-pink-400 font-bold">
              <span>Độ hữu ích: {helpfulness}%</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-450 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Sản phẩm bán chạy nhất
            </h3>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">TOP 5</span>
          </div>

          {summary?.bestSellers?.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm font-semibold">Chưa có giao dịch bán hàng thành công</div>
          ) : (
            <div className="space-y-4">
              {summary?.bestSellers?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0]?.startsWith('http') ? item.product.images[0] : `http://localhost:5000${item.product?.images?.[0]}`}
                      alt={item.product?.name}
                      className="w-10 h-10 object-contain bg-slate-900 rounded-xl p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[300px]">{item.product?.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">Đơn giá: {formatPrice(item.product?.price)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-extrabold text-white">Đã bán: {item.totalSold}</div>
                    <div className="text-[10px] font-bold text-emerald-400">Doanh thu: {formatPrice(item.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top AI Chatbot Recommendations */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-400" />
              Sản phẩm AI gợi ý nhiều nhất
            </h3>
            <span className="text-[10px] bg-purple-500/10 text-purple-400 font-bold px-2 py-0.5 rounded-full border border-purple-500/20">CHATBOT</span>
          </div>

          {chatbot?.topAIRecommendations?.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm font-semibold">Chưa có gợi ý từ chatbot</div>
          ) : (
            <div className="space-y-4">
              {chatbot?.topAIRecommendations?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0]?.startsWith('http') ? item.product.images[0] : `http://localhost:5000${item.product?.images?.[0]}`}
                      alt={item.product?.name}
                      className="w-10 h-10 object-contain bg-slate-900 rounded-xl p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[300px]">{item.product?.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{formatPrice(item.product?.price)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-extrabold text-purple-400">Được gợi ý:</div>
                    <div className="text-xs font-extrabold text-white">{item.recommendTimes} lần</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User signup monthly stats & chatbot analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User signup monthly visual overview */}
        <div className="md:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
            <TrendingUp className="w-4.5 h-4.5 text-blue-400" /> Lượng khách hàng mới hàng tháng
          </h3>

          <div className="grid grid-cols-12 gap-2 h-48 items-end pt-6 border-b border-slate-800">
            {userGrowth.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center group relative h-full justify-end">
                {/* Tooltip on hover */}
                <span className="absolute bottom-full mb-1 bg-slate-950 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-slate-800">
                  {stat.count}
                </span>

                {/* Bar */}
                <div
                  style={{ height: `${Math.min(stat.count * 10, 100) || 5}%` }}
                  className={`w-full max-w-[15px] sm:max-w-[25px] rounded-t-lg transition-all duration-500 cursor-pointer ${stat.count > 0 ? 'bg-gradient-to-t from-blue-650 to-blue-500 bg-blue-600' : 'bg-slate-800'
                    }`}
                />
                <span className="text-[10px] font-bold text-slate-500 mt-2">T{stat.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chatbot Feedback Breakdown */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Đánh giá phản hồi Chatbot</h3>

          <div className="space-y-4 pt-4">
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>Hài lòng (Like)</span>
              <span className="text-white">{chatbot?.feedbackStats?.like || 0} lượt</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
              <div
                style={{ width: `${helpfulPercent(chatbot?.feedbackStats?.like, chatbot?.feedbackStats?.dislike)}%` }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-400 pt-2">
              <span>Chưa hài lòng (Dislike)</span>
              <span className="text-white">{chatbot?.feedbackStats?.dislike || 0} lượt</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
              <div
                style={{ width: `${100 - helpfulPercent(chatbot?.feedbackStats?.like, chatbot?.feedbackStats?.dislike)}%` }}
                className="bg-red-500 h-full rounded-full"
              />
            </div>

            <div className="text-center bg-slate-950 p-4 rounded-2xl border border-slate-850 mt-4">
              <div className="text-2xl font-black text-white">{helpfulness}%</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tỷ lệ tương tác tích cực</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function helpfulPercent(like = 0, dislike = 0) {
  const total = like + dislike;
  if (total === 0) return 100;
  return Math.round((like / total) * 100);
}
