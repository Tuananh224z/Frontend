import { useState, useEffect } from 'react';
import chatbotService from '../../../services/chatbotService';
import { Settings, Info, Phone, Mail, MapPin, Link2, Plus, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const [logo, setLogo] = useState('');
  const [banners, setBanners] = useState<string[]>([]);
  const [newBanner, setNewBanner] = useState('');

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

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await chatbotService.getSystemSettings();
      if (response.data?.status === 'success') {
        const settings = response.data.data || {};
        setLogo(settings.logo || '');
        setBanners(settings.banners || []);

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

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      const payload = {
        logo,
        banners,
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
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Logo trang web (URL)
              </label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="Ví dụ: https://mywebsite.com/logo.png"
                className="w-full px-4 py-2.5 bg-slate-955 bg-slate-950 border border-slate-850 rounded-xl focus:border-purple-500 focus:outline-hidden text-xs font-semibold text-slate-200"
              />
              <p className="text-[10px] text-slate-500 font-bold">Hình ảnh logo chính thức xuất hiện trên thanh điều hướng.</p>
            </div>

            {/* Logo Preview */}
            <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-850 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Xem trước Logo</span>
              <div className="w-full h-12 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl p-2">
                {logo ? (
                  <img src={logo} alt="Logo Preview" className="max-h-full object-contain" />
                ) : (
                  <span className="text-xs font-bold text-slate-600">TechStore</span>
                )}
              </div>
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
              <div className="text-center py-6 bg-slate-955 bg-slate-950 border border-slate-855 border-slate-850 border-dashed rounded-2xl text-xs text-slate-500 font-bold">
                Chưa có banner nào được thêm. Trang chủ sẽ hiển thị mặc định.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {banners.map((url, index) => (
                  <div key={index} className="relative group overflow-hidden bg-slate-955 bg-slate-950 border border-slate-850 rounded-2xl p-2 flex flex-col gap-2">
                    {/* Thumbnail preview */}
                    <div className="w-full h-24 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                      <img
                        src={url}
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
