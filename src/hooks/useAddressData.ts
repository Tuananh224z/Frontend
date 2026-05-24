import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserAddress } from '../types/user';
import type { Province, District, Ward } from '../types/address';

export function useAddressData() {
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

  const fetchDistricts = async (pCode: number): Promise<District[]> => {
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

  const fetchWards = async (dCode: number): Promise<Ward[]> => {
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

  // Sync state when modal open / editing address
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
                (d: District) => d.name.toLowerCase() === editingAddress.district.toLowerCase()
              );
              if (foundDistrict) {
                setSelectedDistrictCode(foundDistrict.code);
                const currentWards = await fetchWards(foundDistrict.code);

                const foundWard = currentWards.find(
                  (w: Ward) => w.name.toLowerCase() === editingAddress.ward.toLowerCase()
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

      if (updatedAddresses.length === 1) {
        updatedAddresses[0].isDefault = true;
      } else {
        const hasDefault = updatedAddresses.some((a) => a.isDefault);
        if (!hasDefault && updatedAddresses.length > 0) {
          updatedAddresses[0].isDefault = true;
        }
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

  return {
    addressList,
    fullName,
    setFullName,
    phone,
    setPhone,
    street,
    setStreet,
    ward,
    district,
    city,
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
  };
}
