import { getApiBaseUrl } from "@/lib/api/config";

// ─── Types ──────────────────────────────────────────────────────────────────

export type PendingVenueAmenity = {
  amenity: {
    name: string;
    iconKey: string | null;
  };
};

export type PendingVenueCapacity = {
  maxPeople: number;
  type: string;
};

export type PendingVenue = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  basePrice: string | number;
  pricingType: "PER_HOUR" | "PER_SESSION";
  imageUrls: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  ownerId: number;
  createdAt: string;
  amenities: PendingVenueAmenity[];
  capacities: PendingVenueCapacity[];
};

type AdminVenuesResponse = {
  success: boolean;
  data: PendingVenue[];
};

export type AdminUser = {
  id: number;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  userRoles: { role: { name: string } }[];
  ownerProfile?: {
    phoneNumber?: string;
    businessName?: string;
  } | null;
};

type AdminUsersResponse = {
  success: boolean;
  data: AdminUser[];
};

type AdminVenueActionResponse = {
  success: boolean;
  message: string;
  data: { id: number; status: string };
};

// ─── Auth Helper ─────────────────────────────────────────────────────────────

/**
 * Reads the JWT from localStorage and returns Authorization headers.
 * The key 'bmv_token' is shared across the app for token storage.
 */
function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("bmv_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── API Calls ───────────────────────────────────────────────────────────────

/**
 * Fetch all venues with PENDING status.
 * Requires the caller to be authenticated as ADMIN.
 */
export async function getPendingVenues(): Promise<PendingVenue[]> {
  const res = await fetch(`${getApiBaseUrl()}/api/admin/venues/pending`, {
    credentials: "include",
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? "Failed to fetch pending venues"
    );
  }

  const body = (await res.json()) as AdminVenuesResponse;
  return body.data ?? [];
}

/**
 * Approve a venue by ID.
 */
export async function approveVenue(id: number): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/api/admin/venues/${id}/approve`, {
    method: "PATCH",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? "Failed to approve venue"
    );
  }
}

/**
 * Reject a venue by ID.
 */
export async function rejectVenue(id: number): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/api/admin/venues/${id}/reject`, {
    method: "PATCH",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? "Failed to reject venue"
    );
  }
}

/**
 * Fetch all users for the admin dashboard.
 */
export async function getUsers(): Promise<AdminUser[]> {
  const res = await fetch(`${getApiBaseUrl()}/api/admin/users`, {
    credentials: "include",
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? "Failed to fetch users"
    );
  }

  const body = (await res.json()) as AdminUsersResponse;
  return body.data ?? [];
}

