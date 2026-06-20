import { Request, Response, NextFunction } from 'express';

export const requireOwner = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  const userRolesHeader = req.headers['x-user-roles'] as string;

  if (!userRolesHeader) {
    return res.status(403).json({
      success: false,
      message:
        'Forbidden: Access restricted to venue owners (missing role context).',
    });
  }

  // Gateway injects roles as a comma-separated string (e.g., "OWNER,USER")
  const roles = userRolesHeader.split(',').map((r) => r.trim().toUpperCase());

  if (!roles.includes('OWNER')) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Access restricted to venue owners.',
    });
  }

  next();
};
