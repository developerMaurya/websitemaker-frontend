import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users, Layers, MessageSquare, Plus, Trash2, Ban, CheckCircle2,
  Lock, KeyRound, Globe, Image, Settings, Sparkles, Building2,
  LayoutGrid, Compass, ShieldAlert, ShieldPlus, Mail, MapPin, Edit, RefreshCw, Award
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SuperAdminDashboard = () => {
  const { user, API_URL, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Active modular console tab: overview, admins, register, categories, profile
  const [activeTab, setActiveTab] = useState('overview');

  // Metrics state
  const [metrics, setMetrics] = useState({
    totalAdmins: 0,
    blockedAdmins: 0,
    activeSites: 0,
    totalCategories: 0,
    totalMessages: 0,
    totalMRR: 0,
    activePaidUsers: 0,
    activeCustomDomains: 0,
    planCounts: { free: 0, basic: 0, professional: 0 },
    categoryDistribution: {}
  });

  // Database listings
  const [admins, setAdmins] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');

  // Category creation form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Store');

  // Admin creation form
  const [adminForm, setAdminForm] = useState({
    username: '',
    email: '',
    password: 'shop123',
    companyName: '',
    category: '',
    subdomain: '',
    phone: '',
    whatsapp: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: '',
    landmark: '',
    mapLocation: '',
    additionalItems: '',
    remarks: '',
    website: '',
    logo: '',
    banner: ''
  });

  // Admin Account Editing state
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editForm, setEditForm] = useState({
    companyName: '',
    email: '',
    subdomain: '',
    phone: '',
    whatsapp: '',
    category: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: '',
    logo: '',
    banner: ''
  });

  // Password reset modal states
  const [resettingId, setResettingId] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  // Status updates alerts
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Custom Domain & Subscription states
  const [domainRequests, setDomainRequests] = useState([]);
  const [updatingPlanId, setUpdatingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState({ planType: 'free', planExpiry: '' });
  
  // Managing admin controls
  const [managingAdminId, setManagingAdminId] = useState(null);
  const [blockStatus, setBlockStatus] = useState('none');
  const [partialDomain, setPartialDomain] = useState(false);
  const [partialForm, setPartialForm] = useState(false);
  const [partialProducts, setPartialProducts] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [whatsappTemplateText, setWhatsappTemplateText] = useState('');
  const [adminCampaignsList, setAdminCampaignsList] = useState([]);
  const [loadingAdminCampaigns, setLoadingAdminCampaigns] = useState(false);

  // Security guard
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'superadmin') {
        navigate('/superadmin-login');
      }
    }
  }, [user, authLoading, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsRes, adminsRes, catRes, domainsRes] = await Promise.all([
        axios.get(`${API_URL}/superadmin/analytics`),
        axios.get(`${API_URL}/superadmin/admins`),
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/superadmin/domains`)
      ]);
      
      setMetrics(metricsRes.data.metrics);
      setAdmins(adminsRes.data);
      setCategories(catRes.data);
      setDomainRequests(domainsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err.message);
      showAlert('danger', 'Error loading administrative database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'superadmin') {
      loadDashboardData();
    }
  }, [user, API_URL]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setAlert({ type: '', message: '' }), 6000);
  };

  // Domain approval actions
  const handleApproveDomain = async (requestId) => {
    if (!window.confirm('Are you sure you want to approve this custom domain request? This will configure mapping routes.')) return;
    try {
      const res = await axios.patch(`${API_URL}/superadmin/domains/${requestId}/status`, { status: 'approved' });
      showAlert('green', res.data.message || 'Custom domain approved successfully!');
      loadDashboardData();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to approve custom domain mapping.');
    }
  };

  const handleRejectDomain = async (requestId) => {
    if (!window.confirm('Are you sure you want to reject this custom domain request?')) return;
    try {
      const res = await axios.patch(`${API_URL}/superadmin/domains/${requestId}/status`, { status: 'rejected' });
      showAlert('green', res.data.message || 'Custom domain request rejected.');
      loadDashboardData();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to reject custom domain mapping.');
    }
  };

  // Plan modification actions
  const triggerEditPlan = (adm) => {
    setUpdatingPlanId(adm._id);
    let defaultDate = '';
    if (adm.planExpiry) {
      // YYYY-MM-DD format for date input
      defaultDate = new Date(adm.planExpiry).toISOString().split('T')[0];
    }
    setPlanForm({
      planType: adm.planType || 'free',
      planExpiry: defaultDate
    });
  };

  const handleSavePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`${API_URL}/superadmin/admins/${updatingPlanId}/plan`, {
        planType: planForm.planType,
        planExpiry: planForm.planExpiry || null
      });
      showAlert('green', res.data.message || 'Merchant subscription plan updated successfully!');
      setUpdatingPlanId(null);
      loadDashboardData();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to update merchant subscription plan.');
    }
  };

  // Control actions for block/notifications/promo templates
  const loadAdminCampaigns = async (adminId) => {
    setLoadingAdminCampaigns(true);
    try {
      const res = await axios.get(`${API_URL}/superadmin/admins/${adminId}/campaigns`);
      setAdminCampaignsList(res.data);
    } catch (err) {
      console.error('Failed to load campaigns list for admin:', err.message);
      setAdminCampaignsList([]);
    } finally {
      setLoadingAdminCampaigns(false);
    }
  };

  const triggerManageAdmin = (adm) => {
    setManagingAdminId(adm._id);
    setBlockStatus(adm.blockStatus || (adm.isBlocked ? 'full' : 'none'));
    setPartialDomain(adm.partialBlockSettings?.blockDomainMapping || false);
    setPartialForm(adm.partialBlockSettings?.blockCustomForm || false);
    setPartialProducts(adm.partialBlockSettings?.blockProducts || false);
    setNotificationMsg('');
    setWhatsappTemplateText(adm.whatsappPromoTemplate || 'Hello! Check out our new products and offers on our website!');
    loadAdminCampaigns(adm._id);
  };

  const handleSaveBlockDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`${API_URL}/superadmin/admins/${managingAdminId}/block-details`, {
        blockStatus,
        partialBlockSettings: {
          blockDomainMapping: partialDomain,
          blockCustomForm: partialForm,
          blockProducts: partialProducts
        }
      });
      showAlert('green', res.data.message || 'Block configurations successfully updated!');
      setManagingAdminId(null);
      loadDashboardData();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to update block configurations.');
    }
  };

  const handleSendNotificationSubmit = async (e) => {
    e.preventDefault();
    if (!notificationMsg.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/superadmin/admins/${managingAdminId}/notify`, {
        message: notificationMsg
      });
      showAlert('green', res.data.message || 'Notification broadcast sent successfully!');
      setNotificationMsg('');
      loadDashboardData();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to broadcast notification.');
    }
  };

  const handleSaveWhatsappPromoSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`${API_URL}/superadmin/admins/${managingAdminId}/whatsapp-promo`, {
        whatsappPromoTemplate: whatsappTemplateText
      });
      showAlert('green', res.data.message || 'WhatsApp advertisement template updated successfully!');
      loadDashboardData();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to update WhatsApp advertisement config.');
    }
  };

  const handleToggleFullBlock = async (adm) => {
    const isBlockedCurrently = adm.blockStatus === 'full' || adm.isBlocked;
    if (!window.confirm(`Are you sure you want to ${isBlockedCurrently ? 'UNBLOCK' : 'BLOCK'} this merchant account?`)) return;
    try {
      const res = await axios.patch(`${API_URL}/superadmin/admins/${adm._id}/block`);
      showAlert('green', res.data.message || 'Merchant block state updated successfully.');
      loadDashboardData();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to update block state.');
    }
  };

  // Base64 helper for image uploads
  const handleFileChange = (e, field, mode = 'create') => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (mode === 'create') {
          if (field === 'logo') setAdminForm(prev => ({ ...prev, logo: reader.result }));
          if (field === 'banner') setAdminForm(prev => ({ ...prev, banner: reader.result }));
        } else {
          if (field === 'logo') setEditForm(prev => ({ ...prev, logo: reader.result }));
          if (field === 'banner') setEditForm(prev => ({ ...prev, banner: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Category addition
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;

    try {
      const res = await axios.post(`${API_URL}/categories`, {
        name: newCatName,
        description: newCatDesc,
        icon: newCatIcon
      });
      setCategories(prev => [...prev, res.data]);
      setNewCatName('');
      setNewCatDesc('');
      showAlert('green', `Category niche "${res.data.name}" added successfully.`);
      loadDashboardData();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to add category.');
    }
  };

  // Category deletion
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category niche?')) return;
    try {
      await axios.delete(`${API_URL}/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
      showAlert('green', 'Category niche successfully removed.');
      loadDashboardData();
    } catch (err) {
      showAlert('danger', 'Failed to delete category.');
    }
  };

  // Admin addition
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: adminForm.username,
        email: adminForm.email,
        password: adminForm.password,
        companyName: adminForm.companyName,
        category: adminForm.category,
        subdomain: adminForm.subdomain,
        phone: adminForm.phone,
        whatsapp: adminForm.whatsapp,
        address: {
          street: adminForm.street,
          city: adminForm.city,
          state: adminForm.state,
          country: adminForm.country,
          pinCode: adminForm.pinCode
        },
        logo: adminForm.logo,
        banner: adminForm.banner
      };

      await axios.post(`${API_URL}/superadmin/admins`, payload);
      showAlert('green', `Tenant Admin account "${adminForm.username}" successfully set up!`);
      
      // Reset Form
      setAdminForm({
        username: '',
        email: '',
        password: 'shop123',
        companyName: '',
        category: '',
        subdomain: '',
        phone: '',
        whatsapp: '',
        street: '',
        city: '',
        state: '',
        country: 'India',
        pinCode: '',
        logo: '',
        banner: ''
      });
      
      setActiveTab('admins');
      loadDashboardData();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to register brand admin.');
    }
  };

  // Trigger editing form
  const startEditAdmin = (adm) => {
    setEditingAdmin(adm);
    setEditForm({
      companyName: adm.companyName || '',
      email: adm.email || '',
      subdomain: adm.subdomain || '',
      phone: adm.phone || '',
      whatsapp: adm.whatsapp || '',
      category: adm.category || '',
      street: adm.address?.street || '',
      city: adm.address?.city || '',
      state: adm.address?.state || '',
      country: adm.address?.country || 'India',
      pinCode: adm.address?.pinCode || '',
      landmark: adm.landmark || '',
      mapLocation: adm.mapLocation || '',
      remarks: adm.remarks || '',
      isProfessional: adm.isProfessional || false,
      logo: adm.logo || '',
      banner: adm.banner || ''
    });
    setActiveTab('admins');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin profile updates
  const handleUpdateAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        companyName: editForm.companyName,
        email: editForm.email,
        subdomain: editForm.subdomain,
        phone: editForm.phone,
        whatsapp: editForm.whatsapp,
        category: editForm.category,
        address: {
          street: editForm.street,
          city: editForm.city,
          state: editForm.state,
          country: editForm.country,
          pinCode: editForm.pinCode
        },
        landmark: editForm.landmark,
        mapLocation: editForm.mapLocation,
        remarks: editForm.remarks,
        isProfessional: editForm.isProfessional,
        logo: editForm.logo,
        banner: editForm.banner
      };

      await axios.put(`${API_URL}/superadmin/admins/${editingAdmin._id}`, payload);
      showAlert('green', `Merchant Brand "${editForm.companyName}" successfully updated live!`);
      setEditingAdmin(null);
      loadDashboardData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update brand profile.';
      if (msg.toLowerCase().includes('subdomain already in use')) {
        showAlert('danger', 'Subdomain already in use. Please change to another subdomain!');
      } else if (msg.toLowerCase().includes('email already in use')) {
        showAlert('danger', 'Email already in use. Please change to another email address!');
      } else {
        showAlert('danger', msg);
      }
    }
  };

  // Admin block toggle
  const handleToggleBlock = async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/superadmin/admins/${id}/block`);
      showAlert('green', res.data.message);
      loadDashboardData();
    } catch (err) {
      showAlert('danger', 'Failed to change admin status.');
    }
  };

  // Admin deletion
  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('WARNING: This action will permanently remove the Admin account, their dynamic website subdomains, their rating reviews, and guest messages. Do you wish to continue?')) return;
    try {
      await axios.delete(`${API_URL}/superadmin/admins/${id}`);
      showAlert('green', 'Admin account and website assets permanently purged.');
      loadDashboardData();
    } catch (err) {
      showAlert('danger', 'Purging admin database failed.');
    }
  };

  // Admin password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showAlert('danger', 'Password must be at least 6 characters.');
      return;
    }

    try {
      await axios.post(`${API_URL}/superadmin/admins/${resettingId}/reset-password`, { newPassword });
      showAlert('green', 'Password reset successful!');
      setResettingId(null);
      setNewPassword('');
    } catch (err) {
      showAlert('danger', 'Failed to reset password.');
    }
  };

  const handleExportExcel = () => {
    const dataToExport = admins.map(adm => ({
      'Company Name': adm.companyName || '',
      'Username': adm.username || '',
      'Email': adm.email || '',
      'Phone': adm.phone || '',
      'WhatsApp': adm.whatsapp || '',
      'Category': adm.category || '',
      'Subdomain': adm.subdomain || '',
      'Professional': adm.isProfessional ? 'Yes' : 'No',
      'Status': adm.isBlocked ? 'Blocked' : 'Active',
      'Street': adm.address?.street ? adm.address.street.replace(/,/g, '') : '',
      'City': adm.address?.city || '',
      'State': adm.address?.state || '',
      'Pin Code': adm.address?.pinCode || '',
      'Landmark': adm.landmark ? adm.landmark.replace(/,/g, '') : '',
      'Map Location': adm.mapLocation || '',
      'Remarks': adm.remarks ? adm.remarks.replace(/,/g, '') : ''
    }));

    if (dataToExport.length === 0) {
      showAlert('danger', 'No shops available to export.');
      return;
    }

    const headers = Object.keys(dataToExport[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of dataToExport) {
      const values = headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`);
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Shops_Export.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (authLoading || !user) {
    return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Validating Central Admin credentials...</div>;
  }

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

  const sidebarTabs = [
    { id: 'overview', label: 'Console Overview', icon: <LayoutGrid size={16} /> },
    { id: 'premium_list', label: 'All Websites List (Premium)', icon: <Globe size={16} /> },
    { id: 'premium_create', label: 'Create Premium Website', icon: <Plus size={16} /> },
    { id: 'plans', label: 'Subscription Plans & Billing', icon: <Award size={16} /> },
    { id: 'domains', label: 'Custom Domain Requests', icon: <Globe size={16} /> },
    { id: 'simple_list', label: 'All Simple Shops', icon: <Users size={16} /> },
    { id: 'simple_create', label: 'Register Simple Shop', icon: <ShieldPlus size={16} /> },
    { id: 'categories', label: 'Niche Categories', icon: <Layers size={16} /> }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '40px 0' }}>
        <div className="dashboard-container">
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings style={{ color: 'var(--accent-purple)' }} />
                Platform Central Console
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>Welcome back, superadmin. Monitor sites, manage registrations, and add category directories.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={loadDashboardData} className="glass-button secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.9rem' }}>
                <RefreshCw size={14} /> Reload Console
              </button>
            </div>
          </div>

          {/* Alert Notification */}
          {alert.message && (
            <div className={`badge ${alert.type === 'green' ? 'green' : 'red'}`} style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.95rem',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {alert.type === 'green' ? '✅' : '⚠️'} {alert.message}
            </div>
          )}

          {/* Modular Sidebar Split */}
          <div className="grid-cols-12" style={{ alignItems: 'flex-start' }}>
            
            {/* Super Admin Left Sidebar navigation */}
            <div className="col-span-3">
              {/* Desktop view sidebar menu */}
              <div className="admin-desktop-sidebar glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'sticky', top: '100px', padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '8px' }}>
                  SuperAdmin Menu
                </div>
                {sidebarTabs.map((tb) => {
                  const isActive = activeTab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => {
                        setActiveTab(tb.id);
                        if (tb.id !== 'admins') setEditingAdmin(null);
                      }}
                      className={`glass-button secondary ${isActive ? 'active' : ''}`}
                      style={{
                        justifyContent: 'flex-start',
                        padding: '10px 14px',
                        fontSize: '0.85rem',
                        borderLeft: isActive ? '3px solid var(--accent-purple)' : '1px solid transparent',
                        background: isActive ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.01)',
                        color: isActive ? 'white' : 'var(--text-secondary)'
                      }}
                    >
                      <span style={{ marginRight: '10px', color: isActive ? 'var(--accent-purple)' : 'var(--text-muted)' }}>
                        {tb.icon}
                      </span>
                      {tb.label}
                    </button>
                  );
                })}
              </div>

              {/* Mobile view dropdown select */}
              <div className="admin-mobile-select" style={{ display: 'none', marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  📂 Select Console Section:
                </label>
                <select
                  value={activeTab}
                  onChange={(e) => {
                    setActiveTab(e.target.value);
                    if (e.target.value !== 'admins') setEditingAdmin(null);
                  }}
                  className="glass-input"
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'white',
                    borderColor: 'var(--accent-purple)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    width: '100%'
                  }}
                >
                  {sidebarTabs.map((tb) => (
                    <option key={tb.id} value={tb.id} style={{ background: 'var(--bg-primary)', color: 'white' }}>
                      {tb.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Console Workspaces */}
            <div className="col-span-9">

              {/* 1. Overview & Stats Tab */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  {/* Metrics Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                      <div style={{ background: 'rgba(139, 92, 246, 0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users style={{ color: 'var(--accent-purple)' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{metrics.totalAdmins}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Registered Admins</p>
                      </div>
                    </div>

                    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                      <div style={{ background: 'rgba(59, 130, 246, 0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Globe style={{ color: 'var(--accent-blue)' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{metrics.activeSites}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Active Tenants</p>
                      </div>
                    </div>

                    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                      <div style={{ background: 'rgba(245, 158, 11, 0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Ban style={{ color: '#f59e0b' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{metrics.blockedAdmins}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Suspended Accounts</p>
                      </div>
                    </div>

                    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare style={{ color: '#10b981' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{metrics.totalMessages}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Enquiries Sent</p>
                      </div>
                    </div>
                  </div>

                  {/* SaaS Metrics Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award style={{ color: '#10b981' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.75rem', margin: 0 }}>${metrics.totalMRR || 0}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Monthly Recurring Revenue (MRR)</p>
                      </div>
                    </div>

                    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                      <div style={{ background: 'rgba(139, 92, 246, 0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users style={{ color: 'var(--accent-purple)' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{metrics.activePaidUsers || 0}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Active Paid Users</p>
                      </div>
                    </div>

                    <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                      <div style={{ background: 'rgba(59, 130, 246, 0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Globe style={{ color: 'var(--accent-blue)' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{metrics.activeCustomDomains || 0}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Active Custom Domains</p>
                      </div>
                    </div>
                  </div>

                  {/* System overview details panel */}
                  <div className="glass-panel">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} style={{ color: 'var(--accent-purple)' }} /> Central System Operations
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <p>✨ <strong>Category Directories Master:</strong> Manage active categories like <i>Textile, Medical, Sadi Business, Solar panels, Electronics, Kirana Store, Event Planners, Doctors</i> under the **Niche Categories** tab. These populate in home filters automatically.</p>
                      <p>💻 <strong>Branded Tenant Redirections:</strong> Active shops can be visited on custom subdomains. Superadmin can edit credentials and subdomain prefixes securely under **All Shops List** tab.</p>
                      <p>🛡️ <strong>Platform Guards:</strong> Block access to blocked merchant dashboards instantly or purge accounts and dynamic site files permanently.</p>
                    </div>
                  </div>

                </div>
              )}

              {/* 2. Manage Brands / Premium Websites Tab */}
              {activeTab === 'premium_list' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  {/* Account Edit Modal / Panel */}
                  {editingAdmin && (
                    <div className="glass-panel animate-fade-in" style={{ border: '1px solid var(--accent-purple)', boxShadow: '0 0 20px rgba(139,92,246,0.15)' }}>
                      <div className="flex-between" style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Edit size={18} style={{ color: 'var(--accent-purple)' }} />
                          Modify Account Details: {editForm.companyName}
                        </h3>
                        <button onClick={() => setEditingAdmin(null)} className="glass-button secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>✕ Close</button>
                      </div>

                      <form onSubmit={handleUpdateAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Company Shop Name</label>
                            <input
                              type="text"
                              value={editForm.companyName}
                              onChange={(e) => setEditForm(prev => ({ ...prev, companyName: e.target.value }))}
                              className="glass-input"
                              required
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Admin Login Email</label>
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                              className="glass-input"
                              required
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Subdomain Prefix (Will change URL!)</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="text"
                              value={editForm.subdomain}
                              onChange={(e) => setEditForm(prev => ({ ...prev, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                              className="glass-input"
                              style={{ flex: 1 }}
                              required
                            />
                            <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>.localhost:5173</span>
                          </div>
                        </div>

                        {/* select category no dropdown (clickable tags) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select Category Niche (Click Tag)</label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                            {categories.map((c) => {
                              const isSelected = editForm.category === c.name;
                              return (
                                <button
                                  key={c._id}
                                  type="button"
                                  onClick={() => setEditForm(prev => ({ ...prev, category: c.name }))}
                                  style={{
                                    padding: '5px 12px',
                                    fontSize: '0.75rem',
                                    borderRadius: '16px',
                                    border: isSelected ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                                    background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                                    color: isSelected ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  {c.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Phone No</label>
                            <input
                              type="text"
                              value={editForm.phone}
                              onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="glass-input"
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>WhatsApp No</label>
                            <input
                              type="text"
                              value={editForm.whatsapp}
                              onChange={(e) => setEditForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                              className="glass-input"
                            />
                          </div>
                        </div>

                        {/* Address */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>Address Details</span>
                          <input
                            type="text"
                            placeholder="Street / Area Name..."
                            value={editForm.street}
                            onChange={(e) => setEditForm(prev => ({ ...prev, street: e.target.value }))}
                            className="glass-input"
                          />
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                            <input
                              type="text"
                              placeholder="City"
                              value={editForm.city}
                              onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                              className="glass-input"
                              required
                            />
                            <input
                              type="text"
                              placeholder="State"
                              value={editForm.state}
                              onChange={(e) => setEditForm(prev => ({ ...prev, state: e.target.value }))}
                              className="glass-input"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Pin Code"
                              value={editForm.pinCode}
                              onChange={(e) => setEditForm(prev => ({ ...prev, pinCode: e.target.value }))}
                              className="glass-input"
                              required
                            />
                          </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>Extended Shop Details</span>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <input
                              type="text"
                              placeholder="Landmark..."
                              value={editForm.landmark}
                              onChange={(e) => setEditForm(prev => ({ ...prev, landmark: e.target.value }))}
                              className="glass-input"
                            />
                            <input
                              type="text"
                              placeholder="Map Location URL..."
                              value={editForm.mapLocation}
                              onChange={(e) => setEditForm(prev => ({ ...prev, mapLocation: e.target.value }))}
                              className="glass-input"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Remarks (e.g. Open Mon-Sat 9AM-8PM)..."
                            value={editForm.remarks}
                            onChange={(e) => setEditForm(prev => ({ ...prev, remarks: e.target.value }))}
                            className="glass-input"
                          />
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '4px' }}>
                            <input
                              type="checkbox"
                              checked={editForm.isProfessional}
                              onChange={(e) => setEditForm(prev => ({ ...prev, isProfessional: e.target.checked }))}
                            />
                            Mark as Professional Shop Profile
                          </label>
                        </div>

                        {/* Base64 Asset edits */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Logo Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'logo', 'edit')}
                              style={{ fontSize: '0.75rem', width: '100%', marginTop: '4px' }}
                            />
                          </div>
                          <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Hero Banner Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'banner', 'edit')}
                              style={{ fontSize: '0.75rem', width: '100%', marginTop: '4px' }}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/25"
                        >
                          <CheckCircle2 size={18} />
                          Save and Deploy Merchant Updates
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Password Reset Modal Panel */}
                  {resettingId && (
                    <div className="glass-panel animate-fade-in" style={{ border: '1px solid var(--accent-purple)', background: 'rgba(139,92,246,0.05)', padding: '20px' }}>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={16} style={{ color: 'var(--accent-purple)' }} /> Force Reset Login Password
                      </h3>
                      <form onSubmit={handleResetPassword} style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="password"
                          placeholder="Enter new strong password credentials..."
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="glass-input"
                          style={{ flex: 1 }}
                          required
                        />
                        <button type="submit" className="glass-button" style={{ padding: '10px 20px' }}>Save Key</button>
                        <button type="button" onClick={() => setResettingId(null)} className="glass-button secondary" style={{ padding: '10px 20px' }}>Cancel</button>
                      </form>
                    </div>
                  )}

                  {/* Registered Tenant Brands list */}
                  <div className="glass-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                      <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <Building2 size={22} style={{ color: 'var(--accent-purple)' }} />
                        Registered Tenant Brands
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className="glass-input"
                          style={{ padding: '8px 12px', minWidth: '180px', fontSize: '0.85rem' }}
                        >
                          <option value="">All Categories</option>
                          {categories.map(c => (
                            <option key={c._id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <button onClick={handleExportExcel} className="glass-button" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          Export to Excel
                        </button>
                      </div>
                    </div>
                    
                    {admins.filter(adm => adm.tenant && (filterCategory === '' || adm.category === filterCategory)).length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)' }}>No premium websites registered or matching filter.</p>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                              <th style={{ padding: '12px 8px' }}>Company & User</th>
                              <th style={{ padding: '12px 8px' }}>Subdomain (CORS)</th>
                              <th style={{ padding: '12px 8px' }}>City, State</th>
                              <th style={{ padding: '12px 8px' }}>Category</th>
                              <th style={{ padding: '12px 8px' }}>Status</th>
                              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {admins.filter(adm => adm.tenant && (filterCategory === '' || adm.category === filterCategory)).map((adm) => (
                              <tr key={adm._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                                <td style={{ padding: '16px 8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {adm.logo ? (
                                      <img src={adm.logo} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: 'white' }}>
                                        {adm.companyName?.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <div>
                                      <strong style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {adm.companyName}
                                        {adm.isProfessional && <CheckCircle2 size={14} style={{ color: '#10b981' }} title="Professional Profile" />}
                                      </strong>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{adm.username}</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: '16px 8px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                                  <a
                                    href={getSubdomainUrl(adm.subdomain)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
                                  >
                                    {adm.subdomain}.localhost ↗
                                  </a>
                                </td>
                                <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>
                                  {adm.address?.city || 'N/A'}, {adm.address?.state || 'N/A'}
                                </td>
                                <td style={{ padding: '16px 8px' }}>
                                  <span className="badge">{adm.category}</span>
                                </td>
                                <td style={{ padding: '16px 8px' }}>
                                  {adm.isBlocked ? (
                                    <span className="badge red">Blocked</span>
                                  ) : (
                                    <span className="badge green">Active</span>
                                  )}
                                </td>
                                <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                    <button
                                      onClick={() => startEditAdmin(adm)}
                                      className="glass-button secondary"
                                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                      title="Edit Brand details & Subdomain"
                                    >
                                      <Edit size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleToggleBlock(adm._id)}
                                      className={`glass-button secondary ${adm.isBlocked ? 'blocked' : ''}`}
                                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                      title={adm.isBlocked ? 'Unblock login access' : 'Block login access'}
                                    >
                                      <Ban size={13} />
                                    </button>
                                    <button
                                      onClick={() => setResettingId(adm._id)}
                                      className="glass-button secondary"
                                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                      title="Reset password"
                                    >
                                      <KeyRound size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAdmin(adm._id)}
                                      className="glass-button danger"
                                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                      title="Purge brand website"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* Simple Shops List Tab */}
              {activeTab === 'simple_list' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div className="glass-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                      <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <Users size={22} style={{ color: 'var(--accent-purple)' }} />
                        Simple Directory Shops
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className="glass-input"
                          style={{ padding: '8px 12px', minWidth: '180px', fontSize: '0.85rem' }}
                        >
                          <option value="">All Categories</option>
                          {categories.map(c => (
                            <option key={c._id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {admins.filter(adm => !adm.tenant && (filterCategory === '' || adm.category === filterCategory)).length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)' }}>No simple shops registered or matching filter.</p>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                              <th style={{ padding: '12px 8px' }}>Shop Name & User</th>
                              <th style={{ padding: '12px 8px' }}>Category</th>
                              <th style={{ padding: '12px 8px' }}>Status</th>
                              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {admins.filter(adm => !adm.tenant && (filterCategory === '' || adm.category === filterCategory)).map((adm) => (
                              <tr key={adm._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                                <td style={{ padding: '16px 8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {adm.logo ? (
                                      <img src={adm.logo} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: 'white' }}>
                                        {adm.companyName?.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <div>
                                      <strong style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {adm.companyName}
                                        {adm.isProfessional && <CheckCircle2 size={14} style={{ color: '#10b981' }} title="Professional Profile" />}
                                      </strong>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{adm.username}</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>{adm.category || 'N/A'}</td>
                                <td style={{ padding: '16px 8px' }}>
                                  {adm.isBlocked ? (
                                    <span className="badge red" style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px' }}>Blocked</span>
                                  ) : (
                                    <span className="badge green" style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px' }}>Active</span>
                                  )}
                                </td>
                                <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                    <button
                                      onClick={() => startEditAdmin(adm)}
                                      className="glass-button secondary"
                                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                      title="Edit Shop details"
                                    >
                                      <Edit size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleToggleBlock(adm._id)}
                                      className={`glass-button secondary ${adm.isBlocked ? 'blocked' : ''}`}
                                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                      title={adm.isBlocked ? 'Unblock login access' : 'Block login access'}
                                    >
                                      <Ban size={13} />
                                    </button>
                                    <button
                                      onClick={() => setResettingId(adm._id)}
                                      className="glass-button secondary"
                                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                      title="Reset password"
                                    >
                                      <KeyRound size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAdmin(adm._id)}
                                      className="glass-button danger"
                                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                      title="Purge Account Data"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Setup Premium Website Tab */}
              {activeTab === 'premium_create' && (
                <div className="glass-panel">
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={22} style={{ color: 'var(--accent-purple)' }} />
                    Register Your Shop
                  </h2>

                  <form onSubmit={handleAddAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Admin Login Username</label>
                      <input
                        type="text"
                        placeholder="e.g. kiranstore (no spaces, numbers/letters only)"
                        value={adminForm.username}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') }))}
                        className="glass-input"
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Login Email</label>
                        <input
                          type="email"
                          placeholder="admin@shop.com"
                          value={adminForm.email}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                          className="glass-input"
                          required
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Login Password <span style={{color: 'var(--accent-purple)'}}>(Default: shop123)</span></label>
                        <input
                          type="password"
                          placeholder="Min 6 characters..."
                          value={adminForm.password}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                          className="glass-input"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Custom Subdomain Prefix</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="e.g. kiranstore"
                          value={adminForm.subdomain}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                          className="glass-input"
                          style={{ flex: 1 }}
                          required
                        />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold' }}>.localhost</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Company Shop Name</label>
                      <input
                        type="text"
                        placeholder="Kiran Supermarket"
                        value={adminForm.companyName}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, companyName: e.target.value }))}
                        className="glass-input"
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select Category Niche</label>
                      <select
                        value={adminForm.category}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, category: e.target.value }))}
                        className="glass-input"
                        required
                      >
                        <option value="">Select Category...</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                        <input
                          type="text"
                          placeholder="+91 9988776655"
                          value={adminForm.phone}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="glass-input"
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>WhatsApp Number</label>
                        <input
                          type="text"
                          placeholder="919988776655 (digits)"
                          value={adminForm.whatsapp}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                          className="glass-input"
                        />
                      </div>
                    </div>

                    {/* Address Section */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>Address Details</span>
                      <input
                        type="text"
                        placeholder="Street / Area Name..."
                        value={adminForm.street}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, street: e.target.value }))}
                        className="glass-input"
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="City"
                          value={adminForm.city}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, city: e.target.value }))}
                          className="glass-input"
                          required
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={adminForm.state}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, state: e.target.value }))}
                          className="glass-input"
                          required
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Country"
                          value={adminForm.country}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, country: e.target.value }))}
                          className="glass-input"
                        />
                        <input
                          type="text"
                          placeholder="Pin Code"
                          value={adminForm.pinCode}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, pinCode: e.target.value }))}
                          className="glass-input"
                          required
                        />
                      </div>
                    </div>

                    {/* Brand Files upload */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <Image size={14} /> Logo Upload
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'logo', 'create')}
                          style={{ fontSize: '0.75rem', width: '100%', marginTop: '4px' }}
                        />
                        {adminForm.logo && <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '2px' }}>File Attached</div>}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <Image size={14} /> Banner Upload
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'banner', 'create')}
                          style={{ fontSize: '0.75rem', width: '100%', marginTop: '4px' }}
                        />
                        {adminForm.banner && <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '2px' }}>File Attached</div>}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/25 mt-4"
                    >
                      <Plus size={18} />
                      Provision Secure Brand Workspace
                    </button>
                  </form>
                </div>
              )}

              {/* 4. Setup Simple Shop Tab */}
              {activeTab === 'simple_create' && (
                <div className="glass-panel">
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldPlus size={22} style={{ color: 'var(--accent-purple)' }} />
                    Register Simple Directory Shop
                  </h2>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await axios.post(`${API_URL}/auth/register`, {
                        username: adminForm.username,
                        email: adminForm.email,
                        password: adminForm.password,
                        companyName: adminForm.companyName,
                        category: adminForm.category,
                        phone: adminForm.phone,
                        whatsapp: adminForm.whatsapp,
                        landmark: adminForm.landmark,
                        mapLocation: adminForm.mapLocation,
                        additionalItems: adminForm.additionalItems ? adminForm.additionalItems.split(',').map(item => item.trim()) : [],
                        remarks: adminForm.remarks,
                        socialLinks: { website: adminForm.website },
                        address: {
                          street: adminForm.street,
                          city: adminForm.city,
                          state: adminForm.state,
                          pinCode: adminForm.pinCode,
                          country: adminForm.country
                        },
                        logo: adminForm.logo
                      });
                      showAlert('green', `Simple shop "${adminForm.companyName}" successfully registered!`);
                      setAdminForm({ ...adminForm, username: '', email: '', companyName: '', phone: '', whatsapp: '', street: '', city: '', state: '', pinCode: '', logo: '' });
                      setActiveTab('simple_list');
                      loadDashboardData();
                    } catch (err) {
                      showAlert('danger', err.response?.data?.message || 'Failed to register simple shop.');
                    }
                  }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Login Credentials */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={16} /> Login Credentials
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Username *</label>
                          <input
                            type="text"
                            placeholder="johndoe"
                            value={adminForm.username}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') }))}
                            className="glass-input"
                            required
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email *</label>
                          <input
                            type="email"
                            placeholder="john@example.com"
                            value={adminForm.email}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                            className="glass-input"
                            required
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Password *</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={adminForm.password}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                          className="glass-input"
                          required
                        />
                      </div>
                    </div>

                    {/* Basic Details */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={16} /> Basic Details
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Shop / Company Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Kiran General Store"
                            value={adminForm.companyName}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, companyName: e.target.value }))}
                            className="glass-input"
                            required
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Business Category *</label>
                          <select
                            value={adminForm.category}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, category: e.target.value }))}
                            className="glass-input"
                            required
                          >
                            <option value="">Select Category...</option>
                            <option value="Grocery Store (Kirana)">Grocery Store (Kirana)</option>
                            <option value="Fashion & Clothing">Fashion & Clothing</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mobile Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 9876543210"
                            value={adminForm.phone}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>WhatsApp Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 9876543210"
                            value={adminForm.whatsapp}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                            className="glass-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Specific Shop Type */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={16} /> Specific Shop Type or Services Offered
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>What do you sell or what type of shop is it? (Comma separated)</label>
                        <textarea
                          placeholder="e.g. Retail Shop, Grocery Store (Kirana), Supermarket, General Store, Sabji, Cold Drinks OR Software, App Development"
                          value={adminForm.additionalItems}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, additionalItems: e.target.value }))}
                          className="glass-input"
                          style={{ minHeight: '60px' }}
                        />
                      </div>
                    </div>

                    {/* Location Details */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={16} /> Location Details
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Street Address</label>
                          <input
                            type="text"
                            placeholder="e.g. 123 Main Market Road"
                            value={adminForm.street}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, street: e.target.value }))}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Landmark</label>
                          <input
                            type="text"
                            placeholder="e.g. Near City Hospital"
                            value={adminForm.landmark}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, landmark: e.target.value }))}
                            className="glass-input"
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>City</label>
                          <input
                            type="text"
                            placeholder="e.g. Mumbai"
                            value={adminForm.city}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, city: e.target.value }))}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>State</label>
                          <input
                            type="text"
                            placeholder="e.g. Maharashtra"
                            value={adminForm.state}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, state: e.target.value }))}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pin Code</label>
                          <input
                            type="text"
                            placeholder="e.g. 400001"
                            value={adminForm.pinCode}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, pinCode: e.target.value }))}
                            className="glass-input"
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Google Maps Location URL (Optional)</label>
                        <input
                          type="text"
                          placeholder="https://maps.google.com/..."
                          value={adminForm.mapLocation}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, mapLocation: e.target.value }))}
                          className="glass-input"
                        />
                      </div>
                    </div>

                    {/* Additional Information & Images */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Image size={16} /> Additional Information & Images
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Shop Logo or Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'logo', 'create')}
                            className="glass-input"
                            style={{ padding: '8px' }}
                          />
                          {adminForm.logo && <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '2px' }}>File Attached</div>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Website Link (Optional)</label>
                          <input
                            type="url"
                            placeholder="https://myshop.com"
                            value={adminForm.website}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, website: e.target.value }))}
                            className="glass-input"
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Any other remarks?</label>
                        <textarea
                          placeholder="Add any special instructions or remarks here..."
                          value={adminForm.remarks}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, remarks: e.target.value }))}
                          className="glass-input"
                          style={{ minHeight: '60px' }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <ShieldPlus size={18} />
                      Register Simple Shop
                    </button>
                  </form>
                </div>
              )}

              {/* 5. Niche Categories Tab */}
              {activeTab === 'categories' && (
                <div className="glass-panel animate-fade-in">
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={22} style={{ color: 'var(--accent-blue)' }} />
                    Category Niche Directories & Portfolios ({categories.length})
                  </h2>

                  <form onSubmit={handleAddCategory} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr auto', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="e.g. software, textile, medical, doctory, hospital, marble, etc..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="glass-input"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Short description of this industry niche..."
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="glass-input"
                    />
                    <button type="submit" className="glass-button" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '4px', height: '46px' }}>
                      <Plus size={16} /> Add Directory Niche
                    </button>
                  </form>

                  {/* Categories listed beautifully in cards list design */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                    {categories.map((cat) => (
                      <div
                        key={cat._id}
                        className="glass-panel"
                        style={{
                          padding: '16px',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <strong style={{ color: 'white', fontSize: '1rem', display: 'block', marginBottom: '4px' }}>
                            📁 {cat.name}
                          </strong>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                            {cat.description || 'Dynamic category master entry active on public home filters.'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="glass-button danger"
                          style={{ padding: '6px 10px', minWidth: '32px' }}
                          title="Delete niche directory"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscription Plans & Billing Tab */}
              {activeTab === 'plans' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  {managingAdminId && (
                    <div className="glass-panel animate-fade-in" style={{ border: '1px solid var(--accent-purple)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--accent-purple)' }}>
                          🛡️ Manage Controls: {admins.find(a => a._id === managingAdminId)?.companyName || 'Merchant Controls'}
                        </h3>
                        <button onClick={() => setManagingAdminId(null)} className="glass-button secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>✕ Close Controls</button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {/* Section A: Blocking & Restrictions */}
                        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,0.01)' }}>
                          <strong style={{ fontSize: '1rem', color: '#ef4444' }}>🚫 Block & Restrictions Panel</strong>
                          <form onSubmit={handleSaveBlockDetailsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Block Status</span>
                              <select value={blockStatus} onChange={(e) => setBlockStatus(e.target.value)} className="glass-input" style={{ background: '#111', color: 'white' }}>
                                <option value="none">🟢 None (Active)</option>
                                <option value="partial">🟡 Partial Block (Restrict Features)</option>
                                <option value="full">🔴 Full Block (Suspend Account)</option>
                              </select>
                            </div>

                            {blockStatus === 'partial' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Partial Restrictions:</span>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                                  <input type="checkbox" checked={partialDomain} onChange={(e) => setPartialDomain(e.target.checked)} />
                                  Suspend Domain CNAME Links
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                                  <input type="checkbox" checked={partialForm} onChange={(e) => setPartialForm(e.target.checked)} />
                                  Suspend Custom Form Configs
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                                  <input type="checkbox" checked={partialProducts} onChange={(e) => setPartialProducts(e.target.checked)} />
                                  Suspend Online Checkout Cart
                                </label>
                              </div>
                            )}

                            <button type="submit" className="glass-button secondary" style={{ padding: '10px', fontSize: '0.85rem', color: '#ef4444', borderColor: '#ef4444' }}>
                              Apply Block Settings
                            </button>
                          </form>
                        </div>

                        {/* Section B: Broadcast Messages */}
                        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,0.01)' }}>
                          <strong style={{ fontSize: '1rem', color: 'var(--accent-purple)' }}>🔔 Push Admin Notification</strong>
                          <form onSubmit={handleSendNotificationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Message Description</span>
                              <textarea
                                placeholder="Write important updates or warnings..."
                                value={notificationMsg}
                                onChange={(e) => setNotificationMsg(e.target.value)}
                                className="glass-input"
                                rows={3}
                                required
                              />
                            </div>
                            <button type="submit" className="glass-button secondary" style={{ padding: '10px', fontSize: '0.85rem', color: 'var(--accent-purple)', borderColor: 'var(--accent-purple)' }}>
                              Send Notification
                            </button>
                          </form>
                        </div>

                        {/* Section C: WhatsApp Ad Templates */}
                        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,0.01)' }}>
                          <strong style={{ fontSize: '1rem', color: '#16a34a' }}>💬 WhatsApp Advertisement Template</strong>
                          <form onSubmit={handleSaveWhatsappPromoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Marketing Campaign Template</span>
                              <textarea
                                placeholder="Edit default promo content..."
                                value={whatsappTemplateText}
                                onChange={(e) => setWhatsappTemplateText(e.target.value)}
                                className="glass-input"
                                rows={3}
                                required
                              />
                            </div>
                            <button type="submit" className="glass-button secondary" style={{ padding: '10px', fontSize: '0.85rem', color: '#16a34a', borderColor: '#16a34a' }}>
                              Update Promo Template
                            </button>
                          </form>
                        </div>

                        {/* Section D: WhatsApp Marketing Campaigns Tracker History */}
                        <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '20px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <strong style={{ fontSize: '1.1rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MessageSquare size={18} /> WhatsApp Campaigns & Click Analytics Tracker
                          </strong>
                          {loadingAdminCampaigns ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading campaigns statistics...</p>
                          ) : adminCampaignsList.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No WhatsApp campaigns tracked for this merchant.</p>
                          ) : (
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                                <thead>
                                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '8px' }}>Campaign Title</th>
                                    <th style={{ padding: '8px' }}>Message Preview</th>
                                    <th style={{ padding: '8px' }}>Audience</th>
                                    <th style={{ padding: '8px' }}>Status</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>Sent / Clicks</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>CTR</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {adminCampaignsList.map((c) => {
                                    const ctr = c.sentCount > 0 ? ((c.clicksCount / c.sentCount) * 100).toFixed(1) : 0;
                                    return (
                                      <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '10px 8px', fontWeight: 'bold', color: 'white' }}>{c.title}</td>
                                        <td style={{ padding: '10px 8px', color: 'var(--text-muted)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.message}>
                                          {c.message}
                                        </td>
                                        <td style={{ padding: '10px 8px' }}>{c.targetAudience}</td>
                                        <td style={{ padding: '10px 8px' }}>
                                          <span className={`badge ${c.status === 'sent' ? 'green' : 'purple'}`}>
                                            {c.status.toUpperCase()}
                                          </span>
                                        </td>
                                        <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                                          {c.sentCount} / <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>{c.clicksCount}</span>
                                        </td>
                                        <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 'bold', color: ctr > 0 ? '#16a34a' : 'inherit' }}>
                                          {ctr}%
                                        </td>
                                        <td style={{ padding: '10px 8px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                          {new Date(c.createdAt).toLocaleDateString()}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {updatingPlanId && (
                    <div className="glass-panel animate-fade-in" style={{ border: '1px solid var(--accent-purple)', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                          <Award size={18} style={{ color: 'var(--accent-purple)' }} />
                          Update Subscription Plan: {admins.find(a => a._id === updatingPlanId)?.companyName}
                        </h3>
                        <button onClick={() => setUpdatingPlanId(null)} className="glass-button secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>✕ Close</button>
                      </div>

                      <form onSubmit={handleSavePlanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Plan Tier</label>
                            <select
                              value={planForm.planType}
                              onChange={(e) => setPlanForm(prev => ({ ...prev, planType: e.target.value }))}
                              className="glass-input"
                              required
                            >
                              <option value="free">Free Plan ($0/mo)</option>
                              <option value="basic">Basic Plan ($9/mo)</option>
                              <option value="professional">Professional Plan ($29/mo)</option>
                            </select>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Expiration Date</label>
                            <input
                              type="date"
                              value={planForm.planExpiry}
                              onChange={(e) => setPlanForm(prev => ({ ...prev, planExpiry: e.target.value }))}
                              className="glass-input"
                            />
                          </div>
                        </div>

                        <button type="submit" className="glass-button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 20px', fontWeight: 'bold' }}>
                          <CheckCircle2 size={16} /> Save Plan Tier Changes
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="glass-panel">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                      <Award size={22} style={{ color: 'var(--accent-purple)' }} />
                      Subscription Plans & Billing Management
                    </h2>

                    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            <th style={{ padding: '12px 8px' }}>Company & User</th>
                            <th style={{ padding: '12px 8px' }}>Plan Tier</th>
                            <th style={{ padding: '12px 8px' }}>Expiry Date</th>
                            <th style={{ padding: '12px 8px' }}>Status</th>
                            <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {admins.map((adm) => (
                            <tr key={adm._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                              <td style={{ padding: '16px 8px' }}>
                                <strong style={{ color: 'var(--text-primary)' }}>{adm.companyName}</strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{adm.username} ({adm.email})</div>
                              </td>
                              <td style={{ padding: '16px 8px' }}>
                                <span className={`badge ${adm.planType === 'professional' ? 'green' : adm.planType === 'basic' ? 'purple' : ''}`} style={{ textTransform: 'capitalize' }}>
                                  {adm.planType || 'free'}
                                </span>
                              </td>
                              <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>
                                {adm.planExpiry ? new Date(adm.planExpiry).toLocaleDateString() : 'Never'}
                              </td>
                              <td style={{ padding: '16px 8px' }}>
                                {adm.planExpiry && new Date(adm.planExpiry) < new Date() ? (
                                  <span className="badge red">Expired</span>
                                ) : (
                                  <span className="badge green">Active</span>
                                )}
                                {(adm.blockStatus && adm.blockStatus !== 'none') || adm.isBlocked ? (
                                  <span className={`badge ${adm.blockStatus === 'full' || adm.isBlocked ? 'red' : 'orange'}`} style={{ marginLeft: '6px' }}>
                                    {adm.blockStatus === 'full' || adm.isBlocked ? '🚫 Suspended' : '⚠️ Restricted'}
                                  </span>
                                ) : null}
                              </td>
                              <td style={{ padding: '16px 8px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => triggerEditPlan(adm)}
                                  className="glass-button secondary"
                                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                >
                                  Modify Plan
                                </button>
                                <button
                                  onClick={() => triggerManageAdmin(adm)}
                                  className="glass-button"
                                  style={{ padding: '6px 12px', fontSize: '0.85rem', borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}
                                >
                                  Manage Controls
                                </button>
                                <button
                                  onClick={() => handleToggleFullBlock(adm)}
                                  className={`glass-button ${adm.blockStatus === 'full' || adm.isBlocked ? 'green' : 'danger'}`}
                                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                >
                                  {adm.blockStatus === 'full' || adm.isBlocked ? '🟢 Unblock' : '🔴 Block'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* Custom Domain Requests Tab */}
              {activeTab === 'domains' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div className="glass-panel">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                      <Globe size={22} style={{ color: 'var(--accent-blue)' }} />
                      Custom Domain CNAME Requests
                    </h2>

                    {domainRequests.length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)', marginTop: '20px' }}>No domain requests found.</p>
                    ) : (
                      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                              <th style={{ padding: '12px 8px' }}>Merchant Shop</th>
                              <th style={{ padding: '12px 8px' }}>Requested Domain</th>
                              <th style={{ padding: '12px 8px' }}>Requested At</th>
                              <th style={{ padding: '12px 8px' }}>Status</th>
                              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {domainRequests.map((req) => (
                              <tr key={req._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                                <td style={{ padding: '16px 8px' }}>
                                  <strong style={{ color: 'var(--text-primary)' }}>{req.adminId?.companyName || 'N/A'}</strong>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>subdomain: {req.adminId?.subdomain}.localhost</div>
                                </td>
                                <td style={{ padding: '16px 8px', color: 'var(--accent-blue)', fontWeight: 'bold' }}>
                                  {req.requestedDomain}
                                </td>
                                <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>
                                  {new Date(req.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '16px 8px' }}>
                                  <span className={`badge ${req.status === 'approved' ? 'green' : req.status === 'rejected' ? 'red' : 'purple'}`} style={{ textTransform: 'capitalize' }}>
                                    {req.status}
                                  </span>
                                </td>
                                <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                                  {req.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                      <button
                                        onClick={() => handleApproveDomain(req._id)}
                                        className="glass-button"
                                        style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#10b981', color: 'white' }}
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleRejectDomain(req._id)}
                                        className="glass-button danger"
                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  )}
                                  {req.status !== 'pending' && (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Processed</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuperAdminDashboard;
