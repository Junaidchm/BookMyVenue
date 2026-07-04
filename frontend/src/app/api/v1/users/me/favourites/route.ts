import { NextRequest, NextResponse } from "next/server";

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL ?? "http://auth-service:5003";

// Mock saved/favourite venues matching FavouritesSection parsing format
const MOCK_FAVOURITES = [
  {
    id: "v1",
    name: "Skyline Rooftop Terrace",
    location: "Gulberg, Lahore",
    gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    category: "Rooftop",
    rating: 4.9,
    reviewCount: 42,
    capacity: 200,
    pricePerDay: 250000,
    currency: "PKR",
  },
  {
    id: "v2",
    name: "The Glasshouse",
    location: "Downtown, Lahore",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    category: "Banquet",
    rating: 4.8,
    reviewCount: 128,
    capacity: 500,
    pricePerDay: 450000,
    currency: "PKR",
  },
  {
    id: "v3",
    name: "Industrial Loft",
    location: "DHA Phase 5, Lahore",
    gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    category: "Studio",
    rating: 4.7,
    reviewCount: 35,
    capacity: 100,
    pricePerDay: 180000,
    currency: "PKR",
  },
];

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
    const upstream = await fetch(`${AUTH_SERVICE_URL}/api/v1/users/me/favourites`, {
      headers: getForwardHeaders(req),
      cache: "no-store",
    });

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
    console.warn("[favourites:GET] Upstream service unreachable. Returning mock saved venues:", err);
    return NextResponse.json(MOCK_FAVOURITES, {
      status: 200,
      headers: {
        "x-correlation-id": `mock-${Date.now()}`,
      },
    });
  }
}
