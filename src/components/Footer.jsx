import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '40px 0',
      marginTop: 'auto',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: '0.9rem'
    }}>
      <div className="container">
        <p style={{ marginBottom: '10px' }}>
          © {new Date().getFullYear()} <strong>Find My Shop</strong> Local Business Directory Platform.
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Built with Node.js, Express, MongoDB, and React.js. Fully responsive layout.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
