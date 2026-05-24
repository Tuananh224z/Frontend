const BACKEND_URL = 'http://localhost:5000';

/**
 * Lấy URL ảnh sản phẩm hợp lệ, hỗ trợ ảnh lưu trên backend hoặc link bên ngoài
 */
export const getProductImage = (images?: string[] | string): string => {
  const imgArray = Array.isArray(images)
    ? images
    : images
      ? [images]
      : [];

  if (imgArray.length === 0) {
    return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500';
  }

  const firstImg = imgArray[0];
  if (!firstImg) {
    return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500';
  }

  if (firstImg.startsWith('http://') || firstImg.startsWith('https://')) {
    return firstImg;
  }

  const cleanPath = firstImg.startsWith('/') ? firstImg : `/${firstImg}`;
  return `${BACKEND_URL}${cleanPath}`;
};

/**
 * Tạo số lượt xem ngẫu nhiên nhưng cố định theo ID sản phẩm
 */
export const getMockViews = (id: string): number => {
  if (!id) return 0;
  const code = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (code % 45) + 2; // Trả về từ 2 - 46 lượt xem
};

/**
 * Tạo số lượng đã bán ngẫu nhiên nhưng cố định theo ID sản phẩm
 */
export const getMockSold = (id: string): number => {
  if (!id) return 0;
  const code = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (code % 28) + 1; // Trả về từ 1 - 29 đã bán
};
