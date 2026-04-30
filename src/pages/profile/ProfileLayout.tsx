import { Outlet, NavLink } from 'react-router-dom';
import { User, Package, Heart, LogOut, MapPin, KeyRound, Medal, Headphones } from 'lucide-react';

const ProfileLayout = () => {
  const navItems = [
    { path: '/profile', icon: User, label: 'Hồ sơ của tôi', exact: true },
    { path: '/profile/orders', icon: Package, label: 'Đơn mua' },
    { path: '/profile/favorites', icon: Heart, label: 'Sản phẩm yêu thích' },
    { path: '/profile/addresses', icon: MapPin, label: 'Địa chỉ của tôi' },
    { path: '/profile/change-password', icon: KeyRound, label: 'Đổi mật khẩu' },
    { path: '/profile/loyalty', icon: Medal, label: 'Khách hàng thân thiết' },
    { path: '/profile/support', icon: Headphones, label: 'Hỗ trợ khách hàng' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-6">
          <span className="hover:text-primary-600 cursor-pointer">Trang chủ</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Tài khoản của tôi</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                  NA
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Nguyễn Văn A</h3>
                  <p className="text-sm text-gray-500">Thành viên Bạc</p>
                </div>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                ))}
                
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
                  onClick={() => console.log('Mock logout')}
                >
                  <LogOut className="w-5 h-5" />
                  Đăng xuất
                </button>
              </nav>

            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:w-3/4">
             <Outlet />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
