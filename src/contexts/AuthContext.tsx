import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
}

export interface UserAddress {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  isActive: boolean;
  address?: Address;
  addresses?: UserAddress[];
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
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
          setUser(null);
          localStorage.removeItem('user');
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

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      if (response.data?.status === 'success') {
        const { token: newToken, user: newUser } = response.data.data;
        const normalized = normalizeUser(newUser);
        localStorage.setItem('token', newToken);
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
