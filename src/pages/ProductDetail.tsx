import { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Shield,
  Truck,
  ArrowLeftRight,
  Check,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ImageIcon,
  Zap,
  PackageCheck,
  XCircle,
  CheckCircle2,
  Sparkles,
  MessageSquarePlus,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Mock Data ──────────────────────────────────────────────────────────────
const product = {
  id: 1,
  name: "Laptop Asus ROG Strix G15 (2024) AMD Ryzen 9 7945HX RTX 4080",
  sku: "ROG-G15-7945HX-4080",
  brand: "ASUS",
  images: [
    "https://placehold.co/600x450/1a1a2e/white?text=ROG+Front",
    "https://placehold.co/600x450/16213e/white?text=ROG+Side",
    "https://placehold.co/600x450/0f3460/white?text=ROG+Back",
    "https://placehold.co/600x450/533483/white?text=ROG+Keyboard",
  ],
  price: 59990000,
  oldPrice: 67990000,
  discount: 12,
  rating: 4.8,
  reviewCount: 247,
  inStock: true,
  shortDesc:
    "Laptop gaming cao cấp với CPU AMD Ryzen 9 7945HX và GPU RTX 4080 mạnh mẽ, màn hình QHD+ 240Hz cho trải nghiệm gaming đỉnh cao.",
  specs: [
    {
      group: "Bộ xử lý",
      rows: [
        {
          label: "CPU",
          value:
            "AMD Ryzen 9 7945HX (16 nhân / 32 luồng, tốc độ tối đa 5.4GHz)",
        },
        { label: "Kiến trúc", value: "AMD Zen 4, tiến trình 4nm" },
        { label: "Bộ nhớ đệm", value: "L2: 16MB, L3: 64MB" },
      ],
    },
    {
      group: "RAM & Lưu trữ",
      rows: [
        { label: "RAM", value: "32GB DDR5 4800MHz (2 x 16GB)" },
        { label: "Số khe RAM", value: "2 khe SO-DIMM, nâng cấp tối đa 64GB" },
        { label: "Ổ cứng", value: "2TB NVMe PCIe Gen4 SSD" },
        { label: "Số khe M.2", value: "2 khe M.2 2280 (1 có sẵn, 1 trống)" },
      ],
    },
    {
      group: "Đồ họa",
      rows: [
        { label: "GPU", value: "NVIDIA GeForce RTX 4080 12GB GDDR6" },
        { label: "GPU rời", value: "NVIDIA RTX 4080 Laptop GPU, 175W TGP" },
        { label: "GPU tích hợp", value: "AMD Radeon 610M (trong CPU)" },
        { label: "Giao diện GPU", value: "PCIe 4.0 x16" },
      ],
    },
    {
      group: "Màn hình",
      rows: [
        { label: "Kích thước", value: "15.6 inch" },
        { label: "Độ phân giải", value: "2560 x 1600 (QHD+)" },
        { label: "Tần số quét", value: "240Hz" },
        { label: "Loại tờ", value: "IPS-level, Optimus enabled" },
        { label: "Độ phủ màu sRGB", value: "100% sRGB, DCI-P3 76%" },
        { label: "Độ sáng", value: "300 nits" },
        {
          label: "Tần số Adaptive Sync",
          value: "FreeSync Premium / G-Sync Compatible",
        },
      ],
    },
    {
      group: "Âm thanh",
      rows: [
        { label: "Loa", value: "2 loa stereo dựng đứng" },
        { label: "Công suất loa", value: "2 x 3W" },
        { label: "Công nghệ âm thanh", value: "Dolby Atmos, DTS:X Ultra" },
        { label: "Micro", value: "2 microphone mảng, khử tiếng ồn AI" },
        { label: "Đầu cắm audio", value: "3.5mm combo (tai nghe + mic)" },
      ],
    },
    {
      group: "Kết nối",
      rows: [
        { label: "Wi-Fi", value: "Wi-Fi 6E (802.11ax), 2.4 / 5 / 6 GHz" },
        { label: "Bluetooth", value: "Bluetooth 5.3" },
        { label: "USB-C", value: "1x USB-C 3.2 Gen 2 (hỗ trợ DP, 100W PD)" },
        { label: "USB-A", value: "3x USB-A 3.2 Gen 1" },
        { label: "HDMI", value: "1x HDMI 2.1 (FRL mode, 4K@120Hz / 8K@60Hz)" },
        { label: "RJ-45", value: "1x Ethernet 2.5Gbps" },
        { label: "Khe đọc thẻ", value: "SD Card UHS-II" },
      ],
    },
    {
      group: "Bàn phím & cảm ứng",
      rows: [
        { label: "Bàn phím", value: "RGB per-key (Aura Sync), hự nước IP54" },
        { label: "Hành trình phím", value: "1.7mm" },
        { label: "Touchpad", value: "Microsoft Precision, 12cm x 7cm" },
        { label: "Camera", value: "Hoặc không tích hợp (tuỳ phân khúc)" },
      ],
    },
    {
      group: "Pin & Sạc",
      rows: [
        { label: "Dung lượng pin", value: "90Wh, 4-cell Li-Ion" },
        { label: "Adapter sạc", value: "240W (20V/12A)" },
        { label: "Sạc qua USB-C", value: "Có hỗ trợ (100W PD)" },
        { label: "Thời lượng pin", value: "khoảng 3-4 giờ (văn phòng nhẹ)" },
      ],
    },
    {
      group: "Thiết kế & Khời lượng",
      rows: [
        { label: "Vật liệu", value: "Vỏ nhôm hợp kim cao cấp" },
        { label: "Kích thước", value: "354 x 259 x 27.2mm" },
        { label: "Trọng lượng", value: "2.3 kg (cả adapter: 3.05 kg)" },
        { label: "Hệ điều hành", value: "Windows 11 Home (64-bit)" },
      ],
    },
  ],
};

// ─── Product Attributes ──────────────────────────────────────────────────────
const colorAttributes = [
  { id: "black", label: "Eclipse Gray", hex: "#2D2D2D" },
  { id: "white", label: "Moonlight White", hex: "#E8E8E8" },
  { id: "blue", label: "ROG Blue", hex: "#1A4B8C" },
];

const ramOptions = [
  { id: "16gb", label: "16GB", available: true },
  { id: "32gb", label: "32GB", available: true },
  { id: "64gb", label: "64GB", available: false },
];

const storageOptions = [
  { id: "1tb", label: "1TB SSD", priceDiff: -3000000, available: true },
  { id: "2tb", label: "2TB SSD", priceDiff: 0, available: true },
  { id: "4tb", label: "4TB SSD", priceDiff: 5000000, available: false },
];

const warrantyOptions = [
  { id: 0, label: "Bảo hành tiêu chuẩn 12 tháng", price: 0 },
  { id: 1, label: "Bảo hành mở rộng 24 tháng", price: 990000 },
  {
    id: 2,
    label: "Bảo hành toàn diện (tai nạn, rơi vỡ) 24 tháng",
    price: 1990000,
  },
];

const relatedProducts = [
  {
    id: 2,
    name: "Laptop Asus ROG Strix G16 RTX 4070",
    price: 49990000,
    img: "https://placehold.co/120x90/16213e/white?text=G16",
  },
  {
    id: 3,
    name: "Chuột ASUS ROG Chakram X",
    price: 2490000,
    img: "https://placehold.co/120x90/1a1a2e/white?text=Mouse",
  },
  {
    id: 4,
    name: "Bàn phím ASUS ROG Strix Scope II",
    price: 1990000,
    img: "https://placehold.co/120x90/0f3460/white?text=Keyboard",
  },
];

const reviews = [
  {
    id: 1,
    user: "Trần Văn B",
    initials: "TB",
    date: "20/02/2026",
    rating: 5,
    comment:
      "Máy cực mạnh, chạy game AAA siêu mượt, màn hình rất đẹp. Giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng!",
    helpful: 18,
    images: [],
    replies: [
      {
        user: "TechStore Support",
        initials: "TS",
        date: "21/02/2026",
        comment:
          "Cảm ơn anh đã tin tưởng mua hàng tại TechStore! Chúc anh trải nghiệm vui vẻ nhé!",
      },
    ],
  },
  {
    id: 2,
    user: "Lê Thị C",
    initials: "LC",
    date: "15/02/2026",
    rating: 4,
    comment:
      "Sản phẩm tốt, hiệu năng mạnh. Fan hơi ồn khi chạy game nặng nhưng đó là đặc thù máy gaming. Nhiệt độ ổn định.",
    helpful: 9,
    images: [],
    replies: [],
  },
];

// ─── Sub-components ─────────────────────────────────────────────────────────
const StarRating = ({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) => {
  const cls = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${cls} ${s <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const ProductDetail = () => {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedWarranty, setSelectedWarranty] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [openSpecGroups, setOpenSpecGroups] = useState<string[]>([
    "Bộ xử lý",
    "Màn hình",
    "Âm thanh",
  ]);
  // Attribute state
  const [selectedColor, setSelectedColor] = useState(colorAttributes[0].id);
  const [selectedRam, setSelectedRam] = useState(ramOptions[1].id);
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[1].id);

  const toggleSpecGroup = (group: string) =>
    setOpenSpecGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
    );

  const activeStorage = storageOptions.find((s) => s.id === selectedStorage)!;
  const basePrice = product.price + activeStorage.priceDiff;
  const totalPrice = basePrice + warrantyOptions[selectedWarranty].price;

  const prevImg = () =>
    setActiveImg(
      (i) => (i - 1 + product.images.length) % product.images.length,
    );
  const nextImg = () => setActiveImg((i) => (i + 1) % product.images.length);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-[1200px] mx-auto px-4 pt-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 flex items-center gap-1 mb-4 flex-wrap">
          <Link to="/" className="hover:text-primary-600">
            Trang chủ
          </Link>
          <span>/</span>
          <a href="#" className="hover:text-primary-600">
            Laptop
          </a>
          <span>/</span>
          <a href="#" className="hover:text-primary-600">
            ASUS ROG
          </a>
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1">
            {product.name}
          </span>
        </nav>

        {/* ── Main Product Area ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
          {/* Left: Image Gallery */}
          <div className="lg:w-5/12">
            <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] mb-3 group">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={prevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  -{product.discount}%
                </span>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-12 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${i === activeImg ? "border-primary-500" : "border-gray-200 hover:border-gray-400"}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-7/12 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded">
                  {product.brand}
                </span>
                <span>SKU: {product.sku}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={product.rating} />
                  <span className="text-sm font-semibold text-gray-700">
                    {product.rating}
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">
                  {product.reviewCount} đánh giá
                </span>
                <span className="text-gray-300">|</span>
                <span
                  className={`text-sm font-medium flex items-center gap-1 ${product.inStock ? "text-green-600" : "text-red-500"}`}
                >
                  {product.inStock ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Còn hàng
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> Hết hàng
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-3xl font-extrabold text-primary-600">
                {basePrice.toLocaleString("vi-VN")}₫
              </span>
              {product.oldPrice && (
                <span className="text-gray-400 text-lg line-through">
                  {product.oldPrice.toLocaleString("vi-VN")}₫
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-lg">
                  Tiết kiệm{" "}
                  {(product.oldPrice - product.price).toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-gray-600 leading-relaxed border-l-4 border-primary-200 pl-4 bg-primary-50 py-2 rounded-r-lg">
              {product.shortDesc}
            </p>

            {/* ── ATTRIBUTES ─────────────────────────────────────────────── */}

            {/* Color */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Màu sắc:{" "}
                <span className="font-normal text-gray-600">
                  {colorAttributes.find((c) => c.id === selectedColor)?.label}
                </span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {colorAttributes.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    title={color.label}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color.id ? "border-primary-500 scale-110 shadow-md" : "border-gray-200 hover:border-gray-400"}`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* RAM */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">RAM:</p>
              <div className="flex gap-2 flex-wrap">
                {ramOptions.map((opt) => (
                  <button
                    key={opt.id}
                    disabled={!opt.available}
                    onClick={() => opt.available && setSelectedRam(opt.id)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                      ${
                        !opt.available
                          ? "border-gray-100 text-gray-300 cursor-not-allowed line-through bg-gray-50"
                          : selectedRam === opt.id
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 text-gray-700 hover:border-gray-400"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Ổ cứng:
              </p>
              <div className="flex gap-2 flex-wrap">
                {storageOptions.map((opt) => (
                  <button
                    key={opt.id}
                    disabled={!opt.available}
                    onClick={() => opt.available && setSelectedStorage(opt.id)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                      ${
                        !opt.available
                          ? "border-gray-100 text-gray-300 cursor-not-allowed line-through bg-gray-50"
                          : selectedStorage === opt.id
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 text-gray-700 hover:border-gray-400"
                      }`}
                  >
                    <span>{opt.label}</span>
                    {opt.priceDiff !== 0 && opt.available && (
                      <span
                        className={`ml-1.5 text-xs font-bold ${opt.priceDiff > 0 ? "text-orange-500" : "text-green-600"}`}
                      >
                        {opt.priceDiff > 0
                          ? `+${opt.priceDiff.toLocaleString("vi-VN")}₫`
                          : `-${Math.abs(opt.priceDiff).toLocaleString("vi-VN")}₫`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Warranty Options */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Gói bảo hành:
              </p>
              <div className="space-y-2">
                {warrantyOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedWarranty === opt.id ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <input
                      type="radio"
                      name="warranty"
                      checked={selectedWarranty === opt.id}
                      onChange={() => setSelectedWarranty(opt.id)}
                      className="text-primary-600 accent-primary-600"
                    />
                    <span className="text-sm text-gray-800 flex-1">
                      {opt.label}
                    </span>
                    <span
                      className={`text-sm font-bold ${opt.price > 0 ? "text-primary-600" : "text-gray-500"}`}
                    >
                      {opt.price > 0
                        ? `+${opt.price.toLocaleString("vi-VN")}₫`
                        : "Miễn phí"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-gray-900">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col w-full sm:flex-1">
                <div className="flex gap-3">
                  <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl shadow flex items-center justify-center gap-2 transition-colors text-sm">
                    <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ
                  </button>
                  <button
                    onClick={() => setWishlist((v) => !v)}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${wishlist ? "border-red-400 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400"}`}
                  >
                    <Heart
                      className={`w-5 h-5 ${wishlist ? "fill-red-500" : ""}`}
                    />
                  </button>
                  <button className="w-12 h-12 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-gray-400 flex items-center justify-center transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Tổng cộng:{" "}
                  <span className="font-bold text-primary-600 text-sm">
                    {(totalPrice * qty).toLocaleString("vi-VN")}₫
                  </span>
                </p>
              </div>
            </div>

            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow text-sm transition-colors flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Mua ngay — Giao hàng nhanh
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-600">
              {[
                { icon: Truck, text: "Miễn phí giao toàn quốc" },
                { icon: Shield, text: "Bảo hành chính hãng" },
                { icon: ArrowLeftRight, text: "Đổi trả 30 ngày" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5 border border-gray-100"
                >
                  <Icon className="w-5 h-5 text-primary-600 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* ── Left Column ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Mô tả sản phẩm
              </h2>
              <div
                className={`prose prose-sm max-w-none text-gray-600 leading-relaxed overflow-hidden transition-all ${showFullDesc ? "" : "max-h-40"}`}
              >
                <p>
                  Laptop ASUS ROG Strix G15 (2024) là một trong những chiếc máy
                  tính gaming cao cấp nhất trong dòng ROG của ASUS, được trang
                  bị bộ vi xử lý AMD Ryzen 9 7945HX mạnh mẽ với 16 nhân / 32
                  luồng.
                </p>
                <p className="mt-3">
                  Với card đồ họa NVIDIA GeForce RTX 4080 12GB, chiếc laptop này
                  có thể xử lý mọi tựa game AAA ở độ phân giải cao với hiệu năng
                  tốt nhất. Màn hình QHD+ 240Hz mang đến hình ảnh sắc nét và
                  mượt mà.
                </p>
                <p className="mt-3">
                  Hệ thống tản nhiệt tiên tiến ROG Intelligent Cooling với 4
                  quạt và 7 ống dẫn nhiệt đảm bảo máy luôn hoạt động ổn định
                  ngay cả khi chạy ở tải cao trong thời gian dài.
                </p>
                <p className="mt-3">
                  Bàn phím RGB có thể tùy chỉnh theo 16.7 triệu màu sắc thông
                  qua phần mềm Armoury Crate, mang đến trải nghiệm gaming đẹp
                  mắt và cá tính.
                </p>
              </div>
              <button
                onClick={() => setShowFullDesc((v) => !v)}
                className="mt-3 text-sm font-medium text-primary-600 hover:underline flex items-center gap-1"
              >
                {showFullDesc ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Thu gọn
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> Xem thêm
                  </>
                )}
              </button>
            </div>

            {/* Technical Specs — Grouped */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Cấu hình kỹ thuật
              </h2>
              <div className="space-y-3">
                {product.specs.map(({ group, rows }) => {
                  const isOpen = openSpecGroups.includes(group);
                  return (
                    <div
                      key={group}
                      className="border border-gray-100 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSpecGroup(group)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-bold text-gray-800">
                          {group}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      {isOpen && (
                        <div>
                          {rows.map((row, i) => (
                            <div
                              key={row.label}
                              className={`grid grid-cols-5 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                            >
                              <div className="col-span-2 px-4 py-2.5 text-sm font-medium text-gray-600 border-r border-gray-100">
                                {row.label}
                              </div>
                              <div className="col-span-3 px-4 py-2.5 text-sm text-gray-900">
                                {row.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() =>
                  openSpecGroups.length === product.specs.length
                    ? setOpenSpecGroups([])
                    : setOpenSpecGroups(product.specs.map((s) => s.group))
                }
                className="mt-4 text-sm font-medium text-primary-600 hover:underline flex items-center gap-1"
              >
                {openSpecGroups.length === product.specs.length ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Thu gọn tất cả
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> Mở rộng tất cả (
                    {product.specs.length} nhóm)
                  </>
                )}
              </button>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Đánh giá sản phẩm
              </h2>

              {/* Summary */}
              <div className="flex items-center gap-8 mb-6 pb-6 border-b border-gray-100">
                <div className="text-center shrink-0">
                  <p className="text-5xl font-extrabold text-gray-900">
                    {product.rating}
                  </p>
                  <StarRating rating={product.rating} size="lg" />
                  <p className="text-xs text-gray-500 mt-1">
                    {product.reviewCount} đánh giá
                  </p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-4 text-right">{star}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 bg-yellow-400 rounded-full"
                          style={{
                            width:
                              star === 5 ? "70%" : star === 4 ? "20%" : "5%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {review.initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-gray-900">
                            {review.user}
                          </span>
                          <span className="text-xs text-gray-400">
                            {review.date}
                          </span>
                          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1">
                            <PackageCheck className="w-3 h-3" /> Đã mua hàng
                          </span>
                        </div>
                        <StarRating rating={review.rating} />
                        <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                          {review.comment}
                        </p>

                        {review.images.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {review.images.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt=""
                                className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                              />
                            ))}
                          </div>
                        )}

                        <button className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" /> Hữu ích (
                          {review.helpful})
                        </button>

                        {/* Replies */}
                        {review.replies.map((reply, i) => (
                          <div
                            key={i}
                            className="mt-3 ml-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2"
                          >
                            <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-blue-700 mb-1">
                                {reply.user} · {reply.date}
                              </p>
                              <p className="text-sm text-gray-700">
                                {reply.comment}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Write Review CTA */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <button className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                  <MessageSquarePlus className="w-4 h-4" /> Viết đánh giá của
                  bạn
                </button>
              </div>
            </div>
          </div>

          {/* ── Right Column ──────────────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Frequently Bought Together */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">
                Thường mua kèm
              </h3>
              <div className="space-y-3">
                {relatedProducts.map((rp) => (
                  <div key={rp.id} className="flex items-center gap-3">
                    <img
                      src={rp.img}
                      alt={rp.name}
                      className="w-16 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-800 font-medium line-clamp-2">
                        {rp.name}
                      </p>
                      <p className="text-xs font-bold text-primary-600 mt-0.5">
                        {rp.price.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                    <button className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-primary-400 hover:text-primary-600 flex items-center justify-center shrink-0 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Shocking Deal */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Deal sốc hôm nay
              </p>
              <p className="font-bold text-lg leading-tight mb-3">
                Mua kèm SSD 2TB chỉ còn 1.490.000₫
              </p>
              <button className="w-full bg-white text-orange-600 font-bold py-2 rounded-xl text-sm hover:bg-orange-50 transition-colors">
                Thêm vào đơn hàng
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm mb-3">
                Thông tin giao hàng
              </h3>
              {[
                {
                  icon: Truck,
                  title: "Giao nhanh trong 2 giờ",
                  sub: "Nội thành TP. Hồ Chí Minh & Hà Nội",
                },
                {
                  icon: Shield,
                  title: "Bảo hành tại 200+ trung tâm",
                  sub: "Trên toàn quốc",
                },
                {
                  icon: ArrowLeftRight,
                  title: "Đổi trả trong 30 ngày",
                  sub: "1-1 nếu lỗi do nhà sản xuất",
                },
                {
                  icon: Check,
                  title: "Hàng chính hãng 100%",
                  sub: "Nhập khẩu và phân phối chính thức",
                },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Image Upload Notice */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <ImageIcon className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Xem thực tế sản phẩm
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ghé trực tiếp cửa hàng hoặc liên hệ hotline để được tư vấn
                    và xem hàng thực tế.
                  </p>
                  <a
                    href="tel:0123456789"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline"
                  >
                    0123 456 789
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
