'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiGet, apiPost, apiPut, apiDelete, apiUpload } from '@/utils/api';

interface Testimonial {
  _id?: string;
  testimonial_id?: string;
  project_slug: string;
  business_slug: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Business {
  slug: string;
  business_title: string;
}

interface Project {
  slug: string;
  project_name: string;
  business_name_slug: string;
}

const emptyFormData: Testimonial = {
  project_slug: '',
  business_slug: '',
  name: '',
  image: { url: '', public_id: '' },
  message: '',
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Testimonial>(emptyFormData);

  useEffect(() => {
    fetchTestimonials();
    fetchBusinesses();
    fetchProjects();
  }, []);

  useEffect(() => {
    // Filter projects based on selected business
    if (formData.business_slug) {
      const filtered = allProjects.filter(p => p.business_name_slug === formData.business_slug);
      setFilteredProjects(filtered);
      
      // Clear project_slug if it doesn't belong to the selected business
      if (formData.project_slug && !filtered.some(p => p.slug === formData.project_slug)) {
        setFormData(prev => ({ ...prev, project_slug: '' }));
      }
    } else {
      setFilteredProjects([]);
      setFormData(prev => ({ ...prev, project_slug: '' }));
    }
  }, [formData.business_slug, allProjects]);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiGet('/api/v1/testimonial');
      
      if (response.success && response.data && response.data.data) {
        setTestimonials(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setErrorMessage('Unable to connect to the server. Please try again later.');
      setTestimonials([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const response = await apiGet('/api/v1/business');
      
      if (response.success && response.data && response.data.data) {
        const businessList = Array.isArray(response.data.data) ? response.data.data : [];
        setBusinesses(businessList.map((b: any) => ({ 
          slug: b.slug, 
          business_title: b.business_title 
        })));
      } else {
        setBusinesses([]);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await apiGet('/api/v1/project');
      
      if (response.success && response.data && response.data.data) {
        const projectList = Array.isArray(response.data.data) ? response.data.data : [];
        setAllProjects(projectList.map((p: any) => ({ 
          slug: p.slug, 
          project_name: p.project_name,
          business_name_slug: p.business_name_slug
        })));
      } else {
        setAllProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setAllProjects([]);
    }
  };

  const handleAddNew = () => {
    setFormData(emptyFormData);
    setIsEditMode(false);
    setShowForm(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleEdit = async (id: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiGet(`/api/v1/testimonial/${id}`);
      
      if (response.success && response.data && response.data.data) {
        setFormData(response.data.data);
        setIsEditMode(true);
        setShowForm(true);
      } else {
        setErrorMessage('Testimonial not found');
      }
    } catch (error) {
      console.error('Error fetching testimonial:', error);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: { url: previewUrl, public_id: 'uploading...' },
      }));

      const response = await apiUpload('/api/v1/upload/single', file, 'file');
      
      if (response.success && response.data && response.data.data) {
        URL.revokeObjectURL(previewUrl);
        setFormData((prev) => ({
          ...prev,
          image: {
            url: response.data.data.url || response.data.data.secure_url || '',
            public_id: response.data.data.public_id || '',
          },
        }));
      } else {
        alert('Upload failed');
        URL.revokeObjectURL(previewUrl);
        setFormData((prev) => ({
          ...prev,
          image: { url: '', public_id: '' },
        }));
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
      
      if (isEditMode && formData._id) {
        response = await apiPut(`/api/v1/testimonial/${formData._id}`, formData);
      } else {
        response = await apiPost('/api/v1/testimonial', formData);
      }
      
      if (response.success) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSuccessMessage(response.data?.message || 'Testimonial saved successfully!');
        await fetchTestimonials();
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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete testimonial from "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiDelete(`/api/v1/testimonial/${id}`);
      
      if (response.success) {
        setSuccessMessage(`Testimonial from "${name}" deleted successfully!`);
        await fetchTestimonials();
        if (showForm && formData._id === id) {
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
              <p className="text-gray dark:text-slate-400">Loading testimonials...</p>
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
              Testimonials Management
            </h1>
          </div>
          {!showForm && (
            <button 
              onClick={handleAddNew}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              + Add New Testimonial
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

        {/* Testimonial Form */}
        {showForm ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-border/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white">
                {isEditMode ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-midnight_text dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Name * (Max 100 characters)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  maxLength={100}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Business Selection */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Business *
                </label>
                <select
                  name="business_slug"
                  value={formData.business_slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, business_slug: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a business</option>
                  {businesses.map((business) => (
                    <option key={business.slug} value={business.slug}>
                      {business.business_title}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray mt-1">Select the business first to filter projects</p>
              </div>

              {/* Project Selection */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Project (Optional)
                </label>
                <select
                  name="project_slug"
                  value={formData.project_slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, project_slug: e.target.value }))}
                  disabled={!formData.business_slug}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  <option value="">Select a project (optional)</option>
                  {filteredProjects.map((project) => (
                    <option key={project.slug} value={project.slug}>
                      {project.project_name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray mt-1">
                  {formData.business_slug 
                    ? `Showing projects for selected business only` 
                    : 'Select a business first to see projects'}
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Message * (Max 1000 characters)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  maxLength={1000}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray mt-1">{formData.message.length}/1000 characters</p>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Profile Image (Optional)
                </label>
                {formData.image.url && (
                  <div className="mb-3">
                    <Image
                      src={formData.image.url}
                      alt={formData.name}
                      width={150}
                      height={150}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-4 pt-6 border-t border-border dark:border-gray-600">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Testimonial' : 'Create Testimonial')}
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
          /* Testimonial List */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-border/50">
            {testimonials.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray dark:text-slate-300 mb-4">
                  No testimonials found. Click "Add New Testimonial" to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">
                        Business
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">
                        Project
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">
                        Message
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-midnight_text dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-gray-700">
                    {testimonials.map((testimonial) => (
                      <tr key={testimonial._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleEdit(testimonial._id!)}>
                          <div className="flex items-center gap-3">
                            {testimonial.image.url && (
                              <Image
                                src={testimonial.image.url}
                                alt={testimonial.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                                unoptimized
                              />
                            )}
                            <div className="font-medium text-midnight_text dark:text-white">
                              {testimonial.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleEdit(testimonial._id!)}>
                          <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {testimonial.business_slug || '-'}
                          </code>
                        </td>
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleEdit(testimonial._id!)}>
                          <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {testimonial.project_slug || '-'}
                          </code>
                        </td>
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleEdit(testimonial._id!)}>
                          <div className="text-sm text-gray dark:text-slate-300 line-clamp-2 max-w-md">
                            {testimonial.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(testimonial._id!);
                              }}
                              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(testimonial._id!, testimonial.name);
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
