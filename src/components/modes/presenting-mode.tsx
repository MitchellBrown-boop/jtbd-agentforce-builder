'use client';

import { useState } from 'react';
import { AppState, JTBDJob } from '@/lib/types';
import { BarChart3, Users, Target, ArrowRight, Presentation, Download } from 'lucide-react';

interface PresentingModeProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function PresentingMode({ appState }: PresentingModeProps) {

  const jobsByType = appState.jobs.reduce((acc, job) => {
    acc[job.jobType] = (acc[job.jobType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate normalized weekly time by persona
  const timeByPersona = appState.jobs.reduce((acc, job) => {
    if (!job.timePerOccurrence || !job.frequency) return acc;

    const persona = appState.personas.find(p => p.id === job.persona);
    if (!persona) return acc;

    // Normalize to weekly time
    const multiplier = {
      'daily': 5,      // 5 work days per week
      'weekly': 1,     // Already weekly
      'monthly': 0.25, // ~1 week per month
      'as-needed': 1   // Assume weekly
    }[job.frequency] || 1;

    const weeklyMinutes = job.timePerOccurrence * multiplier;

    if (!acc[persona.id]) {
      acc[persona.id] = {
        personaName: persona.name,
        personaRole: persona.role,
        totalWeeklyMinutes: 0,
        jobCount: 0
      };
    }

    acc[persona.id].totalWeeklyMinutes += weeklyMinutes;
    acc[persona.id].jobCount += 1;

    return acc;
  }, {} as Record<string, { personaName: string; personaRole: string; totalWeeklyMinutes: number; jobCount: number }>);

  // Sort personas by total weekly time (descending)
  const sortedPersonaTime = Object.values(timeByPersona)
    .sort((a, b) => b.totalWeeklyMinutes - a.totalWeeklyMinutes);

  // Calculate total weekly time across all personas
  const totalWeeklyTime = sortedPersonaTime.reduce((sum, persona) => sum + persona.totalWeeklyMinutes, 0);

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

      {/* Time Impact Analysis */}
      <div className="bg-white rounded-lg border p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Weekly Time Impact by Persona</h3>

        {sortedPersonaTime.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Total weekly time across all personas: <span className="font-semibold text-gray-900">
                {Math.round(totalWeeklyTime)} minutes ({(totalWeeklyTime / 60).toFixed(1)} hours)
              </span>
            </div>

            <div className="space-y-3">
              {sortedPersonaTime.map((persona, index) => (
                <div key={persona.personaName} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{persona.personaRole}</span>
                        <span className="text-xs text-gray-500 ml-2">({persona.jobCount} jobs)</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {Math.round(persona.totalWeeklyMinutes)} min/week
                        </div>
                        <div className="text-xs text-gray-500">
                          ({(persona.totalWeeklyMinutes / 60).toFixed(1)} hours)
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500"
                        style={{ width: `${(persona.totalWeeklyMinutes / Math.max(totalWeeklyTime, 1)) * 100}%` }}
                      />
                    </div>

                    <div className="text-xs text-gray-600 mt-1">
                      {Math.round((persona.totalWeeklyMinutes / Math.max(totalWeeklyTime, 1)) * 100)}% of total time impact
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h5 className="text-sm font-semibold text-orange-800 mb-2">Automation Priority Insights</h5>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• <span className="font-medium">{sortedPersonaTime[0]?.personaRole}</span> represents the highest automation opportunity with {Math.round(sortedPersonaTime[0]?.totalWeeklyMinutes || 0)} minutes/week</li>
                <li>• Focus agent development on personas with 120+ minutes/week (2+ hours) for maximum impact</li>
                <li>• Target jobs with daily frequency first as they offer consistent time savings</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No time data available for analysis.</p>
            <p className="text-sm">Add time and frequency information to jobs in Building Mode to see time impact analysis.</p>
          </div>
        )}
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

      {/* Executive Dashboard */}
      {renderExecutiveDashboard()}
    </div>
  );
}