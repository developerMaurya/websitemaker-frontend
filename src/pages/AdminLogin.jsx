import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, AlertCircle, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminLogin = () => {
  const { login, user, API_URL } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot Password Flow States
  const [viewMode, setViewMode] = useState('login'); // 'login', 'forgot', 'reset'
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Already logged in redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'superadmin') {
        navigate('/superadmin-dashboard');
      } else if (!user.tenant) {
        navigate('/shop-dashboard');
      } else {
        navigate('/admin-dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password.');
      setLoading(false);
      return;
    }

    const res = await login(username, password);
    if (res.success) {
      // Handled by useEffect redirect
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!forgotUsername || !forgotEmail) {
      setError('Please fill in both fields.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        username: forgotUsername,
        email: forgotEmail
      });
      if (res.data.success) {
        setSuccess('Identity verified successfully! Please enter your new password.');
        setViewMode('reset');
      } else {
        setError(res.data.message || 'Verification failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!newPassword || !confirmNewPassword) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/reset-password`, {
        username: forgotUsername,
        email: forgotEmail,
        newPassword
      });
      if (res.data.success) {
        setSuccess('Password reset successful! Please login with your new password.');
        setViewMode('login');
        setUsername(forgotUsername);
        setPassword('');
        setForgotUsername('');
        setForgotEmail('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setError(res.data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }} className="hover:text-white">
              <ArrowLeft size={14} /> Back to Directory
            </Link>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>
              {viewMode === 'login' && 'My Shop Login'}
              {viewMode === 'forgot' && 'Reset Request'}
              {viewMode === 'reset' && 'Choose Password'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {viewMode === 'login' && 'Manage your brand logo, custom themes, services, and product inventory items.'}
              {viewMode === 'forgot' && 'Verify your merchant credentials to initiate a secure password reset.'}
              {viewMode === 'reset' && 'Define a new secure password for your store administration workspace.'}
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '20px'
            }}>
              <CheckCircle size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {viewMode === 'login' && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Shop Username</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="e.g. kiranstore"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '44px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Password</label>
                  <button
                    type="button"
                    onClick={() => { setViewMode('forgot'); setError(''); setSuccess(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500' }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '44px' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="glass-button"
                style={{ width: '100%', padding: '14px', marginTop: '10px' }}
              >
                {loading ? 'Authenticating session...' : 'Verify & Enter Dashboard'}
              </button>
            </form>
          )}

          {viewMode === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Shop Username</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="e.g. kiranstore"
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '44px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Registered Email</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    placeholder="e.g. merchant@mail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '44px' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="glass-button"
                style={{ width: '100%', padding: '14px', marginTop: '10px' }}
              >
                {loading ? 'Verifying details...' : 'Verify Identity'}
              </button>

              <button
                type="button"
                onClick={() => { setViewMode('login'); setError(''); setSuccess(''); }}
                className="glass-button secondary"
                style={{ width: '100%', padding: '12px' }}
              >
                Back to Login
              </button>
            </form>
          )}

          {viewMode === 'reset' && (
            <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>New Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    placeholder="Min 6 characters..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '44px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Confirm New Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    placeholder="Re-type new password..."
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="glass-input"
                    style={{ paddingLeft: '44px' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="glass-button"
                style={{ width: '100%', padding: '14px', marginTop: '10px' }}
              >
                {loading ? 'Updating password...' : 'Update Password'}
              </button>

              <button
                type="button"
                onClick={() => { setViewMode('forgot'); setError(''); setSuccess(''); }}
                className="glass-button secondary"
                style={{ width: '100%', padding: '12px' }}
              >
                Back to Verification
              </button>
            </form>
          )}

          <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Need admin access? Contact your platform <Link to="/superadmin-login" style={{ color: 'var(--accent-purple)', fontWeight: '600' }}>Super Admin</Link>.</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;
