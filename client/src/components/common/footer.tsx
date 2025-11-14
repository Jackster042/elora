import { Link } from "react-router-dom";
import { Flower, Instagram, Twitter, Facebook } from "lucide-react";
import { Separator } from "../ui/separator";

const socialLinks = [
  {
    label: "Instagram",
    url: "https://www.instagram.com",
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    label: "Twitter",
    url: "https://www.twitter.com",
    icon: <Twitter className="w-5 h-5" />,
  },
  {
    label: "Facebook",
    url: "https://www.facebook.com",
    icon: <Facebook className="w-5 h-5" />,
  },
];

const quickLinks = [
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "FAQ", path: "/faq" },
];

const legalLinks = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Service", path: "/terms" },
  { label: "Shipping Policy", path: "/shipping" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-light mb-2">Stay Updated</h3>
              <p className="text-gray-400 text-sm">
                Subscribe to get special offers and updates
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-none text-sm focus:outline-none focus:border-white transition-colors w-full md:w-80"
              />
              <button className="px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors font-medium text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              to="/shop/home"
              className="flex items-center gap-2 group"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Flower className="h-6 w-6 group-hover:rotate-12 transition-transform" />
              <span className="font-light text-2xl tracking-wide">Elora</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Minimalist fashion for the modern lifestyle. Quality pieces that
              speak for themselves.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop/listing"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/listing"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/listing"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator className="bg-gray-800" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Elora. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            Back to top
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
