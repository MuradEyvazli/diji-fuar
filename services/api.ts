// API Base Configuration - MongoDB Entegrasyonu
import ENV from '@/config/env';

const getApiUrl = () => {
  return ENV.getApiUrl();
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  company?: string;
}

export interface User {
  _id: string;
  id?: string; // Backward compatibility
  username: string;
  email: string;
  fullName: string;
  company?: string;
  qrCode?: string;
  avatar?: string;
  isActive?: boolean;
  createdAt: string;
  lastLoginAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Enhanced Mock API Storage (will be replaced with real API later)
class EnhancedMockApiStorage {
  private users: (User & { password: string })[] = [];
  private sessions: Map<string, { userId: string, token: string, refreshToken: string, expiresAt: number }> = new Map();

  constructor() {
    this.initializeUsers();
  }

  private async initializeUsers() {
    // Load from storage or create default users
    try {
      const storedUsers = await this.loadUsersFromStorage();
      if (storedUsers && storedUsers.length > 0) {
        this.users = storedUsers;
      } else {
        // Create default users
        this.users = [
          {
            _id: '1',
            id: '1',
            username: ENV.DEFAULT_DEMO_USERNAME,
            email: 'demo@dijifuar.com',
            fullName: 'Demo Kullanıcı',
            company: 'Diji Fuar Ltd.',
            password: ENV.DEFAULT_DEMO_PASSWORD,
            isActive: true,
            qrCode: JSON.stringify({
              userId: '1',
              username: ENV.DEFAULT_DEMO_USERNAME,
              email: 'demo@dijifuar.com',
              timestamp: Date.now(),
              event: 'diji-fuar-2024'
            }),
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          },
          {
            _id: '2',
            id: '2',
            username: ENV.DEFAULT_ADMIN_USERNAME,
            email: 'admin@dijifuar.com',
            fullName: 'Admin Kullanıcı',
            company: 'Diji Fuar Ltd.',
            password: ENV.DEFAULT_ADMIN_PASSWORD,
            isActive: true,
            qrCode: JSON.stringify({
              userId: '2',
              username: ENV.DEFAULT_ADMIN_USERNAME,
              email: 'admin@dijifuar.com',
              timestamp: Date.now(),
              event: 'diji-fuar-2024'
            }),
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          }
        ];
        await this.saveUsersToStorage();
      }
    } catch (error) {
      console.error('Error initializing users:', error);
    }
  }

  private async loadUsersFromStorage(): Promise<(User & { password: string })[] | null> {
    try {
      const { SecureStorage } = await import('./storage');
      const storedData = await SecureStorage.getSettings();
      return storedData?.users || null;
    } catch (error) {
      console.error('Error loading users from storage:', error);
      return null;
    }
  }

  private async saveUsersToStorage(): Promise<void> {
    try {
      const { SecureStorage } = await import('./storage');
      const currentSettings = await SecureStorage.getSettings() || {};
      await SecureStorage.setSettings({
        ...currentSettings,
        users: this.users
      });
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  }

  private generateTokens(user: User): { token: string; refreshToken: string } {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return {
      token: `djf_${user._id}_${timestamp}_${random}`,
      refreshToken: `djf_refresh_${user._id}_${timestamp}_${random}`
    };
  }

  // Simulate API delay
  private async delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate token
  private generateToken(): string {
    return 'djf_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  // Generate refresh token
  private generateRefreshToken(): string {
    return 'djf_refresh_' + Math.random().toString(36).substr(2, 15) + '_' + Date.now().toString(36);
  }

  // Login with Enhanced Mock API
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    await this.delay();

    try {
      console.log('Login attempt:', credentials);

      // Find user by username or email
      const user = this.users.find(u =>
        (u.username === credentials.username || u.email === credentials.username) && u.isActive
      );

      if (!user) {
        console.log('User not found');
        return {
          success: false,
          error: 'Kullanıcı bulunamadı'
        };
      }

      console.log('Found user:', user.username);

      // Simple password check (in real app this would be bcrypt)
      if (credentials.password !== user.password) {
        console.log('Password mismatch');
        return {
          success: false,
          error: 'Şifre hatalı'
        };
      }

      // Update last login
      user.lastLoginAt = new Date().toISOString();
      await this.saveUsersToStorage();

      // Generate tokens
      const tokens = this.generateTokens(user);
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

      // Store session
      this.sessions.set(tokens.token, {
        userId: user._id,
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        expiresAt
      });

      console.log('Login successful');

      // Return user without password
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token: tokens.token,
          refreshToken: tokens.refreshToken
        },
        message: 'Giriş başarılı'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Giriş işlemi sırasında bir hata oluştu'
      };
    }
  }

