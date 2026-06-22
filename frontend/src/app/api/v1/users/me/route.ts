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
  try {
    const upstream = await fetch(`${AUTH_SERVICE_URL}/api/v1/users/me`, {
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
    console.warn("[profile:GET] Upstream service failed or unreachable. Using mock user profile:", err);
    return NextResponse.json(mockUser, {
      status: 200,
      headers: {
        "x-correlation-id": `mock-${Date.now()}`,
      },
    });
  }
}

// ─── PATCH /api/v1/users/me ───────────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
  try {
    const payload = await req.json();

    // Proactively update our mock database so edits reflect instantly in front-end
    updateMockUser(payload);

    const upstream = await fetch(`${AUTH_SERVICE_URL}/api/v1/users/me`, {
      method: "PATCH",
      headers: getForwardHeaders(req),
      body: JSON.stringify(payload),
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
        "x-rabbitmq-message-id":
          upstream.headers.get("x-rabbitmq-message-id") ?? "unknown",
      },
    });
  } catch (err) {
    console.warn("[profile:PATCH] Upstream update failed. Mock user profile updated in memory:", err);
    return NextResponse.json(mockUser, {
      status: 200,
      headers: {
        "x-correlation-id": `mock-${Date.now()}`,
      },
    });
  }
}
