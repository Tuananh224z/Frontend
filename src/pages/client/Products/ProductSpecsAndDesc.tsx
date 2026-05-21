import { Truck, ShieldCheck, RefreshCw, BadgeCheck } from 'lucide-react';

interface SpecsType {
  cpu?: string;
  ram?: string;
  storage?: string;
  vga?: string;
  screenSize?: string;
  battery?: string;
  weight?: number;
  os?: string;
}

interface ProductSpecsAndDescProps {
  description: string;
  specs: SpecsType;
  productName: string;
}

export default function ProductSpecsAndDesc({ description, specs, productName }: ProductSpecsAndDescProps) {
  // Specs table key-value pairs
  const specList = [
    { label: 'Bộ vi xử lý (CPU)', value: specs.cpu || 'Chưa cập nhật' },
    { label: 'Bộ nhớ trong (RAM)', value: specs.ram || 'Chưa cập nhật' },
    { label: 'Ổ cứng (Storage)', value: specs.storage || 'Chưa cập nhật' },
    { label: 'Card đồ họa (VGA)', value: specs.vga || 'Tích hợp' },
    { label: 'Màn hình (Screen)', value: specs.screenSize || 'Chưa cập nhật' },
    { label: 'Dung lượng pin', value: specs.battery || 'Chưa cập nhật' },
    { label: 'Trọng lượng (Weight)', value: specs.weight ? `${specs.weight} kg` : 'Chưa cập nhật' },
    { label: 'Hệ điều hành (OS)', value: specs.os || 'Windows 11' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Left Column: Description & Specifications */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Description Card */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs text-left">
          <h3 className="text-lg font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Mô tả sản phẩm
          </h3>
          <div className="text-slate-650 text-sm leading-relaxed space-y-4">
            {description ? (
              description.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : (
              <p>
                {productName} là dòng máy tính xách tay cao cấp sở hữu thiết kế hiện đại, tinh xảo, 
                đáp ứng hoàn hảo cả nhu cầu xử lý công việc hiệu năng cao lẫn các nhu cầu giải trí đa phương tiện đỉnh cao.
              </p>
            )}
          </div>
        </div>

        {/* Specifications Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs text-left">
          <h3 className="text-lg font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Thông số kỹ thuật chi tiết
          </h3>
          <div className="overflow-hidden border border-slate-150 rounded-xl">
            <table className="w-full text-sm text-left border-collapse">
              <tbody>
                {specList.map((spec, i) => (
                  <tr 
                    key={i} 
                    className={`border-b border-slate-150 ${i % 2 === 0 ? 'bg-slate-50/55' : 'bg-white'} last:border-0`}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-500 w-1/3 bg-slate-100/40">
                      {spec.label}
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Right Column: Delivery & Shipping info */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs text-left">
          <h3 className="text-lg font-extrabold text-slate-900 mb-5 pb-2 border-b border-slate-100">
            Thông tin giao hàng
          </h3>
          
          <div className="flex flex-col gap-6">
            {/* Quick Delivery */}
            <div className="flex gap-4">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl h-fit shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-sm text-slate-800">Giao nhanh trong 2 giờ</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Nội thành TP. Hồ Chí Minh & Hà Nội</p>
              </div>
            </div>

            {/* Warranty */}
            <div className="flex gap-4">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl h-fit shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-sm text-slate-800">Bảo hành tại 200+ trung tâm</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Trên toàn quốc</p>
              </div>
            </div>

            {/* Refund */}
            <div className="flex gap-4">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl h-fit shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-sm text-slate-800">Đổi trả trong 30 ngày</h4>
                <p className="text-xs text-slate-500 leading-relaxed">1-1 nếu lỗi do nhà sản xuất</p>
              </div>
            </div>

            {/* Authentication */}
            <div className="flex gap-4">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl h-fit shrink-0">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-sm text-slate-800">Hàng chính hãng 100%</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Nhập khẩu và phân phối chính thức</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
