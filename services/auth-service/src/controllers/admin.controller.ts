import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';

export class AdminController {
  private usersService = new UsersService();

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRoles = req.headers['x-user-roles'] as string;
      if (!userRoles?.includes('ADMIN')) {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required.' });
      }

      const users = await this.usersService.findAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (err: any) {
      next(err);
    }
  };
}
