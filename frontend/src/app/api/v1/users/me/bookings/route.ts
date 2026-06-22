/**
 * Next.js Route Handler — Bookings API Gateway
 *
 * GET /api/v1/users/me/bookings
 * Proxies to booking-service, returns paginated bookings for the current user.
 */

import { NextRequest, NextResponse } from "next/server";

const BOOKING_SERVICE_URL =
  process.env.BOOKING_SERVICE_URL ?? "http://booking-service:5002";

// Mock bookings list matching profileService parsing format
const MOCK_BOOKINGS = {
  items: [
    {
      id: "b1",
      venueName: "The Glasshouse",
      venueLocation: "Downtown, Lahore",
      date: "2026-07-24T18:00:00.000Z",
      time: "06:00 PM",
      guests: 150,
      status: "confirmed",
      totalAmount: 450000,
      currency: "PKR",
      bookingRef: "BMV-GH-001",
    },
    {
      id: "b2",
      venueName: "Industrial Loft",
      venueLocation: "Gulberg, Lahore",
      date: "2026-08-02T09:00:00.000Z",
      time: "09:00 AM",
      guests: 80,
      status: "pending",
      totalAmount: 280000,
      currency: "PKR",
      bookingRef: "BMV-IL-002",
    },
    {
      id: "b3",
      venueName: "The Glasshouse",
      venueLocation: "Downtown, Lahore",
      date: "2026-05-15T19:00:00.000Z",
      time: "07:00 PM",
      guests: 50,
      status: "completed",
      totalAmount: 120000,
      currency: "PKR",
      bookingRef: "BMV-GH-003",
      rating: 5,
    },
    {
      id: "b4",
      venueName: "Grand Ballroom",
      venueLocation: "DHA, Lahore",
      date: "2026-04-10T14:00:00.000Z",
      time: "02:00 PM",
      guests: 300,
      status: "cancelled",
      totalAmount: 750000,
      currency: "PKR",
      bookingRef: "BMV-GB-004",
    }
  ],
  totalItems: 4,
  page: 1,
  pageSize: 100,
};

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
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "5";

    const upstream = await fetch(
      `${BOOKING_SERVICE_URL}/api/v1/users/me/bookings?page=${page}&pageSize=${pageSize}`,
      {
        headers: getForwardHeaders(req),
        cache: "no-store",
      }
    );

    if (!upstream.ok) {
      throw new Error(`Upstream returned status ${upstream.status}`);
    }

    const body = await upstream.json();

    return NextResponse.json(body, {
      status: upstream.status,
      headers: {
        "x-correlation-id":
          upstream.headers.get("x-correlation-id") ?? "unknown",
      },
    });
  } catch (err) {
    console.warn("[bookings:GET] Upstream service unreachable. Returning mock bookings:", err);
    return NextResponse.json(MOCK_BOOKINGS, {
      status: 200,
      headers: {
        "x-correlation-id": `mock-${Date.now()}`,
      },
    });
  }
}
