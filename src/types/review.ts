/** Đánh giá sản phẩm */
export interface Review {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    avatar?: string;
  } | null;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
  adminReply?: string;
  adminRepliedAt?: string;
  isActive?: boolean;
}
