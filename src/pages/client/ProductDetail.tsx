import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { ChevronRight } from 'lucide-react';
import { useCart, type Product as CartProduct } from '../../contexts/CartContext';
import ProductGallery from '../../components/ProductGallery';
import ProductInfo from '../../components/ProductInfo';
import ProductSpecsAndDesc from '../../components/ProductSpecsAndDesc';
import ProductReviews from '../../components/ProductReviews';
import type { Product as ProductType } from '../../types/product';


const MOCK_ZEPHYRUS: ProductType = {
  _id: 'zephyrus-g14-mock',
  name: 'Laptop ASUS ROG Zephyrus G14 2024 GA403',
  price: 2000,
  discountPrice: 4000,
  slug: 'asus-rog-zephyrus-g14-2024-ga403',
  images: [
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
  ],
  specs: {
    cpu: 'AMD Ryzen 9 8945HS',
    ram: '16GB LPDDR5X',
    storage: '512GB SSD NVMe',
    vga: 'NVIDIA GeForce RTX 4060 8GB',
    screenSize: '14.0 inch 3K OLED 120Hz',
    battery: '73Whrs',
    weight: 1.5,
    os: 'Windows 11 Home'
  },
  brand: { name: 'ASUS' },
  description: 'ROG Zephyrus G14 2024 định nghĩa lại khái niệm laptop gaming di động. Với thiết kế nhôm nguyên khối siêu mỏng nhẹ nhưng mang trong mình cấu hình Ryzen 9 8000 series mới nhất. Điểm nhấn lớn nhất chính là màn hình Nebula OLED 3K 120Hz với độ chính xác màu tuyệt đối, hỗ trợ G-Sync và thời gian đáp ứng 0.2ms. Hệ thống tản nhiệt ROG Intelligent Cooling giúp máy luôn mát mẻ dưới mọi tác vụ.'
};

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('base');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Set the price difference for the upgraded version
  const versionPriceDifference = 45988000;

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        if (slug === 'asus-rog-zephyrus-g14-2024-ga403') {
          setProduct(MOCK_ZEPHYRUS);
          setIsLoading(false);
          return;
        }

        const res = await productService.getProductBySlug(slug!);
        if (res.data?.data) {
          setProduct(res.data.data);
        } else {
          // If product is not found in database, check fallback mock list
          setProduct(MOCK_ZEPHYRUS);
        }
      } catch (err) {
        console.warn('Lỗi kết nối API, đang tải dữ liệu mẫu cho sản phẩm này:', err);
        setProduct(MOCK_ZEPHYRUS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    // Reset selection when product changes
    setSelectedVersion('base');
    setQuantity(1);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-bold text-slate-800">Không tìm thấy sản phẩm này</p>
        <Link to="/" className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white rounded-xl font-bold transition-all">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const brandName = typeof product.brand === 'object' ? product.brand.name : (product.brand || 'Laptop');

  // Add to cart handler
  const handleAddToCart = () => {
    const upgradeName = 'RAM 32GB - SSD 1TB';
    
    const brandObj = typeof product.brand === 'string'
      ? { name: product.brand }
      : product.brand
        ? { name: product.brand.name }
        : undefined;

    const specsObj = product.specs ? {
      cpu: product.specs.cpu,
      ram: selectedVersion === 'upgrade' ? '32GB' : product.specs.ram,
      storage: selectedVersion === 'upgrade' ? '1TB' : product.specs.storage,
      screenSize: product.specs.screenSize,
    } : undefined;

    const finalProduct: CartProduct = {
      _id: selectedVersion === 'upgrade' ? `${product._id}_upgrade` : product._id,
      name: selectedVersion === 'upgrade' ? `${product.name} (${upgradeName})` : product.name,
      price: selectedVersion === 'upgrade' ? product.price + versionPriceDifference : product.price,
      discountPrice: product.discountPrice !== undefined && product.discountPrice > product.price
        ? product.discountPrice + (selectedVersion === 'upgrade' ? versionPriceDifference : 0)
        : undefined,
      images: product.images,
      slug: product.slug,
      specs: specsObj,
      brand: brandObj,
    };

    addToCart(finalProduct, quantity);
  };

  // Buy now handler
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="text-xs sm:text-sm text-slate-500 flex items-center flex-wrap gap-2 mb-6">
          <Link to="/" className="hover:text-red-600 transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/category/laptop" className="hover:text-red-600 transition-colors">Laptop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="hover:text-red-600 transition-colors cursor-pointer uppercase shrink-0">{brandName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-800 font-medium truncate max-w-xs sm:max-w-md">{product.name}</span>
        </div>

        {/* Main Product Panel */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left: Product Images Gallery */}
            <ProductGallery
              images={product.images}
              productName={product.name}
              discountPrice={product.discountPrice}
              price={product.price}
            />

            {/* Right: Product Actions and Quick Details */}
            <ProductInfo
              product={product}
              selectedVersion={selectedVersion}
              setSelectedVersion={setSelectedVersion}
              quantity={quantity}
              setQuantity={setQuantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              versionPriceDifference={versionPriceDifference}
            />

          </div>
        </div>

        {/* Specifications and Details */}
        <ProductSpecsAndDesc
          description={product.description}
          specs={product.specs}
          productName={product.name}
        />

        {/* Product Reviews */}
        <ProductReviews productId={product._id} />

      </div>
    </main>
  );
}
