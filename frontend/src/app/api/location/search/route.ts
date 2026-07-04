import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache to save Nominatim requests
const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // Cache TTL: 10 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query || query.trim().length < 3) {
    return NextResponse.json([], { status: 200 });
  }

  // Check in-memory cache
  const cached = cache.get(query);
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, max-age=600, s-maxage=600",
      },
    });
  }

  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;
    const response = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "BookMyVenue-App/1.0 (contact@bookmyvenue.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim upstream failed with status ${response.status}`);
    }

    const data = await response.json();

    // Store in cache
    cache.set(query, {
      data,
      expiry: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=600, s-maxage=600",
      },
    });
  } catch (error) {
    console.error("Error proxying lookup request to Nominatim:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
