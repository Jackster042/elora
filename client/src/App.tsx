import '@/api/config';
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// AUTH
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/Login";
import AuthRegister from "./pages/auth/Register";

// ADMIN
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminFeatures from "./pages/admin-view/features";
import AdminOrders from "./pages/admin-view/orders";

// SHOPPING
import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingHome from "./pages/shopping-view/home";
import PayPalSuccess from "./pages/shopping-view/paypal-success";
import PayPalReturn from "./pages/shopping-view/paypal-return";
import SearchProducts from "./pages/shopping-view/search";

// NOT FOUND
import NotFound from "./pages/not-found";
import { Skeleton } from "@/components/ui/skeleton";

// UNAUTH
import UnauthPage from "./pages/unauth-page";
import CheckAuth from "./components/common/check-auth";

// REDUX
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { checkAuth } from "./store/auth-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  // USER
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.authStore
  );

  // CHECK AUTH
  React.useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="w-[100px] h-[20px] rounded-full bg-gray-200" />
      </div>
    );
  }

  // ROUTER
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AuthLayout />
        </CheckAuth>
      ),
    },
    {
      path: "/auth",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AuthLayout />
        </CheckAuth>
      ),
      children: [
        {
          path: "login",
          element: <AuthLogin />,
        },
        {
          path: "register",
          element: <AuthRegister />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AdminLayout />
        </CheckAuth>
      ),
      children: [
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "products", element: <AdminProducts /> },
        { path: "orders", element: <AdminOrders /> },
        { path: "features", element: <AdminFeatures /> },
      ],
    },
    {
      path: "/shop",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <ShoppingLayout />
        </CheckAuth>
      ),
      children: [
        { path: "home", element: <ShoppingHome /> },
        { path: "listing", element: <ShoppingListing /> },
        { path: "checkout", element: <ShoppingCheckout /> },
        { path: "account", element: <ShoppingAccount /> },
        { path: "paypal-return", element: <PayPalReturn /> },
        { path: "paypal-success", element: <PayPalSuccess /> },
        { path: "search", element: <SearchProducts /> },
      ],
    },
    {
      path: "/unauth-page",
      element: <UnauthPage />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return (
    <div className="h-full bg-white">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
