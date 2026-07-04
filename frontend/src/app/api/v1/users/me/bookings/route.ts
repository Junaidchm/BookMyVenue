import { NextRequest, NextResponse } from "next/server";
import { getVenueById } from "@/lib/venues/api";

const BOOKING_SERVICE_URL =
  process.env.BOOKING_SERVICE_URL ?? "http://booking-service:5002";

function getForwardHeaders(req: NextRequest): HeadersInit {
  const authorization = req.headers.get("authorization");
  const correlationId =
    req.headers.get("x-correlation-id") ??
    `gw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    "Content-Type": "application/json",
    ...(authorization ? { Authorization: authorization } : {}),
    "x-correlation-id": correlationId,
    "x-gateway": "bookmyvenue-frontend",
  };
}

export async function GET(req: NextRequest) {
  try {
    const upstream = await fetch(
      `${BOOKING_SERVICE_URL}/bookings`,
      {
        headers: getForwardHeaders(req),
        cache: "no-store",
      }
    );

    if (!upstream.ok) {
      const errorText = await upstream.text();
      return NextResponse.json(
        { success: false, items: [], message: `Upstream error: ${errorText}` },
        { status: upstream.status }
      );
    }

    const body = await upstream.json();

    if (body.success && Array.isArray(body.data)) {
      const enrichedBookings = await Promise.all(
        body.data.map(async (b: any) => {
          try {
            const venue = await getVenueById(b.venueId);
            return {
              ...b,
              venueName: venue?.name || "Unknown Venue",
              venueLocation: venue?.location || "Unknown Location",
              date: b.bookingDate,
              guests: venue?.capacity || 0,
              totalAmount: Number(b.totalPrice),
              status: b.status === "PENDING_PAYMENT" ? "pending" : b.status.toLowerCase(),
            };
          } catch (err) {
            console.error(`Failed to enrich booking ${b.id} with venue details:`, err);
            return {
              ...b,
              venueName: "Venue",
              venueLocation: "Location",
              date: b.bookingDate,
              guests: 0,
              totalAmount: Number(b.totalPrice),
              status: b.status === "PENDING_PAYMENT" ? "pending" : b.status.toLowerCase(),
            };
          }
        })
      );

      return NextResponse.json(
        {
          success: true,
          items: enrichedBookings,
        },
        {
          status: upstream.status,
          headers: {
            "x-correlation-id":
              upstream.headers.get("x-correlation-id") ?? "unknown",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        items: [],
        message: body.message || "Invalid booking data response format from backend.",
      },
      { status: upstream.status }
    );
  } catch (err: any) {
    console.error("[bookings:GET] Upstream error:", err);
    return NextResponse.json(
      { message: "Could not load bookings. Please try again.", items: [] },
      { status: 503 }
    );
  }
}
