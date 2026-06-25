import { Request, Response, NextFunction } from 'express';
import { RiskScoringService } from '../services/risk-scoring.service';

const riskScoringService = new RiskScoringService();

export const checkBookingRisk = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userIdStr = req.headers['x-user-id'] as string;
    if (!userIdStr) {
      return res.status(401).json({ success: false, message: 'Unauthorized. User context missing.' });
    }

    const userId = parseInt(userIdStr, 10);
    
    // Fallback target date to now if not provided, assuming booking is for today or upcoming
    const targetDateStr = req.body.bookingDate || req.body.startTime;
    const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();

    const riskResult = await riskScoringService.calculateRiskScore(userId, targetDate);

    // Attach risk score to the request for logging or later use
    (req as any).riskScore = riskResult.score;
    (req as any).riskFactors = riskResult.factors;

    if (riskResult.score > 75) {
      console.warn(`[RISK ENGINE] High Risk Booking Blocked! User ID: ${userId}, Score: ${riskResult.score}`);
      return res.status(403).json({
        success: false,
        status: 'manual_review_required',
        message: 'Your booking request requires manual review. Please contact support.',
        riskScore: riskResult.score
      });
    }

    if (riskResult.score >= 40) {
      console.info(`[RISK ENGINE] Medium Risk Booking Challenged. User ID: ${userId}, Score: ${riskResult.score}`);
      return res.status(403).json({
        success: false,
        message: 'Additional verification required for this booking.',
        challenge: {
          kyc_required: true,
          increased_deposit_required: true
        },
        riskScore: riskResult.score
      });
    }

    // Low Risk: Pass to next()
    console.info(`[RISK ENGINE] Low Risk Booking Approved. User ID: ${userId}, Score: ${riskResult.score}`);
    next();
  } catch (error) {
    console.error('[RISK ENGINE] Error calculating risk score:', error);
    // Fail-open or Fail-closed? Let's fail-closed for security or pass to next for robustness? 
    // Usually risk engines fail-open to not block legit users if the engine is down, but we will pass to error handler.
    next(error);
  }
};
