import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "../common/footer";
import { CookieConsent } from "../common/cookie-consent";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

export default ShoppingLayout;
