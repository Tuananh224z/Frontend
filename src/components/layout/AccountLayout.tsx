import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Package, MapPin } from 'lucide-react';

export default function AccountLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 bg-slate-50 min-h-screen">
        <div className="w-8 h-8 border-4 border-red-650 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const activePath = location.pathname;

  const menuItems = [
    {
      name: 'Hồ sơ của tôi',
      path: '/profile',
      icon: User,
    },
    {
      name: 'Đơn mua',
      path: '/orders',
      icon: Package,
    },
    {
      name: 'Địa chỉ của tôi',
      path: '/addresses',
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-100 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-red-650 transition-colors">Trang chủ</Link>
            <span className="text-slate-350">/</span>
            <span className="text-slate-800">Tài khoản của tôi</span>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0 bg-white p-5 rounded-3xl border border-slate-200/50 shadow-xs">
            {/* User Profile Info Summary */}
            <div className="flex items-center gap-4.5 mb-6 pb-5 border-b border-slate-100">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 border border-rose-100 rounded-full flex items-center justify-center font-extrabold text-lg shadow-xs overflow-hidden shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user?.fullName ? user.fullName[0].toUpperCase() : 'U'
                )}
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-sm text-slate-800 truncate block">
                  {user?.fullName || 'Khách hàng'}
                </span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                </span>
              </div>
            </div>

            {/* Sidebar Menu */}
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3.5 px-4 py-3 text-xs font-extrabold rounded-2xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-red-50 text-red-600'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-red-650' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Subpage Content Panel */}
          <div className="flex-1 w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/50 shadow-xs min-h-[550px] relative">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
