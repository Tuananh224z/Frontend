import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, CheckCircle, ShieldAlert, Loader2 } from 'lucide-react';

export default function Addresses() {
  const { user, updateProfile } = useAuth();
  const [street, setStreet] = useState(user?.address?.street || '');
  const [ward, setWard] = useState(user?.address?.ward || '');
  const [district, setDistrict] = useState(user?.address?.district || '');
  const [city, setCity] = useState(user?.address?.city || '');
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (user?.address) {
      setStreet(user.address.street || '');
      setWard(user.address.ward || '');
      setDistrict(user.address.district || '');
      setCity(user.address.city || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setIsUpdating(true);

    try {
      await updateProfile({
        address: {
          street,
          ward,
          district,
          city,
        },
      });
      setSuccess('Cập nhật địa chỉ nhận hàng thành công!');
    } catch (err: any) {
      setError(err.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg relative overflow-hidden">
        <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
          <MapPin className="w-6 h-6 text-red-600" />
          Địa chỉ của tôi
        </h2>

        <p className="text-sm font-medium text-slate-500 mb-6">
          Vui lòng cung cấp địa chỉ giao hàng chính xác để chúng tôi vận chuyển laptop đến bạn nhanh chóng nhất.
        </p>

        {success && (
          <div className="mb-6 flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-2xl border border-emerald-100 animate-in fade-in duration-200">
            <CheckCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-2xl border border-red-100 animate-in fade-in duration-200">
            <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
              Số nhà, Tên đường
            </label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Ví dụ: 123 Đường Nguyễn Huệ"
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all duration-200 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Phường / Xã
              </label>
              <input
                type="text"
                required
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="Ví dụ: Phường Bến Nghé"
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all duration-200 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Quận / Huyện
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Ví dụ: Quận 1"
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all duration-200 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
              Tỉnh / Thành phố
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ví dụ: Thành phố Hồ Chí Minh"
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all duration-200 text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full flex justify-center py-3.5 border border-transparent text-sm font-extrabold rounded-2xl text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-550/15 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu địa chỉ'}
          </button>
        </form>
      </div>
    </div>
  );
}
