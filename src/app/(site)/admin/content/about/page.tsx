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

interface Value {
  uniqueKey: string;
  title: string;
  description: string;
}

interface History {
  year: number;
  title: string;
  description: string;
}

interface CompanyStatistic {
  uniqueKey: string;
  title: string;
  statValue: string;
}

interface LeadershipDetail {
  uniqueKey: string;
  name: string;
  designation: string;
  profileImage: {
    url: string;
    public_id: string;
  };
}

interface AboutUsSettings {
  heroDescription: string;
  missionStatement: string;
  missionDescription: string;
  values: Value[];
  history: History[];
  companyStatistics: CompanyStatistic[];
  leadershipDetails: LeadershipDetail[];
  featuredTestimonial: string;
}

export default function AboutContentPage() {
  const [formData, setFormData] = useState<AboutUsSettings>({
    heroDescription: '',
    missionStatement: '',
    missionDescription: '',
    values: [],
    history: [],
    companyStatistics: [],
    leadershipDetails: [],
    featuredTestimonial: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExistingData, setIsExistingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched) {
      fetchAboutSettings();
      setHasFetched(true);
    }
  }, [hasFetched]);

  const fetchAboutSettings = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiGet('/api/v1/website/about-us-settings');
      
      if (response.success && response.data && response.data.data) {
        setFormData(response.data.data);
        setIsExistingData(true);
      } else {
        setIsExistingData(false);
      }
    } catch (error) {
      console.error('Error fetching about settings:', error);
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

  // Values management
  const addValue = () => {
    if (formData.values.length >= 4) {
      alert('Maximum 4 values allowed');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      values: [
        ...prev.values,
        {
          uniqueKey: generateUUID(),
          title: '',
          description: '',
        },
      ],
    }));
  };

  const removeValue = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  const updateValue = (index: number, field: keyof Value, value: string) => {
    const updatedValues = [...formData.values];
    updatedValues[index] = { ...updatedValues[index], [field]: value };
    setFormData((prev) => ({ ...prev, values: updatedValues }));
  };

  // History management
  const addHistory = () => {
    setFormData((prev) => ({
      ...prev,
      history: [
        ...prev.history,
        {
          year: new Date().getFullYear(),
          title: '',
          description: '',
        },
      ],
    }));
  };

  const removeHistory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      history: prev.history.filter((_, i) => i !== index),
    }));
  };

  const updateHistory = (index: number, field: keyof History, value: string | number) => {
    const updatedHistory = [...formData.history];
    updatedHistory[index] = { ...updatedHistory[index], [field]: value };
    setFormData((prev) => ({ ...prev, history: updatedHistory }));
  };

  // Company Statistics management
  const addStatistic = () => {
    setFormData((prev) => ({
      ...prev,
      companyStatistics: [
        ...prev.companyStatistics,
        {
          uniqueKey: generateUUID(),
          title: '',
          statValue: '',
        },
      ],
    }));
  };

  const removeStatistic = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      companyStatistics: prev.companyStatistics.filter((_, i) => i !== index),
    }));
  };

  const updateStatistic = (index: number, field: keyof CompanyStatistic, value: string) => {
    const updatedStats = [...formData.companyStatistics];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setFormData((prev) => ({ ...prev, companyStatistics: updatedStats }));
  };

  // Leadership Details management
  const addLeader = () => {
    setFormData((prev) => ({
      ...prev,
      leadershipDetails: [
        ...prev.leadershipDetails,
        {
          uniqueKey: generateUUID(),
          name: '',
          designation: '',
          profileImage: { url: '', public_id: '' },
        },
      ],
    }));
  };

  const removeLeader = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      leadershipDetails: prev.leadershipDetails.filter((_, i) => i !== index),
    }));
  };

  const updateLeader = (index: number, field: keyof LeadershipDetail, value: string) => {
    const updatedLeaders = [...formData.leadershipDetails];
    updatedLeaders[index] = { ...updatedLeaders[index], [field]: value };
    setFormData((prev) => ({ ...prev, leadershipDetails: updatedLeaders }));
  };

  const handleLeaderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, leaderIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      const updatedLeaders = [...formData.leadershipDetails];
      updatedLeaders[leaderIndex].profileImage = {
        url: previewUrl,
        public_id: 'uploading...',
      };
      setFormData((prev) => ({ ...prev, leadershipDetails: updatedLeaders }));

      const response = await apiUpload('/api/v1/upload/single', file, 'file');
      
      if (response.success && response.data && response.data.data) {
        URL.revokeObjectURL(previewUrl);
        updatedLeaders[leaderIndex].profileImage = {
          url: response.data.data.url || response.data.data.secure_url || '',
          public_id: response.data.data.public_id || '',
        };
        setFormData((prev) => ({ ...prev, leadershipDetails: updatedLeaders }));
      } else {
        alert('Upload failed');
        URL.revokeObjectURL(previewUrl);
        updatedLeaders[leaderIndex].profileImage = { url: '', public_id: '' };
        setFormData((prev) => ({ ...prev, leadershipDetails: updatedLeaders }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      let response;
      
      if (isExistingData) {
        response = await apiPut('/api/v1/website/about-us-settings', formData);
      } else {
        response = await apiPost('/api/v1/website/about-us-settings', formData);
      }
      
      if (response.success) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSuccessMessage(response.data?.message || 'About settings saved successfully!');
        setIsExistingData(true);
        await fetchAboutSettings();
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
    if (!confirm('Are you sure you want to delete all about settings? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiDelete('/api/v1/website/about-us-settings');
      
      if (response.success) {
        setSuccessMessage('About settings deleted successfully!');
        setIsExistingData(false);
        setFormData({
          heroDescription: '',
          missionStatement: '',
          missionDescription: '',
          values: [],
          history: [],
          companyStatistics: [],
          leadershipDetails: [],
          featuredTestimonial: '',
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
    await fetchAboutSettings();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-darkmode pt-32 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray dark:text-slate-400">Loading about settings...</p>
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
            About Us Page Settings
          </h1>
          {!isExistingData && (
            <p className="text-sm text-gray dark:text-slate-400 mt-2">
              No existing settings found. Fill in the form to create new about settings.
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

          {/* Mission Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Mission</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Mission Statement <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="missionStatement"
                  value={formData.missionStatement}
                  onChange={handleInputChange}
                  maxLength={200}
                  required
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="Enter mission statement (max 200 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Mission Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="missionDescription"
                  value={formData.missionDescription}
                  onChange={handleInputChange}
                  maxLength={1000}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="Enter mission description (max 1000 characters)"
                />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white">Core Values (Max 4)</h2>
              <button
                type="button"
                onClick={addValue}
                disabled={formData.values.length >= 4}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Value
              </button>
            </div>

            <div className="space-y-6">
              {formData.values.map((value, index) => (
                <div key={value.uniqueKey} className="p-6 border border-border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-midnight_text dark:text-white">
                      Value {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeValue(index)}
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
                        value={value.title}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        maxLength={100}
                        required
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="Value title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={value.description}
                        onChange={(e) => updateValue(index, 'description', e.target.value)}
                        maxLength={500}
                        required
                        rows={3}
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="Value description"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.values.length === 0 && (
                <p className="text-gray dark:text-slate-400 text-center py-8">
                  No values added yet. Click "Add Value" to get started.
                </p>
              )}
            </div>
          </div>

          {/* History Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white">Company History</h2>
              <button
                type="button"
                onClick={addHistory}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                + Add History Entry
              </button>
            </div>

            <div className="space-y-6">
              {formData.history.map((entry, index) => (
                <div key={index} className="p-6 border border-border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-midnight_text dark:text-white">
                      History Entry {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeHistory(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={entry.year}
                        onChange={(e) => updateHistory(index, 'year', parseInt(e.target.value))}
                        min={1900}
                        max={new Date().getFullYear() + 10}
                        required
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(e) => updateHistory(index, 'title', e.target.value)}
                        maxLength={100}
                        required
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="History title"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={entry.description}
                        onChange={(e) => updateHistory(index, 'description', e.target.value)}
                        maxLength={500}
                        required
                        rows={3}
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="History description"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.history.length === 0 && (
                <p className="text-gray dark:text-slate-400 text-center py-8">
                  No history entries added yet. Click "Add History Entry" to get started.
                </p>
              )}
            </div>
          </div>

          {/* Company Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white">Company Statistics</h2>
              <button
                type="button"
                onClick={addStatistic}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                + Add Statistic
              </button>
            </div>

            <div className="space-y-4">
              {formData.companyStatistics.map((stat, index) => (
                <div key={stat.uniqueKey} className="p-4 border border-border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-md font-semibold text-midnight_text dark:text-white">
                      Statistic {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeStatistic(index)}
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
                        value={stat.title}
                        onChange={(e) => updateStatistic(index, 'title', e.target.value)}
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
                        value={stat.statValue}
                        onChange={(e) => updateStatistic(index, 'statValue', e.target.value)}
                        maxLength={50}
                        required
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="e.g., 500+"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.companyStatistics.length === 0 && (
                <p className="text-gray dark:text-slate-400 text-center py-8">
                  No statistics added yet. Click "Add Statistic" to get started.
                </p>
              )}
            </div>
          </div>

          {/* Leadership Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white">Leadership Team</h2>
              <button
                type="button"
                onClick={addLeader}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                + Add Leader
              </button>
            </div>

            <div className="space-y-6">
              {formData.leadershipDetails.map((leader, index) => (
                <div key={leader.uniqueKey} className="p-6 border border-border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-midnight_text dark:text-white">
                      Leader {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeLeader(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={leader.name}
                        onChange={(e) => updateLeader(index, 'name', e.target.value)}
                        maxLength={100}
                        required
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="Leader name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={leader.designation}
                        onChange={(e) => updateLeader(index, 'designation', e.target.value)}
                        maxLength={100}
                        required
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="e.g., CEO, CTO"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Profile Image <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLeaderImageUpload(e, index)}
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                      />
                      {leader.profileImage.url && (
                        <div className="mt-3">
                          <Image
                            src={leader.profileImage.url}
                            alt={leader.name || 'Leader image'}
                            width={150}
                            height={150}
                            className="rounded-lg object-cover"
                            unoptimized={leader.profileImage.url.startsWith('blob:')}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {formData.leadershipDetails.length === 0 && (
                <p className="text-gray dark:text-slate-400 text-center py-8">
                  No leaders added yet. Click "Add Leader" to get started.
                </p>
              )}
            </div>
          </div>

          {/* Featured Testimonial */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Featured Testimonial</h2>
            <p className="text-sm text-gray dark:text-slate-400 mb-4">
              Select a featured testimonial (Dropdown integration pending)
            </p>
            {/* TODO: Dropdown for testimonial selection */}
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
