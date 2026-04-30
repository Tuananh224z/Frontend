import { Star, Crown, Award, Gift, ChevronRight } from 'lucide-react';

type Tier = {
  name: string;
  label: string;
  minSpend: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Star;
  benefits: string[];
};

const tiers: Tier[] = [
  {
    name: 'bronze',
    label: 'Thành viên Đồng',
    minSpend: 0,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: Star,
    benefits: ['Tích điểm 1% trên mỗi đơn hàng', 'Ưu đãi sinh nhật 5%', 'Thông báo khuyến mãi sớm'],
  },
  {
    name: 'silver',
    label: 'Thành viên Bạc',
    minSpend: 5000000,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: Award,
    benefits: ['Tích điểm 1.5% trên mỗi đơn hàng', 'Ưu đãi sinh nhật 10%', 'Hỗ trợ ưu tiên', 'Miễn phí giao hàng đơn 1tr+'],
  },
  {
    name: 'gold',
    label: 'Thành viên Vàng',
    minSpend: 20000000,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: Crown,
    benefits: ['Tích điểm 2% trên mỗi đơn hàng', 'Ưu đãi sinh nhật 15%', 'Hỗ trợ ưu tiên 24/7', 'Miễn phí giao hàng mọi đơn', 'Quà tặng hàng quý'],
  },
  {
    name: 'diamond',
    label: 'Thành viên Kim Cương',
    minSpend: 50000000,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Gift,
    benefits: ['Tích điểm 3% trên mỗi đơn hàng', 'Ưu đãi sinh nhật 20%', 'Chuyên viên tư vấn riêng', 'Miễn phí giao hàng mọi đơn', 'Quà tặng hàng tháng', 'Ưu tiên trải nghiệm sản phẩm mới'],
  },
];

const ProfileLoyalty = () => {
  // Mock data - user is Silver, has spent 8.5M
  const totalSpend = 8500000;
  const currentTierIndex = [...tiers].reverse().findIndex(t => totalSpend >= t.minSpend);
  const activeTierIndex = tiers.length - 1 - currentTierIndex;
  const currentTier = tiers[activeTierIndex];
  const nextTier = tiers[activeTierIndex + 1] ?? null;

  const progressToNext = nextTier
    ? Math.min(100, Math.round(((totalSpend - currentTier.minSpend) / (nextTier.minSpend - currentTier.minSpend)) * 100))
    : 100;

  const needed = nextTier ? nextTier.minSpend - totalSpend : 0;

  return (
    <div className="space-y-6">
      {/* Current Status Card */}
      <div className={`bg-white rounded-xl shadow-sm border ${currentTier.borderColor} p-6`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Hạng thành viên hiện tại</p>
            <div className={`flex items-center gap-2 ${currentTier.color}`}>
              <currentTier.icon className="w-8 h-8" />
              <h2 className="text-2xl font-extrabold">{currentTier.label}</h2>
            </div>
          </div>
          <div className={`px-5 py-2 rounded-full ${currentTier.bgColor} ${currentTier.borderColor} border text-sm font-semibold ${currentTier.color}`}>
            🛍️ Tổng chi tiêu: {totalSpend.toLocaleString('vi-VN')}₫
          </div>
        </div>

        {nextTier && (
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>{currentTier.label}</span>
              <span>{nextTier.label}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Chi thêm <span className="font-semibold text-primary-600">{needed.toLocaleString('vi-VN')}₫</span> để đạt {nextTier.label}
            </p>
          </div>
        )}

        {!nextTier && (
          <div className="mt-4 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 font-medium">
            🎉 Bạn đang ở hạng cao nhất — Kim Cương!
          </div>
        )}
      </div>

      {/* Benefits of current tier */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Quyền lợi của bạn</h3>
        <ul className="space-y-3">
          {currentTier.benefits.map(b => (
            <li key={b} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-xs">✓</span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* All Tiers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Các hạng thành viên</h3>
        <div className="space-y-3">
          {tiers.map((tier, idx) => (
            <div
              key={tier.name}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                idx === activeTierIndex
                  ? `${tier.bgColor} ${tier.borderColor} shadow-sm`
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <tier.icon className={`w-6 h-6 ${idx === activeTierIndex ? tier.color : 'text-gray-400'}`} />
                <div>
                  <p className={`font-semibold text-sm ${idx === activeTierIndex ? tier.color : 'text-gray-500'}`}>
                    {tier.label}
                    {idx === activeTierIndex && <span className="ml-2 text-xs bg-white border rounded-full px-2 py-0.5">Của bạn</span>}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {tier.minSpend === 0 ? 'Từ khi đăng ký' : `Chi tiêu từ ${tier.minSpend.toLocaleString('vi-VN')}₫`}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileLoyalty;
