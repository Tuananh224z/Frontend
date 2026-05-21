import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Phone, Mail, Key, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';
import authService from '../../services/authService';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Feedback states
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  React.useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setIsUpdatingProfile(true);

    try {
      await updateProfile({ fullName, phone });
      setProfileSuccess('Cập nhật thông tin cá nhân thành công!');
    } catch (err: any) {
      setProfileError(err.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');

    if (newPassword !== confirmPassword) {
      setPassError('Mật khẩu mới không trùng khớp');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('Mật khẩu mới phải từ 6 ký tự trở lên');
      return;
    }

    setIsUpdatingPass(true);

    try {
      const response = await authService.changePassword({
        oldPassword,
        newPassword,
      });
      if (response.data?.status === 'success') {
        setPassSuccess('Đổi mật khẩu thành công!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassError(response.data?.message || 'Không thể đổi mật khẩu');
      }
    } catch (err: any) {
      setPassError(err.response?.data?.message || err.message || 'Mật khẩu cũ không chính xác');
    } finally {
      setIsUpdatingPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center font-extrabold text-2xl border border-rose-100 shadow-xs">
          {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{user?.fullName}</h1>
          <p className="text-sm font-medium text-slate-400">Tài khoản khách hàng: {user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile details form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg relative overflow-hidden">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
            <User className="w-5 h-5 text-red-500" />
            Thông tin cá nhân
          </h2>

          {profileSuccess && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-2xl border border-emerald-100">
              <CheckCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-2xl border border-red-100">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Địa chỉ Email (Không thể thay đổi)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-350 text-slate-400" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-400 rounded-2xl cursor-not-allowed text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all duration-200 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Số điện thoại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xxxxxxxx"
                  className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all duration-200 text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full flex justify-center py-2.5 border border-transparent text-sm font-extrabold rounded-2xl text-white bg-red-650 hover:bg-red-700 transition-colors shadow-xs disabled:opacity-75 disabled:cursor-not-allowed bg-red-600 cursor-pointer"
            >
              {isUpdatingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        {/* Change password form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg relative overflow-hidden">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
            <Key className="w-5 h-5 text-red-550 text-red-600" />
            Đổi mật khẩu
          </h2>

          {passSuccess && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-2xl border border-emerald-100">
              <CheckCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{passSuccess}</span>
            </div>
          )}

          {passError && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-2xl border border-red-100">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all duration-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all duration-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all duration-200 text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingPass}
              className="w-full flex justify-center py-2.5 border border-transparent text-sm font-extrabold rounded-2xl text-white bg-red-650 hover:bg-red-700 transition-colors shadow-xs disabled:opacity-75 disabled:cursor-not-allowed bg-red-600 cursor-pointer"
            >
              {isUpdatingPass ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
