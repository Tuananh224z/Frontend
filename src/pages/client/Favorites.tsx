import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export default function Favorites() {
  const { user, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleRemove = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorite(productId);
    } catch (err: any) {
      alert(err.message || 'Thao tác thất bại');
    }
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const favorites = user?.favorites || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-red-600 fill-red-650" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Sản phẩm yêu thích</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-xs">
          <Heart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Danh sách yêu thích trống</h3>
          <p className="text-slate-400 text-sm font-medium mb-6">Bạn chưa lưu sản phẩm nào vào danh sách yêu thích.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl transition-colors cursor-pointer text-sm"
          >
            Khám phá sản phẩm ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((product: any) => {
            const hasPromo = product.discountPrice > 0;
            const finalPrice = hasPromo ? product.discountPrice : product.price;

            return (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product.slug}`)}
                className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
              >
                {/* Product Image & Badge */}
                <div className="relative pt-[100%] bg-slate-50">
                  <img
                    src={product.images?.[0]?.startsWith('http') ? product.images[0] : `http://localhost:5000${product.images?.[0]}`}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  {hasPromo && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                      GIẢM GIÁ
                    </span>
                  )}
                  {/* Quick remove button */}
                  <button
                    onClick={(e) => handleRemove(product._id, e)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer border-0"
                    title="Xóa khỏi danh sách yêu thích"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug group-hover:text-red-600 transition-colors mb-2">
                      {product.name}
                    </h3>
                    
                    {/* Prices */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-extrabold text-red-600 text-base">
                        {formatPrice(finalPrice)}
                      </span>
                      {hasPromo && (
                        <span className="text-xs text-slate-400 line-through font-medium">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full py-2 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-650 font-bold rounded-xl flex items-center justify-center gap-1 text-xs transition-colors cursor-pointer border-0"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Thêm</span>
                    </button>
                    <button
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1 text-xs transition-colors cursor-pointer border-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi tiết</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
