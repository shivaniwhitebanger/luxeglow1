/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, INITIAL_PRODUCTS } from '../data/cosmeticsCatalog';
import { User, Order, CouponValidation, AdminStats } from '../types';

const TOKEN_KEY = 'elixir_auth_token';
const USER_KEY = 'elixir_auth_user';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errMessage = 'Request failed';
    try {
      const errData = await response.json();
      errMessage = errData.error || errMessage;
    } catch {
      // fallback
    }
    throw new Error(errMessage);
  }

  return response.json();
}

export const api = {
  // Sync initial 100 products to server DB
  async initCatalog(): Promise<Product[]> {
    try {
      // First check if products exist on server
      const res = await apiFetch<{ products: Product[]; total: number }>('/api/products');
      if (res.products && res.products.length >= 80) {
        return res.products;
      }

      // If empty or small, sync the 100 products catalog
      await apiFetch('/api/sync-catalog', {
        method: 'POST',
        body: JSON.stringify({ products: INITIAL_PRODUCTS }),
      });

      const updated = await apiFetch<{ products: Product[]; total: number }>('/api/products');
      return updated.products || INITIAL_PRODUCTS;
    } catch (e) {
      console.warn('API fetch products error, using client-side initial catalog fallback:', e);
      return INITIAL_PRODUCTS;
    }
  },

  async getProducts(params?: { category?: string; search?: string; sort?: string; featured?: boolean }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.sort) query.append('sort', params.sort);
      if (params?.featured) query.append('featured', 'true');

      const url = `/api/products?${query.toString()}`;
      const data = await apiFetch<{ products: Product[]; total: number }>(url);
      return data.products;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      return await apiFetch<Product>(`/api/products/${id}`);
    } catch {
      return INITIAL_PRODUCTS.find((p) => p.id === id) || null;
    }
  },

  async addProduct(product: Partial<Product>): Promise<Product> {
    return await apiFetch<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return await apiFetch<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return await apiFetch<{ success: boolean }>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return await apiFetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(data: { name: string; email: string; password: string; phone?: string; address?: string }): Promise<{ token: string; user: User }> {
    return await apiFetch<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCurrentUser(): Promise<User | null> {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const res = await apiFetch<{ user: User }>('/api/auth/me');
      return res.user;
    } catch {
      clearAuthSession();
      return null;
    }
  },

  // Coupons
  async validateCoupon(code: string, subtotal: number): Promise<CouponValidation> {
    return await apiFetch<CouponValidation>('/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  },

  // Orders
  async createOrder(orderData: any): Promise<Order> {
    return await apiFetch<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getMyOrders(): Promise<Order[]> {
    return await apiFetch<Order[]>('/api/orders/my-orders');
  },

  // Admin Routes
  async getAdminOrders(): Promise<Order[]> {
    return await apiFetch<Order[]>('/api/admin/orders');
  },

  async updateOrderStatus(orderId: string, status: string, paymentStatus?: string): Promise<Order> {
    return await apiFetch<Order>(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, paymentStatus }),
    });
  },

  async getAdminCustomers(): Promise<any[]> {
    return await apiFetch<any[]>('/api/admin/customers');
  },

  async getAdminStats(): Promise<AdminStats> {
    return await apiFetch<AdminStats>('/api/admin/stats');
  },
};
