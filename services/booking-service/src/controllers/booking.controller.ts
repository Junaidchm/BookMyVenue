import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/prisma';
import { RiskScoringService } from '../services/risk-scoring.service';

// Helper to run serializable transaction with retries
const runSerializableTransaction = async <T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
  retries = 3,
): Promise<T> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await prisma.$transaction(fn, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error: any) {
      // P2034: transaction failed due to write conflict or serialization failure
      const isSerializationFailure =
        error.code === 'P2034' || error.message?.includes('40001');
      if (isSerializationFailure && attempt < retries) {
        console.warn(
          `[CONCURRENCY] Serialization conflict on attempt ${attempt}. Retrying...`,
        );
        // Jittered backoff delay before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 100),
        );
        continue;
      }
      throw error;
    }
  }
  throw new Error('Transaction failed after maximum retries');
};

export const createBooking = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const userIdStr = req.headers['x-user-id'] as string;
    if (!userIdStr) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized: User ID is missing' });
    }
    const userId = userIdStr;
    const { venueId, bookingDate, startTime, endTime, totalPrice } = req.body;

    if (!venueId || !bookingDate || !startTime || !endTime || !totalPrice) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required booking fields' });
    }

    const parsedVenueId = venueId;
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid start or end time' });
    }

    // Execute serializable transaction
    const newBooking = await runSerializableTransaction(async (tx) => {
      // 1. The Overlap Check (The Bouncer):
      // SELECT * FROM Bookings WHERE venueId = X AND startDate < RequestedEnd AND endDate > RequestedStart
      // AND (status = 'CONFIRMED' OR (status = 'PENDING_PAYMENT' AND createdAt >= 10 minutes ago))
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      const overlappingBookings = await tx.booking.findMany({
        where: {
          venueId: parsedVenueId,
          startTime: { lt: end },
          endTime: { gt: start },
          OR: [
            { status: 'CONFIRMED' },
            {
              status: 'PENDING_PAYMENT',
              createdAt: { gte: tenMinutesAgo },
            },
          ],
        },
      });

      if (overlappingBookings.length > 0) {
        throw new Error('SLOT_OCCUPIED');
      }

      // Calculate refund percentage policy based on riskScore
      const riskScore = (req as any).riskScore || 0;
      let refundPercentage = 100.0;
      if (riskScore >= 85) {
        refundPercentage = 0.0; // non-refundable
      } else if (riskScore >= 40) {
        refundPercentage = 50.0; // reduced refund (50%)
      }

      // 2. The Soft Lock: Create the booking with status PENDING_PAYMENT
      // Give the user exactly 10 minutes to finish the payment.
      return await tx.booking.create({
        data: {
          userId,
          venueId: parsedVenueId,
          bookingDate: new Date(bookingDate),
          startTime: start,
          endTime: end,
          totalPrice: new Prisma.Decimal(totalPrice),
          status: 'PENDING_PAYMENT',
          riskScore,
          refundPercentage: new Prisma.Decimal(refundPercentage),
        },
      });
    });

    // Update risk cache asynchronously in the background
    RiskScoringService.updateCache(userId).catch((err) =>
      console.error(
        `[RISK CACHE] Failed to update cache for user ${userId} after booking creation:`,
        err,
      ),
    );

    const { riskScore: _, ...bookingData } = newBooking;

    return res.status(201).json({
      success: true,
      message:
        'Booking request created successfully. Please complete your payment within 10 minutes.',
      data: bookingData,
    });
  } catch (error: any) {
    if (error.message === 'SLOT_OCCUPIED') {
      return res.status(409).json({
        success: false,
        message:
          'The requested time slot is already booked or held for payment by another user.',
      });
    }

    console.error('Error creating booking:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * Webhook handler to confirm a booking on successful payment.
 * Supports Stripe or Razorpay format payloads.
 */
export const handleWebhook = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { event, data } = req.body;

    console.log(
      `[PAYMENT WEBHOOK] Received event: ${event}`,
      JSON.stringify(data),
    );

    // Handle payment succeeded events
    // Usually Stripe uses event: 'payment_intent.succeeded' or 'charge.succeeded' or 'checkout.session.completed'
    // Razorpay uses event: 'payment.captured'
    // We will support simple payment succeeded events, or accept any if matched
    const isSuccessEvent =
      event === 'payment.succeeded' ||
      event === 'payment_intent.succeeded' ||
      event === 'charge.succeeded' ||
      event === 'checkout.session.completed' ||
      event === 'payment.captured';

    if (!isSuccessEvent) {
      return res.status(200).json({ received: true, status: 'ignored_event' });
    }

    // Extract bookingId and paymentId
    // Standardize finding the bookingId and paymentId from body:
    let bookingId = data?.bookingId;
    const paymentId = data?.paymentId || data?.id; // Stripe checkout session id, charge id or payment intent id

    // If metadata contains bookingId, use it
    if (data?.metadata?.bookingId) {
      bookingId = String(data.metadata.bookingId);
    } else if (data?.object?.metadata?.bookingId) {
      bookingId = String(data.object.metadata.bookingId);
    }

    if (!bookingId) {
      console.error('[PAYMENT WEBHOOK] Missing bookingId in payload');
      return res
        .status(400)
        .json({ success: false, message: 'Missing bookingId' });
    }

    const parsedBookingId = String(bookingId);

    // Find the booking to get its userId for cache updating
    const bookingToConfirm = await prisma.booking.findUnique({
      where: { id: parsedBookingId },
    });

    if (!bookingToConfirm) {
      return res.status(404).json({
        success: false,
        message: `Booking with ID ${parsedBookingId} not found`,
      });
    }

    if (bookingToConfirm.status !== 'PENDING_PAYMENT') {
      if (bookingToConfirm.status === 'CONFIRMED') {
        console.log(
          `[PAYMENT WEBHOOK] Booking ${parsedBookingId} was already confirmed`,
        );
        return res
          .status(200)
          .json({ success: true, message: 'Booking already confirmed' });
      }
      console.warn(
        `[PAYMENT WEBHOOK] Booking ${parsedBookingId} status is ${bookingToConfirm.status}, cannot confirm.`,
      );
      return res.status(400).json({
        success: false,
        message: `Booking status is ${bookingToConfirm.status}, cannot be confirmed.`,
      });
    }

    // Hard Lock: Update status from PENDING_PAYMENT to CONFIRMED
    await prisma.booking.update({
      where: { id: parsedBookingId },
      data: {
        status: 'CONFIRMED',
        paymentId: paymentId ? String(paymentId) : `pay_mock_${Date.now()}`,
        paymentMetadata: data || {},
      },
    });

    // Update risk cache asynchronously in the background
    RiskScoringService.updateCache(bookingToConfirm.userId).catch((err) =>
      console.error(
        `[RISK CACHE] Failed to update cache for user ${bookingToConfirm.userId} after webhook confirmation:`,
        err,
      ),
    );

    console.log(
      `[PAYMENT WEBHOOK] Booking ${parsedBookingId} hard-locked (status updated to CONFIRMED).`,
    );
    return res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully',
    });
  } catch (error) {
    console.error('[PAYMENT WEBHOOK] Error handling webhook:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

export const checkAvailability = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { venueId, startTime, endTime } = req.query;

    if (!venueId || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required query parameters: venueId, startTime, endTime',
      });
    }

    const parsedVenueId = venueId as string;
    const start = new Date(startTime as string);
    const end = new Date(endTime as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid start or end time' });
    }

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const overlappingBookings = await prisma.booking.findMany({
      where: {
        venueId: parsedVenueId,
        startTime: { lt: end },
        endTime: { gt: start },
        OR: [
          { status: 'CONFIRMED' },
          {
            status: 'PENDING_PAYMENT',
            createdAt: { gte: tenMinutesAgo },
          },
        ],
      },
    });

    return res.status(200).json({
      success: true,
      available: overlappingBookings.length === 0,
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const parsedId = id as string;

    if (!parsedId) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parsedId },
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }

    const { riskScore: _, ...bookingData } = booking;
    return res.status(200).json({
      success: true,
      data: bookingData,
    });
  } catch (error) {
    console.error('Error fetching booking by id:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

export const getBookings = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const userIdStr = req.headers['x-user-id'] as string;
    if (!userIdStr) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized: User ID is missing' });
    }
    const userId = userIdStr;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const bookingsData = bookings.map(({ riskScore: _, ...b }) => b);
    return res.status(200).json({
      success: true,
      data: bookingsData,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const userIdStr = req.headers['x-user-id'] as string;
    if (!userIdStr) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized: User ID is missing' });
    }
    const userId = userIdStr;
    const parsedId = id as string;

    if (!parsedId) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parsedId },
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }

    // Authorization Check: User must own the booking
    if (booking.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to cancel this booking',
      });
    }

    // Check status: Can only cancel CONFIRMED or PENDING_PAYMENT bookings
    if (booking.status === 'CANCELLED') {
      return res
        .status(400)
        .json({ success: false, message: 'Booking is already cancelled' });
    }
    if (booking.status === 'FAILED') {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot cancel a failed booking' });
    }

    // Business Rule: Cancellations not allowed within 24 hours of booking start
    const now = new Date();
    const timeDiff = booking.startTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      return res.status(400).json({
        success: false,
        message:
          'Cancellations are not allowed within 24 hours of the booking start time to protect venue business.',
      });
    }

    // Calculate Refund
    const refundPct = Number(booking.refundPercentage);
    const refundAmount = (Number(booking.totalPrice) * refundPct) / 100;

    // Update booking status to CANCELLED
    const updatedBooking = await prisma.booking.update({
      where: { id: parsedId },
      data: {
        status: 'CANCELLED',
      },
    });

    const { riskScore: _, ...updatedBookingData } = updatedBooking;
    return res.status(200).json({
      success: true,
      message: `Booking cancelled successfully. Refund of ₹${refundAmount.toFixed(2)} (${refundPct}% of ₹${Number(booking.totalPrice).toFixed(2)}) will be processed.`,
      data: {
        booking: updatedBookingData,
        refundAmount,
        refundPercentage: refundPct,
      },
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

export const rescheduleBooking = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const userIdStr = req.headers['x-user-id'] as string;
    if (!userIdStr) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized: User ID is missing' });
    }
    const userId = userIdStr;
    const parsedId = id as string;
    const { bookingDate, startTime, endTime } = req.body;

    if (!bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message:
          'Missing required rescheduling parameters: bookingDate, startTime, endTime',
      });
    }

    if (!parsedId) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parsedId },
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }

    // Authorization Check: User must own the booking
    if (booking.userId !== userId) {
      return res.status(403).json({
        success: false,
        message:
          'Forbidden: You do not have permission to reschedule this booking',
      });
    }

    // Check status: Can only reschedule CONFIRMED or PENDING_PAYMENT bookings
    if (booking.status === 'CANCELLED' || booking.status === 'FAILED') {
      return res.status(400).json({
        success: false,
        message: `Cannot reschedule a ${booking.status.toLowerCase()} booking`,
      });
    }

    // Business Rule: Rescheduling not allowed within 24 hours of booking start
    const now = new Date();
    const timeDiff = booking.startTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      return res.status(400).json({
        success: false,
        message:
          'Rescheduling is not allowed within 24 hours of the booking start time.',
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid new start or end time' });
    }

    // Ensure the new date is in the future
    if (start.getTime() <= now.getTime()) {
      return res.status(400).json({
        success: false,
        message: 'New booking time must be in the future',
      });
    }

    // Check overlap for the new timeslot (excluding this booking itself)
    const newBooking = await runSerializableTransaction(async (tx) => {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      const overlappingBookings = await tx.booking.findMany({
        where: {
          venueId: booking.venueId,
          id: { not: parsedId }, // Exclude the current booking
          startTime: { lt: end },
          endTime: { gt: start },
          OR: [
            { status: 'CONFIRMED' },
            {
              status: 'PENDING_PAYMENT',
              createdAt: { gte: tenMinutesAgo },
            },
          ],
        },
      });

      if (overlappingBookings.length > 0) {
        throw new Error('SLOT_OCCUPIED');
      }

      return await tx.booking.update({
        where: { id: parsedId },
        data: {
          bookingDate: new Date(bookingDate),
          startTime: start,
          endTime: end,
        },
      });
    });

    const { riskScore: _, ...newBookingData } = newBooking;
    return res.status(200).json({
      success: true,
      message: 'Booking rescheduled successfully.',
      data: newBookingData,
    });
  } catch (error: any) {
    if (error.message === 'SLOT_OCCUPIED') {
      return res.status(409).json({
        success: false,
        message:
          'The requested new time slot is already booked or held for payment by another user.',
      });
    }
    console.error('Error rescheduling booking:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};
