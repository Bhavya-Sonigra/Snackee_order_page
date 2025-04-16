export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  spicy_level?: number;
  discount?: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderFormData {
  customer_name: string;
  email: string;
  address: string;
  payment_method: string;
  items: CartItem[];
  total_amount: number;
} 