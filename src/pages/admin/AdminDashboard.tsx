import { useState, useEffect } from 'react';
import chatbotService from '../../services/chatbotService';
import { DollarSign, ShoppingCart, Users, MessageSquare, TrendingUp, AlertCircle, Loader2, Award, Compass } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [chatbot, setChatbot] = useState<any>(null);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const getProductImage = (images: string[]) => {
    if (!images || images.length === 0) return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500';
    const firstImg = images[0];
    if (!firstImg) return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500';
    if (firstImg.startsWith('http://') || firstImg.startsWith('https://')) return firstImg;
    const cleanPath = firstImg.startsWith('/') ? firstImg : `/${firstImg}`;
    return `${BACKEND_URL}${cleanPath}`;
  };

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
      <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 max-w-xl mx-auto">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span className="font-semibold">{error}</span>
      </div>
    );
  }

  // Calculate chatbot helpfulness percentage
  const totalFeedback = (chatbot?.feedbackStats?.like || 0) + (chatbot?.feedbackStats?.dislike || 0);
  const helpfulness = totalFeedback > 0 ? Math.round((chatbot.feedbackStats.like / totalFeedback) * 100) : 100;

  // Filter out items with missing/deleted products to prevent NaN or empty displays
  const validBestSellers = summary?.bestSellers?.filter((item: any) => item?.product && item?.product?.name) || [];
  const validTopAIRecommendations = chatbot?.topAIRecommendations?.filter((item: any) => item?.product && item?.product?.name) || [];

  return (
    <div className="space-y-8 text-left">
      {/* 4 Cards: Revenue, Orders, Users, Chatbot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-xs hover:shadow-md hover:border-slate-300 transition-all">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doanh thu giao hàng</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{formatPrice(summary?.totalRevenue || 0)}</h3>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Thành công: {summary?.successfulOrdersCount} đơn</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-xs hover:shadow-md hover:border-slate-300 transition-all">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng số đơn hàng</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{summary?.totalOrders || 0}</h3>
            <p className="text-[10px] text-purple-600 font-bold flex items-center gap-0.5">
              <span>Hệ thống TechStore</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Users */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-xs hover:shadow-md hover:border-slate-300 transition-all">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng khách hàng</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{summary?.totalUsers || 0}</h3>
            <p className="text-[10px] text-blue-600 font-bold">
              <span>Đã đăng ký tài khoản</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* AI Sessions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-xs hover:shadow-md hover:border-slate-300 transition-all">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cuộc gọi AI Chatbot</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{chatbot?.totalSessions || 0}</h3>
            <p className="text-[10px] text-pink-600 font-bold">
              <span>Độ hữu ích: {helpfulness}%</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 border border-pink-100 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Sản phẩm bán chạy nhất
            </h3>
            <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2 py-0.5 rounded-full border border-amber-200">TOP 5</span>
          </div>

          {validBestSellers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-semibold">Chưa có giao dịch bán hàng thành công</div>
          ) : (
            <div className="space-y-4">
              {validBestSellers.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={getProductImage(item.product?.images)}
                      alt={item.product?.name}
                      className="w-10 h-10 object-contain bg-white rounded-xl p-1 shrink-0 border border-slate-100"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[300px]">{item.product?.name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">Đơn giá: {formatPrice(item.product?.price)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-extrabold text-slate-900">Đã bán: {item.totalSold}</div>
                    <div className="text-[10px] font-bold text-emerald-600">Doanh thu: {formatPrice(item.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top AI Chatbot Recommendations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-500" />
              Sản phẩm AI gợi ý nhiều nhất
            </h3>
            <span className="text-[10px] bg-purple-50 text-purple-600 font-bold px-2 py-0.5 rounded-full border border-purple-100">CHATBOT</span>
          </div>

          {validTopAIRecommendations.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-semibold">Chưa có gợi ý từ chatbot</div>
          ) : (
            <div className="space-y-4">
              {validTopAIRecommendations.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={getProductImage(item.product?.images)}
                      alt={item.product?.name}
                      className="w-10 h-10 object-contain bg-white rounded-xl p-1 shrink-0 border border-slate-100"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[300px]">{item.product?.name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">{formatPrice(item.product?.price)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-extrabold text-purple-600">Được gợi ý:</div>
                    <div className="text-xs font-extrabold text-slate-900">{item.recommendTimes} lần</div>
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
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <TrendingUp className="w-4.5 h-4.5 text-blue-500" /> Lượng khách hàng mới hàng tháng
          </h3>

          <div className="grid grid-cols-12 gap-2 h-48 items-end pt-6 border-b border-slate-100">
            {userGrowth.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center group relative h-full justify-end">
                {/* Tooltip on hover */}
                <span className="absolute bottom-full mb-1 bg-slate-900 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-slate-850">
                  {stat.count}
                </span>

                {/* Bar */}
                <div
                  style={{ height: `${Math.min(stat.count * 10, 100) || 5}%` }}
                  className={`w-full max-w-[15px] sm:max-w-[25px] rounded-t-lg transition-all duration-500 cursor-pointer ${stat.count > 0 ? 'bg-gradient-to-t from-blue-600 to-blue-400 bg-blue-500' : 'bg-slate-100'
                    }`}
                />
                <span className="text-[10px] font-bold text-slate-400 mt-2">T{stat.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chatbot Feedback Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Đánh giá phản hồi Chatbot</h3>

          <div className="space-y-4 pt-4">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Hài lòng (Like)</span>
              <span className="text-slate-800">{chatbot?.feedbackStats?.like || 0} lượt</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                style={{ width: `${helpfulPercent(chatbot?.feedbackStats?.like, chatbot?.feedbackStats?.dislike)}%` }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-500 pt-2">
              <span>Chưa hài lòng (Dislike)</span>
              <span className="text-slate-800">{chatbot?.feedbackStats?.dislike || 0} lượt</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                style={{ width: `${100 - helpfulPercent(chatbot?.feedbackStats?.like, chatbot?.feedbackStats?.dislike)}%` }}
                className="bg-red-500 h-full rounded-full"
              />
            </div>

            <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-4">
              <div className="text-2xl font-black text-slate-900">{helpfulness}%</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tỷ lệ tương tác tích cực</div>
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
