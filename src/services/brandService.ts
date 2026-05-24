import api from '../api/axiosInstance';

/**
 * Service gọi API liên quan tới Thương hiệu (Brand).
 */
export const brandService = {
  // ====== Public ======
  // GET /brands — Lấy danh sách thương hiệu (chỉ active mặc định)
  getBrands: async (params?: { showAll?: boolean }) => {
    return api.get('/brands', { params });
  },

  // GET /brands/:idOrSlug — Lấy chi tiết 1 thương hiệu
  getBrandByIdOrSlug: async (idOrSlug: string) => {
    return api.get(`/brands/${idOrSlug}`);
  },

  // ====== Admin ======
  // POST /brands — Thêm thương hiệu mới
  createBrand: async (brandData: any) => {
    return api.post('/brands', brandData);
  },

  // PUT /brands/:id — Cập nhật thương hiệu
  updateBrand: async (brandId: string, brandData: any) => {
    return api.put(`/brands/${brandId}`, brandData);
  },

  // DELETE /brands/:id — Xóa thương hiệu
  deleteBrand: async (brandId: string) => {
    return api.delete(`/brands/${brandId}`);
  },
};

export default brandService;
