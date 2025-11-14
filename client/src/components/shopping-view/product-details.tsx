// UI
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Dialog, DialogContent } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";

// STORE
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getCart } from "@/store/shop/cart-slice";
import { addToCart } from "@/store/shop/cart-slice";
import { RootState, AppDispatch } from "@/store/store";
import { setProductDetails } from "@/store/shop/product-slice";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import StarRatingComponent from "../common/star-rating";
import { Label } from "../ui/label";

interface ProductDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  productDetails: any;
}

const ProductDetailsDialog = ({
  open,
  setOpen,
  productDetails,
}: ProductDetailsDialogProps) => {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  const { user } = useSelector((state: RootState) => state.authStore);
  const { cartItems } = useSelector(
    (state: RootState) => state.shoppingCartStore
  );
  const { reviews } = useSelector((state: RootState) => state.reviewStore);

  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // HANDLE RATING CHANGE
  const handleRatingChange = (getRating: number) => {
    setRating(getRating);
  };

  // HANDLE ADD TO CART
  const handleAddToCart = (id: string, totalStock: number) => {
    if (!user || !user.id) {
      alert("Please log in to add items to cart");
      return;
    }

    const getCartItems = cartItems || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item: any) => item.productId === id
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > totalStock) {
          toast({
            title: `Only ${totalStock} can be added to cart`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(addToCart({ userId: user.id, productId: id, quantity: 1 })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(getCart(user.id));
          toast({
            title: "Item added to cart",
            description: "You can view your cart in the cart page",
          });
        } else {
          toast({
            title: "Item not added to cart",
            description: "Please try again",
          });
        }
      }
    );
  };

  const handleCloseDialog = () => {
    dispatch(setProductDetails());
    setOpen(false);
    setReviewMsg("");
    setRating(0);
  };

  // HANDLE ADD REVIEW
  const handleAddReview = () => {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        reviewMessage: reviewMsg,
        reviewValue: rating,
        userName: user?.userName,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully",
          description: "You can view your review in the review page",
        });
      } else {
        toast({
          title: "Review not added",
          description: "Please try again",
        });
      }
    });
  };

  // AVERAGE REVIEW RATING
  const averageReviewRating =
    reviews && reviews?.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem?.reviewValue, 0) /
        reviews.length
      : 0;

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square object-cover w-full"
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-bold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-3xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent
                rating={averageReviewRating}
                handleRatingChange={() => {}}
              />
            </div>
            <span className="text-muted-foreground">
              {averageReviewRating.toFixed(2)}
            </span>
          </div>
          <div className="mb-5 mt-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full" disabled>
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full mt-5"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem: any) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent
                          rating={reviewItem?.reviewValue}
                          handleRatingChange={() => {}}
                        />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem?.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <h1>No reviews yet</h1>
                </div>
              )}

              <div className="mt-10 flex-col flex gap-2">
                <Label className="font-bold text-lg">Add a review</Label>
                <div className="flex items-center gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Add a review"
                    value={reviewMsg}
                    name="reviewMsg"
                    onChange={(e) => setReviewMsg(e.target.value)}
                  />
                  <Button
                    className="w-1/2"
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === ""}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
