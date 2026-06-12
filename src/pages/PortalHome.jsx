import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Search, MapPin, Sparkles, Filter, ShieldAlert, Phone, ExternalLink } from 'lucide-react';
import CompanyCard from '../components/CompanyCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const PortalHome = () => {
  const { API_URL } = useContext(AuthContext);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Quick contact modal popup state
  const [contactModalCompany, setContactModalCompany] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/tenant/list`),
          axios.get(`${API_URL}/categories`)
        ]);
        setCompanies(compRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load portal directories:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  // Filter listings based on Search, Category, and City
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = (company.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
      (company.category || '').toLowerCase().includes(search.toLowerCase()) ||
      (company.subdomain || '').toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === '' || company.category === selectedCategory;

    const matchesCity = cityFilter === '' ||
      (company.address?.city || '').toLowerCase().includes(cityFilter.toLowerCase()) ||
      (company.address?.state || '').toLowerCase().includes(cityFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesCity;
  });

  const getSubdomainUrl = (sub) => {
    const hostname = window.location.hostname;
    const hasIP = /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/.test(hostname) || hostname.includes(':');
    if (hasIP) {
      return `/site/${sub}`;
    }
    const protocol = window.location.protocol;
    const host = window.location.host;
    if (host.includes('localhost')) {
      return `${protocol}//${sub}.localhost:5173/`;
    }
    const cleanHost = host.replace(/^www\./, '');
    return `${protocol}//${sub}.${cleanHost}/`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero Section */}
      <header className="section-padding" style={{
        background: 'radial-gradient(ellipse at top, rgba(139, 92, 246, 0.15), transparent 60%)',
        textAlign: 'center',
        paddingTop: '60px',
        paddingBottom: '40px'
      }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '999px', marginBottom: '20px' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-purple)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Instantly Launch Your E-Commerce Subdomain</span>
          </div>

          <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', lineHeight: '1.2' }}>
            Discover Local Businesses & <br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Create Your Dynamic Website
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 24px auto', fontSize: '1.1rem' }}>
            Explore verified companies, view interactive customer reviews, filter by specific business niches, or log in to manage your premium website content seamlessly.
          </p>

          <Link
            to="/register"
            className="glass-button"
            style={{ 
              display: 'inline-flex',
              padding: '12px 32px', 
              fontSize: '1.1rem', 
              background: 'var(--primary-gradient)', 
              color: 'white', 
              border: 'none',
              marginBottom: '40px',
              textDecoration: 'none'
            }}
          >
            + Add My Shop for Free
          </Link>

          {/* Search & Location Filters Header */}
          <div className="glass-panel" style={{ maxWidth: '850px', margin: '0 auto', padding: '16px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '12px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search shop, services, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: '44px' }}
              />
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="City or state filter..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: '44px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="glass-input"
                style={{ cursor: 'pointer', appearance: 'none', background: 'rgba(255,255,255,0.05) url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%239ca3af%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E") no-repeat right 12px center', backgroundSize: '16px' }}
              >
                <option value="" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name} style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Directory Listing */}
      <main style={{ paddingBottom: '80px', flex: 1 }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={20} style={{ color: 'var(--accent-purple)' }} />
              Active Subdomain Businesses ({filteredCompanies.length})
            </h2>
          </div>

          {loading ? null : filteredCompanies.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <ShieldAlert size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No shops match your filtering parameters</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                Try resetting your filters, searching for alternate terms, or registering a brand new tenant site using the admin controls.
              </p>
            </div>
          ) : (
            <div className="grid-cols-12">
              {filteredCompanies.map((company) => (
                <div key={company.id} className="col-span-4">
                  <CompanyCard company={company} onContactClick={setContactModalCompany} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Contact Details Glassmorphic Modal */}
      {contactModalCompany && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div className="glass-panel animate-fade-in" style={{
            maxWidth: '500px',
            width: '100%',
            position: 'relative',
            border: '1px solid var(--accent-purple)',
            boxShadow: '0 20px 50px rgba(139, 92, 246, 0.25)',
            textAlign: 'left'
          }}>
            {/* Header */}
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {contactModalCompany.logo ? (
                  <img
                    src={contactModalCompany.logo}
                    alt=""
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-purple)' }}
                  />
                ) : (
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    {contactModalCompany.companyName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{contactModalCompany.companyName}</h3>
                  <span className="badge" style={{ marginTop: '4px' }}>{contactModalCompany.category}</span>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setContactModalCompany(null)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: 'var(--text-primary)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {/* Address details */}
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Store Location Address</span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <MapPin size={16} style={{ color: 'var(--accent-purple)', marginTop: '3px', flexShrink: 0 }} />
                  <span>
                    {contactModalCompany.address?.street ? `${contactModalCompany.address.street}, ` : ''}
                    {contactModalCompany.landmark ? `(Landmark: ${contactModalCompany.landmark}), ` : ''}
                    {contactModalCompany.address?.city}, {contactModalCompany.address?.state} - {contactModalCompany.address?.pinCode}
                  </span>
                </p>
              </div>

              {/* Services & Items */}
              {contactModalCompany.additionalItems && contactModalCompany.additionalItems.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Products / Services Offered</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {contactModalCompany.additionalItems.map((item, idx) => (
                      <span key={idx} style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-purple)', fontSize: '0.85rem', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct phone */}
              {contactModalCompany.phone && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Phone line Call</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={16} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                    <span>{contactModalCompany.phone}</span>
                  </p>
                </div>
              )}

              {/* WhatsApp details */}
              {(contactModalCompany.whatsapp || contactModalCompany.phone) && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>WhatsApp Contact Details</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold', marginRight: '4px' }}>💬</span>
                    <span>+{contactModalCompany.whatsapp || contactModalCompany.phone}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Modal actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {/* Direct Website visit link (Only for Premium Websites) */}
              {contactModalCompany.isPremium && (
                <a
                  href={getSubdomainUrl(contactModalCompany.subdomain)}
                  onClick={() => setContactModalCompany(null)}
                  className="glass-button"
                  style={{ flex: 1, padding: '12px', fontSize: '0.9rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none', minWidth: '120px' }}
                >
                  Open Website
                  <ExternalLink size={14} />
                </a>
              )}

              {contactModalCompany.mapLocation && (
                <a
                  href={contactModalCompany.mapLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-button secondary"
                  style={{ flex: 1, padding: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)', backgroundColor: 'rgba(59, 130, 246, 0.05)', textDecoration: 'none', minWidth: '120px' }}
                >
                  <MapPin size={14} /> View on Map
                </a>
              )}

              {/* Direct WhatsApp chat button */}
              <a
                href={`https://api.whatsapp.com/send?phone=${(contactModalCompany.whatsapp || contactModalCompany.phone || '').replace(/\D/g, '')}&text=${encodeURIComponent(`Hello! I saw your store "${contactModalCompany.companyName}" on the Find My Shop directory list, and would like to connect with you!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button secondary"
                style={{ flex: 1, padding: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', backgroundColor: 'rgba(16, 185, 129, 0.05)', textDecoration: 'none', minWidth: '120px' }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PortalHome;
