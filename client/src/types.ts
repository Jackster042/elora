export interface CartItem {
  image: string;
  title: string;
  price: number;
  salePrice?: number;
  productId: string;
  quantity: number;
  // Backend cart items may not include an _id; treat productId as the stable identifier.
  _id?: string;
}
