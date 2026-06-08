import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import * as jwt from 'jsonwebtoken';

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5003';
const VENUE_SERVICE_URL = process.env.VENUE_SERVICE_URL || 'http://localhost:5001';
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://localhost:5002';

app.use(cors({
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
}));

app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// JWT Middleware
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  
  // Define public route checks (matches /api/auth/login, /api/auth/register, etc.)
  const isPublicRoute = 
    req.path === '/api/auth/login' || 
    req.path === '/api/auth/register' ||
    req.path === '/api/auth/verify' ||
    (req.path === '/api/venues' && req.method === 'GET');

  if (isPublicRoute) {
    return next();
  }

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      (req as any).user = {
        id: decoded.sub,
        roles: decoded.roles || [],
      };
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized: Authentication token required.' });
  }
};

app.use(authenticateJWT);

// Setup Proxies
const createServiceProxy = (targetUrl: string) => {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    // Ensure request body is correctly parsed and rewritten for downstream post requests
    on: {
      proxyReq: (proxyReq, req, res) => {
        fixRequestBody(proxyReq, req);
        if ((req as any).user) {
          proxyReq.setHeader('x-user-id', (req as any).user.id.toString());
          proxyReq.setHeader('x-user-roles', (req as any).user.roles.join(','));
        }
      }
    }
  });
};

app.use('/api/auth', createServiceProxy(AUTH_SERVICE_URL));
app.use('/api/venues', createServiceProxy(VENUE_SERVICE_URL));
app.use('/api/bookings', createServiceProxy(BOOKING_SERVICE_URL));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'api-gateway' });
});

export default app;
