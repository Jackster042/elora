interface LocalCartItem {
  productId: string;
  quantity: number;
  addedAt: number;
}

const LOCAL_CART_KEY = 'elora_guest_cart';
const MAX_CART_ITEMS = 50; // Maximum different products
const MAX_TOTAL_QUANTITY = 100; // Maximum total items
const CART_EXPIRY_DAYS = 30; // Cart expires after 30 days

export const localCart = {
  /**
   * Get all items from local cart
   * Automatically cleans up expired items
   */
  get(): LocalCartItem[] {
    try {
      const cart = localStorage.getItem(LOCAL_CART_KEY);
      if (!cart) return [];

      const items = JSON.parse(cart) as LocalCartItem[];
      
      // Clean up expired items (older than CART_EXPIRY_DAYS)
      const now = Date.now();
      const expiryTime = CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      const validItems = items.filter(
        (item) => now - item.addedAt < expiryTime
      );

      // If items were removed, update storage
      if (validItems.length !== items.length) {
        this.set(validItems);
      }

      return validItems;
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
   * Enforces cart size limits
   */
  add(productId: string, quantity: number): { success: boolean; message?: string } {
    const cart = this.get();
    const existingIndex = cart.findIndex(item => item.productId === productId);

    // Check if adding new item would exceed limit
    if (existingIndex === -1 && cart.length >= MAX_CART_ITEMS) {
      return {
        success: false,
        message: `Cart cannot contain more than ${MAX_CART_ITEMS} different products`,
      };
    }

    // Calculate total quantity
    const currentTotal = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (currentTotal + quantity > MAX_TOTAL_QUANTITY) {
      return {
        success: false,
        message: `Cart cannot contain more than ${MAX_TOTAL_QUANTITY} total items`,
      };
    }

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
      cart[existingIndex].addedAt = Date.now(); // Update timestamp
    } else {
      cart.push({ productId, quantity, addedAt: Date.now() });
    }

    this.set(cart);
    return { success: true };
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
  },

  /**
   * Get cart limits for display
   */
  getLimits() {
    return {
      maxItems: MAX_CART_ITEMS,
      maxQuantity: MAX_TOTAL_QUANTITY,
      expiryDays: CART_EXPIRY_DAYS,
    };
  },

  /**
   * Clean up expired items manually
   */
  cleanup(): number {
    const before = this.get().length;
    const items = this.get(); // This triggers auto-cleanup
    const after = items.length;
    return before - after; // Return number of items removed
  },
};

export type { LocalCartItem };
