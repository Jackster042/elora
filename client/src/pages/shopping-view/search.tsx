// REACT
import { Fragment, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

// UTILS
import { toast } from "@/hooks/use-toast";

// COMPONENTS
import { Input } from "@/components/ui/input";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { Separator } from "@/components/ui/separator";

// REDUX
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { getProductDetails } from "@/store/shop/product-slice";
import { addToCart, getCart } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";

const SearchProducts = () => {
  const [keyword, setKeyword] = useState("");
  const [  ,setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state: RootState) => state.authStore);
  const { cartItems }: { cartItems: any } = useSelector(
    (state: RootState) => state.shoppingCartStore
  );
  const { productDetails } = useSelector(
    (state: RootState) => state.shopProductStore
  );
  const { searchResults } = useSelector(
    (state: RootState) => state.searchStore
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleGetProductDetails = (getCurrentProductId: string) => {
    dispatch(getProductDetails(getCurrentProductId));
  };

  const handleAddToCart = (id: string, totalStock: number) => {
    if (!user || !user.id) {
      alert("Please log in to add items to cart");
      return;
    }

    const getCartItems = cartItems?.items || [];
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

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  return (
    <Fragment>
      <div className="container mx-auto min-h-[calc(100vh-10rem)] py-8 px-4 md:px-6">
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full lg:w-3/4">
            <Input
              name="keyword"
              placeholder="Search for products"
              className="py-6"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />
          </div>
        </div>
        {!searchResults.length ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-5xl font-extrabold">No result found!</h1>
            <div className="flex flex-col items-center justify-center pt-56">
              <p className="text-2xl font-semibold">Need help?</p>
              <span className="gap-8">
                <Link to="/shop/listing" className=" text-blue-500">
                  Visit our help section
                </Link>{" "}
                or{" "}
                <Link to="/contact" className=" text-blue-500">
                  contact us
                </Link>
              </span>
            </div>
            <Separator className="w-full mt-8" />
            <div className="flex flex-col items-center justify-center gap-5 mt-4">
              <h3 className="text-2xl font-thin">
                See personalized recommendations
              </h3>
              <Button className="w-full rounded-md text-black bg-yellow-300 hover:bg-yellow-400 hover:text-white cursor-pointer mb-5">
                Shop now
              </Button>
            </div>
            <Separator className="w-full mb-4" />
            <div className="flex flex-row justify-between items-center gap-40">
              <span className="text-sm font-italic">
                <i>
                  After viewing product detail pages, look here to find an easy
                  way to navigate back to pages you are interested in.
                </i>
              </span>
              <Link
                to="/shop/listing"
                className="text-sm underline text-blue-500"
              >
                View or edit your browsing history
              </Link>
            </div>
          </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((item) => (
            <ShoppingProductTile
              product={item}
              handleGetProductDetails={handleGetProductDetails}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
        <ProductDetailsDialog
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />
      </div>
    </Fragment>
  );
};

export default SearchProducts;
