/** Sản phẩm được chatbot AI gợi ý */
export interface SuggestedProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
  specs?: {
    cpu?: string;
    ram?: string;
    storage?: string;
    vga?: string;
  };
}

/** Tin nhắn trong phiên chat */
export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  suggestedProducts?: SuggestedProduct[];
  timestamp: string;
}
