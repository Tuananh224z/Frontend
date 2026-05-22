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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800">
          <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-purple-550/20">
            TS
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white">TechStore Admin</h1>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Hệ thống quản trị</span>
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
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Back to Store */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-900/50">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800/80 hover:text-slate-100 transition-colors border-0 bg-transparent cursor-pointer text-left"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Quay lại cửa hàng</span>
          </button>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors border-0 bg-transparent cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Đăng xuất hệ thống</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-h-0 min-w-0 bg-slate-950">
        {/* Top Header */}
        <header className="h-20 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-base tracking-tight text-white">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Bảng điều khiển'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-200">{user.fullName}</div>
              <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{user.role}</div>
            </div>
            <div className="w-10 h-10 bg-purple-950 text-purple-450 border border-purple-900 rounded-full flex items-center justify-center font-extrabold text-sm select-none text-purple-400">
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
