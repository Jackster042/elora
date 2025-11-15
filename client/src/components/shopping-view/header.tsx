// React
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useEffect } from "react";

// Icons
import { Flower, LogOut, Menu, ShoppingCart, User } from "lucide-react";

// UI
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logoutUser } from "@/store/auth-slice";
import { AppDispatch } from "@/store/store";

// Config
import { shoppingViewHeaderMenuItems } from "@/config";
import { useState } from "react";
import UserCartWrapper from "./cart-wrapper";
import { getCart } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { getFilteredProducts } from "@/store/shop/product-slice";

const MenuItems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  function handleNavigate(getCurrentMenuItem: any) {
    // For home link, just navigate
    if (getCurrentMenuItem.id === "home") {
      navigate(getCurrentMenuItem.path);
      return;
    }
    if (getCurrentMenuItem.id === "search") {
      navigate(getCurrentMenuItem.path);
      return;
    }

    // For products link, ensure we clear filters and force a new API call
    if (getCurrentMenuItem.id === "products") {
      sessionStorage.removeItem("filters");
      if (location.pathname.includes("listing")) {
        dispatch(
          getFilteredProducts({
            filterParams: {},
            sortParams: "price-lowtohigh",
          })
        );
        setSearchParams(new URLSearchParams());
      } else {
        navigate(getCurrentMenuItem.path);
      }
      return;
    }

    // For other links (categories)
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    if (currentFilter) {
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    }

    if (location.pathname.includes("listing")) {
      if (currentFilter) {
        // @ts-ignore
        setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        );
      } else {
        // @ts-ignore
        setSearchParams(new URLSearchParams());
      }
    } else {
      navigate(getCurrentMenuItem.path);
    }
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => {
            handleNavigate(menuItem);
          }}
          key={menuItem.id}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <span>{menuItem.label}</span>
        </Label>
      ))}
    </nav>
  );
};

const HeaderRightContent = () => {
  const { user } = useSelector((state: RootState) => state.authStore);
  const { cartItems } = useSelector(
      (state: RootState) => state.shoppingCartStore
  );

  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    dispatch(getCart(user.id));
  }, [dispatch, user.id]);

  // cartItems is already in the correct format from backend
  const items = cartItems?.items || [];


  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4 cursor-pointer">
      {/* CART BUTTON */}
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenCartSheet(true)}
          className="relative"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
            {items?.length || 0}
          </span>
          <span className="sr-only">user cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          items={items}
        />
      </Sheet>
      {/* USER DROPDOWN MENU */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        {/* USER DROPDOWN MENU CONTENT */}
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <User className="h-4 w-4 mr-2" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ShoppingHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* LEFT SIDE - LOGO */}
        <Link to="/shop/home" className="flex items-center gap-2">
          <Flower className="h-6 w-6" />
          <span className="font-bold">Elora</span>
        </Link>

        {/* SHEET */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-xs flex flex-col justify-between "
          >
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>

          {/* MENU ITEMS */}
          <div className="hidden lg:block">
            <MenuItems />
          </div>
        </Sheet>

        {/* AUTHENTICATED USER */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
