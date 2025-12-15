'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiGet, apiPost, apiPut, apiDelete, apiUpload } from '@/utils/api';

// Simple UUID generator
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface GalleryImage {
  image_title: string;
  image_src: {
    url: string;
    public_id: string;
  };
}

interface BusinessStat {
  uniqueKey: string;
  title: string;
  statValue: string;
}

interface CallToActionSection {
  title: string;
  description: string;
  buttonTitle: string;
  isActive: boolean;
}

interface Business {
  _id?: string;
  slug: string;
  business_title: string;
  business_overview: string;
  business_description: string;
  business_tagline: string;
  ctaTitle: string;
  ctaHref: string;
  business_gallery: GalleryImage[];
  business_testimonials: string[];
  project_types: string[];
  project_details: string[];
  hero_image: {
    url: string;
    public_id: string;
  };
  featured_image: {
    url: string;
    public_id: string;
  };
  businessStats: BusinessStat[];
  callToActionSection: CallToActionSection;
  createdAt?: string;
  updatedAt?: string;
}

const emptyFormData: Business = {
  slug: '',
  business_title: '',
  business_overview: '',
  business_description: '',
  business_tagline: '',
  ctaTitle: '',
  ctaHref: '',
  business_gallery: [],
  business_testimonials: [],
  project_types: [],
  project_details: [],
  hero_image: { url: '', public_id: '' },
  featured_image: { url: '', public_id: '' },
  businessStats: [],
  callToActionSection: {
    title: '',
    description: '',
    buttonTitle: '',
    isActive: true,
  },
};

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Business>(emptyFormData);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiGet('/api/v1/business');
      
      if (response.success && response.data && response.data.data) {
        setBusinesses(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setBusinesses([]);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setErrorMessage('Unable to connect to the server. Please try again later.');
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData(emptyFormData);
    setIsEditMode(false);
    setShowForm(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleEdit = async (slug: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiGet(`/api/v1/business/${slug}`);
      
      if (response.success && response.data && response.data.data) {
        setFormData(response.data.data);
        setIsEditMode(true);
        setShowForm(true);
      } else {
        setErrorMessage('Business not found');
      }
    } catch (error) {
      console.error('Error fetching business:', error);
      setErrorMessage('Unable to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData(emptyFormData);
    setIsEditMode(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'hero_image' | 'featured_image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        [field]: { url: previewUrl, public_id: 'uploading...' },
      }));

      const response = await apiUpload('/api/v1/upload/single', file, 'file');
      
      if (response.success && response.data && response.data.data) {
        URL.revokeObjectURL(previewUrl);
        setFormData((prev) => ({
          ...prev,
          [field]: {
            url: response.data.data.url || response.data.data.secure_url || '',
            public_id: response.data.data.public_id || '',
          },
        }));
      } else {
        alert('Upload failed');
        URL.revokeObjectURL(previewUrl);
        setFormData((prev) => ({
          ...prev,
          [field]: { url: '', public_id: '' },
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  };

  // Gallery management
  const addGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      business_gallery: [
        ...prev.business_gallery,
        {
          image_title: '',
          image_src: { url: '', public_id: '' },
        },
      ],
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      business_gallery: prev.business_gallery.filter((_, i) => i !== index),
    }));
  };

  const updateGalleryImage = (index: number, title: string) => {
    const updatedGallery = [...formData.business_gallery];
    updatedGallery[index].image_title = title;
    setFormData((prev) => ({ ...prev, business_gallery: updatedGallery }));
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      const updatedGallery = [...formData.business_gallery];
      updatedGallery[index].image_src = { url: previewUrl, public_id: 'uploading...' };
      setFormData((prev) => ({ ...prev, business_gallery: updatedGallery }));

      const response = await apiUpload('/api/v1/upload/single', file, 'file');
      
      if (response.success && response.data && response.data.data) {
        URL.revokeObjectURL(previewUrl);
        updatedGallery[index].image_src = {
          url: response.data.data.url || response.data.data.secure_url || '',
          public_id: response.data.data.public_id || '',
        };
        setFormData((prev) => ({ ...prev, business_gallery: updatedGallery }));
      } else {
        alert('Upload failed');
        URL.revokeObjectURL(previewUrl);
        updatedGallery[index].image_src = { url: '', public_id: '' };
        setFormData((prev) => ({ ...prev, business_gallery: updatedGallery }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  };

  // Business Stats management
  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      businessStats: [
        ...prev.businessStats,
        {
          uniqueKey: generateUUID(),
          title: '',
          statValue: '',
        },
      ],
    }));
  };

  const removeStat = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      businessStats: prev.businessStats.filter((_, i) => i !== index),
    }));
  };

  const updateStat = (index: number, field: keyof BusinessStat, value: string) => {
    const updatedStats = [...formData.businessStats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setFormData((prev) => ({ ...prev, businessStats: updatedStats }));
  };

  // Project Types management
  const addProjectType = () => {
    setFormData((prev) => ({
      ...prev,
      project_types: [...prev.project_types, ''],
    }));
  };

  const removeProjectType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      project_types: prev.project_types.filter((_, i) => i !== index),
    }));
  };

  const updateProjectType = (index: number, value: string) => {
    const updatedTypes = [...formData.project_types];
    updatedTypes[index] = value;
    setFormData((prev) => ({ ...prev, project_types: updatedTypes }));
  };

  const updateCallToAction = (field: keyof CallToActionSection, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      callToActionSection: {
        ...prev.callToActionSection,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      let response;
      
      if (isEditMode) {
        response = await apiPut(`/api/v1/business/${formData.slug}`, formData);
      } else {
        response = await apiPost('/api/v1/business', formData);
      }
      
      if (response.success) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSuccessMessage(response.data?.message || 'Business saved successfully!');
        await fetchBusinesses();
        setTimeout(() => {
          handleCloseForm();
        }, 1500);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setErrorMessage(`Failed to save: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrorMessage('Unable to connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiDelete(`/api/v1/business/${slug}`);
      
      if (response.success) {
        setSuccessMessage(`Business "${title}" deleted successfully!`);
        await fetchBusinesses();
        if (showForm && formData.slug === slug) {
          handleCloseForm();
        }
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(`Failed to delete: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage('Unable to connect to the server. Please try again later.');
    }
  };

  if (isLoading && !showForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-darkmode pt-32 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray dark:text-slate-400">Loading businesses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkmode pt-32 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-primary hover:underline mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-midnight_text dark:text-white">
              Business Management
            </h1>
          </div>
          {!showForm && (
            <button 
              onClick={handleAddNew}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              + Add New Business
            </button>
          )}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-1">Error</h3>
                <p className="text-red-700 dark:text-red-400">{errorMessage}</p>
              </div>
              <button onClick={() => setErrorMessage(null)} className="flex-shrink-0 text-red-500 hover:text-red-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-1">Success</h3>
                <p className="text-green-700 dark:text-green-400">{successMessage}</p>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="flex-shrink-0 text-green-500 hover:text-green-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Business Form */}
        {showForm ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-border/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white">
                {isEditMode ? 'Edit Business' : 'Add New Business'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-midnight_text dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Slug * {isEditMode && <span className="text-xs text-gray">(Cannot be changed)</span>}
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  disabled={isEditMode}
                  pattern="[a-z0-9-]+"
                  required
                  placeholder="business-slug"
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
                <p className="text-xs text-gray mt-1">Only lowercase letters, numbers, and hyphens allowed</p>
              </div>

              {/* Business Title */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Business Title * (Max 150 characters)
                </label>
                <input
                  type="text"
                  name="business_title"
                  value={formData.business_title}
                  onChange={handleInputChange}
                  maxLength={150}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Business Overview */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Business Overview * (Max 700 characters)
                </label>
                <textarea
                  name="business_overview"
                  value={formData.business_overview}
                  onChange={handleInputChange}
                  maxLength={700}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Business Description */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Business Description *
                </label>
                <textarea
                  name="business_description"
                  value={formData.business_description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Business Tagline */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Business Tagline (Max 200 characters)
                </label>
                <input
                  type="text"
                  name="business_tagline"
                  value={formData.business_tagline}
                  onChange={handleInputChange}
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* CTA Title */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  CTA Title (Max 100 characters)
                </label>
                <input
                  type="text"
                  name="ctaTitle"
                  value={formData.ctaTitle}
                  onChange={handleInputChange}
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* CTA Href */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  CTA Link
                </label>
                <input
                  type="text"
                  name="ctaHref"
                  value={formData.ctaHref}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Hero Image */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Hero Image *
                </label>
                {formData.hero_image.url && (
                  <div className="mb-3">
                    <Image
                      src={formData.hero_image.url}
                      alt="Hero"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'hero_image')}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Featured Image *
                </label>
                {formData.featured_image.url && (
                  <div className="mb-3">
                    <Image
                      src={formData.featured_image.url}
                      alt="Featured"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'featured_image')}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                />
              </div>

              {/* Business Gallery */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-midnight_text dark:text-white">
                    Business Gallery
                  </label>
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    + Add Image
                  </button>
                </div>
                {formData.business_gallery.map((img, index) => (
                  <div key={index} className="mb-4 p-4 border border-border dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-midnight_text dark:text-white">
                        Image {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={img.image_title}
                      onChange={(e) => updateGalleryImage(index, e.target.value)}
                      placeholder="Image Title"
                      className="w-full px-4 py-2 mb-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                    {img.image_src.url && (
                      <div className="mb-2">
                        <Image
                          src={img.image_src.url}
                          alt={img.image_title}
                          width={200}
                          height={150}
                          className="rounded-lg object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleGalleryImageUpload(e, index)}
                      className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                  </div>
                ))}
              </div>

              {/* Project Types */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-midnight_text dark:text-white">
                    Project Types
                  </label>
                  <button
                    type="button"
                    onClick={addProjectType}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    + Add Type
                  </button>
                </div>
                {formData.project_types.map((type, index) => (
                  <div key={index} className="mb-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={type}
                      onChange={(e) => updateProjectType(index, e.target.value)}
                      placeholder="Project Type"
                      className="flex-1 px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeProjectType(index)}
                      className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Business Stats */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-midnight_text dark:text-white">
                    Business Statistics
                  </label>
                  <button
                    type="button"
                    onClick={addStat}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    + Add Stat
                  </button>
                </div>
                {formData.businessStats.map((stat, index) => (
                  <div key={stat.uniqueKey} className="mb-4 p-4 border border-border dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-midnight_text dark:text-white">
                        Stat {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeStat(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={stat.title}
                      onChange={(e) => updateStat(index, 'title', e.target.value)}
                      placeholder="Stat Title"
                      className="w-full px-4 py-2 mb-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                    <input
                      type="text"
                      value={stat.statValue}
                      onChange={(e) => updateStat(index, 'statValue', e.target.value)}
                      placeholder="Stat Value"
                      className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                  </div>
                ))}
              </div>

              {/* Call To Action Section */}
              <div className="p-4 border-2 border-primary/30 rounded-lg">
                <h3 className="text-lg font-semibold text-midnight_text dark:text-white mb-4">
                  Call To Action Section
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                      Title (Max 150 characters)
                    </label>
                    <input
                      type="text"
                      value={formData.callToActionSection.title}
                      onChange={(e) => updateCallToAction('title', e.target.value)}
                      maxLength={150}
                      className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                      Description (Max 500 characters)
                    </label>
                    <textarea
                      value={formData.callToActionSection.description}
                      onChange={(e) => updateCallToAction('description', e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                      Button Title (Max 50 characters)
                    </label>
                    <input
                      type="text"
                      value={formData.callToActionSection.buttonTitle}
                      onChange={(e) => updateCallToAction('buttonTitle', e.target.value)}
                      maxLength={50}
                      className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.callToActionSection.isActive}
                      onChange={(e) => updateCallToAction('isActive', e.target.checked)}
                      className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                    />
                    <label className="text-sm font-medium text-midnight_text dark:text-white">
                      Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-4 pt-6 border-t border-border dark:border-gray-600">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Business' : 'Create Business')}
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-midnight_text dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Business List */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-border/50">
            {businesses.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray dark:text-slate-300 mb-4">
                  No businesses found. Click "Add New Business" to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">
                        Business
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">
                        Slug
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">
                        Tagline
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">
                        Last Updated
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-midnight_text dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-gray-700">
                    {businesses.map((business) => (
                      <tr key={business._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleEdit(business.slug)}>
                          <div className="font-medium text-midnight_text dark:text-white">
                            {business.business_title}
                          </div>
                          <div className="text-sm text-gray dark:text-slate-400 line-clamp-1">
                            {business.business_overview}
                          </div>
                        </td>
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleEdit(business.slug)}>
                          <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {business.slug}
                          </code>
                        </td>
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleEdit(business.slug)}>
                          <div className="text-sm text-gray dark:text-slate-300 line-clamp-1">
                            {business.business_tagline || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleEdit(business.slug)}>
                          <div className="text-sm text-gray dark:text-slate-400">
                            {new Date(business.updatedAt || '').toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(business.slug);
                              }}
                              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(business.slug, business.business_title);
                              }}
                              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Delete
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
        )}
      </div>
    </div>
  );
}
