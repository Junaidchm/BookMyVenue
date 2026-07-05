import { env } from '../config/env';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
}

export class AuthClient {
  private static baseUrl = env.AUTH_SERVICE_URL;

  /**
   * Fetches user profile details by user ID from auth-service.
   * Internal endpoint, requires passing ADMIN role context to bypass gateway JWT checks.
   */
  static async getUser(userId: string): Promise<UserProfile | null> {
    try {
      const url = `${this.baseUrl}/admin/users/${userId}`;
      const response = await fetch(url, {
        headers: {
          'x-user-roles': 'ADMIN',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(
          `Auth service returned status ${response.status} for user ${userId}`,
        );
      }

      const body = (await response.json()) as { success: boolean; data: any };
      return body.success ? body.data : null;
    } catch (err) {
      console.error(`Error querying auth service for user ${userId}:`, err);
      // Fail gracefully: don't crash the entire booking list if auth-service is temporarily down
      return null;
    }
  }
}
