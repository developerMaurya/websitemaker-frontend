import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Dynamic API URL detection: support local or production backend
const getApiUrl = () => {
  const hostname = window.location.hostname;
  const ipMatch = hostname.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/);
  if (ipMatch) {
    return `http://${ipMatch[0]}:5000/api`;
  }
  if (hostname.includes(':') || hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')) {
    return 'http://localhost:5000/api';
  }
  return `http://${hostname}:5000/api`;
};
const API_URL = getApiUrl();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [tenant, setTenant] = useState(() => {
    try {
      const cached = localStorage.getItem('tenant');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem('token');
    const cachedUser = localStorage.getItem('user');
    // If we have both token and cached user data, we can render immediately without a loading screen!
    if (token && cachedUser) {
      return false;
    }
    return !!token;
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set authorization header globally for axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axios.get(`${API_URL}/auth/me`);
          setUser(res.data.user);
          setTenant(res.data.tenant);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('tenant', JSON.stringify(res.data.tenant));
        } catch (err) {
          console.error('Session validation failed:', err.message);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tenant');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
          setTenant(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      const { token, user: userData, tenant: tenantData } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('tenant', JSON.stringify(tenantData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      setTenant(tenantData);
      return { success: true };
    } catch (err) {
      console.error('Login request failed:', err.response?.data?.message || err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed, check network.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setTenant(null);
  };

  const refreshSession = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get(`${API_URL}/auth/me`);
        setUser(res.data.user);
        setTenant(res.data.tenant);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('tenant', JSON.stringify(res.data.tenant));
      } catch (err) {
        console.error('Refresh session failed:', err.message);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      tenant,
      loading,
      login,
      logout,
      refreshSession,
      API_URL
    }}>
      {children}
    </AuthContext.Provider>
  );
};
