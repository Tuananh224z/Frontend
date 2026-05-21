import { useState, useEffect } from 'react';
import productService from '../../../services/productService';
import { Tags, Plus, Search, Edit3, Trash2, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2, Upload, X } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setImage(uploadedUrls[0]);
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
          setImage(uploadedUrls[0]);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Tải ảnh lên thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await productService.getCategories(true);
      if (response.data?.status === 'success') {
        setCategories(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách danh mục');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: any) => {
    setSelectedCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setIsActive(cat.isActive);
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
        slug: slug || undefined, // empty slug will auto-generate
        description,
        image,
        isActive,
      };

      if (selectedCategory) {
        // Edit Category
        const response = await productService.updateCategory(selectedCategory._id, payload);
        if (response.data?.status === 'success') {
          setSuccess('Cập nhật danh mục thành công!');
        }
      } else {
        // Create Category
        const response = await productService.createCategory(payload);
        if (response.data?.status === 'success') {
          setSuccess('Thêm danh mục mới thành công!');
        }
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lưu danh mục thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      return;
    }
    try {
      setError('');
      setSuccess('');
      const response = await productService.deleteCategory(id);
      if (response.data?.status === 'success') {
        setSuccess('Xóa danh mục thành công!');
        fetchCategories();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Xóa danh mục thất bại');
    }
  };

  const toggleStatus = async (cat: any) => {
    try {
      setError('');
      setSuccess('');
      const response = await productService.updateCategory(cat._id, {
        ...cat,
        isActive: !cat.isActive,
      });
      if (response.data?.status === 'success') {
        setSuccess(`Đã ${!cat.isActive ? 'hiển thị' : 'ẩn'} danh mục thành công!`);
        fetchCategories();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
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
          <span>Thêm danh mục</span>
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

      {/* Categories Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800/80 text-slate-400 font-semibold text-sm">
          <Tags className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          Không tìm thấy danh mục nào
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-450 font-bold bg-slate-900/50">
                  <th className="px-6 py-4">Hình ảnh</th>
                  <th className="px-6 py-4">Tên danh mục</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Mô tả</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-850/40 transition-colors text-sm">
                    {/* Image */}
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 p-1 border border-slate-800 flex items-center justify-center">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                        ) : (
                          <Tags className="w-5 h-5 text-slate-650" />
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4 font-bold text-white">{cat.name}</td>

                    {/* Slug */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">/{cat.slug}</td>

                    {/* Description */}
                    <td className="px-6 py-4 text-slate-350 max-w-xs truncate text-xs font-medium">
                      {cat.description || 'Không có mô tả'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border cursor-pointer ${cat.isActive
                          ? 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40'
                          : 'text-slate-400 bg-slate-800/20 border-slate-700/40'
                          }`}
                        title="Click để đổi trạng thái"
                      >
                        {cat.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{cat.isActive ? 'Hiển thị' : 'Ẩn'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-2 text-slate-450 hover:text-purple-400 hover:bg-purple-950/20 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-2 text-slate-450 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                          title="Xóa danh mục"
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
                {selectedCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tên danh mục <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Laptop Gaming, Laptop Văn Phòng"
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
                  placeholder="Ví dụ: laptop-gaming (bỏ trống tự sinh)"
                  className="w-full px-4 py-2.5 bg-slate-955 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Ảnh minh họa danh mục
                </label>
                {image ? (
                  <div className="relative w-full aspect-video rounded-xl bg-slate-950 p-2 border border-slate-800 flex items-center justify-center group overflow-hidden">
                    <img
                      src={image.startsWith('http') ? image : `http://localhost:5000${image}`}
                      alt="Category Preview"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImage('')}
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
                            onChange={handleImageUpload}
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
                  placeholder="Nhập mô tả danh mục..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200 resize-none"
                />
              </div>

              {/* Toggle isActive */}
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Hiển thị danh mục</h4>
                  <p className="text-[10px] text-slate-455 font-bold mt-0.5 text-slate-400">Nếu tắt, danh mục này sẽ bị ẩn khỏi menu</p>
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
