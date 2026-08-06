'use client';

export interface CartItem {
  id: number;
  name: string;
  category: string;
  weight: string;
  image: string;
  alt: string;
  packSize: string;
  quantity: number;
  price: number;
}

const CART_KEY = 'cattlefeed_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, 'quantity'>): CartItem[] {
  const cart = getCart();
  const key = `${item.id}-${item.packSize}`;
  const existing = cart.find((c) => `${c.id}-${c.packSize}` === key);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(id: number, packSize: string): CartItem[] {
  const cart = getCart().filter((c) => !(c.id === id && c.packSize === packSize));
  saveCart(cart);
  return cart;
}

export function updateQuantity(id: number, packSize: string, quantity: number): CartItem[] {
  const cart = getCart().map((c) =>
    c.id === id && c.packSize === packSize ? { ...c, quantity: Math.max(0, quantity) } : c
  );
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
}

export function getCartCount(): number {
  return getCart().reduce((sum, c) => sum + c.quantity, 0);
}
