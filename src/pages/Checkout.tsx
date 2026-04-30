import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { useState } from 'react';

// Using same dummy data for checkout summary
const cartItems = [
  {
    id: 1,
    name: 'Laptop Asus ROG Strix G15',
    price: 25990000,
    quantity: 1,
    img: 'https://via.placeholder.com/80',
  },
  {
    id: 4,
    name: 'Bàn phím cơ Razer BlackWidow',
    price: 2990000,
    quantity: 2,
    img: 'https://via.placeholder.com/80',
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0912 345 678',
      address: '123 Đường Công Nghệ, Phường 1, Quận 1, TP. Hồ Chí Minh',
      isDefault: true
    }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [newAddressForm, setNewAddressForm] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress = {
      id: Date.now(),
      ...newAddressForm,
      isDefault: false
    };
    setAddresses([...addresses, newAddress]);
    setSelectedAddressId(newAddress.id);
    setIsAddressModalOpen(false);
    setNewAddressForm({ name: '', phone: '', address: '' }); // reset
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = 50000; // Flat fee for dummy
  const total = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order processing
    // If successful -> /checkout/success
    // If failed -> /checkout/failed
    // Here we'll just mock success for COD, and maybe mock fail for logic if we want,
    // but default to success for UI demonstration.
    if (paymentMethod === 'cod') {
       navigate('/checkout/success');
    } else {
       // Just mapping banking to failed for demo purposes
       navigate('/checkout/failed');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 relative">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-6">
          <Link to="/cart" className="hover:text-primary-600">Giỏ hàng</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Thanh toán</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Thanh toán đơn hàng</h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:w-2/3 space-y-6">
            
            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6 text-primary-600 font-bold text-lg">
                <MapPin className="w-5 h-5" />
                <h2>Thông tin giao hàng</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div 
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`col-span-1 border rounded-lg p-4 cursor-pointer transition-colors ${selectedAddressId === address.id ? 'border-primary-500 bg-primary-50/50' : 'border-gray-200 hover:border-primary-300'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-900">{address.name}</span>
                      {address.isDefault && (
                        <span className="text-xs font-semibold bg-primary-100 text-primary-700 px-2 py-1 rounded">Mặc định</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                    <p className="text-sm text-gray-600">{address.address}</p>
                  </div>
                ))}
                
                <div 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="col-span-1 border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 hover:text-primary-600 transition-colors h-full min-h-[120px]"
                >
                  <span className="font-medium">+ Thêm địa chỉ mới</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng (Tùy chọn)</label>
                <textarea 
                  rows={3} 
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ghi chú về thời gian giao hàng, hướng dẫn tìm địa chỉ..."
                ></textarea>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex items-center gap-2 mb-6 text-primary-600 font-bold text-lg">
                <CreditCard className="w-5 h-5" />
                <h2>Phương thức thanh toán</h2>
              </div>

              <div className="space-y-3">
                <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="cod" 
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3 flex items-center gap-3">
                      <Truck className="w-6 h-6 text-gray-600" />
                      <div>
                        <span className="block text-sm font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                        <span className="block text-xs text-gray-500">Kiểm tra hàng trước khi thanh toán</span>
                      </div>
                    </div>
                  </div>
                </label>

                <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'banking' ? 'border-primary-500 bg-primary-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="banking" 
                      checked={paymentMethod === 'banking'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3 flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-gray-600" />
                      <div>
                        <span className="block text-sm font-medium text-gray-900">Chuyển khoản ngân hàng</span>
                        <span className="block text-xs text-gray-500">Chuyển qua VNPay, Momo, ZaloPay (Demo: Bấm để test Lỗi)</span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Đơn hàng của bạn</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.img} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.price.toLocaleString('vi-VN')}₫ × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-primary-600 shrink-0">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-900">{shippingFee.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6 pt-4 border-t border-gray-200">
                <span className="font-bold text-gray-900">Tổng cộng</span>
                <span className="font-bold text-primary-600 text-2xl leading-none">
                  {total.toLocaleString('vi-VN')}₫
                </span>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-bold text-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                Đặt Hàng <ShieldCheck className="w-5 h-5"/>
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                Bằng cách đặt hàng, bạn đồng ý với Điều khoản sử dụng của TechStore.
              </p>
            </div>
          </div>

        </form>
      </div>

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Thêm địa chỉ giao hàng</h3>
              <button 
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddAddress} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input 
                  required
                  type="text" 
                  value={newAddressForm.name}
                  onChange={(e) => setNewAddressForm({...newAddressForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  required
                  type="tel" 
                  value={newAddressForm.phone}
                  onChange={(e) => setNewAddressForm({...newAddressForm, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                <textarea 
                  required
                  rows={3}
                  value={newAddressForm.address}
                  onChange={(e) => setNewAddressForm({...newAddressForm, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                ></textarea>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Lưu địa chỉ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
