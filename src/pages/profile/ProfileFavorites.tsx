import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileFavorites = () => {
  const favorites = [
    {
      id: 1,
      name: 'Màn hình LG UltraGear 27" 165Hz',
      price: 8500000,
      oldPrice: 9900000,
      img: 'https://via.placeholder.com/80',
      inStock: true
    },
    {
      id: 2,
      name: 'Tai nghe Sony WH-1000XM5',
      price: 7990000,
      oldPrice: null,
      img: 'https://via.placeholder.com/80',
      inStock: false
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
        <Heart className="w-6 h-6 text-primary-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sản phẩm yêu thích</h2>
          <p className="text-sm text-gray-500 mt-1">Lưu trữ các sản phẩm bạn quan tâm ({favorites.length})</p>
        </div>
      </div>

      <div className="space-y-4">
        {favorites.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border border-gray-100 p-4 rounded-xl hover:border-primary-100 transition-colors">
            
            <div className="flex gap-4 flex-1">
              <Link to={`/product/${item.id}`} className="shrink-0">
                <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-100" />
              </Link>
              <div className="flex flex-col justify-center">
                <Link to={`/product/${item.id}`} className="font-bold text-gray-900 hover:text-primary-600 line-clamp-2 mb-1">
                  {item.name}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary-600">{item.price.toLocaleString('vi-VN')}₫</span>
                  {item.oldPrice && (
                    <span className="text-xs text-gray-400 line-through">{item.oldPrice.toLocaleString('vi-VN')}₫</span>
                  )}
                </div>
                <div className="mt-2">
                   {item.inStock ? (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Còn hàng</span>
                   ) : (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">Hết hàng</span>
                   )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
              <button 
                className="flex items-center justify-center p-2 border border-gray-200 text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Xóa khỏi danh sách"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button 
                disabled={!item.inStock}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  item.inStock 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" /> Thêm vào Giỏ
              </button>
            </div>

          </div>
        ))}

        {favorites.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Danh sách yêu thích của bạn đang trống</p>
            <Link to="/" className="inline-block bg-primary-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-primary-700">
              Về Trang Chủ Khám Phá
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProfileFavorites;
