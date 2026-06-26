import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/prisma';

// Helper to run serializable transaction with retries
const runSerializableTransaction = async <T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
  retries = 3
): Promise<T> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await prisma.$transaction(fn, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error: any) {
      // P2034: transaction failed due to write conflict or serialization failure
      const isSerializationFailure = error.code === 'P2034' || error.message?.includes('40001');
      if (isSerializationFailure && attempt < retries) {
        console.warn(`[CONCURRENCY] Serialization conflict on attempt ${attempt}. Retrying...`);
        // Jittered backoff delay before retrying
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Transaction failed after maximum retries');
};

export const createBooking = async (req: Request, res: Response): Promise<any> => {
  try {
    const userIdStr = req.headers['x-user-id'] as string;
    if (!userIdStr) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User ID is missing' });
    }
    const userId = parseInt(userIdStr, 10);
    const { venueId, bookingDate, startTime, endTime, totalPrice } = req.body;

    if (!venueId || !bookingDate || !startTime || !endTime || !totalPrice) {
      return res.status(400).json({ success: false, message: 'Missing required booking fields' });
    }

    const parsedVenueId = parseInt(venueId, 10);
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ success: false, message: 'Invalid start or end time' });
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
      let refundPercentage = 100.00;
      if (riskScore >= 85) {
        refundPercentage = 0.00; // non-refundable
      } else if (riskScore >= 40) {
        refundPercentage = 50.00; // reduced refund (50%)
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

    return res.status(201).json({
      success: true,
      message: 'Booking request created successfully. Please complete your payment within 10 minutes.',
      data: {
        ...newBooking,
        riskScore: (req as any).riskScore // Access risk score injected by middleware
      }
    });

  } catch (error: any) {
    if (error.message === 'SLOT_OCCUPIED') {
      return res.status(409).json({
        success: false,
        message: 'The requested time slot is already booked or held for payment by another user.'
      });
    }

    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * Webhook handler to confirm a booking on successful payment.
 * Supports Stripe or Razorpay format payloads.
 */
export const handleWebhook = async (req: Request, res: Response): Promise<any> => {
  try {
    const { event, data } = req.body;

    console.log(`[PAYMENT WEBHOOK] Received event: ${event}`, JSON.stringify(data));

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
    let paymentId = data?.paymentId || data?.id; // Stripe checkout session id, charge id or payment intent id

    // If metadata contains bookingId, use it
    if (data?.metadata?.bookingId) {
      bookingId = parseInt(data.metadata.bookingId, 10);
    } else if (data?.object?.metadata?.bookingId) {
      bookingId = parseInt(data.object.metadata.bookingId, 10);
    }

    if (!bookingId) {
      console.error('[PAYMENT WEBHOOK] Missing bookingId in payload');
      return res.status(400).json({ success: false, message: 'Missing bookingId' });
    }

    const parsedBookingId = typeof bookingId === 'string' ? parseInt(bookingId, 10) : bookingId;

    // Hard Lock: Update status from PENDING_PAYMENT to CONFIRMED
    const updatedBooking = await prisma.booking.updateMany({
      where: {
        id: parsedBookingId,
        status: 'PENDING_PAYMENT'
      },
      data: {
        status: 'CONFIRMED',
        paymentId: paymentId ? String(paymentId) : `pay_mock_${Date.now()}`,
        paymentMetadata: data || {}
      }
    });

    if (updatedBooking.count === 0) {
      // Check if booking was already confirmed or cancelled/expired
      const existingBooking = await prisma.booking.findUnique({
        where: { id: parsedBookingId }
      });

      if (!existingBooking) {
        return res.status(404).json({ success: false, message: `Booking with ID ${parsedBookingId} not found` });
      }

      if (existingBooking.status === 'CONFIRMED') {
        console.log(`[PAYMENT WEBHOOK] Booking ${parsedBookingId} was already confirmed`);
        return res.status(200).json({ success: true, message: 'Booking already confirmed' });
      }

      console.warn(`[PAYMENT WEBHOOK] Booking ${parsedBookingId} status is ${existingBooking.status}, cannot confirm.`);
      return res.status(400).json({ 
        success: false, 
        message: `Booking status is ${existingBooking.status}, cannot be confirmed.` 
      });
    }

    console.log(`[PAYMENT WEBHOOK] Booking ${parsedBookingId} hard-locked (status updated to CONFIRMED).`);
    return res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully'
    });

  } catch (error) {
    console.error('[PAYMENT WEBHOOK] Error handling webhook:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
