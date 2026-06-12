import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  User, Building2, Palette, Globe, Sliders, Layout, Layers,
  ListCollapse, MessageSquare, Star, Upload, Plus, Trash2, Mail,
  MapPin, LayoutGrid, Sparkles, Image, Phone, Map, Settings, Lock,
  AlertTriangle, Calendar, CheckCircle2, Video, Compass, Eye, Award, Save, LogOut, Edit2, CheckCircle, Smartphone, Monitor, Copy, RefreshCw, AlertCircle, X, Tag
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Define the business themes for the visual card selector
const getMappedThemeType = (type) => {
  if (!type) return 'Corporate & General';
  const t = type.toLowerCase();
  if (t.includes('kirana') || t.includes('grocery') || t.includes('supermarket') || t.includes('essential')) return 'Kirana & Grocery';
  if (t.includes('event') || t.includes('wedding') || t.includes('party')) return 'Mandir & Spiritual';
  if (t.includes('software') || t.includes('it') || t.includes('tech') || t.includes('app') || t.includes('web') || t.includes('telecom') || t.includes('internet')) return 'Software Company';
  if (t.includes('solar') || t.includes('renewable') || t.includes('energy')) return 'Real Estate & Plots'; // Maps to fresh green
  if (t.includes('doctor') || t.includes('clinic') || t.includes('hospital') || t.includes('healthcare') || t.includes('medical') || t.includes('pathology') || t.includes('blood')) {
    if (t.includes('pharmacy') || t.includes('medicine')) return 'Medical & Pharmacy';
    if (t.includes('diet') || t.includes('nutrition') || t.includes('wellness')) return 'Diet & Nutrition';
    if (t.includes('blood') || t.includes('pathology') || t.includes('lab') || t.includes('test')) return 'Blood Bank & Pathology';
    return 'Hospital & Clinic';
  }
  if (t.includes('textile') || t.includes('fabric') || t.includes('saree') || t.includes('boutique') || t.includes('fashion') || t.includes('clothing') || t.includes('wear') || t.includes('jewellery') || t.includes('beauty')) {
    if (t.includes('saree') || t.includes('boutique') || t.includes('fashion') || t.includes('clothing') || t.includes('jewellery') || t.includes('beauty')) return 'Fashion Boutique';
    return 'Kalin & Textile';
  }
  if (t.includes('electronics') || t.includes('gadget') || t.includes('computer') || t.includes('mobile') || t.includes('cyber cafe') || t.includes('digital') || t.includes('stationery') || t.includes('toy')) return 'Electronics';
  if (t.includes('restaurant') || t.includes('dhaba') || t.includes('food') || t.includes('cafe') || t.includes('dining')) return 'Restaurant & Dhaba';
  if (t.includes('hotel') || t.includes('resort') || t.includes('stay') || t.includes('accommodation') || t.includes('lodg') || t.includes('room') || t.includes('suite')) return 'Hotel';
  if (t.includes('real estate') || t.includes('property') || t.includes('plot') || t.includes('jamin') || t.includes('land') || t.includes('flats')) return 'Real Estate & Plots';
  if (t.includes('construction') || t.includes('building') || t.includes('material') || t.includes('builing')) return 'Building Materials';
  if (t.includes('roofing') || t.includes('centering') || t.includes('shuttering') || t.includes('rent')) return 'Roofing & Centering';
  if (t.includes('gym') || t.includes('fitness') || t.includes('sports') || t.includes('training') || t.includes('yoga') || t.includes('crossfit')) return 'Gym & Fitness';
  if (t.includes('salon') || t.includes('parlour') || t.includes('barber') || t.includes('hair') || t.includes('spa')) return 'Beauty Salon';
  if (t.includes('automobile') || t.includes('garage') || t.includes('car') || t.includes('bike') || t.includes('vehicle') || t.includes('transport') || t.includes('driver')) return 'Automobile & Garage';
  if (t.includes('mandir') || t.includes('spiritual') || t.includes('temple') || t.includes('religious') || t.includes('church') || t.includes('mosque')) return 'Mandir & Spiritual';
  if (t.includes('travel') || t.includes('tour') || t.includes('tourism')) return 'Tour & Travel';
  return 'Corporate & General';
};

const businessThemesList = [
  { type: 'Kirana Store', emoji: '🛒', description: 'Grocery and daily essentials shop', defaultColor: 'Green', defaultFont: 'Geometric', accent: '#16a34a' },
  { type: 'Event Planner', emoji: '🎉', description: 'Weddings, corporate and party events management', defaultColor: 'Rose', defaultFont: 'Elegant', accent: '#db2777' },
  { type: 'Software Company', emoji: '💻', description: 'Web development, apps and tech consulting', defaultColor: 'Purple', defaultFont: 'Futuristic', accent: '#a855f7' },
  { type: 'Solar Company', emoji: '☀️', description: 'Renewable solar energy system installations', defaultColor: 'Green', defaultFont: 'Modern', accent: '#84cc16' },
  { type: 'Doctor', emoji: '🩺', description: 'Medical clinics and professional health consultations', defaultColor: 'Blue', defaultFont: 'Modern', accent: '#0ea5e9' },
  { type: 'Textile', emoji: '🧶', description: 'Wholesale and retail textile manufacturing', defaultColor: 'Orange', defaultFont: 'Elegant', accent: '#b45309' },
  { type: 'Saree Shop', emoji: '👗', description: 'Traditional ethnic sarees and bridal wear', defaultColor: 'Purple', defaultFont: 'Elegant', accent: '#ec4899' },
  { type: 'Electronics', emoji: '🔌', description: 'Gadgets, appliances and electronics repairs', defaultColor: 'Sky', defaultFont: 'Futuristic', accent: '#06b6d4' },
  { type: 'Restaurant', emoji: '🍽️', description: 'Delectable dining, cafés and food points', defaultColor: 'Red', defaultFont: 'Bold', accent: '#dc2626' },
  { type: 'Hotel', emoji: '🏨', description: 'Luxurious resort suites and lodgings', defaultColor: 'Golden', defaultFont: 'Luxury', accent: '#d4af37' },
  { type: 'Fashion & Clothing', emoji: '👕', description: 'Businesses relating to Fashion & Clothing', defaultColor: 'Purple', defaultFont: 'Elegant', accent: '#8b5cf6' },
  { type: 'Jewellery & Beauty', emoji: '💎', description: 'Businesses relating to Jewellery & Beauty', defaultColor: 'Rose', defaultFont: 'Elegant', accent: '#db2777' },
  { type: 'Grocery & Supermarket', emoji: '🛍️', description: 'Businesses relating to Grocery & Supermarket', defaultColor: 'Green', defaultFont: 'Geometric', accent: '#10b981' },
  { type: 'Food & Restaurant', emoji: '🍕', description: 'Businesses relating to Food & Restaurant', defaultColor: 'Red', defaultFont: 'Bold', accent: '#f43f5e' },
  { type: 'Hotel & Accommodation', emoji: '🏨', description: 'Businesses relating to Hotel & Accommodation', defaultColor: 'Golden', defaultFont: 'Luxury', accent: '#d4af37' },
  { type: 'Healthcare & Medical', emoji: '🏥', description: 'Businesses relating to Healthcare & Medical', defaultColor: 'Sky', defaultFont: 'Modern', accent: '#06b6d4' },
  { type: 'Education & Training', emoji: '🎓', description: 'Businesses relating to Education & Training', defaultColor: 'Blue', defaultFont: 'Modern', accent: '#3b82f6' },
  { type: 'Events & Wedding Services', emoji: '💍', description: 'Businesses relating to Events & Wedding Services', defaultColor: 'Rose', defaultFont: 'Elegant', accent: '#ec4899' },
  { type: 'Electronics & Technology', emoji: '💻', description: 'Businesses relating to Electronics & Technology', defaultColor: 'Purple', defaultFont: 'Futuristic', accent: '#a855f7' },
  { type: 'Mobile & Computer Services', emoji: '📱', description: 'Businesses relating to Mobile & Computer Services', defaultColor: 'Sky', defaultFont: 'Futuristic', accent: '#0ea5e9' },
  { type: 'Home & Furniture', emoji: '🛋️', description: 'Businesses relating to Home & Furniture', defaultColor: 'Orange', defaultFont: 'Geometric', accent: '#f97316' },
  { type: 'Construction & Building Materials', emoji: '🏗️', description: 'Businesses relating to Construction & Building Materials', defaultColor: 'Orange', defaultFont: 'Bold', accent: '#92400e' },
  { type: 'Automobile & Transport', emoji: '🚗', description: 'Businesses relating to Automobile & Transport', defaultColor: 'NavyBlue', defaultFont: 'Bold', accent: '#2563eb' },
  { type: 'Agriculture & Farming', emoji: '🌾', description: 'Businesses relating to Agriculture & Farming', defaultColor: 'Green', defaultFont: 'Geometric', accent: '#16a34a' },
  { type: 'Real Estate & Property', emoji: '🏢', description: 'Businesses relating to Real Estate & Property', defaultColor: 'Green', defaultFont: 'Bold', accent: '#15803d' },
  { type: 'Financial & Insurance Services', emoji: '💵', description: 'Businesses relating to Financial & Insurance Services', defaultColor: 'Indigo', defaultFont: 'Modern', accent: '#4f46e5' },
  { type: 'Travel & Tourism', emoji: '✈️', description: 'Businesses relating to Travel & Tourism', defaultColor: 'Teal', defaultFont: 'Geometric', accent: '#0d9488' },
  { type: 'Professional Services', emoji: '💼', description: 'Businesses relating to Professional Services', defaultColor: 'Indigo', defaultFont: 'Modern', accent: '#4338ca' },
  { type: 'Manufacturing & Industry', emoji: '🏭', description: 'Businesses relating to Manufacturing & Industry', defaultColor: 'Orange', defaultFont: 'Bold', accent: '#ea580c' },
  { type: 'Home Services & Repairs', emoji: '🛠️', description: 'Businesses relating to Home Services & Repairs', defaultColor: 'Orange', defaultFont: 'Modern', accent: '#d97706' },
  { type: 'Sports & Fitness', emoji: '💪', description: 'Businesses relating to Sports & Fitness', defaultColor: 'Red', defaultFont: 'Bold', accent: '#ef4444' },
  { type: 'Religious & Spiritual Services', emoji: '🛕', description: 'Businesses relating to Religious & Spiritual Services', defaultColor: 'Orange', defaultFont: 'Elegant', accent: '#f97316' },
  { type: 'Printing & Advertising', emoji: '🖨️', description: 'Businesses relating to Printing & Advertising', defaultColor: 'Teal', defaultFont: 'Modern', accent: '#06b6d4' },
  { type: 'Courier & Logistics', emoji: '📦', description: 'Businesses relating to Courier & Logistics', defaultColor: 'Orange', defaultFont: 'Modern', accent: '#d97706' },
  { type: 'Event work', emoji: '🎉', description: 'Businesses relating to Event work', defaultColor: 'Rose', defaultFont: 'Elegant', accent: '#db2777' },
  { type: 'jamin or ploting work', emoji: '🗺️', description: 'Businesses relating to jamin or ploting work', defaultColor: 'Green', defaultFont: 'Bold', accent: '#16a34a' },
  { type: 'builing materlel', emoji: '🧱', description: 'Businesses relating to builing materlel', defaultColor: 'Orange', defaultFont: 'Bold', accent: '#92400e' },
  { type: 'rant work', emoji: '🔑', description: 'Businesses relating to rant work', defaultColor: 'Teal', defaultFont: 'Modern', accent: '#0d9488' },
  { type: 'hous on rant', emoji: '🏠', description: 'Businesses relating to hous on rant', defaultColor: 'Teal', defaultFont: 'Geometric', accent: '#0ea5e9' },
  { type: 'car on rant', emoji: '🚗', description: 'Businesses relating to car on rant', defaultColor: 'NavyBlue', defaultFont: 'Modern', accent: '#3b82f6' },
  { type: 'driver', emoji: '🧑‍✈️', description: 'Businesses relating to driver', defaultColor: 'NavyBlue', defaultFont: 'Modern', accent: '#2563eb' },
  { type: 'Photography & Videography', emoji: '📸', description: 'Businesses relating to Photography & Videography', defaultColor: 'Purple', defaultFont: 'Elegant', accent: '#a855f7' },
  { type: 'Entertainment & Recreation', emoji: '🎮', description: 'Businesses relating to Entertainment & Recreation', defaultColor: 'Purple', defaultFont: 'Futuristic', accent: '#8b5cf6' },
  { type: 'NGOs & Social Organizations', emoji: '🤝', description: 'Businesses relating to NGOs & Social Organizations', defaultColor: 'Green', defaultFont: 'Modern', accent: '#10b981' },
  { type: 'Government & Public Services', emoji: '🏛️', description: 'Businesses relating to Government & Public Services', defaultColor: 'Blue', defaultFont: 'Modern', accent: '#3b82f6' },
  { type: 'Pet Care & Veterinary Services', emoji: '🐾', description: 'Businesses relating to Pet Care & Veterinary Services', defaultColor: 'Green', defaultFont: 'Geometric', accent: '#10b981' },
  { type: 'Water & Gas Suppliers', emoji: '💧', description: 'Businesses relating to Water & Gas Suppliers', defaultColor: 'Sky', defaultFont: 'Modern', accent: '#0ea5e9' },
  { type: 'Scrap & Recycling', emoji: '♻️', description: 'Businesses relating to Scrap & Recycling', defaultColor: 'Green', defaultFont: 'Modern', accent: '#16a34a' },
  { type: 'Security & Safety Services', emoji: '🛡️', description: 'Businesses relating to Security & Safety Services', defaultColor: 'NavyBlue', defaultFont: 'Bold', accent: '#1e3a8a' },
  { type: 'Solar & Renewable Energy', emoji: '☀️', description: 'Businesses relating to Solar & Renewable Energy', defaultColor: 'Green', defaultFont: 'Modern', accent: '#84cc16' },
  { type: 'Internet & Telecom Services', emoji: '🌐', description: 'Businesses relating to Internet & Telecom Services', defaultColor: 'Sky', defaultFont: 'Futuristic', accent: '#06b6d4' },
  { type: 'E-commerce & Online Services', emoji: '🛒', description: 'Businesses relating to E-commerce & Online Services', defaultColor: 'Indigo', defaultFont: 'Geometric', accent: '#6366f1' },
  { type: 'Software & IT Services', emoji: '💻', description: 'Businesses relating to Software & IT Services', defaultColor: 'Purple', defaultFont: 'Futuristic', accent: '#a855f7' },
  { type: 'Cyber Cafe & Digital Services', emoji: '🖥️', description: 'Businesses relating to Cyber Cafe & Digital Services', defaultColor: 'Sky', defaultFont: 'Futuristic', accent: '#06b6d4' },
  { type: 'Legal Services', emoji: '⚖️', description: 'Businesses relating to Legal Services', defaultColor: 'Indigo', defaultFont: 'Modern', accent: '#4f46e5' },
  { type: 'Consultancy Services', emoji: '📊', description: 'Businesses relating to Consultancy Services', defaultColor: 'Indigo', defaultFont: 'Modern', accent: '#4338ca' },
  { type: 'Recruitment & Job Services', emoji: '👥', description: 'Businesses relating to Recruitment & Job Services', defaultColor: 'Blue', defaultFont: 'Modern', accent: '#3b82f6' },
  { type: 'Textile & Fabric Businesses', emoji: '🧶', description: 'Businesses relating to Textile & Fabric Businesses', defaultColor: 'Orange', defaultFont: 'Elegant', accent: '#b45309' },
  { type: 'Handicrafts & Art', emoji: '🎨', description: 'Businesses relating to Handicrafts & Art', defaultColor: 'Orange', defaultFont: 'Elegant', accent: '#d97706' },
  { type: 'Gift & Stationery Stores', emoji: '🎁', description: 'Businesses relating to Gift & Stationery Stores', defaultColor: 'Rose', defaultFont: 'Geometric', accent: '#db2777' },
  { type: 'Toys & Baby Products', emoji: '🧸', description: 'Businesses relating to Toys & Baby Products', defaultColor: 'Rose', defaultFont: 'Geometric', accent: '#ec4899' },
  { type: 'Books & Publications', emoji: '📚', description: 'Businesses relating to Books & Publications', defaultColor: 'Blue', defaultFont: 'Modern', accent: '#3b82f6' },
  { type: 'Wholesale & Distribution', emoji: '📦', description: 'Businesses relating to Wholesale & Distribution', defaultColor: 'Indigo', defaultFont: 'Modern', accent: '#4f46e5' },
  { type: 'Import & Export Businesses', emoji: '🚢', description: 'Businesses relating to Import & Export Businesses', defaultColor: 'Teal', defaultFont: 'Modern', accent: '#0d9488' },
  { type: 'Warehousing & Storage', emoji: '🏢', description: 'Businesses relating to Warehousing & Storage', defaultColor: 'Indigo', defaultFont: 'Modern', accent: '#4338ca' },
  { type: 'Cleaning & Pest Control Services', emoji: '🧹', description: 'Businesses relating to Cleaning & Pest Control Services', defaultColor: 'Green', defaultFont: 'Modern', accent: '#10b981' },
  { type: 'Other Businesses', emoji: '🏢', description: 'Businesses relating to Other Businesses', defaultColor: 'Indigo', defaultFont: 'Modern', accent: '#4338ca' }
];

