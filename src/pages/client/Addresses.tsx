import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, CheckCircle, ShieldAlert, Loader2, Pencil, Plus, X } from 'lucide-react';

export default function Addresses() {
  const { user, updateProfile } = useAuth();
  
  // Local state for address fields
  const [street, setStreet] = useState(user?.address?.street || '');
  const [ward, setWard] = useState(user?.address?.ward || '');
  const [district, setDistrict] = useState(user?.address?.district || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Form visual state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync state with user context on open/update
  React.useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      if (user.address) {
        setStreet(user.address.street || '');
        setWard(user.address.ward || '');
        setDistrict(user.address.district || '');
        setCity(user.address.city || '');
      }
    }
  }, [user, isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setIsUpdating(true);

    try {
      await updateProfile({
        fullName,
        phone,
        address: {
          street,
          ward,
          district,
          city,
        },
      });
      setSuccess('Cập nhật địa chỉ nhận hàng thành công!');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess('');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if user has an address saved
  const hasAddress = !!(user?.address?.street || user?.address?.ward || user?.address?.district || user?.address?.city);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Địa chỉ của tôi</h2>
          <p className="text-xs text-slate-400 font-bold mt-1">
            Quản lý địa chỉ giao hàng ({hasAddress ? 1 : 0} địa chỉ)
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs border-0"
        >
          <Plus className="w-4 h-4" />
          Thêm địa chỉ
        </button>
      </div>

      {/* Main Address Display Panel */}
      {hasAddress ? (
        <div className="p-5 bg-white border border-red-100 rounded-3xl relative flex items-start gap-4 transition-all duration-350 hover:shadow-xs group">
          {/* MapPin Icon in Location Indicator */}
          <div className="w-10 h-10 bg-red-50 text-red-600 border border-red-100/50 rounded-full flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>

          {/* Location details */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-slate-850 text-sm">{user?.fullName}</span>
              <span className="text-slate-300 text-xs select-none">|</span>
              <span className="text-slate-500 font-bold text-xs">{user?.phone || 'Chưa cung cấp SĐT'}</span>
              <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold text-red-650 bg-red-50 rounded-md border border-red-200 select-none ml-1.5">
                ★ Mặc định
              </span>
            </div>

            <div className="text-xs text-slate-700 font-bold leading-relaxed space-y-0.5">
              <p className="text-slate-500 font-semibold">{user?.address?.street}</p>
              <p className="text-slate-800">
                {user?.address?.ward ? `${user.address.ward}, ` : ''}
                {user?.address?.district ? `${user.address.district}, ` : ''}
                {user?.address?.city || ''}
              </p>
            </div>
          </div>

          {/* Edit icon button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-8 h-8 rounded-full border border-slate-100 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center shrink-0 transition-all cursor-pointer"
            title="Chỉnh sửa địa chỉ"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
          <MapPin className="w-12 h-12 text-slate-350 mx-auto mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-650 mb-1">Chưa có địa chỉ nhận hàng</h3>
          <p className="text-xs text-slate-400 font-bold mb-5 max-w-sm mx-auto">
            Vui lòng thêm địa chỉ nhận hàng để chúng tôi vận chuyển đơn hàng đến bạn nhanh chóng.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer border-0 shadow-xs"
          >
            Thêm địa chỉ giao hàng
          </button>
        </div>
      )}

      {/* Address Edit/Add Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200">
          <div 
            className="absolute inset-0 cursor-default" 
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-100 shadow-2xl relative overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-250">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                {hasAddress ? 'Cập nhật địa chỉ nhận hàng' : 'Thêm địa chỉ mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {success && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-2xl border border-emerald-100">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-650 text-xs font-bold rounded-2xl border border-red-100">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Recipient Details Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                    Họ và tên người nhận
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-bold transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xxxxxxxx"
                    className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-bold transition-all duration-200"
                  />
                </div>
              </div>

              {/* Address Street details */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                  Số nhà, Tên đường
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Ví dụ: 123 Nguyễn Huệ"
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-bold transition-all duration-200"
                />
              </div>

              {/* Address details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                    Phường / Xã
                  </label>
                  <input
                    type="text"
                    required
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="Ví dụ: Phường Bến Nghé"
                    className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-bold transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                    Quận / Huyện
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Ví dụ: Quận 1"
                    className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-bold transition-all duration-200"
                  />
                </div>
              </div>

              {/* City details */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                  Tỉnh / Thành phố
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ví dụ: Thành phố Hồ Chí Minh"
                  className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-bold transition-all duration-200"
                />
              </div>

              {/* Modal footer / buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition-colors cursor-pointer bg-white"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs transition-colors border-0 shadow-lg shadow-red-550/10 flex items-center gap-1.5 cursor-pointer"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lưu địa chỉ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
