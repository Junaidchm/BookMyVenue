import axios from 'axios';
import { prisma } from '../prisma/prisma';
import { env } from '../config/env';

interface RiskScoreResult {
  score: number;
  factors: {
    cancellationRate: number;
    accountTrust: number;
    concurrentBookings: number;
    paymentTrust: number;
  };
}

export class RiskScoringService {
  /**
   * Evaluates the risk score of a booking request
   * @param userId The ID of the user making the booking
   * @param targetDate The date the user is trying to book
   */
  async calculateRiskScore(userId: number, targetDate: Date): Promise<RiskScoreResult> {
    // 1. Fetch User Data from Auth Service
    let accountAgeHours = 0;
    let isKycVerified = false;

    try {
      // Fetch specific user details from Auth Service
      const response = await axios.get(`${env.AUTH_SERVICE_URL}/admin/users/${userId}`, {
        headers: { 'x-user-roles': 'ADMIN' }, // Internal call using admin privilege
        timeout: 5000 // 5 seconds timeout
      });
      
      const user = response.data?.data;
      
      if (user) {
        isKycVerified = !!user.isKycVerified;
        const createdAt = new Date(user.createdAt);
        accountAgeHours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
      } else {
        // Fallback if user not found: high risk
        accountAgeHours = 0;
        isKycVerified = false;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.warn(`User with ID ${userId} not found in Auth Service. Defaulting to high risk.`);
        accountAgeHours = 0;
        isKycVerified = false;
      } else {
        console.error(`Auth Service connection failed when checking user ${userId}:`, error.message);
        // Safe fallback: Treat as a standard unverified user with 7 days account age (moderate risk)
        accountAgeHours = 168; // 7 days
        isKycVerified = false;
      }
    }

    // 2. Fetch User Booking History from DB
    const history = await prisma.booking.findMany({
      where: { userId }
    });

    const totalBookings = history.length;
    const cancelledBookings = history.filter(b => b.status === 'CANCELLED').length;
    const completedBookings = history.filter(b => b.status === 'CONFIRMED').length;

    // Calculate total spend
    const totalSpend = history
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + Number(b.totalPrice), 0);

    // 3. Fetch Concurrent Bookings for the target date
    // Normalize targetDate to start and end of day
    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const concurrentBookings = await prisma.booking.count({
      where: {
        userId,
        bookingDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          not: 'CANCELLED'
        }
      }
    });

    // --- Factor 1: Cancellation Rate (Weight: 0.35) ---
    // Severity 0: User completes 90%+ of bookings.
    // Severity 100: User cancels > 50% of bookings.
    let cancellationSeverity = 50; // Default medium if not enough data
    if (totalBookings >= 3) {
      const cancellationRate = cancelledBookings / totalBookings;
      if (cancellationRate >= 0.5) {
        cancellationSeverity = 100;
      } else if (cancellationRate <= 0.1) {
        cancellationSeverity = 0;
      } else {
        // Interpolate between 10% (0) and 50% (100)
        cancellationSeverity = ((cancellationRate - 0.1) / 0.4) * 100;
      }
    } else {
      cancellationSeverity = 30; // Mild risk for new users
    }

    // --- Factor 2: Account Trust Profile (Weight: 0.25) ---
    // Severity 0: Account age > 6 months (4320 hours) OR has isKycVerified: true
    // Severity 100: Account age < 48 hours AND isKycVerified: false
    let accountTrustSeverity = 50;
    if (isKycVerified || accountAgeHours > 4320) {
      accountTrustSeverity = 0;
    } else if (accountAgeHours < 48 && !isKycVerified) {
      accountTrustSeverity = 100;
    }

    // --- Factor 3: Concurrent Bookings (Weight: 0.20) ---
    // Severity 0: 1 to 2 bookings for the same target date.
    // Severity 80: 3 or more bookings requested for the exact same target date.
    let concurrentSeverity = 0;
    const requestedConcurrent = concurrentBookings + 1; // including the one being evaluated
    if (requestedConcurrent >= 3) {
      concurrentSeverity = 80;
    }

    // --- Factor 4: Payment Trust History (Weight: 0.20) ---
    // Severity 0: High total historical spend (let's say >= 1000).
    // Severity 100: Zero historical spend / first-time transaction.
    let paymentTrustSeverity = 100;
    if (totalSpend >= 1000) {
      paymentTrustSeverity = 0;
    } else if (totalSpend > 0) {
      // Interpolate between 0 (100) and 1000 (0)
      paymentTrustSeverity = 100 - (totalSpend / 1000) * 100;
    }

    // Calculate final score
    const finalScore = 
      (0.35 * cancellationSeverity) +
      (0.25 * accountTrustSeverity) +
      (0.20 * concurrentSeverity) +
      (0.20 * paymentTrustSeverity);

    return {
      score: Math.round(finalScore),
      factors: {
        cancellationRate: cancellationSeverity,
        accountTrust: accountTrustSeverity,
        concurrentBookings: concurrentSeverity,
        paymentTrust: paymentTrustSeverity
      }
    };
  }
}
