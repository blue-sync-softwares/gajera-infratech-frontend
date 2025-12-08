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

interface Feature {
  key: string;
  title: string;
  description: string;
  image: {
    url: string;
    public_id: string;
  };
}

interface Metric {
  key: string;
  title: string;
  metricValue: string;
}

interface HomeSettings {
  heroTitle: string;
  heroDescription: string;
  featuredProjects: string[];
  featureTitle: string;
  featureDescription: string;
  features: Feature[];
  legacyTitle: string;
  legacyDescription: string;
  legacyAwardTitle: string;
  legacyAwardYears: string;
  topTestimonial: string[];
  metrics: Metric[];
  isActive: boolean;
}

export default function HomeContentPage() {
  const [formData, setFormData] = useState<HomeSettings>({
    heroTitle: '',
    heroDescription: '',
    featuredProjects: [],
    featureTitle: '',
    featureDescription: '',
    features: [],
    legacyTitle: '',
    legacyDescription: '',
    legacyAwardTitle: '',
    legacyAwardYears: '',
    topTestimonial: [],
    metrics: [],
    isActive: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExistingData, setIsExistingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  
  // Dropdown data (will be fetched from APIs)
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);

  useEffect(() => {
    if (!hasFetched) {
      fetchHomeSettings();
      setHasFetched(true);
      // TODO: Fetch projects and testimonials lists
    }
  }, [hasFetched]);

  const fetchHomeSettings = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiGet('/api/v1/website/home-settings');
      
      if (response.success && response.data && response.data.data) {
        setFormData(response.data.data);
        setIsExistingData(true);
      } else {
        setIsExistingData(false);
      }
    } catch (error) {
      console.error('Error fetching home settings:', error);
      setErrorMessage('Unable to connect to the server. Please try again later.');
      setIsExistingData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, featureIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      const updatedFeatures = [...formData.features];
      updatedFeatures[featureIndex].image = {
        url: previewUrl,
        public_id: 'uploading...',
      };
      setFormData((prev) => ({ ...prev, features: updatedFeatures }));

      const response = await apiUpload('/api/v1/upload/single', file, 'file');
      
      if (response.success && response.data && response.data.data) {
        URL.revokeObjectURL(previewUrl);
        updatedFeatures[featureIndex].image = {
          url: response.data.data.url || response.data.data.secure_url || '',
          public_id: response.data.data.public_id || '',
        };
        setFormData((prev) => ({ ...prev, features: updatedFeatures }));
      } else {
        alert('Upload failed');
        URL.revokeObjectURL(previewUrl);
        updatedFeatures[featureIndex].image = { url: '', public_id: '' };
        setFormData((prev) => ({ ...prev, features: updatedFeatures }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  };

  const addFeature = () => {
    if (formData.features.length >= 3) {
      alert('Maximum 3 features allowed');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          key: generateUUID(),
          title: '',
          description: '',
          image: { url: '', public_id: '' },
        },
      ],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setFormData((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const addMetric = () => {
    if (formData.metrics.length >= 3) {
      alert('Maximum 3 metrics allowed');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      metrics: [
        ...prev.metrics,
        {
          key: generateUUID(),
          title: '',
          metricValue: '',
        },
      ],
    }));
  };

  const removeMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index),
    }));
  };

  const updateMetric = (index: number, field: string, value: string) => {
    const updatedMetrics = [...formData.metrics];
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
    setFormData((prev) => ({ ...prev, metrics: updatedMetrics }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      let response;
      
      if (isExistingData) {
        response = await apiPut('/api/v1/website/home-settings', formData);
      } else {
        response = await apiPost('/api/v1/website/home-settings', formData);
      }
      
      if (response.success) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSuccessMessage(response.data?.message || 'Home settings saved successfully!');
        setIsExistingData(true);
        await fetchHomeSettings();
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete all home settings? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiDelete('/api/v1/website/home-settings');
      
      if (response.success) {
        setSuccessMessage('Home settings deleted successfully!');
        setIsExistingData(false);
        setFormData({
          heroTitle: '',
          heroDescription: '',
          featuredProjects: [],
          featureTitle: '',
          featureDescription: '',
          features: [],
          legacyTitle: '',
          legacyDescription: '',
          legacyAwardTitle: '',
          legacyAwardYears: '',
          topTestimonial: [],
          metrics: [],
          isActive: true,
        });
      } else {
        setErrorMessage(`Failed to delete: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage('Unable to connect to the server. Please try again later.');
    }
  };

  const handleReset = async () => {
    setErrorMessage(null);
    await fetchHomeSettings();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-darkmode pt-32 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray dark:text-slate-400">Loading home settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkmode pt-32 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/admin/content" className="text-primary hover:underline mb-2 inline-block">
            ← Back to Content Management
          </Link>
          <h1 className="text-4xl font-bold text-midnight_text dark:text-white">
            Home Page Settings
          </h1>
          {!isExistingData && (
            <p className="text-sm text-gray dark:text-slate-400 mt-2">
              No existing settings found. Fill in the form to create new home settings.
            </p>
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hero Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Hero Section</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Hero Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle}
                  onChange={handleInputChange}
                  maxLength={200}
                  required
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="Enter hero title (max 200 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Hero Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="heroDescription"
                  value={formData.heroDescription}
                  onChange={handleInputChange}
                  maxLength={500}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="Enter hero description (max 500 characters)"
                />
              </div>
            </div>
          </div>

          {/* Featured Projects Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Featured Projects</h2>
            <p className="text-sm text-gray dark:text-slate-400 mb-4">
              Select projects to display in the featured section (Dropdown integration pending)
            </p>
            {/* TODO: Multi-select dropdown for projects */}
          </div>

          {/* Features Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Features Section</h2>
            
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Feature Section Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="featureTitle"
                  value={formData.featureTitle}
                  onChange={handleInputChange}
                  maxLength={200}
                  required
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="Enter feature section title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Feature Section Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="featureDescription"
                  value={formData.featureDescription}
                  onChange={handleInputChange}
                  maxLength={500}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="Enter feature section description"
                />
              </div>
            </div>

            <div className="border-t border-border dark:border-gray-700 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-midnight_text dark:text-white">
                  Features (Max 3)
                </h3>
                <button
                  type="button"
                  onClick={addFeature}
                  disabled={formData.features.length >= 3}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Feature
                </button>
              </div>

              <div className="space-y-6">
                {formData.features.map((feature, index) => (
                  <div key={feature.key} className="p-6 border border-border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-md font-semibold text-midnight_text dark:text-white">
                        Feature {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => updateFeature(index, 'title', e.target.value)}
                          maxLength={100}
                          required
                          className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                          placeholder="Feature title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => updateFeature(index, 'description', e.target.value)}
                          maxLength={300}
                          required
                          rows={3}
                          className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                          placeholder="Feature description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                          Image <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFeatureImageUpload(e, index)}
                          className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        />
                        {feature.image.url && (
                          <div className="mt-3">
                            <Image
                              src={feature.image.url}
                              alt={feature.title || 'Feature image'}
                              width={200}
                              height={150}
                              className="rounded-lg object-cover"
                              unoptimized={feature.image.url.startsWith('blob:')}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {formData.features.length === 0 && (
                  <p className="text-gray dark:text-slate-400 text-center py-8">
                    No features added yet. Click "Add Feature" to get started.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Legacy Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Legacy Section</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Legacy Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="legacyTitle"
                  value={formData.legacyTitle}
                  onChange={handleInputChange}
                  maxLength={200}
                  required
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="Enter legacy title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Legacy Description
                </label>
                <textarea
                  name="legacyDescription"
                  value={formData.legacyDescription}
                  onChange={handleInputChange}
                  maxLength={1000}
                  rows={4}
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="Enter legacy description (max 1000 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Award Title
                </label>
                <input
                  type="text"
                  name="legacyAwardTitle"
                  value={formData.legacyAwardTitle}
                  onChange={handleInputChange}
                  maxLength={100}
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="Award title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Award Years
                </label>
                <input
                  type="text"
                  name="legacyAwardYears"
                  value={formData.legacyAwardYears}
                  onChange={handleInputChange}
                  maxLength={50}
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="e.g., 2020-2024"
                />
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Top Testimonials</h2>
            <p className="text-sm text-gray dark:text-slate-400 mb-4">
              Select testimonials to display (Dropdown integration pending)
            </p>
            {/* TODO: Multi-select dropdown for testimonials */}
          </div>

          {/* Metrics Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Metrics Section</h2>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-midnight_text dark:text-white">
                Metrics (Max 3)
              </h3>
              <button
                type="button"
                onClick={addMetric}
                disabled={formData.metrics.length >= 3}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Metric
              </button>
            </div>

            <div className="space-y-4">
              {formData.metrics.map((metric, index) => (
                <div key={metric.key} className="p-4 border border-border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-md font-semibold text-midnight_text dark:text-white">
                      Metric {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeMetric(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={metric.title}
                        onChange={(e) => updateMetric(index, 'title', e.target.value)}
                        maxLength={100}
                        required
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="e.g., Projects Completed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Value <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={metric.metricValue}
                        onChange={(e) => updateMetric(index, 'metricValue', e.target.value)}
                        maxLength={50}
                        required
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="e.g., 100+"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.metrics.length === 0 && (
                <p className="text-gray dark:text-slate-400 text-center py-8">
                  No metrics added yet. Click "Add Metric" to get started.
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Status</h2>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                />
                <span className="ml-3 text-midnight_text dark:text-white font-medium">
                  Active
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border-2 border-border dark:border-gray-600 text-midnight_text dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
            
            {isExistingData && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete All Settings
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isExistingData ? 'Update Settings' : 'Create Settings'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
