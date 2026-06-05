import { useState, useEffect } from 'react';
import authService from '../../services/authService';
import { Users, Search, Shield, CheckCircle2, AlertCircle, Loader2, Calendar, Phone, Mail, MapPin, UserPlus, X } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Saving states
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  // New user creation states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('customer');
  const [newStreet, setNewStreet] = useState('');
  const [newWard, setNewWard] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newCity, setNewCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await authService.getUsers();
      if (response.data?.status === 'success') {
        setUsers(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể tải danh sách thành viên');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  const handleChangeRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'customer' : 'admin';
    const confirmMsg = nextRole === 'admin'
      ? 'Bạn có chắc chắn muốn phong quyền QUẢN TRỊ VIÊN (Admin) cho tài khoản này?'
      : 'Bạn có chắc chắn muốn hạ quyền tài khoản này xuống NGƯỜI DÙNG thường?';

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      setActionUserId(userId);
      setError('');
      setSuccess('');
      const response = await authService.updateUserRole(userId, nextRole);
      if (response.data?.status === 'success') {
        setSuccess('Cập nhật vai trò người dùng thành công!');
        fetchUsers();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Thay đổi quyền hạn thất bại');
    } finally {
      setActionUserId(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail || !newPassword) {
      setModalError('Vui lòng điền đầy đủ các thông tin bắt buộc (Họ tên, Email, Mật khẩu)');
      return;
    }
    try {
      setIsSubmitting(true);
      setModalError('');
      const response = await authService.createUserAdmin({
        fullName: newFullName,
        email: newEmail,
        password: newPassword,
        phone: newPhone,
        role: newRole,
        address: {
          street: newStreet,
          ward: newWard,
          district: newDistrict,
          city: newCity
        }
      });
      if (response.data?.status === 'success' || response.status === 201) {
        setSuccess('Đã thêm thành viên mới thành công!');
        // Reset form
        setNewFullName('');
        setNewEmail('');
        setNewPassword('');
        setNewPhone('');
        setNewRole('customer');
        setNewStreet('');
        setNewWard('');
        setNewDistrict('');
        setNewCity('');
        setIsModalOpen(false);
        fetchUsers();
      }
    } catch (err: any) {
      setModalError(err.response?.data?.message || err.message || 'Không thể tạo tài khoản người dùng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const fullName = user.fullName || '';
    const email = user.email || '';
    const phone = user.phone || '';

    const matchesSearch =
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search);

    const matchesRole = roleFilter === 'All' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Search and Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, sđt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vai trò:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:border-purple-500 focus:outline-hidden cursor-pointer"
            >
              <option value="All">Tất cả vai trò</option>
              <option value="customer">Khách hàng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-650 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md select-none border-0 cursor-pointer bg-purple-600 shadow-purple-600/10"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm thành viên</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-sm font-semibold rounded-xl border border-emerald-250 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 text-sm font-semibold rounded-xl border border-red-250 animate-in fade-in duration-200">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Users Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 font-semibold text-sm shadow-xs">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          Không tìm thấy thành viên nào
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs animate-in fade-in duration-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold bg-slate-50/75">
                  <th className="px-3 py-2.5">Thành viên</th>
                  <th className="px-3 py-2.5">Liên hệ</th>
                  <th className="px-3 py-2.5">Địa chỉ</th>
                  <th className="px-3 py-2.5">Vai trò</th>
                  <th className="px-3 py-2.5">Đăng ký</th>
                  <th className="px-3 py-2.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((userObj) => {
                  const hasAddress = userObj.address && (userObj.address.street || userObj.address.ward || userObj.address.city);
                  const fullAddressStr = hasAddress
                    ? [userObj.address.street, userObj.address.ward, userObj.address.district, userObj.address.city]
                        .filter(Boolean)
                        .join(', ')
                    : '';
                  return (
                    <tr key={userObj._id} className="hover:bg-slate-50/50 transition-colors text-sm">
                      {/* Member Info (Avatar + Name + ID) */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center font-extrabold text-xs text-purple-600 overflow-hidden shrink-0">
                            {userObj.avatar ? (
                              <img src={userObj.avatar} alt={userObj.fullName} className="w-full h-full object-cover" />
                            ) : (
                              userObj.fullName ? userObj.fullName[0].toUpperCase() : 'U'
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs leading-tight">{userObj.fullName || 'Chưa đặt tên'}</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ID: {userObj._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info (Email + Phone) */}
                      <td className="px-3 py-2.5">
                        <div className="space-y-0.5 max-w-[160px]">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600" title={userObj.email}>
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{userObj.email}</span>
                          </div>
                          {userObj.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{userObj.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Address */}
                      <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 max-w-[130px]" title={fullAddressStr}>
                        {hasAddress ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-purple-500 shrink-0" />
                            <span className="truncate">{fullAddressStr}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium text-xs">Chưa cập nhật</span>
                        )}
                      </td>

                      {/* Role */}
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full border ${userObj.role === 'admin'
                            ? 'text-purple-700 bg-purple-50 border-purple-200'
                            : 'text-blue-700 bg-blue-50 border-blue-200'
                          }`}>
                          <Shield className="w-2 h-2" />
                          <span>{userObj.role === 'admin' ? 'Quản trị' : 'Khách hàng'}</span>
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-3 py-2.5 text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{formatDate(userObj.createdAt)}</span>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={actionUserId === userObj._id}
                            onClick={() => handleChangeRole(userObj._id, userObj.role)}
                            className="px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg border border-slate-200 hover:border-purple-300 transition-all cursor-pointer bg-slate-50 flex items-center gap-1 disabled:opacity-50"
                            title="Đổi vai trò"
                          >
                            <Shield className="w-3 h-3 text-purple-600 shrink-0" />
                            <span>Quyền</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Thêm thành viên */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          {/* Modal content */}
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                Thêm thành viên mới
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer border-0 bg-transparent animate-in duration-200"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Error message */}
            {modalError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 text-xs font-semibold rounded-xl border border-red-250 mb-6">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateUser} className="space-y-6">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mật khẩu <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="0123456789"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vai trò</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-700 cursor-pointer"
                  >
                    <option value="customer">Khách hàng</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
              </div>

              {/* Address Section */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-600">Địa chỉ (Tùy chọn)</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đường/Số nhà</label>
                    <input
                      type="text"
                      placeholder="Số 1, Đường 2"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phường/Xã</label>
                    <input
                      type="text"
                      placeholder="Phường 3"
                      value={newWard}
                      onChange={(e) => setNewWard(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quận/Huyện</label>
                    <input
                      type="text"
                      placeholder="Quận 4"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỉnh/Thành phố</label>
                    <input
                      type="text"
                      placeholder="Hồ Chí Minh"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition-colors border border-slate-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-purple-650 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer border-0 bg-purple-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>Thêm thành viên</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
