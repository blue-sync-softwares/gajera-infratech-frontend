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

interface ProjectImage {
  ranking: number;
  url: string;
  public_id: string;
}

interface ProjectDetail {
  image: {
    url: string;
    public_id: string;
  };
  title: string;
  description: string;
}

interface ProjectDocument {
  uniqueKey?: string;
  image: {
    url: string;
    public_id: string;
  };
  title: string;
  description: string;
  file_name: string;
  file_link: {
    url: string;
    public_id: string;
  };
  button_title: string;
  download_message: string;
}

interface Project {
  _id?: string;
  project_id?: string;
  business_name_slug: string;
  project_name: string;
  project_description: string;
  project_type: string;
  project_features: string[];
  project_images: ProjectImage[];
  slug: string;
  hero_image: {
    url: string;
    public_id: string;
  };
  project_detail: ProjectDetail;
  project_document: ProjectDocument[];
  createdAt?: string;
  updatedAt?: string;
}

const emptyFormData: Project = {
  business_name_slug: '',
  project_name: '',
  project_description: '',
  project_type: '',
  project_features: [],
  project_images: [],
  slug: '',
  hero_image: { url: '', public_id: '' },
  project_detail: {
    image: { url: '', public_id: '' },
    title: '',
    description: '',
  },
  project_document: [],
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [businesses, setBusinesses] = useState<{ slug: string; business_title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Project>(emptyFormData);

  useEffect(() => {
    fetchProjects();
    fetchBusinesses();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiGet('/api/v1/project');
      
      if (response.success && response.data && response.data.data) {
        setProjects(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setErrorMessage('Unable to connect to the server. Please try again later.');
      setProjects([]);
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
      const response = await apiGet(`/api/v1/project/${slug}`);
      
      if (response.success && response.data && response.data.data) {
        // Add uniqueKey to documents if not present
        const projectData = response.data.data;
        if (projectData.project_document) {
          projectData.project_document = projectData.project_document.map((doc: ProjectDocument) => ({
            ...doc,
            uniqueKey: doc.uniqueKey || generateUUID(),
          }));
        }
        setFormData(projectData);
        setIsEditMode(true);
        setShowForm(true);
      } else {
        setErrorMessage('Project not found');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'hero_image') => {
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

  // Project Images management
  const addProjectImage = () => {
    const newRanking = formData.project_images.length + 1;
    setFormData((prev) => ({
      ...prev,
      project_images: [
        ...prev.project_images,
        { ranking: newRanking, url: '', public_id: '' },
      ],
    }));
  };

  const removeProjectImage = (index: number) => {
    const updatedImages = formData.project_images.filter((_, i) => i !== index);
    // Re-rank images
    const rerankedImages = updatedImages.map((img, idx) => ({
      ...img,
      ranking: idx + 1,
    }));
    setFormData((prev) => ({ ...prev, project_images: rerankedImages }));
  };

  const updateImageRanking = (index: number, ranking: number) => {
    const updatedImages = [...formData.project_images];
    updatedImages[index].ranking = ranking;
    setFormData((prev) => ({ ...prev, project_images: updatedImages }));
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      const updatedImages = [...formData.project_images];
      updatedImages[index].url = previewUrl;
      updatedImages[index].public_id = 'uploading...';
      setFormData((prev) => ({ ...prev, project_images: updatedImages }));

      const response = await apiUpload('/api/v1/upload/single', file, 'file');
      
      if (response.success && response.data && response.data.data) {
        URL.revokeObjectURL(previewUrl);
        updatedImages[index].url = response.data.data.url || response.data.data.secure_url || '';
        updatedImages[index].public_id = response.data.data.public_id || '';
        setFormData((prev) => ({ ...prev, project_images: updatedImages }));
      } else {
        alert('Upload failed');
        URL.revokeObjectURL(previewUrl);
        updatedImages[index].url = '';
        updatedImages[index].public_id = '';
        setFormData((prev) => ({ ...prev, project_images: updatedImages }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  };

  // Project Features management
  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      project_features: [...prev.project_features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      project_features: prev.project_features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...formData.project_features];
    updatedFeatures[index] = value;
    setFormData((prev) => ({ ...prev, project_features: updatedFeatures }));
  };

  // Project Detail management
  const updateProjectDetail = (field: keyof ProjectDetail, value: string) => {
    setFormData((prev) => ({
      ...prev,
      project_detail: {
        ...prev.project_detail,
        [field]: value,
      },
    }));
  };

  const handleProjectDetailImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        project_detail: {
          ...prev.project_detail,
          image: { url: previewUrl, public_id: 'uploading...' },
        },
      }));

      const response = await apiUpload('/api/v1/upload/single', file, 'file');
      
      if (response.success && response.data && response.data.data) {
        URL.revokeObjectURL(previewUrl);
        setFormData((prev) => ({
          ...prev,
          project_detail: {
            ...prev.project_detail,
            image: {
              url: response.data.data.url || response.data.data.secure_url || '',
              public_id: response.data.data.public_id || '',
            },
          },
        }));
      } else {
        alert('Upload failed');
        URL.revokeObjectURL(previewUrl);
        setFormData((prev) => ({
          ...prev,
          project_detail: {
            ...prev.project_detail,
            image: { url: '', public_id: '' },
          },
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  };

  // Project Documents management
  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      project_document: [
        ...prev.project_document,
        {
          uniqueKey: generateUUID(),
          image: { url: '', public_id: '' },
          title: '',
          description: '',
          file_name: '',
          file_link: { url: '', public_id: '' },
          button_title: 'Download',
          download_message: '',
        },
      ],
    }));
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      project_document: prev.project_document.filter((_, i) => i !== index),
    }));
  };

  const updateDocument = (index: number, field: keyof ProjectDocument, value: string) => {
    const updatedDocs = [...formData.project_document];
    updatedDocs[index] = { ...updatedDocs[index], [field]: value };
    setFormData((prev) => ({ ...prev, project_document: updatedDocs }));
  };

  const handleDocumentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      const updatedDocs = [...formData.project_document];
      updatedDocs[index].image = { url: previewUrl, public_id: 'uploading...' };
      setFormData((prev) => ({ ...prev, project_document: updatedDocs }));

      const response = await apiUpload('/api/v1/upload/single', file, 'file');
      
      if (response.success && response.data && response.data.data) {
        URL.revokeObjectURL(previewUrl);
        updatedDocs[index].image = {
          url: response.data.data.url || response.data.data.secure_url || '',
          public_id: response.data.data.public_id || '',
        };
        setFormData((prev) => ({ ...prev, project_document: updatedDocs }));
      } else {
        alert('Upload failed');
        URL.revokeObjectURL(previewUrl);
        updatedDocs[index].image = { url: '', public_id: '' };
        setFormData((prev) => ({ ...prev, project_document: updatedDocs }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  };

  const handleDocumentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const updatedDocs = [...formData.project_document];
      updatedDocs[index].file_link = { url: 'uploading...', public_id: 'uploading...' };
      setFormData((prev) => ({ ...prev, project_document: updatedDocs }));

      const response = await apiUpload('/api/v1/upload/single', file, 'file');
      
      if (response.success && response.data && response.data.data) {
        updatedDocs[index].file_link = {
          url: response.data.data.url || response.data.data.secure_url || '',
          public_id: response.data.data.public_id || '',
        };
        if (!updatedDocs[index].file_name) {
          updatedDocs[index].file_name = file.name;
        }
        setFormData((prev) => ({ ...prev, project_document: updatedDocs }));
      } else {
        alert('Upload failed');
        updatedDocs[index].file_link = { url: '', public_id: '' };
        setFormData((prev) => ({ ...prev, project_document: updatedDocs }));
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

    // Validate unique rankings
    const rankings = formData.project_images.map(img => img.ranking);
    const uniqueRankings = new Set(rankings);
    if (rankings.length !== uniqueRankings.size) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrorMessage('All image rankings must be unique');
      setIsSubmitting(false);
      return;
    }
    
    try {
      let response;
      
      if (isEditMode) {
        response = await apiPut(`/api/v1/project/${formData.slug}`, formData);
      } else {
        response = await apiPost('/api/v1/project', formData);
      }
      
      if (response.success) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSuccessMessage(response.data?.message || 'Project saved successfully!');
        await fetchProjects();
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

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiDelete(`/api/v1/project/${slug}`);
      
      if (response.success) {
        setSuccessMessage(`Project "${name}" deleted successfully!`);
        await fetchProjects();
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
              <p className="text-gray dark:text-slate-400">Loading projects...</p>
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
              Projects Management
            </h1>
          </div>
          {!showForm && (
            <button 
              onClick={handleAddNew}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              + Add New Project
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

        {/* Project Form */}
        {showForm ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-border/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white">
                {isEditMode ? 'Edit Project' : 'Add New Project'}
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
                  placeholder="project-slug"
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
                <p className="text-xs text-gray mt-1">Only lowercase letters, numbers, and hyphens allowed</p>
              </div>

              {/* Business Name Slug */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Business *
                </label>
                <select
                  name="business_name_slug"
                  value={formData.business_name_slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, business_name_slug: e.target.value }))}
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
                <p className="text-xs text-gray mt-1">Select the business this project belongs to</p>
              </div>

              {/* Project Name */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Project Name * (Max 150 characters)
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  maxLength={150}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Project Description *
                </label>
                <textarea
                  name="project_description"
                  value={formData.project_description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Project Type *
                </label>
                <input
                  type="text"
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Residential, Commercial, Industrial"
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

              {/* Project Features */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-midnight_text dark:text-white">
                    Project Features
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    + Add Feature
                  </button>
                </div>
                {formData.project_features.map((feature, index) => (
                  <div key={index} className="mb-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Feature description"
                      className="flex-1 px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Project Images */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-midnight_text dark:text-white">
                    Project Images (Ranked)
                  </label>
                  <button
                    type="button"
                    onClick={addProjectImage}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    + Add Image
                  </button>
                </div>
                <p className="text-xs text-gray mb-3">All rankings must be unique</p>
                {formData.project_images.map((img, index) => (
                  <div key={index} className="mb-4 p-4 border border-border dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-midnight_text dark:text-white">
                        Image {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeProjectImage(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-midnight_text dark:text-white mb-1">
                        Ranking *
                      </label>
                      <input
                        type="number"
                        value={img.ranking}
                        onChange={(e) => updateImageRanking(index, parseInt(e.target.value) || 1)}
                        min={1}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                      />
                    </div>
                    {img.url && (
                      <div className="mb-2">
                        <Image
                          src={img.url}
                          alt={`Project Image ${img.ranking}`}
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
                      onChange={(e) => handleProjectImageUpload(e, index)}
                      className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                  </div>
                ))}
              </div>

              {/* Project Detail */}
              <div className="p-4 border-2 border-primary/30 rounded-lg">
                <h3 className="text-lg font-semibold text-midnight_text dark:text-white mb-4">
                  Project Detail *
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                      Title * (Max 150 characters)
                    </label>
                    <input
                      type="text"
                      value={formData.project_detail.title}
                      onChange={(e) => updateProjectDetail('title', e.target.value)}
                      maxLength={150}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.project_detail.description}
                      onChange={(e) => updateProjectDetail('description', e.target.value)}
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                      Image *
                    </label>
                    {formData.project_detail.image.url && (
                      <div className="mb-3">
                        <Image
                          src={formData.project_detail.image.url}
                          alt="Project Detail"
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
                      onChange={handleProjectDetailImageUpload}
                      className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Project Documents */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-midnight_text dark:text-white">
                    Project Documents
                  </label>
                  <button
                    type="button"
                    onClick={addDocument}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    + Add Document
                  </button>
                </div>
                {formData.project_document.map((doc, index) => (
                  <div key={doc.uniqueKey} className="mb-6 p-4 border-2 border-border dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-midnight_text dark:text-white">
                        Document {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-midnight_text dark:text-white mb-1">
                          Title * (Max 150 characters)
                        </label>
                        <input
                          type="text"
                          value={doc.title}
                          onChange={(e) => updateDocument(index, 'title', e.target.value)}
                          maxLength={150}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-midnight_text dark:text-white mb-1">
                          Description * (Max 500 characters)
                        </label>
                        <textarea
                          value={doc.description}
                          onChange={(e) => updateDocument(index, 'description', e.target.value)}
                          maxLength={500}
                          required
                          rows={2}
                          className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-midnight_text dark:text-white mb-1">
                          File Name *
                        </label>
                        <input
                          type="text"
                          value={doc.file_name}
                          onChange={(e) => updateDocument(index, 'file_name', e.target.value)}
                          required
                          className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-midnight_text dark:text-white mb-1">
                          Button Title (Max 50 characters)
                        </label>
                        <input
                          type="text"
                          value={doc.button_title}
                          onChange={(e) => updateDocument(index, 'button_title', e.target.value)}
                          maxLength={50}
                          placeholder="Download"
                          className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-midnight_text dark:text-white mb-1">
                          Download Message (Max 200 characters)
                        </label>
                        <input
                          type="text"
                          value={doc.download_message}
                          onChange={(e) => updateDocument(index, 'download_message', e.target.value)}
                          maxLength={200}
                          className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-midnight_text dark:text-white mb-1">
                          Document Image *
                        </label>
                        {doc.image.url && (
                          <div className="mb-2">
                            <Image
                              src={doc.image.url}
                              alt={doc.title}
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
                          onChange={(e) => handleDocumentImageUpload(e, index)}
                          className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-midnight_text dark:text-white mb-1">
                          Document File *
                        </label>
                        {doc.file_link.url && doc.file_link.url !== 'uploading...' && (
                          <div className="mb-2 text-xs text-green-600 dark:text-green-400">
                            ✓ File uploaded
                          </div>
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleDocumentFileUpload(e, index)}
                          className="w-full px-4 py-2 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-4 pt-6 border-t border-border dark:border-gray-600">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Project' : 'Create Project')}
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
          /* Project List */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-border/50">
            {projects.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray dark:text-slate-300 mb-4">
                  No projects found. Click "Add New Project" to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">
                        Project
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">
                        Business
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">
                        Type
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
                    {projects.map((project) => (
                      <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleEdit(project.slug)}>
                          <div className="font-medium text-midnight_text dark:text-white">
                            {project.project_name}
                          </div>
                          <div className="text-sm text-gray dark:text-slate-400 line-clamp-1">
                            {project.project_description}
                          </div>
                        </td>
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleEdit(project.slug)}>
                          <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {project.business_name_slug}
                          </code>
                        </td>
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleEdit(project.slug)}>
                          <div className="text-sm text-gray dark:text-slate-300">
                            {project.project_type}
                          </div>
                        </td>
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleEdit(project.slug)}>
                          <div className="text-sm text-gray dark:text-slate-400">
                            {new Date(project.updatedAt || '').toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(project.slug);
                              }}
                              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(project.slug, project.project_name);
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
