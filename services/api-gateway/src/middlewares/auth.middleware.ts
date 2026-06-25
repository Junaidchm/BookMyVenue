import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  
  let tokenError: any = null;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;

      // Validate decoded payload shape
      if (!decoded.sub || typeof decoded.sub !== 'number') {
        tokenError = new Error('Invalid token: missing or invalid subject');
      } else if (!Array.isArray(decoded.roles)) {
        tokenError = new Error('Invalid token: roles must be an array');
      } else {
        (req as any).user = {
          id: decoded.sub,
          roles: decoded.roles,
        };
      }
    } catch (err) {
      tokenError = err;
    }
  }

  // Define public route checks precisely
  const isPublicRoute = 
    req.path === '/health' ||
    req.path === '/api/auth/login' || 
    req.path === '/api/auth/register' ||
    req.path === '/api/auth/verify' ||
    req.path === '/api/auth/logout' ||
    (req.path === '/api/venues' && req.method === 'GET') ||
    (/^\/api\/venues\/\d+$/.test(req.path) && req.method === 'GET');

  if (isPublicRoute) {
    return next();
  }

  if (tokenError) {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid or expired token.' });
  }

  if (!(req as any).user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Authentication token required.' });
  }

  next();
};
