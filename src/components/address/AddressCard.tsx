import { MapPin, Pencil, Trash2 } from 'lucide-react';
import type { UserAddress } from '../../types/user';

interface AddressCardProps {
  addr: UserAddress;
  onSetDefault: (id: string) => void;
  onEdit: (addr: UserAddress) => void;
  onDelete: (id: string, isDefault: boolean) => void;
}

export default function AddressCard({ addr, onSetDefault, onEdit, onDelete }: AddressCardProps) {

  return (
    <div
      className={`p-5 bg-white border ${
        addr.isDefault ? 'border-red-200 bg-red-50/5' : 'border-slate-100'
      } rounded-3xl relative flex items-start gap-4 transition-all duration-350 hover:shadow-xs group`}
    >
      {/* MapPin Icon in Location Indicator */}
      <div
        className={`w-10 h-10 ${
          addr.isDefault
            ? 'bg-red-50 text-red-600 border border-red-100/50'
            : 'bg-slate-50 text-slate-400 border border-slate-100'
        } rounded-full flex items-center justify-center shrink-0`}
      >
        <MapPin className="w-5 h-5" />
      </div>

      {/* Location details */}
      <div className="flex-1 space-y-2 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-extrabold text-slate-850 text-sm text-slate-800">{addr.fullName}</span>
          <span className="text-slate-300 text-xs select-none">|</span>
          <span className="text-slate-500 font-bold text-xs">{addr.phone || 'Chưa cung cấp SĐT'}</span>
          {addr.isDefault && (
            <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold text-red-650 bg-red-50 rounded-md border border-red-250 select-none ml-1.5 text-red-600 border-red-200">
              ★ Mặc định
            </span>
          )}
        </div>

        <div className="text-xs text-slate-700 font-bold leading-relaxed space-y-0.5">
          <p className="text-slate-500 font-semibold">{addr.street}</p>
          <p className="text-slate-800">
            {addr.ward ? `${addr.ward}, ` : ''}
            {addr.district ? `${addr.district}, ` : ''}
            {addr.city || ''}
          </p>
        </div>

        {!addr.isDefault && (
          <button
            onClick={() => onSetDefault(addr._id || '')}
            className="text-[10px] font-extrabold text-red-600 hover:text-red-700 hover:underline cursor-pointer border-0 bg-transparent p-0 pt-1"
          >
            Thiết lập làm mặc định
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onEdit(addr)}
          className="w-8 h-8 rounded-full border border-slate-100 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer bg-white"
          title="Chỉnh sửa địa chỉ"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(addr._id || '', addr.isDefault || false)}
          className="w-8 h-8 rounded-full border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer bg-white"
          title="Xóa địa chỉ"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
