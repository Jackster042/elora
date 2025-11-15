// REACT
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  getFilteredProducts,
  getProductDetails,
} from "@/store/shop/product-slice";
import { addToCart, getCart, addToLocalCart } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { getFeatureImage } from "@/store/shop/common-slice";

// COMPONENTS
import { Button } from "@/components/ui/button";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

// UI
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShirtIcon,
  CloudLightning,
  BabyIcon,
  WatchIcon,
  UmbrellaIcon,
  Bitcoin,
  Blend,
  Blinds,
  Bone,
  Bolt,
  Cherry,
} from "lucide-react";

// IMAGES
import image1 from "../../assets/account.jpg";
import image2 from "../../assets/banner-1.webp";
import image3 from "../../assets/banner-2.webp";
import image4 from "../../assets/banner-3.webp";

interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface Brand {
  id: string;
  label: string;
  icon: React.ElementType;
}

const images = [image1, image2, image3, image4];

const categories: Category[] = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brand: Brand[] = [
  { id: "nike", label: "Nike", icon: Bitcoin },
  { id: "adidas", label: "Adidas", icon: Blend },
  { id: "puma", label: "Puma", icon: Blinds },
  { id: "levi", label: "Levi's", icon: Bone },
  { id: "zara", label: "Zara", icon: Bolt },
  { id: "h&m", label: "H&M", icon: Cherry },
];

const ShoppingHome = () => {
  // SLIDER STATE
  const [currentSlide, setCurrentSlide] = useState(0);
  const [open, setOpen] = useState(false);

  // STORE
  const { products, productDetails } = useSelector(
    (state: RootState) => state.shopProductStore
  );
  const { user } = useSelector((state: RootState) => state.authStore);
  const { featureImageList } = useSelector(
    (state: RootState) => state.commonStore
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavigateToListingPage = (
    getCurrentItem: Category | Brand,
    section: "category" | "brand"
  ) => {
    sessionStorage.removeItem("filters");
    const filteredItems = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(filteredItems));
    setTimeout(() => {
      navigate(`/shop/listing`);
    }, 50);
  };

  const handleGetProductDetails = (id: string) => {
    dispatch(getProductDetails(id));
  };

  const handleAddToCart = (id: string) => {
    // Check if user is authenticated
    if (!user || !user.id) {
      // Add to local storage for guest users
      dispatch(addToLocalCart({ productId: id, quantity: 1 }));
      toast({
        title: "Added to cart",
        description: "Sign in to save your cart and checkout",
      });
      return;
    }

    // Existing authenticated user logic
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

  // TODO: ADD ON HOVER STOP SLIDE
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  // TODO: BUG WITH RERENDERING WHEN SLIDES CHANGE
  useEffect(() => {
    dispatch(
      getFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, []);

  useEffect(() => {
    if (productDetails) {
      setOpen(true);
    }
  }, [productDetails]);

  useEffect(() => {
    dispatch(getFeatureImage());
  }, [dispatch]);

  return (
    <div className="flex flex-col  min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((image, index) => (
            <img
              key={index}
              src={image?.image}
              alt={`Home Image ${index + 1}`}
              className={`${
                index === currentSlide ? "opacity-100" : "opacity-0"
              } absolute inset-0 w-full h-full object-cover transition-opacity duration-1000`}
            />
          ))
        ) : (
          <div>
            <p>No featured images found</p>
          </div>
        )}
        <Button
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + images.length) % images.length
            )
          }
          variant="outline"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
          size="icon"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length)
          }
          variant="outline"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
          size="icon"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      {/* SHOP BY SECTION PART */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                  handleNavigateToListingPage(categoryItem, "category");
                }}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-10 h-10 mb-4 text-primary" />
                  <span className="text-sm font-bold">
                    {categoryItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* BRANDS SECTION */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brand.map((brandItem) => (
              <Card
                key={brandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                  handleNavigateToListingPage(brandItem, "brand");
                }}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-10 h-10 mb-4 text-primary" />
                  <span className="text-sm font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* PRODUCTS SECTION */}

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products && products.length > 0 ? (
            products.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                product={productItem}
                handleGetProductDetails={handleGetProductDetails}
                handleAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <div>
              <p>No products found</p>
            </div>
          )}
        </div>
      </section>
      <ProductDetailsDialog
        open={open}
        setOpen={setOpen}
        productDetails={productDetails}
      />
    </div>
  );
};

export default ShoppingHome;
