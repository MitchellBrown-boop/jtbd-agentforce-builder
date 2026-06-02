'use client';

import { useState } from 'react';
import { AppState, JTBDJob } from '@/lib/types';
import { BarChart3, TrendingUp, Users, Target, ArrowRight, Presentation, Download } from 'lucide-react';

interface PresentingModeProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function PresentingMode({ appState }: PresentingModeProps) {
  const [viewMode, setViewMode] = useState<'executive' | 'detailed' | 'technical'>('executive');

  const jobsByType = appState.jobs.reduce((acc, job) => {
    acc[job.jobType] = (acc[job.jobType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const renderExecutiveDashboard = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{appState.jobs.length}</div>
          <div className="text-sm text-gray-600">Jobs Identified</div>
        </div>

        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{appState.agentOpportunities.length}</div>
          <div className="text-sm text-gray-600">Agent Opportunities</div>
        </div>

        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{appState.personas.length}</div>
          <div className="text-sm text-gray-600">Personas Analyzed</div>
        </div>

        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {Math.round((appState.agentOpportunities.length / Math.max(appState.jobs.length, 1)) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Automation Potential</div>
        </div>
      </div>

      {/* Strategic Overview */}
      <div className="bg-white rounded-lg border p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Jobs-to-be-Done Framework Overview</h3>

        <div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Job Complexity Distribution</h4>
            <div className="space-y-3">
              {['big', 'little', 'micro'].map(jobType => (
                <div key={jobType} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">{jobType} Jobs</span>
                      <span className="text-sm text-gray-500">{jobsByType[jobType] || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          jobType === 'big' ? 'bg-purple-500' :
                          jobType === 'little' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${((jobsByType[jobType] || 0) / Math.max(appState.jobs.length, 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Opportunities */}
      <div className="bg-white rounded-lg border p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Priority Agent Opportunities</h3>

        <div className="grid gap-6">
          {appState.agentOpportunities
            .filter(agent => agent.priority === 'high')
            .slice(0, 3)
            .map((agent, index) => (
              <div key={agent.id} className="flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h4>
                  <p className="text-gray-700 mb-3">{agent.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">Expected Impact: {agent.estimatedImpact}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        agent.complexity === 'simple' ? 'bg-green-100 text-green-800' :
                        agent.complexity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {agent.complexity} complexity
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {appState.agentOpportunities.filter(a => a.priority === 'high').length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No high-priority agent opportunities identified yet.</p>
            <p className="text-sm">Complete more jobs in Building Mode to generate AI automation recommendations.</p>
          </div>
        )}
      </div>

      {/* Implementation Roadmap */}
      <div className="bg-white rounded-lg border p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Implementation Roadmap</h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-800">Foundation Phase (Weeks 1-2)</h4>
              <p className="text-green-700 text-sm">Establish JTBD framework, validate with stakeholders</p>
            </div>
            <ArrowRight className="w-5 h-5 text-green-600" />
          </div>

          <div className="flex items-center space-x-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800">Pilot Implementation (Weeks 3-6)</h4>
              <p className="text-blue-700 text-sm">Deploy high-priority agents, measure initial impact</p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>

          <div className="flex items-center space-x-4 p-4 border border-purple-200 bg-purple-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-purple-800">Scale & Optimize (Weeks 7-12)</h4>
              <p className="text-purple-700 text-sm">Expand to remaining opportunities, refine based on learnings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* View Mode Selector */}
      <div className="mb-8 flex space-x-4 bg-white rounded-lg border p-2">
        {[
          { mode: 'executive', label: 'Executive Summary', icon: TrendingUp },
          { mode: 'detailed', label: 'Detailed Analysis', icon: BarChart3 },
          { mode: 'technical', label: 'Technical Specs', icon: Target }
        ].map(({ mode, label, icon: Icon }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === mode
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Export Actions */}
      <div className="mb-6 flex justify-end space-x-3">
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          <Presentation className="w-4 h-4" />
          <span>Generate Slides</span>
        </button>
      </div>

      {/* Main Content */}
      {viewMode === 'executive' && renderExecutiveDashboard()}

      {viewMode === 'detailed' && (
        <div className="bg-white rounded-lg border p-8 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Analysis View</h3>
          <p className="text-gray-600">Coming in Phase 2 - Advanced Features</p>
        </div>
      )}

      {viewMode === 'technical' && (
        <div className="bg-white rounded-lg border p-8 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Technical Specifications</h3>
          <p className="text-gray-600">Coming in Phase 2 - Advanced Features</p>
        </div>
      )}
    </div>
  );
}