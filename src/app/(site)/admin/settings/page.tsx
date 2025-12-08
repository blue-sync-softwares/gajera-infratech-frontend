'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiGet, apiPost, apiPut, apiUpload } from '@/utils/api';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    logo: { url: '', public_id: '' },
    favicon: { url: '', public_id: '' },
    businessInfo: {
      name: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
      },
      phone: '',
      email: '',
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
      whatsapp: '',
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [] as string[],
    },
    copyright: '© 2025 All rights reserved',
    isActive: true,
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [isExistingSettings, setIsExistingSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch settings on component load
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiGet('/api/v1/website/settings');
      
      if (response.success && response.data && response.data.data) {
        // Populate form with existing data
        setFormData(response.data.data);
        setIsExistingSettings(true);
      } else {
        // No existing settings, keep default values
        setIsExistingSettings(false);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setErrorMessage('Unable to connect to the server. The backend may be down. Please try again later.');
      setIsExistingSettings(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData((prev: any) => {
        const updated = { ...prev };
        let current = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Show loading preview
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        [field]: {
          url: previewUrl,
          public_id: 'uploading...',
        },
      }));

      // Upload to API
      const response = await apiUpload('/api/v1/upload/single', file, 'file');
      
      if (response.success && response.data && response.data.data) {
        // Clean up preview URL before setting new one
        URL.revokeObjectURL(previewUrl);
        
        // Update with actual uploaded image URL
        setFormData((prev) => ({
          ...prev,
          [field]: {
            url: response.data.data.url || response.data.data.secure_url || '',
            public_id: response.data.data.public_id || '',
          },
        }));
        
        console.log('Upload successful:', response.data.data);
      } else {
        // Clean up preview URL on error
        URL.revokeObjectURL(previewUrl);
        alert(`Upload failed: ${response.error || 'Unknown error'}`);
        // Revert to previous state
        setFormData((prev) => ({
          ...prev,
          [field]: {
            url: '',
            public_id: '',
          },
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
      setFormData((prev) => ({
        ...prev,
        [field]: {
          url: '',
          public_id: '',
        },
      }));
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaKeywords: [...prev.seo.metaKeywords, keywordInput.trim()],
        },
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        metaKeywords: prev.seo.metaKeywords.filter((_, i) => i !== index),
      },
    }));
  };

  const handleReset = async () => {
    // Fetch fresh data from API and reset form
    setErrorMessage(null);
    try {
      const response = await apiGet('/api/v1/website/settings');
      
      if (response.success && response.data && response.data.data) {
        setFormData(response.data.data);
      } else {
        // Reset to default values if no data exists
        setFormData({
          title: '',
          tagline: '',
          description: '',
          logo: { url: '', public_id: '' },
          favicon: { url: '', public_id: '' },
          businessInfo: {
            name: '',
            address: {
              street: '',
              city: '',
              state: '',
              pincode: '',
              country: 'India',
            },
            phone: '',
            email: '',
          },
          socialMedia: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
            youtube: '',
            whatsapp: '',
          },
          seo: {
            metaTitle: '',
            metaDescription: '',
            metaKeywords: [] as string[],
          },
          copyright: '© 2025 All rights reserved',
          isActive: true,
        });
      }
      setKeywordInput('');
    } catch (error) {
      console.error('Error resetting form:', error);
      setErrorMessage('Unable to connect to the server. The backend may be down. Please try again later.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      let response;
      
      if (isExistingSettings) {
        // Update existing settings with PUT request
        response = await apiPut('/api/v1/website/settings', formData);
      } else {
        // Create new settings with POST request
        response = await apiPost('/api/v1/website/settings', formData);
      }
      
      if (response.success) {
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSuccessMessage(response.data?.message || 'Settings saved successfully!');
        setIsExistingSettings(true); // Future updates will use PUT
        
        // Optionally refresh data from server
        await fetchSettings();
      } else {
        // Scroll to top to show error message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setErrorMessage(`Failed to save settings: ${response.error || 'Unknown error'}. The backend may be down. Please try again later.`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrorMessage('Unable to connect to the server. The backend may be down. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-darkmode pt-32 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray dark:text-slate-400">Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkmode pt-32 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-primary hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-midnight_text dark:text-white">
            Website Settings
          </h1>
          {!isExistingSettings && (
            <p className="text-sm text-gray dark:text-slate-400 mt-2">
              No existing settings found. Fill in the form to create new settings.
            </p>
          )}
        </div>

        {/* Error Message Popup */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-1">
                  Connection Error
                </h3>
                <p className="text-red-700 dark:text-red-400">
                  {errorMessage}
                </p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="flex-shrink-0 text-red-500 hover:text-red-700 dark:hover:text-red-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              onClick={fetchSettings}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Success Message Popup */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-1">
                  Success
                </h3>
                <p className="text-green-700 dark:text-green-400">
                  {successMessage}
                </p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="flex-shrink-0 text-green-500 hover:text-green-700 dark:hover:text-green-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Website Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter website title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter tagline"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter website description"
                />
              </div>
            </div>
          </div>

          {/* Logo & Favicon */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Branding</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'logo')}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {formData.logo.url && (
                  <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border">
                    <Image 
                      src={formData.logo.url} 
                      alt="Logo preview" 
                      fill 
                      className="object-contain bg-gray-100 dark:bg-gray-700 p-2"
                      unoptimized={formData.logo.url.startsWith('blob:')}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Favicon
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'favicon')}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {formData.favicon.url && (
                  <div className="mt-4 relative w-16 h-16 rounded-lg overflow-hidden border-2 border-border">
                    <Image 
                      src={formData.favicon.url} 
                      alt="Favicon preview" 
                      fill 
                      className="object-contain bg-gray-100 dark:bg-gray-700 p-2"
                      unoptimized={formData.favicon.url.startsWith('blob:')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Business Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessInfo.name"
                  value={formData.businessInfo.name}
                  onChange={handleInputChange}
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter business name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="businessInfo.phone"
                    value={formData.businessInfo.phone}
                    onChange={handleInputChange}
                    pattern="[6-9]\d{9}"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="10-digit phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="businessInfo.email"
                    value={formData.businessInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="businessInfo.address.street"
                  value={formData.businessInfo.address.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="businessInfo.address.city"
                    value={formData.businessInfo.address.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="businessInfo.address.state"
                    value={formData.businessInfo.address.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="businessInfo.address.pincode"
                    value={formData.businessInfo.address.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Pincode"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="businessInfo.address.country"
                    value={formData.businessInfo.address.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Social Media Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  name="socialMedia.facebook"
                  value={formData.socialMedia.facebook}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  name="socialMedia.instagram"
                  value={formData.socialMedia.instagram}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  name="socialMedia.twitter"
                  value={formData.socialMedia.twitter}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://twitter.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="socialMedia.linkedin"
                  value={formData.socialMedia.linkedin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://linkedin.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  name="socialMedia.youtube"
                  value={formData.socialMedia.youtube}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  name="socialMedia.whatsapp"
                  value={formData.socialMedia.whatsapp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="WhatsApp number"
                />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">SEO Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="seo.metaTitle"
                  value={formData.seo.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter meta title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Meta Description
                </label>
                <textarea
                  name="seo.metaDescription"
                  value={formData.seo.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter meta description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Meta Keywords
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    className="flex-1 px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Type keyword and press Enter or click Add"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.seo.metaKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="hover:text-primary/70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Footer Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Copyright Text
                </label>
                <input
                  type="text"
                  name="copyright"
                  value={formData.copyright}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="© 2025 All rights reserved"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-midnight_text dark:text-white">
                  Website is Active
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-midnight_text dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
