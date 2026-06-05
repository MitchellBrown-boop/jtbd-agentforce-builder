'use client';

import { useSalesforceAuth } from '@/hooks/useSalesforceAuth';
import { LogIn, LogOut, User, Cloud } from 'lucide-react';

export default function SalesforceAuth() {
  const { authenticated, user, loading, login, logout } = useSalesforceAuth();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span>Checking auth...</span>
      </div>
    );
  }

  if (authenticated && user) {
    return (
      <div className="flex items-center space-x-4">
        {/* User Info */}
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1 text-green-600">
            <Cloud className="w-4 h-4" />
            <span className="font-medium">Salesforce</span>
          </div>
          <div className="text-gray-600">
            <User className="w-4 h-4 inline mr-1" />
            {user.Name}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors"
          title="Logout from Salesforce"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Disconnected Status */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Cloud className="w-4 h-4" />
        <span>Salesforce Disconnected</span>
      </div>

      {/* Login Button */}
      <button
        onClick={login}
        className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors text-sm font-medium"
        title="Login with Salesforce"
      >
        <LogIn className="w-4 h-4" />
        <span>Login with Salesforce</span>
      </button>
    </div>
  );
}