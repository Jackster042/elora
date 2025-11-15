// REACT
import { useNavigate } from "react-router-dom";

// COMPONENTS
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContainer from "./cart-items-container";

// TYPES
import { CartItem } from "../../types";

const UserCartWrapper = ({
  items,
  setOpenCartSheet,
}: {
  items: CartItem[];
  setOpenCartSheet: (open: boolean) => void;
}) => {
  const navigate = useNavigate();

  const totalCartAmount =
    items && items.length > 0
      ? items.reduce(
          (acc, item) =>
            acc +
            (item?.salePrice && item?.salePrice > 0
              ? item?.salePrice
              : item?.price) *
              item?.quantity,
          0
        )
      : null;

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {/* RENDER ITEMS */}
        {items && items.length > 0
          ? items.map((item) => (
              <UserCartItemsContainer key={item._id || ""} items={item} />
            ))
          : "No items in cart"}
      </div>
      <div className="mt-8 space-y-4">
        {/* RENDER TOTAL */}
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">
            ${(totalCartAmount || 0).toFixed(2)}
          </span>
        </div>
        <Button
          className="w-full mt-6"
          onClick={() => {
            setOpenCartSheet(false);
            navigate("/shop/checkout");
          }}
        >
          Checkout
        </Button>
      </div>
    </SheetContent>
  );
};

export default UserCartWrapper;
