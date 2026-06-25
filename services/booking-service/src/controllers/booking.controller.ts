import { Request, Response } from 'express';

export const createBooking = async (req: Request, res: Response): Promise<any> => {
  try {
    const userIdStr = req.headers['x-user-id'] as string;
    const { venueId, bookingDate, startTime, endTime, totalPrice } = req.body;

    // Simulate successful booking creation
    const newBooking = {
      id: Math.floor(Math.random() * 10000),
      userId: parseInt(userIdStr, 10),
      venueId,
      bookingDate,
      startTime,
      endTime,
      totalPrice,
      status: 'CONFIRMED',
      riskScore: (req as any).riskScore // Access risk score injected by middleware
    };

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
