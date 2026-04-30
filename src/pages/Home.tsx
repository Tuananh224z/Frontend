import { Link } from 'react-router-dom';

import { ShoppingCart, Heart, Eye, Star, ShoppingBag } from 'lucide-react';

// Dummy data for initial UI
const categories = [
  { id: 1, name: 'Laptop Gaming', image: 'https://via.placeholder.com/80x80/eef2ff/4f46e5?text=LT' },
  { id: 2, name: 'PC Lắp Ráp', image: 'https://via.placeholder.com/80x80/eef2ff/4f46e5?text=PC' },
  { id: 3, name: 'Màn Hình', image: 'https://via.placeholder.com/80x80/eef2ff/4f46e5?text=MH' },
  { id: 4, name: 'Bàn Phím', image: 'https://via.placeholder.com/80x80/eef2ff/4f46e5?text=BP' },
  { id: 5, name: 'Chuột', image: 'https://via.placeholder.com/80x80/eef2ff/4f46e5?text=M' },
  { id: 6, name: 'Tai Nghe', image: 'https://via.placeholder.com/80x80/eef2ff/4f46e5?text=HP' },
  { id: 7, name: 'Linh Kiện', image: 'https://via.placeholder.com/80x80/eef2ff/4f46e5?text=LK' },
  { id: 8, name: 'Phụ Kiện', image: 'https://via.placeholder.com/80x80/eef2ff/4f46e5?text=PK' },
];

const featuredProducts = [
  { id: 1, name: 'Laptop Asus ROG Strix G15', price: 25990000, oldPrice: 28990000, img: 'https://via.placeholder.com/250', sku: 'ROG-G15', desc: 'Intel Core i7, 16GB RAM, RTX 3050Ti, 512GB SSD. Viền siêu mỏng.', reviews: 156, views: 3420, purchases: 125, rating: 4.8 },
  { id: 2, name: 'PC Gaming Titan i9', price: 45000000, oldPrice: 50000000, img: 'https://via.placeholder.com/250', sku: 'TITAN-I9', desc: 'Core i9 13900K, 32GB RAM, RTX 4080, 1TB NVMe. Hiệu năng đỉnh cao.', reviews: 42, views: 890, purchases: 15, rating: 5.0 },
  { id: 3, name: 'Màn hình LG UltraGear 27"', price: 8500000, oldPrice: 9900000, img: 'https://via.placeholder.com/250', sku: 'LG-27GL', desc: '27 inch, 2K, 144Hz, Nano IPS, 1ms. Màu sắc cực kỳ trung thực.', reviews: 320, views: 5600, purchases: 450, rating: 4.7 },
  { id: 4, name: 'Bàn phím cơ Razer BlackWidow', price: 2990000, oldPrice: 3500000, img: 'https://via.placeholder.com/250', sku: 'RZ-BW', desc: 'Green Switch, LED Chroma RGB, Tactile. Gõ cực đã tay.', reviews: 89, views: 1200, purchases: 67, rating: 4.5 },
];

const brands = [
  'Asus', 'Acer', 'MSI', 'Gigabyte', 'Dell', 'HP', 'Lenovo', 'Apple'
];

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Banner Section */}
      <section className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-md group">
            <img 
              src="https://via.placeholder.com/800x400/e50027/ffffff?text=SUMMER+SALE+Uto+To+50%25" 
              alt="Main Banner" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-8">
              <h2 className="text-white text-3xl font-bold mb-2">Đại Tiệc Mùa Hè</h2>
              <p className="text-white text-lg mb-4">Giảm giá lên đến 50% tất cả các mặt hàng</p>
              <button className="btn-primary w-max">Mua Ngay</button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-[142px] md:h-[192px] rounded-xl overflow-hidden shadow-md">
               <img src="https://via.placeholder.com/400x200/333/fff?text=GAMING+LAPTOP" alt="Sub Banner 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
            </div>
            <div className="h-[142px] md:h-[192px] rounded-xl overflow-hidden shadow-md">
               <img src="https://via.placeholder.com/400x200/111/fff?text=PC+BUILD" alt="Sub Banner 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1200px] mx-auto px-4 py-8">
        <h2 className="section-title">Danh Mục Nổi Bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
              <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm text-center cursor-pointer hover:shadow-md hover:border-primary-500 border border-transparent transition-all group flex flex-col items-center">
                <div className="mb-3 w-16 h-16 rounded-full overflow-hidden flex items-center justify-center group-hover:-translate-y-2 transition-transform shadow-sm border border-gray-100 bg-gray-50">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-medium text-sm text-gray-800">{cat.name}</h3>
             </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1200px] mx-auto px-4 py-8">
         <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-900 relative pb-2 uppercase">
              Sản Phẩm <span className="text-primary-600">Nổi Bật</span>
              <span className="absolute bottom-0 left-0 w-16 h-1 bg-primary-600 rounded-full"></span>
            </h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-800 font-medium text-sm">Xem tất cả →</Link>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
               <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 group relative flex flex-col">
                  {/* Heart Icon - Top Right of the card */}
                  <button className="absolute top-3 right-3 z-30 p-2 text-gray-400 hover:text-red-500 bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0" title="Yêu thích">
                     <Heart className="w-5 h-5" />
                  </button>

                  <div className="relative overflow-hidden aspect-square p-4 bg-white flex items-center justify-center">
                     <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                     </span>
                     <img src={product.img} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  
                  <div className="p-4 border-t border-gray-50 flex-grow flex flex-col relative">
                     <div className="text-xs text-gray-500 mb-1">SKU: {product.sku}</div>
                     <Link to={`/product/${product.id}`} className="block">
                       <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-primary-600 transition-colors h-[40px]" title={product.name}>
                         {product.name}
                       </h3>
                     </Link>

                     {/* Short description */}
                     <p className="text-xs text-gray-500 line-clamp-2 mb-2 h-[32px]">
                        {product.desc}
                     </p>

                     {/* Stats: Rating, Views, Purchases */}
                     <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-3">
                        <div className="flex items-center gap-1 text-yellow-500">
                           <Star className="w-3 h-3 fill-current" />
                           <span className="font-medium">{product.rating}</span>
                           <span className="text-gray-400">({product.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1">
                           <Eye className="w-3 h-3" />
                           <span>{product.views}</span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0 truncate">
                           <ShoppingBag className="w-3 h-3 flex-shrink-0" />
                           <span className="truncate">Đã bán {product.purchases}</span>
                        </div>
                     </div>

                     {/* Price & Cart button */}
                     <div className="mt-auto flex items-end justify-between">
                        <div className="flex flex-col">
                           <span className="text-primary-600 font-bold text-lg leading-tight">{product.price.toLocaleString('vi-VN')}₫</span>
                           <span className="text-gray-400 text-sm line-through decoration-gray-300">{product.oldPrice.toLocaleString('vi-VN')}₫</span>
                        </div>
                        <button className="bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white p-2.5 rounded-xl transition-colors self-end shadow-sm border border-primary-100" title="Thêm vào giỏ hàng">
                           <ShoppingCart className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Brands Slider (Static representation) */}
      <section className="max-w-[1200px] mx-auto px-4 py-8">
        <h2 className="section-title">Thương Hiệu Nổi Bật</h2>
        <div className="flex flex-wrap gap-4 justify-center md:justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           {brands.map((brand, index) => (
             <div key={index} className="w-24 h-12 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-400 grayscale hover:grayscale-0 transition-all cursor-pointer hover:bg-white hover:shadow-sm hover:text-gray-800">
               {brand}
             </div>
           ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
