import api from '../api/axiosInstance';

/**
 * Service gọi API liên quan tới Danh mục (Category).
 */
export const categoryService = {
  // ====== Public ======
  // GET /categories — Lấy danh sách danh mục (chỉ active mặc định)
  getCategories: async (params?: { showAll?: boolean }) => {
    return api.get('/categories', { params });
  },

  // GET /categories/:idOrSlug — Lấy chi tiết 1 danh mục
  getCategoryByIdOrSlug: async (idOrSlug: string) => {
    return api.get(`/categories/${idOrSlug}`);
  },

  // ====== Admin ======
  // POST /categories — Thêm danh mục mới
  createCategory: async (categoryData: any) => {
    return api.post('/categories', categoryData);
  },

  // PUT /categories/:id — Cập nhật danh mục
  updateCategory: async (categoryId: string, categoryData: any) => {
    return api.put(`/categories/${categoryId}`, categoryData);
  },

  // DELETE /categories/:id — Xóa danh mục
  deleteCategory: async (categoryId: string) => {
    return api.delete(`/categories/${categoryId}`);
  },
};

export default categoryService;
