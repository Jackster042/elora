// REACT
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// COMPONENTS
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContainer from "./cart-items-container";

// TYPES
import { CartItem } from "../../types";
import { LocalCartItem } from "@/utils/localCart";
import axios from "axios";

const UserCartWrapper = ({
  items,
  setOpenCartSheet,
  isGuest = false,
}: {
  items: CartItem[] | LocalCartItem[];
  setOpenCartSheet: (open: boolean) => void;
  isGuest?: boolean;
}) => {
  const navigate = useNavigate();
  const [enrichedItems, setEnrichedItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch product details for guest cart items
  useEffect(() => {
    const fetchGuestCartProducts = async () => {
      if (!isGuest || !items || items.length === 0) {
        setEnrichedItems(items as CartItem[]);
        return;
      }

      setIsLoading(true);
      try {
        const productPromises = (items as LocalCartItem[]).map(async (item) => {
          try {
            const response = await axios.get(
              `${API_URL}/api/shop/products/get/${item.productId}`
            );
            if (response.data.success) {
              const product = response.data.product;
              return {
                _id: item.productId,
                productId: item.productId,
                image: product.image,
                title: product.title,
                price: product.price,
                salePrice: product.salePrice || 0,
                quantity: item.quantity,
              } as CartItem;
            }
            return null;
          } catch (error) {
            console.error(`Failed to fetch product ${item.productId}:`, error);
            return null;
          }
        });

        const results = await Promise.all(productPromises);
        const validItems = results.filter(Boolean) as CartItem[];
        setEnrichedItems(validItems);
      } catch (error) {
        console.error('Error fetching guest cart products:', error);
        setEnrichedItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuestCartProducts();
  }, [items, isGuest, API_URL]);

  const totalCartAmount =
    enrichedItems && enrichedItems.length > 0
      ? enrichedItems.reduce(
          (acc, item) =>
            acc +
            (item?.salePrice && item?.salePrice > 0
              ? item?.salePrice
              : item?.price) *
              item?.quantity,
          0
        )
      : null;

  const handleCheckout = () => {
    setOpenCartSheet(false);
    if (isGuest) {
      // Store redirect path and navigate to login
      sessionStorage.setItem('redirectAfterLogin', '/shop/checkout');
      navigate('/auth/login');
    } else {
      navigate('/shop/checkout');
    }
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{isGuest ? "Your Cart (Guest)" : "Your Cart"}</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {/* RENDER ITEMS */}
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading cart items...</p>
        ) : enrichedItems && enrichedItems.length > 0 ? (
          enrichedItems.map((item) => (
            <UserCartItemsContainer 
              key={item.productId || item._id} 
              items={item} 
              isGuest={isGuest}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground">No items in cart</p>
        )}
      </div>
      <div className="mt-8 space-y-4">
        {/* RENDER TOTAL */}
        {enrichedItems.length > 0 && (
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">
              ${(totalCartAmount || 0).toFixed(2)}
            </span>
          </div>
        )}
        <Button
          className="w-full mt-6"
          onClick={handleCheckout}
          disabled={enrichedItems.length === 0}
        >
          {isGuest ? "Sign In to Checkout" : "Checkout"}
        </Button>
        {isGuest && enrichedItems.length > 0 && (
          <p className="text-xs text-center text-muted-foreground">
            Sign in to save your cart and complete your purchase
          </p>
        )}
      </div>
    </SheetContent>
  );
};

export default UserCartWrapper;
