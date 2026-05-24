/**
 * Định dạng số tiền sang dạng tiền tệ Việt Nam (VNĐ)
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

/**
 * Tính phần trăm giảm giá (discountPrice là giá cũ, price là giá mới)
 */
export const getDiscountPercent = (price: number, discountPrice: number): number => {
  if (!discountPrice || discountPrice <= price) return 0;
  return Math.round(((discountPrice - price) / discountPrice) * 100);
};
