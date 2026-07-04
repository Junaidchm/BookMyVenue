/**
 * Next.js Route Handler — Avatar Upload
 *
 * POST /api/v1/users/me/avatar
 * Forwards multipart form data to auth-service, or uploads directly to
 * a free cloud file sharing service (tmpfiles.org) as a mock fallback.
 */

import { NextRequest, NextResponse } from "next/server";
import { updateMockUserAvatar } from "../mockUserStore";

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL ?? "http://auth-service:5003";

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get("authorization");
    const correlationId =
      req.headers.get("x-correlation-id") ??
      `gw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const formData = await req.formData();

    // Try sending to the upstream microservice first
    try {
      const upstream = await fetch(`${AUTH_SERVICE_URL}/api/v1/users/me/avatar`, {
        method: "POST",
        headers: {
          ...(authorization ? { Authorization: authorization } : {}),
          "x-correlation-id": correlationId,
          "x-gateway": "bookmyvenue-frontend",
        },
        body: formData,
      });

      if (upstream.ok) {
        const body = await upstream.json();
        return NextResponse.json(body, { status: upstream.status });
      }
    } catch (upstreamErr) {
      console.warn("[avatar:POST] Upstream service unreachable. Falling back to direct cloud mock upload.");
    }

    // Fallback: Perform a real upload of the uploaded image to the cloud (tmpfiles.org)
    const file = formData.get("avatar") as File | null;
    if (!file) {
      return NextResponse.json({ message: "No avatar file provided." }, { status: 400 });
    }

    const tmpFormData = new FormData();
    tmpFormData.append("file", file);

    const cloudResponse = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: tmpFormData,
    });

    if (!cloudResponse.ok) {
      throw new Error(`Cloud upload service returned status ${cloudResponse.status}`);
    }

    const result = await cloudResponse.json();

    if (result.status !== "success" || !result.data?.url) {
      throw new Error("Cloud upload response was unsuccessful.");
    }

    // Convert the viewer URL to a direct file access/download URL
    const rawUrl: string = result.data.url;
    const downloadUrl = rawUrl.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");

    console.log("[avatar:POST] Successfully uploaded to cloud. URL:", downloadUrl);

    // Update the mock user state so the profile details reflect the new cloud URL
    updateMockUserAvatar(downloadUrl);

    return NextResponse.json({
      avatarUrl: downloadUrl,
      message: "Avatar uploaded successfully to cloud (Mock Mode)"
    }, { status: 200 });

  } catch (err: any) {
    console.error("[avatar:POST] Cloud upload failed:", err);
    // Ultimate fallback if even the cloud service is down
    const defaultUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80";
    updateMockUserAvatar(defaultUrl);
    return NextResponse.json({
      avatarUrl: defaultUrl,
      message: "Avatar upload simulated using placeholder due to service error."
    }, { status: 200 });
  }
}
