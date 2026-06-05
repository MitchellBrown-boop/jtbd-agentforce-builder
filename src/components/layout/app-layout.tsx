'use client';

import { useState, useEffect } from 'react';
// Framer Motion temporarily disabled for debugging
// import { motion, AnimatePresence } from 'framer-motion';
import { AppMode, AppState } from '@/lib/types';
import { defaultPersonas, sampleJobs, sampleAgentOpportunities } from '@/data/sample-data';
import { appConfig, customerConfig } from '@/lib/config';
import ModeNavigation from './mode-navigation';
import LearningMode from '@/components/modes/learning-mode';
import BuildingMode from '@/components/modes/building-mode';
import PresentingMode from '@/components/modes/presenting-mode';
import SalesforceAuth from '@/components/auth/salesforce-auth';
import { useSalesforceData } from '@/hooks/useSalesforceData';
import { Book, Wrench, Presentation, Loader2 } from 'lucide-react';

const modeConfig = {
  learning: {
    title: 'Learning Mode',
    description: 'Interactive tutorial and JTBD concepts',
    icon: Book,
    color: 'bg-blue-500'
  },
  building: {
    title: 'Building Mode',
    description: 'Create and manage your JTBD framework',
    icon: Wrench,
    color: 'bg-green-500'
  },
  presenting: {
    title: 'Presenting Mode',
    description: 'Executive dashboard and reporting',
    icon: Presentation,
    color: 'bg-orange-500'
  }
};

// localStorage key for persisting app state
const STORAGE_KEY = 'jtbd-builder-app-state';

// Load state from localStorage
const loadStateFromStorage = (): Partial<AppState> | null => {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      if (parsed.jobs) {
        parsed.jobs = parsed.jobs.map((job: any) => ({
          ...job,
          createdAt: job.createdAt ? new Date(job.createdAt) : undefined,
          updatedAt: job.updatedAt ? new Date(job.updatedAt) : undefined
        }));
      }
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  return null;
};

// Save state to localStorage
const saveStateToStorage = (state: AppState) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

export default function AppLayout() {
  const salesforceData = useSalesforceData();
  const [currentMode, setCurrentMode] = useState<AppMode>('learning');

  // Combine local UI state with Salesforce data
  const appState: AppState = {
    currentMode,
    jobs: salesforceData.authenticated ? salesforceData.jobs : sampleJobs,
    personas: salesforceData.authenticated ? salesforceData.personas : defaultPersonas,
    agentOpportunities: salesforceData.authenticated ? salesforceData.agentOpportunities : sampleAgentOpportunities
  };

  // Load saved mode from localStorage on component mount
  useEffect(() => {
    const savedState = loadStateFromStorage();
    if (savedState && savedState.currentMode) {
      setCurrentMode(savedState.currentMode);
    }
  }, []);

  // Save mode to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const currentState = { currentMode };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
      } catch (error) {
        console.error('Failed to save mode to localStorage:', error);
      }
    }
  }, [currentMode]);

  const handleModeChange = (mode: AppMode) => {
    setCurrentMode(mode);
  };

  const updateAppState = (updates: Partial<AppState>) => {
    // Handle mode changes
    if (updates.currentMode) {
      setCurrentMode(updates.currentMode);
    }

    // For authenticated users, data updates go through Salesforce hooks
    // For unauthenticated users, we just use sample data (read-only)
    if (!salesforceData.authenticated) {
      console.log('Not authenticated - using sample data');
    }
  };

  const renderCurrentMode = () => {
    // Show loading indicator when fetching Salesforce data
    if (salesforceData.authenticated && salesforceData.loading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading your data from Salesforce...</p>
        </div>
      );
    }

    // Show error if there's a Salesforce error
    if (salesforceData.error) {
      return (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="text-red-600 text-center">
            <p className="font-medium">Error loading data from Salesforce</p>
            <p className="text-sm">{salesforceData.error}</p>
          </div>
          <button
            onClick={salesforceData.loadAllData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      );
    }

    const commonProps = {
      appState,
      updateAppState,
      salesforceData: salesforceData.authenticated ? salesforceData : null
    };

    switch (appState.currentMode) {
      case 'learning':
        return <LearningMode {...commonProps} />;
      case 'building':
        return <BuildingMode {...commonProps} />;
      case 'presenting':
        return <PresentingMode {...commonProps} />;
      default:
        return <LearningMode {...commonProps} />;
    }
  };

  const currentModeConfig = modeConfig[appState.currentMode];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{appConfig.appTitle}</h1>
                  <p className="text-sm text-gray-500">{appConfig.appSubtitle}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Salesforce Authentication */}
              <SalesforceAuth />

              {/* Current Mode Indicator */}
              <div className={`px-3 py-1 rounded-full text-sm font-medium text-white ${currentModeConfig.color}`}>
                <div className="flex items-center space-x-1">
                  <currentModeConfig.icon className="w-4 h-4" />
                  <span>{currentModeConfig.title}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mode Navigation */}
      <ModeNavigation
        currentMode={appState.currentMode}
        onModeChange={handleModeChange}
        modeConfig={modeConfig}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
            {/* Mode Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${currentModeConfig.color} text-white mb-4`}>
                <currentModeConfig.icon className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentModeConfig.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {currentModeConfig.description}
              </p>
            </div>

            {/* Mode Content */}
            {renderCurrentMode()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {appConfig.footerText}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Jobs: {appState.jobs.length}</span>
              <span>•</span>
              <span>Personas: {appState.personas.length}</span>
              <span>•</span>
              <span>Agents: {appState.agentOpportunities.length}</span>
              <span>•</span>
              <span className="text-gray-400">Salesforce Integration Active</span>
              {appState.currentMode === 'learning' && (
                <>
                  <span>•</span>
                  <span>
                    Framework by{' '}
                    <a
                      href="https://strategyn.com/jobs-to-be-done/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-700 underline"
                    >
                      Strategyn
                    </a>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}