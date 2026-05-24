import { MapPin, Plus, CheckCircle, ShieldAlert } from 'lucide-react';
import { useAddressData } from '../../hooks/useAddressData';
import AddressCard from '../../components/address/AddressCard';
import AddressFormModal from '../../components/address/AddressFormModal';

export default function Addresses() {
  const {
    addressList,
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
    isModalOpen,
    setIsModalOpen,
    editingAddress,
    setEditingAddress,
    success,
    error,
    isUpdating,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleSubmit,
    handleDeleteAddress,
    handleSetDefault,
  } = useAddressData();

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="text-left">
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
          className="flex items-center gap-1.5 px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs border-0 bg-red-600"
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
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-655 text-xs font-bold rounded-2xl border border-red-100 animate-in fade-in duration-200 text-red-600">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Address Display Panel */}
      {addressList.length > 0 ? (
        <div className="space-y-4">
          {addressList.map((addr) => (
            <AddressCard
              key={addr._id || `${addr.fullName}-${addr.phone}`}
              addr={addr}
              onSetDefault={handleSetDefault}
              onEdit={(address) => {
                setEditingAddress(address);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteAddress}
            />
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
            className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer border-0 shadow-xs bg-red-600"
          >
            Thêm địa chỉ giao hàng
          </button>
        </div>
      )}

      {/* Address Edit/Add Modal Overlay */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingAddress={editingAddress}
        fullName={fullName}
        setFullName={setFullName}
        phone={phone}
        setPhone={setPhone}
        street={street}
        setStreet={setStreet}
        isDefault={isDefault}
        setIsDefault={setIsDefault}
        provinces={provinces}
        districts={districts}
        wards={wards}
        selectedProvinceCode={selectedProvinceCode}
        selectedDistrictCode={selectedDistrictCode}
        selectedWardCode={selectedWardCode}
        success={success}
        error={error}
        isUpdating={isUpdating}
        handleProvinceChange={handleProvinceChange}
        handleDistrictChange={handleDistrictChange}
        handleWardChange={handleWardChange}
        onSubmit={handleSubmit}
        addressListLength={addressList.length}
      />
    </div>
  );
}
