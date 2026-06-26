import { Router } from 'express';
import { createBooking, handleWebhook } from '../controllers/booking.controller';
import { checkBookingRisk } from '../middlewares/risk.middleware';

const router = Router();

// Define the bookings route
router.post('/', checkBookingRisk, createBooking);
router.post('/webhook', handleWebhook);

export const bookingRoutes = router;
