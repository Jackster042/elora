import { Navigate, useLocation } from "react-router-dom";
interface CheckAuthProps {
  isAuthenticated: boolean;
  user: any;
  children: React.ReactNode;
}

function CheckAuth({ isAuthenticated, user, children }: CheckAuthProps) {
  const location = useLocation();

  const publicRoutes = ["/shop/home", "/shop/listing", "/shop/search"];
  const isPublicRoute = publicRoutes.some((route) =>
    location.pathname.includes(route)
  );

  // Allow the auth pages to render during the authentication process
  if (location.pathname.includes("/auth/")) {
    if (isAuthenticated && user) {
      // Check for post-login redirect
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        return <Navigate to={redirectPath} />;
      }
      
      // Default redirects based on role
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
    return <>{children}</>;
  }

  // Redirecting to shop
  if (location.pathname === "/") {
    if (isAuthenticated && user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/shop/home" />;
  }

  // Public routes allowed
  if (isPublicRoute) {
    // If authenticated admin tries to access shop, redirect to admin dashboard
    if (isAuthenticated && user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
    return <>{children}</>;
  }

  // Protected routes ( checkout, account, admin )
  if (!isAuthenticated) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/auth/login" />;
  }

  // Role-based access checks
  if (user?.role !== "admin" && location.pathname.includes("/admin")) {
    return <Navigate to="/unauth-page" />;
  }

  if (user?.role === "admin" && location.pathname.includes("/shop")) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
