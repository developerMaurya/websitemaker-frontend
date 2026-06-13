import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Phone, Mail, MapPin, Sparkles, Send, Star, AlertTriangle, Clock,
  ShoppingCart, ShieldAlert, Award, Calendar, HeartHandshake, Eye,
  Video
} from 'lucide-react';
import StarRating from '../components/StarRating';
import { AuthContext } from '../context/AuthContext';

const getMappedBusinessType = (type) => {
  if (!type) return 'Corporate & General';
  const t = type.toLowerCase();

  if (t.includes('kirana') || t.includes('grocery') || t.includes('supermarket') || t.includes('essential')) {
    return 'Kirana & Grocery';
  }
  if (t.includes('event') || t.includes('wedding') || t.includes('party')) {
    return 'Event Planner';
  }
  if (t.includes('software') || t.includes('it') || t.includes('tech') || t.includes('app') || t.includes('web') || t.includes('telecom') || t.includes('internet')) {
    return 'Software Company';
  }
  if (t.includes('solar') || t.includes('renewable') || t.includes('energy')) {
    return 'Real Estate & Plots';
  }
  if (t.includes('doctor') || t.includes('clinic') || t.includes('hospital') || t.includes('healthcare') || t.includes('medical') || t.includes('pathology') || t.includes('blood')) {
    if (t.includes('pharmacy') || t.includes('medicine')) {
      return 'Medical & Pharmacy';
    }
    if (t.includes('diet') || t.includes('nutrition') || t.includes('wellness')) {
      return 'Diet & Nutrition';
    }
    if (t.includes('blood') || t.includes('pathology') || t.includes('lab') || t.includes('test')) {
      return 'Blood Bank & Pathology';
    }
    return 'Hospital & Clinic';
  }
  if (t.includes('textile') || t.includes('fabric') || t.includes('saree') || t.includes('boutique') || t.includes('fashion') || t.includes('clothing') || t.includes('wear') || t.includes('jewellery') || t.includes('beauty')) {
    if (t.includes('saree') || t.includes('boutique') || t.includes('fashion') || t.includes('clothing') || t.includes('jewellery') || t.includes('beauty')) {
      return 'Fashion Boutique';
    }
    return 'Kalin & Textile';
  }
  if (t.includes('electronics') || t.includes('gadget') || t.includes('computer') || t.includes('mobile') || t.includes('cyber cafe') || t.includes('digital') || t.includes('stationery') || t.includes('toy')) {
    return 'Electronics';
  }
  if (t.includes('restaurant') || t.includes('dhaba') || t.includes('food') || t.includes('cafe') || t.includes('dining')) {
    return 'Restaurant & Dhaba';
  }
  if (t.includes('hotel') || t.includes('resort') || t.includes('stay') || t.includes('accommodation') || t.includes('lodg') || t.includes('room') || t.includes('suite')) {
    return 'Hotel';
  }
  if (t.includes('real estate') || t.includes('property') || t.includes('plot') || t.includes('jamin') || t.includes('land') || t.includes('flats')) {
    return 'Real Estate & Plots';
  }
  if (t.includes('construction') || t.includes('building') || t.includes('material') || t.includes('builing')) {
    return 'Building Materials';
  }
  if (t.includes('roofing') || t.includes('centering') || t.includes('shuttering') || t.includes('rent')) {
    return 'Roofing & Centering';
  }
  if (t.includes('gym') || t.includes('fitness') || t.includes('sports') || t.includes('training') || t.includes('yoga') || t.includes('crossfit')) {
    return 'Gym & Fitness';
  }
  if (t.includes('salon') || t.includes('parlour') || t.includes('barber') || t.includes('hair') || t.includes('spa')) {
    return 'Beauty Salon';
  }
  if (t.includes('automobile') || t.includes('garage') || t.includes('car') || t.includes('bike') || t.includes('vehicle') || t.includes('transport') || t.includes('driver')) {
    return 'Automobile & Garage';
  }
  if (t.includes('mandir') || t.includes('spiritual') || t.includes('temple') || t.includes('religious') || t.includes('church') || t.includes('mosque')) {
    return 'Mandir & Spiritual';
  }
  if (t.includes('travel') || t.includes('tour') || t.includes('tourism')) {
    return 'Tour & Travel';
  }
  return 'Corporate & General';
};

