import { Router } from 'express';
import { createBooking, handleWebhook, checkAvailability, getBookingById, getBookings } from '../controllers/booking.controller';
import { checkBookingRisk } from '../middlewares/risk.middleware';

const router = Router();

// Define the bookings route
router.get('/', getBookings);
router.get('/availability', checkAvailability);
router.get('/:id', getBookingById);
router.post('/', checkBookingRisk, createBooking);
router.post('/webhook', handleWebhook);

export const bookingRoutes = router;

