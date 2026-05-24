import React from 'react';
import { X, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import type { UserAddress } from '../../types/user';
import type { Province, District, Ward } from '../../types/address';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAddress: UserAddress | null;
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  street: string;
  setStreet: (val: string) => void;
  isDefault: boolean;
  setIsDefault: (val: boolean) => void;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  selectedProvinceCode: number | '';
  selectedDistrictCode: number | '';
  selectedWardCode: number | '';
  success: string;
  error: string;
  isUpdating: boolean;
  handleProvinceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDistrictChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleWardChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  addressListLength: number;
}

export default function AddressFormModal({
  isOpen,
  onClose,
  editingAddress,
  fullName,
  setFullName,
  phone,
  setPhone,
  street,
  setStreet,
  isDefault,
  setIsDefault,
  provinces,
  districts,
  wards,
  selectedProvinceCode,
  selectedDistrictCode,
  selectedWardCode,
  success,
  error,
  isUpdating,
  handleProvinceChange,
  handleDistrictChange,
  handleWardChange,
  onSubmit,
  addressListLength,
}: AddressFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in">
      <div className="absolute inset-0 cursor-default" onClick={onClose} />
      <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-100 shadow-2xl relative overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
            {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer border-0 bg-transparent"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
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

          {/* Recipient Details Group (2-column layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-700">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="block w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-semibold transition-all duration-200"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-700">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xx xxx xxx"
                className="block w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-semibold transition-all duration-200"
              />
            </div>
          </div>

          {/* Address Street details (full-width) */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold text-slate-700">
              Địa chỉ cụ thể <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Số nhà, tên đường..."
              className="block w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-semibold transition-all duration-200"
            />
          </div>

          {/* Address details grid (3-column select layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-700">
                Tỉnh/Thành phố <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedProvinceCode}
                onChange={handleProvinceChange}
                className="block w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer"
              >
                <option value="">Chọn Tỉnh/TP</option>
                {provinces.map((prov) => (
                  <option key={prov.code} value={prov.code}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-700">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDistrictCode}
                onChange={handleDistrictChange}
                disabled={!selectedProvinceCode}
                className="block w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((dist) => (
                  <option key={dist.code} value={dist.code}>
                    {dist.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-700">
                Phường/Xã <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedWardCode}
                onChange={handleWardChange}
                disabled={!selectedDistrictCode}
                className="block w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <option value="">Chọn Phường/Xã</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Set as default checkbox */}
          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="default-checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              disabled={editingAddress?.isDefault && addressListLength > 1}
              className="w-4 h-4 rounded-md border-slate-300 text-red-600 focus:ring-red-500 accent-red-650 cursor-pointer"
            />
            <label
              htmlFor="default-checkbox"
              className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
            >
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          {/* Modal footer / buttons */}
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors text-sm cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 py-3 bg-red-650 hover:bg-red-700 text-white font-bold rounded-2xl transition-colors text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-600/10 bg-red-600 border-0"
            >
              {isUpdating ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : 'Lưu địa chỉ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
