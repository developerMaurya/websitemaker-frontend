import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Home, Save, User, Store, MapPin, Tag, Phone, Link as LinkIcon, Image as ImageIcon, Upload, CheckCircle2 } from 'lucide-react';

const ShopDashboard = () => {
  const { user, API_URL, logout, refreshSession } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: '',
    category: '',
    phone: '',
    whatsapp: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: '',
    landmark: '',
    mapLocation: '',
    websiteLink: '',
    additionalItems: '',
    remarks: '',
    logo: ''
  });

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Grocery Store (Kirana)', 'Fashion & Clothing', 'Electronics', 'Jewellery & Beauty',
    'Food & Restaurant', 'Healthcare & Medical', 'Education & Training', 'Events & Wedding Services',
    'Mobile & Computer Services', 'Home & Furniture', 'Construction & Building Materials',
    'Automobile & Transport', 'Agriculture & Farming', 'Real Estate & Property', 'Financial & Insurance Services',
    'Travel & Tourism', 'Professional Services', 'Manufacturing & Industry', 'Home Services & Repairs',
    'Sports & Fitness', 'Religious & Spiritual Services', 'Printing & Advertising', 'Courier & Logistics',
    'Event work', 'jamin or ploting work', 'builing materlel', 'rant work', 'hous on rant', 'car on rant', 'driver',
    'Photography & Videography', 'Entertainment & Recreation', 'NGOs & Social Organizations',
    'Government & Public Services', 'Pet Care & Veterinary Services', 'Water & Gas Suppliers',
    'Scrap & Recycling', 'Security & Safety Services', 'Solar & Renewable Energy', 'Internet & Telecom Services',
    'E-commerce & Online Services', 'Software & IT Services', 'Cyber Cafe & Digital Services', 'Legal Services',
    'Consultancy Services', 'Recruitment & Job Services', 'Textile & Fabric Businesses', 'Handicrafts & Art',
    'Gift & Stationery Stores', 'Toys & Baby Products', 'Books & Publications', 'Wholesale & Distribution',
    'Import & Export Businesses', 'Warehousing & Storage', 'Cleaning & Pest Control Services', 'Other Businesses'
  ].sort();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.tenant) {
      navigate('/admin-dashboard');
    } else if (user.role === 'superadmin') {
      navigate('/superadmin-dashboard');
    } else {
      // Initialize form data with user info
      setFormData({
        companyName: user.companyName || '',
        category: user.category || '',
        phone: user.phone || '',
        whatsapp: user.whatsapp || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        country: user.address?.country || 'India',
        pinCode: user.address?.pinCode || '',
        landmark: user.landmark || '',
        mapLocation: user.mapLocation || '',
        websiteLink: user.websiteLink || user.socialLinks?.website || '',
        additionalItems: user.additionalItems?.join(', ') || '',
        remarks: user.remarks || '',
        logo: user.logo || ''
      });
    }
  }, [user, navigate]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        companyName: formData.companyName,
        category: formData.category,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pinCode: formData.pinCode
        },
        landmark: formData.landmark,
        mapLocation: formData.mapLocation,
        websiteLink: formData.websiteLink,
        additionalItems: formData.additionalItems.split(',').map(item => item.trim()).filter(Boolean),
        remarks: formData.remarks,
        logo: formData.logo
      };

      await axios.put(`${API_URL}/admin/profile`, payload);
      showAlert('green', 'Shop Profile updated successfully!');
      await refreshSession();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to update shop details.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Dashboard Header */}
      <header style={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={20} />
            <strong style={{ fontSize: '1.2rem' }}>Portal Home</strong>
          </Link>
          <div style={{ height: '24px', width: '1px', background: 'var(--border-color)' }}></div>
          <span style={{ color: 'var(--text-secondary)' }}>My Shop Dashboard</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user.logo ? (
              <img src={user.logo} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <strong style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>{user.companyName}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{user.username}</span>
            </div>
          </div>
          <button onClick={logout} className="glass-button secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '40px 20px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Shop Management Panel</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Keep your directory listing up to date so customers can find your business easily.</p>
          </div>

          {alert && (
            <div style={{
              background: alert.type === 'green' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${alert.type === 'green' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              color: alert.type === 'green' ? '#10b981' : '#ef4444',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={18} />
              {alert.message}
            </div>
          )}

          <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Basic Info */}
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-purple)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Store size={18} /> Basic Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Shop / Company Name *</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="glass-input" required placeholder="e.g. Kiran General Store" style={{ width: '100%' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Business Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="glass-input" style={{ width: '100%' }} required>
                      <option value="" disabled>Select Category...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Mobile Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="glass-input" placeholder="e.g. 9876543210" style={{ width: '100%' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>WhatsApp Number</label>
                    <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="glass-input" placeholder="e.g. 9876543210" style={{ width: '100%' }} />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Website Link (Optional)</label>
                    <input type="url" name="websiteLink" value={formData.websiteLink} onChange={handleChange} className="glass-input" placeholder="https://myshop.com" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

              {/* Services / Items */}
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-purple)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={18} /> Shop Services / Items
                </h3>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>What do you sell? (Comma separated)</label>
                <textarea 
                  name="additionalItems" 
                  value={formData.additionalItems} 
                  onChange={handleChange} 
                  className="glass-input" 
                  placeholder="e.g. Retail Shop, Grocery Store (Kirana), Supermarket" 
                  style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

              {/* Location */}
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-purple)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} /> Location Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Street Address</label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} className="glass-input" placeholder="e.g. 123 Main Market Road" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Landmark</label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="glass-input" placeholder="e.g. Near City Hospital" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="glass-input" placeholder="e.g. Mumbai" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="glass-input" placeholder="e.g. Maharashtra" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pin Code</label>
                    <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="glass-input" placeholder="e.g. 400001" style={{ width: '100%' }} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Google Maps Location URL (Optional)</label>
                    <input type="url" name="mapLocation" value={formData.mapLocation} onChange={handleChange} className="glass-input" placeholder="https://maps.google.com/..." style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

              {/* Logo */}
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-purple)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={18} /> Branding
                </h3>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Shop Logo or Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="glass-button secondary" 
                    style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderStyle: 'dashed' }}
                  >
                    <Upload size={18} />
                    {formData.logo ? 'Change Image' : 'Upload Image'}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                  />
                  {formData.logo && (
                    <img src={formData.logo} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--accent-purple)' }} />
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                className="glass-button" 
                disabled={loading}
                style={{ 
                  background: 'var(--primary-gradient)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '16px', 
                  fontSize: '1.1rem', 
                  marginTop: '10px',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Save size={20} />
                {loading ? 'Saving Updates...' : 'Save Shop Updates'}
              </button>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShopDashboard;
