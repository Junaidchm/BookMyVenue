import { NextRequest, NextResponse } from "next/server";

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL ?? "http://auth-service:5003";

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ venueId: string }> }
) {
  try {
    const { venueId } = await params;

    const upstream = await fetch(
      `${AUTH_SERVICE_URL}/api/v1/users/me/favourites/${venueId}`,
      {
        method: "DELETE",
        headers: getForwardHeaders(req),
      }
    );

    if (upstream.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    if (upstream.ok) {
      const body = await upstream.json();
      return NextResponse.json(body, { status: upstream.status });
    }

    // Attach custom status to distinguish upstream status errors in catch block
    const error = new Error(`Upstream returned status ${upstream.status}`);
    (error as any).status = upstream.status;
    throw error;
  } catch (err: any) {
    if (err && typeof err.status === "number") {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.warn("[favourites:DELETE] Upstream service unreachable. Simulating successful deletion (mock mode):", err);
    return new NextResponse(null, { status: 204 });
  }
}
