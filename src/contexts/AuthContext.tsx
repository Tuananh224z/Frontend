import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import type { User } from '../types/user';

// Re-export để các file đang import { User, Address, UserAddress } từ AuthContext vẫn hoạt động
export type { User, Address, UserAddress } from '../types/user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: (idToken: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<User>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeUser = (userData: any): User => {
  if (!userData) return userData;
  return {
    ...userData,
    _id: userData._id || userData.id,
    fullName: userData.fullName || userData.name || '',
    role: userData.role === 'user' ? 'customer' : userData.role,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      let userData: any = null;
      const response = await authService.getProfile();
      if (response.data?.status === 'success') {
        userData = normalizeUser(response.data.data);
      } else if (response.data && (response.data.id || response.data._id || response.data.email)) {
        userData = normalizeUser(response.data);
      }

      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (token) {
      if (savedUser && savedUser !== 'undefined') {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse saved user:', e);
          logout();
        }
        setLoading(false);
        // Refresh profile in background
        fetchProfile();
      } else {
        fetchProfile();
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response.data?.status === 'success') {
        const { token: newToken, user: userData } = response.data.data;
        const normalized = normalizeUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('user', JSON.stringify(normalized));
        setToken(newToken);
        setUser(normalized);
        return normalized;
      } 
      else if (response.data?.accessToken && response.data?.user) {
        const newToken = response.data.accessToken;
        const userData = response.data.user;
        const normalized = normalizeUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('user', JSON.stringify(normalized));
        setToken(newToken);
        setUser(normalized);
        return normalized;
      }
      else if (response.data?.token || response.data?.accessToken) {
        const newToken = response.data.token || response.data.accessToken;
        const userData = response.data.user || response.data;
        const normalized = normalizeUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('user', JSON.stringify(normalized));
        setToken(newToken);
        setUser(normalized);
        return normalized;
      }
      else {
        throw new Error(response.data?.message || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.message || error.message || 'Đăng nhập thất bại');
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    setLoading(true);
    try {
      const response = await authService.loginWithGoogle(idToken);
      if (response.data?.status === 'success') {
        const { token: newToken, user: userData } = response.data.data;
        const normalized = normalizeUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('user', JSON.stringify(normalized));
        setToken(newToken);
        setUser(normalized);
        return normalized;
      } 
      else if (response.data?.accessToken && response.data?.user) {
        const newToken = response.data.accessToken;
        const userData = response.data.user;
        const normalized = normalizeUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('user', JSON.stringify(normalized));
        setToken(newToken);
        setUser(normalized);
        return normalized;
      }
      else if (response.data?.token || response.data?.accessToken) {
        const newToken = response.data.token || response.data.accessToken;
        const userData = response.data.user || response.data;
        const normalized = normalizeUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('user', JSON.stringify(normalized));
        setToken(newToken);
        setUser(normalized);
        return normalized;
      }
      else {
        throw new Error(response.data?.message || 'Đăng nhập Google thất bại');
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.message || error.message || 'Đăng nhập Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      if (response.data?.status === 'success') {
        const { token: newToken, user: newUser } = response.data.data;
        const normalized = normalizeUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('user', JSON.stringify(normalized));
        setToken(newToken);
        setUser(normalized);
        return normalized;
      } 
      else if (response.data?.accessToken && response.data?.user) {
        const newToken = response.data.accessToken;
        const userData = response.data.user;
        const normalized = normalizeUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('user', JSON.stringify(normalized));
        setToken(newToken);
        setUser(normalized);
        return normalized;
      }
      else if (response.data?.token || response.data?.accessToken) {
        const newToken = response.data.token || response.data.accessToken;
        const userData = response.data.user || response.data;
        const normalized = normalizeUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('user', JSON.stringify(normalized));
        setToken(newToken);
        setUser(normalized);
        return normalized;
      }
      else {
        throw new Error(response.data?.message || 'Đăng ký thất bại');
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.message || error.message || 'Đăng ký thất bại');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.data?.status === 'success') {
        const updatedUser = normalizeUser(response.data.data);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      } else if (response.data && (response.data.user || response.data.id || response.data._id || response.data.email)) {
        const returnedUser = response.data.user || response.data;
        const updatedUser = normalizeUser(returnedUser);

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      } else {
        throw new Error(response.data?.message || 'Cập nhật thông tin thất bại');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại');
    }
  };



  const refreshProfile = async () => {
    if (token) {
      await fetchProfile();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
