import { useState, useEffect } from 'react';
import authService from '../../../services/authService';
import { Users, Search, Shield, UserX, UserCheck, CheckCircle2, AlertCircle, Loader2, Calendar, Phone, Mail, MapPin } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Lock/Unlock saving states
  const [actionUserId, setActionUserId] = useState<string | null>(null);

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

  const handleToggleLock = async (userId: string, currentStatus: boolean) => {
    try {
      setActionUserId(userId);
      setError('');
      setSuccess('');
      const response = await authService.toggleUserLock(userId);
      if (response.data?.status === 'success') {
        const actionStr = currentStatus ? 'khóa' : 'mở khóa';
        setSuccess(`Đã ${actionStr} tài khoản người dùng thành công!`);
        fetchUsers();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Thao tác thay đổi khóa tài khoản thất bại');
    } finally {
      setActionUserId(null);
    }
  };

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
    const matchesSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.phone && user.phone.includes(search));

    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && user.isActive) ||
      (statusFilter === 'Locked' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, sđt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-purple-500 focus:outline-hidden text-sm font-semibold text-slate-200"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vai trò:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:border-purple-500 focus:outline-hidden"
            >
              <option value="All">Tất cả vai trò</option>
              <option value="customer">Khách hàng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:border-purple-500 focus:outline-hidden"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Active">Hoạt động</option>
              <option value="Locked">Bị khóa</option>
            </select>
          </div>
        </div>
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

      {/* Users Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800/80 text-slate-400 font-semibold text-sm">
          <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          Không tìm thấy thành viên nào
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-450 font-bold bg-slate-900/50">
                  <th className="px-6 py-4">Avatar</th>
                  <th className="px-6 py-4">Họ và tên</th>
                  <th className="px-6 py-4">Thông tin liên lạc</th>
                  <th className="px-6 py-4">Địa chỉ chính</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Ngày đăng ký</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Phân quyền / Khóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredUsers.map((userObj) => {
                  const hasAddress = userObj.address && (userObj.address.street || userObj.address.ward || userObj.address.city);
                  return (
                    <tr key={userObj._id} className="hover:bg-slate-850/40 transition-colors text-sm">
                      {/* Avatar */}
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded-full bg-purple-950 border border-purple-900 flex items-center justify-center font-extrabold text-sm text-purple-400 overflow-hidden">
                          {userObj.avatar ? (
                            <img src={userObj.avatar} alt={userObj.fullName} className="w-full h-full object-cover" />
                          ) : (
                            userObj.fullName[0].toUpperCase()
                          )}
                        </div>
                      </td>

                      {/* Full Name */}
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-white">{userObj.fullName}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">ID: {userObj._id.slice(-6)}</div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-350">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span>{userObj.email}</span>
                          </div>
                          {userObj.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-350">
                              <Phone className="w-3.5 h-3.5 text-slate-500" />
                              <span>{userObj.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Address */}
                      <td className="px-6 py-4 text-xs font-semibold text-slate-400 max-w-xs truncate">
                        {hasAddress ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span className="truncate">
                              {[userObj.address.street, userObj.address.ward, userObj.address.district, userObj.address.city]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600 font-medium">Chưa cập nhật địa chỉ</span>
                        )}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${userObj.role === 'admin'
                            ? 'text-purple-400 bg-purple-950/20 border-purple-900/40'
                            : 'text-blue-450 text-blue-450/80 bg-blue-950/10 border-blue-900/30 text-blue-400'
                          }`}>
                          <Shield className="w-3 h-3" />
                          <span>{userObj.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</span>
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-xs font-semibold text-slate-450">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formatDate(userObj.createdAt)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${userObj.isActive
                            ? 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40'
                            : 'text-red-400 bg-red-950/20 border-red-900/40'
                          }`}>
                          {userObj.isActive ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          <span>{userObj.isActive ? 'Hoạt động' : 'Đã khóa'}</span>
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={actionUserId === userObj._id}
                            onClick={() => handleChangeRole(userObj._id, userObj.role)}
                            className="px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:text-purple-450 hover:bg-purple-950/30 rounded-lg border border-slate-800 hover:border-purple-900 transition-all cursor-pointer bg-slate-900 flex items-center gap-1 hover:text-purple-400 disabled:opacity-50"
                            title="Đổi vai trò"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            <span>Quyền</span>
                          </button>
                          <button
                            disabled={actionUserId === userObj._id}
                            onClick={() => handleToggleLock(userObj._id, userObj.isActive)}
                            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50 ${userObj.isActive
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-950/25 border-slate-800 hover:border-red-900/40 bg-slate-900'
                                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/25 border-slate-800 hover:border-emerald-900/40 bg-slate-900'
                              }`}
                            title={userObj.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            {userObj.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            <span>{userObj.isActive ? 'Khóa' : 'Mở'}</span>
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
    </div>
  );
}