const getThemeModalStyle = (type) => {
  const mappedType = getMappedThemeType(type);
  switch (mappedType) {
    case 'Mandir & Spiritual':
      return {
        bg: 'linear-gradient(135deg, #0a0815 0%, #1a0c0a 100%)',
        border: 'rgba(234, 88, 12, 0.5)',
        glow: 'rgba(234, 88, 12, 0.3)',
        accent: '#ea580c',
        accentSoft: 'rgba(234, 88, 12, 0.08)',
        headerBg: 'rgba(234, 88, 12, 0.06)',
        btnGradient: 'linear-gradient(135deg, #f97316, #ea580c)',
        launchLabel: '🛕 Launch Sacred Theme'
      };
    case 'Hotel':
      return {
        bg: 'linear-gradient(135deg, #0f0c08 0%, #1c1712 100%)',
        border: 'rgba(212, 175, 55, 0.5)',
        glow: 'rgba(212, 175, 55, 0.25)',
        accent: '#d4af37',
        accentSoft: 'rgba(212, 175, 55, 0.06)',
        headerBg: 'rgba(212, 175, 55, 0.05)',
        btnGradient: 'linear-gradient(135deg, #af8f2c, #705510)',
        launchLabel: '🏨 Launch Luxury Theme'
      };
    case 'Tour & Travel':
      return {
        bg: 'linear-gradient(135deg, #0a0f12 0%, #081812 100%)',
        border: 'rgba(13, 148, 136, 0.5)',
        glow: 'rgba(13, 148, 136, 0.25)',
        accent: '#0d9488',
        accentSoft: 'rgba(13, 148, 136, 0.06)',
        headerBg: 'rgba(13, 148, 136, 0.05)',
        btnGradient: 'linear-gradient(135deg, #0d9488, #0284c7)',
        launchLabel: '✈️ Launch Travel Theme'
      };
    case 'Software Company':
      return {
        bg: 'linear-gradient(135deg, #05050a 0%, #0a0514 100%)',
        border: 'rgba(168, 85, 247, 0.5)',
        glow: 'rgba(168, 85, 247, 0.3)',
        accent: '#a855f7',
        accentSoft: 'rgba(168, 85, 247, 0.06)',
        headerBg: 'rgba(168, 85, 247, 0.05)',
        btnGradient: 'linear-gradient(135deg, #a855f7, #06b6d4)',
        launchLabel: '💻 Launch Tech Theme'
      };
    case 'Kalin & Textile':
      return {
        bg: 'linear-gradient(135deg, #150b07 0%, #1a100a 100%)',
        border: 'rgba(180, 83, 9, 0.5)',
        glow: 'rgba(180, 83, 9, 0.2)',
        accent: '#b45309',
        accentSoft: 'rgba(180, 83, 9, 0.06)',
        headerBg: 'rgba(180, 83, 9, 0.05)',
        btnGradient: 'linear-gradient(135deg, #b45309, #d97706)',
        launchLabel: '🧶 Launch Textile Theme'
      };
    case 'Electronics':
      return {
        bg: 'linear-gradient(135deg, #050b14 0%, #020d1a 100%)',
        border: 'rgba(6, 182, 212, 0.5)',
        glow: 'rgba(6, 182, 212, 0.3)',
        accent: '#06b6d4',
        accentSoft: 'rgba(6, 182, 212, 0.06)',
        headerBg: 'rgba(6, 182, 212, 0.05)',
        btnGradient: 'linear-gradient(135deg, #06b6d4, #2563eb)',
        launchLabel: '🔌 Launch Electronics Theme'
      };
    case 'Real Estate & Plots':
      return { bg: 'linear-gradient(135deg, #061209 0%, #0d1f10 100%)', border: 'rgba(21,128,61,0.5)', glow: 'rgba(21,128,61,0.25)', accent: '#15803d', accentSoft: 'rgba(21,128,61,0.08)', headerBg: 'rgba(21,128,61,0.06)', btnGradient: 'linear-gradient(135deg, #15803d, #166534)', launchLabel: '🏗️ Launch Property Theme' };
    case 'Building Materials':
      return { bg: 'linear-gradient(135deg, #0c0a08 0%, #1a1007 100%)', border: 'rgba(146,64,14,0.5)', glow: 'rgba(146,64,14,0.25)', accent: '#92400e', accentSoft: 'rgba(146,64,14,0.08)', headerBg: 'rgba(146,64,14,0.06)', btnGradient: 'linear-gradient(135deg, #92400e, #b45309)', launchLabel: '🧱 Launch Builder Theme' };
    case 'Roofing & Centering':
      return { bg: 'linear-gradient(135deg, #0f0a07 0%, #1a0d07 100%)', border: 'rgba(194,65,12,0.5)', glow: 'rgba(194,65,12,0.25)', accent: '#c2410c', accentSoft: 'rgba(194,65,12,0.08)', headerBg: 'rgba(194,65,12,0.06)', btnGradient: 'linear-gradient(135deg, #c2410c, #9a3412)', launchLabel: '🔩 Launch Roofing Theme' };
    case 'Medical & Pharmacy':
      return { bg: 'linear-gradient(135deg, #030b14 0%, #060d1a 100%)', border: 'rgba(2,132,199,0.5)', glow: 'rgba(2,132,199,0.25)', accent: '#0284c7', accentSoft: 'rgba(2,132,199,0.08)', headerBg: 'rgba(2,132,199,0.06)', btnGradient: 'linear-gradient(135deg, #0284c7, #0369a1)', launchLabel: '💊 Launch Pharmacy Theme' };
    case 'Hospital & Clinic':
      return { bg: 'linear-gradient(135deg, #020d17 0%, #04111e 100%)', border: 'rgba(14,165,233,0.5)', glow: 'rgba(14,165,233,0.3)', accent: '#0ea5e9', accentSoft: 'rgba(14,165,233,0.07)', headerBg: 'rgba(14,165,233,0.06)', btnGradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)', launchLabel: '🏥 Launch Hospital Theme' };
    case 'Diet & Nutrition':
      return { bg: 'linear-gradient(135deg, #01110a 0%, #041a0e 100%)', border: 'rgba(5,150,105,0.5)', glow: 'rgba(5,150,105,0.25)', accent: '#059669', accentSoft: 'rgba(5,150,105,0.07)', headerBg: 'rgba(5,150,105,0.05)', btnGradient: 'linear-gradient(135deg, #059669, #047857)', launchLabel: '🥗 Launch Wellness Theme' };
    case 'Blood Bank & Pathology':
      return { bg: 'linear-gradient(135deg, #0f0203 0%, #1a0406 100%)', border: 'rgba(190,18,60,0.55)', glow: 'rgba(190,18,60,0.3)', accent: '#be123c', accentSoft: 'rgba(190,18,60,0.08)', headerBg: 'rgba(190,18,60,0.06)', btnGradient: 'linear-gradient(135deg, #be123c, #9f1239)', launchLabel: '🩸 Launch Lab Theme' };
    case 'Restaurant & Dhaba':
      return { bg: 'linear-gradient(135deg, #0f0403 0%, #1a0703 100%)', border: 'rgba(220,38,38,0.5)', glow: 'rgba(220,38,38,0.25)', accent: '#dc2626', accentSoft: 'rgba(220,38,38,0.08)', headerBg: 'rgba(220,38,38,0.06)', btnGradient: 'linear-gradient(135deg, #dc2626, #b91c1c)', launchLabel: '🍽️ Launch Restaurant Theme' };
    case 'Kirana & Grocery':
      return { bg: 'linear-gradient(135deg, #031008 0%, #071a0a 100%)', border: 'rgba(22,163,74,0.5)', glow: 'rgba(22,163,74,0.25)', accent: '#16a34a', accentSoft: 'rgba(22,163,74,0.08)', headerBg: 'rgba(22,163,74,0.06)', btnGradient: 'linear-gradient(135deg, #16a34a, #15803d)', launchLabel: '🛒 Launch Kirana Theme' };
    case 'Beauty Salon':
      return { bg: 'linear-gradient(135deg, #14060e 0%, #1e0814 100%)', border: 'rgba(219,39,119,0.5)', glow: 'rgba(219,39,119,0.3)', accent: '#db2777', accentSoft: 'rgba(219,39,119,0.08)', headerBg: 'rgba(219,39,119,0.06)', btnGradient: 'linear-gradient(135deg, #db2777, #be185d)', launchLabel: '💄 Launch Salon Theme' };
    case 'Gym & Fitness':
      return { bg: 'linear-gradient(135deg, #0a0303 0%, #150505 100%)', border: 'rgba(239,68,68,0.6)', glow: 'rgba(239,68,68,0.35)', accent: '#ef4444', accentSoft: 'rgba(239,68,68,0.1)', headerBg: 'rgba(239,68,68,0.07)', btnGradient: 'linear-gradient(135deg, #ef4444, #dc2626)', launchLabel: '💪 Launch Fitness Theme' };
    case 'Automobile & Garage':
      return { bg: 'linear-gradient(135deg, #04060f 0%, #070b17 100%)', border: 'rgba(37,99,235,0.5)', glow: 'rgba(37,99,235,0.25)', accent: '#2563eb', accentSoft: 'rgba(37,99,235,0.08)', headerBg: 'rgba(37,99,235,0.06)', btnGradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)', launchLabel: '🚗 Launch Auto Theme' };
    case 'Fashion Boutique':
      return { bg: 'linear-gradient(135deg, #0c0610 0%, #140a1a 100%)', border: 'rgba(124,58,237,0.5)', glow: 'rgba(124,58,237,0.3)', accent: '#7c3aed', accentSoft: 'rgba(124,58,237,0.08)', headerBg: 'rgba(124,58,237,0.06)', btnGradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)', launchLabel: '👗 Launch Boutique Theme' };
    case 'Corporate & General':
      return { bg: 'linear-gradient(135deg, #05070f 0%, #080c18 100%)', border: 'rgba(67,56,202,0.5)', glow: 'rgba(67,56,202,0.25)', accent: '#4338ca', accentSoft: 'rgba(67,56,202,0.08)', headerBg: 'rgba(67,56,202,0.06)', btnGradient: 'linear-gradient(135deg, #4338ca, #3730a3)', launchLabel: '🏢 Launch Corporate Theme' };
    default:
      return {
        bg: '#0d0f17',
        border: 'rgba(139, 92, 246, 0.3)',
        glow: 'rgba(139, 92, 246, 0.25)',
        accent: '#8b5cf6',
        accentSoft: 'rgba(139, 92, 246, 0.06)',
        headerBg: 'rgba(139, 92, 246, 0.05)',
        btnGradient: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
        launchLabel: '🚀 Launch & Apply Live'
      };
  }
};

