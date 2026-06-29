/**
 * Type cho Sản phẩm và Cấu hình kỹ thuật.
 * Type Product được thiết kế đủ rộng để dùng chung cho:
 * - Trang chủ, Danh sách sản phẩm, Chi tiết sản phẩm
 * - Giỏ hàng, Chatbot gợi ý
 * - Form quản trị viên
 */
import type { Brand } from './brand';
import type { Category } from './category';

/** Cấu hình kỹ thuật của sản phẩm — tất cả field đều tùy chọn */
export interface ProductSpecs {
  cpu?: string;
  ram?: string;
  storage?: string;
  screenSize?: string;
  vga?: string;
  battery?: string;
  weight?: number;
  os?: string;
}

/** Sản phẩm */
export interface Product {
  _id: string;
  name: string;
  price: number;
  slug: string;
  images: string[];
  discountPrice?: number;
  specs?: ProductSpecs;
  brand?: Brand | string;
  category?: Category | string;
  stock?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  description?: string;
  summary?: string;
  shortDesc?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isHot?: boolean;
}
