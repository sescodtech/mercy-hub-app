export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin";
  isVerified: boolean;
  hasPassword: boolean;
  walletBalance?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
  description?: string;
}

export interface Plan {
  id: string;
  name: string;
  size?: string;
  validity?: string;
  price: number;
  network: string;
  type: string;
  providerPlanId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  items: CartItem[];
  createdAt: string;
}
