import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthService, JwtPayload } from '../services/auth.service';
import { UsersService } from '../services/users.service';

export class AuthController {
  private authService = new AuthService();
  private usersService = new UsersService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, fullName, roles } = req.body;
      const user = await this.authService.register(
        email,
        password,
        fullName,
        roles,
      );
      res.status(201).json({ success: true, data: user });
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        res.status(409).json({ success: false, message: err.message });
      } else {
        next(err);
      }
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      console.error('[LOGIN ERROR]:', err);
      // Normalize error to ensure it has a string message
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (
        errorMessage.includes('Invalid email or password') ||
        errorMessage.includes('must be provided')
      ) {
        res.status(401).json({ success: false, message: errorMessage });
      } else {
        res.status(500).json({
          success: false,
          message:
            'Database connection failed. Please ensure the database is running.',
        });
      }
    }
  };

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let jwtToken = req.body?.token;

      const authHeader = req.headers['authorization'];
      if (!jwtToken && authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
          jwtToken = parts[1];
        }
      }

      if (!jwtToken) {
        return res.status(401).json({
          success: false,
          message: 'Token must be provided in body or Authorization header.',
        });
      }

      const payload = this.authService.verifyToken(jwtToken);
      res.status(200).json({ success: true, data: payload });
    } catch (err: any) {
      res.status(401).json({ success: false, message: err.message });
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIdStr = req.headers['x-user-id'] as string;
      if (!userIdStr) {
        return res
          .status(401)
          .json({ success: false, message: 'User context missing.' });
      }
      const userId = userIdStr;

      const {
        phoneNumber,
        businessName,
        bankRoutingNumber,
        bankAccountNumber,
      } = req.body;
      const profile = await this.usersService.updateOwnerProfile(userId, {
        phoneNumber,
        businessName,
        bankRoutingNumber,
        bankAccountNumber,
      });

      res.status(200).json({ success: true, data: profile });
    } catch (err: any) {
      next(err);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIdStr = req.headers['x-user-id'] as string;
      if (!userIdStr) {
        return res
          .status(401)
          .json({ success: false, message: 'User context missing.' });
      }
      const userId = userIdStr;

      const user = await this.usersService.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found.' });
      }

      const roles = user.userRoles.map((ur: any) => ur.role.name);
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: roles,
        isKycVerified: user.isKycVerified,
        accountCreatedAt: user.createdAt.toISOString(),
      };

      const token = jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
      } as jwt.SignOptions);

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          roles: roles,
          access_token: token,
          ownerProfile: user.ownerProfile || {
            phoneNumber: '',
            businessName: '',
            bankRoutingNumber: '',
            bankAccountNumber: '',
          },
        },
      });
    } catch (err: any) {
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
    } catch (err: any) {
      next(err);
    }
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, fullName, roles, checkOnly } = req.body;

      // ── checkOnly mode: just probe whether the account exists ──
      if (checkOnly === true) {
        if (!email) {
          return res.status(400).json({ success: false, message: 'Email is required.' });
        }
        const existing = await this.usersService.findByEmail(email);
        return res.status(200).json({ success: true, exists: !!existing });
      }

      if (!email || !fullName) {
        return res.status(400).json({
          success: false,
          message: 'Email and fullName are required.',
        });
      }
      const result = await this.authService.googleLogin(
        email,
        fullName,
        roles || ['USER'],
      );
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        res.status(409).json({ success: false, message: err.message });
      } else {
        next(err);
      }
    }
  };

  /**
   * POST /auth/google/check
   * Checks whether a Google-authenticated email already has an account.
   * Used by the Next.js jwt callback to decide whether to show the
   * role-select interstitial (new user) or sign in directly (returning user).
   */
  checkGoogleUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
      }
      const user = await this.usersService.findByEmail(email);
      res.status(200).json({ success: true, exists: !!user });
    } catch (err: any) {
      next(err);
    }
  };

  becomeOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIdStr = req.headers['x-user-id'] as string;
      if (!userIdStr) {
        return res
          .status(401)
          .json({ success: false, message: 'User context missing.' });
      }
      const userId = userIdStr;

      const {
        phoneNumber,
        businessName,
        bankRoutingNumber,
        bankAccountNumber,
      } = req.body;

      const profile = await this.usersService.becomeOwner(userId, {
        phoneNumber,
        businessName,
        bankRoutingNumber,
        bankAccountNumber,
      });

      res.status(200).json({ success: true, data: profile });
    } catch (err: any) {
      next(err);
    }
  };
}
