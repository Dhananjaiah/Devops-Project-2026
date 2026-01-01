export type User = {
  id: string;
  email: string;
  name?: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type Product = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock?: number;
  imageUrl?: string;
};

export type ProductListResponse = {
  products: Array<Product & { _id: string }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export type CartItem = { productId: string; quantity: number };
export type Cart = { userId: string; items: CartItem[] };

export type Order = {
  _id: string;
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  total: number;
  status: string;
  shippingAddress: Record<string, unknown>;
  createdAt?: string;
};
