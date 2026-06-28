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
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No avatar file provided." }, { status: 400 });
    }

    // Validation: Allowed MIME types and max size of 5MB
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ message: "File size exceeds the 5MB limit." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ message: "Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG images are allowed." }, { status: 400 });
    }

    // Try sending to the upstream microservice first
    let upstreamSuccess = false;
    let upstreamBody: any = null;
    let upstreamStatus = 200;

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
        upstreamSuccess = true;
        upstreamBody = await upstream.json();
        upstreamStatus = upstream.status;
      }
    } catch (upstreamErr) {
      console.warn("[avatar:POST] Upstream service unreachable.");
    }

    if (upstreamSuccess) {
      return NextResponse.json(upstreamBody, { status: upstreamStatus });
    }

    // Fallback: Perform a real upload of the uploaded image to the cloud (tmpfiles.org)
    // ONLY allowed in non-production environments (or if ENABLE_MOCK_UPLOAD environment variable is true)
    const isMockAllowed = process.env.NODE_ENV !== "production" || process.env.ENABLE_MOCK_UPLOAD === "true";
    if (!isMockAllowed) {
      return NextResponse.json({ message: "Avatar upload failed. Upstream service is unreachable." }, { status: 503 });
    }

    // Dev-only public cloud upload fallback (tmpfiles.org)
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
    return NextResponse.json({
      message: "Avatar upload failed. Upstream and cloud backup services are unreachable."
    }, { status: 500 });
  }
}
