import { useState, useRef, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Package,
  Heart,
  MapPin,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Top bar */}
      <div className="bg-primary-700 text-white text-sm py-1">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center">
          <p>
            Hỗ trợ trực tuyến 24/7. Hotline: <strong>0123 456 789</strong>
          </p>
          {/* <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-200">Tin tức</a>
            <a href="#" className="hover:text-primary-200">Tuyển dụng</a>
            <a href="#" className="hover:text-primary-200">Liên hệ</a>
          </div> */}
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-primary-600 hover:opacity-90 transition-opacity"
          >
            <div className="bg-primary-600 text-white p-2 rounded-lg font-bold text-xl leading-none">
              TS
            </div>
            <span className="text-2xl font-bold tracking-tight hidden sm:block">
              TechStore
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                className="w-full pl-4 pr-12 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 shadow-sm"
              />
              <button
                className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-primary-600 rounded-r-full"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Account */}
            {user ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex flex-col items-center justify-center cursor-pointer hover:text-primary-600 group"
                >
                  <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm uppercase ring-2 ring-white group-hover:ring-primary-200 transition-all">
                    {user.initials}
                  </div>
                  <span className="text-sm font-medium mt-1 text-gray-700 group-hover:text-primary-600 transition-colors max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                    >
                      <User className="w-4 h-4" /> Hồ sơ của tôi
                    </Link>
                    <Link
                      to="/profile/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                    >
                      <Package className="w-4 h-4" /> Đơn hàng của tôi
                    </Link>
                    <Link
                      to="/profile/favorites"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                    >
                      <Heart className="w-4 h-4" /> Sản phẩm yêu thích
                    </Link>
                    <Link
                      to="/profile/addresses"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                    >
                      <MapPin className="w-4 h-4" /> Địa chỉ của tôi
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-violet-700 hover:bg-violet-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Trang quản trị
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex flex-col items-center justify-center cursor-pointer hover:text-primary-600 group"
              >
                <User
                  size={24}
                  className="group-hover:text-primary-600 text-gray-700 transition-colors"
                />
                <span className="text-sm font-medium mt-1">Đăng nhập</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="flex flex-col items-center justify-center cursor-pointer hover:text-primary-600 group relative"
            >
              <div className="relative">
                <ShoppingCart
                  size={24}
                  className="group-hover:text-primary-600 text-gray-700 transition-colors"
                />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  2
                </span>
              </div>
              <span className="text-sm font-medium mt-1 hidden md:block">
                Giỏ hàng
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-gray-700">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-gray-100 hidden md:block">
        <div className="max-w-[1200px] mx-auto px-4">
          <ul className="flex items-center gap-8 py-3 text-sm font-medium text-gray-700">
            <li className="flex items-center gap-2 hover:text-primary-600 cursor-pointer text-primary-600">
              <Menu size={20} />
              <span>DANH MỤC SẢN PHẨM</span>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary-600 transition-colors block py-1"
              >
                LAPTOP
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary-600 transition-colors block py-1"
              >
                PC GAMING & VĂN PHÒNG
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary-600 transition-colors block py-1"
              >
                LINH KIỆN MÁY TÍNH
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary-600 transition-colors block py-1"
              >
                MÀN HÌNH
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary-600 transition-colors block py-1"
              >
                PHỤ KIỆN
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-primary-600 transition-colors block py-1"
              >
                KHUYẾN MÃI
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
