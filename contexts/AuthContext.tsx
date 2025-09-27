import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { ApiService, LoginRequest, RegisterRequest, User } from '@/services/api';
import { SecureStorage } from '@/services/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      const storedToken = await SecureStorage.getToken();
      const storedUser = await SecureStorage.getUser();

      if (storedToken && storedUser) {
        // Verify token with API
        const response = await ApiService.verifyToken(storedToken);

        if (response.success && response.data) {
          setToken(storedToken);
          setUser(response.data);
        } else {
          // Token is invalid, try refresh token
          await attemptTokenRefresh();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await clearAuthState();
    } finally {
      setIsLoading(false);
    }
  };

  const attemptTokenRefresh = async () => {
    try {
      const refreshToken = await SecureStorage.getRefreshToken();

      if (refreshToken) {
        const response = await ApiService.refreshToken(refreshToken);

        if (response.success && response.data) {
          const { token: newToken, refreshToken: newRefreshToken } = response.data;

          // Save new tokens
          await SecureStorage.setToken(newToken);
          await SecureStorage.setRefreshToken(newRefreshToken);

          // Verify new token
          const userResponse = await ApiService.verifyToken(newToken);

          if (userResponse.success && userResponse.data) {
            setToken(newToken);
            setUser(userResponse.data);
            await SecureStorage.setUser(userResponse.data);
            return;
          }
        }
      }

      // If refresh fails, clear everything
      await clearAuthState();
    } catch (error) {
      console.error('Error refreshing token:', error);
      await clearAuthState();
    }
  };

  const clearAuthState = async () => {
    setUser(null);
    setToken(null);
    await SecureStorage.clearAll();
  };

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await ApiService.login(credentials);

      if (response.success && response.data) {
        const { user: userData, token: userToken, refreshToken } = response.data;

        // Save to secure storage
        await SecureStorage.setToken(userToken);
        await SecureStorage.setRefreshToken(refreshToken);
        await SecureStorage.setUser(userData);

        // Update state
        setUser(userData);
        setToken(userToken);

        return true;
      } else {
        Alert.alert('Giriş Hatası', response.error || 'Bilinmeyen hata');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Giriş Hatası', 'Bağlantı sorunu oluştu');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await ApiService.register(userData);

      if (response.success && response.data) {
        const { user: newUser, token: userToken, refreshToken } = response.data;

        // Save to secure storage
        await SecureStorage.setToken(userToken);
        await SecureStorage.setRefreshToken(refreshToken);
        await SecureStorage.setUser(newUser);

        // Update state
        setUser(newUser);
        setToken(userToken);

        Alert.alert('Başarılı', 'Hesabınız oluşturuldu!');
        return true;
      } else {
        Alert.alert('Kayıt Hatası', response.error || 'Bilinmeyen hata');
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Kayıt Hatası', 'Bağlantı sorunu oluştu');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      if (token) {
        // Notify server about logout
        await ApiService.logout(token);
      }

      // Clear local state
      await clearAuthState();

      // Navigate to home page after logout
      router.replace('/');

    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, clear local state
      await clearAuthState();
      router.replace('/');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async (): Promise<void> => {
    if (!token) return;

    try {
      const response = await ApiService.verifyToken(token);

      if (response.success && response.data) {
        setUser(response.data);
        await SecureStorage.setUser(response.data);
      } else {
        await attemptTokenRefresh();
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      await attemptTokenRefresh();
    }
  };

  const updateUser = async (userData: User): Promise<void> => {
    try {
      setIsLoading(true);

      // Update local state immediately for better UX
      setUser(userData);

      // Save to secure storage
      await SecureStorage.setUser(userData);

      // In a real API, you would make an API call here to update the server
      // For now, we're using mock API, so the data is already updated locally

    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!token,
    isLoading,
    token,
    login,
    register,
    logout,
    refreshAuth,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}