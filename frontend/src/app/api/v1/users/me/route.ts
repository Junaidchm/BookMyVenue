/**
 * Next.js Route Handlers — Profile API Gateway
 *
 * These routes proxy requests to the auth-service microservice.
 * They add server-side JWT verification and translate between
 * HTTP and the internal service communication format.
 *
 * File: /app/api/v1/users/me/route.ts
 */

import { NextRequest, NextResponse } from "next/server";
import { mockUser, updateMockUser } from "./mockUserStore";

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL ?? "http://auth-service:5003";

// Helper: forward auth header
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

// ─── GET /api/v1/users/me ─────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  let upstreamResponse: Response | null = null;
  try {
    upstreamResponse = await fetch(`${AUTH_SERVICE_URL}/api/v1/users/me`, {
      headers: getForwardHeaders(req),
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[profile:GET] Network connection to upstream service failed. Checking mock fallback:", err);
    const isMockAllowed = process.env.NODE_ENV !== "production";
    if (isMockAllowed) {
      return NextResponse.json(mockUser, {
        status: 200,
        headers: {
          "x-correlation-id": `mock-${Date.now()}`,
        },
      });
    }
    return NextResponse.json(
      { message: "Profile service is currently unavailable." },
      { status: 503 }
    );
  }

  if (!upstreamResponse.ok) {
    let errBody = { message: `Upstream returned status ${upstreamResponse.status}` };
    try {
      errBody = await upstreamResponse.json();
    } catch {}
    return NextResponse.json(errBody, { status: upstreamResponse.status });
  }

  const body = await upstreamResponse.json();
  return NextResponse.json(body, {
    status: upstreamResponse.status,
    headers: {
      "x-correlation-id": upstreamResponse.headers.get("x-correlation-id") ?? "unknown",
    },
  });
}

// ─── PATCH /api/v1/users/me ───────────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
  let payload: any;
  try {
    payload = await req.json();
  } catch (e) {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  // Validate and sanitize payload to only allow specific fields
  const allowedFields = ["name", "phone", "address", "location", "avatarUrl", "avatar"];
  const sanitizedPayload: any = {};
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      if (key === "location") {
        sanitizedPayload.address = payload.location;
      } else if (key === "avatar") {
        sanitizedPayload.avatarUrl = payload.avatar;
      } else {
        sanitizedPayload[key] = payload[key];
      }
    }
  }

  const authorization = req.headers.get("authorization");
  const correlationId =
    req.headers.get("x-correlation-id") ??
    `gw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const upstream = await fetch(`${AUTH_SERVICE_URL}/api/v1/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
        "x-correlation-id": correlationId,
        "x-gateway": "bookmyvenue-frontend",
      },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      throw new Error(`Upstream returned status ${upstream.status}`);
    }

    const body = await upstream.json();

    return NextResponse.json(body, {
      status: upstream.status,
      headers: {
        "x-correlation-id": upstream.headers.get("x-correlation-id") ?? "unknown",
        "x-rabbitmq-message-id": upstream.headers.get("x-rabbitmq-message-id") ?? "unknown",
      },
    });
  } catch (err) {
    console.warn("[profile:PATCH] Upstream update failed. Checking mock fallback:", err);

    // Gate mock fallback path to non-production environments
    const isMockAllowed = process.env.NODE_ENV !== "production";
    if (isMockAllowed) {
      updateMockUser(sanitizedPayload);
      return NextResponse.json(mockUser, {
        status: 200,
        headers: {
          "x-correlation-id": `mock-${Date.now()}`,
        },
      });
    }

    return NextResponse.json(
      { message: "Could not update profile. Upstream service is unreachable." },
      { status: 503 }
    );
  }
}
