import { useState, useEffect } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  discountPrice?: number;
  price: number;
}

const BACKEND_URL = 'http://localhost:5000';

export default function ProductGallery({ images, productName, discountPrice, price }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState<string>('');

  const getProductImage = (img: string) => {
    if (!img) return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `${BACKEND_URL}/${img}`;
  };

  useEffect(() => {
    if (images && images.length > 0) {
      setActiveImage(images[0]);
    } else {
      setActiveImage('');
    }
  }, [images]);

  // Calculate discount percentage
  const hasDiscount = discountPrice !== undefined && discountPrice > 0;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice!) / price) * 100) : 0;

  const resolvedImages = images && images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500'];

  return (
    <div className="flex flex-col gap-4">
      {/* Large Active Image Display */}
      <div className="relative aspect-4/3 bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden group">
        <img
          src={getProductImage(activeImage || resolvedImages[0])}
          alt={productName}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute top-4 left-4 px-3 py-1 text-sm font-extrabold text-white bg-red-600 rounded-lg shadow-md z-10">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Thumbnails Row */}
      {resolvedImages.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {resolvedImages.map((img, idx) => {
            const isSelected = activeImage === img || (!activeImage && idx === 0);
            return (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-white transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-red-600 shadow-md scale-102' 
                    : 'border-slate-200/60 hover:border-slate-400'
                }`}
              >
                <img
                  src={getProductImage(img)}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
