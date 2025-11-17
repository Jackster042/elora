import { useState } from "react";
import { X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const DemoBanner = () => {
  const [isVisible, setIsVisible] = useState(() => {
    // Check if user has dismissed the banner in this session
    return !sessionStorage.getItem("demoBannerDismissed");
  });

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("demoBannerDismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Info className="h-5 w-5 flex-shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-semibold text-sm sm:text-base">
              Portfolio Demo Mode:
            </span>
            <span className="text-xs sm:text-sm">
              This is a demonstration e-commerce site. All payments are
              simulated for showcase purposes.
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="flex-shrink-0 hover:bg-yellow-600/20 h-8 w-8 p-0"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DemoBanner;
