import { Router } from 'express';
import { VenueController } from '../controllers/venue.controller';

const router = Router();
const controller = new VenueController();

router.get('/', controller.getAllVenues);
router.get('/:id', controller.getVenueById);

export default router;
