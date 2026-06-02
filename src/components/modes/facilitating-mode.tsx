'use client';

import { AppState } from '@/lib/types';
import { Users, Presentation, Clock, CheckCircle } from 'lucide-react';

interface FacilitatingModeProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function FacilitatingMode({ appState }: FacilitatingModeProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-8 text-center text-white mb-8">
        <Users className="w-16 h-16 mx-auto mb-4 opacity-80" />
        <h2 className="text-3xl font-bold mb-2">Workshop Facilitation Mode</h2>
        <p className="text-lg opacity-90">Coming in Phase 2 - Advanced Features</p>
      </div>

      {/* Planned Features */}
      <div className="bg-white rounded-lg border p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Planned Features</h3>

        <div className="grid gap-6">
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <Presentation className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Projector-Friendly Interface</h4>
              <p className="text-gray-600">Large fonts and high contrast design optimized for meeting room displays and stakeholder workshops.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <Users className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Stakeholder Input Forms</h4>
              <p className="text-gray-600">Simple interfaces for non-technical participants to contribute jobs and pain points during collaborative sessions.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <Clock className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Live Framework Visualization</h4>
              <p className="text-gray-600">Real-time updates as jobs are created during the session, with Google Sheets integration for immediate collaboration.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Session Export</h4>
              <p className="text-gray-600">Generate completed frameworks as PDF slides for follow-up meetings and stakeholder distribution.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Workaround */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-800 mb-2">Current Workaround</h4>
        <p className="text-blue-700 mb-4">
          While we build the dedicated facilitation mode, you can use the Building Mode to create jobs during stakeholder sessions,
          then switch to Presentation Mode to show progress and gather feedback.
        </p>
        <div className="space-y-2 text-sm text-blue-600">
          <p>• Use Building Mode to create jobs live during meetings</p>
          <p>• Switch to Presentation Mode for stakeholder review</p>
          <p>• Export data will be available for follow-up materials</p>
        </div>
      </div>
    </div>
  );
}