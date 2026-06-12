import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PortalHome from './pages/PortalHome';
import AdminLogin from './pages/AdminLogin';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DynamicTenantSite from './pages/DynamicTenantSite';
import Directory from './pages/Directory';
import Register from './pages/Register';

// Multi-tenant subdomain router resolution
const getSubdomain = () => {
  const hostname = window.location.hostname;
  const hasIP = /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/.test(hostname) || hostname.includes(':');
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hasIP) return null;
  
  // Explicitly ignore your main platform domains so they show the Home Page
  if (
    hostname === 'varanasihub.netlify.app' || 
    hostname === 'websitemaker-frontend.netlify.app'
  ) {
    return null;
  }

  const parts = hostname.split('.');
  
  // If hostname is e.g. kiranstore.localhost, parts is ["kiranstore", "localhost"]
  if (hostname.endsWith('.localhost')) {
    return parts[0];
  }
  
  // e.g. kiranstore.websitemaker.com, parts is ["kiranstore", "websitemaker", "com"]
  if (parts.length > 2 && parts[0] !== 'www') {
    return parts[0];
  }
  return null;
};

function App() {
  const subdomain = getSubdomain();

  if (subdomain) {
    return (
      <AuthProvider>
        <BrowserRouter>
          <DynamicTenantSite />
        </BrowserRouter>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main platform routes */}
          <Route path="/" element={<PortalHome />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/superadmin-login" element={<SuperAdminLogin />} />
          <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          
          {/* Catch-all dynamic routing for tenants */}
          <Route path="/:subdomain" element={<DynamicTenantSite />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
