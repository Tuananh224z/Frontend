import { Star, CheckCircle, Share2, ShoppingCart, Truck, ShieldCheck, RotateCcw, Plus, Minus } from 'lucide-react';
import type { Product as ProductType } from '../types/product';
import { formatPrice } from '../utils/format';

interface ProductInfoProps {
  product: ProductType;
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  versionPriceDifference: number;
}

export default function ProductInfo({
  product,
  selectedVersion,
  setSelectedVersion,
  quantity,
  setQuantity,
  onAddToCart,
  onBuyNow,
  versionPriceDifference
}: ProductInfoProps) {

  // Determine brand name
  const brandName = typeof product.brand === 'object' ? product.brand.name : (product.brand || 'Laptop');

  // Pricing calculations
  const hasDiscount = product.discountPrice !== undefined && product.discountPrice > product.price;
  
  // Base prices
  const basePrice = product.price;
  const baseOriginalPrice = hasDiscount ? product.discountPrice! : product.price;

  // Check if product is actually a Laptop/PC with valid RAM and Storage specifications
  const hasRamAndStorage = !!(
    product.specs?.ram && 
    product.specs.ram.trim() !== '' && 
    product.specs.ram.toUpperCase() !== 'N/A' && 
    product.specs.storage && 
    product.specs.storage.trim() !== '' && 
    product.specs.storage.toUpperCase() !== 'N/A'
  );

  // Actual display prices with version price difference added (only if versions exist)
  const displayPrice = basePrice + (selectedVersion === 'upgrade' && hasRamAndStorage ? versionPriceDifference : 0);
  const displayOriginalPrice = baseOriginalPrice + (selectedVersion === 'upgrade' && hasRamAndStorage ? versionPriceDifference : 0);
  const displaySavings = displayOriginalPrice - displayPrice;

  // Versions
  const baseVersionName = `RAM ${product.specs?.ram || '16GB'} - SSD ${product.specs?.storage || '512GB'}`;
  const upgradeVersionName = `RAM 32GB - SSD 1TB`;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Brand badge */}
      <div>
        <span className="inline-block px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-md tracking-wider uppercase border border-blue-100">
          {brandName}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
        {product.name}
      </h1>

      {/* Ratings & Stock Status */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 py-1 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
          <span className="font-bold text-slate-800 ml-1">5</span>
        </div>
        <span className="text-slate-300">|</span>
        <span>0 đánh giá</span>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1 text-emerald-600 font-medium">
          <CheckCircle className="w-4 h-4 fill-emerald-50 text-emerald-600" />
          <span>Còn hàng</span>
        </div>
      </div>

      {/* Pricing display */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl font-black text-rose-500">
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-slate-400 line-through text-sm">
              {formatPrice(displayOriginalPrice)}
            </span>
          )}
        </div>
        {hasDiscount && (
          <div>
            <span className="inline-block px-2.5 py-0.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-md">
              Tiết kiệm {formatPrice(displaySavings)}
            </span>
          </div>
        )}
      </div>

      {/* Highlight/Recommendation Banner */}
      {(product.shortDesc || product.summary || product.slug === 'laptop-gaming-asus-rog-zephyrus-g14-ga403wr-qs156ws' || product.slug === 'asus-rog-zephyrus-g14-2024-ga403') && (
        <div className="p-3 bg-rose-50/50 border border-rose-100/50 rounded-xl text-sm text-rose-600 font-medium leading-relaxed">
          {product.shortDesc || product.summary || "Laptop gaming 14 inch mạnh mẽ nhất thế giới với màn hình OLED"}
        </div>
      )}

      {/* Versions Selector */}
      {hasRamAndStorage && (
        <div className="flex flex-col gap-3">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Phiên bản:</span>
          <div className="flex flex-wrap gap-3">
            {/* Base version */}
            <button
              onClick={() => setSelectedVersion('base')}
              className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all text-left cursor-pointer ${
                selectedVersion === 'base'
                  ? 'border-red-600 text-red-600 bg-red-50/20'
                  : 'border-slate-200 text-slate-700 bg-white hover:border-slate-400'
              }`}
            >
              {baseVersionName}
            </button>

            {/* Upgrade version */}
            <button
              onClick={() => setSelectedVersion('upgrade')}
              className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all text-left cursor-pointer ${
                selectedVersion === 'upgrade'
                  ? 'border-red-600 text-red-600 bg-red-50/20'
                  : 'border-slate-200 text-slate-700 bg-white hover:border-slate-400'
              }`}
            >
              {upgradeVersionName} <span className="text-xs font-semibold text-slate-500 ml-1">+{formatPrice(versionPriceDifference)}</span>
            </button>
          </div>
        </div>
      )}

      {/* Action panel (Quantity, Add to cart, Buy now) */}
      <div className="flex flex-col gap-4 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-slate-200 rounded-xl h-12 overflow-hidden bg-slate-50">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 h-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-500"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-bold text-slate-800 text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 h-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-500"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={onAddToCart}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-600/15 transition-all cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Thêm vào giỏ</span>
          </button>



          {/* Share button */}
          <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-350 transition-all cursor-pointer">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Buy Now button */}
        <button
          onClick={onBuyNow}
          className="w-full flex items-center justify-center gap-2 h-12.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/15 transition-all cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Mua ngay — Giao hàng nhanh</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
            <Truck className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-600">Miễn phí giao toàn quốc</span>
        </div>
        <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-600">Bảo hành chính hãng</span>
        </div>
        <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
            <RotateCcw className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-600">Đổi trả 30 ngày</span>
        </div>
      </div>
    </div>
  );
}