const AdminDashboard = () => {
  const { user, tenant, API_URL, refreshSession, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Active UI tab (16 granular tabs)
  // dashboard, controller, branding, address, subdomain, theme, banner, home, about, services, products, gallery, contact, googlemap, seo, inbox
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'dashboard');

  // Profile forms
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [password, setPassword] = useState('');
  const [currentPasswordVal, setCurrentPasswordVal] = useState('');
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [confirmNewPasswordVal, setConfirmNewPasswordVal] = useState('');

  // Address & Extended Details
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [mapLocation, setMapLocation] = useState('');
  const [additionalItems, setAdditionalItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [remarks, setRemarks] = useState('');
  const [socialLinks, setSocialLinks] = useState({ website: '', youtube: '', facebook: '', instagram: '' });

  // Builder JSON models
  const [themeConfig, setThemeConfig] = useState({
    businessType: 'Kirana Store',
    seasonType: 'Default',
    colorTheme: 'Blue'
  });

  const [pagesConfig, setPagesConfig] = useState({
    home: {
      bannerSlider: [],
      welcomeText: { heading: '', paragraph: '', show: true },
      heroSection: { title: '', subtitle: '', buttonText: '', buttonLink: '' },
      autoScrollText: { text: '', show: true },
      bannerSettings: { show: true, opacity: 0.5 },
      videoUrl: '',
      visibility: {
        banner: true,
        welcome: true,
        services: true,
        products: true,
        gallery: true,
        contact: true,
        map: true,
        reviews: true
      }
    },
    about: { story: '', mission: '', vision: '' },
    services: [],
    products: [],
    gallery: [],
    contact: { mapEmbedCode: '', whatsappNumber: '', email: '', phone: '' },
    seo: { title: '', description: '' }
  });

  // Dynamic add items states
  const [newSlide, setNewSlide] = useState({ image: '', title: '', subtitle: '', price: 0, originalPrice: 0, buttonText: '', buttonLink: '' });
  const [newService, setNewService] = useState({ title: '', description: '', image: '' });
  const [newProduct, setNewProduct] = useState({ title: '', description: '', price: 0, category: '', image: '' });
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryType, setNewGalleryType] = useState('image');
  const [newManualReview, setNewManualReview] = useState({ name: '', rating: 5, review: '' });
  const [ratingsList, setRatingsList] = useState([]);

  // Inbox & reviews list
  const [messages, setMessages] = useState([]);
  const [showCreateEnquiryModal, setShowCreateEnquiryModal] = useState(false);
  const [showEditEnquiryModal, setShowEditEnquiryModal] = useState(false);
  const [showReplyEnquiryModal, setShowReplyEnquiryModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiryFormVal, setEnquiryFormVal] = useState({ name: '', email: '', mobile: '', address: '', request: '' });
  const [replyTextVal, setReplyTextVal] = useState('');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);

  // Subdomain & SEO Configurations
  const [subdomainName, setSubdomainName] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Custom Domain links states
  const [domainRequest, setDomainRequest] = useState(null);
  const [newRequestedDomain, setNewRequestedDomain] = useState('');
  const [loadingDomainReq, setLoadingDomainReq] = useState(false);

  // Dynamic Custom Form Builder states
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState('Contact Us');
  const [formDescription, setFormDescription] = useState('Reach out to us directly');
  const [formSubmitBtnText, setFormSubmitBtnText] = useState('Send Message');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [newFieldOptions, setNewFieldOptions] = useState('');

  // White-label state
  const [removeBrandingState, setRemoveBrandingState] = useState(false);
  const [whatsappPromo, setWhatsappPromo] = useState('');

  // Dynamic Iframe preview & popups
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedThemeOption, setSelectedThemeOption] = useState(null);
  const [previewViewport, setPreviewViewport] = useState('desktop');
  const iframeRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const extractSrcFromIframe = (input) => {
    if (!input) return { mapEmbedCode: '', lat: '', lng: '' };
    
    let url = input.trim();
    // If it's a full <iframe> element
    if (url.includes('<iframe') && url.includes('src=')) {
      const match = url.match(/src=["']([^"']+)["']/);
      if (match) url = match[1];
    }
    
    const decoded = decodeURIComponent(url);

    // Case 1: Google Maps Place URL
    if (decoded.includes('google.com/maps/place/') || decoded.includes('google.co.in/maps/place/') || decoded.includes('/maps/place/')) {
      const placeMatch = decoded.match(/maps\/place\/([^/@]+)/);
      const coordsMatch = decoded.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      
      let query = '';
      if (placeMatch && placeMatch[1]) {
        query = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      } else if (coordsMatch && coordsMatch[1] && coordsMatch[2]) {
        query = `${coordsMatch[1]},${coordsMatch[2]}`;
      }
      
      if (query) {
        return {
          mapEmbedCode: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
          lat: coordsMatch ? coordsMatch[1] : '',
          lng: coordsMatch ? coordsMatch[2] : ''
        };
      }
    }
    
    // Case 2: Coordinate maps URLs (including 3D street view URLs since we want standard 2D view now!)
    if (decoded.includes('/maps/') && decoded.includes('@')) {
      const coordsMatch = decoded.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordsMatch && coordsMatch[1] && coordsMatch[2]) {
        const lat = coordsMatch[1];
        const lng = coordsMatch[2];
        return {
          mapEmbedCode: `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
          lat,
          lng
        };
      }
    }

    // Case 3: If it's already an embed URL or contains output=embed
    if (url.includes('output=embed') || url.includes('google.com/maps/embed')) {
      const coordsMatch = decoded.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/) || decoded.match(/!2d(-?\d+\.\d+)!3d(-?\d+\.\d+)/);
      let lat = '';
      let lng = '';
      if (coordsMatch) {
        if (decoded.includes('!2d') && decoded.includes('!3d')) {
          const pbMatch = decoded.match(/!2d(-?\d+\.\d+)!3d(-?\d+\.\d+)/);
          if (pbMatch) {
            lng = pbMatch[1];
            lat = pbMatch[2];
          }
        } else {
          lat = coordsMatch[1];
          lng = coordsMatch[2];
        }
      }
      return {
        mapEmbedCode: url,
        lat,
        lng
      };
    }

    // Default: treat as generic search query
    return {
      mapEmbedCode: `https://maps.google.com/maps?q=${encodeURIComponent(url)}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
      lat: '',
      lng: ''
    };
  };

  const handleMapChange = async (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setPagesConfig(prev => ({
        ...prev,
        contact: {
          ...(prev.contact || {}),
          mapEmbedCode: '',
          latitude: '',
          longitude: ''
        }
      }));
      return;
    }

    // Check if it's a shortened URL that needs resolving
    if (trimmed.includes('maps.app.goo.gl') || trimmed.includes('goo.gl/maps')) {
      try {
        const res = await axios.get(`${API_URL}/tenant/resolve-map-url?url=${encodeURIComponent(trimmed)}`);
        const resolved = res.data.resolvedUrl;
        const result = extractSrcFromIframe(resolved);
        setPagesConfig(prev => ({
          ...prev,
          contact: {
            ...(prev.contact || {}),
            mapEmbedCode: result.mapEmbedCode,
            latitude: result.lat || prev.contact?.latitude || '',
            longitude: result.lng || prev.contact?.longitude || ''
          }
        }));
      } catch (err) {
        console.error('Failed to resolve short map URL:', err.message);
        // Fallback to direct extraction
        const result = extractSrcFromIframe(trimmed);
        setPagesConfig(prev => ({
          ...prev,
          contact: {
            ...(prev.contact || {}),
            mapEmbedCode: result.mapEmbedCode,
            latitude: result.lat || prev.contact?.latitude || '',
            longitude: result.lng || prev.contact?.longitude || ''
          }
        }));
      }
    } else {
      const result = extractSrcFromIframe(trimmed);
      setPagesConfig(prev => ({
        ...prev,
        contact: {
          ...(prev.contact || {}),
          mapEmbedCode: result.mapEmbedCode,
          latitude: result.lat || prev.contact?.latitude || '',
          longitude: result.lng || prev.contact?.longitude || ''
        }
      }));
    }
  };


  const openPreviewModal = (themeOption) => {
    const url = `/${user?.subdomain || subdomainName || 'kiranstore'}?preview=true&previewTheme=${encodeURIComponent(themeOption.type)}&previewColorTheme=${encodeURIComponent(themeConfig.colorTheme || themeOption.defaultColor || 'Blue')}&previewMode=${encodeURIComponent(themeConfig.themeMode || 'Dark')}&previewSeason=${encodeURIComponent(themeConfig.seasonType || 'Default')}&previewFont=${encodeURIComponent(themeConfig.fontStyle || themeOption.defaultFont || 'Modern')}`;
    setPreviewUrl(url);
    setSelectedThemeOption(themeOption);
    setShowThemeModal(true);
  };

  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow && selectedThemeOption) {
      iframeRef.current.contentWindow.postMessage({
        type: 'PREVIEW_UPDATE',
        theme: selectedThemeOption.type,
        colorTheme: themeConfig.colorTheme || selectedThemeOption.defaultColor || 'Blue',
        mode: themeConfig.themeMode || 'Dark',
        season: themeConfig.seasonType || 'Default',
        font: themeConfig.fontStyle || selectedThemeOption.defaultFont || 'Modern'
      }, '*');
    }
  };

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow && selectedThemeOption) {
      iframeRef.current.contentWindow.postMessage({
        type: 'PREVIEW_UPDATE',
        theme: selectedThemeOption.type,
        colorTheme: themeConfig.colorTheme || selectedThemeOption.defaultColor || 'Blue',
        mode: themeConfig.themeMode || 'Dark',
        season: themeConfig.seasonType || 'Default',
        font: themeConfig.fontStyle || selectedThemeOption.defaultFont || 'Modern'
      }, '*');
    }
  }, [selectedThemeOption, themeConfig]);

  // All Shops Directory State
  const [allShops, setAllShops] = useState([]);
  const [shopSearchQuery, setShopSearchQuery] = useState('');
  const [shopFilterCat, setShopFilterCat] = useState('');

  // WhatsApp Campaigns state
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [newCampaignMessage, setNewCampaignMessage] = useState('');
  const [newCampaignAudience, setNewCampaignAudience] = useState('All Customers');
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [campaignLoading, setCampaignLoading] = useState(false);

  const loadAllShops = async () => {
    try {
      const res = await axios.get(`${API_URL}/tenant/list`);
      setAllShops(res.data);
    } catch (err) {
      console.error('Failed to load all shops:', err.message);
    }
  };

  useEffect(() => {
    if (activeTab === 'all_shops') {
      loadAllShops();
    }
  }, [activeTab, API_URL]);

  // Security guard
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        navigate('/login');
      }
    }
  }, [user, authLoading, navigate]);

  // Load Admin configurations with robust defensive defaults
  useEffect(() => {
    if (user && tenant) {
      setCompanyName(user.companyName || '');
      setPhone(user.phone || '');
      setWhatsapp(user.whatsapp || '');
      setLogo(user.logo || '');
      setBanner(user.banner || '');
      setSubdomainName(user.subdomain || '');
      setSeoTitle(tenant.pages?.seo?.title || user.companyName || '');
      setSeoDescription(tenant.pages?.seo?.description || tenant.pages?.home?.welcomeText?.paragraph || '');
      
      setStreet(user.address?.street || '');
      setCity(user.address?.city || '');
      setState(user.address?.state || '');
      setPinCode(user.address?.pinCode || '');
      
      setLandmark(user.landmark || '');
      setMapLocation(user.mapLocation || '');
      setAdditionalItems(user.additionalItems || []);
      setRemarks(user.remarks || '');
      setSocialLinks(user.socialLinks || { website: '', youtube: '', facebook: '', instagram: '' });

      setThemeConfig(tenant.theme || {
        businessType: 'Kirana Store',
        seasonType: 'Default',
        colorTheme: 'Blue',
        fontStyle: 'Modern'
      });
      setRatingsList(tenant.ratings || []);

      const loadedPages = tenant.pages || {};
      const homeConfig = loadedPages.home || {};

      setPagesConfig({
        home: {
          bannerSlider: homeConfig.bannerSlider || [],
          bannerSettings: homeConfig.bannerSettings || { show: true, opacity: 0.5 },
          welcomeText: homeConfig.welcomeText || { heading: '', paragraph: '', show: true },
          heroSection: homeConfig.heroSection || { title: '', subtitle: '', buttonText: '', buttonLink: '' },
          autoScrollText: homeConfig.autoScrollText || { text: '', show: true },
          videoUrl: homeConfig.videoUrl || '',
          visibility: homeConfig.visibility || {
            banner: true,
            welcome: true,
            services: true,
            products: true,
            gallery: true,
            contact: true,
            map: true,
            reviews: true
          }
        },
        about: loadedPages.about || { story: '', mission: '', vision: '' },
        services: loadedPages.services || [],
        products: loadedPages.products || [],
        gallery: loadedPages.gallery || [],
        contact: loadedPages.contact || { mapEmbedCode: '', streetViewEmbedCode: '', latitude: '', longitude: '', whatsappNumber: '', email: '', phone: '' },
        seo: loadedPages.seo || { title: '', description: '' },
        customForm: loadedPages.customForm || { formTitle: 'Contact Us', formDescription: 'Reach out to us directly', submitButtonText: 'Send Message', fields: [] }
      });

      const loadedForm = loadedPages.customForm || {
        formTitle: 'Contact Us',
        formDescription: 'Reach out to us directly',
        submitButtonText: 'Send Message',
        fields: []
      };
      setFormTitle(loadedForm.formTitle || 'Contact Us');
      setFormDescription(loadedForm.formDescription || 'Reach out to us directly');
      setFormSubmitBtnText(loadedForm.submitButtonText || 'Send Message');
      setFormFields(loadedForm.fields || []);
      setRemoveBrandingState(tenant.removeBranding || false);
      setWhatsappPromo(user.whatsappPromoTemplate || 'Hello! Check out our new products and offers on our website!');

      loadMessages();
      loadCampaigns();
    }
  }, [user, tenant]);

  const loadMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/tenant/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load enquiries inbox:', err.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    try {
      await axios.delete(`${API_URL}/tenant/messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      showAlert('green', 'Enquiry deleted successfully.');
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to delete enquiry.');
    }
  };

  const handleCreateEnquiry = async (e) => {
    e.preventDefault();
    if (!enquiryFormVal.name || !enquiryFormVal.request) {
      showAlert('danger', 'Name and message request fields are required.');
      return;
    }
    setSaving(true);
    try {
      const res = await axios.post(`${API_URL}/tenant/messages`, enquiryFormVal);
      setMessages(prev => [res.data.data, ...prev]);
      showAlert('green', 'Enquiry created successfully!');
      setShowCreateEnquiryModal(false);
      setEnquiryFormVal({ name: '', email: '', mobile: '', address: '', request: '' });
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to create enquiry.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEnquiry = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setSaving(true);
    try {
      const res = await axios.put(`${API_URL}/tenant/messages/${selectedEnquiry._id}`, enquiryFormVal);
      setMessages(prev => prev.map(m => m._id === selectedEnquiry._id ? res.data.data : m));
      showAlert('green', 'Enquiry details updated successfully.');
      setShowEditEnquiryModal(false);
      setSelectedEnquiry(null);
      setEnquiryFormVal({ name: '', email: '', mobile: '', address: '', request: '' });
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to update enquiry.');
    } finally {
      setSaving(false);
    }
  };

  const handleReplyEnquiry = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry || !replyTextVal.trim()) return;
    setSaving(true);
    try {
      const res = await axios.post(`${API_URL}/tenant/messages/${selectedEnquiry._id}/reply`, { replyText: replyTextVal });
      setMessages(prev => prev.map(m => m._id === selectedEnquiry._id ? res.data.data : m));
      showAlert('green', 'Reply saved! Opening WhatsApp chat window...');
      setShowReplyEnquiryModal(false);
      
      // WhatsApp redirect to customer
      const customerMobile = selectedEnquiry.mobile ? selectedEnquiry.mobile.replace(/\D/g, '') : '';
      if (customerMobile) {
        const cleanMobile = customerMobile.length === 10 ? '91' + customerMobile : customerMobile;
        const whatsappText = `Hello ${selectedEnquiry.name || 'there'}! 😊\n\nRegarding your enquiry with *${companyName || 'our shop'}*:\n"${selectedEnquiry.request}"\n\n👉 *OUR RESPONSE:*\n${replyTextVal}`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanMobile}&text=${encodeURIComponent(whatsappText)}`;
        window.open(whatsappUrl, '_blank');
      }
      setReplyTextVal('');
      setSelectedEnquiry(null);
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to reply to enquiry.');
    } finally {
      setSaving(false);
    }
  };

  const loadCampaigns = async () => {
    try {
      const res = await axios.get(`${API_URL}/campaigns`);
      setCampaigns(res.data);
    } catch (err) {
      console.error('Failed to load campaigns:', err.message);
    }
  };

  const handleSaveCampaignSubmit = async (e) => {
    e.preventDefault();
    if (!newCampaignTitle.trim() || !newCampaignMessage.trim()) return;
    setCampaignLoading(true);
    try {
      if (editingCampaignId) {
        const res = await axios.put(`${API_URL}/campaigns/${editingCampaignId}`, {
          title: newCampaignTitle,
          message: newCampaignMessage,
          targetAudience: newCampaignAudience
        });
        showAlert('green', res.data.message || 'Campaign updated successfully!');
      } else {
        const res = await axios.post(`${API_URL}/campaigns`, {
          title: newCampaignTitle,
          message: newCampaignMessage,
          targetAudience: newCampaignAudience
        });
        showAlert('green', res.data.message || 'Campaign created successfully!');
      }
      setNewCampaignTitle('');
      setNewCampaignMessage('');
      setNewCampaignAudience('All Customers');
      setEditingCampaignId(null);
      loadCampaigns();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to save campaign.');
    } finally {
      setCampaignLoading(false);
    }
  };

  const handleEditCampaign = (camp) => {
    setEditingCampaignId(camp._id);
    setNewCampaignTitle(camp.title);
    setNewCampaignMessage(camp.message);
    setNewCampaignAudience(camp.targetAudience || 'All Customers');
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await axios.delete(`${API_URL}/campaigns/${id}`);
      showAlert('green', 'Campaign deleted successfully.');
      loadCampaigns();
    } catch (err) {
      showAlert('danger', 'Failed to delete campaign.');
    }
  };

  const handleBroadcastCampaign = async (id) => {
    try {
      const res = await axios.post(`${API_URL}/campaigns/${id}/broadcast`);
      showAlert('green', res.data.message);
      loadCampaigns();
      window.open(res.data.whatsappUrl, '_blank');
    } catch (err) {
      showAlert('danger', 'Failed to initiate campaign broadcast.');
    }
  };

  const loadDomainRequest = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/domain-request`);
      setDomainRequest(res.data);
    } catch (err) {
      console.error('Failed to load domain request status:', err.message);
    }
  };

  useEffect(() => {
    if (user) {
      loadDomainRequest();
      loadCampaigns();
    }
  }, [user]);

  const handleRequestDomainSubmit = async (e) => {
    e.preventDefault();
    if (!newRequestedDomain) return;
    setLoadingDomainReq(true);
    try {
      const res = await axios.post(`${API_URL}/admin/domain-request`, { requestedDomain: newRequestedDomain });
      showAlert('green', res.data.message);
      setNewRequestedDomain('');
      loadDomainRequest();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to submit custom domain request.');
    } finally {
      setLoadingDomainReq(false);
    }
  };

  const handleAddField = () => {
    if (!newFieldName) return;
    const addedField = {
      fieldName: newFieldName.trim(),
      fieldType: newFieldType,
      required: newFieldRequired,
      options: newFieldType === 'dropdown' ? newFieldOptions.split(',').map(o => o.trim()).filter(Boolean) : []
    };
    setFormFields([...formFields, addedField]);
    setNewFieldName('');
    setNewFieldOptions('');
  };

  const handleRemoveField = (idx) => {
    setFormFields(formFields.filter((_, i) => i !== idx));
  };

  const handleSaveFormBuilder = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedPages = {
        ...pagesConfig,
        customForm: {
          formTitle,
          formDescription,
          submitButtonText: formSubmitBtnText,
          fields: formFields
        }
      };
      setPagesConfig(updatedPages);
      await saveWebsiteConfig(themeConfig, updatedPages, ratingsList);
      showAlert('green', 'Dynamic form configurations saved successfully!');
    } catch (err) {
      showAlert('danger', 'Failed to save form configurations.');
    } finally {
      setSaving(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  // Base64 helper for custom uploads
  const handleBase64Upload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile brand updates
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        companyName,
        phone,
        whatsapp,
        address: { street, city, state, pinCode, country: 'India' },
        landmark,
        mapLocation,
        additionalItems,
        remarks,
        socialLinks,
        logo,
        banner
      };
      if (password) payload.password = password;

      await axios.put(`${API_URL}/admin/profile`, payload);
      showAlert('green', 'Branding parameters updated successfully!');
      setPassword('');
      await refreshSession();
    } catch (err) {
      showAlert('danger', 'Failed to update branding attributes.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPasswordVal || !newPasswordVal || !confirmNewPasswordVal) {
      showAlert('danger', 'Please enter all password fields.');
      return;
    }
    if (newPasswordVal.length < 6) {
      showAlert('danger', 'New password must be at least 6 characters long.');
      return;
    }
    if (newPasswordVal !== confirmNewPasswordVal) {
      showAlert('danger', 'New password and confirmation password do not match.');
      return;
    }

    setSaving(true);
    try {
      const res = await axios.post(`${API_URL}/auth/change-password`, {
        currentPassword: currentPasswordVal,
        newPassword: newPasswordVal
      });
      if (res.data.success) {
        showAlert('green', 'Password changed successfully!');
        setCurrentPasswordVal('');
        setNewPasswordVal('');
        setConfirmNewPasswordVal('');
      } else {
        showAlert('danger', res.data.message || 'Failed to change password.');
      }
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWhatsappPromo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_URL}/admin/profile`, { whatsappPromoTemplate: whatsappPromo });
      showAlert('green', 'WhatsApp advertisement template saved successfully!');
      await refreshSession();
    } catch (err) {
      showAlert('danger', 'Failed to update WhatsApp advertisement config.');
    } finally {
      setSaving(false);
    }
  };

  // Content site updates helper
  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItemText.trim() && !additionalItems.includes(newItemText.trim())) {
      setAdditionalItems([...additionalItems, newItemText.trim()]);
      setNewItemText('');
    }
  };

  const handleRemoveItem = (item) => {
    setAdditionalItems(additionalItems.filter(i => i !== item));
  };

  const saveWebsiteConfig = async (updatedTheme, updatedPages, updatedRatings, updatedRemoveBranding) => {
    try {
      const res = await axios.put(`${API_URL}/tenant/site`, {
        theme: updatedTheme || themeConfig,
        pages: updatedPages || pagesConfig,
        ratings: updatedRatings || ratingsList,
        removeBranding: updatedRemoveBranding !== undefined ? updatedRemoveBranding : removeBrandingState
      });
      await refreshSession();
      return res.data.tenant;
    } catch (err) {
      console.error('Failed to sync website config:', err.message);
      throw err;
    }
  };

  const handleSaveWebsite = async () => {
    setSaving(true);
    try {
      await saveWebsiteConfig(themeConfig, pagesConfig, ratingsList, removeBrandingState);
      showAlert('green', 'Dynamic website configurations saved!');
    } catch (err) {
      showAlert('danger', 'Failed to save website configurations.');
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewTheme = () => {
    const layout = themeConfig.businessType || 'Kirana Store';
    const selectedTheme = businessThemesList.find(b => b.type === layout) || businessThemesList[0];
    openPreviewModal(selectedTheme);
  };

  const handleAddManualReview = () => {
    if (!newManualReview.name || !newManualReview.review) {
      showAlert('danger', 'Please enter a name and review text!');
      return;
    }
    const addedReview = {
      name: newManualReview.name,
      rating: newManualReview.rating,
      review: newManualReview.review,
      date: new Date()
    };
    setRatingsList(prev => [addedReview, ...prev]);
    setNewManualReview({ name: '', rating: 5, review: '' });
    showAlert('green', 'Testimonial added to local list! Click "Publish Website Changes" to save it live.');
  };

  const handleRemoveReview = (idx) => {
    setRatingsList(prev => prev.filter((_, i) => i !== idx));
    showAlert('green', 'Review marked for deletion. Click "Publish Website Changes" to apply live.');
  };

  // Subdomain modification request
  const handleUpdateSubdomain = async (e) => {
    e.preventDefault();
    if (!subdomainName) return;
    setSaving(true);
    try {
      const res = await axios.put(`${API_URL}/admin/subdomain`, { subdomain: subdomainName });
      showAlert('green', res.data.message);
      await refreshSession();
    } catch (err) {
      showAlert('danger', err.response?.data?.message || 'Failed to update subdomain name prefix.');
    } finally {
      setSaving(false);
    }
  };

  // SEO configuration updates
  const handleSaveSEO = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_URL}/tenant/site`, {
        pages: {
          ...pagesConfig,
          seo: {
            title: seoTitle,
            description: seoDescription
          }
        }
      });
      showAlert('green', 'SEO Meta details successfully published live!');
      await refreshSession();
    } catch (err) {
      showAlert('danger', 'Failed to update SEO configurations.');
    } finally {
      setSaving(false);
    }
  };

  // Banner slider CRUD
  const handleAddSlide = () => {
    if (!newSlide.title) return;
    setPagesConfig(prev => ({
      ...prev,
      home: {
        ...prev.home,
        bannerSlider: [...(prev.home?.bannerSlider || []), newSlide]
      }
    }));
    setNewSlide({ image: '', title: '', subtitle: '', price: 0, originalPrice: 0, buttonText: '', buttonLink: '' });
  };

  const handleRemoveSlide = (idx) => {
    setPagesConfig(prev => ({
      ...prev,
      home: {
        ...prev.home,
        bannerSlider: (prev.home?.bannerSlider || []).filter((_, i) => i !== idx)
      }
    }));
  };

  // Services CRUD
  const handleAddService = async () => {
    if (!newService.title) {
      showAlert('danger', 'Service Title is required!');
      return;
    }
    const updatedPages = {
      ...pagesConfig,
      services: [...(pagesConfig.services || []), newService]
    };
    setPagesConfig(updatedPages);
    setNewService({ title: '', description: '', image: '' });

    try {
      await saveWebsiteConfig(themeConfig, updatedPages, ratingsList);
      showAlert('green', 'Service added and published live successfully!');
    } catch (err) {
      showAlert('danger', 'Failed to publish new service live.');
    }
  };

  const handleRemoveService = async (idx) => {
    const updatedPages = {
      ...pagesConfig,
      services: (pagesConfig.services || []).filter((_, i) => i !== idx)
    };
    setPagesConfig(updatedPages);

    try {
      await saveWebsiteConfig(themeConfig, updatedPages, ratingsList);
      showAlert('green', 'Service removed and updated live!');
    } catch (err) {
      showAlert('danger', 'Failed to update services removal live.');
    }
  };

  // Products CRUD
  const handleAddProduct = async () => {
    if (!newProduct.title) {
      showAlert('danger', 'Product Title is required!');
      return;
    }
    const updatedPages = {
      ...pagesConfig,
      products: [...(pagesConfig.products || []), newProduct]
    };
    setPagesConfig(updatedPages);
    setNewProduct({ title: '', description: '', price: 0, category: '', image: '' });

    try {
      await saveWebsiteConfig(themeConfig, updatedPages, ratingsList);
      showAlert('green', 'Product added and published live successfully!');
    } catch (err) {
      showAlert('danger', 'Failed to publish new product live.');
    }
  };

  const handleRemoveProduct = async (idx) => {
    const updatedPages = {
      ...pagesConfig,
      products: (pagesConfig.products || []).filter((_, i) => i !== idx)
    };
    setPagesConfig(updatedPages);

    try {
      await saveWebsiteConfig(themeConfig, updatedPages, ratingsList);
      showAlert('green', 'Product removed and updated live!');
    } catch (err) {
      showAlert('danger', 'Failed to update products removal live.');
    }
  };

  // Gallery CRUD
  const handleAddGalleryUrl = async () => {
    if (!newGalleryUrl) return;
    const updatedPages = {
      ...pagesConfig,
      gallery: [...(pagesConfig.gallery || []), { url: newGalleryUrl, type: newGalleryType || 'image' }]
    };
    setPagesConfig(updatedPages);
    setNewGalleryUrl('');

    try {
      await saveWebsiteConfig(themeConfig, updatedPages, ratingsList);
      showAlert('green', 'Media item added and published live!');
    } catch (err) {
      showAlert('danger', 'Failed to publish new media item live.');
    }
  };

  const handleRemoveGalleryItem = async (idx) => {
    const updatedPages = {
      ...pagesConfig,
      gallery: (pagesConfig.gallery || []).filter((_, i) => i !== idx)
    };
    setPagesConfig(updatedPages);

    try {
      await saveWebsiteConfig(themeConfig, updatedPages, ratingsList);
      showAlert('green', 'Media item removed and updated live!');
    } catch (err) {
      showAlert('danger', 'Failed to update media removal live.');
    }
  };

  // Toggle Visibility flag inside pagesConfig
  const handleToggleVisibility = (section) => {
    const defaultVisibility = pagesConfig.home?.visibility || {
      banner: true,
      welcome: true,
      services: true,
      products: true,
      gallery: true,
      contact: true,
      map: true,
      reviews: true
    };

    setPagesConfig(prev => ({
      ...prev,
      home: {
        ...prev.home,
        visibility: {
          ...defaultVisibility,
          [section]: !defaultVisibility[section]
        }
      }
    }));
  };

  if (authLoading || !user) {
    return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading Merchant Admin Workspace...</div>;
  }

  // Calculate average customer review score
  const totalReviews = tenant?.ratings?.length || 0;
  const avgRating = totalReviews > 0
    ? (tenant.ratings.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

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

  const getDynamicLabels = () => {
    const type = themeConfig.businessType;
    switch (type) {
      case 'Hotel':               return { services: 'Amenities & Facilities 🏨', products: 'Luxury Suites & Rooms 🛌️' };
      case 'Tour & Travel':       return { services: 'Travel Services ✈️', products: 'Tour Packages 🌍' };
      case 'Mandir & Spiritual':  return { services: 'Darshan & Aarti Timings 🛕', products: 'Puja Sankalpa Bookings 🙏' };
      case 'Software Company':    return { services: 'Consultation Offerings 💻', products: 'SaaS Product Inventory 🚀' };
      case 'Kalin & Textile':     return { services: 'Custom Crafting Services 🧶', products: 'Premium Rugs & Textiles 🧵' };
      case 'Electronics':         return { services: 'Technical Support Packages 🔌', products: 'Device Catalog Inventory ⚡' };
      case 'Real Estate & Plots': return { services: 'Property Consultation 🏗️', products: 'Plots & Properties 🏠' };
      case 'Building Materials':  return { services: 'Delivery & Bulk Supply 🚛', products: 'Material Catalog 🧱' };
      case 'Roofing & Centering': return { services: 'Installation Services 🔧', products: 'Sheets & Centering Rentals 🔩' };
      case 'Medical & Pharmacy':  return { services: 'Medical Consultation 💊', products: 'Medicines & Health Products 🩺' };
      case 'Hospital & Clinic':   return { services: 'OPD & Specialties 🏥', products: 'Health Packages & Tests 🧪' };
      case 'Diet & Nutrition':    return { services: 'Diet Plans & Counseling 🥗', products: 'Supplements & Wellness 🌿' };
      case 'Blood Bank & Pathology': return { services: 'Home Collection & Reports 🩸', products: 'Lab Test Packages 🔬' };
      case 'Restaurant & Dhaba':  return { services: 'Catering & Events 🍽️', products: 'Menu & Dishes 🍛' };
      case 'Kirana & Grocery':    return { services: 'Home Delivery 🛒', products: 'Store Inventory 📦' };
      case 'Beauty Salon':        return { services: 'Salon Treatments 💄', products: 'Beauty Products & Kits 🧴' };
      case 'Gym & Fitness':       return { services: 'Training Programs 💪', products: 'Membership Plans & Supplements 🏋️' };
      case 'Automobile & Garage': return { services: 'Repair & Servicing 🔧', products: 'Parts & Accessories 🚗' };
      case 'Fashion Boutique':    return { services: 'Tailoring & Alterations 🪡', products: 'Fashion Collection 👗' };
      case 'Corporate & General': return { services: 'Business Services 🏢', products: 'Products & Solutions 📦' };
      default:                    return { services: 'Store Services 🛠️', products: 'Store Products Inventory 🛍️' };
    }
  };

  const dynamicLabels = getDynamicLabels();

  // 9 Page-Oriented Consolidated Tabs definition
  const sidebarTabs = [
    { id: 'dashboard', label: 'Dashboard & Branding', icon: <LayoutGrid size={16} /> },
    { id: 'theme', label: 'Theme Selection Engine', icon: <Palette size={16} /> },
    { id: 'home', label: 'Home Page Editor', icon: <Layout size={16} /> },
    { id: 'about', label: 'About Us Page Editor', icon: <Compass size={16} /> },
    { id: 'services', label: dynamicLabels.services, icon: <ListCollapse size={16} /> },
    ...(themeConfig.businessType !== 'Hotel' ? [{ id: 'products', label: dynamicLabels.products, icon: <Layers size={16} /> }] : []),
    { id: 'gallery', label: 'Unified Media Gallery', icon: <Sparkles size={16} /> },
    { id: 'custom_form', label: 'Custom Form Builder', icon: <Sliders size={16} /> },
    { id: 'reviews_mod', label: 'Review Moderation', icon: <Star size={16} /> },
    { id: 'whatsapp_campaigns', label: 'WhatsApp Advertisements', icon: <MessageSquare size={16} /> },
    { id: 'contact', label: 'Contact, Address & Map', icon: <Phone size={16} /> },
    { id: 'change_password', label: 'Change Password', icon: <Lock size={16} /> },
    { id: 'all_shops', label: 'All Shops Directory', icon: <Building2 size={16} /> },
    { id: 'inbox', label: `Enquiries Inbox (${messages.length})`, icon: <Mail size={16} /> }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '40px 0' }}>
        <div className="dashboard-container">

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
              justifyContent: 'center'
            }}>
              {alert.type === 'green' ? '✅' : '⚠️'} {alert.message}
            </div>
          )}

          {/* Superadmin Broadcast Notifications */}
          {user?.notifications && user.notifications.filter(n => !n.isRead).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {user.notifications.filter(n => !n.isRead).map((notif) => (
                <div key={notif._id} className="glass-panel animate-fade-in" style={{
                  padding: '14px 20px',
                  borderRadius: '8px',
                  borderLeft: '4px solid var(--accent-purple)',
                  background: 'rgba(139, 92, 246, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔔</span>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{notif.message}</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(notif.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await axios.patch(`${API_URL}/admin/notifications/${notif._id}/read`);
                        refreshSession();
                      } catch (err) {
                        console.error('Failed to dismiss notification:', err);
                      }
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Panel Welcome Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge" style={{ marginBottom: '6px' }}>{user.category} Workspace Portal</span>
              <h1 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 style={{ color: 'var(--accent-purple)' }} />
                {companyName || 'Merchant Controls'}
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Your subdomain site is live at:{' '}
                <a
                  href={getSubdomainUrl(user.subdomain)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-blue)', fontWeight: 'bold', textDecoration: 'none' }}
                >
                  {user.subdomain}.localhost:5173 ↗
                </a>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={getSubdomainUrl(user.subdomain)}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', textDecoration: 'none' }}
              >
                <Compass size={18} />
                Visit Live Site
              </a>

              <button
                onClick={handleSaveWebsite}
                disabled={saving}
                className="glass-button"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px' }}
              >
                <Globe size={18} />
                {saving ? 'Publishing Updates...' : 'Publish Website Changes'}
              </button>
            </div>
          </div>

          <div className="grid-cols-12" style={{ alignItems: 'flex-start' }}>
            
            {/* 16 Sidebar Tabs Menu Column */}
            <div className="col-span-3">
              {/* Desktop view sidebar menu */}
              <div className="admin-desktop-sidebar glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'sticky', top: '100px', padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '8px' }}>
                  Configuration Menu
                </div>
                {sidebarTabs.map((tb) => {
                  const isActive = activeTab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => setActiveTab(tb.id)}
                      className={`glass-button secondary ${isActive ? 'active' : ''}`}
                      style={{
                        justifyContent: 'flex-start',
                        padding: '10px 14px',
                        fontSize: '0.85rem',
                        borderLeft: isActive ? '3px solid var(--accent-purple)' : '1px solid transparent',
                        background: isActive ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.01)',
                        color: isActive ? 'white' : 'var(--text-secondary)',
                        transition: 'all 0.2s ease'
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
                  📂 Select Dashboard Section:
                </label>
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
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

            <div className="col-span-9">
              
              {/* 1. Dashboard & Stats & Branding Tab */}
              {activeTab === 'dashboard' && (
                <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <LayoutGrid size={22} style={{ color: 'var(--accent-purple)' }} />
                      Dashboard & Store Identity
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Manage your workspace analytics, branding profile, search metadata (SEO), and subdomain configs in a single place.
                    </p>
                  </div>

                  {/* Stat Card Decks */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    
                    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '3px solid #fbbf24' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}>
                        <Star size={20} fill="#fbbf24" />
                        <span style={{ fontSize: '0.75rem', background: 'rgba(251,191,36,0.1)', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>FEEDBACK</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Customer Rating</span>
                      <strong style={{ fontSize: '1.8rem' }}>{avgRating} / 5.0 Stars</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Based on {totalReviews} visitor reviews</span>
                    </div>

                    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-purple)' }}>
                        <Mail size={20} />
                        <span style={{ fontSize: '0.75rem', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>MESSAGES</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer Enquiries Inbox</span>
                      <strong style={{ fontSize: '1.8rem' }}>{messages.length} Submissions</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending response actions</span>
                    </div>

                    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '3px solid var(--accent-blue)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-blue)' }}>
                        <Palette size={20} />
                        <span style={{ fontSize: '0.75rem', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>SKINS</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Theme Settings</span>
                      <strong style={{ fontSize: '1.3rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '6px' }}>{themeConfig.businessType}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Season: {themeConfig.seasonType}</span>
                    </div>

                  </div>

                  {/* Performance Analytics & Charts */}
                  {(() => {
                    const totalSentCount = campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);
                    const totalClicksCount = campaigns.reduce((acc, c) => acc + (c.clicksCount || 0), 0);
                    const ctrRatio = totalSentCount > 0 ? ((totalClicksCount / totalSentCount) * 100).toFixed(1) : '0.0';

                    // Enquiry statistics
                    const totalEnquiries = messages.length;
                    const repliedEnquiries = messages.filter(m => m.status === 'replied').length;
                    const pendingEnquiries = messages.filter(m => m.status === 'pending').length;
                    const resolutionRate = totalEnquiries > 0 ? Math.round((repliedEnquiries / totalEnquiries) * 100) : 0;

                    // Last 7 days chart stats
                    const last7DaysStats = [];
                    for (let i = 6; i >= 0; i--) {
                      const d = new Date();
                      d.setDate(d.getDate() - i);
                      const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
                      const dateKey = d.toDateString();
                      const dayMsgs = messages.filter(m => m.createdAt && new Date(m.createdAt).toDateString() === dateKey);
                      const replied = dayMsgs.filter(m => m.status === 'replied').length;
                      const pending = dayMsgs.filter(m => m.status === 'pending').length;
                      last7DaysStats.push({ label, total: dayMsgs.length, replied, pending });
                    }
                    const maxEnquiriesInDay = Math.max(...last7DaysStats.map(s => s.total), 4);

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Summary Metrics Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                          <div className="glass-panel" style={{ padding: '16px', borderLeft: '3px solid var(--accent-purple)' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>WhatsApp campaigns CTR</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                              <strong style={{ fontSize: '1.5rem', color: 'white' }}>{ctrRatio}%</strong>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{totalClicksCount} clicks</span>
                            </div>
                          </div>
                          <div className="glass-panel" style={{ padding: '16px', borderLeft: '3px solid #10b981' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Enquiries</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                              <strong style={{ fontSize: '1.5rem', color: 'white' }}>{totalEnquiries}</strong>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{repliedEnquiries} replied</span>
                            </div>
                          </div>
                          <div className="glass-panel" style={{ padding: '16px', borderLeft: '3px solid #f59e0b' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending Enquiries</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                              <strong style={{ fontSize: '1.5rem', color: '#f59e0b' }}>{pendingEnquiries}</strong>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Action required</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Graphs Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                          
                          {/* 7-Day Volume Chart */}
                          <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <strong style={{ fontSize: '0.95rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              📊 Last 7 Days Enquiry Volume
                            </strong>
                            <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                              <svg viewBox="0 0 500 220" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                <defs>
                                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                                  </linearGradient>
                                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                                  </linearGradient>
                                </defs>
                                
                                {/* Y Axis Guide Lines */}
                                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                                  const y = 170 - ratio * 130;
                                  const val = Math.round(ratio * maxEnquiriesInDay);
                                  return (
                                    <g key={index}>
                                      <line x1="40" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                                      <text x="30" y={y + 4} fill="var(--text-muted)" fontSize="9" textAnchor="end">{val}</text>
                                    </g>
                                  );
                                })}

                                {/* Bars */}
                                {last7DaysStats.map((day, i) => {
                                  const x = 50 + i * 61;
                                  const barWidth = 32;
                                  const h = (day.total / maxEnquiriesInDay) * 130;
                                  const hReplied = (day.replied / maxEnquiriesInDay) * 130;
                                  const hPending = h - hReplied;

                                  const isHovered = hoveredBar === i;

                                  return (
                                    <g key={i}>
                                      {/* Total/Replied bar */}
                                      {day.replied > 0 && (
                                        <rect
                                          x={x}
                                          y={170 - hReplied}
                                          width={barWidth}
                                          height={hReplied}
                                          fill="url(#greenGrad)"
                                          rx="3"
                                          style={{ transition: 'all 0.2s ease', opacity: hoveredBar === null || isHovered ? 1 : 0.6 }}
                                        />
                                      )}
                                      
                                      {/* Pending bar (stacked above replied) */}
                                      {day.pending > 0 && (
                                        <rect
                                          x={x}
                                          y={170 - h}
                                          width={barWidth}
                                          height={hPending}
                                          fill="url(#purpleGrad)"
                                          rx="3"
                                          style={{ transition: 'all 0.2s ease', opacity: hoveredBar === null || isHovered ? 1 : 0.6 }}
                                        />
                                      )}

                                      {/* Zero-state indicator */}
                                      {day.total === 0 && (
                                        <circle cx={x + barWidth / 2} cy="170" r="2" fill="rgba(255,255,255,0.2)" />
                                      )}

                                      {/* X Axis Labels */}
                                      <text x={x + barWidth / 2} y="190" fill="var(--text-muted)" fontSize="9" textAnchor="middle">
                                        {day.label.split(' ')[0]}
                                      </text>
                                      <text x={x + barWidth / 2} y="202" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">
                                        {day.label.split(' ')[1]}
                                      </text>

                                      {/* Invisible Hover Zone */}
                                      <rect
                                        x={x - 10}
                                        y="20"
                                        width={barWidth + 20}
                                        height="160"
                                        fill="transparent"
                                        onMouseEnter={() => setHoveredBar(i)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                        style={{ cursor: 'pointer' }}
                                      />
                                    </g>
                                  );
                                })}

                                {/* Interactive Tooltip Overlay */}
                                {hoveredBar !== null && (
                                  <g>
                                    <rect
                                      x={Math.min(340, Math.max(40, 50 + hoveredBar * 61 - 44))}
                                      y={Math.max(10, 170 - (last7DaysStats[hoveredBar].total / maxEnquiriesInDay) * 130 - 55)}
                                      width="120"
                                      height="48"
                                      rx="6"
                                      fill="rgba(17, 12, 28, 0.95)"
                                      stroke="rgba(139, 92, 246, 0.6)"
                                      strokeWidth="1.5"
                                    />
                                    <text
                                      x={Math.min(340, Math.max(40, 50 + hoveredBar * 61 - 44)) + 60}
                                      y={Math.max(10, 170 - (last7DaysStats[hoveredBar].total / maxEnquiriesInDay) * 130 - 55) + 16}
                                      fill="white"
                                      fontSize="10"
                                      fontWeight="bold"
                                      textAnchor="middle"
                                    >
                                      {last7DaysStats[hoveredBar].label}
                                    </text>
                                    <text
                                      x={Math.min(340, Math.max(40, 50 + hoveredBar * 61 - 44)) + 60}
                                      y={Math.max(10, 170 - (last7DaysStats[hoveredBar].total / maxEnquiriesInDay) * 130 - 55) + 32}
                                      fill="#10b981"
                                      fontSize="9"
                                      textAnchor="middle"
                                    >
                                      Replied: {last7DaysStats[hoveredBar].replied} | Pending: {last7DaysStats[hoveredBar].pending}
                                    </text>
                                  </g>
                                )}
                              </svg>
                            </div>
                          </div>

                          {/* Resolution & Status Chart */}
                          <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <strong style={{ fontSize: '0.95rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                🎯 Resolution Rate
                              </strong>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '160px' }}>
                                The percentage of enquiries answered using custom replies. Keep it high!
                              </p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                                <span style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                                  Replied: <strong>{repliedEnquiries}</strong>
                                </span>
                                <span style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}></span>
                                  Pending: <strong>{pendingEnquiries}</strong>
                                </span>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="130" height="130" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="9" />
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="45"
                                  fill="none"
                                  stroke="url(#radialGreen)"
                                  strokeWidth="9"
                                  strokeDasharray="282.7"
                                  strokeDashoffset={282.7 - (282.7 * resolutionRate) / 100}
                                  strokeLinecap="round"
                                  transform="rotate(-90 60 60)"
                                  style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                                />
                                <defs>
                                  <linearGradient id="radialGreen" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#34d399" />
                                  </linearGradient>
                                </defs>
                                <text x="60" y="56" fill="white" fontSize="18" fontWeight="bold" textAnchor="middle">{resolutionRate}%</text>
                                <text x="60" y="76" fill="var(--text-secondary)" fontSize="8" fontWeight="bold" textAnchor="middle">RESOLVED</text>
                              </svg>
                            </div>

                          </div>

                        </div>
                      </div>
                    );
                  })()}

                  <hr style={{ borderColor: 'var(--border-color)', opacity: 0.15 }} />

                  {/* branding uploader details grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    
                    {/* Brand assets panel card uploader */}
                    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: '1 / -1' }}>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={18} /> Store Branding & Shop Details
                      </strong>
                      <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        
                        {/* Column 1: Core Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Company / Shop Name *</span>
                            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="glass-input" required />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mobile Phone</span>
                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="glass-input" />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>WhatsApp Number</span>
                            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="glass-input" />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Remarks / Status</span>
                            <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="glass-input" placeholder="e.g. Open Mon-Sat 9AM-8PM" />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Update Password (Optional)</span>
                            <input type="password" placeholder="Min 6 characters..." value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input" />
                          </div>
                        </div>

                        {/* Column 2: Address & Location */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Street / Full Address</span>
                              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="glass-input" />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Landmark</span>
                              <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} className="glass-input" />
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>City</span>
                              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="glass-input" />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>State</span>
                              <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="glass-input" />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pin Code</span>
                              <input type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value)} className="glass-input" />
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Google Maps Location URL</span>
                            <input type="text" value={mapLocation} onChange={(e) => setMapLocation(e.target.value)} className="glass-input" placeholder="Paste Google Maps URL here" />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Website Link</span>
                            <input type="text" value={socialLinks.website} onChange={(e) => setSocialLinks({...socialLinks, website: e.target.value})} className="glass-input" placeholder="https://..." />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>YouTube Channel</span>
                            <input type="text" value={socialLinks.youtube} onChange={(e) => setSocialLinks({...socialLinks, youtube: e.target.value})} className="glass-input" placeholder="https://youtube.com/..." />
                          </div>
                        </div>

                        {/* Column 3: Assets & Additional Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Store Logo Image</span>
                              <input type="file" accept="image/*" onChange={(e) => handleBase64Upload(e, setLogo)} style={{ fontSize: '0.8rem' }} />
                              {logo && <img src={logo} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--accent-purple)' }} />}
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Hero Banner Image</span>
                              <input type="file" accept="image/*" onChange={(e) => handleBase64Upload(e, setBanner)} style={{ fontSize: '0.8rem' }} />
                              {banner && <img src={banner} alt="Banner" style={{ width: '100%', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Additional Items You Sell</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input type="text" value={newItemText} onChange={(e) => setNewItemText(e.target.value)} className="glass-input" placeholder="e.g. Cold Drinks, Subji..." />
                              <button onClick={handleAddItem} className="glass-button secondary" style={{ padding: '0 12px' }}>Add</button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                              {additionalItems.map((item, idx) => (
                                <span key={idx} style={{ background: 'rgba(139,92,246,0.2)', padding: '4px 10px', borderRadius: '14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {item}
                                  <button onClick={(e) => { e.preventDefault(); handleRemoveItem(item); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}>&times;</button>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                          <button type="submit" className="glass-button" style={{ padding: '12px 24px', width: '100%' }}>Publish Profile & Shop Details</button>
                        </div>
                      </form>

                      {/* Shop Card Preview inside Dashboard */}
                      <div style={{ marginTop: '20px', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <strong style={{ fontSize: '1rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '16px' }}>Shop Card Preview</strong>
                        
                        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', maxWidth: '400px', margin: '0 auto', border: '1px solid var(--accent-purple)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                          {banner ? (
                            <img src={banner} alt="banner" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '120px', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))' }}></div>
                          )}
                          
                          <div style={{ padding: '16px', position: 'relative' }}>
                            {logo && (
                              <img src={logo} alt="logo" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #111', position: 'absolute', top: '-32px', left: '16px' }} />
                            )}
                            <div style={{ marginTop: logo ? '24px' : '0' }}>
                              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {companyName || 'Shop Name'}
                                <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                              </h3>
                              <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {user?.category || 'Category'}
                              </p>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                                {street && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {street}, {city}</span>}
                                {phone && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {phone}</span>}
                                {mapLocation && <a href={mapLocation} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}><Map size={14} /> View on Map</a>}
                              </div>

                              {additionalItems.length > 0 && (
                                <div style={{ marginTop: '12px' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Also Sells:</span>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                                    {additionalItems.map((item, idx) => (
                                      <span key={idx} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>{item}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subdomain and SEO Configurations */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', gridColumn: '1 / -1', alignItems: 'start' }}>
                      
                      {/* Subdomain setup card */}
                      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Globe size={18} /> URL Domain Setup
                        </strong>
                        <form onSubmit={handleUpdateSubdomain} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <input type="text" placeholder="e.g. kiranastore" value={subdomainName} onChange={(e) => setSubdomainName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="glass-input" required />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live URL: <strong>{getSubdomainUrl(subdomainName || 'kiranstore')}</strong></span>
                          <button type="submit" className="glass-button secondary" style={{ padding: '8px' }}>Save Subdomain URL</button>
                        </form>
                      </div>

                      {/* Subscription Plan details */}
                      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Award size={18} /> SaaS Subscription Billing
                        </strong>
                        <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div>Current Plan: <span className="badge" style={{ textTransform: 'capitalize' }}>{user.planType || 'free'}</span></div>
                          <div style={{ color: 'var(--text-secondary)' }}>
                            Expiry: {user.planExpiry ? new Date(user.planExpiry).toLocaleDateString() : 'Never (Free Trial)'}
                          </div>
                        </div>
                        {user.planType !== 'professional' && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
                            💡 Upgrade to **Professional Plan** to unlock Custom Domain CNAME mapping and white-label branding removal!
                          </div>
                        )}
                      </div>

                      {/* Custom Domain Request Card (Professional Plan only) */}
                      {user.planType === 'professional' && (
                        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <strong style={{ fontSize: '1.05rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Globe size={18} /> Mapped Custom Domain
                          </strong>
                          {user.partialBlockSettings?.blockDomainMapping ? (
                            <p style={{ fontSize: '0.85rem', color: '#ef4444', margin: 0 }}>
                              ⚠️ Domain mapping features are temporarily suspended for your account by the administrator.
                            </p>
                          ) : user.customDomain ? (
                            <div style={{ fontSize: '0.9rem' }}>
                              <p style={{ margin: 0 }}>Active mapped domain:</p>
                              <a href={`http://${user.customDomain}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', fontWeight: 'bold', textDecoration: 'none' }}>
                                {user.customDomain} ↗
                              </a>
                            </div>
                          ) : domainRequest ? (
                            <div style={{ fontSize: '0.9rem' }}>
                              <p style={{ margin: '0 0 6px 0' }}>Request status for <strong>{domainRequest.requestedDomain}</strong>:</p>
                              <span className={`badge ${domainRequest.status === 'approved' ? 'green' : domainRequest.status === 'rejected' ? 'red' : 'purple'}`}>
                                {domainRequest.status.toUpperCase()}
                              </span>
                              {domainRequest.status === 'pending' && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
                                  Point your domain CNAME record to this server IP address and wait for Superadmin approval.
                                </p>
                              )}
                            </div>
                          ) : (
                            <form onSubmit={handleRequestDomainSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Link your own custom domain name:</span>
                              <input
                                type="text"
                                placeholder="e.g. www.mybusiness.com"
                                value={newRequestedDomain}
                                onChange={(e) => setNewRequestedDomain(e.target.value)}
                                className="glass-input"
                                required
                              />
                              <button type="submit" disabled={loadingDomainReq} className="glass-button secondary" style={{ padding: '8px' }}>
                                {loadingDomainReq ? 'Submitting...' : 'Request Domain Link'}
                              </button>
                            </form>
                          )}
                        </div>
                      )}
                      
                      {/* White-Labeling remove branding toggle (Professional/Basic) */}
                      {['basic', 'professional'].includes(user.planType) && (
                        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <strong style={{ fontSize: '1.05rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Settings size={18} /> White-Label Settings
                          </strong>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input
                              type="checkbox"
                              checked={removeBrandingState}
                              onChange={(e) => {
                                setRemoveBrandingState(e.target.checked);
                                showAlert('green', 'Branding toggle adjusted! Click "Publish Website Changes" to save it live.');
                              }}
                            />
                            Remove "Powered by WebsiteMaker" footer branding
                          </label>
                        </div>
                      )}

                      {/* SEO meta config card */}
                      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Settings size={18} /> SEO Metadata Configs
                        </strong>
                        <form onSubmit={handleSaveSEO} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <input type="text" placeholder="SEO Page Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="glass-input" required />
                          <textarea placeholder="SEO Meta Description Summary..." value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="glass-input" rows={2} required />
                          <button type="submit" className="glass-button secondary" style={{ padding: '8px' }}>Publish SEO Details</button>
                        </form>
                      </div>

                      {/* WhatsApp Marketing & Ad Campaign Template */}
                      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i> WhatsApp Advertisement
                        </strong>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                          Configure a template broadcast message to copy and share for WhatsApp campaigns or direct advertising links.
                        </p>
                        <form onSubmit={handleSaveWhatsappPromo} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <textarea
                            placeholder="Write your custom promotional template..."
                            value={whatsappPromo}
                            onChange={(e) => setWhatsappPromo(e.target.value)}
                            className="glass-input"
                            rows={3}
                            required
                          />
                          <button type="submit" className="glass-button secondary" style={{ padding: '8px', borderColor: '#16a34a', color: '#16a34a' }}>
                            Save Advertisement Template
                          </button>
                        </form>
                        {user.whatsapp && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Actions:</span>
                            <a
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${whatsappPromo}\n\nVisit our site: http://${user.subdomain}.localhost:5173`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="glass-button"
                              style={{ padding: '6px', fontSize: '0.75rem', textAlign: 'center', background: 'rgba(22,163,74,0.1)', border: 'none', color: '#16a34a' }}
                            >
                              🚀 Broadcast Template Link
                            </a>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* 2. Multi-Theme Selector Tab */}
              {activeTab === 'theme' && (
                <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Palette size={22} style={{ color: 'var(--accent-blue)' }} />
                      Card-Wise Multi-Theme Select Engine
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Choose your business layout, seasonal aesthetic overlay, and color palettes theme dynamically.
                    </p>
                  </div>

                  {/* 10 Business Themes Visual selector cards grid */}
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--accent-purple)', display: 'block', marginBottom: '14px' }}>
                      1. Business Layout Theme (Select Card Wise)
                    </strong>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                       {businessThemesList.map((item) => {
                        const isSelected = themeConfig.businessType === item.type;
                        return (
                          <div
                            key={item.type}
                            onClick={() => {
                              openPreviewModal(item);
                            }}
                            style={{
                              padding: '16px',
                              borderRadius: '12px',
                              border: isSelected ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
                              background: isSelected ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                              boxShadow: isSelected ? '0 0 15px rgba(139, 92, 246, 0.35)' : 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              position: 'relative',
                              transition: 'all 0.2s ease',
                              transform: isSelected ? 'scale(1.02)' : 'none'
                            }}
                          >
                            {isSelected && (
                              <span style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '0.75rem', background: 'var(--accent-purple)', color: 'white', padding: '2px 8px', borderRadius: '999px', fontWeight: 'bold' }}>
                                ACTIVE
                              </span>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '1.8rem' }}>{item.emoji}</span>
                              <strong style={{ fontSize: '1rem', color: 'white' }}>{item.type}</strong>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>{item.description}</p>
                            
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPreviewModal(item);
                              }}
                              className="glass-button secondary"
                              style={{
                                padding: '6px 10px',
                                fontSize: '0.75rem',
                                marginTop: 'auto',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: '#a78bfa',
                                borderColor: 'rgba(139, 92, 246, 0.3)'
                              }}
                            >
                              👁️ Preview & Launch
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Seasonal and Color Selectors */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--accent-purple)' }}>2. Seasonal Event Overlay skin</strong>
                      <select
                        value={themeConfig.seasonType}
                        onChange={(e) => setThemeConfig(prev => ({ ...prev, seasonType: e.target.value }))}
                        className="glass-input"
                      >
                        <option value="Default">Default Standard Layout</option>
                        <option value="Diwali">Diwali (Lamps decorations, floating sparkles)</option>
                        <option value="Holi">Holi (Colors pigment Splashes and gradients)</option>
                        <option value="Shivratri">Shivratri (Deep saffron/blue theme vibe)</option>
                        <option value="Navratri">Navratri (Bright orange festive aesthetics)</option>
                        <option value="Independence Day">Independence Day (Tri-color banner decoration)</option>
                        <option value="Wedding Season">Wedding Season (Crimson red & gold accents)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--accent-purple)' }}>3. Accent Color Palette</strong>
                      <select
                        value={themeConfig.colorTheme}
                        onChange={(e) => setThemeConfig(prev => ({ ...prev, colorTheme: e.target.value }))}
                        className="glass-input"
                      >
                        <optgroup label="🟦 Blues">
                          <option value="Blue">🟦 Electric Royal Blue (#2563eb)</option>
                          <option value="Sky">🌊 Sky Blue (#0ea5e9)</option>
                          <option value="NavyBlue">🟦 Deep Navy Blue (#1e3a8a)</option>
                          <option value="Teal">🛡️ Ocean Teal (#0d9488)</option>
                          <option value="Indigo">💙 Corporate Indigo (#4338ca)</option>
                        </optgroup>
                        <optgroup label="🟩 Greens">
                          <option value="Green">🟩 Forest Mint Green (#16a34a)</option>
                          <option value="Emerald">💚 Emerald Wellness (#059669)</option>
                        </optgroup>
                        <optgroup label="🟥 Reds & Pinks">
                          <option value="Red">🟥 Spicy Crimson Red (#dc2626)</option>
                          <option value="Rose">🌸 Rose Pink Glamour (#f43f5e)</option>
                          <option value="Crimson">🩸 Crimson Lab Red (#be123c)</option>
                        </optgroup>
                        <optgroup label="🟣 Purples">
                          <option value="Purple">🟣 Neon Velvet Purple (#a855f7)</option>
                        </optgroup>
                        <optgroup label="🟠 Warm">
                          <option value="Orange">🟠 Amber Saffron Orange (#f97316)</option>
                          <option value="Golden">📄 Golden Champagne (#d4af37)</option>
                        </optgroup>
                        <optgroup label="⚫ Dark">
                          <option value="Dark Mode">⚫ Obsidian Dark Mode</option>
                        </optgroup>
                      </select>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Accent color auto-matches your selected business theme default. You can override it above.</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--accent-purple)' }}>4. Brand Typography Font Style</strong>
                      <select
                        value={themeConfig.fontStyle || 'Modern'}
                        onChange={(e) => setThemeConfig(prev => ({ ...prev, fontStyle: e.target.value }))}
                        className="glass-input"
                      >
                        <option value="Modern">Modern Tech Look (Inter)</option>
                        <option value="Geometric">Geometric Clean (Outfit)</option>
                        <option value="Elegant">Elegant Cursive Boutique (Playfair Display)</option>
                        <option value="Bold">Professional Bold Branding (Montserrat)</option>
                        <option value="Futuristic">Futuristic Tech Coding (Space Grotesk)</option>
                        <option value="Luxury">Royal Classic Luxury (Cinzel)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--accent-purple)' }}>5. Contrast Mode Theme Setting</strong>
                      <select
                        value={themeConfig.themeMode || 'Dark'}
                        onChange={(e) => setThemeConfig(prev => ({ ...prev, themeMode: e.target.value }))}
                        className="glass-input"
                      >
                        <option value="Dark">🌙 Obsidian Dark Mode</option>
                        <option value="White">☀️ Crisp Light White Mode</option>
                        <option value="Warm">🕯️ Warm Earthy Sepia Mode</option>
                        <option value="Bright">⚡ Bright Vibrant Gradient</option>
                      </select>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        🌙 Dark = Deep obsidian black • ☀️ White = Clean bright white • 🕯️ Warm = Cozy sepia ochre tones • ⚡ Bright = Vivid colorful gradient
                      </span>
                    </div>

                  </div>

                  {/* Sandbox Preview & Publish Live Launch controls */}
                  <div className="glass-panel" style={{
                    border: '1px solid var(--accent-purple)',
                    background: 'rgba(139, 92, 246, 0.05)',
                    padding: '20px',
                    marginTop: '24px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <strong style={{ fontSize: '1.05rem', color: 'white', display: 'block' }}>🎨 Custom Theme Configuration Pending</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Layout: <strong>{themeConfig.businessType}</strong> | Accent: <strong>{themeConfig.colorTheme}</strong> | Mode: <strong>{themeConfig.themeMode || 'Dark'}</strong>
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={handlePreviewTheme} className="glass-button secondary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Eye size={16} /> Live Preview Storefront
                        </button>
                        <button onClick={handleSaveWebsite} className="glass-button" style={{ padding: '10px 20px', background: 'var(--primary-gradient)', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Award size={16} /> Save & Launch Theme Live
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Home Page Texts, Carousels, Visibilities & Testimonials Editor */}
              {activeTab === 'home' && (
                <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layout size={22} style={{ color: 'var(--accent-purple)' }} />
                    Home Page Editor Suite
                  </h2>

                  {/* A. Dynamic Storefront Section Visibilities Controller */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '14px', color: 'var(--accent-purple)' }}>
                      ⚙️ Dynamic Storefront Page Sections Visibilities
                    </strong>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                      {[
                        { key: 'banner', label: '🏪 Hero Header Slider', icon: '🖼️' },
                        { key: 'welcome', label: '📝 Welcome Slogan & Welcome Text', icon: '📖' },
                        { key: 'services', label: `🛠️ ${dynamicLabels.services}`, icon: '💼' },
                        { key: 'products', label: `🛍️ ${dynamicLabels.products}`, icon: '🛒' },
                        { key: 'gallery', label: '🖼️ Photo/Video Gallery', icon: '🎨' },
                        { key: 'contact', label: '✉️ Inquiries Contact forms', icon: '💬' },
                        { key: 'map', label: '🗺️ Google Embed Map location', icon: '📍' },
                        { key: 'reviews', label: '⭐ Testimonials Reviews', icon: '🌟' }
                      ].map((sec) => {
                        const val = pagesConfig.home?.visibility?.[sec.key];
                        let mode = 'visible';
                        if (val === false || val === 'hidden') mode = 'hidden';
                        else if (val === 'translucent-25' || val === 'translucent-50' || val === 'translucent-75') mode = val;

                        return (
                          <div key={sec.key} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{sec.icon} {sec.label}</span>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px', background: 'rgba(0,0,0,0.2)', padding: '2px', borderRadius: '6px' }}>
                              <button
                                type="button"
                                onClick={() => setPagesConfig(prev => ({
                                  ...prev,
                                  home: {
                                    ...prev.home,
                                    visibility: { ...(prev.home?.visibility || {}), [sec.key]: 'visible' }
                                  }
                                }))}
                                style={{ padding: '4px', fontSize: '0.7rem', border: 'none', borderRadius: '4px', cursor: 'pointer', background: mode === 'visible' ? '#10b981' : 'transparent', color: 'white' }}
                              >
                                Show
                              </button>
                              <button
                                type="button"
                                onClick={() => setPagesConfig(prev => ({
                                  ...prev,
                                  home: {
                                    ...prev.home,
                                    visibility: { ...(prev.home?.visibility || {}), [sec.key]: 'translucent-50' }
                                  }
                                }))}
                                style={{ padding: '4px', fontSize: '0.7rem', border: 'none', borderRadius: '4px', cursor: 'pointer', background: mode.startsWith('translucent') ? '#fbbf24' : 'transparent', color: mode.startsWith('translucent') ? 'black' : 'white' }}
                              >
                                Trans
                              </button>
                              <button
                                type="button"
                                onClick={() => setPagesConfig(prev => ({
                                  ...prev,
                                  home: {
                                    ...prev.home,
                                    visibility: { ...(prev.home?.visibility || {}), [sec.key]: 'hidden' }
                                  }
                                }))}
                                style={{ padding: '4px', fontSize: '0.7rem', border: 'none', borderRadius: '4px', cursor: 'pointer', background: mode === 'hidden' ? '#ef4444' : 'transparent', color: 'white' }}
                              >
                                Hide
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* B. Slider settings & slide list */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '12px' }}>🏞️ Hero Slider Images Carousel ({(pagesConfig.home?.bannerSlider || []).length})</strong>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem' }}>Slide Heading Title</span>
                        <input type="text" placeholder="Title (e.g. Traditional Handlooms)" value={newSlide.title} onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))} className="glass-input" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem' }}>Slide Subtitle</span>
                        <input type="text" placeholder="Subtitle description..." value={newSlide.subtitle} onChange={(e) => setNewSlide(prev => ({ ...prev, subtitle: e.target.value }))} className="glass-input" />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem' }}>Promo Price (₹)</span>
                        <input type="number" placeholder="Promo Price (optional)" value={newSlide.price || ''} onChange={(e) => setNewSlide(prev => ({ ...prev, price: Number(e.target.value) || 0 }))} className="glass-input" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem' }}>Original Price (₹)</span>
                        <input type="number" placeholder="Original Price (optional)" value={newSlide.originalPrice || ''} onChange={(e) => setNewSlide(prev => ({ ...prev, originalPrice: Number(e.target.value) || 0 }))} className="glass-input" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem' }}>Button Text</span>
                        <input type="text" placeholder="e.g. Shop Now" value={newSlide.buttonText || ''} onChange={(e) => setNewSlide(prev => ({ ...prev, buttonText: e.target.value }))} className="glass-input" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem' }}>Button Link</span>
                        <input type="text" placeholder="e.g. /products" value={newSlide.buttonLink || ''} onChange={(e) => setNewSlide(prev => ({ ...prev, buttonLink: e.target.value }))} className="glass-input" />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Option A: Upload Image File</span>
                        <input type="file" accept="image/*" onChange={(e) => handleBase64Upload(e, (res) => setNewSlide(prev => ({ ...prev, image: res })))} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Option B: Paste Image Web URL</span>
                        <input type="text" placeholder="https://images.unsplash.com/..." value={newSlide.image && newSlide.image.startsWith('data:') ? '' : newSlide.image} onChange={(e) => setNewSlide(prev => ({ ...prev, image: e.target.value }))} className="glass-input" />
                      </div>
                    </div>

                    {newSlide.image && <img src={newSlide.image} alt="" style={{ height: '60px', borderRadius: '4px', objectFit: 'cover', display: 'block', margin: '10px 0' }} />}

                    <button onClick={handleAddSlide} className="glass-button secondary" style={{ marginTop: '12px', padding: '6px 16px', fontSize: '0.8rem' }}><Plus size={14} /> Add Carousel Slide</button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                      {(pagesConfig.home?.bannerSlider || []).map((sld, idx) => (
                        <div key={idx} className="glass-panel" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {sld.image && <img src={sld.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                            <div>
                              <strong style={{ fontSize: '0.85rem' }}>{sld.title}</strong>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{sld.subtitle}</p>
                              {sld.price ? (
                                <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', marginRight: '10px' }}>
                                  ₹{sld.price} {sld.originalPrice ? <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>₹{sld.originalPrice}</span> : ''}
                                </span>
                              ) : null}
                              {sld.buttonText && <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Btn: {sld.buttonText}</span>}
                            </div>
                          </div>
                          <button onClick={() => handleRemoveSlide(idx)} className="glass-button danger" style={{ padding: '4px 8px' }}><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* C. Slogans and Welcoming Texts */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <strong style={{ fontSize: '0.95rem' }}>📝 Slogans, welcome headings & taglines</strong>
                    <input type="text" value={pagesConfig.home?.welcomeText?.heading || ''} onChange={(e) => setPagesConfig(prev => ({ ...prev, home: { ...prev.home, welcomeText: { ...(prev.home?.welcomeText || {}), heading: e.target.value } } }))} className="glass-input" placeholder="Welcome Heading Title" />
                    <textarea value={pagesConfig.home?.welcomeText?.paragraph || ''} onChange={(e) => setPagesConfig(prev => ({ ...prev, home: { ...prev.home, welcomeText: { ...(prev.home?.welcomeText || {}), paragraph: e.target.value } } }))} className="glass-input" placeholder="Enter welcoming description paragraph text details..." rows={3} />
                    <input type="text" value={pagesConfig.home?.heroSection?.subtitle || ''} onChange={(e) => setPagesConfig(prev => ({ ...prev, home: { ...prev.home, heroSection: { ...(prev.home?.heroSection || {}), subtitle: e.target.value } } }))} className="glass-input" placeholder="Dynamic Slogan / Tagline (e.g. Authentically Woven | Fresh Sourced)" />
                  </div>

                  {/* D. Marquee announcement and Video Player */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <strong style={{ fontSize: '0.95rem' }}>✨ Announcement Marquee</strong>
                      <input type="text" value={pagesConfig.home?.autoScrollText?.text || ''} onChange={(e) => setPagesConfig(prev => ({ ...prev, home: { ...prev.home, autoScrollText: { ...(prev.home?.autoScrollText || {}), text: e.target.value } } }))} className="glass-input" placeholder="Enter marquee text..." />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <strong style={{ fontSize: '0.95rem' }}>🎥 Featured YouTube Video URL</strong>
                      <input type="text" value={pagesConfig.home?.videoUrl || ''} onChange={(e) => setPagesConfig(prev => ({ ...prev, home: { ...prev.home, videoUrl: e.target.value } }))} className="glass-input" placeholder="YouTube Video URL..." />
                    </div>
                  </div>

                  {/* E. Integrated Testimonials Reviews CRUD block */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Star size={16} fill="#fbbf24" style={{ color: '#fbbf24' }} /> Customer Testimonials reviews
                    </strong>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input type="text" placeholder="Customer Name..." value={newManualReview.name} onChange={(e) => setNewManualReview(prev => ({ ...prev, name: e.target.value }))} className="glass-input" />
                      <select value={newManualReview.rating} onChange={(e) => setNewManualReview(prev => ({ ...prev, rating: Number(e.target.value) }))} className="glass-input">
                        <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                        <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                        <option value="3">⭐⭐⭐ (3 Stars)</option>
                      </select>
                    </div>
                    <textarea placeholder="Write client testimonial review..." value={newManualReview.review} onChange={(e) => setNewManualReview(prev => ({ ...prev, review: e.target.value }))} className="glass-input" rows={2} />
                    <button onClick={handleAddManualReview} className="glass-button secondary" style={{ width: 'fit-content', padding: '6px 14px', fontSize: '0.8rem', background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>Add Testimonial</button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto', marginTop: '10px' }}>
                      {ratingsList.map((rev, idx) => (
                        <div key={idx} className="glass-panel" style={{ padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', fontSize: '0.8rem' }}>
                          <div>
                            <strong>{rev.name}</strong> <span style={{ color: '#fbbf24' }}>★ {rev.rating}</span>
                            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>"{rev.review}"</p>
                          </div>
                          <button onClick={() => handleRemoveReview(idx)} className="glass-button danger" style={{ padding: '4px' }}><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleSaveWebsite} className="glass-button" style={{ width: 'fit-content', padding: '12px 28px' }}>
                    Publish Home Page Changes
                  </button>
                </div>
              )}

              {/* 4. About Brand Story Tab */}
              {activeTab === 'about' && (
                <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Compass size={22} style={{ color: 'var(--accent-purple)' }} />
                    About Brand Story, Mission & Vision
                  </h2>

                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <strong style={{ fontSize: '0.95rem' }}>Detailed Corporate Story</strong>
                    <textarea
                      value={pagesConfig.about?.story || ''}
                      onChange={(e) => setPagesConfig(prev => ({
                        ...prev,
                        about: { ...(prev.about || {}), story: e.target.value }
                      }))}
                      className="glass-input"
                      placeholder="Write your company story, history, years of experience, and customer commitment here..."
                      rows={5}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <strong style={{ fontSize: '0.95rem' }}>🎯 Our Mission</strong>
                      <textarea
                        value={pagesConfig.about?.mission || ''}
                        onChange={(e) => setPagesConfig(prev => ({
                          ...prev,
                          about: { ...(prev.about || {}), mission: e.target.value }
                        }))}
                        className="glass-input"
                        placeholder="e.g. Delivering fresh local products with absolute zero delivery delays..."
                        rows={3}
                      />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <strong style={{ fontSize: '0.95rem' }}>🚀 Our Vision</strong>
                      <textarea
                        value={pagesConfig.about?.vision || ''}
                        onChange={(e) => setPagesConfig(prev => ({
                          ...prev,
                          about: { ...(prev.about || {}), vision: e.target.value }
                        }))}
                        className="glass-input"
                        placeholder="e.g. Empacting digital tools in every small local household..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <button onClick={handleSaveWebsite} className="glass-button" style={{ width: 'fit-content', padding: '12px 28px' }}>
                    Publish About Details
                  </button>
                </div>
              )}

              {/* 5. Services Setup Tab */}
              {activeTab === 'services' && (
                <div className="glass-panel animate-fade-in">
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ListCollapse size={22} style={{ color: 'var(--accent-purple)' }} />
                    {dynamicLabels.services} List ({pagesConfig.services?.length || 0})
                  </h2>

                  {/* Add service form */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--accent-purple)' }}>Add New {dynamicLabels.services} Entry</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                      <div style={{ flex: '1.5 1 200px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Image Icon File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBase64Upload(e, (res) => setNewService(prev => ({ ...prev, image: res })))}
                          style={{ fontSize: '0.8rem', padding: '6px' }}
                        />
                      </div>
                      <div style={{ flex: '2 1 200px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Title / Name</span>
                        <input
                          type="text"
                          placeholder="Title..."
                          value={newService.title}
                          onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
                          className="glass-input"
                        />
                      </div>
                      <div style={{ flex: '3 1 300px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Description</span>
                        <input
                          type="text"
                          placeholder="Explain specifications..."
                          value={newService.description}
                          onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                          className="glass-input"
                        />
                      </div>
                      <button onClick={handleAddService} className="glass-button" style={{ padding: '12px 20px', alignSelf: 'flex-end', height: '46px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Plus size={16} /> Add Entry
                      </button>
                    </div>
                  </div>

                  {/* Services list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(pagesConfig.services || []).map((srv, idx) => (
                      <div key={idx} className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {srv.image ? (
                            <img src={srv.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} />
                          ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                              {srv.title?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <strong>{srv.title}</strong>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{srv.description}</p>
                          </div>
                        </div>
                        <button onClick={() => handleRemoveService(idx)} className="glass-button danger" style={{ padding: '6px 10px' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button onClick={handleSaveWebsite} className="glass-button" style={{ marginTop: '24px', padding: '12px 28px' }}>
                    Publish Services Catalog
                  </button>
                </div>
              )}

              {/* 6. Products Inventory Tab */}
              {activeTab === 'products' && (
                <div className="glass-panel animate-fade-in">
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={22} style={{ color: 'var(--accent-blue)' }} />
                    {dynamicLabels.products} List ({pagesConfig.products?.length || 0})
                  </h2>

                  {/* Add product form */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--accent-blue)' }}>Add New Catalog Item</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                      <div style={{ flex: '1.5 1 200px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Product Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBase64Upload(e, (res) => setNewProduct(prev => ({ ...prev, image: res })))}
                          style={{ fontSize: '0.8rem', padding: '6px' }}
                        />
                      </div>
                      <div style={{ flex: '2 1 180px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Title / Name</span>
                        <input
                          type="text"
                          placeholder="Name..."
                          value={newProduct.title}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                          className="glass-input"
                        />
                      </div>
                      <div style={{ flex: '2.5 1 220px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Description</span>
                        <input
                          type="text"
                          placeholder="Short description..."
                          value={newProduct.description}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                          className="glass-input"
                        />
                      </div>
                      <div style={{ flex: '1 1 100px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price (₹)</span>
                        <input
                          type="number"
                          placeholder="Price"
                          value={newProduct.price || ''}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="glass-input"
                        />
                      </div>
                      <div style={{ flex: '1.5 1 150px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category / Tag</span>
                        <input
                          type="text"
                          placeholder="e.g. Sarees / Deluxe"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                          className="glass-input"
                        />
                      </div>
                      <button onClick={handleAddProduct} className="glass-button" style={{ padding: '12px 20px', alignSelf: 'flex-end', height: '46px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Plus size={16} /> Add Catalog Item
                      </button>
                    </div>
                  </div>

                  {/* Products list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(pagesConfig.products || []).map((prd, idx) => (
                      <div key={idx} className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {prd.image && <img src={prd.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />}
                          <div>
                            <strong>{prd.title}</strong>
                            <span className="badge" style={{ marginLeft: '10px', scale: '0.85' }}>{prd.category || 'General'}</span>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prd.description || 'No description configured.'}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <strong style={{ color: 'var(--accent-blue)' }}>₹{prd.price}</strong>
                          <button onClick={() => handleRemoveProduct(idx)} className="glass-button danger" style={{ padding: '6px 10px' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={handleSaveWebsite} className="glass-button" style={{ marginTop: '24px', padding: '12px 28px' }}>
                    Publish Catalog
                  </button>
                </div>
              )}

              {/* 7. Media Gallery Tab */}
              {activeTab === 'gallery' && (
                <div className="glass-panel animate-fade-in">
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={22} style={{ color: 'var(--accent-purple)' }} />
                    Unified Media Gallery CRUD Panel ({pagesConfig.gallery?.length || 0})
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Manage your merchant media catalogs. Upload images, paste YouTube video URLs, or host custom MP3 streams in a single gallery.
                  </p>

                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '0.95rem' }}>Attach New Media to Catalog</strong>
                      <select value={newGalleryType} onChange={(e) => { setNewGalleryType(e.target.value); setNewGalleryUrl(''); }} className="glass-input" style={{ width: '160px', padding: '6px 12px' }}>
                        <option value="image">📸 Upload Image</option>
                        <option value="video">🎥 YouTube Video Link</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {newGalleryType === 'image' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Option A: Upload local image file</span>
                            <input type="file" accept="image/*" onChange={(e) => handleBase64Upload(e, setNewGalleryUrl)} style={{ fontSize: '0.8rem' }} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Option B: Paste Web Image URL</span>
                            <input type="text" placeholder="https://images.unsplash.com/..." value={newGalleryUrl && newGalleryUrl.startsWith('data:') ? '' : newGalleryUrl} onChange={(e) => setNewGalleryUrl(e.target.value)} className="glass-input" style={{ padding: '8px 12px', fontSize: '0.85rem' }} />
                          </div>
                        </div>
                      )}

                      {newGalleryType === 'video' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Enter YouTube Video URL</span>
                          <input type="text" placeholder="https://www.youtube.com/watch?v=..." value={newGalleryUrl} onChange={(e) => setNewGalleryUrl(e.target.value)} className="glass-input" />
                        </div>
                      )}


                    </div>

                    {newGalleryUrl && (
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Media Attachment Review:</span>
                        {newGalleryType === 'image' && (
                          <img src={newGalleryUrl} alt="" style={{ height: '70px', borderRadius: '4px', border: '1px solid var(--accent-purple)' }} />
                        )}
                        {newGalleryType === 'video' && (
                          <div style={{ width: '200px', aspectRatio: '16/9', borderRadius: '4px', overflow: 'hidden' }}>
                            <iframe src={(() => {
                              if (!newGalleryUrl) return '';
                              if (newGalleryUrl.includes('v=')) return `https://www.youtube.com/embed/${newGalleryUrl.split('v=')[1].split('&')[0]}`;
                              if (newGalleryUrl.includes('youtu.be/')) return `https://www.youtube.com/embed/${newGalleryUrl.split('youtu.be/')[1].split('?')[0]}`;
                              return `https://www.youtube.com/embed/${newGalleryUrl.split('/').pop()}`;
                            })()} title="Youtube Preview" width="100%" height="100%" style={{ border: 0 }}></iframe>
                          </div>
                        )}
                      </div>
                    )}

                    <button onClick={handleAddGalleryUrl} className="glass-button" style={{ width: 'fit-content', padding: '8px 20px', alignSelf: 'flex-end' }}><Plus size={16} /> Attach Media Item</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                    {(pagesConfig.gallery || []).map((gly, idx) => (
                      <div key={idx} className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center', position: 'relative' }}>
                        <span className="badge" style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2, scale: '0.85' }}>
                          {gly.type === 'image' && '📸 Image'}
                          {gly.type === 'video' && '🎥 Video'}
                        </span>
                        <div style={{ width: '100%', height: '100px', overflow: 'hidden', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {gly.type === 'image' && <img src={gly.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                          {gly.type === 'video' && <span>🎥 Youtube</span>}
                        </div>
                        <button onClick={() => handleRemoveGalleryItem(idx)} className="glass-button danger" style={{ padding: '6px', fontSize: '0.75rem' }}>Remove Item</button>
                      </div>
                    ))}
                  </div>

                  <button onClick={handleSaveWebsite} className="glass-button" style={{ marginTop: '24px', padding: '12px 28px' }}>
                    Publish Media Gallery
                  </button>
                </div>
              )}

              {/* 8. Contact details, Address, Map and Telephones Consolidated Editor */}
              {activeTab === 'contact' && (
                <div className="glass-panel animate-fade-in">
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={22} style={{ color: 'var(--accent-purple)' }} />
                    Contact details, Address & Map location
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                    Manage your merchant telephones, Whatsapp redirects, street location address, and Google maps iframe coords in one panel.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Telephones */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>WhatsApp Number (Digits with country prefix)</span>
                        <input type="text" placeholder="e.g. 919988776655" value={pagesConfig.contact?.whatsappNumber || ''} onChange={(e) => setPagesConfig(prev => ({ ...prev, contact: { ...(prev.contact || {}), whatsappNumber: e.target.value } }))} className="glass-input" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Official Business Email</span>
                        <input type="email" placeholder="contact@shop.com" value={pagesConfig.contact?.email || ''} onChange={(e) => setPagesConfig(prev => ({ ...prev, contact: { ...(prev.contact || {}), email: e.target.value } }))} className="glass-input" />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Official Telephone No</span>
                        <input type="text" placeholder="+91 99887 76655" value={pagesConfig.contact?.phone || ''} onChange={(e) => setPagesConfig(prev => ({ ...prev, contact: { ...(prev.contact || {}), phone: e.target.value } }))} className="glass-input" />
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Street Address details</span>
                        <input type="text" placeholder="Street name..." value={street} onChange={(e) => setStreet(e.target.value)} className="glass-input" />
                      </div>
                    </div>

                    {/* Address details */}
                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--accent-purple)' }}>📍 Physical Address coordinates (Click save profile)</strong>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="glass-input" required />
                        <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="glass-input" required />
                        <input type="text" placeholder="Pincode" value={pinCode} onChange={(e) => setPinCode(e.target.value)} className="glass-input" required />
                      </div>
                      <button type="submit" className="glass-button secondary" style={{ padding: '8px', width: 'fit-content' }}>Save Address coordinates</button>
                    </form>

                    {/* Google Map Embed & exact coordinates */}
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Map size={16} /> Google Map Embed & Coordinates</strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Google Map Iframe Embed Src URL</span>
                        <input
                          type="text"
                          placeholder="Paste Map Source Iframe URL or whole <iframe> embed code..."
                          value={pagesConfig.contact?.mapEmbedCode || ''}
                          onChange={(e) => handleMapChange(e.target.value)}
                          className="glass-input"
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Latitude (Optional exact location)</span>
                          <input
                            type="text"
                            placeholder="e.g. 30.3165"
                            value={pagesConfig.contact?.latitude || ''}
                            onChange={(e) => {
                              const newLat = e.target.value;
                              setPagesConfig(prev => {
                                const lng = prev.contact?.longitude || '';
                                const newMapEmbedCode = (newLat && lng) ? `https://maps.google.com/maps?q=${newLat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed` : prev.contact?.mapEmbedCode;
                                return {
                                  ...prev,
                                  contact: {
                                    ...(prev.contact || {}),
                                    latitude: newLat,
                                    mapEmbedCode: newMapEmbedCode
                                  }
                                };
                              });
                            }}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Longitude (Optional exact location)</span>
                          <input
                            type="text"
                            placeholder="e.g. 78.0322"
                            value={pagesConfig.contact?.longitude || ''}
                            onChange={(e) => {
                              const newLng = e.target.value;
                              setPagesConfig(prev => {
                                const lat = prev.contact?.latitude || '';
                                const newMapEmbedCode = (lat && newLng) ? `https://maps.google.com/maps?q=${lat},${newLng}&t=&z=15&ie=UTF8&iwloc=&output=embed` : prev.contact?.mapEmbedCode;
                                return {
                                  ...prev,
                                  contact: {
                                    ...(prev.contact || {}),
                                    longitude: newLng,
                                    mapEmbedCode: newMapEmbedCode
                                  }
                                };
                              });
                            }}
                            className="glass-input"
                          />
                        </div>
                      </div>
                      {pagesConfig.contact?.mapEmbedCode && (
                        <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', padding: '6px' }}>🗺️ Google Map Live Preview:</span>
                          <iframe
                            title="google map dashboard preview"
                            src={pagesConfig.contact.mapEmbedCode}
                            width="100%"
                            height="180"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                          ></iframe>
                        </div>
                      )}
                    </div>


                  </div>

                  <button onClick={handleSaveWebsite} className="glass-button" style={{ marginTop: '24px', padding: '12px 28px' }}>
                    Publish Contacts config
                  </button>
                </div>
              )}

              {activeTab === 'change_password' && (
                <div className="glass-panel animate-fade-in">
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={22} style={{ color: 'var(--accent-purple)' }} />
                    Change Administration Password
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                    Update your password secure key. Your current session will remain active.
                  </p>

                  <form onSubmit={handleChangePasswordSubmit} style={{ maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current Password</span>
                      <input
                        type="password"
                        placeholder="Type current password..."
                        value={currentPasswordVal}
                        onChange={(e) => setCurrentPasswordVal(e.target.value)}
                        className="glass-input"
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>New Password (Min 6 characters)</span>
                      <input
                        type="password"
                        placeholder="Type new password..."
                        value={newPasswordVal}
                        onChange={(e) => setNewPasswordVal(e.target.value)}
                        className="glass-input"
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Confirm New Password</span>
                      <input
                        type="password"
                        placeholder="Confirm new password..."
                        value={confirmNewPasswordVal}
                        onChange={(e) => setConfirmNewPasswordVal(e.target.value)}
                        className="glass-input"
                        required
                      />
                    </div>
                    
                    <button type="submit" disabled={saving} className="glass-button" style={{ padding: '12px', marginTop: '10px' }}>
                      {saving ? 'Processing...' : 'Update Password Credentials'}
                    </button>
                  </form>
                </div>
              )}



              {/* Custom Form Builder Tab */}
              {activeTab === 'custom_form' && (
                <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sliders size={22} style={{ color: 'var(--accent-purple)' }} />
                      Dynamic Custom Form Builder
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Design a personalized contact / inquiry form for your website visitors. Define headers, button text, and custom input fields.
                    </p>
                  </div>

                  {user.partialBlockSettings?.blockCustomForm ? (
                    <div className="glass-panel" style={{ padding: '30px', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.05)', textAlign: 'center' }}>
                      <span style={{ fontSize: '2.5rem' }}>⚠️</span>
                      <h3 style={{ color: '#ef4444', margin: '15px 0 8px 0' }}>Feature Access Suspended</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        The custom form builder has been temporarily blocked for your merchant account by the platform administrator.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {/* Header Configuration */}
                    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--accent-purple)' }}>📋 Form Header Settings</strong>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Form Title</span>
                        <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="glass-input" required />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Form Description</span>
                        <input type="text" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="glass-input" required />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Submit Button Text</span>
                        <input type="text" value={formSubmitBtnText} onChange={(e) => setFormSubmitBtnText(e.target.value)} className="glass-input" required />
                      </div>
                    </div>

                    {/* New Field Creator */}
                    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--accent-blue)' }}>➕ Add Custom Input Field</strong>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Field Label / Name *</span>
                        <input type="text" placeholder="e.g. Car Model, Preferred Date" value={newFieldName} onChange={(e) => setNewFieldName(e.target.value)} className="glass-input" />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Field Input Type</span>
                        <select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)} className="glass-input" style={{ background: '#111', color: 'white' }}>
                          <option value="text">Single Line Text</option>
                          <option value="textarea">Multi-line Textarea</option>
                          <option value="email">Email Address</option>
                          <option value="dropdown">Dropdown Options Selector</option>
                        </select>
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', margin: '4px 0' }}>
                        <input type="checkbox" checked={newFieldRequired} onChange={(e) => setNewFieldRequired(e.target.checked)} />
                        Required Field (Cannot submit empty)
                      </label>

                      {newFieldType === 'dropdown' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Dropdown Options (Comma separated)</span>
                          <input type="text" placeholder="e.g. Hatchback, Sedan, SUV" value={newFieldOptions} onChange={(e) => setNewFieldOptions(e.target.value)} className="glass-input" />
                        </div>
                      )}

                      <button type="button" onClick={handleAddField} className="glass-button secondary" style={{ padding: '10px' }}>
                        Add Field to List
                      </button>
                    </div>
                  </div>

                  {/* Configured Fields List */}
                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)', display: 'block', marginBottom: '16px' }}>📋 Form Fields Preview & Layout</strong>
                    {formFields.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', margin: '20px 0' }}>
                        No custom fields added yet. The form will fall back to default fields (Name, Mobile, Email, Query).
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {formFields.map((field, idx) => (
                          <div key={idx} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <strong style={{ fontSize: '0.9rem' }}>{field.fieldName}</strong>
                                {field.required && <span className="badge red" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Required</span>}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                                Type: {field.fieldType} {field.options && field.options.length > 0 ? `(${field.options.join(', ')})` : ''}
                              </span>
                            </div>
                            <button type="button" onClick={() => handleRemoveField(idx)} className="glass-button danger" style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                      </div>

                      {/* Submit All */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                        <button onClick={handleSaveFormBuilder} disabled={saving} className="glass-button primary" style={{ padding: '12px 28px' }}>
                          {saving ? 'Saving Configurations...' : 'Publish Form Builder Changes'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* WhatsApp Campaigns / Advertisements Tab */}
              {activeTab === 'whatsapp_campaigns' && (
                <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MessageSquare size={22} style={{ color: '#16a34a' }} />
                      WhatsApp Marketing Campaigns
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Create, manage, and broadcast targeted advertising campaigns to your customers. Track impressions and click rates.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {/* Create / Edit Form */}
                    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <strong style={{ fontSize: '1.05rem', color: '#16a34a' }}>
                        {editingCampaignId ? '📝 Edit Advertisement' : '🚀 Create Campaign'}
                      </strong>
                      <form onSubmit={handleSaveCampaignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Campaign Title</span>
                          <input
                            type="text"
                            placeholder="e.g. Festive Discount Promo"
                            value={newCampaignTitle}
                            onChange={(e) => setNewCampaignTitle(e.target.value)}
                            className="glass-input"
                            required
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Audience description</span>
                          <input
                            type="text"
                            placeholder="e.g. All Registered Customers / Enquiries"
                            value={newCampaignAudience}
                            onChange={(e) => setNewCampaignAudience(e.target.value)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Message Content</span>
                          <textarea
                            placeholder="Write your marketing copy here..."
                            value={newCampaignMessage}
                            onChange={(e) => setNewCampaignMessage(e.target.value)}
                            className="glass-input"
                            rows={5}
                            required
                          />
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                            💡 The broadcast will append a tracked link to your store at the end of this message automatically.
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                          <button type="submit" disabled={campaignLoading} className="glass-button primary" style={{ flex: 1, padding: '10px', background: 'rgba(22,163,74,0.2)', color: '#16a34a', borderColor: '#16a34a' }}>
                            {campaignLoading ? 'Saving...' : editingCampaignId ? 'Update Campaign' : 'Save as Draft'}
                          </button>
                          {editingCampaignId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCampaignId(null);
                                setNewCampaignTitle('');
                                setNewCampaignMessage('');
                                setNewCampaignAudience('All Customers');
                              }}
                              className="glass-button secondary"
                              style={{ padding: '10px' }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* Campaigns List */}
                    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--accent-purple)' }}>📊 Campaign Tracker List</strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                        {campaigns.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
                            No campaigns created yet. Draft your first promo to get started!
                          </p>
                        ) : (
                          campaigns.map((camp) => (
                            <div key={camp._id} className="glass-panel" style={{ padding: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ fontSize: '0.95rem', color: 'white' }}>{camp.title}</strong>
                                <span className={`badge ${camp.status === 'sent' ? 'green' : 'purple'}`}>
                                  {camp.status.toUpperCase()}
                                </span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                                {camp.message.length > 100 ? `${camp.message.substring(0, 100)}...` : camp.message}
                              </p>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Audience: <strong>{camp.targetAudience}</strong>
                              </div>
                              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                  <span>Imp: <strong style={{ color: 'white' }}>{camp.sentCount}</strong></span>
                                  <span>Clicks: <strong style={{ color: 'var(--accent-blue)' }}>{camp.clicksCount}</strong></span>
                                </div>
                                <span style={{ fontSize: '0.7rem' }}>
                                  {new Date(camp.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                <button
                                  onClick={() => handleBroadcastCampaign(camp._id)}
                                  className="glass-button"
                                  style={{ flex: 1, padding: '5px 10px', fontSize: '0.75rem', background: 'rgba(22,163,74,0.1)', color: '#16a34a', border: 'none' }}
                                  title="Broadcast campaign to WhatsApp"
                                >
                                  🚀 Broadcast
                                </button>
                                <button
                                  onClick={() => handleEditCampaign(camp)}
                                  className="glass-button"
                                  style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                                  title="Edit Campaign"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteCampaign(camp._id)}
                                  className="glass-button danger"
                                  style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                                  title="Delete Campaign"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Moderation Tab */}
              {activeTab === 'reviews_mod' && (
                <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Star size={22} style={{ color: 'var(--accent-purple)' }} />
                      Customer Review Moderation
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      View, verify, or remove customer reviews and ratings displaying on your public landing page.
                    </p>
                  </div>

                  {/* Add Manual Testimonial */}
                  <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--accent-blue)' }}>✍️ Add Client Testimonial / Review</strong>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddManualReview(); }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reviewer Name</span>
                        <input type="text" placeholder="e.g. Ramesh Kumar" value={newManualReview.name} onChange={(e) => setNewManualReview(prev => ({ ...prev, name: e.target.value }))} className="glass-input" required />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rating (1-5 Stars)</span>
                        <select value={newManualReview.rating} onChange={(e) => setNewManualReview(prev => ({ ...prev, rating: Number(e.target.value) }))} className="glass-input" style={{ background: '#111', color: 'white' }}>
                          <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                          <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                          <option value={3}>⭐⭐⭐ (3 Stars)</option>
                          <option value={2}>⭐⭐ (2 Stars)</option>
                          <option value={1}>⭐ (1 Star)</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Testimonial Description</span>
                        <input type="text" placeholder="e.g. Excellent service, highly recommended!" value={newManualReview.review} onChange={(e) => setNewManualReview(prev => ({ ...prev, review: e.target.value }))} className="glass-input" required />
                      </div>
                      <div>
                        <button type="submit" className="glass-button secondary" style={{ width: '100%', padding: '10px' }}>
                          Add Testimonial
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List and Moderation */}
                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)', display: 'block', marginBottom: '16px' }}>Live Ratings & Reviews List ({ratingsList.length})</strong>
                    {ratingsList.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', margin: '20px 0' }}>
                        No reviews submitted yet.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {ratingsList.map((rev, idx) => (
                          <div key={idx} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <strong style={{ fontSize: '0.95rem' }}>{rev.name}</strong>
                                <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                              </div>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                                {rev.review}
                              </p>
                              {rev.date && (
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                  Submitted: {new Date(rev.date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <button type="button" onClick={() => handleRemoveReview(idx)} className="glass-button danger" style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit All */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                    <button onClick={handleSaveWebsite} disabled={saving} className="glass-button primary" style={{ padding: '12px 28px' }}>
                      {saving ? 'Publishing Changes...' : 'Publish Review Moderation Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* ─────────────── Enquiries Inbox Tab ─────────────── */}
              {activeTab === 'inbox' && (
                <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={22} style={{ color: 'var(--accent-purple)' }} />
                      Enquiries Inbox
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      View and manage all customer contact form submissions from your live website. Delete entries, export data, or reply via WhatsApp.
                    </p>
                  </div>

                  {/* Action Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="glass-panel" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(139,92,246,0.2)' }}>
                        <Mail size={16} style={{ color: 'var(--accent-purple)' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Enquiries:</span>
                        <strong style={{ fontSize: '1.1rem', color: 'white' }}>{messages.length}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => {
                          setEnquiryFormVal({ name: '', email: '', mobile: '', address: '', request: '' });
                          setShowCreateEnquiryModal(true);
                        }}
                        className="glass-button"
                        style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', background: 'rgba(139,92,246,0.2)', color: 'white', borderColor: 'var(--accent-purple)' }}
                      >
                        <Plus size={14} /> Create Enquiry
                      </button>
                      <button
                        onClick={loadMessages}
                        className="glass-button secondary"
                        style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                      >
                        <RefreshCw size={14} /> Refresh Inbox
                      </button>
                      {messages.length > 0 && (
                        <button
                          onClick={() => {
                            const csvRows = [
                              ['#', 'Name', 'Email', 'Mobile', 'Address', 'Request', 'Custom Form Data', 'Date'].join(','),
                              ...messages.map((msg, i) => [
                                i + 1,
                                `"${msg.name || ''}"`,
                                `"${msg.email || ''}"`,
                                `"${msg.mobile || ''}"`,
                                `"${msg.address || ''}"`,
                                `"${(msg.request || '').replace(/"/g, "'")}"`,
                                `"${msg.submittedData ? JSON.stringify(msg.submittedData).replace(/"/g, "'") : ''}"`,
                                `"${msg.createdAt ? new Date(msg.createdAt).toLocaleString('en-IN') : 'N/A'}"`
                              ].join(','))
                            ].join('\n');
                            const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `enquiries_export_${new Date().toISOString().split('T')[0]}.csv`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="glass-button secondary"
                          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderColor: '#10b981' }}
                        >
                          ⬇️ Export CSV
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Messages List */}
                  {messages.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <Mail size={44} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                      <h3 style={{ color: 'var(--text-secondary)', margin: 0 }}>No Enquiries Yet</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, maxWidth: '380px' }}>
                        Customer enquiries submitted through your website's contact or custom form will appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {messages.map((msg, idx) => (
                        <div
                          key={msg._id || idx}
                          className="glass-panel"
                          style={{
                            padding: '20px',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px',
                            borderLeft: '3px solid var(--accent-purple)'
                          }}
                        >
                          {/* Header: Avatar + Name + Contact + Date + Delete */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <div style={{
                                width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', fontWeight: 'bold', color: 'white'
                              }}>
                                {(msg.name || 'A')[0].toUpperCase()}
                              </div>
                              <div>
                                <strong style={{ fontSize: '1rem', display: 'block' }}>{msg.name || 'Anonymous'}</strong>
                                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px', flexWrap: 'wrap' }}>
                                  {msg.email && <span>📧 {msg.email}</span>}
                                  {msg.mobile && <span>📱 {msg.mobile}</span>}
                                  {msg.address && <span>📍 {msg.address}</span>}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                              <span className={`badge ${msg.status === 'replied' ? 'green' : 'purple'}`} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>
                                {(msg.status || 'pending').toUpperCase()}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                                📅 {msg.createdAt ? new Date(msg.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedEnquiry(msg);
                                  setEnquiryFormVal({
                                    name: msg.name || '',
                                    email: msg.email || '',
                                    mobile: msg.mobile || '',
                                    address: msg.address || '',
                                    request: msg.request || ''
                                  });
                                  setShowEditEnquiryModal(true);
                                }}
                                className="glass-button"
                                style={{ padding: '5px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Edit2 size={12} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                className="glass-button danger"
                                style={{ padding: '5px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </div>

                          {/* Standard enquiry message/request body */}
                          {msg.request && (
                            <div style={{
                              background: 'rgba(255,255,255,0.02)',
                              padding: '12px 14px',
                              borderRadius: '8px',
                              border: '1px solid rgba(255,255,255,0.06)'
                            }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Customer Message / Request</span>
                              <p style={{ margin: 0, fontSize: '0.9rem', color: 'white', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                                {msg.request}
                              </p>
                            </div>
                          )}

                          {/* Custom form field responses */}
                          {msg.submittedData && typeof msg.submittedData === 'object' && Object.keys(msg.submittedData).length > 0 && (
                            <div style={{
                              background: 'rgba(139,92,246,0.04)',
                              padding: '14px',
                              borderRadius: '8px',
                              border: '1px solid rgba(139,92,246,0.15)'
                            }}>
                              <strong style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                                <Sliders size={13} /> Custom Form Responses
                              </strong>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                                {Object.entries(msg.submittedData).map(([key, val]) => (
                                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize', fontWeight: '600' }}>{key.replace(/_/g, ' ')}</span>
                                    <span style={{ fontSize: '0.88rem', color: 'white' }}>{String(val) || '—'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Stored Reply Banner */}
                          {msg.replyText && (
                            <div style={{
                              background: 'rgba(16,185,129,0.04)',
                              padding: '12px 14px',
                              borderRadius: '8px',
                              border: '1px solid rgba(16,185,129,0.2)',
                              marginTop: '8px',
                              marginBottom: '8px'
                            }}>
                              <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 'bold' }}>
                                <CheckCircle2 size={13} /> Response Sent ({msg.repliedAt ? new Date(msg.repliedAt).toLocaleString('en-IN') : 'N/A'})
                              </span>
                              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                                {msg.replyText}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons Row */}
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                            <button
                              onClick={() => {
                                setSelectedEnquiry(msg);
                                setReplyTextVal(msg.replyText || '');
                                setShowReplyEnquiryModal(true);
                              }}
                              className="glass-button"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                background: 'rgba(139,92,246,0.12)', color: 'var(--accent-purple)',
                                border: '1px solid rgba(139,92,246,0.3)', borderRadius: '6px',
                                padding: '7px 16px', fontSize: '0.82rem',
                                fontWeight: '500', cursor: 'pointer'
                              }}
                            >
                              💬 Compose Reply
                            </button>

                            {msg.mobile && (
                              <a
                                href={`https://wa.me/91${msg.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${msg.name || 'there'}, thank you for reaching out to us! We received your enquiry and will get back to you shortly. 😊`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                                  background: 'rgba(22,163,74,0.06)', color: '#16a34a',
                                  border: '1px solid rgba(22,163,74,0.2)', borderRadius: '6px',
                                  padding: '7px 16px', textDecoration: 'none', fontSize: '0.82rem',
                                  fontWeight: '500', transition: 'all 0.2s ease'
                                }}
                              >
                                👋 Quick WhatsApp Greeting
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* All Shops Directory Tab */}
              {activeTab === 'all_shops' && (() => {
                const uniqueCategories = [...new Set(allShops.map(s => s.category).filter(Boolean))];
                const filteredShops = allShops.filter(shop => {
                  const query = shopSearchQuery.toLowerCase();
                  const nameMatch = shop.companyName?.toLowerCase().includes(query);
                  const catMatch = shop.category?.toLowerCase().includes(query);
                  const cityMatch = shop.address?.city?.toLowerCase().includes(query);
                  const stateMatch = shop.address?.state?.toLowerCase().includes(query);
                  const matchesSearch = !shopSearchQuery || nameMatch || catMatch || cityMatch || stateMatch;
                  const matchesCat = !shopFilterCat || shop.category === shopFilterCat;
                  return matchesSearch && matchesCat;
                });

                return (
                  <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building2 size={22} style={{ color: 'var(--accent-purple)' }} />
                        All Shops Directory
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Browse all active merchant profiles, landing pages, and simple shops registered on the WebsiteMaker platform.
                      </p>
                    </div>

                    {/* Search & Filter Header Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                          <input
                            type="text"
                            placeholder="🔍 Search shops by name, category, or city..."
                            value={shopSearchQuery}
                            onChange={(e) => setShopSearchQuery(e.target.value)}
                            className="glass-input"
                            style={{ width: '100%', paddingLeft: '14px' }}
                          />
                          {shopSearchQuery && (
                            <button
                              onClick={() => setShopSearchQuery('')}
                              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <button
                          onClick={loadAllShops}
                          className="glass-button secondary"
                          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                        >
                          <RefreshCw size={14} /> Refresh Directory
                        </button>
                      </div>

                      {/* Category Quick Filters */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                        <button
                          onClick={() => setShopFilterCat('')}
                          style={{
                            padding: '6px 14px',
                            fontSize: '0.78rem',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            border: shopFilterCat === '' ? '1px solid var(--accent-purple)' : '1px solid rgba(255,255,255,0.1)',
                            background: shopFilterCat === '' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                            color: shopFilterCat === '' ? 'white' : 'var(--text-secondary)',
                            fontWeight: shopFilterCat === '' ? '600' : 'normal',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          All Categories ({allShops.length})
                        </button>
                        {uniqueCategories.map(cat => {
                          const count = allShops.filter(s => s.category === cat).length;
                          const isActive = shopFilterCat === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => setShopFilterCat(cat)}
                              style={{
                                padding: '6px 14px',
                                fontSize: '0.78rem',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                border: isActive ? '1px solid var(--accent-purple)' : '1px solid rgba(255,255,255,0.1)',
                                background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                fontWeight: isActive ? '600' : 'normal',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {cat} ({count})
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Shop Grid Display */}
                    {filteredShops.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                        <Building2 size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>No shops found matching your search/filters.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                        {filteredShops.map((shop) => (
                          <div
                            key={shop.id}
                            className="glass-panel"
                            style={{
                              padding: '0',
                              overflow: 'hidden',
                              border: '1px solid var(--border-color)',
                              display: 'flex',
                              flexDirection: 'column',
                              transition: 'all 0.3s ease',
                              background: 'rgba(255,255,255,0.01)',
                            }}
                          >
                            {/* Card Banner */}
                            {shop.banner ? (
                              <img src={shop.banner} alt="" style={{ width: '100%', height: '90px', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '90px', background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))' }}></div>
                            )}

                            {/* Card Body */}
                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, position: 'relative' }}>
                              {/* Logo overlay */}
                              {shop.logo ? (
                                <img
                                  src={shop.logo}
                                  alt=""
                                  style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid var(--border-color)',
                                    marginTop: '-38px',
                                    background: '#111',
                                    display: 'block'
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '50%',
                                    background: 'var(--accent-purple)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    color: 'white',
                                    marginTop: '-38px',
                                    border: '2px solid var(--border-color)'
                                  }}
                                >
                                  {shop.companyName?.charAt(0).toUpperCase()}
                                </div>
                              )}

                              <div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'white' }}>
                                  {shop.companyName || 'Unnamed Shop'}
                                  {shop.isProfessional && <CheckCircle2 size={13} style={{ color: '#10b981' }} title="Professional Verification" />}
                                </h3>
                                <span className="badge" style={{ marginTop: '5px', fontSize: '0.68rem', padding: '2px 8px' }}>
                                  {shop.category}
                                </span>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                {shop.address?.city && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    📍 {shop.address.city}, {shop.address.state}
                                  </span>
                                )}
                                {shop.phone && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    📞 {shop.phone}
                                  </span>
                                )}
                                {shop.remarks && (
                                  <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                                    "{shop.remarks}"
                                  </span>
                                )}
                              </div>

                              {/* Review Stars summary */}
                              {shop.ratings?.length > 0 && (() => {
                                const avg = (shop.ratings.reduce((acc, r) => acc + r.rating, 0) / shop.ratings.length).toFixed(1);
                                return (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#fbbf24' }}>
                                    <span>★ {avg} Stars</span>
                                    <span style={{ color: 'var(--text-muted)' }}>({shop.ratings.length} reviews)</span>
                                  </div>
                                );
                              })()}

                              {/* Action Buttons Footer */}
                              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                {shop.subdomain ? (
                                  <a
                                    href={getSubdomainUrl(shop.subdomain)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-button secondary"
                                    style={{ flex: 1, padding: '6px 0', fontSize: '0.72rem', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                  >
                                    Visit Site <Compass size={11} />
                                  </a>
                                ) : (
                                  <span style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    Simple Shop Directory
                                  </span>
                                )}
                                {shop.whatsapp && (
                                  <a
                                    href={`https://wa.me/91${shop.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-button"
                                    style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }}
                                    title="WhatsApp Shop Chat"
                                  >
                                    <MessageSquare size={13} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

            </div>

          </div>

        {/* Responsive In-Page Preview Sandbox Modal - Theme-Aware Styled */}
        {showThemeModal && selectedThemeOption && (() => {
          const ms = getThemeModalStyle(selectedThemeOption.type);
          const isTemple = selectedThemeOption.type === 'Mandir & Spiritual';
          return (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: isTemple ? 'rgba(10, 3, 0, 0.9)' : 'rgba(5, 5, 8, 0.88)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}>
              {/* Temple Floating Diyas Animation (only for Mandir theme) */}
              {isTemple && (
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }}>
                  <style>{`
                    @keyframes floatDiya { 0%,100% { transform: translateY(0) rotate(-3deg); opacity: 0.7; } 50% { transform: translateY(-18px) rotate(3deg); opacity: 1; } }
                    @keyframes flickerFlame { 0%,100% { transform: scaleY(1) scaleX(1); } 50% { transform: scaleY(1.15) scaleX(0.9); } }
                    @keyframes templeGlow { 0%,100% { box-shadow: 0 0 40px rgba(234,88,12,0.2); } 50% { box-shadow: 0 0 80px rgba(234,88,12,0.4); } }
                    .modal-diya { position: absolute; display: flex; flex-direction: column; align-items: center; animation: floatDiya 3s ease-in-out infinite; }
                    .modal-diya-flame { animation: flickerFlame 0.5s ease-in-out infinite; }
                  `}</style>
                  {[
                    { left: '5%', bottom: '15%', delay: '0s', scale: 1 },
                    { left: '92%', bottom: '20%', delay: '0.8s', scale: 0.8 },
                    { left: '15%', bottom: '8%', delay: '1.5s', scale: 0.7 },
                    { left: '80%', bottom: '10%', delay: '0.4s', scale: 0.9 },
                    { left: '50%', bottom: '5%', delay: '1.1s', scale: 0.75 },
                  ].map((diya, i) => (
                    <div key={i} className="modal-diya" style={{ left: diya.left, bottom: diya.bottom, animationDelay: diya.delay, transform: `scale(${diya.scale})` }}>
                      <div className="modal-diya-flame" style={{ width: '10px', height: '16px', background: 'radial-gradient(ellipse at bottom, #fef08a, #f97316, transparent)', borderRadius: '50% 50% 40% 40%', marginBottom: '-2px' }}></div>
                      <div style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 8px #f97316)' }}>🪔</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="animate-fade-in" style={{
                width: '100%',
                maxWidth: previewViewport === 'desktop' ? '1200px' : previewViewport === 'tablet' ? '820px' : '420px',
                background: ms.bg,
                border: `2px solid ${ms.border}`,
                boxShadow: `0 20px 60px ${ms.glow}, 0 0 0 1px ${ms.border}`,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: isTemple ? '24px 24px 12px 12px' : '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                animation: isTemple ? 'templeGlow 3s ease-in-out infinite' : 'none',
                position: 'relative',
                zIndex: 9999
              }}>

                {/* Temple Arch Banner (only for Mandir) */}
                {isTemple && (
                  <div style={{
                    background: 'linear-gradient(180deg, rgba(234,88,12,0.15) 0%, transparent 100%)',
                    padding: '6px 0 0 0',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    fontSize: '1.3rem'
                  }}>
                    {'🔔 🛕 🕉️ 🌸 🛕 🔔'.split(' ').map((s, i) => (
                      <span key={i} style={{ animationDelay: `${i * 0.2}s`, display: 'inline-block' }}>{s}</span>
                    ))}
                  </div>
                )}

                {/* Modal Header */}
                <div style={{
                  padding: '14px 24px',
                  background: ms.headerBg,
                  borderBottom: `1px solid ${ms.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', color: ms.accent }}>
                      <span style={{ fontSize: '1.4rem' }}>{selectedThemeOption.emoji}</span>
                      <span>{selectedThemeOption.type} — Live Theme Preview</span>
                    </h3>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px', display: 'block' }}>
                      Default accent: <strong style={{ color: ms.accent }}>{selectedThemeOption.defaultColor}</strong> •
                      Font: <strong style={{ color: ms.accent }}>{selectedThemeOption.defaultFont}</strong> •
                      In-page sandbox — no new tabs opened
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* Viewport Toggles */}
                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '2px', borderRadius: '8px' }}>
                      {[
                        { id: 'desktop', label: '💻' },
                        { id: 'tablet', label: '📟' },
                        { id: 'mobile', label: '📱' }
                      ].map((vp) => (
                        <button
                          key={vp.id}
                          type="button"
                          onClick={() => setPreviewViewport(vp.id)}
                          style={{
                            padding: '5px 10px',
                            fontSize: '0.85rem',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            background: previewViewport === vp.id ? ms.accent : 'transparent',
                            color: 'white',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {vp.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => { setShowThemeModal(false); setSelectedThemeOption(null); }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: `1px solid ${ms.border}`,
                        color: ms.accent,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Quick Theme Mode Switcher Strip */}
                <div style={{
                  padding: '8px 24px',
                  background: ms.accentSoft,
                  borderBottom: `1px solid ${ms.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preview Mode:</span>
                  {['Dark', 'White', 'Warm', 'Bright'].map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setThemeConfig(prev => ({ ...prev, themeMode: mode }))}
                      style={{
                        padding: '3px 10px',
                        fontSize: '0.72rem',
                        border: `1px solid ${themeConfig.themeMode === mode ? ms.accent : 'rgba(255,255,255,0.12)'}`,
                        borderRadius: '999px',
                        cursor: 'pointer',
                        background: themeConfig.themeMode === mode ? ms.accent : 'transparent',
                        color: themeConfig.themeMode === mode ? 'white' : 'rgba(255,255,255,0.5)',
                        fontWeight: themeConfig.themeMode === mode ? 'bold' : 'normal',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {mode === 'Dark' ? '🌙 Dark' : mode === 'White' ? '☀️ Light' : mode === 'Warm' ? '🕯️ Warm' : '⚡ Bright'}
                    </button>
                  ))}
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginLeft: 'auto' }}>Changes reflect instantly in the iframe preview below ↓</span>
                </div>

                {/* Live Sandboxed Simulator Iframe */}
                <div style={{
                  background: '#05060a',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexGrow: 1,
                  height: '440px',
                  position: 'relative'
                }}>
                  <iframe
                    ref={iframeRef}
                    onLoad={handleIframeLoad}
                    src={previewUrl}
                    title="Layout Live Preview Sandbox"
                    style={{
                      width: previewViewport === 'desktop' ? '100%' : previewViewport === 'tablet' ? '768px' : '375px',
                      height: '100%',
                      border: `1px solid ${ms.border}`,
                      borderRadius: '8px',
                      background: '#0a0b10',
                      boxShadow: `0 10px 30px ${ms.glow}`,
                      transition: 'width 0.3s ease'
                    }}
                  ></iframe>
                </div>

                {/* Modal Footer Controls */}
                <div style={{
                  padding: '14px 24px',
                  background: ms.accentSoft,
                  borderTop: `1px solid ${ms.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                      Launching: <strong style={{ color: ms.accent }}>{selectedThemeOption.type}</strong>
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', display: 'block' }}>
                      Default color ({selectedThemeOption.defaultColor}) & font ({selectedThemeOption.defaultFont}) will auto-apply if not changed.
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => { setShowThemeModal(false); setSelectedThemeOption(null); }}
                      style={{
                        padding: '9px 18px',
                        fontSize: '0.82rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: `1px solid ${ms.border}`,
                        color: 'rgba(255,255,255,0.6)',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      ❌ Cancel
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        setSaving(true);
                        try {
                          const updatedTheme = {
                            ...themeConfig,
                            businessType: selectedThemeOption.type,
                            colorTheme: themeConfig.colorTheme || selectedThemeOption.defaultColor || 'Blue',
                            fontStyle: themeConfig.fontStyle || selectedThemeOption.defaultFont || 'Modern'
                          };
                          setThemeConfig(updatedTheme);
                          await saveWebsiteConfig(updatedTheme, pagesConfig, ratingsList);
                          setShowThemeModal(false);
                          setSelectedThemeOption(null);
                          showAlert('green', `✅ ${selectedThemeOption.type} theme launched live with ${updatedTheme.colorTheme} accent!`);
                        } catch (err) {
                          showAlert('danger', 'Failed to publish selected template theme live.');
                        } finally {
                          setSaving(false);
                        }
                      }}
                      style={{
                        padding: '9px 22px',
                        fontSize: '0.85rem',
                        background: ms.btnGradient,
                        border: 'none',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: `0 4px 14px ${ms.glow}`
                      }}
                    >
                      {ms.launchLabel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
        {/* Create Enquiry Modal */}
        {showCreateEnquiryModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '24px', border: '1px solid var(--accent-purple)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>➕ Create Manual Enquiry</h3>
                <button onClick={() => setShowCreateEnquiryModal(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
              </div>
              <form onSubmit={handleCreateEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customer Name *</span>
                  <input type="text" className="glass-input" value={enquiryFormVal.name} onChange={(e) => setEnquiryFormVal({ ...enquiryFormVal, name: e.target.value })} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customer Email</span>
                  <input type="email" className="glass-input" value={enquiryFormVal.email} onChange={(e) => setEnquiryFormVal({ ...enquiryFormVal, email: e.target.value })} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customer Mobile</span>
                  <input type="text" className="glass-input" value={enquiryFormVal.mobile} onChange={(e) => setEnquiryFormVal({ ...enquiryFormVal, mobile: e.target.value })} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Address</span>
                  <input type="text" className="glass-input" value={enquiryFormVal.address} onChange={(e) => setEnquiryFormVal({ ...enquiryFormVal, address: e.target.value })} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Request / Message *</span>
                  <textarea className="glass-input" rows={3} value={enquiryFormVal.request} onChange={(e) => setEnquiryFormVal({ ...enquiryFormVal, request: e.target.value })} required />
                </div>
                <button type="submit" disabled={saving} className="glass-button" style={{ padding: '12px', marginTop: '10px' }}>
                  {saving ? 'Creating...' : 'Create Enquiry'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Enquiry Modal */}
        {showEditEnquiryModal && selectedEnquiry && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '24px', border: '1px solid var(--accent-blue)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>📝 Edit Enquiry Details</h3>
                <button onClick={() => { setShowEditEnquiryModal(false); setSelectedEnquiry(null); }} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
              </div>
              <form onSubmit={handleUpdateEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customer Name</span>
                  <input type="text" className="glass-input" value={enquiryFormVal.name} onChange={(e) => setEnquiryFormVal({ ...enquiryFormVal, name: e.target.value })} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customer Email</span>
                  <input type="email" className="glass-input" value={enquiryFormVal.email} onChange={(e) => setEnquiryFormVal({ ...enquiryFormVal, email: e.target.value })} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customer Mobile</span>
                  <input type="text" className="glass-input" value={enquiryFormVal.mobile} onChange={(e) => setEnquiryFormVal({ ...enquiryFormVal, mobile: e.target.value })} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Address</span>
                  <input type="text" className="glass-input" value={enquiryFormVal.address} onChange={(e) => setEnquiryFormVal({ ...enquiryFormVal, address: e.target.value })} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Request / Message</span>
                  <textarea className="glass-input" rows={3} value={enquiryFormVal.request} onChange={(e) => setEnquiryFormVal({ ...enquiryFormVal, request: e.target.value })} required />
                </div>
                <button type="submit" disabled={saving} className="glass-button" style={{ padding: '12px', marginTop: '10px' }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Reply Enquiry Modal */}
        {showReplyEnquiryModal && selectedEnquiry && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '24px', border: '1px solid var(--accent-purple)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>💬 Reply to Enquiry</h3>
                <button onClick={() => { setShowReplyEnquiryModal(false); setSelectedEnquiry(null); }} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer Enquiry:</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'white' }}>"{selectedEnquiry.request}"</p>
              </div>
              <form onSubmit={handleReplyEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Type Your Reply Message *</span>
                  <textarea className="glass-input" rows={4} placeholder="Type your response to customer..." value={replyTextVal} onChange={(e) => setReplyTextVal(e.target.value)} required />
                </div>
                <button type="submit" disabled={saving} className="glass-button" style={{ padding: '12px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span>🚀 Send Response & Open WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
