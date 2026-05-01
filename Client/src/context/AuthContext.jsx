import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('shego_user');
    const token = localStorage.getItem('shego_token');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch (_) {
        localStorage.removeItem('shego_user');
        localStorage.removeItem('shego_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.loginUser({ email, password });
    localStorage.setItem('shego_token', data.token);
    localStorage.setItem('shego_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('shego_token');
    localStorage.removeItem('shego_user');
    setUser(null);
  };

  const isDriver = () => user?.role === 'driver';
  const isPassenger = () => user?.role === 'passenger';

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isDriver, isPassenger }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
