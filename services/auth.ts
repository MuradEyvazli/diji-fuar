import jwt from 'jsonwebtoken';
import { IUser } from '@/models/User';
import ENV from '@/config/env';

const JWT_SECRET = ENV.JWT_SECRET;
const JWT_REFRESH_SECRET = ENV.JWT_REFRESH_SECRET;
const JWT_EXPIRE = ENV.JWT_EXPIRE;
const JWT_REFRESH_EXPIRE = ENV.JWT_REFRESH_EXPIRE;

export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export class AuthService {
  static generateTokens(user: IUser): AuthTokens {
    const payload: TokenPayload = {
      userId: user._id,
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRE });

    return { token, refreshToken };
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  static verifyRefreshToken(refreshToken: string): TokenPayload | null {
    try {
      return jwt.verify(refreshToken, JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }

  static async refreshTokens(refreshToken: string): Promise<AuthTokens | null> {
    const payload = this.verifyRefreshToken(refreshToken);
    if (!payload) {
      return null;
    }

    // Generate new tokens
    return {
      token: jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE }),
      refreshToken: jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRE })
    };
  }
}

export default AuthService;