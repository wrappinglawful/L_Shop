export interface Address {
  country?: string;
  town?: string;
  street?: string;
  houseNumber?: string;
}

export interface Product {
  id: number | string;
  title: string;
  price: number;
  isAvailable: boolean;
  description: string;
  categories: string[];
  images: {
    preview: string;
    gallery?: string[];
  };
  delivery?: {
    startTown: Address;
    earlyDate: string;
    price: number;
  };
  discount?: number;
}

export interface User {
  id: number | string;
  name: string;
  password?: string;
  email?: string;
  phone?: string;
}

export interface BasketProduct {
  count: number;
  products: Product;
}

export interface Basket {
  id: number | string;
  userId: number | string;
  basket: BasketProduct[];
}

export interface Delivery {
  id: number | string;
  userId: number | string;
  address: Address;
  phone: string;
  email: string;
  paymentMethod: string;
  items: BasketProduct[];
  status: 'pending' | 'completed';
}
