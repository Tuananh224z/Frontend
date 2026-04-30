import { useState } from 'react';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';

const ProfileAddresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0912 345 678',
      address: '123 Đường Công Nghệ, Phường 1, Quận 1',
      city: 'TP. Hồ Chí Minh',
      isDefault: true,
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses([...addresses, { id: Date.now(), ...form, isDefault: false }]);
    setForm({ name: '', phone: '', address: '', city: '' });
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Địa chỉ của tôi</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý địa chỉ giao hàng</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm địa chỉ
        </button>
      </div>

      {/* Add Address Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="border border-dashed border-gray-300 rounded-xl p-5 mb-6 bg-gray-50 space-y-4">
          <h3 className="font-semibold text-gray-800">Địa chỉ mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" placeholder="Nguyễn Văn A" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} type="tel" placeholder="09xx xxx xxx" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể</label>
              <input required value={form.address} onChange={e => setForm({...form, address: e.target.value})} type="text" placeholder="Số nhà, tên đường, phường/xã, quận/huyện" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành phố</label>
              <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} type="text" placeholder="TP. Hồ Chí Minh" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors">Lưu địa chỉ</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-lg text-sm transition-colors">Hủy</button>
          </div>
        </form>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{addr.name}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600 text-sm">{addr.phone}</span>
                  {addr.isDefault && (
                    <span className="text-xs font-semibold text-primary-600 border border-primary-300 bg-primary-50 px-2 py-0.5 rounded">Mặc định</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{addr.address}</p>
                <p className="text-sm text-gray-600">{addr.city}</p>
              </div>
            </div>
            <div className="flex items-start sm:items-center gap-2 shrink-0">
              {!addr.isDefault && (
                <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-primary-600 hover:underline font-medium">Đặt mặc định</button>
              )}
              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              {!addr.isDefault && (
                <button onClick={() => handleDelete(addr.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có địa chỉ nào được lưu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileAddresses;
