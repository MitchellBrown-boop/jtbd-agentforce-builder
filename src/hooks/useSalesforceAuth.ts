'use client';

import { useState, useEffect } from 'react';

interface User {
  Id: string;
  Name: string;
  Email: string;
  CompanyName: string;
}

interface AuthStatus {
  authenticated: boolean;
  user: User | null;
  instanceUrl?: string;
  error?: string;
}

export function useSalesforceAuth() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    authenticated: false,
    user: null
  });
  const [loading, setLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/status');
      const data = await response.json();

      setAuthStatus({
        authenticated: data.authenticated,
        user: data.user,
        instanceUrl: data.instanceUrl,
        error: data.error
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus({
        authenticated: false,
        user: null,
        error: 'Failed to check authentication status'
      });
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // Redirect to Salesforce OAuth
    window.location.href = '/api/auth/salesforce';
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });

      if (response.ok) {
        setAuthStatus({
          authenticated: false,
          user: null
        });
        // Optionally redirect to home page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    ...authStatus,
    loading,
    login,
    logout,
    checkAuthStatus
  };
}