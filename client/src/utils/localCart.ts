interface LocalCartItem {
  productId: string;
  quantity: number;
  addedAt: number;
}

const LOCAL_CART_KEY = 'elora_guest_cart';

export const localCart = {
  /**
   * Get all items from local cart
   */
  get(): LocalCartItem[] {
    try {
      const cart = localStorage.getItem(LOCAL_CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  /**
   * Set cart items in localStorage
   */
  set(items: LocalCartItem[]): void {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  /**
   * Add item to cart or update quantity if exists
   */
  add(productId: string, quantity: number): void {
    const cart = this.get();
    const existingIndex = cart.findIndex(item => item.productId === productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ productId, quantity, addedAt: Date.now() });
    }

    this.set(cart);
  },

  /**
   * Update item quantity (or remove if quantity <= 0)
   */
  update(productId: string, quantity: number): void {
    const cart = this.get();
    const index = cart.findIndex(item => item.productId === productId);

    if (index > -1) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
      }
      this.set(cart);
    }
  },

  /**
   * Remove item from cart
   */
  remove(productId: string): void {
    const cart = this.get().filter(item => item.productId !== productId);
    this.set(cart);
  },

  /**
   * Clear entire cart
   */
  clear(): void {
    try {
      localStorage.removeItem(LOCAL_CART_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  /**
   * Get total count of items in cart
   */
  getCount(): number {
    return this.get().reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Check if cart has any items
   */
  hasItems(): boolean {
    return this.get().length > 0;
  }
};

export type { LocalCartItem };
