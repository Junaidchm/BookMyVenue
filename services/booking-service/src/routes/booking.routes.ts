import { Router } from 'express';
import { createBooking } from '../controllers/booking.controller';
import { checkBookingRisk } from '../middlewares/risk.middleware';

const router = Router();

// Define the bookings route
router.post('/', checkBookingRisk, createBooking);

export const bookingRoutes = router;
