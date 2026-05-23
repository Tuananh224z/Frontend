/**
 * Kiểu dữ liệu liên quan đến User và Address.
 * Dùng chung cho AuthContext, services, pages.
 */

/** Địa chỉ gọn — lưu trong User.address (địa chỉ mặc định) */
export interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
}

/** Một địa chỉ trong danh sách addresses của User */
export interface UserAddress {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

/** Vai trò của tài khoản */
export type UserRole = 'customer' | 'admin';

/** Thông tin tài khoản người dùng (đã ẩn password) */
export interface User {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  address?: Address;
  addresses?: UserAddress[];
  createdAt?: string;
  updatedAt?: string;
}

/** Payload đăng ký tài khoản */
export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: Partial<Address>;
}

/** Payload đăng nhập */
export interface LoginPayload {
  email: string;
  password: string;
}
