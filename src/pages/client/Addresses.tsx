import React, { useState, useEffect } from 'react';
import { useAuth, UserAddress } from '../../contexts/AuthContext';
import { MapPin, CheckCircle, ShieldAlert, Loader2, Pencil, Plus, X, Trash2 } from 'lucide-react';

interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
}

interface Ward {
  code: number;
  name: string;
}

export default function Addresses() {
  const { user, updateProfile } = useAuth();

  // Address lists
  const [addressList, setAddressList] = useState<UserAddress[]>([]);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Administrative units lists
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // Selected administrative unit codes
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | ''>('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | ''>('');
  const [selectedWardCode, setSelectedWardCode] = useState<number | ''>('');

  // Modal / status states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Load addresses list from user profile
  useEffect(() => {
    if (user) {
      if (user.addresses && user.addresses.length > 0) {
        setAddressList(user.addresses);
      } else if (user.address && (user.address.street || user.address.city)) {
        // Fallback to legacy single address if addresses list is empty
        setAddressList([
          {
            _id: 'default-temp',
            fullName: user.fullName || '',
            phone: user.phone || '',
            street: user.address.street || '',
            ward: user.address.ward || '',
            district: user.address.district || '',
            city: user.address.city || '',
            isDefault: true,
          },
        ]);
      } else {
        setAddressList([]);
      }
    }
  }, [user]);

  // Load provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        if (!response.ok) throw new Error('Failed to fetch provinces');
        const data = await response.json();
        setProvinces(data);
      } catch (err) {
        console.error('Error fetching provinces:', err);
      }
    };
    fetchProvinces();
  }, []);

  const fetchDistricts = async (pCode: number) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${pCode}?depth=2`);
      if (!response.ok) throw new Error('Failed to fetch districts');
      const data = await response.json();
      setDistricts(data.districts || []);
      return data.districts || [];
    } catch (err) {
      console.error('Error fetching districts:', err);
      return [];
    }
  };

  const fetchWards = async (dCode: number) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/d/${dCode}?depth=2`);
      if (!response.ok) throw new Error('Failed to fetch wards');
      const data = await response.json();
      setWards(data.wards || []);
      return data.wards || [];
    } catch (err) {
      console.error('Error fetching wards:', err);
      return [];
    }
  };

  // Sync state with modal open / editing address
  useEffect(() => {
    if (isModalOpen) {
      setError('');
      setSuccess('');
      if (editingAddress) {
        setFullName(editingAddress.fullName || '');
        setPhone(editingAddress.phone || '');
        setStreet(editingAddress.street || '');
        setCity(editingAddress.city || '');
        setDistrict(editingAddress.district || '');
        setWard(editingAddress.ward || '');
        setIsDefault(editingAddress.isDefault || false);

        const resolveExistingAddress = async () => {
          try {
            let currentProvinces = provinces;
            if (currentProvinces.length === 0) {
              const res = await fetch('https://provinces.open-api.vn/api/p/');
              currentProvinces = await res.json();
              setProvinces(currentProvinces);
            }

            const foundProvince = currentProvinces.find(
              (p) => p.name.toLowerCase() === editingAddress.city.toLowerCase()
            );
            if (foundProvince) {
              setSelectedProvinceCode(foundProvince.code);
              const currentDistricts = await fetchDistricts(foundProvince.code);

              const foundDistrict = currentDistricts.find(
                (d) => d.name.toLowerCase() === editingAddress.district.toLowerCase()
              );
              if (foundDistrict) {
                setSelectedDistrictCode(foundDistrict.code);
                const currentWards = await fetchWards(foundDistrict.code);

                const foundWard = currentWards.find(
                  (w) => w.name.toLowerCase() === editingAddress.ward.toLowerCase()
                );
                if (foundWard) {
                  setSelectedWardCode(foundWard.code);
                } else {
                  setSelectedWardCode('');
                }
              } else {
                setSelectedDistrictCode('');
                setSelectedWardCode('');
                setWards([]);
              }
            } else {
              setSelectedProvinceCode('');
              setSelectedDistrictCode('');
              setSelectedWardCode('');
              setDistricts([]);
              setWards([]);
            }
          } catch (e) {
            console.error('Error resolving existing address codes:', e);
          }
        };
        resolveExistingAddress();
      } else {
        setFullName('');
        setPhone('');
        setStreet('');
        setCity('');
        setDistrict('');
        setWard('');
        setSelectedProvinceCode('');
        setSelectedDistrictCode('');
        setSelectedWardCode('');
        setDistricts([]);
        setWards([]);
        setIsDefault(addressList.length === 0);
      }
    }
  }, [isModalOpen, editingAddress]);

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const codeVal = e.target.value;
    if (!codeVal) {
      setSelectedProvinceCode('');
      setCity('');
      setSelectedDistrictCode('');
      setDistrict('');
      setSelectedWardCode('');
      setWard('');
      setDistricts([]);
      setWards([]);
      return;
    }
    const code = Number(codeVal);
    setSelectedProvinceCode(code);
    setSelectedDistrictCode('');
    setDistrict('');
    setSelectedWardCode('');
    setWard('');
    setWards([]);

    const provObj = provinces.find((p) => p.code === code);
    if (provObj) {
      setCity(provObj.name);
    }
    await fetchDistricts(code);
  };

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const codeVal = e.target.value;
    if (!codeVal) {
      setSelectedDistrictCode('');
      setDistrict('');
      setSelectedWardCode('');
      setWard('');
      setWards([]);
      return;
    }
    const code = Number(codeVal);
    setSelectedDistrictCode(code);
    setSelectedWardCode('');
    setWard('');

    const distObj = districts.find((d) => d.code === code);
    if (distObj) {
      setDistrict(distObj.name);
    }
    await fetchWards(code);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const codeVal = e.target.value;
    if (!codeVal) {
      setSelectedWardCode('');
      setWard('');
      return;
    }
    const code = Number(codeVal);
    setSelectedWardCode(code);

    const wardObj = wards.find((w) => w.code === code);
    if (wardObj) {
      setWard(wardObj.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Họ và tên là bắt buộc');
      return;
    }
    if (!phone.trim()) {
      setError('Số điện thoại là bắt buộc');
      return;
    }
    if (!street.trim()) {
      setError('Địa chỉ cụ thể là bắt buộc');
      return;
    }
    if (!city) {
      setError('Vui lòng chọn Tỉnh/Thành phố');
      return;
    }
    if (!district) {
      setError('Vui lòng chọn Quận/Huyện');
      return;
    }
    if (!ward) {
      setError('Vui lòng chọn Phường/Xã');
      return;
    }

    setSuccess('');
    setError('');
    setIsUpdating(true);

    try {
      let updatedAddresses = [...addressList];

      if (editingAddress) {
        // Edit Mode
        updatedAddresses = updatedAddresses.map((addr) => {
          if (addr._id === editingAddress._id) {
            return {
              ...addr,
              fullName,
              phone,
              street,
              ward,
              district,
              city,
              isDefault,
            };
          }
          if (isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        });
      } else {
        // Add Mode
        const newAddr: UserAddress = {
          fullName,
          phone,
          street,
          ward,
          district,
          city,
          isDefault,
        };

        if (isDefault) {
          updatedAddresses = updatedAddresses.map((addr) => ({ ...addr, isDefault: false }));
        }
        updatedAddresses.push(newAddr);
      }

      // If we only have 1 address, make it default
      if (updatedAddresses.length === 1) {
        updatedAddresses[0].isDefault = true;
      } else {
        const hasDefault = updatedAddresses.some((a) => a.isDefault);
        if (!hasDefault && updatedAddresses.length > 0) {
          updatedAddresses[0].isDefault = true;
        }
      }

      // Clean temp IDs
      const cleanAddresses = updatedAddresses.map((addr) => {
        const cleaned = { ...addr };
        if (cleaned._id === 'default-temp') {
          delete cleaned._id;
        }
        return cleaned;
      });

      await updateProfile({
        addresses: cleanAddresses,
      });

      setSuccess(editingAddress ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ mới thành công!');
      setTimeout(() => {
        setIsModalOpen(false);
        setEditingAddress(null);
        setSuccess('');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAddress = async (addressId: string, isAddrDefault: boolean) => {
    if (isAddrDefault && addressList.length > 1) {
      alert('Không thể xóa địa chỉ mặc định. Vui lòng thiết lập địa chỉ khác làm mặc định trước khi xóa.');
      return;
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này không?')) {
      setError('');
      setSuccess('');
      try {
        let updatedAddresses = addressList.filter((addr) => addr._id !== addressId);

        if (isAddrDefault && updatedAddresses.length > 0) {
          updatedAddresses[0].isDefault = true;
        }

        const cleanAddresses = updatedAddresses.map((addr) => {
          const cleaned = { ...addr };
          if (cleaned._id === 'default-temp') {
            delete cleaned._id;
          }
          return cleaned;
        });

        await updateProfile({
          addresses: cleanAddresses,
        });
        setSuccess('Xóa địa chỉ thành công!');
        setTimeout(() => setSuccess(''), 2000);
      } catch (err: any) {
        setError(err.message || 'Xóa địa chỉ thất bại.');
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    setError('');
    setSuccess('');
    try {
      const updatedAddresses = addressList.map((addr) => ({
        ...addr,
        isDefault: addr._id === addressId,
      }));

      const cleanAddresses = updatedAddresses.map((addr) => {
        const cleaned = { ...addr };
        if (cleaned._id === 'default-temp') {
          delete cleaned._id;
        }
        return cleaned;
      });

      await updateProfile({
        addresses: cleanAddresses,
      });
      setSuccess('Đã thiết lập địa chỉ mặc định mới!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Thiết lập mặc định thất bại.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Địa chỉ của tôi</h2>
          <p className="text-xs text-slate-400 font-bold mt-1">
            Quản lý địa chỉ giao hàng ({addressList.length} địa chỉ)
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAddress(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs border-0"
        >
          <Plus className="w-4 h-4" />
          Thêm địa chỉ mới
        </button>
      </div>

      {success && !isModalOpen && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-2xl border border-emerald-100 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && !isModalOpen && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-650 text-xs font-bold rounded-2xl border border-red-100 animate-in fade-in duration-200">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Address Display Panel */}
      {addressList.length > 0 ? (
        <div className="space-y-4">
          {addressList.map((addr) => (
            <div
              key={addr._id || `${addr.fullName}-${addr.phone}`}
              className={`p-5 bg-white border ${
                addr.isDefault ? 'border-red-200 bg-red-50/5' : 'border-slate-100'
              } rounded-3xl relative flex items-start gap-4 transition-all duration-350 hover:shadow-xs group`}
            >
              {/* MapPin Icon in Location Indicator */}
              <div
                className={`w-10 h-10 ${
                  addr.isDefault ? 'bg-red-50 text-red-600 border border-red-100/50' : 'bg-slate-50 text-slate-400 border border-slate-100'
                } rounded-full flex items-center justify-center shrink-0`}
              >
                <MapPin className="w-5 h-5" />
              </div>

              {/* Location details */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-slate-850 text-sm">{addr.fullName}</span>
                  <span className="text-slate-300 text-xs select-none">|</span>
                  <span className="text-slate-500 font-bold text-xs">{addr.phone || 'Chưa cung cấp SĐT'}</span>
                  {addr.isDefault && (
                    <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold text-red-650 bg-red-50 rounded-md border border-red-250 select-none ml-1.5">
                      ★ Mặc định
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-700 font-bold leading-relaxed space-y-0.5">
                  <p className="text-slate-500 font-semibold">{addr.street}</p>
                  <p className="text-slate-800">
                    {addr.ward ? `${addr.ward}, ` : ''}
                    {addr.district ? `${addr.district}, ` : ''}
                    {addr.city || ''}
                  </p>
                </div>

                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr._id || '')}
                    className="text-[10px] font-extrabold text-red-600 hover:text-red-700 hover:underline cursor-pointer border-0 bg-transparent p-0 pt-1"
                  >
                    Thiết lập làm mặc định
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditingAddress(addr);
                    setIsModalOpen(true);
                  }}
                  className="w-8 h-8 rounded-full border border-slate-100 text-slate-400 hover:text-slate-805 hover:border-slate-300 hover:bg-slate-55 flex items-center justify-center transition-all cursor-pointer"
                  title="Chỉnh sửa địa chỉ"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAddress(addr._id || '', addr.isDefault)}
                  className="w-8 h-8 rounded-full border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer"
                  title="Xóa địa chỉ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
          <MapPin className="w-12 h-12 text-slate-350 mx-auto mb-3 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-650 mb-1">Chưa có địa chỉ nhận hàng</h3>
          <p className="text-xs text-slate-400 font-bold mb-5 max-w-sm mx-auto">
            Vui lòng thêm địa chỉ nhận hàng để chúng tôi vận chuyển đơn hàng đến bạn nhanh chóng.
          </p>
          <button
            onClick={() => {
              setEditingAddress(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer border-0 shadow-xs"
          >
            Thêm địa chỉ giao hàng
          </button>
        </div>
      )}

      {/* Address Edit/Add Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in">
          <div className="absolute inset-0 cursor-default" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-100 shadow-2xl relative overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
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

              {/* Recipient Details Group (2-column layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
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
              <div className="space-y-1.5">
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
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
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
                <div className="space-y-1.5">
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
                  disabled={editingAddress?.isDefault && addressList.length > 1}
                  className="w-4 h-4 rounded-md border-slate-350 text-red-650 focus:ring-red-500 accent-red-600 cursor-pointer"
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
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors text-sm cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-colors text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-600/10"
                >
                  {isUpdating ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : 'Lưu địa chỉ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
