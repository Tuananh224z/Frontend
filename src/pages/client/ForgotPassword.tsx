import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Vui lòng nhập địa chỉ email của bạn');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess('Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác/spam).');
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gặp lỗi trong quá trình gửi yêu cầu. Vui lòng thử lại.');
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
            Quên mật khẩu?
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-slate-500">
            Nhập email của bạn để nhận liên kết khôi phục mật khẩu
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-650 text-sm font-semibold rounded-2xl border border-red-100 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 p-4 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-2xl border border-emerald-100 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-550 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {!success && (
          <form className="mt-8 space-y-6 relative" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all duration-200 text-sm font-medium"
                />
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
                    Gửi yêu cầu <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
