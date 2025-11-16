import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const CONSENT_KEY = "elora_cookie_consent";

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm">
          <p className="font-semibold mb-1">🍪 We Value Your Privacy</p>
          <p className="text-muted-foreground">
            We use localStorage to save your shopping cart and improve your browsing experience.
            No personal data is collected or shared with third parties. Your cart data stays on
            your device and is automatically deleted after 30 days.{" "}
            <a
              href="/privacy-policy"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecline}
            className="whitespace-nowrap"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="whitespace-nowrap"
          >
            Accept
          </Button>
        </div>
        <button
          onClick={handleDecline}
          className="absolute top-2 right-2 md:static p-1 hover:bg-gray-100 rounded"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
