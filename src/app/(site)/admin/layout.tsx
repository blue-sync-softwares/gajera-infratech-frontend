'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/utils/api';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await apiPost('/api/v1/auth/check-login', {}, {
        credentials: 'include', // Send cookies with request
      });
      
      if (response.success && response.data && response.data.data) {
        const { isLoggedIn } = response.data.data;
        
        if (!isLoggedIn) {
          router.push('/signin');
        } else {
          setIsCheckingAuth(false);
        }
      } else {
        // If API fails or returns unsuccessful response, redirect to signin
        router.push('/signin');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/signin');
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-darkmode pt-32 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray dark:text-slate-400">Verifying authentication...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
