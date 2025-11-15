// REDUX
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/shop/cart-slice";

// HOOKS & UI
import { PlusIcon, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { MinusIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// TYPES
import { CartItem } from "@/types";

const UserCartItemsContainer = ({ items }: { items: CartItem }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.authStore);
  const { cartItems } = useSelector(
    (state: RootState) => state.shoppingCartStore
  );
  const { products } = useSelector(
    (state: RootState) => state.shopProductStore
  );

  const handleCartItemDelete = (item: CartItem) => {
    dispatch(removeFromCart({ userId: user?.id, productId: item?.productId }));
  };

  const handleUpdateQuantity = ({
    items,
    typeOfAction,
  }: {
    items: CartItem;
    typeOfAction: "plus" | "minus";
    totalStock: number;
  }) => {
    if (typeOfAction === "plus") {
      const getCartItems = cartItems?.items || [];
      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item: CartItem) => item.productId === items?.productId
        );

        const getCurrentProductIndex = products.findIndex(
          (product: any) => product._id === items?.productId
        );
        const getTotalStock = products[getCurrentProductIndex].totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getTotalStock} can be added to cart`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }

    dispatch(
      updateQuantity({
        userId: user?.id,
        productId: items?.productId,
        quantity:
          typeOfAction === "plus" ? items?.quantity + 1 : items?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success === true) {
        toast({
          title: "Quantity updated successfully",
          description: "Quantity updated successfully",
        });
      } else {
        toast({
          title: "Quantity update failed",
          description: "Quantity update failed",
        });
      }
    });
  };

  // Find the product to get totalStock
  const currentProduct = products.find(
    (product: any) => product._id === items.productId
  );
  const totalStock = currentProduct?.totalStock || 0;

  console.log(cartItems, "cartItems");

  return (
    <div className="flex items-center space-x-4">
      <img
        src={items?.image}
        alt={items?.title}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{items.title}</h3>
        <div className="flex items-center mt-1 gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full"
            disabled={items?.quantity === 1}
            onClick={() =>
              handleUpdateQuantity({ items, typeOfAction: "minus", totalStock })
            }
          >
            <MinusIcon className="w-4 h-4" />
            <span className="sr-only">minus</span>
          </Button>
          <span>{items.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full"
            onClick={() =>
              handleUpdateQuantity({ items, typeOfAction: "plus", totalStock })
            }
          >
            <PlusIcon className="w-4 h-4" />
            <span className="sr-only">plus</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (items?.salePrice > 0 ? items.salePrice : items.price) *
            items.quantity
          )
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(items)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
};

export default UserCartItemsContainer;
