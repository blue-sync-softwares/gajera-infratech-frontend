'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiGet, apiDelete, apiPost, apiPut } from '@/utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  lastLoginTime: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  __v: number;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

const emptyFormData: UserFormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'user',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<UserFormData>(emptyFormData);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiPost('/api/v1/users');

      if (response.success && response.data && response.data.data) {
        setUsers(Array.isArray(response.data.data.users) ? response.data.data.users : []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMessage('Unable to connect to the server. Please try again later.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData(emptyFormData);
    setIsEditMode(false);
    setEditingUserId(null);
    setShowForm(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleEdit = async (_id: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiPost(`/api/v1/users/${_id}`);

      if (response.success && response.data && response.data.data) {
        const userData = response.data.data.user;
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          password: '',
          role: userData.role || 'user',
        });
        setIsEditMode(true);
        setEditingUserId(_id);
        setShowForm(true);
      } else {
        setErrorMessage('User not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setErrorMessage('Unable to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData(emptyFormData);
    setIsEditMode(false);
    setEditingUserId(null);
    setShowPassword(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.role) {
        setErrorMessage('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // For new user, password is required
      if (!isEditMode && !formData.password) {
        setErrorMessage('Password is required for new users');
        setIsSubmitting(false);
        return;
      }

      let response;
      const submitData = isEditMode
        ? {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            ...(formData.password && { password: formData.password }),
          }
        : formData;

      if (isEditMode && editingUserId) {
        response = await apiPut(`/api/v1/users/${editingUserId}`, submitData);
      } else {
        response = await apiPost('/api/v1/users', submitData);
      }

      if (response.success) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSuccessMessage(response.data?.message || `User ${isEditMode ? 'updated' : 'created'} successfully!`);
        await fetchUsers();
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
  }

  const handleDelete = async (_id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiDelete(`/api/v1/users/${_id}`);

      if (response.success) {
        setSuccessMessage(`User "${name}" deleted successfully!`);
        await fetchUsers();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(`Failed to delete: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage('Unable to connect to the server. Please try again later.');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && !showForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-darkmode pt-32 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray dark:text-slate-400">Loading users...</p>
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
              User Management
            </h1>
          </div>
          {!showForm && (
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              + Add New User
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

        {/* User Form */}
        {showForm ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-border/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white">
                {isEditMode ? 'Edit User' : 'Add New User'}
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
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter user name"
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Password {!isEditMode && '*'} {isEditMode && <span className="text-xs text-gray">(Leave empty to keep current password)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!isEditMode}
                    placeholder={isEditMode ? 'Leave empty to keep current password' : 'Enter password'}
                    className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray dark:text-slate-400 hover:text-midnight_text dark:hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7C7.523 19 3.732 16.057 2.458 12z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight_text dark:text-white focus:ring-2 focus:ring-primary"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-4 pt-6 border-t border-border dark:border-gray-600">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
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
          /* User List */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-border/50">
            {users.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray dark:text-slate-300 mb-4">
                  No users found. Click "Add New User" to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">User ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-midnight_text dark:text-white">Last Login</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-midnight_text dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-midnight_text dark:text-white">{user.userId}</td>
                        <td className="px-6 py-4 text-sm text-midnight_text dark:text-white font-medium">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray dark:text-slate-300 break-all">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray dark:text-slate-300">{user.phone}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray dark:text-slate-300">
                          {formatDate(user.lastLoginTime)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(user._id)}
                              className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user._id, user.name)}
                              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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
