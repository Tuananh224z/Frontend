import { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, X, CreditCard, Banknote, Smartphone, ChevronDown } from 'lucide-react';

/* ─── Types ─── */
type Variant = { id: string; label: string; price: number; origPrice: number };
type Serial = { id: string; code: string; warranty: string };
type Product = {
  id: number; name: string; sku: string; price: number; origPrice: number;
  category: string; img: string;
  hasVariants: boolean;
  variants?: Variant[];
  serials?: Record<string, Serial[]>; // key: variantId or 'default'
};

type CartItem = {
  productId: number; productName: string; img: string;
  variantId: string; variantLabel: string;
  serialCode: string; serialId: string;
  price: number; qty: number;
};

/* ─── Mock Data ─── */
const mockProducts: Product[] = [
  {
    id: 1, name: 'Laptop ASUS ROG G15', sku: 'ROG-G15', price: 49990000, origPrice: 54990000, category: 'Laptop', img: '',
    hasVariants: true,
    variants: [
      { id: 'v1', label: 'RTX 4070 / 16GB RAM', price: 49990000, origPrice: 54990000 },
      { id: 'v2', label: 'RTX 4080 / 32GB RAM', price: 64990000, origPrice: 69990000 },
    ],
    serials: {
      v1: [
        { id: 's1', code: 'ROG-G15-001', warranty: '24 tháng' },
        { id: 's2', code: 'ROG-G15-002', warranty: '24 tháng' },
      ],
      v2: [
        { id: 's3', code: 'ROG-G15-003-4080', warranty: '24 tháng' },
      ],
    },
  },
  {
    id: 2, name: 'Chuột Logitech G Pro X2', sku: 'LST-GPX2', price: 2790000, origPrice: 2990000, category: 'Phụ kiện', img: '',
    hasVariants: false,
    serials: {
      default: [
        { id: 's10', code: 'LOG-GPX2-001', warranty: '12 tháng' },
        { id: 's11', code: 'LOG-GPX2-002', warranty: '12 tháng' },
        { id: 's12', code: 'LOG-GPX2-003', warranty: '12 tháng' },
      ],
    },
  },
  {
    id: 3, name: 'Bàn phím Keychron Q1 Pro', sku: 'KEY-Q1P', price: 3490000, origPrice: 3490000, category: 'Phụ kiện', img: '',
    hasVariants: true,
    variants: [
      { id: 'v10', label: 'Màu đen - Switch Brown', price: 3490000, origPrice: 3490000 },
      { id: 'v11', label: 'Màu trắng - Switch Red', price: 3490000, origPrice: 3490000 },
    ],
    serials: {
      v10: [{ id: 's20', code: 'KEY-Q1-BLK-001', warranty: '12 tháng' }],
      v11: [
        { id: 's21', code: 'KEY-Q1-WHT-001', warranty: '12 tháng' },
        { id: 's22', code: 'KEY-Q1-WHT-002', warranty: '12 tháng' },
      ],
    },
  },
  {
    id: 4, name: 'SSD Samsung 990 Pro 1TB', sku: 'SAM-990P-1T', price: 2190000, origPrice: 2490000, category: 'Linh kiện', img: '',
    hasVariants: false,
    serials: {
      default: [
        { id: 's30', code: 'SS-990P-1T-001', warranty: '5 năm' },
        { id: 's31', code: 'SS-990P-1T-002', warranty: '5 năm' },
      ],
    },
  },
  {
    id: 5, name: 'RAM Corsair 32GB DDR5', sku: 'COR-32DDR5', price: 2390000, origPrice: 2590000, category: 'Linh kiện', img: '',
    hasVariants: false,
    serials: {
      default: [{ id: 's40', code: 'CORS-32D5-001', warranty: '24 tháng' }],
    },
  },
  {
    id: 6, name: 'Tai nghe Sony WH-1000XM5', sku: 'SNY-WH1000', price: 7490000, origPrice: 8490000, category: 'Phụ kiện', img: '',
    hasVariants: true,
    variants: [
      { id: 'v20', label: 'Màu đen', price: 7490000, origPrice: 8490000 },
      { id: 'v21', label: 'Màu trắng', price: 7490000, origPrice: 8490000 },
    ],
    serials: {
      v20: [{ id: 's50', code: 'SONY-XM5-BLK-001', warranty: '12 tháng' }],
      v21: [{ id: 's51', code: 'SONY-XM5-WHT-001', warranty: '12 tháng' }],
    },
  },
  {
    id: 7, name: 'Màn hình LG 27" 4K IPS', sku: 'LG-27-4K', price: 12490000, origPrice: 13990000, category: 'Màn hình', img: '',
    hasVariants: false,
    serials: {
      default: [
        { id: 's60', code: 'LG-27-4K-001', warranty: '36 tháng' },
        { id: 's61', code: 'LG-27-4K-002', warranty: '36 tháng' },
      ],
    },
  },
];

