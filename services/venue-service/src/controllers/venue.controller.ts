import { Request, Response, NextFunction } from 'express';
import { VenueService, CreateVenueDto } from '../services/venue.service';

export class VenueController {
  private venueService: VenueService;

  constructor() {
    this.venueService = new VenueService();
  }

  /**
   * GET /venues
   * Returns all approved venues.
   */
  getAllVenues = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const venues = await this.venueService.getAllVenues();

      res.status(200).json({
        success: true,
        data: venues,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /venues/:id
   * Returns a specific venue by ID.
   */
  getVenueById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const venueId = parseInt(req.params.id as string, 10);
      if (isNaN(venueId)) {
        res
          .status(400)
          .json({ success: false, message: 'Invalid venue ID format' });
        return;
      }

      const venue = await this.venueService.getVenueById(venueId);

      if (!venue) {
        res.status(404).json({ success: false, message: 'Venue not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: venue,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * POST /venues
   * Creates a new venue.
   */
  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const userIdStr = req.headers['x-user-id'] as string;
      const ownerId = parseInt(userIdStr, 10);

      if (isNaN(ownerId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing user identity context.',
        });
      }

      const venue = await this.venueService.createVenue(
        ownerId,
        req.body as CreateVenueDto,
      );

      return res.status(201).json({
        success: true,
        data: venue,
      });
    } catch (error) {
      next(error);
    }
  };
}
