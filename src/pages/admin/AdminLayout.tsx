import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, Award, ShoppingBag,
  Star, Users, MessageSquare, ChevronLeft, Menu, X,
  Bell, Search, LogOut, ExternalLink,
  Percent, Crown, Monitor, BellRing, HeadphonesIcon
} from 'lucide-react';

const navGroups = [
  {
    label: 'Hàng hoá',
    items: [
      { to: '/admin',            label: 'Tổng quan',     icon: LayoutDashboard, end: true },
      { to: '/admin/products',   label: 'Sản phẩm',      icon: Package },
      { to: '/admin/categories', label: 'Danh mục',      icon: Tag },
      { to: '/admin/brands',     label: 'Thương hiệu',   icon: Award },
    ],
  },
  {
    label: 'Kinh doanh',
    items: [
      { to: '/admin/orders',     label: 'Đơn hàng',      icon: ShoppingBag },
      { to: '/admin/promotions', label: 'Khuyến mại',    icon: Percent },
      { to: '/admin/pos',        label: 'Bán tại quầy',  icon: Monitor },
    ],
  },
  {
    label: 'Khách hàng',
    items: [
      { to: '/admin/users',      label: 'Người dùng',    icon: Users },
      { to: '/admin/membership', label: 'Hội viên',      icon: Crown },
      { to: '/admin/reviews',    label: 'Đánh giá',      icon: Star },
      { to: '/admin/support',    label: 'Hỗ trợ KH',     icon: HeadphonesIcon },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { to: '/admin/notifications', label: 'Thông báo',  icon: BellRing },
      { to: '/admin/chat',          label: 'Tin nhắn',   icon: MessageSquare },
    ],
  },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center font-extrabold text-white text-sm shrink-0">TS</div>
        {!collapsed && <span className="font-bold text-white text-lg tracking-tight">TechAdmin</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4 px-2">
        {navGroups.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-1">{group.label}</p>
            )}
            {group.items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-3 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Xem trang chủ</span>}
        </a>
        <button
          onClick={() => navigate('/login')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-gray-900 transition-all duration-300 shrink-0 ${collapsed ? 'w-16' : 'w-60'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-gray-900 flex flex-col h-full shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center gap-4 shrink-0">
          {/* Mobile menu */}
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
          {/* Collapse (desktop) */}
          <button onClick={() => setCollapsed(c => !c)} className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-xs hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Tìm kiếm..." className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl text-sm w-full focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-xs uppercase">NA</div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">Nguyễn Văn A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
