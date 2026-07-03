import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVenueById } from "@/lib/venues/api";
import { ReserveClientPage } from "@/components/venues/reserve-client-page";

type ReservePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    date?: string;
    hours?: string;
    startTime?: string;
    sessionIndex?: string;
    total?: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const venue = await getVenueById(id);
  if (!venue) return { title: "Not Found" };
  return {
    title: `Confirm and pay | ${venue.name}`,
  };
}

export default async function ReservePage({ params, searchParams }: ReservePageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const venue = await getVenueById(id);

  if (!venue) {
    notFound();
  }

  return (
    <ReserveClientPage venue={venue} searchParams={resolvedSearchParams} />
  );
}
