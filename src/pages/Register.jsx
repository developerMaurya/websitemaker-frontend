import React, { useState, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Store, MapPin, Tag, Image as ImageIcon, Link as LinkIcon, Phone, User, Mail, Lock, Globe, Upload } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Register = () => {
  const { API_URL, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    companyName: '',
    category: '',
    phone: '',
    whatsapp: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
    landmark: '',
    mapLocation: '',
    website: '',
    additionalItems: '',
    remarks: '',
    logo: '', // This will store the base64 string
    referrerMobile: '',
    referrerName: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const categories = [
    'Fashion & Clothing', 'Jewellery & Beauty', 'Grocery & Supermarket', 'Food & Restaurant',
    'Hotel & Accommodation', 'Healthcare & Medical', 'Education & Training', 'Events & Wedding Services',
    'Electronics & Technology', 'Mobile & Computer Services', 'Home & Furniture', 'Construction & Building Materials',
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData({ ...formData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        category: formData.category,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          country: formData.country
        },
        landmark: formData.landmark,
        mapLocation: formData.mapLocation,
        websiteLink: formData.website,
        additionalItems: formData.additionalItems.split(',').map(item => item.trim()).filter(Boolean),
        remarks: formData.remarks,
        logo: formData.logo,
        referrerMobile: formData.referrerMobile,
        referrerName: formData.referrerName
      };

      const res = await axios.post(`${API_URL}/auth/register`, payload);
      // Removed automatic login as per user request
      window.alert('Registration Successful! Your shop is now listed.');
      navigate('/');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        
        <div className="glass-panel animate-fade-in" style={{
          maxWidth: '800px',
          width: '100%',
          padding: '40px',
          border: '1px solid var(--accent-purple)',
          boxShadow: '0 20px 50px rgba(139, 92, 246, 0.15)'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px auto',
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Store size={32} />
            </div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Register Your Shop</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Create your free business profile to get listed in the directory and manage your details anytime.</p>
          </div>

          {error && (
            <div className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', width: '100%', padding: '12px', marginBottom: '20px', display: 'block', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* SECTION: LOGIN CREDENTIALS */}
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-purple)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} /> Login Credentials
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Username *</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input type="text" name="username" value={formData.username} onChange={handleChange} className="glass-input" required placeholder="johndoe" style={{ paddingLeft: '40px', width: '100%' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="glass-input" required placeholder="john@example.com" style={{ paddingLeft: '40px', width: '100%' }} />
                  </div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password *</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="glass-input" required minLength={6} placeholder="••••••••" style={{ paddingLeft: '40px', width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

            {/* SECTION: BASIC INFO */}
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
                  <select name="category" value={formData.category} onChange={handleChange} className="glass-input" style={{ width: '100%', appearance: 'none', cursor: 'pointer' }} required>
                    <option value="" disabled>Select Category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} style={{ background: 'var(--bg-secondary)', color: 'white' }}>{cat}</option>
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
              </div>
            </div>

            {/* SECTION: SERVICES / ITEMS */}
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-purple)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} /> Specific Shop Type or Services Offered
              </h3>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>What do you sell or what type of shop is it? (Comma separated)</label>
              <textarea 
                name="additionalItems" 
                value={formData.additionalItems} 
                onChange={handleChange} 
                className="glass-input" 
                placeholder="e.g. Retail Shop, Grocery Store (Kirana), Supermarket, General Store, Sabji, Cold Drinks OR Software, App Development" 
                style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
              />
            </div>

            {/* SECTION: LOCATION */}
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

            {/* SECTION: EXTRA & IMAGE */}
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-purple)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={18} /> Additional Information & Images
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                
                {/* Image Picker */}
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Shop Logo or Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="glass-button secondary" 
                      style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderStyle: 'dashed' }}
                    >
                      <Upload size={18} />
                      {logoPreview ? 'Change Image' : 'Upload Image'}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      style={{ display: 'none' }} 
                    />
                    {logoPreview && (
                      <img src={logoPreview} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--accent-purple)' }} />
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Website Link (Optional)</label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} className="glass-input" placeholder="https://myshop.com" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Any other remarks?</label>
                  <textarea name="remarks" value={formData.remarks} onChange={handleChange} className="glass-input" placeholder="Add any special instructions or remarks here..." style={{ width: '100%', minHeight: '60px', resize: 'vertical' }} />
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

            {/* SECTION: REFERRAL DETAILS */}
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-purple)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} /> Referral Details (Optional)
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>If someone referred you to this platform, please enter their details below.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Referrer Mobile Number</label>
                  <input type="text" name="referrerMobile" value={formData.referrerMobile} onChange={handleChange} className="glass-input" placeholder="e.g. 9876543210" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Referrer Name</label>
                  <input type="text" name="referrerName" value={formData.referrerName} onChange={handleChange} className="glass-input" placeholder="e.g. Ramesh" style={{ width: '100%' }} />
                </div>
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
                marginTop: '20px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating Account...' : 'Register & Create Shop Profile'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
            </div>

          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