const DynamicTenantSite = () => {
  const { subdomain: pathSubdomain } = useParams();
  const { API_URL } = useContext(AuthContext);

  // Core tenant configuration state
  const [tenantData, setTenantData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', mobile: '', address: '', request: '' });
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, review: '' });
  const [formSuccess, setFormSuccess] = useState({ type: '', msg: '' });

  // Shopping Cart & Custom Form States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customFormValues, setCustomFormValues] = useState({});

  // Countdown timer clock
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });

  // Carousel & Typewriter states
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [storefrontTab, setStorefrontTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [reviewsScrollIdx, setReviewsScrollIdx] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState('image');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [previewOverrides, setPreviewOverrides] = useState({
    previewTheme: null,
    previewColorTheme: null,
    previewMode: null,
    previewSeason: null,
    previewFont: null
  });

  useEffect(() => {
    const handlePreviewMessage = (event) => {
      if (event.data && event.data.type === 'PREVIEW_UPDATE') {
        setPreviewOverrides({
          previewTheme: event.data.theme,
          previewColorTheme: event.data.colorTheme,
          previewMode: event.data.mode,
          previewSeason: event.data.season,
          previewFont: event.data.font
        });
      }
    };
    window.addEventListener('message', handlePreviewMessage);
    return () => window.removeEventListener('message', handlePreviewMessage);
  }, []);

  // Interactive Custom Theme Widget states
  const [travelDestination, setTravelDestination] = useState('All');
  const [bookingSuite, setBookingSuite] = useState('Presidential Suite');
  const [bookingNights, setBookingNights] = useState(1);
  const [vipSpaAccess, setVipSpaAccess] = useState(false);
  const [bellSwinging, setBellSwinging] = useState(false);
  const [bellChimesCount, setBellChimesCount] = useState(0);
  const [apiEndpoint, setApiEndpoint] = useState('/api/v1/services');
  const [apiResponse, setApiResponse] = useState(null);
  const [isConsoleLoading, setIsConsoleLoading] = useState(false);
  const [weavingMaterial, setWeavingMaterial] = useState('Mulberry Silk');
  const [organicDye, setOrganicDye] = useState('Saffron Red');
  const [knotDensity, setKnotDensity] = useState('900 KPSI (Medallion Silk)');
  const [isPlayingEqualizer, setIsPlayingEqualizer] = useState(false);

  // Event Planner widget states
  const [eventGuests, setEventGuests] = useState(100);
  const [eventServicesSelected, setEventServicesSelected] = useState(['decor', 'catering']);
  const [selectedEventTheme, setSelectedEventTheme] = useState('');


  // Ref hooks for horizontal scroll snap decks
  const servicesRef = React.useRef(null);
  const reviewsRef = React.useRef(null);

  // Scroll snap left/right controller buttons
  const scrollServices = (direction) => {
    if (servicesRef.current) {
      const scrollAmt = direction === 'left' ? -350 : 350;
      servicesRef.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  const scrollReviews = (direction) => {
    if (reviewsRef.current) {
      const scrollAmt = direction === 'left' ? -350 : 350;
      reviewsRef.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  // HSL tailored vibrant initials avatars color mapping
  const avatarColors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#10b981', // green
    '#f97316', // orange
    '#06b6d4', // cyan
    '#f43f5e'  // rose
  ];

  const getAvatarColor = (name) => {
    if (!name) return avatarColors[0];
    const charCode = name.charCodeAt(0);
    return avatarColors[charCode % avatarColors.length];
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const getCategoryEmoji = (cat) => {
    if (cat === 'All') return '🛍️';
    const c = cat.toLowerCase();
    if (c.includes('food') || c.includes('cafe') || c.includes('bakery')) return '🍕';
    if (c.includes('cloth') || c.includes('fashion') || c.includes('wear')) return '👕';
    if (c.includes('service') || c.includes('repair')) return '🛠️';
    if (c.includes('electronic') || c.includes('device') || c.includes('tech')) return '💻';
    if (c.includes('health') || c.includes('medical') || c.includes('care')) return '🩺';
    if (c.includes('grocer') || c.includes('item') || c.includes('fresh')) return '🍎';
    if (c.includes('home') || c.includes('decor')) return '🏠';
    return '📦';
  };

  // Resolve subdomain dynamically
  const getSubdomain = () => {
    const hostname = window.location.hostname;
    const hasIP = /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/.test(hostname) || hostname.includes(':');
    if (hasIP) {
      return pathSubdomain || 'kiranstore';
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') return pathSubdomain || 'kiranstore';

    // Explicitly ignore main platform domain so we don't accidentally load it as a tenant
    if (
      hostname === 'varanasihub.netlify.app' || 
      hostname === 'websitemaker-frontend.netlify.app'
    ) {
      return pathSubdomain || 'kiranstore';
    }

    // Check if running on localhost subdomain e.g. kiranstore.localhost
    if (hostname.endsWith('.localhost')) {
      return hostname.split('.')[0];
    }

    // Detect if platform domain vs custom domain
    const isPlatformDomain = hostname.toLowerCase().includes('websitemaker') ||
      hostname.toLowerCase().includes('netlify.app') ||
      hostname.toLowerCase().includes('vercel.app') ||
      hostname.toLowerCase().includes('onrender.com');
    if (isPlatformDomain) {
      const parts = hostname.split('.');
      if (parts.length > 2 && parts[0] !== 'www') {
        return parts[0];
      }
      return pathSubdomain || 'kiranstore';
    } else {
      // It is a custom domain! Strip "www." and return the domain.
      return hostname.toLowerCase().replace(/^www\./, '');
    }
  };

  const subdomain = getSubdomain();

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/tenant/subdomain/${subdomain}`);
        setTenantData(res.data.tenant);
        setAdminData(res.data.admin);
      } catch (err) {
        console.error('Failed to resolve tenant site:', err.message);
        setError(err.response?.data?.message || 'Merchant website not registered on this platform.');
      } finally {
        setLoading(false);
      }
    };
    fetchTenantData();
  }, [subdomain, API_URL]);

  // Dynamic SEO Page Title update
  useEffect(() => {
    if (tenantData) {
      document.title = tenantData.pages?.seo?.title || adminData?.companyName || 'Business Store';
    }
  }, [tenantData, adminData]);

  // Live Timer countdown tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              // Reset standard daily countdown
              hours = 23;
              minutes = 59;
              seconds = 59;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Carousel auto-rotate slider
  useEffect(() => {
    const bannerSliderList = tenantData?.pages?.home?.bannerSlider || [];
    if (bannerSliderList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIdx(prev => (prev + 1) % bannerSliderList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tenantData?.pages?.home?.bannerSlider]);

  // Automated typewriter tagline animation
  useEffect(() => {
    let timer;
    const taglineList = [
      adminData?.companyName || 'Premium Storefront',
      tenantData?.pages?.home?.heroSection?.subtitle || 'Your Verified Service Partner',
      tenantData?.pages?.home?.bannerSlider?.[0]?.title || 'Welcome to Our Digital Space',
      'Exclusive Specialized Services & Dynamic Catalogs',
      'Submit the contact form below to redirect directly on WhatsApp!'
    ].filter(Boolean);
    const currentHeadline = taglineList[headlineIndex % taglineList.length];

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(prev => prev.slice(0, -1));
      }, 30);
    } else {
      timer = setTimeout(() => {
        setTypedText(prev => currentHeadline.slice(0, prev.length + 1));
      }, 70);
    }

    if (!isDeleting && typedText === currentHeadline) {
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setHeadlineIndex(prev => prev + 1);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, headlineIndex, adminData, tenantData]);

  const formatWhatsAppNumber = (number) => {
    if (!number) return '919988776655';
    let cleaned = number.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return '91' + cleaned;
    }
    return cleaned;
  };

  // WhatsApp Enquiry workflow with formatted estimate data
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setFormSuccess({ type: '', msg: '' });

    try {
      // 1. Save Enquiry in the database
      await axios.post(`${API_URL}/tenant/subdomain/${subdomain}/messages`, inquiryForm);

      // 2. Format Whatsapp estimate request URL
      const companyName = adminData?.companyName || 'Business Owner';
      const whatsappNo = tenantData?.pages?.contact?.whatsappNumber || adminData?.whatsapp || adminData?.phone || '';

      const whatsappText = `🌟 *NEW SERVICE ESTIMATE REQUEST* 🌟\n\nHello *${companyName}*! 👋\nI have submitted a request details through your *Find My Shop site*:\n\n-------------------------------\n👤 *CUSTOMER PROFILE*\n-------------------------------\n• *Name:* ${inquiryForm.name}\n• *Email:* ${inquiryForm.email}\n• *Mobile No:* ${inquiryForm.mobile}\n• *Delivery Address:* ${inquiryForm.address || 'N/A'}\n\n-------------------------------\n📝 *REQUEST DESCRIPTION*\n-------------------------------\n"${inquiryForm.request}"\n\n-------------------------------\n⚡ *STATUS:* Pending Professional Estimate\n-------------------------------\n\nPlease review and get back to me. Thank you!`;

      // Clean up whatsapp digits only
      const cleanPhone = formatWhatsAppNumber(whatsappNo);

      // Trigger Web WhatsApp redirect in new window
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(whatsappText)}`;
      window.open(whatsappUrl, '_blank');

      setFormSuccess({ type: 'inquiry', msg: 'Enquiry submitted successfully! Initiating WhatsApp chat redirect...' });

      // Reset form
      setInquiryForm({ name: '', email: '', mobile: '', address: '', request: '' });
    } catch (err) {
      setFormSuccess({ type: 'error', msg: err.response?.data?.message || 'Failed to submit enquiry.' });
    }
  };

  // Custom Form Submission Handler
  const handleCustomFormSubmit = async (e) => {
    e.preventDefault();
    setFormSuccess({ type: '', msg: '' });
    try {
      const nameVal = customFormValues['Full Name'] || customFormValues['Name'] || 'Anonymous Guest';

      const payload = {
        name: nameVal,
        submittedData: customFormValues
      };

      await axios.post(`${API_URL}/tenant/subdomain/${subdomain}/messages`, payload);

      const companyName = adminData?.companyName || 'Business Owner';
      const whatsappNo = tenantData?.pages?.contact?.whatsappNumber || adminData?.whatsapp || adminData?.phone || '';

      let fieldsText = '';
      Object.entries(customFormValues).forEach(([key, val]) => {
        fieldsText += `• *${key}:* ${val}\n`;
      });

      const whatsappText = `🌟 *NEW CUSTOM FORM INQUIRY* 🌟\n\nHello *${companyName}*! 👋\nI have submitted an inquiry through your *Find My Shop site*:\n\n-------------------------------\n📋 *SUBMITTED DETAILS*\n-------------------------------\n${fieldsText}\n-------------------------------\n⚡ Please review and get back to me. Thank you!`;

      const cleanPhone = formatWhatsAppNumber(whatsappNo);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(whatsappText)}`;
      window.open(whatsappUrl, '_blank');

      setFormSuccess({ type: 'inquiry', msg: 'Inquiry details registered! Redirecting to WhatsApp chat...' });
      setCustomFormValues({});
    } catch (err) {
      setFormSuccess({ type: 'error', msg: err.response?.data?.message || 'Failed to submit dynamic form.' });
    }
  };

  // Cart Helper functions
  const addToCart = (product) => {
    if (adminData?.partialBlockSettings?.blockProducts) {
      alert("Online shopping cart checkout is temporarily unavailable for this website.");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.title === product.title);
      if (existing) {
        return prev.map(item => item.product.title === product.title ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (product) => {
    setCart(prev => prev.filter(item => item.product.title !== product.title));
  };

  const updateQuantity = (product, qty) => {
    if (qty <= 0) {
      removeFromCart(product);
      return;
    }
    setCart(prev => prev.map(item => item.product.title === product.title ? { ...item, quantity: qty } : item));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.product.price) || 0) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartCheckout = () => {
    if (cart.length === 0) return;
    const companyName = adminData?.companyName || 'Business Owner';
    const whatsappNo = tenantData?.pages?.contact?.whatsappNumber || adminData?.whatsapp || adminData?.phone || '';

    let itemsText = '';
    cart.forEach((item, index) => {
      const itemPrice = Number(item.product.price) || 0;
      const subtotal = itemPrice * item.quantity;
      itemsText += `${index + 1}. *${item.product.title}* [Qty: ${item.quantity}] - ₹${itemPrice} (Subtotal: ₹${subtotal})\n`;
    });

    const whatsappText = `🛒 *NEW SHOPPING CART ORDER* 🛒\n\nHello *${companyName}*! 👋\nI would like to place the following order through your website:\n\n-------------------------------\n📦 *ORDER SUMMARY*\n-------------------------------\n${itemsText}\n-------------------------------\n💰 *TOTAL ESTIMATE:* ₹${cartTotal.toLocaleString()}\n-------------------------------\n\nPlease confirm availability and payment details. Thank you!`;

    const cleanPhone = formatWhatsAppNumber(whatsappNo);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappUrl, '_blank');

    setCart([]);
    setIsCartOpen(false);
  };

  // Review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setFormSuccess({ type: '', msg: '' });

    try {
      const res = await axios.post(`${API_URL}/tenant/subdomain/${subdomain}/reviews`, reviewForm);
      setTenantData(prev => ({ ...prev, ratings: res.data.ratings }));
      setFormSuccess({ type: 'review', msg: 'Thank you! Your guest review has been posted successfully.' });
      setReviewForm({ name: '', rating: 5, review: '' });
    } catch (err) {
      setFormSuccess({ type: 'error', msg: err.response?.data?.message || 'Failed to post review.' });
    }
  };

  if (loading) {
    return <div style={{ backgroundColor: '#0a0b10', minHeight: '100vh' }} />;
  }

  if (error) {
    const isSuspended = error.toLowerCase().includes('suspended') || error.toLowerCase().includes('blocked') || error.toLowerCase().includes('denied');
    return (
      <div style={{ color: 'white', padding: '100px 20px', textAlign: 'center', backgroundColor: '#0a0b10', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <ShieldAlert size={64} style={{ color: '#ef4444', marginBottom: '20px' }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{isSuspended ? 'Website Suspended' : 'Website Not Found'}</h2>
        <p style={{ color: '#9ca3af', maxWidth: '450px', marginBottom: '30px' }}>{error}</p>
        <Link to="/" className="glass-button" style={{ textDecoration: 'none' }}>
          Return to Portal Directory
        </Link>
      </div>
    );
  }

  // Sandboxed Preview Query Parameters Parser
  const getPreviewParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      previewTheme: params.get('previewTheme'),
      previewColorTheme: params.get('previewColorTheme'),
      previewMode: params.get('previewMode'),
      previewSeason: params.get('previewSeason'),
      previewFont: params.get('previewFont')
    };
  };

  const previewParams = getPreviewParams();

  // Extract tenant configurations with Sandbox Preview Overrides
  const { theme, pages, ratings = [] } = tenantData;

  const rawBusinessType = previewOverrides.previewTheme || previewParams.previewTheme || theme?.businessType || 'Kirana Store';
  const activeBusinessType = getMappedBusinessType(rawBusinessType);
  const activeColorTheme = previewOverrides.previewColorTheme || previewParams.previewColorTheme || theme?.colorTheme || 'Blue';
  const activeThemeMode = previewOverrides.previewMode || previewParams.previewMode || theme?.themeMode || 'Dark';
  const activeSeasonType = previewOverrides.previewSeason || previewParams.previewSeason || theme?.seasonType || 'Default';
  const activeFontStyle = previewOverrides.previewFont || previewParams.previewFont || theme?.fontStyle || 'Modern';

  const getDynamicLabels = () => {
    const type = activeBusinessType;
    switch (type) {
      case 'Event Planner': return { services: 'Decor & Planning 🎪', products: 'Event Packages 🍾' };
      case 'Hotel': return { services: 'Amenities & Facilities 🏨', products: 'Luxury Suites & Rooms 🛌️' };
      case 'Tour & Travel': return { services: 'Travel Services ✈️', products: 'Tour Packages 🌍' };
      case 'Mandir & Spiritual': return { services: 'Darshan & Aarti Timings 🛕', products: 'Puja Sankalpa Bookings 🙏' };
      case 'Software Company': return { services: 'Consultation Offerings 💻', products: 'SaaS Product Inventory 🚀' };
      case 'Kalin & Textile': return { services: 'Custom Crafting Services 🧶', products: 'Premium Rugs & Textiles 🧵' };
      case 'Electronics': return { services: 'Technical Support Packages 🔌', products: 'Device Catalog Inventory ⚡' };
      case 'Real Estate & Plots': return { services: 'Property Consultation 🏗️', products: 'Plots & Properties 🏠' };
      case 'Building Materials': return { services: 'Delivery & Bulk Supply 🚛', products: 'Material Catalog 🧱' };
      case 'Roofing & Centering': return { services: 'Installation Services 🔧', products: 'Sheets & Centering Rentals 🔩' };
      case 'Medical & Pharmacy': return { services: 'Medical Consultation 💊', products: 'Medicines & Health Products 🩺' };
      case 'Hospital & Clinic': return { services: 'OPD & Specialties 🏥', products: 'Health Packages & Tests 🧪' };
      case 'Diet & Nutrition': return { services: 'Diet Plans & Counseling 🥗', products: 'Supplements & Wellness 🌿' };
      case 'Blood Bank & Pathology': return { services: 'Home Collection & Reports 🩸', products: 'Lab Test Packages 🔬' };
      case 'Restaurant & Dhaba': return { services: 'Catering & Events 🍽️', products: 'Menu & Dishes 🍛' };
      case 'Kirana & Grocery': return { services: 'Home Delivery 🛒', products: 'Store Inventory 📦' };
      case 'Beauty Salon': return { services: 'Salon Treatments 💄', products: 'Beauty Products & Kits 🧴' };
      case 'Gym & Fitness': return { services: 'Training Programs 💪', products: 'Membership Plans & Supplements 🏋️' };
      case 'Automobile & Garage': return { services: 'Repair & Servicing 🔧', products: 'Parts & Accessories 🚗' };
      case 'Fashion Boutique': return { services: 'Tailoring & Alterations 🪡', products: 'Fashion Collection 👗' };
      case 'Corporate & General': return { services: 'Business Services 🏢', products: 'Products & Solutions 📦' };
      default: return { services: 'Store Services 🛠️', products: 'Store Products Inventory 🛍️' };
    }
  };

  const dynamicLabels = getDynamicLabels();

  const isDarkModeTheme = activeColorTheme === 'Dark Mode' || activeThemeMode === 'Dark';

  // Format classes configurations
  const colorThemeClass = `theme-${activeColorTheme.toLowerCase().replace(/\s+/g, '')}`;
  const seasonClass = activeSeasonType !== 'Default' ? `season-${activeSeasonType.toLowerCase().replace(/\s+/g, '')}` : '';
  const baseLayoutTheme = isDarkModeTheme ? 'tenant-dark-theme' : 'tenant-light-theme';

  // Calculate review metrics
  const avgRating = ratings.length > 0
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
    : '5.0';

  // Defensive Visibility checks
  const sectionVisibility = pages.home?.visibility || {
    banner: true,
    welcome: true,
    services: true,
    products: true,
    gallery: true,
    contact: true,
    map: true,
    reviews: true
  };

  const getTypographyStyle = (styleName) => {
    switch (styleName) {
      case 'Modern': return "'Inter', sans-serif";
      case 'Geometric': return "'Outfit', sans-serif";
      case 'Elegant': return "'Playfair Display', serif";
      case 'Bold': return "'Montserrat', sans-serif";
      case 'Futuristic': return "'Space Grotesk', sans-serif";
      case 'Luxury': return "'Cinzel', serif";
      default: return "'Plus Jakarta Sans', sans-serif";
    }
  };

  const getSectionStyle = (visibilityVal) => {
    if (visibilityVal === false || visibilityVal === 'hidden') {
      return { display: 'none' };
    }
    if (typeof visibilityVal === 'string' && visibilityVal.startsWith('translucent')) {
      const pct = visibilityVal.split('-')[1] || '50';
      const opacity = Number(pct) / 100;
      return {
        opacity: opacity,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '60px 20px',
        margin: '30px auto',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        maxWidth: '1280px',
        width: '95%',
        transition: 'all 0.3s ease'
      };
    }
    return {};
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('v=')) {
      const id = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('shorts/')) {
      const id = url.split('shorts/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('embed/')) {
      return url;
    }
    return `https://www.youtube.com/embed/${url.split('/').pop()}`;
  };

  const fontFamily = getTypographyStyle(activeFontStyle || 'Modern');

  // Dynamic Product Category Calculations
  const uniqueCategories = ['All', ...new Set((pages?.products || []).map(p => p.category).filter(Boolean))];
  const filteredProducts = selectedCategory === 'All'
    ? (pages?.products || [])
    : (pages?.products || []).filter(p => p.category === selectedCategory);

  // Dynamic Contrast Theme Mode CSS Variables Mapper
  const getContrastModeCSSVariables = () => {
    const getBrightGradient = (color) => {
      const c = color.toLowerCase();
      if (c.includes('green') || c === 'emerald') return 'linear-gradient(135deg, #064e3b, #111827)';
      if (c.includes('red')) return 'linear-gradient(135deg, #7f1d1d, #1a0b2e)';
      if (c.includes('crimson')) return 'linear-gradient(135deg, #881337, #1a0b0e)';
      if (c.includes('purple')) return 'linear-gradient(135deg, #4c1d95, #0f172a)';
      if (c.includes('rose')) return 'linear-gradient(135deg, #881337, #4c1d95)';
      if (c.includes('indigo')) return 'linear-gradient(135deg, #312e81, #1e1b4b)';
      if (c.includes('orange')) return 'linear-gradient(135deg, #7c2d12, #3b0764)';
      if (c.includes('golden') || c.includes('gold')) return 'linear-gradient(135deg, #713f12, #1c1917)';
      if (c.includes('sky')) return 'linear-gradient(135deg, #0c4a6e, #1e3a5f)';
      if (c.includes('navy') || c.includes('navyblue')) return 'linear-gradient(135deg, #1e3a8a, #0f172a)';
      if (c.includes('teal')) return 'linear-gradient(135deg, #134e4a, #0c2340)';
      return 'linear-gradient(135deg, #1e3a8a, #311042)'; // default blue
    };

    if (activeThemeMode === 'White') {
      return {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f3f4f6',
        '--bg-tertiary': '#e5e7eb',
        '--text-primary': '#111827',
        '--text-secondary': '#4b5563',
        '--text-muted': '#6b7280',
        '--border-color': 'rgba(0, 0, 0, 0.08)',
        '--glass-bg': 'rgba(243, 244, 246, 0.85)',
        '--glass-border': 'rgba(0, 0, 0, 0.06)',
        '--glass-shadow': 'rgba(0, 0, 0, 0.08)'
      };
    }

    if (activeThemeMode === 'Warm') {
      // Cozy sepia/ochre tones — like parchment, terracotta, candlelight
      return {
        '--bg-primary': '#1a120b',
        '--bg-secondary': '#231811',
        '--bg-tertiary': '#2e1f14',
        '--text-primary': '#fef3e2',
        '--text-secondary': '#d4a96a',
        '--text-muted': '#9c7748',
        '--border-color': 'rgba(212, 169, 106, 0.15)',
        '--glass-bg': 'rgba(35, 24, 17, 0.82)',
        '--glass-border': 'rgba(212, 169, 106, 0.1)',
        '--glass-shadow': 'rgba(0, 0, 0, 0.4)'
      };
    }

    if (activeThemeMode === 'Bright') {
      return {
        '--bg-primary': getBrightGradient(activeColorTheme),
        '--bg-secondary': 'rgba(255, 255, 255, 0.04)',
        '--bg-tertiary': 'rgba(255, 255, 255, 0.08)',
        '--text-primary': '#ffffff',
        '--text-secondary': 'rgba(255, 255, 255, 0.7)',
        '--text-muted': 'rgba(255, 255, 255, 0.5)',
        '--border-color': 'rgba(255, 255, 255, 0.12)',
        '--glass-bg': 'rgba(255, 255, 255, 0.05)',
        '--glass-border': 'rgba(255, 255, 255, 0.08)',
        '--glass-shadow': 'rgba(0, 0, 0, 0.35)'
      };
    }

    // Default 'Dark' Mode
    return {
      '--bg-primary': '#0a0b10',
      '--bg-secondary': '#11131c',
      '--bg-tertiary': '#191c28',
      '--text-primary': '#f3f4f6',
      '--text-secondary': '#9ca3af',
      '--text-muted': '#6b7280',
      '--border-color': 'rgba(255, 255, 255, 0.08)',
      '--glass-bg': 'rgba(17, 19, 28, 0.75)',
      '--glass-border': 'rgba(255, 255, 255, 0.06)',
      '--glass-shadow': 'rgba(0, 0, 0, 0.3)'
    };
  };


  // Dynamic bespoke template style injector (Fonts, Backgrounds, Card designs, Animations)
  const getBespokeThemeStyles = () => {
    switch (activeBusinessType) {
      case 'Tour & Travel':
        return `
          :root {
            --primary-accent: #0d9488 !important; /* Teal */
            --primary-gradient: linear-gradient(135deg, #0d9488, #0284c7) !important;
            --primary-glow: rgba(13, 148, 136, 0.3) !important;
            --bg-primary: #0a0f12 !important; /* Deep sea slate dark */
          }
          .tenant-light-theme {
            --bg-primary: #f0fdfa !important; /* Soft mint light */
            --text-primary: #111827 !important;
            --text-secondary: #374151 !important;
            --border-color: rgba(13, 148, 136, 0.1) !important;
          }
          .tenant-dark-theme, .tenant-light-theme {
            font-family: 'Outfit', sans-serif !important;
          }
          .glass-panel {
            border-radius: 24px !important;
            border: 1px solid rgba(13, 148, 136, 0.15) !important;
            background: rgba(255, 255, 255, 0.02) !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
          }
          .glass-panel:hover {
            transform: translateY(-8px) scale(1.02) !important;
            box-shadow: 0 20px 40px rgba(13, 148, 136, 0.25) !important;
            border-color: #0d9488 !important;
          }
          .badge {
            border-radius: 999px !important;
            background: rgba(13, 148, 136, 0.1) !important;
            color: #0d9488 !important;
            border: 1px solid rgba(13, 148, 136, 0.2) !important;
            font-weight: 700 !important;
          }
        `;
      case 'Event Planner':
        return `
          :root {
            --primary-accent: #db2777 !important; /* Rose/Pink */
            --primary-gradient: linear-gradient(135deg, #db2777, #7c3aed) !important;
            --primary-glow: rgba(219, 39, 119, 0.3) !important;
            --bg-primary: #0a050d !important;
          }
          .tenant-light-theme {
            --bg-primary: #fff1f2 !important; /* Soft rose light */
            --text-primary: #4c0519 !important;
            --text-secondary: #881337 !important;
            --border-color: rgba(219, 39, 119, 0.15) !important;
          }
          .tenant-dark-theme, .tenant-light-theme {
            font-family: 'Playfair Display', serif !important;
          }
          .glass-panel {
            border-radius: 20px !important;
            border: 1px solid rgba(219, 39, 119, 0.25) !important;
            background: rgba(255, 255, 255, 0.02) !important;
            box-shadow: 0 10px 30px rgba(219, 39, 119, 0.05) !important;
            transition: all 0.3s ease !important;
          }
          .glass-panel:hover {
            border-color: #db2777 !important;
            box-shadow: 0 15px 35px rgba(219, 39, 119, 0.2) !important;
            transform: translateY(-5px) !important;
          }
          .badge {
            border-radius: 999px !important;
            background: rgba(219, 39, 119, 0.1) !important;
            color: #db2777 !important;
            border: 1px solid rgba(219, 39, 119, 0.2) !important;
          }
        `;
      case 'Hotel':
        return `
          :root {
            --primary-accent: #d4af37 !important; /* Gold */
            --primary-gradient: linear-gradient(135deg, #af8f2c, #705510) !important;
            --primary-glow: rgba(212, 175, 55, 0.25) !important;
            --bg-primary: #0f0c08 !important; /* Luxury deep bronze dark */
          }
          .tenant-light-theme {
            --bg-primary: #faf8f5 !important; /* Luxury marble white */
            --text-primary: #1c1917 !important;
            --text-secondary: #44403c !important;
            --border-color: rgba(212, 175, 55, 0.15) !important;
          }
          .tenant-dark-theme, .tenant-light-theme {
            font-family: 'Cinzel', serif !important;
            letter-spacing: 0.5px !important;
          }
          .glass-panel {
            border-radius: 0px !important; /* Sharp elegant luxury borders */
            border: 1px solid rgba(212, 175, 55, 0.2) !important;
            background: rgba(15, 12, 8, 0.6) !important;
            padding: 30px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
            transition: all 0.5s ease !important;
          }
          .glass-panel:hover {
            border-color: #d4af37 !important;
            background: rgba(212, 175, 55, 0.05) !important;
            box-shadow: 0 8px 30px rgba(212, 175, 55, 0.25) !important;
          }
          .glass-button {
            border-radius: 0px !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            font-weight: 400 !important;
          }
          .badge {
            border-radius: 0px !important;
            border: 1px solid #d4af37 !important;
            background: transparent !important;
            color: #d4af37 !important;
            letter-spacing: 2px !important;
          }
        `;
      case 'Mandir & Spiritual':
        return `
          :root {
            --primary-accent: #ea580c !important; /* Saffron Orange */
            --primary-gradient: linear-gradient(135deg, #ea580c, #f97316) !important;
            --primary-glow: rgba(234, 88, 12, 0.35) !important;
            --bg-primary: #0a0815 !important; /* Temple midnight dark */
          }
          .tenant-light-theme {
            --bg-primary: #fffbeb !important; /* Saffron aura light beige */
            --text-primary: #7c2d12 !important;
            --text-secondary: #9a3412 !important;
            --border-color: rgba(234, 88, 12, 0.15) !important;
          }
          .tenant-dark-theme, .tenant-light-theme {
            font-family: 'Playfair Display', serif !important;
          }
          .glass-panel {
            border-radius: 40px 40px 12px 12px !important; /* Arch temple shapes */
            border: 2px solid rgba(234, 88, 12, 0.15) !important;
            background: rgba(255, 247, 237, 0.03) !important;
            box-shadow: 0 10px 25px rgba(234, 88, 12, 0.05) !important;
            transition: all 0.3s ease !important;
          }
          .glass-panel:hover {
            border-color: #f97316 !important;
            box-shadow: 0 15px 30px rgba(234, 88, 12, 0.25) !important;
            transform: scale(1.01) !important;
          }
          .glass-button {
            border-radius: 30px !important;
            background: linear-gradient(135deg, #f97316, #ea580c) !important;
            color: white !important;
            border: none !important;
            font-weight: bold !important;
          }
          .badge {
            border-radius: 8px !important;
            background: rgba(234, 88, 12, 0.1) !important;
            color: #ea580c !important;
            border: 1px solid rgba(234, 88, 12, 0.2) !important;
          }
          @keyframes swingBellAnim {
            0% { transform: rotate(0); }
            20% { transform: rotate(15deg); }
            40% { transform: rotate(-15deg); }
            60% { transform: rotate(10deg); }
            80% { transform: rotate(-10deg); }
            100% { transform: rotate(0); }
          }
          .bell-swinging {
            animation: swingBellAnim 1.2s ease-in-out;
            transform-origin: top center;
          }
          @keyframes pulseOm {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          .om-wave {
            animation: pulseOm 1.2s ease-out forwards;
          }
        `;
      case 'Software Company':
        return `
          :root {
            --primary-accent: #a855f7 !important; /* Neon Purple */
            --primary-gradient: linear-gradient(135deg, #a855f7, #06b6d4) !important;
            --primary-glow: rgba(168, 85, 247, 0.3) !important;
            --bg-primary: #05050a !important; /* Clean Obsidian dark */
          }
          .tenant-light-theme {
            --bg-primary: #fafafa !important; /* Modern tech white */
            --text-primary: #09090b !important;
            --text-secondary: #27272a !important;
            --border-color: rgba(168, 85, 247, 0.1) !important;
          }
          .tenant-dark-theme, .tenant-light-theme {
            font-family: 'Space Grotesk', sans-serif !important;
          }
          .glass-panel {
            border-radius: 12px !important;
            border: 1px solid rgba(168, 85, 247, 0.2) !important;
            background: rgba(10, 10, 15, 0.95) !important;
            box-shadow: 0 0 15px rgba(168, 85, 247, 0.1) !important;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          }
          .glass-panel:hover {
            border-color: #06b6d4 !important;
            box-shadow: 0 0 25px rgba(6, 182, 212, 0.35) !important;
            transform: translateY(-5px) !important;
          }
          .glass-button {
            border-radius: 6px !important;
            border: 1px solid #a855f7 !important;
            color: white !important;
            background: transparent !important;
            transition: all 0.3s !important;
          }
          .glass-button:hover {
            background: var(--primary-gradient) !important;
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.4) !important;
            border-color: transparent !important;
          }
          .badge {
            border-radius: 4px !important;
            background: rgba(168, 85, 247, 0.15) !important;
            color: #c084fc !important;
            border: 1px solid rgba(168, 85, 247, 0.3) !important;
            font-family: monospace !important;
          }
          .cyber-terminal {
            position: relative;
            overflow: hidden;
            font-family: monospace;
          }
          .cyber-terminal::after {
            content: " ";
            display: block;
            position: absolute;
            top: 0; left: 0; bottom: 0; right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 255, 0, 0.06));
            z-index: 2;
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
          }
        `;
      case 'Kalin & Textile':
        return `
          :root {
            --primary-accent: #b45309 !important; /* Terracotta Amber */
            --primary-gradient: linear-gradient(135deg, #b45309, #d97706) !important;
            --primary-glow: rgba(180, 83, 9, 0.2) !important;
            --bg-primary: #150b07 !important; /* Cozy loom dark */
          }
          .tenant-light-theme {
            --bg-primary: #fdfaf6 !important; /* Cozy weaving linen white */
            --text-primary: #451a03 !important;
            --text-secondary: #78350f !important;
            --border-color: rgba(180, 83, 9, 0.15) !important;
          }
          .tenant-dark-theme, .tenant-light-theme {
            font-family: 'Playfair Display', serif !important;
          }
          .glass-panel {
            border-radius: 16px !important;
            border: 2px dashed rgba(180, 83, 9, 0.3) !important;
            background: rgba(254, 252, 250, 0.02) !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05) !important;
            transition: all 0.3s ease !important;
          }
          .glass-panel:hover {
            border-color: #b45309 !important;
            border-style: solid !important;
            box-shadow: 0 12px 30px rgba(180, 83, 9, 0.2) !important;
          }
          .glass-button {
            border-radius: 8px !important;
            border: 1px solid #b45309 !important;
            color: #b45309 !important;
            background: rgba(254, 252, 250, 0.05) !important;
          }
          .badge {
            border-radius: 12px !important;
            background: rgba(180, 83, 9, 0.1) !important;
            color: #b45309 !important;
            border: 1px solid rgba(180, 83, 9, 0.2) !important;
          }
        `;
      case 'Electronics':
        return `
          :root {
            --primary-accent: #06b6d4 !important; /* Cyber Neon Blue */
            --primary-gradient: linear-gradient(135deg, #06b6d4, #2563eb) !important;
            --primary-glow: rgba(6, 182, 212, 0.3) !important;
            --bg-primary: #050b14 !important; /* Tech cyber dark */
          }
          .tenant-light-theme {
            --bg-primary: #f0f9ff !important; /* Clean silicon blue light */
            --text-primary: #0369a1 !important;
            --text-secondary: #075985 !important;
            --border-color: rgba(6, 182, 212, 0.15) !important;
          }
          .tenant-dark-theme, .tenant-light-theme {
            font-family: 'Space Grotesk', sans-serif !important;
          }
          .glass-panel {
            border-radius: 4px !important; /* Cyber sharp edges */
            border: 1px solid rgba(6, 182, 212, 0.3) !important;
            background: rgba(10, 14, 23, 0.9) !important;
            box-shadow: 0 0 10px rgba(6, 182, 212, 0.15) !important;
            transition: all 0.2s ease !important;
          }
          .glass-panel:hover {
            border-color: #06b6d4 !important;
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.45) !important;
            transform: scale(1.02) !important;
          }
          .glass-button {
            border-radius: 2px !important;
            background: var(--primary-gradient) !important;
            border: none !important;
            color: white !important;
            font-weight: bold !important;
          }
          .badge {
            border-radius: 2px !important;
            background: rgba(6, 182, 212, 0.15) !important;
            color: #22d3ee !important;
            border: 1px solid rgba(6, 182, 212, 0.3) !important;
            letter-spacing: 1px !important;
          }
          @keyframes eqBarAnim1 {
            0%, 100% { height: 10px; }
            50% { height: 60px; }
          }
          @keyframes eqBarAnim2 {
            0%, 100% { height: 20px; }
            50% { height: 80px; }
          }
          @keyframes eqBarAnim3 {
            0%, 100% { height: 15px; }
            50% { height: 45px; }
          }
          @keyframes eqBarAnim4 {
            0%, 100% { height: 25px; }
            50% { height: 70px; }
          }
          .eq-bar {
            width: 8px;
            background-color: var(--primary-accent);
            border-radius: 4px;
          }
          .eq-bar-active-1 { animation: eqBarAnim1 0.8s ease-in-out infinite; }
          .eq-bar-active-2 { animation: eqBarAnim2 0.6s ease-in-out infinite; }
          .eq-bar-active-3 { animation: eqBarAnim3 0.7s ease-in-out infinite; }
          .eq-bar-active-4 { animation: eqBarAnim4 0.5s ease-in-out infinite; }
        `;
      // ── Real Estate & Plots ──
      case 'Real Estate & Plots':
        return `
          :root {
            --primary-accent: #15803d !important;
            --primary-gradient: linear-gradient(135deg, #15803d, #166534) !important;
            --primary-glow: rgba(21, 128, 61, 0.3) !important;
            --bg-primary: #040d06 !important;
          }
          .tenant-light-theme {
            --bg-primary: #f0fdf4 !important;
            --text-primary: #14532d !important;
            --text-secondary: #166534 !important;
            --border-color: rgba(21, 128, 61, 0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Montserrat', sans-serif !important; }
          .glass-panel { border-radius: 8px !important; border: 1px solid rgba(21,128,61,0.2) !important; background: rgba(4,13,6,0.7) !important; transition: all 0.3s ease !important; }
          .glass-panel:hover { border-color: #15803d !important; box-shadow: 0 8px 25px rgba(21,128,61,0.2) !important; transform: translateY(-4px) !important; }
          .badge { background: rgba(21,128,61,0.1) !important; color: #15803d !important; border: 1px solid rgba(21,128,61,0.2) !important; }
        `;
      // ── Building Materials ──
      case 'Building Materials':
        return `
          :root {
            --primary-accent: #92400e !important;
            --primary-gradient: linear-gradient(135deg, #92400e, #b45309) !important;
            --primary-glow: rgba(146, 64, 14, 0.25) !important;
            --bg-primary: #0c0a07 !important;
          }
          .tenant-light-theme {
            --bg-primary: #fefce8 !important;
            --text-primary: #451a03 !important;
            --text-secondary: #713f12 !important;
            --border-color: rgba(146,64,14,0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Montserrat', sans-serif !important; }
          .glass-panel { border-radius: 2px !important; border: 1px solid rgba(146,64,14,0.25) !important; background: rgba(12,10,7,0.85) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,0.04) !important; transition: all 0.25s ease !important; }
          .glass-panel:hover { border-color: #b45309 !important; box-shadow: 0 6px 20px rgba(146,64,14,0.3) !important; }
          .badge { border-radius: 2px !important; background: rgba(146,64,14,0.1) !important; color: #b45309 !important; border: 1px solid rgba(146,64,14,0.25) !important; text-transform: uppercase !important; letter-spacing: 1px !important; font-size: 0.65rem !important; }
        `;
      // ── Roofing & Centering ──
      case 'Roofing & Centering':
        return `
          :root {
            --primary-accent: #c2410c !important;
            --primary-gradient: linear-gradient(135deg, #c2410c, #9a3412) !important;
            --primary-glow: rgba(194, 65, 12, 0.25) !important;
            --bg-primary: #0f0a07 !important;
          }
          .tenant-light-theme {
            --bg-primary: #fff7ed !important;
            --text-primary: #431407 !important;
            --text-secondary: #7c2d12 !important;
            --border-color: rgba(194,65,12,0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Inter', sans-serif !important; }
          .glass-panel { border-radius: 4px !important; border: 1px solid rgba(194,65,12,0.2) !important; background: rgba(15,10,7,0.78) !important; transition: all 0.3s ease !important; }
          .glass-panel:hover { border-color: #c2410c !important; box-shadow: 0 8px 24px rgba(194,65,12,0.25) !important; transform: translateY(-3px) !important; }
          .badge { border-radius: 4px !important; background: rgba(194,65,12,0.1) !important; color: #c2410c !important; border: 1px solid rgba(194,65,12,0.2) !important; }
        `;
      // ── Medical & Pharmacy ──
      case 'Medical & Pharmacy':
        return `
          :root {
            --primary-accent: #0284c7 !important;
            --primary-gradient: linear-gradient(135deg, #0284c7, #0369a1) !important;
            --primary-glow: rgba(2, 132, 199, 0.2) !important;
            --bg-primary: #030711 !important;
          }
          .tenant-light-theme {
            --bg-primary: #f0f9ff !important;
            --text-primary: #0c2a4a !important;
            --text-secondary: #075985 !important;
            --border-color: rgba(2,132,199,0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Inter', sans-serif !important; }
          .glass-panel { border-radius: 10px !important; border: 1px solid rgba(2,132,199,0.15) !important; background: rgba(3,7,17,0.72) !important; transition: all 0.3s ease !important; }
          .glass-panel:hover { border-color: #0284c7 !important; box-shadow: 0 8px 25px rgba(2,132,199,0.2) !important; transform: translateY(-4px) !important; }
          .badge { border-radius: 4px !important; background: rgba(2,132,199,0.08) !important; color: #0284c7 !important; border: 1px solid rgba(2,132,199,0.2) !important; font-weight: 600 !important; }
        `;
      // ── Hospital & Clinic ──
      case 'Hospital & Clinic':
        return `
          :root {
            --primary-accent: #0ea5e9 !important; /* Clinical Sky Blue */
            --primary-gradient: linear-gradient(135deg, #0ea5e9, #0284c7) !important;
            --primary-glow: rgba(14, 165, 233, 0.25) !important;
            --bg-primary: #030c16 !important;
          }
          .tenant-light-theme {
            --bg-primary: #f0f9ff !important;
            --text-primary: #0c2240 !important;
            --text-secondary: #0369a1 !important;
            --border-color: rgba(14,165,233,0.1) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Inter', sans-serif !important; }
          .glass-panel { border-radius: 12px !important; border: 1px solid rgba(14,165,233,0.15) !important; background: rgba(3,12,22,0.7) !important; transition: all 0.3s ease !important; }
          .glass-panel:hover { border-color: #0ea5e9 !important; box-shadow: 0 0 0 3px rgba(14,165,233,0.1), 0 8px 25px rgba(14,165,233,0.2) !important; transform: translateY(-4px) !important; }
          .badge { border-radius: 999px !important; background: rgba(14,165,233,0.08) !important; color: #0ea5e9 !important; border: 1px solid rgba(14,165,233,0.2) !important; }
          @keyframes ecgBeat { 0%,100% { width: 0; } 50% { width: 100%; } }
          .glass-button { background: var(--primary-gradient) !important; border: none !important; color: white !important; }
        `;
      // ── Diet & Nutrition ──
      case 'Diet & Nutrition':
        return `
          :root {
            --primary-accent: #059669 !important; /* Emerald Wellness */
            --primary-gradient: linear-gradient(135deg, #059669, #047857) !important;
            --primary-glow: rgba(5, 150, 105, 0.25) !important;
            --bg-primary: #010f08 !important;
          }
          .tenant-light-theme {
            --bg-primary: #ecfdf5 !important;
            --text-primary: #064e3b !important;
            --text-secondary: #065f46 !important;
            --border-color: rgba(5,150,105,0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Outfit', sans-serif !important; }
          .glass-panel { border-radius: 16px !important; border: 1px solid rgba(5,150,105,0.18) !important; background: rgba(1,15,8,0.65) !important; transition: all 0.35s ease !important; }
          .glass-panel:hover { border-color: #059669 !important; box-shadow: 0 10px 30px rgba(5,150,105,0.2) !important; transform: translateY(-6px) scale(1.01) !important; }
          .badge { border-radius: 999px !important; background: rgba(5,150,105,0.08) !important; color: #059669 !important; border: 1px solid rgba(5,150,105,0.2) !important; }
        `;
      // ── Blood Bank & Pathology ──
      case 'Blood Bank & Pathology':
        return `
          :root {
            --primary-accent: #be123c !important; /* Lab Crimson */
            --primary-gradient: linear-gradient(135deg, #be123c, #9f1239) !important;
            --primary-glow: rgba(190, 18, 60, 0.3) !important;
            --bg-primary: #0f0204 !important;
          }
          .tenant-light-theme {
            --bg-primary: #fff1f4 !important;
            --text-primary: #4c0519 !important;
            --text-secondary: #9f1239 !important;
            --border-color: rgba(190,18,60,0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Inter', sans-serif !important; }
          .glass-panel { border-radius: 8px !important; border: 1px solid rgba(190,18,60,0.2) !important; background: rgba(15,2,4,0.8) !important; transition: all 0.3s ease !important; }
          .glass-panel:hover { border-color: #be123c !important; box-shadow: 0 8px 25px rgba(190,18,60,0.25) !important; transform: translateY(-4px) !important; }
          .badge { border-radius: 4px !important; background: rgba(190,18,60,0.08) !important; color: #be123c !important; border: 1px solid rgba(190,18,60,0.2) !important; font-weight: 700 !important; }
          @keyframes dropletFall { 0% { transform: translateY(-20px); opacity: 0; } 80% { opacity: 1; } 100% { transform: translateY(0); opacity: 0.8; } }
        `;
      // ── Restaurant & Dhaba ──
      case 'Restaurant & Dhaba':
        return `
          :root {
            --primary-accent: #dc2626 !important;
            --primary-gradient: linear-gradient(135deg, #dc2626, #b91c1c) !important;
            --primary-glow: rgba(220, 38, 38, 0.3) !important;
            --bg-primary: #0f0403 !important;
          }
          .tenant-light-theme {
            --bg-primary: #fff5f5 !important;
            --text-primary: #450a0a !important;
            --text-secondary: #7f1d1d !important;
            --border-color: rgba(220,38,38,0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Montserrat', sans-serif !important; }
          .glass-panel { border-radius: 16px !important; border: 1px solid rgba(220,38,38,0.15) !important; background: rgba(15,4,3,0.6) !important; transition: all 0.3s ease !important; }
          .glass-panel:hover { border-color: #dc2626 !important; box-shadow: 0 12px 30px rgba(220,38,38,0.25) !important; transform: translateY(-5px) scale(1.01) !important; }
          .badge { border-radius: 999px !important; background: rgba(220,38,38,0.1) !important; color: #ef4444 !important; border: 1px solid rgba(220,38,38,0.2) !important; }
        `;
      // ── Kirana & Grocery ──
      case 'Kirana & Grocery':
        return `
          :root {
            --primary-accent: #16a34a !important;
            --primary-gradient: linear-gradient(135deg, #16a34a, #15803d) !important;
            --primary-glow: rgba(22, 163, 74, 0.25) !important;
            --bg-primary: #031008 !important;
          }
          .tenant-light-theme {
            --bg-primary: #f0fdf4 !important;
            --text-primary: #14532d !important;
            --text-secondary: #166534 !important;
            --border-color: rgba(22,163,74,0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Outfit', sans-serif !important; }
          .glass-panel { border-radius: 12px !important; border: 1px solid rgba(22,163,74,0.15) !important; background: rgba(3,16,8,0.65) !important; transition: all 0.3s ease !important; }
          .glass-panel:hover { border-color: #16a34a !important; box-shadow: 0 8px 24px rgba(22,163,74,0.2) !important; transform: translateY(-4px) !important; }
          .badge { border-radius: 8px !important; background: rgba(22,163,74,0.1) !important; color: #16a34a !important; border: 1px solid rgba(22,163,74,0.2) !important; }
        `;
      // ── Beauty Salon ──
      case 'Beauty Salon':
        return `
          :root {
            --primary-accent: #db2777 !important;
            --primary-gradient: linear-gradient(135deg, #db2777, #9d174d) !important;
            --primary-glow: rgba(219, 39, 119, 0.3) !important;
            --bg-primary: #14060e !important;
          }
          .tenant-light-theme {
            --bg-primary: #fdf2f8 !important;
            --text-primary: #500724 !important;
            --text-secondary: #831843 !important;
            --border-color: rgba(219,39,119,0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Playfair Display', serif !important; }
          .glass-panel { border-radius: 20px !important; border: 1px solid rgba(219,39,119,0.2) !important; background: rgba(20,6,14,0.6) !important; transition: all 0.35s ease !important; }
          .glass-panel:hover { border-color: #db2777 !important; box-shadow: 0 12px 35px rgba(219,39,119,0.3) !important; transform: translateY(-5px) scale(1.01) !important; }
          .badge { border-radius: 999px !important; background: rgba(219,39,119,0.1) !important; color: #db2777 !important; border: 1px solid rgba(219,39,119,0.25) !important; }
        `;
      // ── Gym & Fitness ──
      case 'Gym & Fitness':
        return `
          :root {
            --primary-accent: #ef4444 !important;
            --primary-gradient: linear-gradient(135deg, #ef4444, #dc2626) !important;
            --primary-glow: rgba(239, 68, 68, 0.4) !important;
            --bg-primary: #050202 !important;
          }
          .tenant-light-theme {
            --bg-primary: #fff1f2 !important;
            --text-primary: #0f0202 !important;
            --text-secondary: #450a0a !important;
            --border-color: rgba(239,68,68,0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Montserrat', sans-serif !important; font-weight: 600 !important; }
          .glass-panel { border-radius: 4px !important; border-left: 3px solid #ef4444 !important; border-top: 1px solid rgba(239,68,68,0.15) !important; border-right: 1px solid rgba(239,68,68,0.05) !important; border-bottom: 1px solid rgba(239,68,68,0.05) !important; background: rgba(10,3,3,0.88) !important; transition: all 0.25s ease !important; }
          .glass-panel:hover { border-left-color: #dc2626 !important; box-shadow: 4px 0 20px rgba(239,68,68,0.35), 0 8px 20px rgba(0,0,0,0.3) !important; transform: translateX(3px) !important; }
          .badge { border-radius: 2px !important; background: rgba(239,68,68,0.12) !important; color: #ef4444 !important; border: 1px solid rgba(239,68,68,0.25) !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 1px !important; }
          @keyframes pulseRed { 0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); } 50% { box-shadow: 0 0 0 6px rgba(239,68,68,0); } }
          .pulse-cta { animation: pulseRed 1.5s ease-in-out infinite; }
        `;
      // ── Automobile & Garage ──
      case 'Automobile & Garage':
        return `
          :root {
            --primary-accent: #2563eb !important;
            --primary-gradient: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
            --primary-glow: rgba(37, 99, 235, 0.3) !important;
            --bg-primary: #04060f !important;
          }
          .tenant-light-theme {
            --bg-primary: #eff6ff !important;
            --text-primary: #1e3a8a !important;
            --text-secondary: #1d4ed8 !important;
            --border-color: rgba(37,99,235,0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Space Grotesk', sans-serif !important; }
          .glass-panel { border-radius: 6px !important; border: 1px solid rgba(37,99,235,0.2) !important; background: rgba(4,6,15,0.88) !important; box-shadow: 0 0 8px rgba(37,99,235,0.08) !important; transition: all 0.25s ease !important; }
          .glass-panel:hover { border-color: #2563eb !important; box-shadow: 0 0 22px rgba(37,99,235,0.35) !important; transform: scale(1.02) !important; }
          .badge { border-radius: 3px !important; background: rgba(37,99,235,0.1) !important; color: #3b82f6 !important; border: 1px solid rgba(37,99,235,0.25) !important; letter-spacing: 0.5px !important; }
        `;
      // ── Fashion Boutique ──
      case 'Fashion Boutique':
        return `
          :root {
            --primary-accent: #7c3aed !important;
            --primary-gradient: linear-gradient(135deg, #7c3aed, #6d28d9) !important;
            --primary-glow: rgba(124, 58, 237, 0.3) !important;
            --bg-primary: #0c0610 !important;
          }
          .tenant-light-theme {
            --bg-primary: #faf5ff !important;
            --text-primary: #2e1065 !important;
            --text-secondary: #4c1d95 !important;
            --border-color: rgba(124,58,237,0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Playfair Display', serif !important; }
          .glass-panel { border-radius: 0px 20px 0px 20px !important; border: 1px solid rgba(124,58,237,0.2) !important; background: rgba(12,6,16,0.6) !important; transition: all 0.4s cubic-bezier(0.175,0.885,0.32,1.275) !important; }
          .glass-panel:hover { border-color: #7c3aed !important; box-shadow: 0 15px 40px rgba(124,58,237,0.3) !important; transform: translateY(-8px) rotate(-0.5deg) !important; border-radius: 20px 0px 20px 0px !important; }
          .badge { border-radius: 0px 8px 0px 8px !important; background: rgba(124,58,237,0.1) !important; color: #a78bfa !important; border: 1px solid rgba(124,58,237,0.25) !important; font-style: italic !important; }
        `;
      // ── Corporate & General ──
      case 'Corporate & General':
        return `
          :root {
            --primary-accent: #4338ca !important; /* Corporate Indigo */
            --primary-gradient: linear-gradient(135deg, #4338ca, #3730a3) !important;
            --primary-glow: rgba(67, 56, 202, 0.2) !important;
            --bg-primary: #05070f !important;
          }
          .tenant-light-theme {
            --bg-primary: #eef2ff !important;
            --text-primary: #1e1b4b !important;
            --text-secondary: #3730a3 !important;
            --border-color: rgba(67,56,202,0.12) !important;
          }
          .tenant-dark-theme, .tenant-light-theme { font-family: 'Inter', sans-serif !important; }
          .glass-panel { border-radius: 8px !important; border: 1px solid rgba(67,56,202,0.15) !important; background: rgba(5,7,15,0.72) !important; transition: all 0.3s ease !important; }
          .glass-panel:hover { border-color: #4338ca !important; box-shadow: 0 8px 25px rgba(67,56,202,0.2) !important; transform: translateY(-4px) !important; }
          .badge { border-radius: 4px !important; background: rgba(67,56,202,0.08) !important; color: #6366f1 !important; border: 1px solid rgba(67,56,202,0.2) !important; }
        `;
      default:
        return '';
    }
  };

  const contrastStyleTokens = getContrastModeCSSVariables();

  return (
    <div className={`${baseLayoutTheme} ${colorThemeClass} ${seasonClass}`} style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: fontFamily,
      ...contrastStyleTokens
    }}>

      {/* Bespoke Layout Design CSS overrides */}
      <style>{getBespokeThemeStyles()}</style>

      {/* Blinking Cursor stylesheet override */}
      <style>{`
        @keyframes cursorBlink {
          50% { opacity: 0; }
        }
        .typewriter-cursor {
          animation: cursorBlink 0.75s step-end infinite;
          color: var(--primary-accent, var(--accent-purple));
          margin-left: 3px;
        }
        @media (max-width: 768px) {
          .nav-desktop-links {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .nav-desktop-links {
            display: flex !important;
          }
          .nav-mobile-toggle {
            display: none !important;
          }
          .nav-mobile-menu {
            display: none !important;
          }
        }
      `}</style>



      {/* Tenant Header Navigation */}
      <nav style={{
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 0',
        background: 'var(--bg-secondary)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container flex-between">

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {adminData?.logo ? (
              <img
                src={adminData.logo}
                alt=""
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-accent, var(--accent-purple))' }}
              />
            ) : (
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                {adminData?.companyName?.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <strong style={{ fontSize: '1.2rem', fontFamily: fontFamily }}>{adminData?.companyName}</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{adminData?.category}</div>
            </div>
          </div>

          <div className="nav-desktop-links" style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <button
              onClick={() => setStorefrontTab('home')}
              style={{
                background: 'none',
                border: 'none',
                color: storefrontTab === 'home' ? 'var(--primary-accent, var(--accent-purple))' : 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: storefrontTab === 'home' ? '700' : '500',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Home
            </button>
            <button
              onClick={() => setStorefrontTab('about')}
              style={{
                background: 'none',
                border: 'none',
                color: storefrontTab === 'about' ? 'var(--primary-accent, var(--accent-purple))' : 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: storefrontTab === 'about' ? '700' : '500',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              About Us
            </button>
            <button
              onClick={() => setStorefrontTab('services')}
              style={{
                background: 'none',
                border: 'none',
                color: storefrontTab === 'services' ? 'var(--primary-accent, var(--accent-purple))' : 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: storefrontTab === 'services' ? '700' : '500',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              {dynamicLabels.services.split(' ')[0]} {/* Keep name concise */}
            </button>
            {activeBusinessType !== 'Hotel' && pages.products?.length > 0 && (
              <button
                onClick={() => setStorefrontTab('products')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: storefrontTab === 'products' ? 'var(--primary-accent, var(--accent-purple))' : 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  fontWeight: storefrontTab === 'products' ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
              >
                {dynamicLabels.products.split(' ')[0]} {/* Keep name concise */}
              </button>
            )}
            {(pages.gallery?.length > 0 || pages.home?.videoUrl) && (
              <button
                onClick={() => setStorefrontTab('gallery')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: storefrontTab === 'gallery' ? 'var(--primary-accent, var(--accent-purple))' : 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  fontWeight: storefrontTab === 'gallery' ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
              >
                Gallery
              </button>
            )}
            <button
              onClick={() => setStorefrontTab('contact')}
              style={{
                background: 'none',
                border: 'none',
                color: storefrontTab === 'contact' ? 'var(--primary-accent, var(--accent-purple))' : 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: storefrontTab === 'contact' ? '700' : '500',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Contact
            </button>

            <a
              href={`https://api.whatsapp.com/send?phone=${(pages.contact?.whatsappNumber || adminData?.whatsapp || '').replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button"
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                background: 'var(--primary-gradient)',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 14px var(--primary-glow)'
              }}
            >
              WhatsApp Support
            </a>
          </div>

          <button
            type="button"
            className="nav-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '8px',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className={isMobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
          </button>

        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="nav-mobile-menu animate-fade-in" style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 99,
          position: 'sticky',
          top: '73px'
        }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About Us' },
            { id: 'services', label: dynamicLabels.services.split(' ')[0] },
            ...(activeBusinessType !== 'Hotel' && pages.products?.length > 0 ? [{ id: 'products', label: dynamicLabels.products.split(' ')[0] }] : []),
            ...(pages.gallery?.length > 0 || pages.home?.videoUrl ? [{ id: 'gallery', label: 'Gallery' }] : []),
            { id: 'contact', label: 'Contact' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setStorefrontTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: storefrontTab === item.id ? 'var(--primary-accent, var(--accent-purple))' : 'var(--text-secondary)',
                fontSize: '1rem',
                fontWeight: storefrontTab === item.id ? '700' : '500',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'color 0.2s'
              }}
            >
              {item.label}
            </button>
          ))}
          <a
            href={`https://api.whatsapp.com/send?phone=${(pages.contact?.whatsappNumber || adminData?.whatsapp || '').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button"
            style={{
              padding: '10px 16px',
              fontSize: '0.9rem',
              background: 'var(--primary-gradient)',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 14px var(--primary-glow)',
              textAlign: 'center',
              textDecoration: 'none',
              fontWeight: 'bold',
              borderRadius: '6px',
              marginTop: '8px'
            }}
          >
            WhatsApp Support
          </a>
        </div>
      )}

      {/* Autoscrolling Banner Marquee */}
      {pages.home?.autoScrollText?.show && (
        <div className="marquee-container">
          <div className="marquee-content">
            {pages.home.autoScrollText.text}
          </div>
        </div>
      )}

      {/* -------------------- HOME TAB -------------------- */}
      {storefrontTab === 'home' && (
        <>
          {/* Hero section or Image Banner Slider */}
          {sectionVisibility.banner !== false && (pages.home?.bannerSettings?.show ?? true) && (
            <header style={{ position: 'relative', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
              {(pages.home?.bannerSlider || []).length > 0 ? (
                /* High-res Dynamic Auto-playing Carousel Slider Container */
                <div style={{ position: 'relative', height: '520px', width: '100%', overflow: 'hidden' }}>

                  {/* Active Image with smooth scale Ken Burns style transition */}
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                      src={pages.home.bannerSlider[currentSlideIdx]?.image || adminData?.banner || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80'}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.8s ease' }}
                    />

                    {/* Dynamic Opacity Dark Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: `rgba(0, 0, 0, ${pages.home?.bannerSettings?.opacity ?? 0.5})`,
                      zIndex: 1
                    }}></div>
                  </div>

                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    width: '90%',
                    maxWidth: '800px',
                    color: 'white',
                    zIndex: 2
                  }}>
                    <span className="badge" style={{ background: 'var(--primary-gradient)', color: 'white', border: 'none', marginBottom: '16px' }}>
                      ⭐ {avgRating} Stars Direct Merchant
                    </span>

                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-accent, var(--accent-purple))', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                      Welcome to {adminData?.companyName}
                    </div>

                    <h1 style={{ fontSize: '3.25rem', fontFamily: fontFamily, fontWeight: 800, marginBottom: '16px', lineHeight: 1.15 }}>
                      {pages.home.bannerSlider[currentSlideIdx]?.title}
                    </h1>

                    <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 20px auto' }}>
                      {pages.home.bannerSlider[currentSlideIdx]?.subtitle}
                    </p>

                    {/* Micro-animated automated Tagline typewriter loop */}
                    <div style={{ minHeight: '36px', marginBottom: '16px', fontSize: '1.25rem', color: 'var(--primary-accent, var(--accent-purple))', fontWeight: 'bold' }}>
                      ✨ {typedText}<span className="typewriter-cursor">|</span>
                    </div>

                    {/* Banner slide pricing details */}
                    {pages.home.bannerSlider[currentSlideIdx]?.price > 0 && (
                      <div style={{ fontSize: '1.6rem', marginBottom: '24px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: 'var(--primary-accent, var(--accent-purple))' }}>₹{pages.home.bannerSlider[currentSlideIdx]?.price}</span>
                        {pages.home.bannerSlider[currentSlideIdx]?.originalPrice > 0 && (
                          <span style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '1.2rem', color: '#9ca3af' }}>₹{pages.home.bannerSlider[currentSlideIdx]?.originalPrice}</span>
                        )}
                      </div>
                    )}

                    {pages.home.bannerSlider[currentSlideIdx]?.buttonText ? (
                      <a
                        href={pages.home.bannerSlider[currentSlideIdx]?.buttonLink || '#contact'}
                        className="glass-button"
                        style={{
                          display: 'inline-block',
                          background: 'var(--primary-gradient)',
                          boxShadow: '0 8px 25px var(--primary-glow)',
                          border: 'none',
                          color: 'white',
                          padding: '14px 28px',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          borderRadius: '8px'
                        }}
                      >
                        {pages.home.bannerSlider[currentSlideIdx]?.buttonText}
                      </a>
                    ) : (
                      <button
                        onClick={() => setStorefrontTab('contact')}
                        className="glass-button"
                        style={{
                          background: 'var(--primary-gradient)',
                          boxShadow: '0 8px 25px var(--primary-glow)',
                          border: 'none',
                          color: 'white',
                          padding: '14px 28px',
                          fontWeight: 'bold',
                          borderRadius: '8px'
                        }}
                      >
                        Inquire via WhatsApp
                      </button>
                    )}
                  </div>

                  {/* Slider Left & Right manual controls (Chevron arrows) */}
                  {pages.home.bannerSlider.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentSlideIdx(prev => (prev - 1 + pages.home.bannerSlider.length) % pages.home.bannerSlider.length)}
                        style={{
                          position: 'absolute',
                          left: '20px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: 'white',
                          borderRadius: '50%',
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          zIndex: 3,
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.6)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setCurrentSlideIdx(prev => (prev + 1) % pages.home.bannerSlider.length)}
                        style={{
                          position: 'absolute',
                          right: '20px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: 'white',
                          borderRadius: '50%',
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          zIndex: 3,
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.6)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
                      >
                        ›
                      </button>

                      {/* Dot sliders indicator bar */}
                      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 3 }}>
                        {pages.home.bannerSlider.map((_, idx) => (
                          <div
                            key={idx}
                            onClick={() => setCurrentSlideIdx(idx)}
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: idx === currentSlideIdx ? 'var(--primary-accent, var(--accent-purple))' : 'rgba(255,255,255,0.4)',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              transform: idx === currentSlideIdx ? 'scale(1.2)' : 'none'
                            }}
                          ></div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Fallback text Hero section */
                <div className="section-padding container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <p style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary-accent, var(--accent-purple))', fontWeight: 'bold', marginBottom: '8px' }}>
                    Welcome to
                  </p>
                  <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', fontWeight: 800 }}>{adminData?.companyName}</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 30px auto' }}>
                    Welcome to our official dynamic workspace. Access prime services, catalog lists, and live ratings.
                  </p>
                </div>
              )}
            </header>
          )}

          {/* Business Theme dynamic Skin widgets */}
          <section style={{ background: 'var(--bg-tertiary)', padding: '24px 0', borderBottom: '1px solid var(--border-color)' }}>
            <div className="container flex-center gap-20" style={{ flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: 'var(--primary-accent)' }} />
                <span>Niche Specifics: <strong>{theme?.businessType}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} style={{ color: 'var(--primary-accent)' }} />
                <span>Festival Sales: <strong>{theme?.seasonType}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HeartHandshake size={18} style={{ color: 'var(--primary-accent)' }} />
                <span>Rating Reviews: <strong>{avgRating} Avg</strong></span>
              </div>
            </div>
          </section>

          {/* Welcome text block */}
          {sectionVisibility.welcome !== false && pages.home?.welcomeText?.show && (
            <section className="section-padding" style={{ background: 'var(--bg-primary)', ...getSectionStyle(sectionVisibility.welcome) }}>
              <div className="container">
                <div className="grid-cols-12" style={{ alignItems: 'center' }}>
                  <div className="col-span-8">
                    <span className="badge" style={{ marginBottom: '12px' }}>Corporate Story</span>
                    <h2 style={{ fontSize: '2.25rem', marginBottom: '10px', fontFamily: fontFamily }}>
                      {pages.home.welcomeText.heading || 'Welcome to Our Enterprise'}
                    </h2>

                    {/* Brand custom tagline slogan display in gradient */}
                    {pages.home?.heroSection?.subtitle && (
                      <p style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, var(--primary-accent, var(--accent-purple)), #60a5fa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '16px'
                      }}>
                        ✨ {pages.home.heroSection.subtitle}
                      </p>
                    )}

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
                      {pages.home.welcomeText.paragraph || 'We provide top scale client services and high quality products designed for maximum utility.'}
                    </p>

                    {pages.about?.story && (
                      <div style={{ marginBottom: '24px', borderLeft: '3px solid var(--primary-accent)', paddingLeft: '16px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                        {pages.about.story}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      {pages.about?.mission && (
                        <div>
                          <strong style={{ color: 'var(--primary-accent)' }}>🎯 Our Mission</strong>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{pages.about.mission}</p>
                        </div>
                      )}
                      {pages.about?.vision && (
                        <div>
                          <strong style={{ color: 'var(--primary-accent)' }}>🚀 Our Vision</strong>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{pages.about.vision}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-4" style={{ textAlign: 'center' }}>
                    <div className="glass-panel" style={{ padding: '30px' }}>
                      <img
                        src={adminData?.logo || 'https://images.unsplash.com/photo-1516876437184-593fda40c7cd?auto=format&fit=crop&w=300&q=80'}
                        alt=""
                        style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-accent)', marginBottom: '16px' }}
                      />
                      <h4 style={{ fontSize: '1.25rem' }}>{adminData?.companyName}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Niche: {adminData?.category}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px' }}>
                        📍 {adminData?.address?.city || 'Dehradun'}, {adminData?.address?.state || 'Uttarakhand'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Specialized Services with snap scrolling layout */}
          {sectionVisibility.services !== false && (
            <section className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.services) }}>
              <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                  <div>
                    <span className="badge" style={{ marginBottom: '8px' }}>Active Offerings</span>
                    <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Specialized Services</h2>
                  </div>
                  {pages.services?.length > 3 && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => scrollServices('left')} className="slider-control-btn" aria-label="Scroll services left">‹</button>
                      <button onClick={() => scrollServices('right')} className="slider-control-btn" aria-label="Scroll services right">›</button>
                    </div>
                  )}
                </div>

                {pages.services?.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No services registered yet.</p>
                ) : (
                  <div ref={servicesRef} className="scroll-snap-x hide-scrollbar">
                    {pages.services.map((srv, idx) => (
                      <div key={idx} className="scroll-snap-card glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '30px' }}>
                        <div>
                          {srv.image ? (
                            <img src={srv.image} alt="" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', border: '2px solid var(--primary-accent)' }} />
                          ) : (
                            <div style={{ width: '60px', height: '60px', margin: '0 auto 16px auto', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                              {srv.title?.charAt(0)}
                            </div>
                          )}
                          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{srv.title}</h3>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{srv.description}</p>
                        </div>
                        <a
                          href={`https://api.whatsapp.com/send?phone=${(pages.contact?.whatsappNumber || adminData?.whatsapp || '').replace(/\D/g, '')}&text=${encodeURIComponent(`Hello! I want to inquire about your service: "${srv.title}". Please provide pricing details.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-button secondary"
                          style={{ padding: '8px 16px', fontSize: '0.8rem', width: '100%', marginTop: '20px' }}
                        >
                          Inquire Price
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Video Presentation Showcase Section */}
          {pages.home?.videoUrl && (
            <section className="section-padding" style={{ background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
              <div className="container flex-center" style={{ flexDirection: 'column', gap: '20px' }}>
                <span className="badge">🎥 Video Presentation</span>
                <h2 className="section-title" style={{ marginBottom: '10px' }}>Our Featured Video</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', textAlign: 'center', marginBottom: '20px' }}>
                  Watch our official feature highlights video to see our active services and product catalog in action!
                </p>

                {/* Centered Constrained Video Player (Limited Size constraints) */}
                <div style={{
                  width: '100%',
                  maxWidth: '640px',
                  aspectRatio: '16/9',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 0 25px var(--primary-glow)',
                  border: '2px solid var(--primary-accent, var(--accent-purple))',
                  background: '#000'
                }}>
                  {(pages.home.videoUrl.includes('youtube.com') || pages.home.videoUrl.includes('youtu.be') || pages.home.videoUrl.includes('youtube-nocookie.com')) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(pages.home.videoUrl)}
                      title="YouTube video player"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      src={pages.home.videoUrl}
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    ></video>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Products Catalog section */}
          {sectionVisibility.products !== false && (() => {
            const whatsappNumberClean = (pages.contact?.whatsappNumber || adminData?.whatsapp || adminData?.phone || '').replace(/\D/g, '');
            const companyName = adminData?.companyName || 'Business Owner';

            switch (activeBusinessType) {
              case 'Tour & Travel':
                {
                  if (!pages.products || pages.products.length === 0) return null;

                  const uniqueTravelCategories = ['All', ...new Set((pages.products || []).map(p => p.category).filter(Boolean))];
                  const activeTravelPackages = travelDestination === 'All'
                    ? (pages.products || [])
                    : (pages.products || []).filter(p => p.category === travelDestination);

                  return (
                    <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                      <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                          <span className="badge" style={{ marginBottom: '8px' }}>✈️ Premium Travel Layout</span>
                          <h2 className="section-title" style={{ marginBottom: '10px' }}>🌍 Discover Your Next Adventure</h2>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 20px auto' }}>
                            Explore curated adventure packages, designed for wanderlust and high-end comfort. Click to inquire details directly on WhatsApp!
                          </p>

                          {/* Interactive Destination Category Filter Tabs */}
                          {uniqueTravelCategories.length > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', margin: '20px 0 30px 0' }}>
                              {uniqueTravelCategories.map((cat) => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => setTravelDestination(cat)}
                                  className="glass-button secondary"
                                  style={{
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    color: travelDestination === cat ? 'white' : 'var(--text-secondary)',
                                    borderColor: travelDestination === cat ? 'var(--primary-accent)' : 'var(--glass-border)',
                                    background: travelDestination === cat ? 'var(--primary-accent)' : 'var(--glass-bg)',
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  {cat === 'All' ? '🌐 Show All' : `✈️ ${cat}`}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="grid-cols-12" style={{ marginBottom: '50px' }}>
                          {activeTravelPackages.map((pkg, idx) => {
                            const formattedPrice = pkg.price?.toString().startsWith('₹') ? pkg.price : `₹${pkg.price}`;
                            return (
                              <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', borderRadius: '8px', marginBottom: '16px' }}>
                                  <img src={pkg.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80'} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  <span className="badge" style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--primary-gradient)', border: 'none', color: 'white' }}>{pkg.category || 'Travel'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⏱️ Custom Package</span>
                                  <strong style={{ color: 'var(--primary-accent)', fontSize: '1.2rem' }}>{formattedPrice}</strong>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{pkg.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', flexGrow: 1 }}>{pkg.description}</p>
                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                  <button onClick={() => addToCart(pkg)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                                  <a
                                    href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I want to inquire about the Tour Package: "${pkg.title}" (Category: ${pkg.category || 'General'}, Price: ${formattedPrice}) on your ${companyName} website.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-button"
                                    style={{ flex: 1.5, background: 'var(--primary-gradient)', color: 'white', border: 'none', padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}
                                  >
                                    Book Tour
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="glass-panel" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                          <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🧑‍✈️ Meet Our Adventure Expedition Captains
                          </h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                            {[
                              { name: 'Captain Vikram Singh', specialty: 'Mountaineering Expert', exp: '12+ Years Exp' },
                              { name: 'Meera Nair', specialty: 'Cultural Tour Planner', exp: '8 Years Exp' }
                            ].map((capt, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                  {capt.name.split(' ')[1]?.charAt(0) || 'C'}
                                </div>
                                <div>
                                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>{capt.name}</strong>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{capt.specialty} • {capt.exp}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

              case 'Event Planner':
                {
                  if (!pages.products || pages.products.length === 0) return null;

                  // Find default active package theme
                  const currentThemeName = selectedEventTheme || pages.products[0]?.title || 'Classic Ceremony';
                  const activeThemeObj = pages.products.find(p => p.title === currentThemeName) || pages.products[0];

                  // Local calculations for interactive budget calculator
                  const guestCount = Number(eventGuests) || 100;
                  const perGuestCateringRate = eventServicesSelected.includes('catering') ? 450 : 0;
                  const decorBaseCost = eventServicesSelected.includes('decor') ? (Number(activeThemeObj.price) || 25000) : 0;
                  const djSoundCost = eventServicesSelected.includes('dj') ? 15000 : 0;
                  const photographyCost = eventServicesSelected.includes('photography') ? 20000 : 0;

                  const totalCateringCost = perGuestCateringRate * guestCount;
                  const estimatedBudget = decorBaseCost + totalCateringCost + djSoundCost + photographyCost;

                  const selectedServicesLabels = [];
                  if (eventServicesSelected.includes('decor')) selectedServicesLabels.push(`Decor Styling (${activeThemeObj.title})`);
                  if (eventServicesSelected.includes('catering')) selectedServicesLabels.push(`Catering Service (₹450/guest for ${guestCount} guests)`);
                  if (eventServicesSelected.includes('dj')) selectedServicesLabels.push('DJ & Sound Setup (₹15,000)');
                  if (eventServicesSelected.includes('photography')) selectedServicesLabels.push('Professional Photography (₹20,000)');

                  const whatsappText = `🎉 *EVENT BUDGET & BOOKING PLANNER* 🎉\n\nHello *${companyName}*! 👋\nI calculated a budget estimate for my event on your website:\n\n-------------------------------\n🎪 *SELECTED THEME STYLE*\n-------------------------------\n• *Theme:* ${activeThemeObj.title}\n• *Base Price:* ₹${Number(activeThemeObj.price).toLocaleString()}\n• *Estimated Guests:* ${guestCount} Person(s)\n\n-------------------------------\n🛠️ *ADD-ON SERVICES INCLUDED*\n-------------------------------\n${selectedServicesLabels.map(s => `• ${s}`).join('\n')}\n\n-------------------------------\n💰 *ESTIMATED RECEIPT BUDGET*\n-------------------------------\n• *Estimated Total Cost:* ₹${estimatedBudget.toLocaleString()}\n\n-------------------------------\n⚡ Please confirm booking availability. Thank you!`;

                  return (
                    <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                      <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                          <span className="badge" style={{ marginBottom: '8px' }}>🎪 Elegant Celebration Designs</span>
                          <h2 className="section-title" style={{ marginBottom: '10px' }}>🎪 Bespoke Wedding & Event Planner</h2>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            We plan luxury corporate, wedding, and party experiences. Choose a design theme and use our calculator to estimate budgets.
                          </p>
                        </div>

                        <div className="grid-cols-12" style={{ marginBottom: '50px', gap: '30px' }}>
                          {/* Theme Selector (Left) */}
                          <div className="col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--primary-accent)' }}>✨ Select Theme Experience</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {pages.products.map((pkg, idx) => {
                                const isChosen = currentThemeName === pkg.title;
                                const formattedPrice = pkg.price?.toString().startsWith('₹') ? pkg.price : `₹${Number(pkg.price).toLocaleString()}`;
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => setSelectedEventTheme(pkg.title)}
                                    className="glass-panel"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '20px',
                                      cursor: 'pointer',
                                      borderColor: isChosen ? 'var(--primary-accent)' : 'var(--glass-border)',
                                      background: isChosen ? 'rgba(219, 39, 119, 0.08)' : 'var(--glass-bg)',
                                      padding: '20px',
                                      borderRadius: '12px',
                                      transition: 'all 0.3s ease'
                                    }}
                                  >
                                    <div style={{ width: '100px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                      <img src={pkg.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80'} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flexGrow: 1 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <strong style={{ fontSize: '1.1rem', color: isChosen ? 'white' : 'var(--text-primary)' }}>{pkg.title}</strong>
                                        <span style={{ color: 'var(--primary-accent)', fontWeight: 'bold' }}>{formattedPrice}</span>
                                      </div>
                                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{pkg.description}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Budget & Guest Calculator (Right) */}
                          <div className="col-span-5">
                            <div className="glass-panel" style={{ position: 'sticky', top: '100px', border: '1px solid var(--primary-accent)' }}>
                              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                🧮 Real-Time Event Budget Planner
                              </h3>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                {/* Guest Slider */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Guest Attendance:</span>
                                    <strong style={{ color: 'var(--primary-accent)' }}>{guestCount} Guests</strong>
                                  </div>
                                  <input
                                    type="range"
                                    min="50"
                                    max="1000"
                                    step="25"
                                    value={guestCount}
                                    onChange={(e) => setEventGuests(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--primary-accent)' }}
                                  />
                                </div>

                                {/* Checklist of Addon Services */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Add-on Services:</span>
                                  {[
                                    { id: 'decor', label: `Theme Decor Setup (₹${Number(activeThemeObj.price || 25000).toLocaleString()})` },
                                    { id: 'catering', label: `Catering Buffet (₹450 / Guest)` },
                                    { id: 'dj', label: `Sound System & DJ (₹15,000)` },
                                    { id: 'photography', label: `Photography & Video (₹20,000)` }
                                  ].map(serv => {
                                    const checked = eventServicesSelected.includes(serv.id);
                                    return (
                                      <label key={serv.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={() => {
                                            if (checked) {
                                              setEventServicesSelected(prev => prev.filter(x => x !== serv.id));
                                            } else {
                                              setEventServicesSelected(prev => [...prev, serv.id]);
                                            }
                                          }}
                                          style={{ accentColor: 'var(--primary-accent)' }}
                                        />
                                        {serv.label}
                                      </label>
                                    );
                                  })}
                                </div>

                                <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '10px 0' }} />

                                {/* Cost Receipt */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                  {eventServicesSelected.includes('decor') && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Stage Decor:</span>
                                      <span>₹{decorBaseCost.toLocaleString()}</span>
                                    </div>
                                  )}
                                  {eventServicesSelected.includes('catering') && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Catering ({guestCount} x ₹450):</span>
                                      <span>₹{totalCateringCost.toLocaleString()}</span>
                                    </div>
                                  )}
                                  {eventServicesSelected.includes('dj') && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span>DJ Sound:</span>
                                      <span>₹15,000</span>
                                    </div>
                                  )}
                                  {eventServicesSelected.includes('photography') && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Photography:</span>
                                      <span>₹20,000</span>
                                    </div>
                                  )}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginTop: '10px' }}>
                                    <span>Total Estimate:</span>
                                    <span style={{ color: 'var(--primary-accent)' }}>₹{estimatedBudget.toLocaleString()}</span>
                                  </div>
                                </div>

                                <a
                                  href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(whatsappText)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="glass-button"
                                  style={{
                                    width: '100%',
                                    marginTop: '10px',
                                    background: 'var(--primary-gradient)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    display: 'block',
                                    borderRadius: '8px'
                                  }}
                                >
                                  Inquire & Book on WhatsApp
                                </a>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </section>
                  );
                }

              case 'Hotel':
                {
                  if (!pages.products || pages.products.length === 0) return null;

                  const hotelSuitesList = {};
                  (pages.products || []).forEach(p => {
                    hotelSuitesList[p.title] = { name: p.title, rate: Number(p.price) || 0 };
                  });

                  const firstSuiteKey = pages.products[0]?.title || 'Suite';
                  const activeSuiteKey = hotelSuitesList[bookingSuite] ? bookingSuite : firstSuiteKey;
                  const activeSuiteObj = hotelSuitesList[activeSuiteKey] || { name: 'Luxury Suite', rate: 0 };

                  const baseCost = activeSuiteObj.rate * bookingNights;
                  const spaAddonCost = vipSpaAccess ? 2500 : 0;
                  const totalEstimatedAmount = baseCost + spaAddonCost;

                  const bookingTextFormatted = `🛎️ *LUXURY HOTEL BOOKING RESERVATION* 🛎️\n\nHello *${companyName}*! 👋\nI would like to make a reservation through your website:\n\n-------------------------------\n🏨 *SUITE DETAIL*\n-------------------------------\n• *Room Category:* ${activeSuiteObj.name}\n• *Nights Selected:* ${bookingNights} Night(s)\n• *Base Pricing:* ₹${activeSuiteObj.rate.toLocaleString()} / Night\n• *VIP Wellness Spa:* ${vipSpaAccess ? 'Yes (₹2,500 Included)' : 'No'}\n\n-------------------------------\n💰 *ESTIMATED RECEIPT*\n-------------------------------\n• *Base Amount:* ₹${baseCost.toLocaleString()}\n• *Spa Addon:* ₹${spaAddonCost.toLocaleString()}\n• *TOTAL ESTIMATED COST:* ₹${totalEstimatedAmount.toLocaleString()}\n\n-------------------------------\n⚡ Please confirm availability for my dates. Thank you!`;

                  return (
                    <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                      <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                          <span className="badge" style={{ marginBottom: '8px' }}>🏨 Champagne Luxury Template</span>
                          <h2 className="section-title" style={{ marginBottom: '10px' }}>🏨 Experience Luxury & Serenity</h2>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Welcome to high-end hospitality. Relax in curated luxury suites fitted with premium modern facilities.
                          </p>
                        </div>

                        <div className="grid-cols-12" style={{ marginBottom: '50px', gap: '30px' }}>
                          {/* Suites Cards (Left) */}
                          <div className="col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {pages.products.map((room, idx) => {
                              const isChosen = bookingSuite === room.title || (bookingSuite === 'Presidential Suite' && idx === 0);
                              const formattedPrice = room.price?.toString().startsWith('₹') ? room.price : `₹${Number(room.price).toLocaleString()}`;
                              const amenities = ['WiFi', 'Pool Access', 'Balcony', 'Breakfast Included', room.category || 'Premium Room'];

                              return (
                                <div
                                  key={idx}
                                  onClick={() => setBookingSuite(room.title)}
                                  className="glass-panel"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    cursor: 'pointer',
                                    borderColor: isChosen ? 'var(--primary-accent)' : 'var(--glass-border)',
                                    background: isChosen ? 'rgba(212, 175, 55, 0.08)' : 'var(--glass-bg)',
                                    padding: '20px',
                                    transition: 'all 0.3s ease',
                                    transform: isChosen ? 'scale(1.01)' : 'none'
                                  }}
                                >
                                  <img src={room.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4db85b?auto=format&fit=crop&w=400&q=80'} alt={room.title} style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                                  <div style={{ flexGrow: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{room.title}</h3>
                                      <strong style={{ color: 'var(--primary-accent)', fontSize: '1.05rem' }}>{formattedPrice} / Night</strong>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                                      {amenities.map((am, i) => (
                                        <span key={i} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '2px', color: 'var(--text-secondary)' }}>{am}</span>
                                      ))}
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '8px 0 0 0' }}>{room.description}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Interactive Receipt Calculator Box (Right) */}
                          <div className="col-span-5">
                            <div className="glass-panel" style={{ padding: '24px', border: '2px solid var(--primary-accent)', background: 'rgba(15,12,8,0.95)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div style={{ borderBottom: '1px double var(--primary-accent)', paddingBottom: '12px', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--primary-accent)', textTransform: 'uppercase' }}>ESTIMATE INVOICE RECEIPT</span>
                                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.4rem', fontFamily: 'Cinzel, serif' }}>Luxury Suites Calculator</h3>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Selected Suite Tier:</span>
                                  <select value={bookingSuite} onChange={(e) => setBookingSuite(e.target.value)} className="glass-input" style={{ width: '100%', background: '#1c1917', border: '1px solid var(--primary-accent)', color: 'white', padding: '8px' }}>
                                    {pages.products.map((p, idx) => (
                                      <option key={idx} value={p.title}>{p.title} (₹{Number(p.price).toLocaleString()} / Night)</option>
                                    ))}
                                  </select>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Duration of Stay (Nights):</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button type="button" onClick={() => setBookingNights(prev => Math.max(1, prev - 1))} style={{ width: '36px', height: '36px', background: '#1c1917', border: '1px solid var(--primary-accent)', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>{bookingNights}</span>
                                    <button type="button" onClick={() => setBookingNights(prev => prev + 1)} style={{ width: '36px', height: '36px', background: '#1c1917', border: '1px solid var(--primary-accent)', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Night(s)</span>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                                  <input
                                    type="checkbox"
                                    id="vipSpaAccess"
                                    checked={vipSpaAccess}
                                    onChange={(e) => setVipSpaAccess(e.target.checked)}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary-accent)' }}
                                  />
                                  <label htmlFor="vipSpaAccess" style={{ fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                    🌿 Include VIP Wellness Spa Access (+₹2,500 flat)
                                  </label>
                                </div>
                              </div>

                              <hr style={{ borderColor: 'var(--primary-accent)', opacity: 0.3 }} />

                              {/* Detailed Bill Breakdown */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'var(--text-secondary)' }}>Base Room Cost ({bookingNights} Night(s)):</span>
                                  <span>₹{baseCost.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'var(--text-secondary)' }}>VIP Wellness Spa Package:</span>
                                  <span>₹{spaAddonCost.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '8px', marginTop: '4px', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-accent)' }}>
                                  <span>TOTAL ESTIMATED:</span>
                                  <span>₹{totalEstimatedAmount.toLocaleString()}</span>
                                </div>
                              </div>

                              <a
                                href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(bookingTextFormatted)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-button"
                                style={{
                                  width: '100%',
                                  background: 'var(--primary-gradient)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '12px',
                                  fontSize: '0.9rem',
                                  textTransform: 'uppercase',
                                  letterSpacing: '1px',
                                  textDecoration: 'none',
                                  textAlign: 'center',
                                  marginTop: '10px'
                                }}
                              >
                                Reserve Suite on WhatsApp ↗
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '35px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                          <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', textAlign: 'center' }}>🌟 Premium Hotel Facilities & Wellness Spa</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', textAlign: 'center' }}>
                            {[
                              { name: 'Infinity Rooftop Pool', desc: 'Overlooking breathtaking skylines, open 06:00 AM - 10:00 PM.' },
                              { name: 'Saffron Wellness Spa', desc: 'Traditional herbal Ayurvedic rejuvenation and steam therapies.' },
                              { name: 'Michelin Star Fine Dining', desc: 'Multi-cuisine gastronomy crafted by international guest chefs.' }
                            ].map((fac, i) => (
                              <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--primary-accent)', marginBottom: '6px' }}>{fac.name}</strong>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fac.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

              case 'Mandir & Spiritual':
                {
                  const ringBellAndChime = () => {
                    setBellSwinging(true);
                    setBellChimesCount(prev => prev + 1);
                    setTimeout(() => setBellSwinging(false), 1200);
                  };

                  return (
                    <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                      <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                          <span className="badge" style={{ marginBottom: '8px', background: '#ffedd5', color: '#c2410c', border: 'none' }}>🛕 Saffron Spiritual Layout</span>
                          <h2 className="section-title" style={{ marginBottom: '10px', color: '#ea580c' }}>🛕 Traditional Temple Darshans & Puja Schedules</h2>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Experience holy serenity. View direct Darshan times, book special Pujas, and follow pilgrim guidelines.
                          </p>
                        </div>

                        {/* Interactive Virtual Bell & Aarti Countdown Widget */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                          {/* Virtual Temple Bell */}
                          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center', position: 'relative' }}>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#ea580c', display: 'block', marginBottom: '8px' }}>Pious Virtual Bell</span>
                            <strong style={{ fontSize: '1.2rem', marginBottom: '16px' }}>🔔 Ring the Holy Temple Bell</strong>

                            {/* Bell Swing Container */}
                            <div style={{ position: 'relative', width: '120px', height: '140px', display: 'flex', justifyContent: 'center', cursor: 'pointer' }} onClick={ringBellAndChime}>
                              <div className={bellSwinging ? 'bell-swinging' : ''} style={{ fontSize: '5rem', color: '#d97706', transition: 'transform 0.1s ease', display: 'inline-block' }}>
                                🔔
                              </div>

                              {bellSwinging && (
                                <div className="om-wave" style={{
                                  position: 'absolute',
                                  top: '80%',
                                  fontSize: '1.8rem',
                                  color: '#ea580c',
                                  fontWeight: 'bold',
                                  textShadow: '0 0 10px rgba(234,88,12,0.6)'
                                }}>
                                  OM 🕉️
                                </div>
                              )}
                            </div>

                            <div style={{ marginTop: '16px' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Bell Chimes Count: </span>
                              <strong style={{ fontSize: '1.2rem', color: '#ea580c' }}>{bellChimesCount} Ringer(s)</strong>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Click the bell above to swing and chime virtually!</p>
                            </div>
                          </div>

                          {/* Aarti Live Countdown */}
                          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center', background: 'rgba(234,88,12,0.02)', borderColor: 'rgba(234,88,12,0.2)' }}>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#ea580c', display: 'block', marginBottom: '8px' }}>Devotional Timer</span>
                            <strong style={{ fontSize: '1.2rem', marginBottom: '16px' }}>🌅 Next Sandhya Maha Aarti Darshan</strong>

                            <div style={{ display: 'flex', gap: '10px', fontSize: '2rem', fontWeight: 'bold', color: '#ea580c', background: 'rgba(0,0,0,0.2)', padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(234,88,12,0.3)', fontFamily: 'monospace' }}>
                              <div>{timeLeft.hours.toString().padStart(2, '0')}h</div> :
                              <div>{timeLeft.minutes.toString().padStart(2, '0')}m</div> :
                              <div>{timeLeft.seconds.toString().padStart(2, '0')}s</div>
                            </div>

                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '16px', maxWidth: '300px' }}>
                              The next spiritual Sandhya grand prayers will commence in the evening sanctum instantly at countdown expiry.
                            </p>
                            <span className="badge" style={{ background: 'rgba(234,88,12,0.1)', color: '#ea580c', border: '1px solid rgba(234,88,12,0.2)', marginTop: '10px' }}>🔔 07:00 PM EST Darshan</span>
                          </div>
                        </div>

                        <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                          {[
                            { time: '05:00 AM - 06:00 AM', title: 'Mangala Aarti', desc: 'The auspicious morning offering with vedic chanting.', sponsor: 'Open to All Devotees' },
                            { time: '08:30 AM - 10:00 AM', title: 'Rudrabhishek Puja', desc: 'Sacred consecration of the deity with organic milk & honey.', sponsor: 'WhatsApp Booking Available' },
                            { time: '12:30 PM - 02:00 PM', title: 'Maha Prasad Distribution', desc: 'Devotional distribution of sacred food to all visiting pilgrims.', sponsor: 'Temple Courtyard' },
                            { time: '07:00 PM - 08:00 PM', title: 'Sandhya Maha Aarti', desc: 'Evening grand lamp prayer accompanied by holy sound bells.', sponsor: 'Special Darshan' }
                          ].map((puja, idx) => (
                            <div key={idx} className="col-span-6 glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', borderLeft: '4px solid #ea580c' }}>
                              <div style={{ background: 'rgba(234,88,12,0.1)', padding: '10px', borderRadius: '8px', height: 'fit-content', color: '#ea580c' }}>
                                🛕
                              </div>
                              <div>
                                <span style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 'bold' }}>⏰ {puja.time}</span>
                                <h3 style={{ fontSize: '1.2rem', margin: '4px 0 6px 0' }}>{puja.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>{puja.desc}</p>
                                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>{puja.sponsor}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Sacred Dynamic Puja Sankalpa Bookings Catalog if admin created products */}
                        {pages.products && pages.products.length > 0 && (
                          <div style={{ margin: '50px 0' }}>
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                              <span className="badge" style={{ background: 'rgba(234,88,12,0.1)', color: '#ea580c', border: '1px solid rgba(234,88,12,0.2)' }}>🙏 Special Puja Bookings</span>
                              <h3 style={{ fontSize: '1.8rem', margin: '8px 0', fontFamily: 'Playfair Display, serif', color: '#ea580c' }}>Book Sacred Puja Sankalpa & Offerings</h3>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Select a puja Sankalpa to register. We send live updates and courier dry prasad directly to your home.</p>
                            </div>
                            <div className="grid-cols-12" style={{ gap: '20px' }}>
                              {pages.products.map((p, idx) => {
                                const formattedPrice = p.price?.toString().startsWith('₹') ? p.price : `₹${p.price}`;
                                return (
                                  <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderColor: 'rgba(234, 88, 12, 0.25)', background: 'rgba(255, 247, 237, 0.02)' }}>
                                    <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', borderRadius: '8px', marginBottom: '16px' }}>
                                      <img src={p.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80'} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      <span className="badge" style={{ position: 'absolute', top: '10px', right: '10px', background: '#ea580c', color: 'white', border: 'none' }}>{p.category || 'Puja'}</span>
                                    </div>
                                    <h4 style={{ fontSize: '1.15rem', margin: '0 0 8px 0', color: '#ea580c' }}>{p.title}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px', flexGrow: 1 }}>{p.description}</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', width: '100%' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong style={{ color: '#ea580c', fontSize: '1.2rem' }}>{formattedPrice}</strong>
                                      </div>
                                      <div style={{ display: 'flex', gap: '6px' }}>
                                        <button onClick={() => addToCart(p)} className="glass-button secondary" style={{ flex: 1, padding: '6px', fontSize: '0.8rem', borderColor: 'rgba(234, 88, 12, 0.3)', color: '#ea580c' }}>+ Cart</button>
                                        <a
                                          href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Pranam! I want to register for the Puja Sankalpa: "${p.title}" (Offering: ${formattedPrice}) on your ${companyName} site.`)}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="glass-button"
                                          style={{ flex: 1.5, background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', color: 'white', padding: '6px', fontSize: '0.8rem', textDecoration: 'none', textAlign: 'center' }}
                                        >
                                          Book Puja
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginTop: '30px' }}>
                          <div className="glass-panel" style={{ padding: '30px', border: '1px solid rgba(234, 88, 12, 0.2)', background: 'rgba(234, 88, 12, 0.02)' }}>
                            <h3 style={{ fontSize: '1.3rem', color: '#ea580c', marginBottom: '16px' }}>📜 Sacred Pilgrim Code of Conduct</h3>
                            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              <li>🕉️ Please dress modestly. Traditional clothing is highly encouraged for inner sanctum entry.</li>
                              <li>📴 Keep mobile phones switched off or on silent mode inside the sacred prayer halls.</li>
                              <li>🤫 Maintain complete silence inside the inner sanctum to support deep meditation of fellow devotees.</li>
                              <li>🧼 Cleanse hands and feet at the designated natural water wash taps before entering.</li>
                            </ul>
                          </div>

                          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                            <strong>🙏 Perform Archana Puja Remotely</strong>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              Devotees who cannot travel physically can register for special Sankalpa Pujas. We redirect live WhatsApp updates and courier dry prasad!
                            </p>
                            <a
                              href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Pranam! I want to register a Sankalpa Puja under my name at the ${companyName}. Please share details.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="glass-button"
                              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', color: 'white', padding: '10px 20px', textDecoration: 'none' }}
                            >
                              Book Puja via WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

              case 'Software Company':
                {
                  if (!pages.products || pages.products.length === 0) return null;

                  const triggerSandboxApi = () => {
                    setIsConsoleLoading(true);
                    setApiResponse(null);
                    setTimeout(() => {
                      setIsConsoleLoading(false);
                      let payload = {};
                      if (apiEndpoint === '/api/v1/services') {
                        payload = {
                          status: 'success',
                          latency: '45ms',
                          data: (pages.services || []).map(s => ({
                            serviceName: s.title,
                            description: s.description,
                            endpointActive: true
                          }))
                        };
                      } else if (apiEndpoint === '/api/v1/products') {
                        payload = {
                          status: 'success',
                          latency: '58ms',
                          data: (pages.products || []).map(p => ({
                            itemName: p.title,
                            priceRate: `₹${p.price}`,
                            specsCategory: p.category
                          }))
                        };
                      } else {
                        payload = {
                          status: 'online',
                          apiVersion: '1.42.0-LTS',
                          merchantIdentity: companyName,
                          serverCluster: 'Obsidian-Asia-East-Nodes',
                          activeWebSocketConns: 1284,
                          databaseHealth: '99.98% Healthy Sync'
                        };
                      }
                      setApiResponse(payload);
                    }, 650);
                  };

                  return (
                    <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                      <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                          <span className="badge" style={{ marginBottom: '8px' }}>💻 Obsidian Tech Grid</span>
                          <h2 className="section-title" style={{ marginBottom: '10px' }}>💻 Enterprise SaaS Products & Cloud Platforms</h2>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Unlock absolute optimization. Explore our state of the art software tools, SaaS products, and active developer libraries.
                          </p>
                        </div>

                        {/* Developer API Cyber Console Terminal Sandbox Widget */}
                        <div className="glass-panel" style={{ padding: '30px', border: '1px solid var(--primary-accent)', background: '#030307', marginBottom: '40px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(168,85,247,0.3)', paddingBottom: '14px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
                              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fbbf24' }}></span>
                              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></span>
                              <strong style={{ fontSize: '0.8rem', color: '#a855f7', fontFamily: 'monospace', marginLeft: '10px' }}>sandbox@findmyshop:~ REST API playground</strong>
                            </div>
                            <span className="badge" style={{ scale: '0.85', fontFamily: 'monospace' }}>GET PROTOCOL</span>
                          </div>

                          <div className="grid-cols-12" style={{ alignItems: 'flex-start', gap: '20px' }}>
                            {/* Selector Side */}
                            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>CHOOSE ENDPOINT PATH:</span>
                                <select
                                  value={apiEndpoint}
                                  onChange={(e) => { setApiEndpoint(e.target.value); setApiResponse(null); }}
                                  className="glass-input"
                                  style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#0a0a0f', borderColor: '#a855f7', padding: '10px', color: 'white' }}
                                >
                                  <option value="/api/v1/services">GET /api/v1/services</option>
                                  <option value="/api/v1/products">GET /api/v1/products</option>
                                  <option value="/api/v1/status">GET /api/v1/status</option>
                                </select>
                              </div>

                              <button
                                type="button"
                                onClick={triggerSandboxApi}
                                disabled={isConsoleLoading}
                                className="glass-button"
                                style={{
                                  width: '100%',
                                  fontFamily: 'monospace',
                                  background: 'var(--primary-gradient)',
                                  border: 'none',
                                  color: 'white',
                                  padding: '12px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px'
                                }}
                              >
                                {isConsoleLoading ? '🚀 PINGING...' : '⚡ SEND SANDBOX REQUEST'}
                              </button>

                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                Test simulated API payloads dynamically mapped from custom dashboard configurations. Returns raw JSON nodes instantly.
                              </p>
                            </div>

                            {/* Glowing Screen Side */}
                            <div className="col-span-8">
                              <div className="cyber-terminal" style={{ background: '#05050a', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '8px', padding: '16px', minHeight: '180px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                {isConsoleLoading ? (
                                  <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#06b6d4', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                    <div style={{ width: '20px', height: '20px', border: '2px solid rgba(6,182,212,0.1)', borderTopColor: '#06b6d4', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                                    <span>FETCHING DIRECT REQUEST FOR {apiEndpoint}...</span>
                                  </div>
                                ) : apiResponse ? (
                                  <pre style={{ margin: 0, fontSize: '0.8rem', color: '#34d399', overflowX: 'auto', fontFamily: 'monospace', lineHeight: '1.4', textAlign: 'left' }}>
                                    {JSON.stringify(apiResponse, null, 2)}
                                  </pre>
                                ) : (
                                  <div style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.8rem', margin: 'auto', textAlign: 'center' }}>
                                    <span>CONSOLE IS IDLE.<br />Click 'SEND SANDBOX REQUEST' to view colorized JSON output.</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid-cols-12" style={{ marginBottom: '50px' }}>
                          {pages.products.map((saas, idx) => {
                            const formattedPrice = saas.price?.toString().startsWith('₹') ? saas.price : `₹${saas.price}`;
                            const specs = [
                              saas.category ? `Category: ${saas.category}` : 'Premium Quality Certified',
                              'Full Tech Support Included',
                              'Secure WhatsApp API Integration',
                              '100% Satisfaction Guarantee'
                            ];
                            return (
                              <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderColor: 'rgba(139,92,246,0.3)' }}>
                                <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', borderRadius: '8px', marginBottom: '16px' }}>
                                  <img src={saas.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'} alt={saas.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-purple, #8b5cf6)', fontWeight: 'bold' }}>{saas.category || 'SaaS Product'}</span>
                                  <strong style={{ color: 'var(--primary-accent)', fontSize: '1.15rem' }}>{formattedPrice}</strong>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{saas.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px' }}>{saas.description}</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
                                  {specs.map((sp, i) => (
                                    <span key={i} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>✓ {sp}</span>
                                  ))}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', width: '100%' }}>
                                  <button onClick={() => addToCart(saas)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                                  <a
                                    href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I want a custom demo consult for the SaaS Product: "${saas.title}" (${formattedPrice}) on your ${companyName} website.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-button"
                                    style={{ flex: 1.5, background: 'var(--primary-gradient)', color: 'white', border: 'none', padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}
                                  >
                                    Demo Consult
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="glass-panel" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>⚡ Developer Frameworks & Cloud Integrations</h3>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {['React 19 Server Components', 'NextJS 15 Sandbox', 'GraphQL Queries API', 'TailwindCSS Glassmorphism', 'Docker Kubernetes Orchestration', 'NodeJS ESM Tracing', 'Redis Cache Caching Layers'].map((tag, i) => (
                              <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '6px 12px', borderRadius: '4px', color: 'var(--accent-purple, #8b5cf6)', fontWeight: 'bold' }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

              case 'Kalin & Textile':
                {
                  if (!pages.products || pages.products.length === 0) return null;

                  // Customized loom density calculator
                  const getWeaveMultiplier = () => {
                    let matM = weavingMaterial === 'Mulberry Silk' ? 1.8 : weavingMaterial === 'Pashmina Cashmere' ? 2.5 : 1.0;
                    let denM = knotDensity.includes('1200') ? 2.2 : knotDensity.includes('900') ? 1.6 : 1.0;
                    return matM * denM;
                  };

                  const weaveEstPrice = Math.round(12000 * getWeaveMultiplier());

                  // Swatch coloring logic based on selectedOrganicDye
                  const getSwatchBgColor = () => {
                    if (organicDye === 'Saffron Red') return '#b91c1c';
                    if (organicDye === 'Indigo Blue') return '#1d4ed8';
                    if (organicDye === 'Walnut Brown') return '#78350f';
                    return '#b45309'; // Madder Root Orange/Amber
                  };

                  const loomWhatsAppText = `🧶 *HANDLOOM BESPOKE TEXTILE ORDER* 🧶\n\nHello *${companyName}* 👋\nI would like to place a custom handspun rug swatch order on your website:\n\n-------------------------------\n🧵 *SPECIFICATIONS*\n-------------------------------\n• *Material Type:* ${weavingMaterial}\n• *Organic Vegetable Dye:* ${organicDye}\n• *Knot Density (KPSI):* ${knotDensity}\n• *Estimated Swatch Cost:* ₹${weaveEstPrice.toLocaleString()}\n\nPlease let me know estimated crafting timelines. Thank you!`;

                  return (
                    <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                      <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                          <span className="badge" style={{ marginBottom: '8px' }}>🧶 Organic Fabrics & Weaves</span>
                          <h2 className="section-title" style={{ marginBottom: '10px' }}>🧶 Handcrafted Persian Carpets & Textile Boutique</h2>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Discover majestic heritage prints. Browse original Persian Kalins, organic handspun woolen carpets, and pure Pashmina shawls.
                          </p>
                        </div>

                        {/* Interactive Custom Loom Swatch Fabric Widget */}
                        <div className="grid-cols-12" style={{ gap: '30px', marginBottom: '40px' }}>
                          {/* Interactive Selector Panel */}
                          <div className="col-span-7 glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                            <strong style={{ fontSize: '1.1rem', color: 'var(--primary-accent)', display: 'block' }}>🧶 Custom Loom Weaving Configurator</strong>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Select Thread Material:</span>
                                <select value={weavingMaterial} onChange={(e) => setWeavingMaterial(e.target.value)} className="glass-input" style={{ color: 'white', background: '#1c1917' }}>
                                  <option value="Organic Himalayan Wool">Raw Himalayan Wool (Cozy & Warm)</option>
                                  <option value="Mulberry Silk">Premium Mulberry Silk (Lustrous & Delicate)</option>
                                  <option value="Pashmina Cashmere">Kashmiri Pashmina Cashmere (Royal & Ultrafine)</option>
                                </select>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Organic Vegetable Dye:</span>
                                <select value={organicDye} onChange={(e) => setOrganicDye(e.target.value)} className="glass-input" style={{ color: 'white', background: '#1c1917' }}>
                                  <option value="Saffron Red">Saffron Red (Royal Crimson)</option>
                                  <option value="Indigo Blue">Indigo Blue (Classic Cobalt)</option>
                                  <option value="Walnut Brown">Walnut Brown (Earth Wood)</option>
                                  <option value="Madder Root">Madder Root (Cozy Orange-Amber)</option>
                                </select>
                              </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Knots Density (KPSI):</span>
                              <select value={knotDensity} onChange={(e) => setKnotDensity(e.target.value)} className="glass-input" style={{ color: 'white', background: '#1c1917' }}>
                                <option value="450 KPSI (Cozy)">450 KPSI (Earthy Cozy Wool Weave)</option>
                                <option value="900 KPSI (Medallion Silk)">900 KPSI (Premium Medallion Silk Style)</option>
                                <option value="1200 KPSI (Ultra Collector)">1200 KPSI (Collector Level Heirloom Weave)</option>
                              </select>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', border: '1px dashed var(--primary-accent)' }}>
                              <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Weaving Cost:</span>
                                <strong style={{ display: 'block', fontSize: '1.25rem', color: 'var(--primary-accent)' }}>₹{weaveEstPrice.toLocaleString()}</strong>
                              </div>
                              <a
                                href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(loomWhatsAppText)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-button"
                                style={{ padding: '8px 16px', fontSize: '0.8rem', background: 'var(--primary-gradient)', color: 'white', border: 'none', textDecoration: 'none' }}
                              >
                                Order Custom Loom Weave ↗
                              </a>
                            </div>
                          </div>

                          {/* Custom Interactive Swatch Preview Render */}
                          <div className="col-span-5 glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary-accent)', display: 'block', marginBottom: '12px' }}>Real-time Weave Swatch</span>

                            {/* Swatch Graphics container */}
                            <div style={{
                              width: '180px',
                              height: '180px',
                              backgroundColor: getSwatchBgColor(),
                              borderRadius: '12px',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                              border: '4px solid var(--primary-accent)',
                              display: 'flex',
                              position: 'relative',
                              overflow: 'hidden',
                              backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 15%, transparent 16%), radial-gradient(rgba(255,255,255,0.15) 15%, transparent 16%)',
                              backgroundSize: '16px 16px',
                              backgroundPosition: '0 0, 8px 8px'
                            }}>
                              {/* Fringe Fringe tassels on carpet sides */}
                              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', background: 'repeating-linear-gradient(#fcf3e8, #fcf3e8 4px, transparent 4px, transparent 8px)' }}></div>
                              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '6px', background: 'repeating-linear-gradient(#fcf3e8, #fcf3e8 4px, transparent 4px, transparent 8px)' }}></div>

                              {/* Medallion core pattern */}
                              <div style={{
                                margin: 'auto',
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                border: '2px solid rgba(255,255,255,0.6)',
                                boxShadow: '0 0 10px rgba(0,0,0,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'rgba(255,255,255,0.8)',
                                fontWeight: 'bold',
                                fontSize: '0.7rem'
                              }}>
                                🏵️ LOOM
                              </div>
                            </div>

                            <div style={{ marginTop: '16px', textAlign: 'center', width: '100%' }}>
                              <strong style={{ fontSize: '0.9rem', display: 'block' }}>{weavingMaterial} Swatch</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vegetable Dyed: <strong>{organicDye}</strong> | Knotting: <strong>{knotDensity.split(' ')[0]}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="grid-cols-12" style={{ marginBottom: '50px' }}>
                          {pages.products.map((tex, idx) => {
                            const formattedPrice = tex.price?.toString().startsWith('₹') ? tex.price : `₹${tex.price}`;
                            return (
                              <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', borderRadius: '8px', marginBottom: '16px' }}>
                                  <img src={tex.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80'} alt={tex.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                  <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>{tex.category || 'Premium Fabric'}</span>
                                  <strong style={{ color: 'var(--primary-accent)', fontSize: '1.2rem' }}>{formattedPrice}</strong>
                                </div>
                                <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>{tex.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px' }}>🧶 Weave: {tex.category || 'Handcrafted Design'}</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', flexGrow: 1 }}>{tex.description}</p>

                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', width: '100%' }}>
                                  <button onClick={() => addToCart(tex)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                                  <a
                                    href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I am highly interested in ordering the Textile Art Piece: "${tex.title}" (Materials: ${tex.category || 'General'}, Price: ${formattedPrice}) on your ${companyName} site.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-button"
                                    style={{ flex: 1.5, background: 'var(--primary-gradient)', color: 'white', border: 'none', padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}
                                  >
                                    Order Weave
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="glass-panel" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                          <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', textAlign: 'center' }}>🧵 The Traditional Carpet Weaving Process</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            {[
                              { step: '1. Thread Selection', desc: 'Sourcing 100% natural Mulberry silk filaments and fine Kashmiri cashmere fleece.' },
                              { step: '2. Organic Dyeing', desc: 'Traditional extraction of dyes from walnuts, saffron, indigo plants, and herbs.' },
                              { step: '3. Master Loom Weaving', desc: 'Exquisite row by row knotting under highly calibrated tension on the timber loom.' },
                              { step: '4. Wash & Softening', desc: 'Repeated washing with natural soaps, sun drying, and trimming for flat precision piles.' }
                            ].map((proc, i) => (
                              <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: '6px' }}>
                                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--primary-accent)', marginBottom: '4px' }}>{proc.step}</strong>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{proc.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

              case 'Electronics':
                {
                  if (!pages.products || pages.products.length === 0) return null;

                  return (
                    <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                      <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                          <span className="badge" style={{ marginBottom: '8px' }}>🔌 Cyberpunk Sky Blue</span>
                          <h2 className="section-title" style={{ marginBottom: '10px' }}>🔌 High-Fidelity Cyber Audio & Smart Electronics</h2>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Welcome to modern hardware setups. Browse our premium audio pod designs, smartwatches, and chargers checked for optimal power.
                          </p>
                        </div>

                        <div className="glass-panel" style={{ padding: '30px', border: '1px solid var(--primary-accent)', background: '#050a14', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ textAlign: 'left' }}>
                              <strong style={{ fontSize: '1.15rem', color: 'white', display: 'block' }}>🎵 Cyber Audio Pods Equalizer Simulation</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Calibrated hardware testing frequencies live visualizer</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setIsPlayingEqualizer(prev => !prev)}
                              className="glass-button"
                              style={{ padding: '10px 24px', border: 'none', background: 'var(--primary-gradient)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                              {isPlayingEqualizer ? '⏸️ PAUSE VISUALIZER' : '▶️ PLAY SIMULATION'}
                            </button>
                          </div>

                          <div style={{
                            height: '100px',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '16px',
                            border: '1px solid rgba(6,182,212,0.1)'
                          }}>
                            {[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4].map((barNum, idx) => {
                              let barClass = 'eq-bar';
                              if (isPlayingEqualizer) {
                                barClass += ` eq-bar-active-${barNum}`;
                              }
                              return (
                                <div
                                  key={idx}
                                  className={barClass}
                                  style={{
                                    height: isPlayingEqualizer ? '60px' : '10px',
                                    transition: 'height 0.15s ease'
                                  }}
                                ></div>
                              );
                            })}
                          </div>

                          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {isPlayingEqualizer ? (
                              <span style={{ color: '#06b6d4', fontWeight: 'bold', animation: 'blink 1s linear infinite' }}>● ANC CALIBRATION ONLINE (42dB Noise Suppression Waveforms Active)</span>
                            ) : (
                              <span>Equalizer stands idle. Toggle PLAY above to visually run audio pod waveforms.</span>
                            )}
                            <style>{`
                              @keyframes blink { 50% { opacity: 0.5; } }
                            `}</style>
                          </div>
                        </div>

                        <div className="grid-cols-12" style={{ marginBottom: '50px' }}>
                          {pages.products.map((device, idx) => {
                            const formattedPrice = device.price?.toString().startsWith('₹') ? device.price : `₹${device.price}`;
                            const specs = [
                              device.category ? `Spec Category: ${device.category}` : 'Premium Spec Hardware',
                              'GaN Smart Thermal Control',
                              'Universal Compatibility Certified',
                              'Calibrated for Audiophile Fidelity'
                            ];
                            return (
                              <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderColor: 'rgba(59,130,246,0.3)' }}>
                                <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', borderRadius: '8px', marginBottom: '16px' }}>
                                  <img src={device.image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80'} alt={device.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue, #3b82f6)', fontWeight: 'bold' }}>{device.category || 'Hardware'}</span>
                                  <strong style={{ color: 'var(--primary-accent)', fontSize: '1.2rem' }}>{formattedPrice}</strong>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{device.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>{device.description}</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px', flexGrow: 1 }}>
                                  {specs.map((sp, i) => (
                                    <span key={i} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⚡ {sp}</span>
                                  ))}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                  <a
                                    href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I want to order the Electronic Gadget: "${device.title}" (Price: ${formattedPrice}) from your ${companyName} website.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-button primary"
                                    style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}
                                  >
                                    Buy Now
                                  </a>
                                  <button onClick={() => addToCart(device)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="glass-panel" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', textAlign: 'center' }}>🔒 Verified Hardware Calibration Standards</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                            {[
                              '✓ Bass-Boost EQ Calibrated & Verified',
                              '✓ OLED Display Pixels Checked for Zero Burns',
                              '✓ GaN Smart Heat Regulation Certified',
                              '✓ High Voltage Safety surge-tested'
                            ].map((chk, i) => (
                              <span key={i} style={{ fontSize: '0.8rem', color: 'var(--accent-blue, #3b82f6)', fontWeight: '600' }}>{chk}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }

              // \u2500\u2500 REAL ESTATE & PLOTS \u2500\u2500
              case 'Real Estate & Plots': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                        <span className="badge" style={{ marginBottom: '8px' }}>🏗️ RERA Verified Listings</span>
                        <h2 className="section-title">🏠 Available Plots, Flats & Commercial Spaces</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Verified RERA-registered land parcels & residential properties. Direct dealer pricing with zero hidden charges.</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((prop, idx) => {
                          const fp = prop.price?.toString().startsWith('₹') ? prop.price : `₹${prop.price || 'On Request'}`;
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
                              <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
                                <img src={prop.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80'} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%)' }} />
                                <span className="badge" style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--primary-accent)', color: 'white', border: 'none', fontWeight: 'bold' }}>{prop.category || 'Residential Plot'}</span>
                                <strong style={{ position: 'absolute', bottom: '12px', right: '12px', fontSize: '1.15rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{fp}</strong>
                              </div>
                              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>{prop.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px', flexGrow: 1 }}>{prop.description}</p>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                  {['📍 Prime Location', '📋 Clear Title', '🔑 Ready Possession'].map((t, i) => <span key={i} style={{ fontSize: '0.65rem', background: 'rgba(21,128,61,0.08)', color: 'var(--primary-accent)', border: '1px solid rgba(21,128,61,0.15)', padding: '2px 8px', borderRadius: '4px' }}>{t}</span>)}
                                </div>
                                <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I am interested in the property: "${prop.title}" (${prop.category || 'Plot'}, ${fp}) at ${companyName}. Please share site visit details.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button" style={{ width: '100%', background: 'var(--primary-gradient)', color: 'white', border: 'none', padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>📞 Enquire Property</a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(21,128,61,0.15)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '16px', textAlign: 'center' }}>
                        {['✓ RERA Verified', '✓ No Hidden Charges', '✓ Legal Title Clearance', '✓ Easy Loan Support'].map((f, i) => <span key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{f}</span>)}
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 BUILDING MATERIALS \u2500\u2500
              case 'Building Materials': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                        <span className="badge" style={{ marginBottom: '8px' }}>🧱 ISI CERTIFIED MATERIALS</span>
                        <h2 className="section-title">🧱 Premium Building Material Catalog</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Quality cement, TMT steel, bricks, river sand & aggregates. Bulk supply for contractors, builders & homeowners.</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((mat, idx) => {
                          const fp = mat.price?.toString().startsWith('₹') ? mat.price : `₹${mat.price || 'Contact'}`;
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                              <div style={{ width: '100%', height: '150px', overflow: 'hidden', borderRadius: '2px', marginBottom: '12px', position: 'relative' }}>
                                <img src={mat.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'} alt={mat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span className="badge" style={{ position: 'absolute', top: '8px', left: '8px' }}>{mat.category || 'Construction'}</span>
                              </div>
                              <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{mat.title}</h3>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: '12px', flexGrow: 1 }}>{mat.description}</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Unit Price</span>
                                <strong style={{ color: 'var(--primary-accent)', fontSize: '1.2rem' }}>{fp}</strong>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I want to order "${mat.title}" (${mat.category || 'Material'}) at ${fp} from ${companyName}. Please share bulk pricing & delivery details.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>Get Quote</a>
                                <button onClick={() => addToCart(mat)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(146,64,14,0.2)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
                        {[{ l: '🚚 Fast Delivery', d: 'Same-day dispatch for bulk orders within city.' }, { l: '💯 ISI Certified', d: 'BIS/ISI quality standards for safe construction.' }, { l: '🏗️ Contractor Rates', d: 'Special pricing for regular contractors & builders.' }].map((f, i) => (
                          <div key={i} style={{ textAlign: 'center' }}>
                            <strong style={{ display: 'block', color: 'var(--primary-accent)', marginBottom: '4px' }}>{f.l}</strong>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{f.d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 ROOFING & CENTERING \u2500\u2500
              case 'Roofing & Centering': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                        <span className="badge" style={{ marginBottom: '8px' }}>🔩 Construction Rentals & Supply</span>
                        <h2 className="section-title">🏠 Baling Patra, GI Sheets & Centering Rental</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Heavy-duty corrugated GI sheets, steel centering props, shuttering plates & formwork rental for all construction needs.</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((item, idx) => {
                          const fp = item.price?.toString().startsWith('₹') ? item.price : `₹${item.price || 'Call'}`;
                          const isRent = (item.category || '').toLowerCase().includes('rent') || (item.category || '').toLowerCase().includes('centering');
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                              <div style={{ width: '100%', height: '155px', overflow: 'hidden', marginBottom: '12px', position: 'relative' }}>
                                <img src={item.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80'} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span className="badge" style={{ position: 'absolute', top: '8px', left: '8px', background: isRent ? '#b45309' : 'var(--primary-accent)', color: 'white', border: 'none' }}>{isRent ? '📅 Rental' : '🛒 Supply'}</span>
                              </div>
                              <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{item.title}</h3>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: '10px', flexGrow: 1 }}>{item.description}</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.category || 'Construction Item'}</span>
                                <strong style={{ color: 'var(--primary-accent)', fontSize: '1.2rem' }}>{fp}</strong>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I need "${item.title}" (${fp}) from ${companyName}. Please share availability and delivery.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>{isRent ? 'Book' : 'Buy'}</a>
                                <button onClick={() => addToCart(item)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(194,65,12,0.2)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--primary-accent)', marginBottom: '12px' }}>🏗️ Available Items for Rental & Sale</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {['Steel Centering Plates', 'Adjustable Centering Props', 'H-Frame Scaffolding', 'GI Corrugated Sheets', 'Baling Patra (Zinc)', 'Shuttering Plywood', 'MS Channels & Angles'].map((item, i) => (
                            <span key={i} style={{ fontSize: '0.78rem', background: 'rgba(194,65,12,0.08)', color: 'var(--primary-accent)', border: '1px solid rgba(194,65,12,0.15)', padding: '4px 10px', borderRadius: '4px' }}>{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 MEDICAL & PHARMACY \u2500\u2500
              case 'Medical & Pharmacy': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                        <span className="badge" style={{ marginBottom: '8px' }}>💊 Licensed Pharmacy</span>
                        <h2 className="section-title">💊 Medicines, Health & Wellness Products</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Genuine branded medicines, OTC health products & medical equipment at verified prices.</p>
                      </div>
                      <div style={{ background: 'rgba(2,132,199,0.05)', border: '1px solid rgba(2,132,199,0.15)', borderRadius: '10px', padding: '10px 18px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.2rem' }}>⚕️</span>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}><strong style={{ color: 'var(--primary-accent)' }}>Medical Disclaimer:</strong> Prescription medicines require a valid prescription. All products are sourced from licensed distributors. Consult a physician for advice.</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((med, idx) => {
                          const fp = med.price?.toString().startsWith('₹') ? med.price : `₹${med.price || 'MRP'}`;
                          const isRx = (med.category || '').toLowerCase().includes('rx') || (med.category || '').toLowerCase().includes('prescription');
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                              <div style={{ width: '100%', height: '145px', overflow: 'hidden', marginBottom: '12px', background: 'rgba(2,132,199,0.04)', borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {med.image ? <img src={med.image} alt={med.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '3rem' }}>💊</span>}
                                {isRx && <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#dc2626', color: 'white', fontSize: '0.6rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '2px' }}>Rx</span>}
                              </div>
                              <span className="badge" style={{ marginBottom: '8px', alignSelf: 'flex-start' }}>{med.category || 'Medicine'}</span>
                              <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{med.title}</h3>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '12px', flexGrow: 1 }}>{med.description}</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MRP</span>
                                <strong style={{ color: 'var(--primary-accent)', fontSize: '1.15rem' }}>{fp}</strong>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I want to order "${med.title}" (${fp}) from ${companyName} pharmacy. Please confirm availability.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>Buy Now</a>
                                <button onClick={() => addToCart(med)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 HOSPITAL & CLINIC \u2500\u2500
              case 'Hospital & Clinic': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span className="badge" style={{ marginBottom: '8px' }}>🏥 Health Packages & Checkups</span>
                        <h2 className="section-title">🧪 Comprehensive Health Packages & Tests</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Preventive health checkups, specialized OPD packages & diagnostic tests. Book online or visit our facility.</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((pkg, idx) => {
                          const fp = pkg.price?.toString().startsWith('₹') ? pkg.price : `₹${pkg.price || 'Contact'}`;
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                              <div style={{ background: 'rgba(14,165,233,0.07)', padding: '18px', borderRadius: '10px', marginBottom: '14px', textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{pkg.image ? '' : '🏥'}</div>
                                {pkg.image && <img src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '8px' }} />}
                                <span className="badge" style={{ marginTop: '8px' }}>{pkg.category || 'Health Package'}</span>
                              </div>
                              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>{pkg.title}</h3>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: '12px', flexGrow: 1 }}>{pkg.description}</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', background: 'rgba(14,165,233,0.04)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(14,165,233,0.1)' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Package Price</span>
                                <strong style={{ color: 'var(--primary-accent)', fontSize: '1.2rem' }}>{fp}</strong>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I want to book: "${pkg.title}" (${fp}) at ${companyName}. Please confirm available slots.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>Book</a>
                                <button onClick={() => addToCart(pkg)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 DIET & NUTRITION \u2500\u2500
              case 'Diet & Nutrition': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span className="badge" style={{ marginBottom: '8px' }}>🥗 Certified Nutrition Plans</span>
                        <h2 className="section-title">🌿 Diet Plans, Supplements & Wellness Products</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Science-backed diet plans, premium supplements & wellness products curated by certified nutritionists.</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((item, idx) => {
                          const fp = item.price?.toString().startsWith('₹') ? item.price : `₹${item.price || 'Contact'}`;
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
                              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                                <img src={item.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80'} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(1,15,8,0.7), transparent 60%)' }} />
                                <span className="badge" style={{ position: 'absolute', top: '10px', left: '10px' }}>{item.category || 'Wellness'}</span>
                              </div>
                              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '14px', flexGrow: 1 }}>{item.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>🌿 Certified Price</span>
                                  <strong style={{ color: 'var(--primary-accent)', fontSize: '1.15rem' }}>{fp}</strong>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                  <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I'm interested in: "${item.title}" (${fp}) from ${companyName}. Please share more details.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>Order</a>
                                  <button onClick={() => addToCart(item)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 BLOOD BANK & PATHOLOGY \u2500\u2500
              case 'Blood Bank & Pathology': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span className="badge" style={{ marginBottom: '8px' }}>🔬 NABL Accredited Lab</span>
                        <h2 className="section-title">🩸 Lab Test Packages & Diagnostic Reports</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Accurate diagnostic testing with home sample collection. Reports delivered digitally within 24 hours.</p>
                      </div>
                      <div style={{ background: 'rgba(190,18,60,0.05)', border: '1px solid rgba(190,18,60,0.15)', borderRadius: '8px', padding: '10px 18px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.2rem' }}>🏠</span>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}><strong style={{ color: 'var(--primary-accent)' }}>Home Collection Available:</strong> Our trained phlebotomists visit your location. Book before 10 AM for same-day reports.</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((test, idx) => {
                          const fp = test.price?.toString().startsWith('₹') ? test.price : `₹${test.price || 'Contact'}`;
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                              <div style={{ background: 'rgba(190,18,60,0.06)', padding: '18px', textAlign: 'center', marginBottom: '12px', borderRadius: '6px' }}>
                                <span style={{ fontSize: '2.5rem' }}>{test.image ? '' : '🔬'}</span>
                                {test.image && <img src={test.image} alt={test.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />}
                              </div>
                              <span className="badge" style={{ marginBottom: '8px', alignSelf: 'flex-start' }}>{test.category || 'Pathology Test'}</span>
                              <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{test.title}</h3>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '12px', flexGrow: 1 }}>{test.description}</p>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                {['🏠 Home Collection', '📄 Digital Report', '⏱️ Fast Turnaround'].map((t, i) => <span key={i} style={{ fontSize: '0.62rem', background: 'rgba(190,18,60,0.06)', color: 'var(--primary-accent)', border: '1px solid rgba(190,18,60,0.12)', padding: '2px 7px', borderRadius: '4px' }}>{t}</span>)}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Test Price</span>
                                <strong style={{ color: 'var(--primary-accent)', fontSize: '1.2rem' }}>{fp}</strong>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I want to book test: "${test.title}" (${fp}) at ${companyName}. Please confirm home collection timing.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>Book Now</a>
                                <button onClick={() => addToCart(test)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 RESTAURANT & DHABA \u2500\u2500
              case 'Restaurant & Dhaba': {
                if (!pages.products || pages.products.length === 0) return null;
                const vegCats = ['veg', 'vegetarian', 'sabji', 'dal', 'salad', 'paneer', 'green'];
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span className="badge" style={{ marginBottom: '8px' }}>🍽️ Today's Menu</span>
                        <h2 className="section-title">🍛 Our Menu & Signature Dishes</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Freshly prepared authentic flavours. Order via WhatsApp for dine-in, takeaway or home delivery!</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((dish, idx) => {
                          const fp = dish.price?.toString().startsWith('₹') ? dish.price : `₹${dish.price || ''}`;
                          const isVeg = vegCats.some(v => (dish.category || '').toLowerCase().includes(v));
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
                              <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                                <img src={dish.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'} alt={dish.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)' }} />
                                <div style={{ position: 'absolute', top: '10px', left: '10px', width: '18px', height: '18px', border: `2px solid ${isVeg ? '#16a34a' : '#dc2626'}`, borderRadius: '2px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isVeg ? '#16a34a' : '#dc2626' }} />
                                </div>
                                <strong style={{ position: 'absolute', bottom: '8px', right: '10px', color: 'white', fontSize: '1.1rem' }}>{fp}</strong>
                              </div>
                              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                  <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{dish.title}</h3>
                                  <span style={{ fontSize: '0.65rem', color: isVeg ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>{isVeg ? '🌿 VEG' : '🍖 NON-VEG'}</span>
                                </div>
                                <span className="badge" style={{ alignSelf: 'flex-start', marginBottom: '8px', fontSize: '0.65rem' }}>{dish.category || 'Main Course'}</span>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '12px', flexGrow: 1 }}>{dish.description}</p>
                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                  <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I want to order: "${dish.title}" (${fp}) from ${companyName}. Please confirm availability.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>Order</a>
                                  <button onClick={() => addToCart(dish)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 KIRANA & GROCERY \u2500\u2500
              case 'Kirana & Grocery': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span className="badge" style={{ marginBottom: '8px' }}>🛒 Fresh & Daily Essentials</span>
                        <h2 className="section-title">🛒 Store Inventory & Product List</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Daily fresh groceries, branded products & kirana essentials. Home delivery available!</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((item, idx) => {
                          const fp = item.price?.toString().startsWith('₹') ? item.price : `₹${item.price || ''}`;
                          return (
                            <div key={idx} className="col-span-3 glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '18px' }}>
                              <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary-accent)', marginBottom: '12px', background: 'rgba(22,163,74,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.image ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '2rem' }}>🛒</span>}
                              </div>
                              <span className="badge" style={{ marginBottom: '6px', fontSize: '0.65rem' }}>{item.category || 'Grocery'}</span>
                              <h3 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{item.title}</h3>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '10px', flexGrow: 1 }}>{item.description}</p>
                              <strong style={{ color: 'var(--primary-accent)', fontSize: '1.1rem', marginBottom: '10px' }}>{fp}</strong>
                              <div style={{ display: 'flex', gap: '6px', width: '100%', marginTop: 'auto' }}>
                                <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I want to order: "${item.title}" (${fp}) from ${companyName}. Please confirm delivery timing.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary" style={{ flex: 1, padding: '8px', fontSize: '0.8rem', textDecoration: 'none', textAlign: 'center' }}>Order</a>
                                <button onClick={() => addToCart(item)} className="glass-button secondary" style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}>+ Cart</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 BEAUTY SALON \u2500\u2500
              case 'Beauty Salon': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span className="badge" style={{ marginBottom: '8px' }}>💄 Glamour & Beauty</span>
                        <h2 className="section-title">💄 Beauty Products & Treatment Packages</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Premium beauty products, skincare kits & exclusive salon treatment packages. Look & feel your absolute best!</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((product, idx) => {
                          const fp = product.price?.toString().startsWith('₹') ? product.price : `₹${product.price || ''}`;
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
                              <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
                                <img src={product.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80'} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(219,39,119,0.4), transparent 60%)' }} />
                                <span className="badge" style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(219,39,119,0.9)', color: 'white', border: 'none' }}>{product.category || 'Beauty'}</span>
                              </div>
                              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{product.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: '12px', flexGrow: 1 }}>{product.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>✨ Exclusive Price</span>
                                  <strong style={{ color: 'var(--primary-accent)', fontSize: '1.15rem' }}>{fp}</strong>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                  <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I'm interested in: "${product.title}" (${fp}) at ${companyName}. Please share availability.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>Book</a>
                                  <button onClick={() => addToCart(product)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 GYM & FITNESS \u2500\u2500
              case 'Gym & Fitness': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span className="badge" style={{ marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>💪 NO PAIN NO GAIN</span>
                        <h2 className="section-title" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>💪 MEMBERSHIP PLANS & SUPPLEMENTS</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Transform your body. Choose your plan or grab premium supplements & gym gear.</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((plan, idx) => {
                          const fp = plan.price?.toString().startsWith('₹') ? plan.price : `₹${plan.price || ''}`;
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '3px solid var(--primary-accent)' }}>
                              <div style={{ width: '100%', height: '155px', overflow: 'hidden', marginBottom: '12px' }}>
                                <img src={plan.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80'} alt={plan.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 800 }}>{plan.title}</h3>
                              <span className="badge" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>{plan.category || 'Plan'}</span>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '12px', flexGrow: 1 }}>{plan.description}</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PRICE</span>
                                <strong style={{ color: 'var(--primary-accent)', fontSize: '1.3rem' }}>{fp}</strong>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', width: '100%' }}>
                                <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hey! I want to join: "${plan.title}" (${fp}) at ${companyName}. Please confirm enrollment.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary pulse-cta" style={{ flex: 1, padding: '12px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Join</a>
                                <button onClick={() => addToCart(plan)} className="glass-button secondary" style={{ flex: 1, padding: '12px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>+ Cart</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 AUTOMOBILE & GARAGE \u2500\u2500
              case 'Automobile & Garage': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span className="badge" style={{ marginBottom: '8px' }}>🚗 Genuine Auto Parts</span>
                        <h2 className="section-title">🔧 Parts, Accessories & Service Packages</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Genuine OEM & aftermarket parts for all vehicle makes. Professional service packages available.</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((part, idx) => {
                          const fp = part.price?.toString().startsWith('₹') ? part.price : `₹${part.price || ''}`;
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                              <div style={{ width: '100%', height: '155px', overflow: 'hidden', marginBottom: '12px', position: 'relative' }}>
                                <img src={part.image || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80'} alt={part.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span className="badge" style={{ position: 'absolute', top: '8px', left: '8px' }}>{part.category || 'Auto Part'}</span>
                              </div>
                              <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{part.title}</h3>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: '12px', flexGrow: 1 }}>{part.description}</p>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                {['✓ Genuine', '✓ Warranty', '✓ Easy Fit'].map((t, i) => <span key={i} style={{ fontSize: '0.62rem', background: 'rgba(37,99,235,0.07)', color: '#3b82f6', border: '1px solid rgba(37,99,235,0.14)', padding: '2px 6px', borderRadius: '3px' }}>{t}</span>)}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Best Price</span>
                                <strong style={{ color: 'var(--primary-accent)', fontSize: '1.2rem' }}>{fp}</strong>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I need: "${part.title}" (${part.category || 'Part'}, ${fp}) from ${companyName}. Please check availability.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>Order</a>
                                <button onClick={() => addToCart(part)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="glass-panel" style={{ padding: '18px', border: '1px solid rgba(37,99,235,0.18)' }}>
                        <h3 style={{ fontSize: '0.95rem', color: 'var(--primary-accent)', marginBottom: '10px' }}>🚗 Vehicles We Service</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {['🚗 Cars', '🏍️ Bikes', '🚐 SUVs', '🚚 Commercial', '⚡ Electric', '🛺 Auto Rickshaw'].map((v, i) => <span key={i} style={{ fontSize: '0.8rem', background: 'rgba(37,99,235,0.05)', color: '#3b82f6', border: '1px solid rgba(37,99,235,0.14)', padding: '4px 10px', borderRadius: '4px' }}>{v}</span>)}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 FASHION BOUTIQUE \u2500\u2500
              case 'Fashion Boutique': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span className="badge" style={{ marginBottom: '8px', fontStyle: 'italic' }}>👗 Latest Collection</span>
                        <h2 className="section-title">👗 Fashion Collection & Ready-to-Wear</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Ethnic wear, western outfits, sarees & designer collections. Premium fashion at your fingertips.</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((cloth, idx) => {
                          const fp = cloth.price?.toString().startsWith('₹') ? cloth.price : `₹${cloth.price || ''}`;
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
                              <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
                                <img src={cloth.image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=400&q=80'} alt={cloth.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} onMouseOver={e => e.target.style.transform = 'scale(1.08)'} onMouseOut={e => e.target.style.transform = 'scale(1)'} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(124,58,237,0.5), transparent 60%)' }} />
                                <span className="badge" style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(124,58,237,0.9)', color: 'white', border: 'none', fontStyle: 'italic' }}>{cloth.category || 'Collection'}</span>
                              </div>
                              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <h3 style={{ fontSize: '1.05rem', marginBottom: '6px', fontStyle: 'italic' }}>{cloth.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '12px', flexGrow: 1 }}>{cloth.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Designer Price</span>
                                  <strong style={{ color: 'var(--primary-accent)', fontSize: '1.2rem' }}>{fp}</strong>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                  <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I love: "${cloth.title}" (${cloth.category || 'Fashion'}, ${fp}) at ${companyName}. Please share size options & availability.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>Buy</a>
                                  <button onClick={() => addToCart(cloth)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              }

              // \u2500\u2500 CORPORATE & GENERAL \u2500\u2500
              case 'Corporate & General': {
                if (!pages.products || pages.products.length === 0) return null;
                return (
                  <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <span className="badge" style={{ marginBottom: '8px' }}>🏢 Business Solutions</span>
                        <h2 className="section-title">📦 Products & Business Solutions</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Professional-grade products and business solutions tailored for enterprises, SMEs & startups.</p>
                      </div>
                      <div className="grid-cols-12" style={{ marginBottom: '40px' }}>
                        {pages.products.map((prod, idx) => {
                          const fp = prod.price?.toString().startsWith('₹') ? prod.price : `₹${prod.price || 'Contact Us'}`;
                          return (
                            <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                              <div style={{ width: '100%', height: '155px', overflow: 'hidden', marginBottom: '12px', position: 'relative' }}>
                                {prod.image ? <img src={prod.image} alt={prod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'rgba(67,56,202,0.05)', fontSize: '3rem' }}>🏢</div>}
                                <span className="badge" style={{ position: 'absolute', top: '8px', left: '8px' }}>{prod.category || 'Business'}</span>
                              </div>
                              <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{prod.title}</h3>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: '12px', flexGrow: 1 }}>{prod.description}</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Price</span>
                                <strong style={{ color: 'var(--primary-accent)', fontSize: '1.2rem' }}>{fp}</strong>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                <a href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I'm interested in: "${prod.title}" (${prod.category || 'Product'}, ${fp}) from ${companyName}. Please share details.`)}`} target="_blank" rel="noopener noreferrer" className="glass-button primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}>Get Quote</a>
                                <button onClick={() => addToCart(prod)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              }

              default:
                // Fallback standard products list
                return pages.products?.length > 0 ? (
                  <section className="section-padding" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.products) }}>
                    <div className="container">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '35px' }}>
                        <div>
                          <span className="badge" style={{ marginBottom: '8px' }}>Store Inventory</span>
                          <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Featured Products</h2>
                        </div>
                        <button onClick={() => setStorefrontTab('products')} className="glass-button secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                          View Full Catalog →
                        </button>
                      </div>

                      <div className="grid-cols-12">
                        {(pages.products || []).slice(0, 3).map((prd, idx) => (
                          <div key={idx} className="col-span-4 glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {prd.image ? (
                              <img src={prd.image} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
                            ) : (
                              <div style={{ width: '100%', height: '180px', borderRadius: '8px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                <ShoppingCart size={40} />
                              </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span className="badge" style={{ scale: '0.9' }}>{prd.category || 'General'}</span>
                              <strong style={{ color: 'var(--primary-accent)', fontSize: '1.2rem' }}>₹{prd.price}</strong>
                            </div>

                            <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{prd.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>{prd.description}</p>

                            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                              <a
                                href={`https://api.whatsapp.com/send?phone=${whatsappNumberClean}&text=${encodeURIComponent(`Hello! I am interested in purchasing "${prd.title}" listed in your product catalog for ₹${prd.price}. Please share delivery availability.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-button primary"
                                style={{ flex: 1, padding: '10px', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}
                              >
                                Buy Now
                              </a>
                              <button onClick={() => addToCart(prd)} className="glass-button secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>+ Cart</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                ) : null;
            }
          })()}

          {/* Testimonial reviews horizontal snap list */}
          {sectionVisibility.reviews !== false && (
            <section className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', ...getSectionStyle(sectionVisibility.reviews) }}>
              <div className="container">
                <div className="grid-cols-12" style={{ alignItems: 'flex-start' }}>

                  {/* Testimonial slider list */}
                  <div className="col-span-7">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                        <Star style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                        Visitor Testimonials ({ratings.length})
                      </h2>
                      {ratings.length > 3 && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => scrollReviews('left')} className="slider-control-btn" aria-label="Scroll reviews left">‹</button>
                          <button onClick={() => scrollReviews('right')} className="slider-control-btn" aria-label="Scroll reviews right">›</button>
                        </div>
                      )}
                    </div>

                    {ratings.length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to review this business below!</p>
                    ) : (
                      <div ref={reviewsRef} className="scroll-snap-x hide-scrollbar" style={{ gap: '16px' }}>
                        {ratings.map((rev, idx) => (
                          <div key={idx} className="scroll-snap-card glass-panel" style={{ flex: '0 0 calc(33.333% - 16px)', minWidth: '280px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                {rev.avatarUrl ? (
                                  <img src={rev.avatarUrl} alt="" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                  <div className="letter-avatar" style={{ backgroundColor: getAvatarColor(rev.name) }}>
                                    {getInitials(rev.name)}
                                  </div>
                                )}
                                <div>
                                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>{rev.name}</strong>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(rev.date).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div style={{ marginBottom: '10px' }}>
                                <StarRating rating={rev.rating} size={14} />
                              </div>
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5' }}>"{rev.review}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Rating form */}
                  <div className="col-span-5">
                    <div className="glass-panel">
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Write a Rating Review</h3>

                      {formSuccess.type === 'review' && (
                        <div className="badge green" style={{ width: '100%', padding: '10px', marginBottom: '12px' }}>{formSuccess.msg}</div>
                      )}

                      <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                          type="text"
                          placeholder="Your Name..."
                          value={reviewForm.name}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                          className="glass-input"
                          required
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Rating Score:</span>
                          <StarRating
                            rating={reviewForm.rating}
                            interactive={true}
                            onRatingChange={(score) => setReviewForm(prev => ({ ...prev, rating: score }))}
                            size={22}
                          />
                        </div>

                        <textarea
                          placeholder="Write your review comments here..."
                          value={reviewForm.review}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                          className="glass-input"
                          rows={3}
                          required
                        />

                        <button type="submit" className="glass-button" style={{ background: 'var(--primary-gradient)', color: 'white', border: 'none' }}>
                          Submit Review
                        </button>
                      </form>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* -------------------- ABOUT TAB -------------------- */}
      {storefrontTab === 'about' && (
        <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span className="badge" style={{ marginBottom: '12px' }}>Corporate Profile</span>
              <h1 className="section-title" style={{ marginBottom: '10px' }}>About Our Enterprise</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Learn more about our brand history, mission statements, and core strategic values.
              </p>
            </div>

            <div className="grid-cols-12" style={{ alignItems: 'center', gap: '40px' }}>
              <div className="col-span-6">
                <h2 style={{ fontSize: '2rem', marginBottom: '20px', fontFamily: fontFamily }}>Our Corporate Story</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '24px', lineHeight: '1.7' }}>
                  {pages.about?.story || pages.home?.welcomeText?.paragraph || 'We provide top-tier professional services and high-quality products tailored to client demands. Our commitment to excellence shapes our identity and delivery models.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🎯</span>
                    <strong style={{ color: 'var(--primary-accent)', fontSize: '1.1rem', display: 'block', marginBottom: '6px' }}>Our Mission</strong>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                      {pages.about?.mission || 'To lead standard customer-centric implementations with verified expertise and highly persistent quality.'}
                    </p>
                  </div>

                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🚀</span>
                    <strong style={{ color: 'var(--primary-accent)', fontSize: '1.1rem', display: 'block', marginBottom: '6px' }}>Our Vision</strong>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                      {pages.about?.vision || 'To continuously build sustainable frameworks that empower local businesses with international standards.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-6" style={{ textAlign: 'center' }}>
                <div className="glass-panel" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    background: 'var(--primary-glow)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    zIndex: 0
                  }}></div>

                  <img
                    src={adminData?.logo || 'https://images.unsplash.com/photo-1516876437184-593fda40c7cd?auto=format&fit=crop&w=300&q=80'}
                    alt=""
                    style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-accent)', marginBottom: '24px', position: 'relative', zIndex: 1 }}
                  />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '6px', position: 'relative', zIndex: 1 }}>{adminData?.companyName}</h3>
                  <span className="badge" style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }}>{adminData?.category || 'SaaS Merchant'}</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', position: 'relative', zIndex: 1 }}>
                    📍 Registered Office: {adminData?.address?.street || 'Central Way'}, {adminData?.address?.city || 'Dehradun'}, {adminData?.address?.state || 'Uttarakhand'} - {adminData?.address?.pinCode || '248001'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* -------------------- SERVICES TAB -------------------- */}
      {storefrontTab === 'services' && (
        <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span className="badge" style={{ marginBottom: '12px' }}>Professional Offerings</span>
              <h1 className="section-title" style={{ marginBottom: '10px' }}>Specialized Services</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Explore our premium selection of professional corporate services configured for maximum value.
              </p>
            </div>

            {pages.services?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                <p>No specialized services registered yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid-cols-12">
                {pages.services.map((srv, idx) => (
                  <div key={idx} className="col-span-4 glass-panel" style={{ textAlign: 'center', padding: '40px 30px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: 'var(--primary-gradient)'
                    }}></div>

                    {srv.image ? (
                      <img src={srv.image} alt="" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px', border: '3px solid var(--primary-accent)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} />
                    ) : (
                      <div style={{ width: '80px', height: '80px', margin: '0 auto 20px auto', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.8rem', fontWeight: 'bold', boxShadow: '0 4px 15px var(--primary-glow)' }}>
                        {srv.title?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: '700' }}>{srv.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{srv.description}</p>

                    <a
                      href={`https://api.whatsapp.com/send?phone=${(pages.contact?.whatsappNumber || adminData?.whatsapp || '').replace(/\D/g, '')}&text=${encodeURIComponent(`Hello! I want to inquire about your service: "${srv.title}". Please provide pricing details.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-button secondary"
                      style={{ marginTop: '24px', width: '100%', fontSize: '0.85rem' }}
                    >
                      Inquire Price via WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* -------------------- PRODUCTS TAB -------------------- */}
      {storefrontTab === 'products' && (
        <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="badge" style={{ marginBottom: '12px' }}>Product Catalog</span>
              <h1 className="section-title" style={{ marginBottom: '10px' }}>Our Handcrafted Products</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Filter and select specialized products below to complete direct orders on WhatsApp.
              </p>
            </div>

            {/* Dynamic Visual Category Filter Cards */}
            {uniqueCategories.length > 1 && (
              <div className="category-filter-container">
                {uniqueCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className={`category-filter-card ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span>{getCategoryEmoji(cat)}</span>
                    <span>{cat}</span>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                <p>No products found in this category.</p>
              </div>
            ) : (
              <div className="grid-cols-12">
                {filteredProducts.map((prd, idx) => (
                  <div key={idx} className="col-span-4 glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    {prd.image ? (
                      <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden', borderRadius: '10px', marginBottom: '16px' }}>
                        <img src={prd.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} />
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '200px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        <ShoppingCart size={44} />
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="badge" style={{ opacity: 0.95 }}>{prd.category || 'General'}</span>
                      <strong style={{ color: 'var(--primary-accent)', fontSize: '1.3rem', fontWeight: '800' }}>₹{prd.price}</strong>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', fontWeight: '700' }}>{prd.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>{prd.description}</p>

                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <a
                        href={`https://api.whatsapp.com/send?phone=${(pages.contact?.whatsappNumber || adminData?.whatsapp || '').replace(/\D/g, '')}&text=${encodeURIComponent(`Hello! I would like to place an order for: "${prd.title}" (Category: ${prd.category || 'General'}, Price: ₹${prd.price}). Please confirm order details.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-button primary"
                        style={{ flex: 1, padding: '12px', fontSize: '0.9rem', textDecoration: 'none', textAlign: 'center' }}
                      >
                        Buy Now
                      </a>
                      <button onClick={() => addToCart(prd)} className="glass-button secondary" style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}>+ Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* -------------------- GALLERY TAB -------------------- */}
      {storefrontTab === 'gallery' && (
        <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">

            <div style={{ textAlign: 'center', marginBottom: '45px' }}>
              <span className="badge" style={{ marginBottom: '12px' }}>Brand Media Suite</span>
              <h1 className="section-title" style={{ marginBottom: '10px' }}>Unified Media Gallery</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Explore our official image highlights and YouTube featured videos.
              </p>
            </div>

            {/* Gallery Media Sub-Filters */}
            <div className="category-filter-container" style={{ marginBottom: '40px' }}>
              <div
                className={`category-filter-card ${galleryFilter === 'image' ? 'active' : ''}`}
                onClick={() => setGalleryFilter('image')}
              >
                <span>📸</span>
                <span>Images Gallery</span>
              </div>

              <div
                className={`category-filter-card ${galleryFilter === 'video' ? 'active' : ''}`}
                onClick={() => setGalleryFilter('video')}
              >
                <span>🎥</span>
                <span>YouTube Videos</span>
              </div>
            </div>

            {/* Images Showcase */}
            {galleryFilter === 'image' && (() => {
              const imageItems = (pages.gallery || []).filter(gly => gly.type === 'image' || !gly.type);
              if (imageItems.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                    <p>No gallery images uploaded yet by the merchant.</p>
                  </div>
                );
              }
              return (
                <div className="grid-cols-12">
                  {imageItems.map((gly, idx) => (
                    <div key={idx} className="col-span-3 glass-panel" style={{ padding: '10px', transition: 'var(--transition-smooth)' }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-accent)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
                      <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: '8px' }}>
                        <img src={gly.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.08)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* YouTube Videos Showcase */}
            {galleryFilter === 'video' && (() => {
              const videoItems = (pages.gallery || []).filter(gly => gly.type === 'video');
              const allVideos = [...videoItems];
              if (pages.home?.videoUrl && !videoItems.some(v => v.url === pages.home.videoUrl)) {
                allVideos.unshift({ url: pages.home.videoUrl, type: 'video' });
              }

              if (allVideos.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                    <p>No YouTube featured video links configured yet.</p>
                  </div>
                );
              }

              return (
                <div className="grid-cols-12">
                  {allVideos.map((gly, idx) => (
                    <div key={idx} className="col-span-6 glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px' }}>
                      <div style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 0 15px var(--primary-glow)',
                        border: '1px solid var(--primary-accent, var(--accent-purple))',
                        background: '#000'
                      }}>
                        <iframe
                          src={getYouTubeEmbedUrl(gly.url)}
                          title={`Youtube Video ${idx}`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                        ></iframe>
                      </div>
                      <span className="badge" style={{ alignSelf: 'flex-start' }}>🎥 Featured Presentation {idx + 1}</span>
                    </div>
                  ))}
                </div>
              );
            })()}

          </div>
        </section>
      )}

      {/* -------------------- CONTACT TAB -------------------- */}
      {storefrontTab === 'contact' && (
        <section className="section-padding animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span className="badge" style={{ marginBottom: '12px' }}>Inquiry Desk</span>
              <h1 className="section-title" style={{ marginBottom: '10px' }}>Contact Us & Inquiry Desk</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Fill out the estimate request form below to trigger a direct WhatsApp consultation or contact our office channels.
              </p>
            </div>

            <div className="grid-cols-12">

              {/* Contact details and Iframe Map */}
              <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <span className="badge" style={{ marginBottom: '8px' }}>Contact Brand</span>
                  <h2 style={{ fontSize: '2.25rem', marginBottom: '12px', fontFamily: fontFamily }}>Get in Touch</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Have custom requests? Fill in the form or trigger WhatsApp support.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <MapPin size={18} style={{ color: 'var(--primary-accent)' }} />
                    {adminData?.address?.street}, {adminData?.address?.city}, {adminData?.address?.state} - {adminData?.address?.pinCode}
                  </p>
                  {(pages.contact?.phone || adminData?.phone) && (
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      <Phone size={18} style={{ color: 'var(--primary-accent)' }} />
                      {pages.contact?.phone || adminData.phone}
                    </p>
                  )}
                  {(pages.contact?.email || adminData?.email) && (
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      <Mail size={18} style={{ color: 'var(--primary-accent)' }} />
                      {pages.contact?.email || adminData.email}
                    </p>
                  )}
                </div>

                {/* Simplified Google Map Container */}
                {sectionVisibility.map !== false && pages.contact?.mapEmbedCode && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    <div style={{ width: '100%', height: '240px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
                      <iframe
                        title="maps embed"
                        src={pages.contact.mapEmbedCode}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                      ></iframe>
                    </div>

                    {/* Coordinates Badge */}
                    {(pages.contact?.latitude || pages.contact?.longitude) && (
                      <div style={{ display: 'flex', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: '8px', width: 'fit-content' }}>
                        <span>📍 Exact GPS Place Coords:</span>
                        {pages.contact.latitude && <span>Lat: <strong>{pages.contact.latitude}</strong></span>}
                        {pages.contact.longitude && <span>Lng: <strong>{pages.contact.longitude}</strong></span>}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Inquiries Contact Form */}
              <div className="col-span-6">
                <div className="glass-panel">
                  {tenantData?.pages?.customForm?.fields && tenantData?.pages?.customForm?.fields?.length > 0 && !adminData?.partialBlockSettings?.blockCustomForm ? (
                    // DYNAMIC CUSTOM FORM RENDER
                    <>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Send size={20} style={{ color: 'var(--primary-accent)' }} />
                        {tenantData.pages.customForm.formTitle || 'Contact Us'}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                        {tenantData.pages.customForm.formDescription || 'Reach out to us directly'}
                      </p>

                      {formSuccess.type === 'inquiry' && (
                        <div className="badge green" style={{ width: '100%', padding: '12px', marginBottom: '16px' }}>{formSuccess.msg}</div>
                      )}

                      <form onSubmit={handleCustomFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {/* Always require Full Name as a root parameter */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full Name *</span>
                          <input
                            type="text"
                            placeholder="Your Full Name..."
                            value={customFormValues['Full Name'] || ''}
                            onChange={(e) => setCustomFormValues({ ...customFormValues, 'Full Name': e.target.value })}
                            className="glass-input"
                            required
                          />
                        </div>

                        {/* Render all merchant-defined dynamic fields */}
                        {tenantData.pages.customForm.fields.map((field, fIdx) => (
                          <div key={fIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {field.fieldName} {field.required ? '*' : ''}
                            </span>
                            {field.fieldType === 'textarea' ? (
                              <textarea
                                placeholder={field.fieldName}
                                value={customFormValues[field.fieldName] || ''}
                                onChange={(e) => setCustomFormValues({ ...customFormValues, [field.fieldName]: e.target.value })}
                                className="glass-input"
                                rows={3}
                                required={field.required}
                              />
                            ) : field.fieldType === 'dropdown' ? (
                              <select
                                value={customFormValues[field.fieldName] || ''}
                                onChange={(e) => setCustomFormValues({ ...customFormValues, [field.fieldName]: e.target.value })}
                                className="glass-input"
                                required={field.required}
                                style={{ background: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--border-color)', padding: '8px 12px' }}
                              >
                                <option value="">Select {field.fieldName}...</option>
                                {(field.options || []).map((opt, oIdx) => (
                                  <option key={oIdx} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={field.fieldType === 'email' ? 'email' : 'text'}
                                placeholder={field.fieldName}
                                value={customFormValues[field.fieldName] || ''}
                                onChange={(e) => setCustomFormValues({ ...customFormValues, [field.fieldName]: e.target.value })}
                                className="glass-input"
                                required={field.required}
                              />
                            )}
                          </div>
                        ))}

                        <button
                          type="submit"
                          className="glass-button"
                          style={{ background: 'var(--primary-gradient)', color: 'white', border: 'none', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                          {tenantData.pages.customForm.submitButtonText || 'Send Message'}
                        </button>
                      </form>
                    </>
                  ) : (
                    // DEFAULT FALLBACK FORM
                    <>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Send size={20} style={{ color: 'var(--primary-accent)' }} />
                        Submit Request & Chat on WhatsApp
                      </h3>

                      {formSuccess.type === 'inquiry' && (
                        <div className="badge green" style={{ width: '100%', padding: '12px', marginBottom: '16px' }}>{formSuccess.msg}</div>
                      )}

                      <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <input
                          type="text"
                          placeholder="Your Full Name..."
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm(prev => ({ ...prev, name: e.target.value }))}
                          className="glass-input"
                          required
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <input
                            type="email"
                            placeholder="Email Address..."
                            value={inquiryForm.email}
                            onChange={(e) => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                            className="glass-input"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Mobile Phone No..."
                            value={inquiryForm.mobile}
                            onChange={(e) => setInquiryForm(prev => ({ ...prev, mobile: e.target.value }))}
                            className="glass-input"
                            required
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Your Delivery Address (Optional)..."
                          value={inquiryForm.address}
                          onChange={(e) => setInquiryForm(prev => ({ ...prev, address: e.target.value }))}
                          className="glass-input"
                        />
                        <textarea
                          placeholder="Describe your request or products requirements..."
                          value={inquiryForm.request}
                          onChange={(e) => setInquiryForm(prev => ({ ...prev, request: e.target.value }))}
                          className="glass-input"
                          rows={4}
                          required
                        />

                        <button
                          type="submit"
                          className="glass-button"
                          style={{ background: 'var(--primary-gradient)', color: 'white', border: 'none', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                          Submit & Send on WhatsApp
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Decent Multi-Column Tenant Footer */}
      <footer style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '60px 0 30px 0',
        marginTop: 'auto',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
      }}>
        <div className="container">

          <div className="grid-cols-12" style={{ gap: '40px', marginBottom: '40px' }}>

            {/* Column 1 - Brand Profile summary */}
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {adminData?.logo ? (
                  <img src={adminData.logo} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    {adminData?.companyName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{adminData?.companyName}</strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Welcome to our premium storefront workspace. We customize high-end products and specialized services in {adminData?.address?.city || 'India'}.
              </p>
              <div>
                <span className="badge" style={{ fontSize: '0.7rem' }}>⭐ Verified Find My Shop Partner</span>
              </div>
            </div>

            {/* Column 2 - Direct Navigation */}
            <div className="col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Quick Navigation</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <a href="#about" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-accent)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Corporate Story</a>
                <a href="#services" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-accent)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Specialized Services</a>
                {pages.products?.length > 0 && <a href="#products" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-accent)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Products Catalog</a>}
                <a href="#contact" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary-accent)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Get In Touch</a>
              </div>
            </div>

            {/* Column 3 - Contact channels details */}
            <div className="col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Official Contacts</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {(pages.contact?.phone || adminData?.phone) && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {pages.contact?.phone || adminData.phone}</span>}
                {(pages.contact?.email || adminData?.email) && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {pages.contact?.email || adminData.email}</span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>💬 WhatsApp Direct Available</span>
                {adminData?.address && <span style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}><MapPin size={14} style={{ marginTop: '3px' }} /> {adminData.address.street}, {adminData.address.city}</span>}
              </div>
            </div>

            {/* Column 4 - Hours and trust badge */}
            <div className="col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Business Hours</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                📆 Monday - Saturday<br />
                ⏰ 09:00 AM - 08:30 PM<br />
                Sunday: Closed
              </p>
            </div>

          </div>

          {/* Copyright line */}
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            <p>© {new Date().getFullYear()} <strong>{adminData?.companyName}</strong>. All rights reserved.</p>
            {(!tenantData?.removeBranding && !tenantData?.pages?.removeBranding) && (
              <p style={{ marginTop: '4px' }}>Powered by Find My Shop SaaS Platform. Live Verified Subdomain Merchant.</p>
            )}
          </div>

        </div>
      </footer>

      {/* Floating Shopping Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: 'var(--primary-accent, var(--accent-purple))',
            color: 'white',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            border: 'none',
            cursor: 'pointer',
            zIndex: 1000,
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <ShoppingCart size={24} />
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#ef4444',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {cartCount}
          </span>
        </button>
      )}

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '400px',
          height: '100%',
          backgroundColor: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart style={{ color: 'var(--primary-accent)' }} /> Shopping Cart
            </h3>
            <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>

          <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '40px' }}>Your cart is empty.</p>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  {item.product.image ? (
                    <img src={item.product.image} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '60px', height: '60px', background: 'var(--bg-tertiary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingCart size={20} /></div>
                  )}
                  <div style={{ flexGrow: 1 }}>
                    <strong style={{ fontSize: '0.95rem', display: 'block' }}>{item.product.title}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-accent)' }}>₹{item.product.price}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <button onClick={() => updateQuantity(item.product, item.quantity - 1)} style={{ width: '24px', height: '24px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'white', cursor: 'pointer' }}>-</button>
                      <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product, item.quantity + 1)} style={{ width: '24px', height: '24px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'white', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', alignSelf: 'flex-start' }}>✕</button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--primary-accent)' }}>₹{cartTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={handleCartCheckout}
                style={{
                  width: '100%',
                  background: 'var(--primary-gradient)',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px var(--primary-glow)'
                }}
              >
                Order via WhatsApp
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default DynamicTenantSite;
