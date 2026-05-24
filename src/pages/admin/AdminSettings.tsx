import { useState, useEffect } from 'react';
import chatbotService from '../../services/chatbotService';
import productService from '../../services/productService';
import { Settings, Info, Phone, Mail, MapPin, Link2, Plus, Trash2, CheckCircle2, AlertCircle, Loader2, Upload, Image as ImageIcon } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

export default function AdminSettings() {
  const [logo, setLogo] = useState('');
  const [banners, setBanners] = useState<string[]>([]);
  const [newBanner, setNewBanner] = useState('');

  // Hero Banner states
  const [heroImage, setHeroImage] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroHighlightTitle, setHeroHighlightTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroButtonText, setHeroButtonText] = useState('');

  // Small Banners state (always size 3)
  const [smallBanners, setSmallBanners] = useState<Array<{ category: string; title: string; description: string; image: string }>>([
    { category: '', title: '', description: '', image: '' },
    { category: '', title: '', description: '', image: '' },
    { category: '', title: '', description: '', image: '' }
  ]);

  // Contact Info states
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Image Uploading States
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingSmall, setIsUploadingSmall] = useState<boolean[]>([false, false, false]);

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${BACKEND_URL}${cleanPath}`;
  };

  const handleFileUpload = async (file: File, type: 'logo' | 'hero' | 'small' | 'banner', smallIndex?: number) => {
    const formData = new FormData();
    formData.append('images', file);

    try {
      if (type === 'logo') setIsUploadingLogo(true);
      else if (type === 'hero') setIsUploadingHero(true);
      else if (type === 'small' && smallIndex !== undefined) {
        const newUploads = [...isUploadingSmall];
        newUploads[smallIndex] = true;
        setIsUploadingSmall(newUploads);
      }

      setError('');
      const response = await productService.uploadImage(formData);
      if (response.data?.status === 'success') {
        const uploadedUrls = response.data.urls || response.data.data;
        if (uploadedUrls && uploadedUrls.length > 0) {
          const url = uploadedUrls[0];
          if (type === 'logo') {
            setLogo(url);
          } else if (type === 'hero') {
            setHeroImage(url);
          } else if (type === 'banner') {
            setBanners([...banners, url]);
          } else if (type === 'small' && smallIndex !== undefined) {
            handleSmallBannerChange(smallIndex, 'image', url);
          }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Tải ảnh lên thất bại');
    } finally {
      if (type === 'logo') setIsUploadingLogo(false);
      else if (type === 'hero') setIsUploadingHero(false);
      else if (type === 'small' && smallIndex !== undefined) {
        const newUploads = [...isUploadingSmall];
        newUploads[smallIndex] = false;
        setIsUploadingSmall(newUploads);
      }
    }
  };


  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await chatbotService.getSystemSettings();
      if (response.data?.status === 'success') {
        const settings = response.data.data || {};
        setLogo(settings.logo || '');
        setBanners(settings.banners || []);

        const hero = settings.heroBanner || {};
        setHeroImage(hero.image || '');
        setHeroTitle(hero.title || '');
        setHeroHighlightTitle(hero.highlightTitle || '');
        setHeroDescription(hero.description || '');
        setHeroButtonText(hero.buttonText || '');

        const small = settings.smallBanners || [];
        const filledSmall = [0, 1, 2].map((idx) => {
          const item = small[idx] || {};
          return {
            category: item.category || '',
            title: item.title || '',
            description: item.description || '',
            image: item.image || ''
          };
        });
        setSmallBanners(filledSmall);

        const contact = settings.contactInfo || {};
        setAddress(contact.address || '');
        setPhone(contact.phone || '');
        setEmail(contact.email || '');

        const social = contact.socialLinks || {};
        setFacebook(social.facebook || '');
        setInstagram(social.instagram || '');
        setYoutube(social.youtube || '');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể tải cấu hình hệ thống');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleAddBanner = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newBanner.trim()) return;
    if (banners.includes(newBanner.trim())) {
      setError('Đường dẫn banner này đã có trong danh sách');
      return;
    }
    setBanners([...banners, newBanner.trim()]);
    setNewBanner('');
    setError('');
  };

  const handleRemoveBanner = (index: number) => {
    const updated = banners.filter((_, idx) => idx !== index);
    setBanners(updated);
  };

  const handleSmallBannerChange = (index: number, field: string, value: string) => {
    const updated = [...smallBanners];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setSmallBanners(updated);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      const payload = {
        logo,
        banners,
        heroBanner: {
          image: heroImage,
          title: heroTitle,
          highlightTitle: heroHighlightTitle,
          description: heroDescription,
          buttonText: heroButtonText
        },
        smallBanners: smallBanners,
        contactInfo: {
          address,
          phone,
          email,
          socialLinks: {
            facebook,
            instagram,
            youtube,
          },
        },
      };

      const response = await chatbotService.updateSystemSettings(payload);
      if (response.data?.status === 'success') {
        setSuccess('Cập nhật cấu hình hệ thống TechStore thành công!');
        fetchSettings();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lưu cấu hình hệ thống thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/20 text-emerald-400 text-sm font-semibold rounded-xl border border-emerald-900 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-950/20 text-red-400 text-sm font-semibold rounded-xl border border-red-900 animate-in fade-in duration-200">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* BRANDING CARD (Logo & Banners) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Nhận diện thương hiệu & Banners</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo URL input */}
            <div className="md:col-span-3 space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Logo trang web (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="Ví dụ: https://mywebsite.com/logo.png"
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                />
                <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer border-0 shrink-0 select-none">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingLogo ? 'Đang tải...' : 'Chọn file'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'logo');
                    }}
                    className="hidden"
                    disabled={isUploadingLogo}
                  />
                </label>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">Hình ảnh logo chính thức xuất hiện trên thanh điều hướng.</p>
            </div>
          </div>

          {/* Banner configuration */}
          <div className="space-y-4 pt-4 border-t border-slate-850">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Danh sách Banners trang chủ (Slideshow)
            </label>

            {/* Add Banner Image URL */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newBanner}
                onChange={(e) => setNewBanner(e.target.value)}
                placeholder="Nhập đường dẫn hình ảnh banner mới..."
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
              />
              <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer border-0 shrink-0 select-none">
                <Upload className="w-3.5 h-3.5" />
                <span>Chọn file</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'banner');
                  }}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={handleAddBanner}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer border-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm</span>
              </button>
            </div>

            {/* Active Banners list */}
            {banners.length === 0 ? (
              <div className="text-center py-6 bg-slate-950 border border-slate-850 border-dashed rounded-2xl text-xs text-slate-500 font-bold">
                Chưa có banner nào được thêm. Trang chủ sẽ hiển thị mặc định.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {banners.map((url, index) => (
                  <div key={index} className="relative group overflow-hidden bg-slate-955 bg-slate-950 border border-slate-850 rounded-2xl p-2 flex flex-col gap-2">
                    {/* Thumbnail preview */}
                    <div className="w-full h-24 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                      <img
                        src={getImageUrl(url)}
                        alt={`Banner ${index}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x300?text=Banner+L\u1ED7i';
                        }}
                      />
                    </div>
                    {/* URL text */}
                    <div className="text-[9px] text-slate-400 truncate px-1 font-semibold">{url}</div>
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveBanner(index)}
                      className="absolute top-3 right-3 p-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800/80 rounded-lg text-red-400 cursor-pointer transition-colors shadow-xs"
                      title="Xóa banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* HERO BANNER CONFIGURATION CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Cấu hình Banner Hero (Banner To)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input fields */}
            <div className="md:col-span-3 space-y-4">
              {/* Image URL with upload */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Đường dẫn ảnh bìa (URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="Ví dụ: /hero_banner.png hoặc link ảnh online"
                    className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                  />
                  <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer border-0 shrink-0 select-none">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingHero ? 'Đang tải...' : 'Chọn file'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'hero');
                      }}
                      className="hidden"
                      disabled={isUploadingHero}
                    />
                  </label>
                </div>
              </div>

              {/* Title & Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Tiêu đề chính
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="Ví dụ: Đỉnh Cao Hiệu Năng"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Tiêu đề nổi bật (Màu Gradient)
                  </label>
                  <input
                    type="text"
                    value={heroHighlightTitle}
                    onChange={(e) => setHeroHighlightTitle(e.target.value)}
                    placeholder="Ví dụ: Vượt Mọi Giới Hạn"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Mô tả chi tiết
                </label>
                <textarea
                  rows={3}
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  placeholder="Nhập mô tả xuất hiện trên Banner Hero..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200 resize-none"
                />
              </div>

              {/* Button Text */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Chữ hiển thị trên Nút bấm
                </label>
                <input
                  type="text"
                  value={heroButtonText}
                  onChange={(e) => setHeroButtonText(e.target.value)}
                  placeholder="Ví dụ: Mua ngay hôm nay"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SMALL BANNERS CONFIGURATION CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Cấu hình 3 Banner Nhỏ (Dưới Banner Hero)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {smallBanners.map((banner, index) => (
              <div key={index} className="bg-slate-955 bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-4 flex flex-col">
                <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider">Banner {index + 1}</span>
                  <span className="text-[9px] text-slate-500 font-bold">Vị trí {index + 1}</span>
                </div>

                {/* Category tag */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Nhãn danh mục (Tag)
                  </label>
                  <input
                    type="text"
                    value={banner.category}
                    onChange={(e) => handleSmallBannerChange(index, 'category', e.target.value)}
                    placeholder="Ví dụ: Gaming & Đồ Họa"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                  />
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Tiêu đề banner
                  </label>
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(e) => handleSmallBannerChange(index, 'title', e.target.value)}
                    placeholder="Ví dụ: Cấu Hình Chiến Game"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Mô tả ngắn
                  </label>
                  <textarea
                    rows={2}
                    value={banner.description}
                    onChange={(e) => handleSmallBannerChange(index, 'description', e.target.value)}
                    placeholder="Ví dụ: Trang bị GPU RTX thế hệ mới..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200 resize-none"
                  />
                </div>

                {/* Image URL & File Upload */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Ảnh banner
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={banner.image}
                      onChange={(e) => handleSmallBannerChange(index, 'image', e.target.value)}
                      placeholder="URL ảnh"
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg focus:border-purple-500 focus:outline-hidden text-[11px] font-semibold text-slate-200"
                    />
                    <label className="px-2.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-extrabold rounded-lg text-xs transition-colors flex items-center justify-center cursor-pointer border-0 shrink-0 select-none">
                      <Upload className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleFileUpload(e.target.files[0], 'small', index);
                        }}
                        className="hidden"
                        disabled={isUploadingSmall[index]}
                      />
                    </label>
                  </div>
                  {isUploadingSmall[index] && (
                    <div className="text-[9px] text-purple-400 font-bold flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Đang tải...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT INFO CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Thông tin liên hệ & Mạng xã hội</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Address */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-500" /> Địa chỉ cửa hàng
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ví dụ: 123 Đường Laptop, Hà Nội"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-purple-500" /> Hotline hỗ trợ
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0123456789"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-purple-500" /> Email chăm sóc khách hàng
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ví dụ: support@techstore.com"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
              />
            </div>

            {/* Social Links */}
            <div className="space-y-1.5 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-850/60">
              {/* Facebook */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-blue-500" /> Fanpage Facebook
                </label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/techstore"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                />
              </div>

              {/* Instagram */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-pink-500" /> Instagram URL
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/techstore"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                />
              </div>

              {/* Youtube */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-red-500" /> Youtube channel
                </label>
                <input
                  type="text"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@techstore"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-purple-650 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer border-0 shadow-lg shadow-purple-550/15"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lưu lại toàn bộ cài đặt'}
          </button>
        </div>
      </form>
    </div>
  );
}