  // Register with Enhanced Mock API
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    await this.delay();

    try {
      // Check if user already exists
      const existingUser = this.users.find(u =>
        u.username === userData.username || u.email === userData.email
      );

      if (existingUser) {
        return {
          success: false,
          error: 'Bu kullanıcı adı veya e-posta zaten kullanılıyor'
        };
      }

      // Create new user
      const newUserId = (this.users.length + 1).toString();
      const newUser = {
        _id: newUserId,
        id: newUserId,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        company: userData.company,
        password: userData.password,
        isActive: true,
        qrCode: JSON.stringify({
          userId: newUserId,
          username: userData.username,
          email: userData.email,
          timestamp: Date.now(),
          event: 'diji-fuar-2024'
        }),
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      this.users.push(newUser);
      await this.saveUsersToStorage();

      console.log('User registered successfully:', newUser.username);

      // Generate tokens
      const tokens = this.generateTokens(newUser);
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000);

      // Store session
      this.sessions.set(tokens.token, {
        userId: newUser._id,
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        expiresAt
      });

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;

      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token: tokens.token,
          refreshToken: tokens.refreshToken
        },
        message: 'Kayıt başarılı'
      };
    } catch (error: any) {
      console.error('Register error:', error);
      return {
        success: false,
        error: 'Kayıt işlemi sırasında bir hata oluştu'
      };
    }
  }

  // Verify token with Enhanced Mock API
  async verifyToken(token: string): Promise<ApiResponse<User>> {
    await this.delay(200);

    try {
      // Check if session exists and not expired
      const session = this.sessions.get(token);
      if (!session || session.expiresAt < Date.now()) {
        return {
          success: false,
          error: 'Geçersiz veya süresi dolmuş token'
        };
      }

      // Find user
      const user = this.users.find(u => u._id === session.userId);
      if (!user || !user.isActive) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı'
        };
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        error: 'Token doğrulama hatası'
      };
    }
  }

  // Logout
  async logout(token: string): Promise<ApiResponse<null>> {
    await this.delay(200);

    this.sessions.delete(token);

    return {
      success: true,
      message: 'Çıkış başarılı'
    };
  }

  // Refresh token with Enhanced Mock API
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string, refreshToken: string }>> {
    await this.delay(300);

    try {
      // Find session by refresh token
      const session = Array.from(this.sessions.values()).find(s => s.refreshToken === refreshToken);

      if (!session) {
        return {
          success: false,
          error: 'Geçersiz refresh token'
        };
      }

      // Find user
      const user = this.users.find(u => u._id === session.userId);
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı bulunamadı'
        };
      }

      // Generate new tokens
      const newTokens = this.generateTokens(user);
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000);

      // Remove old session
      this.sessions.delete(session.token);

      // Create new session
      this.sessions.set(newTokens.token, {
        userId: session.userId,
        token: newTokens.token,
        refreshToken: newTokens.refreshToken,
        expiresAt
      });

      return {
        success: true,
        data: newTokens
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        error: 'Token yenileme hatası'
      };
    }
  }
}

// Singleton instance
const enhancedMockApi = new EnhancedMockApiStorage();

// API Service Class
export class ApiService {

  static async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      return await enhancedMockApi.login(credentials);
    } catch (error) {
      console.error('API login error:', error);
      return {
        success: false,
        error: 'Bağlantı hatası'
      };
    }
  }

  static async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      return await enhancedMockApi.register(userData);
    } catch (error) {
      console.error('API register error:', error);
      return {
        success: false,
        error: 'Bağlantı hatası'
      };
    }
  }

  static async verifyToken(token: string): Promise<ApiResponse<User>> {
    try {
      return await enhancedMockApi.verifyToken(token);
    } catch (error) {
      console.error('API verify token error:', error);
      return {
        success: false,
        error: 'Bağlantı hatası'
      };
    }
  }

  static async logout(token: string): Promise<ApiResponse<null>> {
    try {
      return await enhancedMockApi.logout(token);
    } catch (error) {
      console.error('API logout error:', error);
      return {
        success: false,
        error: 'Bağlantı hatası'
      };
    }
  }

  static async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string, refreshToken: string }>> {
    try {
      return await enhancedMockApi.refreshToken(refreshToken);
    } catch (error) {
      console.error('API refresh token error:', error);
      return {
        success: false,
        error: 'Bağlantı hatası'
      };
    }
  }
}

export default ApiService;