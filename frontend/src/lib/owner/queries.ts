import { useQuery } from "@tanstack/react-query";
import { getOwnerDashboardData } from "./api";

export function useOwnerDashboard(venueIds: string[]) {
  return useQuery({
    queryKey: ["ownerDashboard", venueIds],
    queryFn: () => getOwnerDashboardData(venueIds),
    enabled: venueIds.length > 0,
    refetchInterval: 60000, // Refresh every minute
  });
}
