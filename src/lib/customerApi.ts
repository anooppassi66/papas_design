const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
export const UPLOADS = API.replace("/api", "");

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("customer_token");
}

async function request(method: string, path: string, body?: unknown): Promise<unknown> {
  const token = getToken();
  const isFormData = body instanceof FormData;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API}/customer${path}`, {
    method,
    headers,
    body: isFormData ? body as FormData : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error || res.statusText);
  }
  return res.json();
}

export const customerApi = {
  get: (path: string) => request("GET", path),
  post: (path: string, body?: unknown) => request("POST", path, body),
  put: (path: string, body?: unknown) => request("PUT", path, body),
  delete: (path: string) => request("DELETE", path),
};

// Auth helpers
export function saveAuth(token: string, user: unknown) {
  localStorage.setItem("customer_token", token);
  localStorage.setItem("customer_user", JSON.stringify(user));
}

export function getUser(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("customer_user");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function clearAuth() {
  localStorage.removeItem("customer_token");
  localStorage.removeItem("customer_user");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// Cart helpers (localStorage-based)
export interface CartItem {
  product_id: number;
  product_variant_id: number;
  product_name: string;
  product_slug: string;
  product_image: string | null;
  brand_name: string;
  variant_size: string;
  variant_color: string;
  unit_price: number;
  quantity: number;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const idx = cart.findIndex(
    (c) => c.product_variant_id === item.product_variant_id
  );
  if (idx >= 0) {
    cart[idx].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function removeFromCart(product_variant_id: number) {
  saveCart(getCart().filter((c) => c.product_variant_id !== product_variant_id));
}

export function updateCartQty(product_variant_id: number, quantity: number) {
  if (quantity < 1) return removeFromCart(product_variant_id);
  const cart = getCart();
  const idx = cart.findIndex((c) => c.product_variant_id === product_variant_id);
  if (idx >= 0) { cart[idx].quantity = quantity; saveCart(cart); }
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.quantity, 0);
}
