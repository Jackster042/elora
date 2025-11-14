import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const StarRatingComponent = ({
  rating,
  handleRatingChange,
}: {
  rating: number;
  handleRatingChange: (rating: number) => void;
}) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          className={`p-2 rounded-full transition-colors ${
            star <= rating
              ? "text-yellow-500 hover:bg-black"
              : "text-black hover:bg-primary hover:text-primary-foreground"
          }`}
          variant="outline"
          size="icon"
          onClick={
            handleRatingChange ? () => handleRatingChange(star) : undefined
          }
        >
          <StarIcon
            className={`${star <= rating ? "fill-yellow-500" : "fill-black"}`}
          />
        </Button>
      ))}
    </div>
  );
};

export default StarRatingComponent;
