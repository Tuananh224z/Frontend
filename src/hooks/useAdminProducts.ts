import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

// Helper to convert legacy spec object to specGroups structure for backward compatibility
const convertSpecsToGroups = (specs: any) => {
  if (!specs) return [];
  const items: any[] = [];
  if (specs.cpu) items.push({ key: 'CPU', value: specs.cpu });
  if (specs.ram) items.push({ key: 'RAM', value: specs.ram });
  if (specs.storage) items.push({ key: 'Ổ cứng', value: specs.storage });
  if (specs.vga) items.push({ key: 'Card đồ họa', value: specs.vga });
  if (specs.screenSize) items.push({ key: 'Màn hình', value: specs.screenSize });
  if (specs.battery) items.push({ key: 'Pin', value: specs.battery });
  if (specs.weight) items.push({ key: 'Trọng lượng (kg)', value: String(specs.weight) });
  if (specs.os) items.push({ key: 'Hệ điều hành', value: specs.os });

  if (items.length > 0) {
    return [{ name: 'Cấu hình chi tiết', items }];
  }
  return [];
};

export function useAdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 8;

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form View States
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Product Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState<string | number>('');
  const [discountPrice, setDiscountPrice] = useState<string | number>('');
  const [stock, setStock] = useState<string | number>('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string | number>('');
  const [summary, setSummary] = useState('');
  const [tagsString, setTagsString] = useState('');

  // Badges
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isHot, setIsHot] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Dynamic Specs State
  const [specGroups, setSpecGroups] = useState<any[]>([]);

  // Image Uploading State
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchFilters = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        productService.getCategories(true),
        productService.getBrands(true),
      ]);
      if (catRes.data?.status === 'success') setCategories(catRes.data.data);
      if (brandRes.data?.status === 'success') setBrands(brandRes.data.data);
    } catch (err) {
      console.error('Lỗi tải danh mục/thương hiệu:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError('');

      const params: Record<string, string | number | boolean> = {
        page,
        limit,
        showAll: true,
      };

      if (search) params.search = search;
      if (selectedCatFilter) params.category = selectedCatFilter;
      if (selectedBrandFilter) params.brand = selectedBrandFilter;

      const response = await productService.getProducts(params);
      if (response.data?.status === 'success') {
        const targetData = response.data.data || response.data;
        const { products: pList, pages, total } = targetData;
        setProducts(pList || []);
        setTotalPages(pages || 1);
        setTotalProducts(total || 0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCatFilter, selectedBrandFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setName('');
    setSku('');
    setSlug('');
    setPrice('');
    setDiscountPrice('');
    setStock('');
    setCategory(categories[0]?._id || '');
    setBrand(brands[0]?._id || '');
    setShortDesc('');
    setDescription('');
    setImages([]);
    setSortOrder('');
    setSummary('');
    setTagsString('');
    setIsBestSeller(false);
    setIsNewArrival(false);
    setIsFeatured(false);
    setIsHot(false);
    setIsActive(true);

    // Initial spec group with common specs
    setSpecGroups([
      {
        name: 'Bộ xử lý (CPU)',
        items: [{ key: 'CPU', value: '' }],
      },
      {
        name: 'Bộ nhớ & Lưu trữ',
        items: [
          { key: 'RAM', value: '' },
          { key: 'Ổ cứng', value: '' },
        ],
      },
    ]);

    setViewMode('add');
    setError('');
    setSuccess('');
  };

  const handleOpenEditModal = (product: any) => {
    setSelectedProduct(product);
    setName(product.name);
    setSku(product.sku || '');
    setSlug(product.slug);
    setPrice(product.price !== undefined ? product.price : '');
    setDiscountPrice(product.discountPrice || '');
    setStock(product.stock !== undefined ? product.stock : '');
    setCategory(product.category?._id || product.category || '');
    setBrand(product.brand?._id || product.brand || '');
    setShortDesc(product.shortDesc || '');
    setDescription(product.description || '');
    setImages(product.images || []);
    setSortOrder(product.sortOrder !== undefined ? product.sortOrder : '');
    setSummary(product.summary || '');
    setTagsString(product.tags ? product.tags.join(', ') : '');
    setIsBestSeller(product.isBestSeller || false);
    setIsNewArrival(product.isNewArrival || false);
    setIsFeatured(product.isFeatured || false);
    setIsHot(product.isHot || false);
    setIsActive(product.isActive !== false);

    // Dynamic Specs
    if (product.specGroups && product.specGroups.length > 0) {
      setSpecGroups(product.specGroups);
    } else {
      const groups = convertSpecsToGroups(product.specs);
      setSpecGroups(
        groups.length > 0
          ? groups
          : [
              {
                name: 'Cấu hình chi tiết',
                items: [{ key: '', value: '' }],
              },
            ]
      );
    }

    setViewMode('edit');
    setError('');
    setSuccess('');
  };

  // Drag & drop / click upload images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: FileList | null = null;
    if ('dataTransfer' in e) {
      e.preventDefault();
      files = e.dataTransfer.files;
    } else if ('target' in e) {
      files = e.target.files;
    }
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      setIsUploading(true);
      setError('');
      const response = await productService.uploadImage(formData);
      if (response.data?.status === 'success') {
        const uploadedUrls = response.data.urls || response.data.data;
        if (uploadedUrls) {
          setImages((prev) => [...prev, ...uploadedUrls]);
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

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove Vietnamese diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generatedSlug);
  };

  // Specs groups actions
  const handleAddGroup = () => {
    setSpecGroups([...specGroups, { name: '', items: [{ key: '', value: '' }] }]);
  };

  const handleUpdateGroupName = (gIdx: number, val: string) => {
    const updated = [...specGroups];
    updated[gIdx].name = val;
    setSpecGroups(updated);
  };

  const handleRemoveGroup = (gIdx: number) => {
    setSpecGroups(specGroups.filter((_, idx) => idx !== gIdx));
  };

  const handleAddItem = (gIdx: number) => {
    const updated = [...specGroups];
    updated[gIdx].items.push({ key: '', value: '' });
    setSpecGroups(updated);
  };

  const handleUpdateItem = (gIdx: number, iIdx: number, field: 'key' | 'value', val: string) => {
    const updated = [...specGroups];
    updated[gIdx].items[iIdx][field] = val;
    setSpecGroups(updated);
  };

  const handleRemoveItem = (gIdx: number, iIdx: number) => {
    const updated = [...specGroups];
    updated[gIdx].items = updated[gIdx].items.filter((_: any, idx: number) => idx !== iIdx);
    setSpecGroups(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !brand) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      // Build legacy specs mapping from specGroups to keep existing frontend pages working
      const legacySpecs: any = {
        cpu: '',
        ram: '',
        storage: '',
        vga: '',
        screenSize: '',
        battery: '',
        weight: 0,
        os: 'Windows 11',
      };

      specGroups.forEach((g: any) => {
        g.items.forEach((item: any) => {
          const k = item.key.toLowerCase().trim();
          if (k.includes('cpu') || k.includes('bộ vi xử lý')) legacySpecs.cpu = item.value;
          else if (k === 'ram') legacySpecs.ram = item.value;
          else if (k.includes('ổ cứng') || k.includes('ssd') || k.includes('hdd') || k.includes('dung lượng')) legacySpecs.storage = item.value;
          else if (k.includes('card') || k.includes('vga') || k.includes('đồ họa')) legacySpecs.vga = item.value;
          else if (k.includes('màn hình') || k.includes('kích thước màn')) legacySpecs.screenSize = item.value;
          else if (k.includes('pin') || k.includes('battery')) legacySpecs.battery = item.value;
          else if (k.includes('trọng lượng') || k.includes('cân nặng')) {
            const w = parseFloat(item.value);
            if (!isNaN(w)) legacySpecs.weight = w;
          } else if (k.includes('hệ điều hành') || k === 'os') legacySpecs.os = item.value;
        });
      });

      const parsedTags = tagsString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        name,
        sku,
        slug: slug || undefined,
        price: price === '' ? 0 : Number(price),
        discountPrice: discountPrice === '' ? 0 : Number(discountPrice),
        stock: stock === '' ? 0 : Number(stock),
        category,
        brand,
        shortDesc,
        description,
        images,
        sortOrder: sortOrder === '' ? 0 : Number(sortOrder),
        summary,
        isFeatured,
        isBestSeller,
        isNewArrival,
        isHot,
        isActive,
        tags: parsedTags,
        specGroups,
        specs: legacySpecs, // Keep legacy specs updated
      };

      if (selectedProduct) {
        // Edit Product
        const response = await productService.updateProduct(selectedProduct._id, payload);
        if (response.data?.status === 'success') {
          setSuccess('Cập nhật sản phẩm thành công!');
        }
      } else {
        // Create Product
        const response = await productService.createProduct(payload);
        if (response.data?.status === 'success') {
          setSuccess('Thêm sản phẩm mới thành công!');
        }
      }

      setViewMode('list');
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lưu sản phẩm thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      return;
    }
    try {
      setError('');
      setSuccess('');
      const response = await productService.deleteProduct(id);
      if (response.data?.status === 'success') {
        setSuccess('Xóa sản phẩm thành công!');
        fetchProducts();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Xóa sản phẩm thất bại');
    }
  };

  const toggleStatus = async (product: any) => {
    try {
      setError('');
      setSuccess('');
      const response = await productService.updateProduct(product._id, {
        ...product,
        isActive: !product.isActive,
      });
      if (response.data?.status === 'success') {
        setSuccess(`Đã ${!product.isActive ? 'hiển thị' : 'ẩn'} sản phẩm thành công!`);
        fetchProducts();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Cập nhật trạng thái thất bại');
    }
  };

  return {
    products,
    categories,
    brands,
    isLoading,
    search,
    setSearch,
    selectedCatFilter,
    setSelectedCatFilter,
    selectedBrandFilter,
    setSelectedBrandFilter,
    page,
    setPage,
    totalPages,
    totalProducts,
    error,
    setError,
    success,
    setSuccess,
    viewMode,
    setViewMode,
    selectedProduct,
    setSelectedProduct,
    name,
    setName,
    sku,
    setSku,
    slug,
    setSlug,
    price,
    setPrice,
    discountPrice,
    setDiscountPrice,
    stock,
    setStock,
    category,
    setCategory,
    brand,
    setBrand,
    shortDesc,
    setShortDesc,
    description,
    setDescription,
    images,
    setImages,
    sortOrder,
    setSortOrder,
    summary,
    setSummary,
    tagsString,
    setTagsString,
    isBestSeller,
    setIsBestSeller,
    isNewArrival,
    setIsNewArrival,
    isFeatured,
    setIsFeatured,
    isHot,
    setIsHot,
    isActive,
    setIsActive,
    specGroups,
    setSpecGroups,
    isUploading,
    isSaving,
    handleSearchSubmit,
    handleOpenAddModal,
    handleOpenEditModal,
    handleImageUpload,
    handleDragOver,
    handleRemoveImage,
    handleNameChange,
    handleAddGroup,
    handleUpdateGroupName,
    handleRemoveGroup,
    handleAddItem,
    handleUpdateItem,
    handleRemoveItem,
    handleSave,
    handleDelete,
    toggleStatus,
  };
}
