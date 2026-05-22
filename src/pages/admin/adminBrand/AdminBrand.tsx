import { useState, useEffect } from 'react';
import productService from '../../../services/productService';
import { Copyright, Plus, Search, Edit3, Trash2, CheckCircle2, Eye, EyeOff, Loader2, AlertCircle, Upload, X } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

const getBrandLogo = (img: string) => {
  if (!img) return '';
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  const cleanPath = img.startsWith('/') ? img : `/${img}`;
  return `${BACKEND_URL}${cleanPath}`;
};

export default function AdminBrand() {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('images', files[0]);

    try {
      setIsUploading(true);
      setError('');
      const response = await productService.uploadImage(formData);
      if (response.data?.status === 'success') {
        const uploadedUrls = response.data.urls || response.data.data;
        if (uploadedUrls && uploadedUrls.length > 0) {
          setLogo(uploadedUrls[0]);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Tải ảnh lên thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('images', files[0]);

    try {
      setIsUploading(true);
      setError('');
      const response = await productService.uploadImage(formData);
      if (response.data?.status === 'success') {
        const uploadedUrls = response.data.urls || response.data.data;
        if (uploadedUrls && uploadedUrls.length > 0) {
          setLogo(uploadedUrls[0]);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Tải ảnh lên thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      setError('');
      // Request all brands including inactive ones
      const response = await productService.getBrands(true);
      if (response.data?.status === 'success') {
        setBrands(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách thương hiệu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedBrand(null);
    setName('');
    setSlug('');
    setDescription('');
    setLogo('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand: any) => {
    setSelectedBrand(brand);
    setName(brand.name);
    setSlug(brand.slug);
    setDescription(brand.description || '');
    setLogo(brand.logo || '');
    setIsActive(brand.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      const payload = {
        name,
        slug: slug || undefined, // empty slug will auto-generate in backend
        description,
        logo,
        isActive,
      };

      if (selectedBrand) {
        // Edit Brand
        const response = await productService.updateBrand(selectedBrand._id, payload);
        if (response.data?.status === 'success') {
          setSuccess('Cập nhật thương hiệu thành công!');
        }
      } else {
        // Create Brand
        const response = await productService.createBrand(payload);
        if (response.data?.status === 'success') {
          setSuccess('Thêm thương hiệu mới thành công!');
        }
      }

      setIsModalOpen(false);
      fetchBrands();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lưu thương hiệu thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này không?')) {
      return;
    }
    try {
      setError('');
      setSuccess('');
      const response = await productService.deleteBrand(id);
      if (response.data?.status === 'success') {
        setSuccess('Xóa thương hiệu thành công!');
        fetchBrands();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Xóa thương hiệu thất bại');
    }
  };

  const toggleStatus = async (brand: any) => {
    try {
      setError('');
      setSuccess('');
      const response = await productService.updateBrand(brand._id, {
        ...brand,
        isActive: !brand.isActive,
      });
      if (response.data?.status === 'success') {
        setSuccess(`Đã ${!brand.isActive ? 'hiển thị' : 'ẩn'} thương hiệu thành công!`);
        fetchBrands();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Action Button */}
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-sm transition-colors cursor-pointer border-0 shadow-lg shadow-purple-550/15"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm thương hiệu</span>
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/20 text-emerald-400 text-sm font-semibold rounded-xl border border-emerald-900">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-950/20 text-red-400 text-sm font-semibold rounded-xl border border-red-900">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Brand Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800/80 text-slate-400 font-semibold text-sm">
          <Copyright className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          Không tìm thấy thương hiệu nào
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-450 font-bold bg-slate-900/50">
                  <th className="px-6 py-4">Logo</th>
                  <th className="px-6 py-4">Thương hiệu</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Mô tả</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredBrands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-slate-850/40 transition-colors text-sm">
                    {/* Logo */}
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 p-1.5 border border-slate-800 flex items-center justify-center">
                        {brand.logo ? (
                          <img src={getBrandLogo(brand.logo)} alt={brand.name} className="w-full h-full object-contain" />
                        ) : (
                          <Copyright className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4 font-bold text-white">{brand.name}</td>

                    {/* Slug */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">/{brand.slug}</td>

                    {/* Description */}
                    <td className="px-6 py-4 text-slate-350 max-w-xs truncate text-xs font-medium">
                      {brand.description || 'Không có mô tả'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(brand)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border cursor-pointer ${brand.isActive
                            ? 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40'
                            : 'text-slate-400 bg-slate-800/20 border-slate-700/40'
                          }`}
                        title="Click để đổi trạng thái"
                      >
                        {brand.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{brand.isActive ? 'Hiển thị' : 'Ẩn'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(brand)}
                          className="p-2 text-slate-450 hover:text-purple-400 hover:bg-purple-950/20 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="p-2 text-slate-450 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                          title="Xóa thương hiệu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl relative">
            <div className="border-b border-slate-850 pb-3">
              <h3 className="text-base font-extrabold text-white">
                {selectedBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tên thương hiệu <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: ASUS, Dell"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Đường dẫn rút gọn (Slug - Tùy chọn)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Ví dụ: asus (bỏ trống tự sinh)"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Logo thương hiệu
                </label>
                {logo ? (
                  <div className="relative w-full aspect-video rounded-xl bg-slate-950 p-2 border border-slate-800 flex items-center justify-center group overflow-hidden">
                    <img
                      src={getBrandLogo(logo)}
                      alt="Brand Logo Preview"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setLogo('')}
                      className="absolute inset-0 bg-red-600/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity border-0 cursor-pointer text-xs font-bold gap-1"
                    >
                      <X className="w-4 h-4" /> Xóa ảnh
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center gap-2 p-6 bg-slate-950 border border-dashed border-slate-800 rounded-xl transition-all hover:border-purple-500/50"
                  >
                    <Upload className="w-6 h-6 text-slate-450 shrink-0" />
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-200 block">
                        Kéo thả hoặc{" "}
                        <label className="text-red-500 hover:text-red-400 cursor-pointer underline inline">
                          chọn file
                          <input
                            type="file"
                            onChange={handleLogoUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                      </span>
                      <span className="text-[10px] text-slate-450 font-medium block mt-1">
                        PNG, JPG, WEBP — tối đa 5MB
                      </span>
                    </div>
                    {isUploading && (
                      <Loader2 className="w-4 h-4 animate-spin text-purple-500 mt-1" />
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả thương hiệu..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200 resize-none"
                />
              </div>

              {/* Toggle isActive */}
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Hiển thị thương hiệu</h4>
                  <p className="text-[10px] text-slate-450 font-bold mt-0.5">Nếu tắt, thương hiệu sẽ bị ẩn khỏi trang mua sắm</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-350 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-650 peer-checked:after:bg-white peer-checked:bg-purple-600" />
                </label>
              </div>

              {/* Actions Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-extrabold rounded-xl text-xs transition-colors border-0 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors border-0 shadow-lg shadow-purple-550/15 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
