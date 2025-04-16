export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  discount?: number;
  spicy_level?: number;
  rating?: number;
  preparation_time?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

export interface OrderFormData {
  customer_name: string;
  email: string;
  address: string;
  payment_method: 'qr' | 'cod' | 'card';
  items: CartItem[];
  total_amount: number;
} 