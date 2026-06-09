import { Request, Response, NextFunction } from 'express';
import { VenueService } from '../services/venue.service';

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
}
