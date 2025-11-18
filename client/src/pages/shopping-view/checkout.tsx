// REACT
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// HOOKS
import { toast } from "@/hooks/use-toast";

// ASSETS
import imgAccount from "../../assets/account.jpg";

// COMPONENTS
import { Button } from "@/components/ui/button";
import Address from "@/components/shopping-view/address";
import UserCartItemsContainer from "@/components/shopping-view/cart-items-container";
import DemoPaymentModal from "@/components/common/demo-payment-modal";

// REDUX
import { AppDispatch } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { createNewOrder, capturePayment, resetOrderState } from "@/store/order-slice";
import { getCart, mergeGuestCart } from "@/store/shop/cart-slice";
import { localCart } from "@/utils/localCart";

const ShoppingCheckout = () => {
  const [currentSelectedAddress, setCurrentSelectedAddress] =
    useState<any>(null);
  const [isPaymentStarted, setIsPaymentStarted] = useState<boolean>(false);
  const [showDemoPaymentModal, setShowDemoPaymentModal] =
    useState<boolean>(false);

  const { approvalURL, isDemo, orderId } = useSelector(
    (state: any) => state.orderStore
  );
  const { cartItems } = useSelector((state: any) => state.shoppingCartStore);
  const { user, isAuthenticated } = useSelector(
    (state: any) => state.authStore
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Protect checkout - require authentication
  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem("redirectAfterLogin", "/shop/checkout");
      navigate("/auth/login");
      return;
    }

    // Merge guest cart if exists
    const hasLocalCart = localCart.hasItems();
    if (hasLocalCart && user?.id) {
      dispatch(mergeGuestCart(user.id)).then(() => {
        dispatch(getCart(user.id));
        toast({
          title: "Cart merged",
          description: "Your cart items have been synced",
        });
      });
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (acc: number, item: any) =>
            acc +
            (item?.salePrice && item?.salePrice > 0
              ? item?.salePrice
              : item?.price) *
              item?.quantity,
          0
        )
      : null;

  const handleInitiatePaypalPayment = () => {
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (!currentSelectedAddress) {
      toast({
        title: "Please select an address to proceed",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user.id,
      cartId: cartItems._id,
      cartItems: cartItems.items.map((item: any) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress._id,
        address: currentSelectedAddress.address,
        city: currentSelectedAddress.city,
        pincode: currentSelectedAddress.pincode,
        phone: currentSelectedAddress.phone,
        notes: currentSelectedAddress.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymentStarted(true);
        // If demo mode, show modal instead of redirecting
        if (data?.payload?.isDemo) {
          // Small delay to ensure modal shows properly
          setTimeout(() => {
            setShowDemoPaymentModal(true);
          }, 100);
        }
        // For non-demo mode, the useEffect will handle redirect
      } else {
        setIsPaymentStarted(false);
        toast({
          title: "Error",
          description: data?.payload?.message,
        });
      }
    });
  };

  const handleDemoPaymentSuccess = (paymentId: string, payerId: string) => {
    if (orderId) {
      dispatch(
        capturePayment({
          orderId: orderId,
          paymentId,
          payerId,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          // Fetch updated cart (should be empty after successful order)
          dispatch(getCart(user.id));
          toast({
            title: "Payment Successful!",
            description: "Your demo order has been placed successfully.",
          });
          // Navigate to home page
          setTimeout(() => {
            navigate("/shop/home");
          }, 1500);
        } else {
          toast({
            title: "Error",
            description: "Failed to capture demo payment",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleDemoPaymentError = () => {
    toast({
      title: "Payment Failed",
      description: "Demo payment simulation failed. Please try again.",
      variant: "destructive",
    });
    setIsPaymentStarted(false);
    setShowDemoPaymentModal(false);
  };

  const handleCloseModal = () => {
    setShowDemoPaymentModal(false);
    setIsPaymentStarted(false);
    dispatch(resetOrderState());
  };

  // Handle real PayPal redirect (only for non-demo mode)
  useEffect(() => {
    console.log("[CHECKOUT] useEffect triggered:", {
      approvalURL,
      isDemo,
      isPaymentStarted,
      showDemoPaymentModal,
    });

    // Only redirect if we have an approval URL, it's not demo mode, and payment has started
    if (approvalURL && !isDemo && isPaymentStarted) {
      console.log("[CHECKOUT] Redirecting to PayPal:", approvalURL);
      window.location.href = approvalURL;
    } else if (approvalURL && isDemo) {
      console.log(
        "[CHECKOUT] Demo mode detected, showing modal instead of redirecting"
      );
    } else {
      console.log("[CHECKOUT] No redirect conditions met");
    }
  }, [approvalURL, isDemo, isPaymentStarted]);

  return (
    <Fragment>
      {/* Demo Payment Modal */}
      <DemoPaymentModal
        isOpen={showDemoPaymentModal}
        onClose={handleCloseModal}
        onSuccess={handleDemoPaymentSuccess}
        onError={handleDemoPaymentError}
        totalAmount={totalCartAmount || 0}
      />

      <div className="flex flex-col">
        {/* CHECKOUT HEADER */}
        <div className="relative w-full h-[300px] object-cover overflow-hidden">
          <img
            src={imgAccount}
            alt="account"
            className="w-full h-full object-cover"
          />
        </div>
        {/* CHECKOUT BODY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 p-5">
          {/* ADDRESS */}
          <Address
            selectedId={setCurrentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
          {/* CART ITEMS */}
          <div className="flex flex-col gap-4">
            {cartItems && cartItems.items && cartItems.items.length > 0 ? (
              cartItems.items.map((item: any) => (
                <UserCartItemsContainer key={item._id || ""} items={item} />
              ))
            ) : (
              <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">No items in cart</h1>
                <p className="text-gray-500">
                  Add items to your cart to continue
                </p>
              </div>
            )}
            {/* ORDER SUMMARY */}
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
                onClick={handleInitiatePaypalPayment}
                disabled={isPaymentStarted}
              >
                {/* Continue to PayPal */}
                {isPaymentStarted ? "Processing..." : "Continue to Payment"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ShoppingCheckout;
