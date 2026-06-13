import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, ExternalLink, Sparkles } from 'lucide-react';
import StarRating from './StarRating';

const CompanyCard = ({ company, onContactClick }) => {
  const {
    subdomain,
    companyName,
    category,
    logo,
    address,
    phone,
    ratings = []
  } = company;

  // Calculate average rating
  const avgRating = ratings.length > 0
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
    : 0;

  const getSubdomainUrl = (sub) => {
    const hostname = window.location.hostname;
    const hasIP = /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/.test(hostname) || hostname.includes(':');
    
    // Fallback to path router for localhost, IPs, and free platform domains that don't support wildcard DNS
    const isPlatformDomain = hostname.includes('netlify.app') || hostname.includes('onrender.com') || hostname.includes('vercel.app') || hostname === 'localhost' || hostname === '127.0.0.1';
    
    if (hasIP || isPlatformDomain) {
      return `/${sub}`;
    }
    
    // For real custom domains (like yourdomain.com) with wildcard DNS enabled
    const protocol = window.location.protocol;
    const cleanHost = window.location.host.replace(/^www\./, '');
    return `${protocol}//${sub}.${cleanHost}/`;
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        {logo ? (
          <img
            src={logo}
            alt={companyName}
            style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
          />
        ) : (
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white'
          }}>
            {companyName?.charAt(0).toUpperCase()}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <span className="badge" style={{ marginBottom: '4px' }}>{category}</span>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{companyName}</h3>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
          <MapPin size={15} style={{ color: 'var(--accent-purple)' }} />
          {address?.city ? `${address.city}, ${address.state}` : 'Location configured'}
        </p>

        {phone && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
            <Phone size={15} style={{ color: 'var(--accent-blue)' }} />
            {phone}
          </p>
        )}

        {(company.websiteLink || company.socialLinks?.website) && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
            <ExternalLink size={15} style={{ color: '#10b981' }} />
            <a 
              href={(company.websiteLink || company.socialLinks?.website).startsWith('http') ? (company.websiteLink || company.socialLinks?.website) : `https://${(company.websiteLink || company.socialLinks?.website)}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#10b981', textDecoration: 'none' }}
            >
              {(company.websiteLink || company.socialLinks?.website).replace(/^https?:\/\//, '')}
            </a>
          </p>
        )}
      </div>

      {/* Render additional items / services if available */}
      {company.additionalItems && company.additionalItems.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {company.additionalItems.slice(0, 3).map((item, idx) => (
            <span key={idx} style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-purple)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
              {item}
            </span>
          ))}
          {company.additionalItems.length > 3 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>+{company.additionalItems.length - 3} more</span>
          )}
        </div>
      )}

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <StarRating rating={Number(avgRating) || 5} size={15} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ({ratings.length > 0 ? `${avgRating} / ${ratings.length} reviews` : 'New'})
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '10px' }}>
          {/* View details / Contact popup */}
          <button
            onClick={() => onContactClick && onContactClick(company)}
            className="glass-button"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', background: 'var(--primary-gradient)', color: 'white', border: 'none' }}
          >
            View Details
          </button>

          <a
            href={company.mapLocation || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${company.companyName}, ${address?.street || ''}, ${address?.city || ''}, ${address?.state || ''}, ${address?.pinCode || ''}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button secondary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', textDecoration: 'none', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
          >
            <MapPin size={12} /> Map & Navigation
          </a>

          {(company.websiteLink || company.socialLinks?.website) && (
            <a
              href={(company.websiteLink || company.socialLinks?.website).startsWith('http') ? (company.websiteLink || company.socialLinks?.website) : `https://${(company.websiteLink || company.socialLinks?.website)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button"
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', textDecoration: 'none', color: '#fff', borderColor: 'rgba(139, 92, 246, 0.5)', background: 'rgba(139, 92, 246, 0.2)' }}
            >
              <ExternalLink size={12} /> View Online Store
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
