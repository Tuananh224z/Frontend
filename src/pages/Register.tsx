import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Mật khẩu nhập lại không khớp'); return; }
    if (form.password.length < 6) { setError('Mật khẩu phải ít nhất 6 ký tự'); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      navigate('/verify');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-600 text-white p-3 rounded-lg font-bold text-2xl leading-none shadow-md">TS</div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Đăng ký thành viên</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">Đăng nhập ngay</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và Tên</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                <input id="name" name="name" type="text" required value={form.name} onChange={e => set('name', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm bg-gray-50 focus:bg-white"
                  placeholder="Nguyễn Văn A" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-gray-400" /></div>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm bg-gray-50 focus:bg-white"
                  placeholder="0912 345 678" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={e => set('email', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm bg-gray-50 focus:bg-white"
                  placeholder="you@example.com" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={e => set('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm bg-gray-50 focus:bg-white"
                  placeholder="••••••••" />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Nhập lại mật khẩu</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                <input id="confirm-password" name="confirm-password" type={showConfirm ? 'text' : 'password'} required value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm bg-gray-50 focus:bg-white"
                  placeholder="••••••••" />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                Tôi đồng ý với <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Điều khoản dịch vụ</a> và <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Chính sách bảo mật</a>
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 focus:outline-none transition-colors">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang tạo tài khoản...
                </span>
              ) : 'Tạo Tài Khoản'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
