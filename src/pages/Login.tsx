import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary-600 mb-4">
          <div className="bg-primary-600 text-white p-3 rounded-lg font-bold text-2xl leading-none shadow-md">TS</div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Đăng nhập tài khoản</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hoặc{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            đăng ký tài khoản mới ngay
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={emailRef}
                  id="email" name="email" type="email" autoComplete="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">Ghi nhớ đăng nhập</label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">Quên mật khẩu?</Link>
              </div>
            </div>

            <div>
              <button
                type="submit" disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang xử lý...
                  </span>
                ) : 'Đăng Nhập'}
              </button>
            </div>
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-500">
            <p className="font-semibold mb-1">🔑 Tài khoản demo:</p>
            <p>Admin: <strong>admin@techstore.vn</strong> / <strong>admin123456</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
