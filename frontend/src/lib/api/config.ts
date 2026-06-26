const DEFAULT_API_URL = "http://localhost:8000";

export function getApiBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  url = url.replace(/\/$/, "");
  if (!url.endsWith("/api")) {
    url += "/api";
  }
  return url;
}
