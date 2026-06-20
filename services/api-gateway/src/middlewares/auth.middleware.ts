import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  
  // Define public route checks (matches /api/auth/login, /api/auth/register, etc.)
  const isPublicRoute = 
    req.path === '/health' ||
    req.path === '/api/auth/login' || 
    req.path === '/api/auth/register' ||
    req.path === '/api/auth/verify' ||
    req.path === '/api/auth/logout' ||
    (req.path.startsWith('/api/venues') && req.method === 'GET');

  if (isPublicRoute) {
    return next();
  }

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      (req as any).user = {
        id: decoded.sub,
        roles: decoded.roles || [],
      };
      next();
    } catch (err) {
      return res.status(403).json({ success: false, message: 'Forbidden: Invalid or expired token.' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Unauthorized: Authentication token required.' });
  }
};
