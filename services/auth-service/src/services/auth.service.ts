import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: number;
  email: string;
  fullName: string;
  roles: string[];
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class AuthService {
  private usersService = new UsersService();

  /**
   * Registers a new user with their email, password, fullName, and roles.
   */
  async register(
    email: string,
    password: string,
    fullName: string,
    roles: string[] = ['USER'],
  ) {
    if (!email || !password || !fullName) {
      throw new Error('Email, password, and fullName are required.');
    }

    const passwordHash = await this.hashPassword(password);
    return this.usersService.createUser(email, passwordHash, fullName, roles);
  }

  /**
   * Logs in a user, verifying email/password and minting a JWT.
   */
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password must be provided.');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password.');
    }

    // Extract exact roles
    const roles = user.userRoles.map((ur) => ur.role.name);

    // Mint stateless JWT containing ID (sub) and roles
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: roles,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: roles,
        ownerProfile: user.ownerProfile,
      },
    };
  }

  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded as any as JwtPayload;
    } catch {
      throw new Error('Invalid or expired token.');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
