// Shared mock user state for local testing when auth-service is unreachable
export let mockUser = {
  id: "user-123",
  name: "Sarah Jenkins",
  email: "sarah.j@example.com",
  phone: "+92 300 1234567",
  address: "Lahore, Pakistan",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  avatarInitials: "SJ",
  memberSince: "2024-01-15T08:00:00.000Z",
  status: "active",
};

export function updateMockUserAvatar(url: string) {
  mockUser.avatarUrl = url;
}

export function updateMockUser(payload: Partial<typeof mockUser>) {
  mockUser = {
    ...mockUser,
    ...payload,
    ...(payload.name
      ? {
          avatarInitials: payload.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        }
      : {}),
  };
}
