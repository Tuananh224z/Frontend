import { Package, Search } from 'lucide-react';

const ProfileOrders = () => {
  const orders = [
    {
      id: '#TS-12345',
      date: '2026-02-26',
      status: 'Xử lý',
      total: 32000000,
      items: [
        { name: 'Laptop Asus ROG Strix G15', qty: 1, price: 25990000, img: 'https://via.placeholder.com/60' },
        { name: 'Bàn phím cơ Razer BlackWidow', qty: 2, price: 2990000, img: 'https://via.placeholder.com/60' }
      ]
    },
    {
      id: '#TS-12344',
      date: '2026-01-15',
      status: 'Đã giao',
      total: 550000,
      items: [
        { name: 'Chuột Gaming Logitech G102', qty: 1, price: 550000, img: 'https://via.placeholder.com/60' }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="mb-6 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Đơn hàng của tôi</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi trạng thái đơn hàng</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm theo Mã đơn / Tên SP"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center text-sm">
               <div className="flex gap-4 items-center">
                 <span className="font-bold text-gray-900">{order.id}</span>
                 <span className="text-gray-500 hidden sm:inline">{order.date}</span>
               </div>
               <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Đã giao' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.status}
                  </span>
               </div>
            </div>

            {/* Items */}
            <div className="px-4 py-4 space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded border border-gray-100 shrink-0" />
                  <div className="flex-1 flex flex-col sm:flex-row justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">x{item.qty}</p>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <p className="font-bold text-primary-600">{item.price.toLocaleString('vi-VN')}₫</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-3">
              <span className="text-gray-500 text-sm">Thành tiền: <span className="text-lg font-bold text-primary-600 ml-2">{order.total.toLocaleString('vi-VN')}₫</span></span>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded font-medium text-sm text-gray-700 hover:bg-white transition-colors">Liên hệ</button>
                <button className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 rounded font-medium text-sm text-white hover:bg-primary-700 transition-colors">Mua lại</button>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12">
             <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-500">Chưa có đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOrders;
