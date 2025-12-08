'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiGet, apiPost, apiPut, apiDelete } from '@/utils/api';

// Simple UUID generator
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface HeadOffice {
  uniqueKey: string;
  officeName: string;
  officeAddress: string;
  officeEmail: string;
  officeMobile: string;
}

interface FormFieldConfig {
  enabled: boolean;
  mandatory: boolean;
  label: string;
  placeholder: string;
  type: string;
  rows?: number;
}

interface ContactFormFields {
  name: FormFieldConfig;
  email: FormFieldConfig;
  phone: FormFieldConfig;
  subject: FormFieldConfig;
  message: FormFieldConfig & { rows: number };
  company: FormFieldConfig;
}

interface ContactUsSettings {
  heroDescription: string;
  email: string;
  emailMessage: string;
  address: string;
  headOfficeDetails: HeadOffice[];
  contactUsFormFields: ContactFormFields;
  googleMapPinLink: string;
  isActive: boolean;
}

export default function ContactContentPage() {
  const [formData, setFormData] = useState<ContactUsSettings>({
    heroDescription: '',
    email: '',
    emailMessage: '',
    address: '',
    headOfficeDetails: [],
    contactUsFormFields: {
      name: {
        enabled: true,
        mandatory: true,
        label: 'Name',
        placeholder: 'Enter your name',
        type: 'text',
      },
      email: {
        enabled: true,
        mandatory: true,
        label: 'Email',
        placeholder: 'Enter your email',
        type: 'email',
      },
      phone: {
        enabled: true,
        mandatory: true,
        label: 'Phone',
        placeholder: 'Enter your phone number',
        type: 'tel',
      },
      subject: {
        enabled: true,
        mandatory: false,
        label: 'Subject',
        placeholder: 'Enter subject',
        type: 'text',
      },
      message: {
        enabled: true,
        mandatory: true,
        label: 'Message',
        placeholder: 'Enter your message',
        type: 'textarea',
        rows: 5,
      },
      company: {
        enabled: false,
        mandatory: false,
        label: 'Company',
        placeholder: 'Enter your company name',
        type: 'text',
      },
    },
    googleMapPinLink: '',
    isActive: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExistingData, setIsExistingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched) {
      fetchContactSettings();
      setHasFetched(true);
    }
  }, [hasFetched]);

  const fetchContactSettings = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiGet('/api/v1/website/contact-us-settings');
      
      if (response.success && response.data && response.data.data) {
        setFormData(response.data.data);
        setIsExistingData(true);
      } else {
        setIsExistingData(false);
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error);
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

  const addOffice = () => {
    setFormData((prev) => ({
      ...prev,
      headOfficeDetails: [
        ...prev.headOfficeDetails,
        {
          uniqueKey: generateUUID(),
          officeName: '',
          officeAddress: '',
          officeEmail: '',
          officeMobile: '',
        },
      ],
    }));
  };

  const removeOffice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      headOfficeDetails: prev.headOfficeDetails.filter((_, i) => i !== index),
    }));
  };

  const updateOffice = (index: number, field: keyof HeadOffice, value: string) => {
    const updatedOffices = [...formData.headOfficeDetails];
    updatedOffices[index] = { ...updatedOffices[index], [field]: value };
    setFormData((prev) => ({ ...prev, headOfficeDetails: updatedOffices }));
  };

  const updateFormField = (fieldName: keyof ContactFormFields, property: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      contactUsFormFields: {
        ...prev.contactUsFormFields,
        [fieldName]: {
          ...prev.contactUsFormFields[fieldName],
          [property]: value,
        },
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
      
      if (isExistingData) {
        response = await apiPut('/api/v1/website/contact-us-settings', formData);
      } else {
        response = await apiPost('/api/v1/website/contact-us-settings', formData);
      }
      
      if (response.success) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSuccessMessage(response.data?.message || 'Contact settings saved successfully!');
        setIsExistingData(true);
        await fetchContactSettings();
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
    if (!confirm('Are you sure you want to delete all contact settings? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiDelete('/api/v1/website/contact-us-settings');
      
      if (response.success) {
        setSuccessMessage('Contact settings deleted successfully!');
        setIsExistingData(false);
        setFormData({
          heroDescription: '',
          email: '',
          emailMessage: '',
          address: '',
          headOfficeDetails: [],
          contactUsFormFields: {
            name: {
              enabled: true,
              mandatory: true,
              label: 'Name',
              placeholder: 'Enter your name',
              type: 'text',
            },
            email: {
              enabled: true,
              mandatory: true,
              label: 'Email',
              placeholder: 'Enter your email',
              type: 'email',
            },
            phone: {
              enabled: true,
              mandatory: true,
              label: 'Phone',
              placeholder: 'Enter your phone number',
              type: 'tel',
            },
            subject: {
              enabled: true,
              mandatory: false,
              label: 'Subject',
              placeholder: 'Enter subject',
              type: 'text',
            },
            message: {
              enabled: true,
              mandatory: true,
              label: 'Message',
              placeholder: 'Enter your message',
              type: 'textarea',
              rows: 5,
            },
            company: {
              enabled: false,
              mandatory: false,
              label: 'Company',
              placeholder: 'Enter your company name',
              type: 'text',
            },
          },
          googleMapPinLink: '',
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
    await fetchContactSettings();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-darkmode pt-32 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray dark:text-slate-400">Loading contact settings...</p>
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
            Contact Us Page Settings
          </h1>
          {!isExistingData && (
            <p className="text-sm text-gray dark:text-slate-400 mt-2">
              No existing settings found. Fill in the form to create new contact settings.
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

          {/* Primary Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Primary Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="contact@example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Email Message
                </label>
                <textarea
                  name="emailMessage"
                  value={formData.emailMessage}
                  onChange={handleInputChange}
                  maxLength={300}
                  rows={3}
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="Optional message to display with email (max 300 characters)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  maxLength={500}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                  placeholder="Enter full address (max 500 characters)"
                />
              </div>
            </div>
          </div>

          {/* Head Office Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white">Head Office Details</h2>
              <button
                type="button"
                onClick={addOffice}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                + Add Office
              </button>
            </div>

            <div className="space-y-6">
              {formData.headOfficeDetails.map((office, index) => (
                <div key={office.uniqueKey} className="p-6 border border-border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-midnight_text dark:text-white">
                      Office {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeOffice(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Office Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={office.officeName}
                        onChange={(e) => updateOffice(index, 'officeName', e.target.value)}
                        maxLength={200}
                        required
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="e.g., Head Office, Regional Office"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Office Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={office.officeAddress}
                        onChange={(e) => updateOffice(index, 'officeAddress', e.target.value)}
                        maxLength={500}
                        required
                        rows={2}
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="Office address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Office Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={office.officeEmail}
                        onChange={(e) => updateOffice(index, 'officeEmail', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="office@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Office Mobile <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={office.officeMobile}
                        onChange={(e) => updateOffice(index, 'officeMobile', e.target.value)}
                        pattern="[6-9][0-9]{9}"
                        required
                        maxLength={10}
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.headOfficeDetails.length === 0 && (
                <p className="text-gray dark:text-slate-400 text-center py-8">
                  No offices added yet. Click "Add Office" to get started.
                </p>
              )}
            </div>
          </div>

          {/* Contact Form Configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Contact Form Field Configuration</h2>
            
            <div className="space-y-6">
              {Object.entries(formData.contactUsFormFields).map(([fieldName, fieldConfig]) => (
                <div key={fieldName} className="p-6 border border-border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <h3 className="text-lg font-semibold text-midnight_text dark:text-white mb-4 capitalize">
                    {fieldName} Field
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={fieldConfig.enabled}
                          onChange={(e) => updateFormField(fieldName as keyof ContactFormFields, 'enabled', e.target.checked)}
                          className="w-5 h-5 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                        />
                        <span className="ml-3 text-midnight_text dark:text-white font-medium">
                          Enabled
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={fieldConfig.mandatory}
                          onChange={(e) => updateFormField(fieldName as keyof ContactFormFields, 'mandatory', e.target.checked)}
                          className="w-5 h-5 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                        />
                        <span className="ml-3 text-midnight_text dark:text-white font-medium">
                          Mandatory
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Label
                      </label>
                      <input
                        type="text"
                        value={fieldConfig.label}
                        onChange={(e) => updateFormField(fieldName as keyof ContactFormFields, 'label', e.target.value)}
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={fieldConfig.placeholder}
                        onChange={(e) => updateFormField(fieldName as keyof ContactFormFields, 'placeholder', e.target.value)}
                        className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                      />
                    </div>

                    {fieldName === 'message' && (
                      <div>
                        <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                          Rows (3-10)
                        </label>
                        <input
                          type="number"
                          min={3}
                          max={10}
                          value={fieldConfig.rows || 5}
                          onChange={(e) => updateFormField(fieldName as keyof ContactFormFields, 'rows', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Map */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-border/50">
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">Google Map Integration</h2>
            
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Google Map Pin Link
              </label>
              <input
                type="url"
                name="googleMapPinLink"
                value={formData.googleMapPinLink}
                onChange={handleInputChange}
                pattern="https://(www\.)?google\.com/maps/.+"
                className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-midnight_text dark:text-white"
                placeholder="https://www.google.com/maps/..."
              />
              <p className="text-sm text-gray dark:text-slate-400 mt-2">
                Enter a valid Google Maps link (e.g., https://www.google.com/maps/...)
              </p>
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
