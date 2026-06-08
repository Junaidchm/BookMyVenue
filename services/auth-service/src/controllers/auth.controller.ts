import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

export class AuthController {
  private authService = new AuthService();
  private usersService = new UsersService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, fullName, roles } = req.body;
      const user = await this.authService.register(email, password, fullName, roles);
      res.status(201).json(user);
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        res.status(409).json({ message: err.message });
      } else {
        res.status(400).json({ message: err.message });
      }
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(401).json({ message: err.message });
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
          message: 'Token must be provided in body or Authorization header.',
        });
      }

      const payload = this.authService.verifyToken(jwtToken);
      res.status(200).json(payload);
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // User ID can come from custom header injected by gateway
      const userIdStr = req.headers['x-user-id'] as string;
      if (!userIdStr) {
        return res.status(401).json({ message: 'User context missing.' });
      }
      const userId = parseInt(userIdStr, 10);

      const { phoneNumber, businessName, bankRoutingNumber, bankAccountNumber } = req.body;
      const profile = await this.usersService.updateOwnerProfile(userId, {
        phoneNumber,
        businessName,
        bankRoutingNumber,
        bankAccountNumber,
      });

      res.status(200).json(profile);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
}
