import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Eye, EyeOff, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Mã xác thực (token) không tồn tại. Vui lòng sử dụng liên kết chính xác từ email.');
      return;
    }
    if (!password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu mới phải có tối thiểu 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await authService.resetPassword({ token, newPassword: password });
      setSuccess('Mật khẩu của bạn đã được đặt lại thành công! Bạn sẽ được chuyển hướng về trang đăng nhập sau 3 giây.');
      
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đặt lại mật khẩu thất bại. Vui lòng yêu cầu lại liên kết khôi phục mới.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-(screen-20) flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -ml-16 -mb-16" />

        <div className="relative">
          {/* Logo badge */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-red-550/20">
              TS
            </div>
          </div>

          <h2 className="text-center text-3xl font-extrabold text-slate-800 tracking-tight">
            Đặt lại mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-slate-500">
            Tạo mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {!token && (
          <div className="flex items-start gap-2.5 p-4 bg-red-50 text-red-650 text-sm font-semibold rounded-2xl border border-red-100 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <span>Đường dẫn khôi phục không hợp lệ hoặc thiếu tham số Token. Vui lòng kiểm tra lại liên kết trong email.</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2.5 p-4 bg-red-50 text-red-650 text-sm font-semibold rounded-2xl border border-red-100 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 p-4 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-2xl border border-emerald-100 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-550 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {token && !success && (
          <form className="mt-8 space-y-6 relative" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all duration-200 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all duration-200 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-extrabold rounded-2xl text-white bg-red-600 hover:bg-red-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-red-550 transition-all duration-200 shadow-lg shadow-red-550/20 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-1.5">
                    Xác nhận đổi mật khẩu <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500 font-medium">
            Quay lại trang{' '}
            <Link to="/login" className="font-bold text-red-600 hover:text-red-700 transition-colors">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
