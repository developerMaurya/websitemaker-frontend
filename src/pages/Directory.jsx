import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Search, MapPin, Phone, MessageCircle, Map, CheckCircle2, Navigation, Compass } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

const Directory = () => {
  const { API_URL } = useContext(AuthContext);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Extract unique categories from shops
  const categories = ['All', ...new Set(shops.map(s => s.category).filter(Boolean))];

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await axios.get(`${API_URL}/tenant/list`);
        setShops(res.data);
      } catch (error) {
        console.error('Failed to load business directory:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const filteredShops = shops.filter(shop => {
    const matchesSearch = (shop.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (shop.address?.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (shop.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || shop.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

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

  const openNavigation = (shop) => {
    const dest = shop.mapLocation || `${shop.address?.street}, ${shop.address?.city}, ${shop.address?.pinCode}`;
    const url = dest.startsWith('http') ? dest : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Header section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <Compass size={40} style={{ color: 'var(--accent-purple)' }} />
            Local Business Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Discover trusted shops, local businesses, and professionals in your area. Search, verify, and connect instantly.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search for a business name, city, or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input"
              style={{ width: '100%', paddingLeft: '48px', fontSize: '1.1rem', padding: '16px 16px 16px 48px' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`glass-button secondary ${activeCategory === cat ? 'active' : ''}`}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '20px',
                  background: activeCategory === cat ? 'var(--accent-purple)' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat ? 'white' : 'var(--text-secondary)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? null : filteredShops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <Compass size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
            <h3>No businesses found</h3>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {filteredShops.map((shop) => (
              <div key={shop.id} className="glass-panel hover-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                
                {/* Banner & Logo */}
                <div style={{ position: 'relative', height: '140px', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))' }}>
                  {shop.banner && <img src={shop.banner} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <div style={{ position: 'absolute', bottom: '-24px', left: '20px' }}>
                    {shop.logo ? (
                      <img src={shop.logo} alt="logo" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid #111', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid #111', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {shop.companyName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  {shop.isProfessional && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981' }}>
                      <CheckCircle2 size={14} /> Verified Professional
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '36px 20px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{shop.companyName}</h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 'bold', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                      {shop.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>
                        {shop.address?.street}, {shop.address?.city}<br/>
                        {shop.address?.state} - {shop.address?.pinCode}
                        {shop.landmark && <><br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Landmark: {shop.landmark}</span></>}
                      </span>
                    </div>
                    {shop.remarks && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '6px' }}>
                        "{shop.remarks}"
                      </div>
                    )}
                  </div>

                  {shop.additionalItems?.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Also Sells</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        {shop.additionalItems.map((item, i) => (
                          <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <a 
                        href={`tel:${shop.phone || ''}`} 
                        className="glass-button secondary" 
                        style={{ padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                        title="Call"
                      >
                        <Phone size={16} /> Call
                      </a>
                      <a 
                        href={`https://wa.me/${shop.whatsapp || shop.phone}?text=Hi, I found your business on Local Directory.`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="glass-button" 
                        style={{ padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', textDecoration: 'none', background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        <MessageCircle size={16} /> WhatsApp
                      </a>
                    </div>
                    
                    <button 
                      onClick={() => openNavigation(shop)}
                      className="glass-button secondary" 
                      style={{ padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)' }}
                    >
                      <Navigation size={18} /> Get Directions (Map)
                    </button>

                    <a 
                      href={getSubdomainUrl(shop.subdomain)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="glass-button" 
                      style={{ padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                    >
                      <Map size={16} /> View Online Store
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Directory;
