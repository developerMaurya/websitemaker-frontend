import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, User, ShieldAlert, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav style={{
      background: 'rgba(10, 11, 16, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '16px 0'
    }}>
      <div className="container flex-between" style={{ position: 'relative' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsMenuOpen(false)}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            F
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>
            FindMy<span style={{ color: 'var(--accent-purple)' }}>Shop</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/directory" style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.95rem' }} className="hover:text-white">
            Shops Directory
          </Link>

          {user ? (
            <>
              {user.role === 'superadmin' ? (
                <Link
                  to="/superadmin-dashboard"
                  className="glass-button secondary"
                  style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShieldAlert size={16} />
                  Super Admin
                </Link>
              ) : (
                <Link
                  to="/admin-dashboard"
                  className="glass-button secondary"
                  style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <User size={16} />
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="glass-button danger"
                style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="glass-button"
                style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'var(--primary-gradient)', color: 'white', border: 'none' }}
              >
                Add My Shop
              </Link>
              <Link
                to="/login"
                className="glass-button secondary"
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                Admin Login
              </Link>
              <Link
                to="/superadmin-login"
                className="glass-button"
                style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Sparkles size={14} />
                Super Admin
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="mobile-nav-menu glass-panel animate-fade-in" style={{
            position: 'absolute',
            top: '60px',
            right: '0',
            left: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '24px',
            zIndex: 101,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid var(--border-color)',
            background: 'rgba(17, 19, 28, 0.98)',
            borderRadius: 'var(--border-radius-lg)',
            backdropFilter: 'blur(20px)'
          }}>
            <Link 
              to="/directory" 
              style={{ color: 'var(--text-primary)', fontWeight: '600', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '1.05rem' }} 
              onClick={() => setIsMenuOpen(false)}
            >
              Shops Directory
            </Link>

            {user ? (
              <>
                {user.role === 'superadmin' ? (
                  <Link
                    to="/superadmin-dashboard"
                    className="glass-button secondary"
                    style={{ justifyContent: 'flex-start', padding: '12px 16px', fontSize: '0.95rem', width: '100%' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShieldAlert size={16} />
                    Super Admin
                  </Link>
                ) : (
                  <Link
                    to="/admin-dashboard"
                    className="glass-button secondary"
                    style={{ justifyContent: 'flex-start', padding: '12px 16px', fontSize: '0.95rem', width: '100%' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} />
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="glass-button danger"
                  style={{ justifyContent: 'flex-start', padding: '12px 16px', fontSize: '0.95rem', width: '100%' }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                <Link
                  to="/register"
                  className="glass-button"
                  style={{ padding: '12px 16px', fontSize: '0.95rem', background: 'var(--primary-gradient)', color: 'white', border: 'none', justifyContent: 'center' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Add My Shop
                </Link>
                <Link
                  to="/login"
                  className="glass-button secondary"
                  style={{ padding: '12px 16px', fontSize: '0.95rem', justifyContent: 'center' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Login
                </Link>
                <Link
                  to="/superadmin-login"
                  className="glass-button secondary"
                  style={{ padding: '12px 16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} />
                  Super Admin
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
