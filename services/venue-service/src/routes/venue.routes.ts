import { Router } from 'express';
import { requireOwner } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createVenueSchema } from '../validators/venue.validator';
import { VenueController } from '../controllers/venue.controller';

const router = Router();
const controller = new VenueController();

router.post('/', requireOwner, validate(createVenueSchema), controller.create);
router.get('/', controller.getAllVenues);
router.get('/:id', controller.getVenueById);

export default router;
