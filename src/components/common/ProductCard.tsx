import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Cpu, HardDrive, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatPrice, getDiscountPercent } from '../../utils/format';
import { getProductImage, getMockViews, getMockSold } from '../../utils/productHelper';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, onAddToCart, viewMode = 'grid' }: ProductCardProps) {
  const hasDiscount = product.discountPrice ? product.discountPrice > product.price : false;
  const isOutOfStock = product.stock === 0;
  const brandName = (product.brand && typeof product.brand === 'object')
    ? product.brand.name
    : (product.brand || 'Laptop');

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col md:flex-row relative p-4 gap-6 items-center md:items-start text-left">
        {/* Left: Image & Badge */}
        <div className="relative w-48 shrink-0 bg-slate-50 rounded-2xl overflow-hidden pt-[35%] md:pt-0 md:h-36">
          <Link to={`/product/${product.slug}`} className="absolute inset-0">
            <img
              src={getProductImage(product.images)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                <span className="bg-slate-900/80 text-white font-extrabold text-[10px] rounded-full px-3 py-1.5">
                  Hết hàng
                </span>
              </div>
            )}
          </Link>

          {/* Discount/Stock Badges */}
          <div className="absolute top-2 left-2 z-10">
            {isOutOfStock ? (
              <span className="px-2 py-0.5 text-[9px] font-extrabold text-white bg-slate-500 rounded-md">
                Hết
              </span>
            ) : hasDiscount ? (
              <span className="px-2 py-0.5 text-[9px] font-extrabold text-white bg-rose-500 rounded-md">
                -{getDiscountPercent(product.price, product.discountPrice!)}%
              </span>
            ) : null}
          </div>
        </div>

        {/* Middle: Details */}
        <div className="flex-grow flex flex-col justify-between space-y-3 text-left w-full">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {brandName}
            </span>
            <Link to={`/product/${product.slug}`} className="block">
              <h4 className="font-bold text-sm text-slate-800 hover:text-red-650 transition-colors">
                {product.name}
              </h4>
            </Link>

            {product.specs && (product.specs.cpu || product.specs.ram) ? (
              <div className="flex items-center gap-4 py-1">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Cpu className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="line-clamp-1">{product.specs.cpu || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <HardDrive className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="line-clamp-1">{product.specs.ram} | {product.specs.storage}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 line-clamp-2">
                {product.shortDesc || product.description || 'Sản phẩm cao cấp chất lượng vượt trội.'}
              </p>
            )}
          </div>

          {/* Stars, Views & Sold */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-700">{product.ratingsAverage || 5.0}</span>
              <span className="text-slate-400">({product.ratingsQuantity || 0})</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{getMockViews(product._id)}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
              <span>Đã bán {getMockSold(product._id)}</span>
            </div>
          </div>
        </div>

        {/* Right: Price & Buttons */}
        <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto h-full self-stretch">
          <div className="flex flex-col text-left md:text-right">
            <span className="font-extrabold text-lg text-red-600">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.discountPrice!)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => !isOutOfStock && onAddToCart(product)}
              disabled={isOutOfStock}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-red-655 bg-red-600 hover:bg-red-700 text-white active:scale-95 border-0'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Mua ngay</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div className="flex flex-col bg-white rounded-3xl border border-slate-200/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative justify-between min-h-[380px] text-left">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {isOutOfStock ? (
          <span className="px-2.5 py-1 text-[10px] font-extrabold text-white bg-slate-500 rounded-lg">
            Hết
          </span>
        ) : hasDiscount ? (
          <span className="px-2.5 py-1 text-[10px] font-extrabold text-white bg-rose-500 rounded-lg">
            -{getDiscountPercent(product.price, product.discountPrice!)}%
          </span>
        ) : null}
      </div>

      {/* Product Image Link */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block pt-[70%] bg-slate-100 overflow-hidden shrink-0"
      >
        <img
          src={getProductImage(product.images)}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <span className="bg-slate-900/80 text-white font-extrabold text-xs rounded-full px-4 py-2">
              Hết hàng
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-left">
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {brandName}
          </span>
          <Link to={`/product/${product.slug}`} className="block">
            <h4 className="font-bold text-sm text-slate-800 line-clamp-2 hover:text-red-650 transition-colors cursor-pointer">
              {product.name}
            </h4>
          </Link>

          {/* Conditional Specs or Description */}
          {product.specs && (product.specs.cpu || product.specs.ram) ? (
            <div className="space-y-1.5 py-2 border-y border-slate-100">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Cpu className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="line-clamp-1">{product.specs.cpu || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <HardDrive className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="line-clamp-1">
                  {product.specs.ram} | {product.specs.storage}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 line-clamp-2">
              {product.shortDesc || product.description || 'Sản phẩm cao cấp chất lượng vượt trội.'}
            </p>
          )}
        </div>

        {/* Stars, Views & Sold */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap py-1.5 border-t border-slate-100">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-slate-700">{product.ratingsAverage || 5.0}</span>
            <span className="text-slate-400">({product.ratingsQuantity || 0})</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{getMockViews(product._id)}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
            <span>Đã bán {getMockSold(product._id)}</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="flex items-end justify-between pt-1 relative pr-12">
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-base text-red-600">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.discountPrice!)}
              </span>
            )}
          </div>

          <button
            onClick={() => !isOutOfStock && onAddToCart(product)}
            disabled={isOutOfStock}
            className={`absolute bottom-0 right-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer border-0 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-red-50 text-red-500 hover:bg-red-600 hover:text-white active:scale-95'
            }`}
            title={isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
