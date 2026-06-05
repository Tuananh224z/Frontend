import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutGrid, Laptop, Tags, Copyright, ShoppingCart, Users, MessageSquare, Star, Settings, LogOut, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-550 text-purple-500 mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-400">Đang kiểm tra quyền quản trị...</p>
        </div>
      </div>
    );
  }

  // Check auth and role
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { label: 'Thống kê', icon: LayoutGrid, path: '/admin' },
    { label: 'Sản phẩm', icon: Laptop, path: '/admin/products' },
    { label: 'Danh mục', icon: Tags, path: '/admin/categories' },
    { label: 'Thương hiệu', icon: Copyright, path: '/admin/brands' },
    { label: 'Đơn hàng', icon: ShoppingCart, path: '/admin/orders' },
    { label: 'Người dùng', icon: Users, path: '/admin/users' },
    { label: 'Đánh giá', icon: Star, path: '/admin/reviews' },
    { label: 'Chatbot AI', icon: MessageSquare, path: '/admin/chatbot' },
    { label: 'Cài đặt hệ thống', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-100">
          <div className="w-9 h-9 bg-purple-650 rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-md shadow-purple-600/20 bg-purple-600">
            TS
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-slate-900">TechStore Admin</h1>
            <span className="text-[10px] font-bold text-purple-650 uppercase tracking-widest text-purple-600">Hệ thống quản trị</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/15'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Back to Store */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-100 hover:text-slate-900 transition-colors border-0 bg-transparent cursor-pointer text-left text-slate-550"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Quay lại cửa hàng</span>
          </button>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-0 bg-transparent cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Đăng xuất hệ thống</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-h-0 min-w-0 bg-slate-50">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-base tracking-tight text-slate-900">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Bảng điều khiển'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-800">{user.fullName}</div>
              <div className="text-[10px] text-purple-650 font-bold uppercase tracking-wider text-purple-600">{user.role}</div>
            </div>
            <div className="w-10 h-10 bg-purple-50 text-purple-750 border border-purple-200 rounded-full flex items-center justify-center font-extrabold text-sm select-none text-purple-600">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="flex-1 p-8 overflow-y-auto min-h-0 min-w-0 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
