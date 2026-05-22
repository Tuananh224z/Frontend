import api from './api';

export const productService = {
  // Products
  getProducts: async (params?: Record<string, string | number | boolean>) => {
    return api.get('/products', { params });
  },

  getProductBySlug: async (slug: string) => {
    return api.get(`/products/${slug}`);
  },

  createProduct: async (payload: any) => {
    return api.post('/products', payload);
  },

  updateProduct: async (id: string, payload: any) => {
    return api.put(`/products/${id}`, payload);
  },

  deleteProduct: async (id: string) => {
    return api.delete(`/products/${id}`);
  },

  uploadImage: async (formData: FormData) => {
    return api.post('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Categories
  getCategories: async (showAll?: boolean) => {
    return api.get('/categories', { params: showAll !== undefined ? { showAll } : undefined });
  },

  createCategory: async (payload: any) => {
    return api.post('/categories', payload);
  },

  updateCategory: async (id: string, payload: any) => {
    return api.put(`/categories/${id}`, payload);
  },

  deleteCategory: async (id: string) => {
    return api.delete(`/categories/${id}`);
  },

  // Brands
  getBrands: async (showAll?: boolean) => {
    return api.get('/brands', { params: showAll !== undefined ? { showAll } : undefined });
  },

  createBrand: async (payload: any) => {
    return api.post('/brands', payload);
  },

  updateBrand: async (id: string, payload: any) => {
    return api.put(`/brands/${id}`, payload);
  },

  deleteBrand: async (id: string) => {
    return api.delete(`/brands/${id}`);
  },

  // Reviews
  getReviews: async () => {
    return api.get('/reviews');
  },

  updateReviewStatus: async (id: string, isActive: boolean) => {
    return api.put(`/reviews/${id}/status`, { isActive });
  },

  replyReview: async (id: string, adminReply: string) => {
    return api.put(`/reviews/${id}/reply`, { adminReply });
  },

  getProductReviews: async (productId: string) => {
    return api.get(`/reviews/product/${productId}`);
  },

  createReview: async (payload: { product: string; rating: number; comment: string }) => {
    return api.post('/reviews', payload);
  }
};

export default productService;
