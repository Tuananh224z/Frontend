import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, Package, MapPin, LayoutGrid, LogOut, LogIn } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      {/* 1. Red Top Bar */}
      <div className="bg-red-700 text-white text-center py-2 text-xs font-semibold tracking-wide">
        Hỗ trợ trực tuyến 24/7. Hotline: <span className="font-bold">0123 456 789</span>
      </div>

      {/* 2. Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo: TS TechStore */}
          <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer group shrink-0">
            <div className="px-3 py-1.5 bg-red-650 rounded-lg text-white font-extrabold text-lg tracking-tight bg-red-600">
              TS
            </div>
            <span className="text-xl font-bold tracking-tight text-red-600 group-hover:text-red-700 transition-colors">
              TechStore
            </span>
          </div>

          {/* Search bar (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8 relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-6 pr-12 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-full focus:bg-white text-slate-800 focus:border-red-500 outline-hidden transition-all duration-300"
            />
            <Search 
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer hover:text-red-500 transition-colors" 
            />
          </div>

          {/* Right actions: User avatar and Shopping cart */}
          <div className="hidden md:flex items-center gap-8 shrink-0">
            {/* User Profile with Dropdown */}
            <div className="relative">
              {user ? (
                <>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex flex-col items-center justify-center cursor-pointer focus:outline-hidden group select-none bg-transparent border-0 p-0"
                  >
                    <div className="w-8 h-8 bg-rose-50 text-rose-600 border border-rose-100 rounded-full flex items-center justify-center font-extrabold text-sm group-hover:bg-rose-100 transition-all duration-300 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        user.fullName[0].toUpperCase()
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1 truncate max-w-[80px]">{user.fullName.split(' ').pop()}</span>
                  </button>

                  {isDropdownOpen && (
                    <>
                      {/* Invisible backdrop to close the dropdown */}
                      <div 
                        className="fixed inset-0 z-30 cursor-default" 
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-slate-200/80 shadow-xl py-3 z-40 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* User Profile Info */}
                        <div className="px-4 py-2 flex flex-col gap-0.5">
                          <span className="font-bold text-slate-800 text-sm truncate">{user.fullName}</span>
                          <span className="text-xs text-slate-400 font-medium truncate">{user.email}</span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100 my-2"></div>

                        {/* Links */}
                        <div className="flex flex-col">
                          <Link 
                            to="/profile" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-650 hover:bg-slate-50 hover:text-slate-900 transition-colors font-semibold"
                          >
                            <User className="w-4.5 h-4.5 text-slate-400" />
                            <span>Hồ sơ của tôi</span>
                          </Link>

                          <Link 
                            to="/orders" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-650 hover:bg-slate-50 hover:text-slate-900 transition-colors font-semibold"
                          >
                            <Package className="w-4.5 h-4.5 text-slate-400" />
                            <span>Đơn hàng của tôi</span>
                          </Link>

                          <Link 
                            to="/addresses" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-650 hover:bg-slate-50 hover:text-slate-900 transition-colors font-semibold"
                          >
                            <MapPin className="w-4.5 h-4.5 text-slate-400" />
                            <span>Địa chỉ của tôi</span>
                          </Link>

                          {user.role === 'admin' && (
                            <Link 
                              to="/admin" 
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50/50 transition-colors font-bold"
                            >
                              <LayoutGrid className="w-4.5 h-4.5 text-purple-500" />
                              <span>Trang quản trị</span>
                            </Link>
                          )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100 my-2"></div>

                        {/* Logout Button */}
                        <button 
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors font-bold cursor-pointer text-left border-0 bg-transparent"
                        >
                          <LogOut className="w-4.5 h-4.5 text-red-500" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4.5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-full text-xs transition-colors shadow-sm select-none decoration-none"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </Link>
              )}
            </div>

            {/* Shopping Cart */}
            <button 
              onClick={() => navigate('/cart')} 
              className="relative flex flex-col items-center justify-center text-slate-700 hover:text-red-600 transition-all duration-300 cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-slate-700 hover:text-red-600 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2.5 flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-extrabold text-white bg-amber-500 rounded-full border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1">Giỏ hàng</span>
            </button>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="flex md:hidden items-center gap-4">
            <button 
              onClick={() => navigate('/cart')} 
              className="relative p-2 text-slate-600 hover:text-red-600 rounded-lg"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-rose-500 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. Secondary Navigation Bar with Red Bottom Border */}
      <div className="border-t border-slate-100 bg-white border-b-2 border-red-650">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-10 sm:h-12">
            <div className="flex items-center gap-8 text-xs sm:text-sm font-bold">
              {/* Danh mục sản phẩm */}
              <div 
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 text-red-650 uppercase tracking-wide cursor-pointer py-2 hover:opacity-85 transition-all"
              >
                <Menu className="w-4 h-4" />
                <span>Danh mục sản phẩm</span>
              </div>
              
              {/* Các liên kết menu ngang */}
              <nav className="hidden md:flex items-center gap-8 text-slate-700 uppercase tracking-wide">
                <Link to="/category/laptop" className="hover:text-red-650 transition-colors">Laptop</Link>
                <Link to="/category/linh-kien" className="hover:text-red-650 transition-colors">Linh kiện</Link>
                <Link to="/category/man-hinh" className="hover:text-red-650 transition-colors">Màn hình</Link>
                <Link to="/category/pc-gaming" className="hover:text-red-650 transition-colors">PC Gaming</Link>
                <Link to="/category/phu-kien" className="hover:text-red-650 transition-colors">Phụ kiện</Link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 py-4 px-4 space-y-3 shadow-md">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-4 pr-10 py-2 text-sm bg-slate-100 text-slate-800 rounded-full border border-transparent focus:border-red-500 outline-hidden"
            />
            <Search 
              onClick={handleSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer hover:text-red-500 transition-colors" 
            />
          </div>
          <nav className="flex flex-col gap-2 font-semibold text-slate-700">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-red-650 bg-red-50 rounded-lg">Trang chủ</Link>
            <Link to="/category/laptop" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors">Laptop</Link>
            <Link to="/category/linh-kien" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors">Linh kiện</Link>
            <Link to="/category/man-hinh" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors">Màn hình</Link>
            <Link to="/category/pc-gaming" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors">PC Gaming</Link>
            <Link to="/category/phu-kien" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors">Phụ kiện</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