const CATEGORIES = ['Tất cả', 'Laptop', 'Màn hình', 'Phụ kiện', 'Linh kiện'];

/* ─── Select Serial Modal ─── */
const SelectModal = ({
  product, onConfirm, onClose,
}: {
  product: Product;
  onConfirm: (item: Omit<CartItem, 'qty'>) => void;
  onClose: () => void;
}) => {
  const [variantId, setVariantId] = useState<string>(
    product.hasVariants ? (product.variants![0].id) : 'default'
  );
  const [serialId, setSerialId] = useState('');

  const variant = product.hasVariants ? product.variants!.find(v => v.id === variantId)! : null;
  const price = variant ? variant.price : product.price;
  const serials = product.serials?.[variantId] ?? [];

  const selectedSerial = serials.find(s => s.id === serialId);

  const confirm = () => {
    if (!selectedSerial) return;
    onConfirm({
      productId: product.id,
      productName: product.name,
      img: product.img,
      variantId,
      variantLabel: variant ? variant.label : '',
      serialCode: selectedSerial.code,
      serialId: selectedSerial.id,
      price,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-extrabold text-gray-900 text-base">Chọn sản phẩm</h2>
            <p className="text-xs text-gray-500 mt-0.5">{product.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Variant select */}
          {product.hasVariants && (
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Biến thể</label>
              <div className="space-y-2">
                {product.variants!.map(v => (
                  <label key={v.id} className={`flex items-center gap-3 border-2 rounded-xl p-3 cursor-pointer transition-all ${variantId === v.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="variant" value={v.id} checked={variantId === v.id}
                      onChange={() => { setVariantId(v.id); setSerialId(''); }} className="text-primary-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{v.label}</p>
                      <p className="text-sm text-primary-600 font-bold">{v.price.toLocaleString('vi-VN')}₫</p>
                    </div>
                    <span className="text-xs text-gray-400">{product.serials?.[v.id]?.length ?? 0} serial</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Serial select */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Serial <span className="text-gray-400 font-normal">({serials.length} sản phẩm tồn kho)</span>
            </label>
            {serials.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl">Không còn hàng cho biến thể này</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {serials.map(s => (
                  <label key={s.id} className={`flex items-center gap-3 border-2 rounded-xl p-3 cursor-pointer transition-all ${serialId === s.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="serial" value={s.id} checked={serialId === s.id}
                      onChange={() => setSerialId(s.id)} className="text-primary-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 font-mono">{s.code}</p>
                      <p className="text-xs text-gray-500">Bảo hành: {s.warranty}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {selectedSerial && (
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Tóm tắt lựa chọn</p>
              <p className="text-sm font-semibold text-gray-900">{product.name} {variant ? `· ${variant.label}` : ''}</p>
              <p className="text-xs text-gray-500">Serial: <span className="font-mono text-gray-700">{selectedSerial.code}</span> · BH: {selectedSerial.warranty}</p>
              <p className="text-primary-600 font-bold text-sm mt-1">{price.toLocaleString('vi-VN')}₫</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Huỷ</button>
          <button disabled={!serialId} onClick={confirm}
            className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Payment Modal ─── */
const PayModal = ({ total, onClose }: { total: number; onClose: () => void }) => {
  const [method, setMethod] = useState<'cash' | 'transfer' | 'card'>('cash');
  const [received, setReceived] = useState('');
  const change = method === 'cash' ? Math.max(0, (Number(received.replace(/\D/g, '')) || 0) - total) : 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900">Thanh toán</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-primary-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">Tổng cần thanh toán</p>
            <p className="text-3xl font-extrabold text-primary-600 mt-1">{total.toLocaleString('vi-VN')}₫</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Phương thức</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'cash', icon: Banknote, label: 'Tiền mặt' },
                { key: 'transfer', icon: Smartphone, label: 'Chuyển khoản' },
                { key: 'card', icon: CreditCard, label: 'Thẻ' },
              ].map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => setMethod(key as typeof method)}
                  className={`p-3 rounded-xl border-2 text-xs font-semibold flex flex-col items-center gap-1 transition-all ${method === key ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <Icon className="w-5 h-5" />{label}
                </button>
              ))}
            </div>
          </div>
          {method === 'cash' && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tiền khách đưa</label>
              <input type="number" value={received} onChange={e => setReceived(e.target.value)} placeholder="0₫"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              {change > 0 && <p className="text-sm font-bold text-green-600 mt-2">Tiền thối: {change.toLocaleString('vi-VN')}₫</p>}
            </div>
          )}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700">Huỷ</button>
          <button onClick={onClose} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 text-sm font-semibold">Xác nhận thanh toán</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Product Card (horizontal) ─── */
const ProductCard = ({ p, onAdd }: { p: Product; onAdd: () => void }) => {
  const stockCount = Object.values(p.serials ?? {}).flat().length;
  const categoryColor: Record<string, string> = {
    'Laptop': 'bg-blue-50 text-blue-700',
    'Màn hình': 'bg-purple-50 text-purple-700',
    'Phụ kiện': 'bg-green-50 text-green-700',
    'Linh kiện': 'bg-orange-50 text-orange-700',
  };
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 px-4 py-3 group ${stockCount === 0 ? 'opacity-60' : ''}`}>
      {/* Image placeholder */}
      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-2xl">
        {p.category === 'Laptop' ? '💻' : p.category === 'Màn hình' ? '🖥️' : p.category === 'Phụ kiện' ? '🖱️' : '💾'}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <p className="font-semibold text-gray-900 text-sm leading-snug truncate">{p.name}</p>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 ${categoryColor[p.category] ?? 'bg-gray-100 text-gray-500'}`}>{p.category}</span>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5">{p.sku}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-primary-600 font-bold text-sm">{p.price.toLocaleString('vi-VN')}₫</span>
          {p.price < p.origPrice && <span className="text-gray-400 text-xs line-through">{p.origPrice.toLocaleString('vi-VN')}₫</span>}
        </div>
        {p.hasVariants && (
          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-0.5"><ChevronDown className="w-3 h-3" /> {p.variants!.length} biến thể</p>
        )}
      </div>
      {/* Right side */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${stockCount > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {stockCount > 0 ? `${stockCount} tồn` : 'Hết hàng'}
        </span>
        <button
          onClick={onAdd}
          disabled={stockCount === 0}
          className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Thêm
        </button>
      </div>
    </div>
  );
};

/* ─── Main ─── */
const AdminPOS = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectProduct, setSelectProduct] = useState<Product | null>(null);
  const [showPay, setShowPay] = useState(false);

  const filtered = mockProducts
    .filter(p => category === 'Tất cả' || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (item: Omit<CartItem, 'qty'>) => {
    setCart(prev => {
      const exists = prev.find(c => c.serialId === item.serialId);
      if (exists) return prev.map(c => c.serialId === item.serialId ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (serialId: string, delta: number) =>
    setCart(prev => prev.map(c => c.serialId === serialId ? { ...c, qty: Math.max(1, c.qty + delta) } : c));

  const removeItem = (serialId: string) => setCart(prev => prev.filter(c => c.serialId !== serialId));

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  return (
    <div className="p-6 h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-gray-900">Bán hàng tại quầy</h1>
        <p className="text-sm text-gray-400">POS — Point of Sale</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 h-[calc(100vh-190px)]">
        {/* Left: Products */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          {/* Search + Category */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm sản phẩm hoặc quét barcode..."
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-full focus:ring-2 focus:ring-primary-500 outline-none bg-white shadow-sm" />
            </div>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${category === c ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Product list */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filtered.map(p => (
              <ProductCard key={p.id} p={p} onAdd={() => setSelectProduct(p)} />
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-gray-300">
                <Search className="w-10 h-10 mb-2" />
                <p className="text-sm">Không tìm thấy sản phẩm</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-900">Giỏ hàng</h3>
            </div>
            <span className="text-sm text-gray-500">{cart.length} sản phẩm</span>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-300 py-16">
                <ShoppingCart className="w-14 h-14 mb-3" />
                <p className="text-sm font-medium">Chưa có sản phẩm</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.serialId} className="px-4 py-3 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg shrink-0">
                    {item.productName.includes('Laptop') ? '💻' : item.productName.includes('Chuột') ? '🖱️' : item.productName.includes('Màn') ? '🖥️' : '⌨️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
                    {item.variantLabel && <p className="text-xs text-gray-400">{item.variantLabel}</p>}
                    <p className="text-xs text-gray-400 font-mono">SN: {item.serialCode}</p>
                    <p className="text-primary-600 font-bold text-sm mt-0.5">{item.price.toLocaleString('vi-VN')}₫</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button onClick={() => removeItem(item.serialId)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.serialId, -1)} className="px-2 py-1 hover:bg-gray-100 transition-colors text-gray-600"><Minus className="w-3 h-3" /></button>
                      <span className="px-2 text-sm font-semibold min-w-[24px] text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.serialId, 1)} className="px-2 py-1 hover:bg-gray-100 transition-colors text-gray-600"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Tạm tính</span>
                <span className="font-semibold text-gray-900">{total.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-3">
                <span className="font-bold text-gray-900">Tổng cộng</span>
                <span className="font-extrabold text-primary-600 text-xl">{total.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCart([])} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Xoá tất cả</button>
                <button onClick={() => setShowPay(true)} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                  <CreditCard className="w-4 h-4" /> Thanh toán
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectProduct && <SelectModal product={selectProduct} onConfirm={addToCart} onClose={() => setSelectProduct(null)} />}
      {showPay && <PayModal total={total} onClose={() => setShowPay(false)} />}
    </div>
  );
};

export default AdminPOS;
