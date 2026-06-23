import { queryOptions } from "@tanstack/react-query";

import { getVenues } from "@/lib/venues/api";
import { venueKeys } from "@/lib/venues/keys";

export function venuesQueryOptions() {
  return queryOptions({
    queryKey: venueKeys.list(),
    queryFn: getVenues,
  });
}
