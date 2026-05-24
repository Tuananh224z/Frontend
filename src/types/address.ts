/**
 * Type cho dropdown địa chỉ Việt Nam.
 * Dùng để chọn Tỉnh/Thành phố → Quận/Huyện → Phường/Xã
 * (gọi từ API provinces.open-api.vn)
 */

export interface Province {
  code: number;
  name: string;
}

export interface District {
  code: number;
  name: string;
}

export interface Ward {
  code: number;
  name: string;
}
