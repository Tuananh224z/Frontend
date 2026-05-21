import { Star } from 'lucide-react';

export default function ProductReviews() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-xs mt-8 text-left">
      <h3 className="text-lg font-extrabold text-slate-900 mb-6">
        Đánh giá sản phẩm
      </h3>

      {/* Summary Section */}
      <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-12 mb-6">
        {/* Left: Overall rating score */}
        <div className="flex flex-col items-center justify-center shrink-0 w-32">
          <span className="text-5xl font-black text-slate-900 leading-none">0</span>
          <div className="flex items-center gap-0.5 my-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4.5 h-4.5 text-slate-200" />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-400">0 đánh giá</span>
        </div>

        {/* Right: Breakdown list */}
        <div className="flex-1 w-full max-w-xl flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3 w-full">
              <span className="text-xs font-bold text-slate-500 w-3 text-right">{star}</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <span className="text-xs font-medium text-slate-400 w-4 text-right">0</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-6"></div>

      {/* Purchase Eligibility Alert Box */}
      <div className="p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-sm text-slate-500 font-semibold mb-8">
        Bạn cần mua sản phẩm này để có thể gửi đánh giá.
      </div>

      {/* Empty State Section */}
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        {/* Speech bubble plus icon */}
        <div className="p-4.5 bg-slate-50 text-slate-300 rounded-2xl border border-slate-100">
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="12" y1="9" x2="12" y2="15" />
            <line x1="9" y1="12" x2="15" y2="12" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-400">Chưa có đánh giá nào cho sản phẩm này.</p>
      </div>
    </div>
  );
}
