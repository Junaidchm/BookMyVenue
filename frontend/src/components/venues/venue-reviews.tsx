import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { VenueReview } from "@/lib/venues/data";

type VenueReviewsProps = {
  reviews: VenueReview[];
};

export function VenueReviews({ reviews }: VenueReviewsProps) {
  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <Card
          key={review.author}
          className="gap-0 rounded-xl border border-stone-100 bg-surface py-0 shadow-sm"
        >
          <CardContent className="flex flex-col gap-3 p-6">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 bg-surface-variant">
                <AvatarFallback className="bg-surface-variant font-bold text-brand-muted">
                  {review.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-label-md text-on-surface">{review.author}</p>
                <p className="text-label-sm text-text-muted">{review.date}</p>
              </div>
            </div>
            <p className="text-body-md leading-relaxed text-on-surface-variant">
              &ldquo;{review.text}&rdquo;
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
