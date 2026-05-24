/**
 * Type liên quan tới Người dùng và Địa chỉ.
 */

/** Địa chỉ rút gọn (lưu trong User.address — địa chỉ mặc định) */
export interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
}

/** Một địa chỉ trong danh sách User.addresses[] */
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

/** Vai trò tài khoản */
export type UserRole = 'customer' | 'admin';

/** Tài khoản người dùng (đã ẩn password) */
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
