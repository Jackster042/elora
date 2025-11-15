// LIBRARIES
import { ArrowUpDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import {
  getFilteredProducts,
  getProductDetails,
} from "@/store/shop/product-slice";

// COMPONENTS
import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShoppingProductTile from "@/components/shopping-view/product-tile";

// CONFIG
import { sortOptions } from "@/config";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { addToCart, getCart, addToLocalCart } from "@/store/shop/cart-slice";
import { localCart } from "@/utils/localCart";
import { useToast } from "@/hooks/use-toast";
interface Product {
  _id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  salePrice: number;
  totalStock: number;
}

interface CartState {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

const createUrlQueryString = (filters: Record<string, string[]>): string => {
  const queryString: string[] = [];

  for (const [key, values] of Object.entries(filters)) {
    if (Array.isArray(values) && values.length > 0) {
      const paramValue = values.join(",");
      queryString.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryString.join("&");
};

const ShoppingListing = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<string | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const dispatch = useDispatch<AppDispatch>();
  const { products, productDetails } = useSelector(
    (state: RootState) => state.shopProductStore
  );
  const { user } = useSelector((state: RootState) => state.authStore);
  const { cartItems } = useSelector(
      (state: RootState) => state.shoppingCartStore
  ) as unknown as { cartItems: CartState };

  const categorySearchParam = searchParams.get("category");

  const handleSort = (value: string | undefined) => {
    setSort(value);
  };

  const handleFilter = (getSectionId: string, getOptionId: string) => {
    if (!getOptionId) return;

    // CHECK IF THE CURRENT INDEX OF CURRENT SECTION IS PRESENT
    const copyFilters: Record<string, string[]> = { ...filters };
    const currentIndex = Object.keys(copyFilters).indexOf(getSectionId);

    if (currentIndex === -1) {
      copyFilters[getSectionId] = [getOptionId];
    } else {
      const currentOptionIndex = copyFilters[getSectionId].indexOf(getOptionId);
      if (currentOptionIndex === -1) {
        copyFilters[getSectionId].push(getOptionId);
      } else {
        copyFilters[getSectionId].splice(currentOptionIndex, 1);
      }
    }

    setFilters(copyFilters);
    sessionStorage.setItem("filters", JSON.stringify(copyFilters));
  };

  const handleGetProductDetails = (id: string) => {
    dispatch(getProductDetails(id));
  };

  const handleAddToCart = (id: string, totalStock: number) => {
    // Check if user is authenticated
    if (!user || !user.id) {
      // Add to local storage for guest users
      const localCartItems = localCart.get();
      const existingItem = localCartItems.find(item => item.productId === id);
      
      if (existingItem && existingItem.quantity + 1 > totalStock) {
        toast({
          title: `Only ${totalStock} can be added to cart`,
          variant: "destructive",
        });
        return;
      }

      dispatch(addToLocalCart({ productId: id, quantity: 1 }));
      toast({
        title: "Added to cart",
        description: "Sign in to save your cart and checkout",
      });
      return;
    }

    // Stock check for authenticated users
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
            variant: "destructive",
          });
        }
      }
    );
  };

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters") || "{}"));
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const queryString = createUrlQueryString(filters);
      setSearchParams(new URLSearchParams(queryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        getFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails) {
      setOpen(true);
    }
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background rounded-lg shadow-sm w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-extrabold">All Products</h2>
          {/* DROPDOWN MENU AND SORT BY DROPDOWN AND NUMBER OF PRODUCTS */}
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {products?.length} products
            </span>
            {/* SORT BY DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              {/* CONTENT */}
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {products && products.length > 0 ? (
            products.map((product: Product) => (
              <ShoppingProductTile
                product={product}
                key={product._id}
                handleGetProductDetails={handleGetProductDetails}
                handleAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>
      <ProductDetailsDialog
        open={open}
        setOpen={setOpen}
        productDetails={productDetails}
      />
    </div>
  );
};

export default ShoppingListing;
