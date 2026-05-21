import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-slate-900">

          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="px-2.5 py-1 bg-red-650 rounded-lg text-white font-extrabold text-sm tracking-tight">
                TS
              </div>
              <span className="text-lg font-bold tracking-tight text-red-500">TechStore</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Hệ thống bán lẻ laptop uy tín hàng đầu Việt Nam. Cung cấp máy tính xách tay chính hãng chất lượng cao, phục vụ mọi nhu cầu từ học tập, văn phòng đến gaming chuyên nghiệp.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 bg-slate-900 hover:bg-red-650 hover:text-white rounded-lg transition-colors cursor-pointer">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-red-650 hover:text-white rounded-lg transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-slate-900 hover:bg-red-650 hover:text-white rounded-lg transition-colors cursor-pointer">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Liên kết nhanh</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Tất cả sản phẩm</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Laptop Gaming</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Laptop Văn Phòng</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Laptop Đồ Họa</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Tin tức công nghệ</a></li>
            </ul>
          </div>

          {/* Support / Policies */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Chính sách & Hỗ trợ</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Phương thức thanh toán</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Vận chuyển & Giao hàng</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Câu hỏi thường gặp (FAQs)</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Liên hệ & Đăng ký</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Số 1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>1900 1234 - (024) 3456 789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>support@techstore.vn</span>
              </div>
            </div>

            {/* Newsletter form */}
            <div className="pt-2">
              <div className="relative flex">
                <input
                  type="email"
                  placeholder="Nhận tin tức ưu đãi..."
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl pl-4 pr-10 py-2.5 text-xs focus:outline-hidden focus:border-red-650"
                />
                <button className="absolute right-1 top-1 bottom-1 px-2.5 bg-red-650 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600">
          <p>© {new Date().getFullYear()} TechStore. Tất cả các quyền được bảo lưu.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-400">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-slate-400">Chính sách bảo mật</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
