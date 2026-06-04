'use client';

import { useState } from 'react';
// Framer Motion temporarily disabled for debugging
// import { motion, AnimatePresence } from 'framer-motion';
import { AppMode, AppState } from '@/lib/types';
import { defaultPersonas, sampleJobs, sampleAgentOpportunities } from '@/data/sample-data';
import { appConfig } from '@/lib/config';
import ModeNavigation from './mode-navigation';
import LearningMode from '@/components/modes/learning-mode';
import BuildingMode from '@/components/modes/building-mode';
import PresentingMode from '@/components/modes/presenting-mode';
import { Book, Wrench, Presentation } from 'lucide-react';

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

export default function AppLayout() {
  const [appState, setAppState] = useState<AppState>({
    currentMode: 'learning',
    jobs: sampleJobs,
    personas: defaultPersonas,
    agentOpportunities: sampleAgentOpportunities,
    googleSheetsConnected: false
  });

  const handleModeChange = (mode: AppMode) => {
    setAppState(prev => ({ ...prev, currentMode: mode }));
  };

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentMode = () => {
    const commonProps = {
      appState,
      updateAppState
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

            <div className="flex items-center space-x-4">
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
              <div className={`flex items-center space-x-1 ${appState.googleSheetsConnected ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${appState.googleSheetsConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span>Google Sheets {appState.googleSheetsConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
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