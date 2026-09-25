import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as userService from '../services/userService';
import { getErrorMessage } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'bulldogex_token';
const USER_KEY = 'bulldogex_user';

// The server only signs { id, email, role } into the token. Decoding it
// client-side lets us recover the user's id without another round trip.
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

const loadStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser);
  const [loading, setLoading] = useState(false);

  // Keep state in sync if the token gets cleared elsewhere (e.g. the
  // 401 interceptor in services/api.js).
  useEffect(() => {
    const handleStorage = () => setUser(loadStoredUser());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await userService.login({ email, password });
      const decoded = decodeToken(data.token);

      const sessionUser = {
        id: decoded?.id,
        email: decoded?.email,
        firstName: data.firstName,
        role: data.role,
      };

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return sessionUser;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { data } = await userService.register(payload);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // Called after a profile edit so the navbar / pages reflect the change
  // without forcing the user to log in again.
  const updateSessionUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'Admin',
    loading,
    login,
    register,
    logout,
    updateSessionUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- hook lives alongside its provider
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;
