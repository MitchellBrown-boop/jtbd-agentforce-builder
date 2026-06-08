'use client';

import { useState } from 'react';
// Framer Motion temporarily disabled for debugging
// import { motion, AnimatePresence } from 'framer-motion';
import { AppState, JTBDJob, Persona } from '@/lib/types';
import { Plus, Edit, Trash2, User, Target, Zap, CheckCircle, AlertCircle, Lightbulb, ArrowLeft } from 'lucide-react';
import { getVisiblePersonas, getVisibleJobs, getVisibleAgentOpportunities, isShowingSampleData } from '@/lib/data-utils';

interface BuildingModeProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function BuildingMode({ appState, updateAppState }: BuildingModeProps) {
  const [activeView, setActiveView] = useState<'overview' | 'create-job' | 'edit-job' | 'create-persona' | 'persona-detail' | 'personas-overview'>('overview');

  // Get filtered data (hide sample data when real data exists)
  const visiblePersonas = getVisiblePersonas(appState.personas);
  const visibleJobs = getVisibleJobs(appState.jobs);
  const visibleAgentOpportunities = getVisibleAgentOpportunities(appState.agentOpportunities);
  const showingSampleData = isShowingSampleData(appState.personas, appState.jobs, appState.agentOpportunities);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<JTBDJob | null>(null);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const [jobFormData, setJobFormData] = useState({
    statement: '',
    jobType: 'micro' as JTBDJob['jobType'], // All jobs created are micro jobs within larger contexts
    persona: '',
    painPoints: [''],
    successMetrics: [''],
    currentSolutions: [''],
    bigJobContext: '',
    littleJobContext: '',
    timePerOccurrence: undefined as number | undefined,
    frequency: undefined as 'daily' | 'weekly' | 'monthly' | 'as-needed' | undefined
  });

  const [showPersonaCreator, setShowPersonaCreator] = useState(false);
  const [newPersonaData, setNewPersonaData] = useState({
    name: '',
    role: '',
    description: '',
    responsibilities: [''],
    painPoints: [''],
    tools: [''],
    goals: ['']
  });

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleCreatePersona = () => {
    const newPersona: Persona = {
      id: `persona-${Date.now()}`,
      name: newPersonaData.name,
      role: newPersonaData.role,
      description: newPersonaData.description,
      responsibilities: newPersonaData.responsibilities.filter(r => r.trim()),
      painPoints: newPersonaData.painPoints.filter(p => p.trim()),
      tools: newPersonaData.tools.filter(t => t.trim()),
      goals: newPersonaData.goals.filter(g => g.trim())
    };

    updateAppState({
      personas: [...appState.personas, newPersona]
    });

    // Select the newly created persona
    setJobFormData(prev => ({ ...prev, persona: newPersona.id }));

    // Reset persona form and close creator
    setNewPersonaData({
      name: '',
      role: '',
      description: '',
      responsibilities: [''],
      painPoints: [''],
      tools: [''],
      goals: ['']
    });
    setShowPersonaCreator(false);
  };

  const handleCreateJob = () => {
    const newJob: JTBDJob = {
      id: `job-${Date.now()}`,
      statement: jobFormData.statement,
      jobType: 'micro', // All jobs created through this form are micro jobs within larger contexts
      persona: jobFormData.persona,
      painPoints: jobFormData.painPoints.filter(p => p.trim()),
      successMetrics: jobFormData.successMetrics.filter(m => m.trim()),
      currentSolutions: jobFormData.currentSolutions.filter(s => s.trim()),
      bigJobContext: jobFormData.bigJobContext || undefined,
      littleJobContext: jobFormData.littleJobContext || undefined,
      timePerOccurrence: jobFormData.timePerOccurrence || undefined,
      frequency: jobFormData.frequency || undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    updateAppState({
      jobs: [...appState.jobs, newJob]
    });

    // Reset form
    setJobFormData({
      statement: '',
      jobType: 'micro',
      persona: '',
      painPoints: [''],
      successMetrics: [''],
      currentSolutions: [''],
      bigJobContext: '',
      littleJobContext: '',
      timePerOccurrence: undefined,
      frequency: undefined
    });
    setActiveView('overview');
  };

  const handleStartEdit = (job: JTBDJob) => {
    setEditingJob(job);
    setJobFormData({
      statement: job.statement,
      jobType: job.jobType,
      persona: job.persona,
      painPoints: job.painPoints.length > 0 ? job.painPoints : [''],
      successMetrics: job.successMetrics.length > 0 ? job.successMetrics : [''],
      currentSolutions: job.currentSolutions.length > 0 ? job.currentSolutions : [''],
      bigJobContext: job.bigJobContext || '',
      littleJobContext: job.littleJobContext || '',
      timePerOccurrence: job.timePerOccurrence || undefined,
      frequency: job.frequency || undefined
    });
    setActiveView('edit-job');
  };

  const handleUpdateJob = () => {
    if (!editingJob) return;

    const updatedJob: JTBDJob = {
      ...editingJob,
      statement: jobFormData.statement,
      jobType: 'micro', // All jobs are micro jobs within larger contexts
      persona: jobFormData.persona,
      painPoints: jobFormData.painPoints.filter(p => p.trim()),
      successMetrics: jobFormData.successMetrics.filter(m => m.trim()),
      currentSolutions: jobFormData.currentSolutions.filter(s => s.trim()),
      bigJobContext: jobFormData.bigJobContext || undefined,
      littleJobContext: jobFormData.littleJobContext || undefined,
      timePerOccurrence: jobFormData.timePerOccurrence || undefined,
      frequency: jobFormData.frequency || undefined,
      updatedAt: new Date()
    };

    updateAppState({
      jobs: appState.jobs.map(job =>
        job.id === editingJob.id ? updatedJob : job
      )
    });

    // Reset form
    setJobFormData({
      statement: '',
      jobType: 'micro',
      persona: '',
      painPoints: [''],
      successMetrics: [''],
      currentSolutions: [''],
      bigJobContext: '',
      littleJobContext: '',
      timePerOccurrence: undefined,
      frequency: undefined
    });

    setEditingJob(null);
    setActiveView('overview');
  };

  const handleDeleteJob = (jobId: string) => {
    updateAppState({
      jobs: appState.jobs.filter(job => job.id !== jobId)
    });
  };

  const handleDeletePersona = (personaId: string) => {
    updateAppState({
      personas: appState.personas.filter(persona => persona.id !== personaId),
      jobs: appState.jobs.filter(job => job.persona !== personaId) // Also remove jobs assigned to this persona
    });
    // If we're currently viewing this persona, go back to overview
    if (selectedPersona === personaId) {
      setSelectedPersona(null);
      setActiveView('overview');
    }
  };

  const handleArrayFieldChange = (
    field: 'painPoints' | 'successMetrics' | 'currentSolutions',
    index: number,
    value: string
  ) => {
    setJobFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'painPoints' | 'successMetrics' | 'currentSolutions') => {
    setJobFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'painPoints' | 'successMetrics' | 'currentSolutions', index: number) => {
    setJobFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const getJobTypeColor = (jobType: JTBDJob['jobType']) => {
    switch (jobType) {
      case 'big': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'little': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'micro': return 'bg-green-100 text-green-800 border-green-200';
    }
  };


  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setActiveView('personas-overview')}
        >
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{visiblePersonas.length}</p>
              <p className="text-sm text-gray-600">Personas{showingSampleData ? ' (Examples)' : ''}</p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => window.open('/agent-opportunities', '_blank')}
        >
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{visibleAgentOpportunities.length}</p>
              <p className="text-sm text-gray-600">Agent Opportunities{showingSampleData ? ' (Examples)' : ''}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Salesforce Sync</p>
              <p className="text-sm text-green-600">
                Active - Data saves automatically
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Quick Actions */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveView('create-job')}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Job</span>
        </button>

        <button
          onClick={() => setActiveView('create-persona')}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <User className="w-4 h-4" />
          <span>Add Persona</span>
        </button>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Your JTBD Framework</h3>
        </div>

        <div className="divide-y">
          {appState.jobs.filter(job => job.jobType === 'micro').map((job) => {
            const persona = appState.personas.find(p => p.id === job.persona);
            const isExample = ['customer-inquiry-deflection', 'prospect-research-preparation', 'slack-data-access', 'react-salesforce-integration', 'lead-qualification-scoring', 'meeting-scheduling-coordination'].includes(job.id);
            return (
              <div key={job.id} className="p-6 hover:bg-gray-50 relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getJobTypeColor(job.jobType)}`}>
                          {job.jobType.toUpperCase()} JOB
                        </span>
                        {isExample && (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 rounded">
                            EXAMPLE
                          </span>
                        )}
                        {persona && (
                          <button
                            onClick={() => {
                              setSelectedPersona(persona.id);
                              setActiveView('persona-detail');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            {persona.name}
                          </button>
                        )}
                      </div>

                      {job.timePerOccurrence && job.frequency && (
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{job.timePerOccurrence} min</span>
                          <span>•</span>
                          <span className="capitalize">{job.frequency}</span>
                          <span>•</span>
                          <span className="font-medium text-orange-600">
                            {(() => {
                              const multiplier = {
                                'daily': 5,
                                'weekly': 1,
                                'monthly': 0.25,
                                'as-needed': 1
                              }[job.frequency] || 1;
                              return `${Math.round(job.timePerOccurrence * multiplier)} min/week`;
                            })()}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-900 font-medium leading-relaxed">
                      {job.statement}
                    </p>

                    {/* Job Hierarchy Context for Micro Jobs */}
                    {job.jobType === 'micro' && (job.bigJobContext || job.littleJobContext) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Job Hierarchy</p>
                        {job.bigJobContext && (
                          <div className="flex items-start space-x-2">
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-800 border border-purple-200 flex-shrink-0 mt-0.5">
                              BIG JOB
                            </span>
                            <p className="text-sm text-gray-700">{job.bigJobContext}</p>
                          </div>
                        )}
                        {job.littleJobContext && (
                          <div className="flex items-start space-x-2">
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800 border border-blue-200 flex-shrink-0 mt-0.5">
                              LITTLE JOB
                            </span>
                            <p className="text-sm text-gray-700">{job.littleJobContext}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Pain Points</p>
                        <ul className="space-y-1">
                          {(expandedJobs.has(job.id) ? job.painPoints : job.painPoints.slice(0, 2)).map((point, index) => (
                            <li key={index} className="text-gray-600 flex items-start space-x-1">
                              <span className="text-red-400 mt-1">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                          {job.painPoints.length > 2 && (
                            <li className="text-blue-500 text-xs">
                              <button
                                onClick={() => toggleJobExpansion(job.id)}
                                className="hover:text-blue-700 cursor-pointer"
                              >
                                {expandedJobs.has(job.id) ? 'Show less' : `+${job.painPoints.length - 2} more`}
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <p className="text-gray-500 font-medium mb-1">Success Metrics</p>
                        <ul className="space-y-1">
                          {(expandedJobs.has(job.id) ? job.successMetrics : job.successMetrics.slice(0, 2)).map((metric, index) => (
                            <li key={index} className="text-gray-600 flex items-start space-x-1">
                              <span className="text-green-400 mt-1">•</span>
                              <span>{metric}</span>
                            </li>
                          ))}
                          {job.successMetrics.length > 2 && (
                            <li className="text-blue-500 text-xs">
                              <button
                                onClick={() => toggleJobExpansion(job.id)}
                                className="hover:text-blue-700 cursor-pointer"
                              >
                                {expandedJobs.has(job.id) ? 'Show less' : `+${job.successMetrics.length - 2} more`}
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <p className="text-gray-500 font-medium mb-1">Current Solutions</p>
                        <ul className="space-y-1">
                          {(expandedJobs.has(job.id) ? job.currentSolutions : job.currentSolutions.slice(0, 2)).map((solution, index) => (
                            <li key={index} className="text-gray-600 flex items-start space-x-1">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{solution}</span>
                            </li>
                          ))}
                          {job.currentSolutions.length > 2 && (
                            <li className="text-blue-500 text-xs">
                              <button
                                onClick={() => toggleJobExpansion(job.id)}
                                className="hover:text-blue-700 cursor-pointer"
                              >
                                {expandedJobs.has(job.id) ? 'Show less' : `+${job.currentSolutions.length - 2} more`}
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleStartEdit(job)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {appState.jobs.filter(job => job.jobType === 'micro').length === 0 && (
            <div className="p-12 text-center">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No micro jobs created yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first Algolia-specific micro job with hierarchy context</p>
              <button
                onClick={() => setActiveView('create-job')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Micro Job</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCreateJob = () => (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg border p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Micro Job Statement</h2>
          <p className="text-gray-600">Follow the JTBD format: When [situation], I want [outcome], so I can [goal]</p>
        </div>

        <div className="space-y-6">
          {/* Persona Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Persona *</label>
            <div className="flex space-x-2">
              <select
                value={jobFormData.persona}
                onChange={(e) => setJobFormData(prev => ({ ...prev, persona: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select role...</option>
                {appState.personas.map(persona => (
                  <option key={persona.id} value={persona.id}>{persona.role}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowPersonaCreator(true)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Role</span>
              </button>
            </div>

            {/* Inline Persona Creator */}
            {showPersonaCreator && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Add New Persona</h4>
                  <button
                    type="button"
                    onClick={() => setShowPersonaCreator(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                    <input
                      value={newPersonaData.name}
                      onChange={(e) => setNewPersonaData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Sarah Chen"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Role *</label>
                    <input
                      value={newPersonaData.role}
                      onChange={(e) => setNewPersonaData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g., Customer Support Manager"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    value={newPersonaData.description}
                    onChange={(e) => setNewPersonaData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this role and responsibilities..."
                    rows={2}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPersonaCreator(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreatePersona}
                    disabled={!newPersonaData.name || !newPersonaData.role}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add Persona
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Hierarchy */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Job Hierarchy</h3>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Define the complete job context</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Big Job - High-level outcome this supports
                </label>
                <input
                  value={jobFormData.bigJobContext}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, bigJobContext: e.target.value }))}
                  placeholder="e.g., Deliver exceptional customer support experience while scaling efficiently"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Little Job - Component task this is part of
                </label>
                <input
                  value={jobFormData.littleJobContext}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, littleJobContext: e.target.value }))}
                  placeholder="e.g., Process and respond to customer inquiries efficiently"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Micro Job - Specific task when [situation], I want [outcome], so I can [goal] *
                </label>
                <textarea
                  value={jobFormData.statement}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, statement: e.target.value }))}
                  placeholder="When I encounter a system issue, I want to quickly identify the root cause so I can resolve it efficiently..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">Follow the JTBD format: When [situation], I want [outcome], so I can [goal]</p>
              </div>
            </div>
          </div>

          {/* Time & Frequency Tracking */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Time Impact Analysis</h3>
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Helps prioritize automation opportunities</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time per occurrence (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  value={jobFormData.timePerOccurrence || ''}
                  onChange={(e) => setJobFormData(prev => ({
                    ...prev,
                    timePerOccurrence: e.target.value ? parseInt(e.target.value) : undefined
                  }))}
                  placeholder="e.g., 15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">How long does this task typically take?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={jobFormData.frequency || ''}
                  onChange={(e) => setJobFormData(prev => ({
                    ...prev,
                    frequency: e.target.value as any || undefined
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select frequency...</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="as-needed">As needed</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">How often does this job occur?</p>
              </div>
            </div>

            {jobFormData.timePerOccurrence && jobFormData.frequency && (
              <div className="bg-white border border-orange-300 rounded p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-800">Estimated Weekly Impact:</span>
                  <span className="text-lg font-bold text-orange-600">
                    {(() => {
                      const timePerWeek =
                        jobFormData.frequency === 'daily' ? jobFormData.timePerOccurrence * 5 :
                        jobFormData.frequency === 'weekly' ? jobFormData.timePerOccurrence :
                        jobFormData.frequency === 'monthly' ? jobFormData.timePerOccurrence / 4 :
                        jobFormData.timePerOccurrence; // as-needed, assume weekly
                      return `${Math.round(timePerWeek)} minutes/week`;
                    })()}
                  </span>
                </div>
                <p className="text-xs text-orange-600 mt-1">High-impact jobs are prime candidates for agent automation</p>
              </div>
            )}
          </div>

          {/* Pain Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pain Points</label>
            {jobFormData.painPoints.map((painPoint, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  value={painPoint}
                  onChange={(e) => handleArrayFieldChange('painPoints', index, e.target.value)}
                  placeholder="Describe a current pain point..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {jobFormData.painPoints.length > 1 && (
                  <button
                    onClick={() => removeArrayField('painPoints', index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addArrayField('painPoints')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add pain point
            </button>
          </div>

          {/* Success Metrics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Success Metrics</label>
            {jobFormData.successMetrics.map((metric, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  value={metric}
                  onChange={(e) => handleArrayFieldChange('successMetrics', index, e.target.value)}
                  placeholder="How will you measure success? (e.g., 50% reduction in resolution time)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {jobFormData.successMetrics.length > 1 && (
                  <button
                    onClick={() => removeArrayField('successMetrics', index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addArrayField('successMetrics')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add success metric
            </button>
          </div>

          {/* Current Solutions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Solutions</label>
            {jobFormData.currentSolutions.map((solution, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  value={solution}
                  onChange={(e) => handleArrayFieldChange('currentSolutions', index, e.target.value)}
                  placeholder="How do you currently handle this job?"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {jobFormData.currentSolutions.length > 1 && (
                  <button
                    onClick={() => removeArrayField('currentSolutions', index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addArrayField('currentSolutions')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add current solution
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => setActiveView('overview')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateJob}
            disabled={!jobFormData.statement || !jobFormData.persona}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Job
          </button>
        </div>
      </div>

      {/* Job Statement Helper */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Writing Great Job Statements</h4>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Start with "When" to describe the trigger situation</li>
              <li>• Use "I want" to describe the desired outcome (not a solution)</li>
              <li>• End with "so I can" to explain the underlying motivation</li>
              <li>• Focus on the outcome, not specific tools or features</li>
              <li>• Be specific about the context and constraints</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditJob = () => (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg border p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Micro Job Statement</h2>
          <p className="text-gray-600">Follow the JTBD format: When [situation], I want [outcome], so I can [goal]</p>
        </div>

        <div className="space-y-6">
          {/* Persona Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Persona *</label>
            <div className="flex space-x-2">
              <select
                value={jobFormData.persona}
                onChange={(e) => setJobFormData(prev => ({ ...prev, persona: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select role...</option>
                {appState.personas.map(persona => (
                  <option key={persona.id} value={persona.id}>{persona.role}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowPersonaCreator(true)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Role</span>
              </button>
            </div>

            {/* Inline Persona Creator */}
            {showPersonaCreator && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Add New Persona</h4>
                  <button
                    type="button"
                    onClick={() => setShowPersonaCreator(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                    <input
                      value={newPersonaData.name}
                      onChange={(e) => setNewPersonaData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Sarah Chen"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Role *</label>
                    <input
                      value={newPersonaData.role}
                      onChange={(e) => setNewPersonaData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g., Customer Support Manager"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    value={newPersonaData.description}
                    onChange={(e) => setNewPersonaData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this role and responsibilities..."
                    rows={2}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPersonaCreator(false)}
                    className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreatePersona}
                    disabled={!newPersonaData.name || !newPersonaData.role}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Persona
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Hierarchy */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Job Hierarchy</h3>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Define the complete job context</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Big Job - High-level outcome this supports
                </label>
                <input
                  value={jobFormData.bigJobContext}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, bigJobContext: e.target.value }))}
                  placeholder="e.g., Deliver exceptional customer support experience while scaling efficiently"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Little Job - Component task this is part of
                </label>
                <input
                  value={jobFormData.littleJobContext}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, littleJobContext: e.target.value }))}
                  placeholder="e.g., Process and respond to customer inquiries efficiently"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Micro Job - Specific task when [situation], I want [outcome], so I can [goal] *
                </label>
                <textarea
                  value={jobFormData.statement}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, statement: e.target.value }))}
                  placeholder="When I encounter a system issue, I want to quickly identify the root cause so I can resolve it efficiently..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">Follow the JTBD format: When [situation], I want [outcome], so I can [goal]</p>
              </div>
            </div>
          </div>

          {/* Time & Frequency Tracking */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Time Impact Analysis</h3>
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Helps prioritize automation opportunities</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time per occurrence (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  value={jobFormData.timePerOccurrence || ''}
                  onChange={(e) => setJobFormData(prev => ({
                    ...prev,
                    timePerOccurrence: e.target.value ? parseInt(e.target.value) : undefined
                  }))}
                  placeholder="e.g., 15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">How long does this task typically take?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={jobFormData.frequency || ''}
                  onChange={(e) => setJobFormData(prev => ({
                    ...prev,
                    frequency: e.target.value as any || undefined
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select frequency...</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="as-needed">As needed</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">How often does this job occur?</p>
              </div>
            </div>

            {jobFormData.timePerOccurrence && jobFormData.frequency && (
              <div className="bg-white border border-orange-300 rounded p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-800">Estimated Weekly Impact:</span>
                  <span className="text-lg font-bold text-orange-600">
                    {(() => {
                      const timePerWeek =
                        jobFormData.frequency === 'daily' ? jobFormData.timePerOccurrence * 5 :
                        jobFormData.frequency === 'weekly' ? jobFormData.timePerOccurrence :
                        jobFormData.frequency === 'monthly' ? jobFormData.timePerOccurrence / 4 :
                        jobFormData.timePerOccurrence; // as-needed, assume weekly
                      return `${Math.round(timePerWeek)} minutes/week`;
                    })()}
                  </span>
                </div>
                <p className="text-xs text-orange-600 mt-1">High-impact jobs are prime candidates for agent automation</p>
              </div>
            )}
          </div>

          {/* Pain Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pain Points</label>
            <div className="space-y-3">
              {jobFormData.painPoints.map((point, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    value={point}
                    onChange={(e) => {
                      const newPainPoints = [...jobFormData.painPoints];
                      newPainPoints[index] = e.target.value;
                      setJobFormData(prev => ({ ...prev, painPoints: newPainPoints }));
                    }}
                    placeholder="Describe a specific pain point..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      const newPainPoints = jobFormData.painPoints.filter((_, i) => i !== index);
                      setJobFormData(prev => ({ ...prev, painPoints: newPainPoints.length > 0 ? newPainPoints : [''] }));
                    }}
                    className="px-3 py-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setJobFormData(prev => ({ ...prev, painPoints: [...prev.painPoints, ''] }))}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add Pain Point</span>
              </button>
            </div>
          </div>

          {/* Success Metrics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Success Metrics</label>
            <div className="space-y-3">
              {jobFormData.successMetrics.map((metric, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    value={metric}
                    onChange={(e) => {
                      const newSuccessMetrics = [...jobFormData.successMetrics];
                      newSuccessMetrics[index] = e.target.value;
                      setJobFormData(prev => ({ ...prev, successMetrics: newSuccessMetrics }));
                    }}
                    placeholder="Define a measurable success outcome..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      const newSuccessMetrics = jobFormData.successMetrics.filter((_, i) => i !== index);
                      setJobFormData(prev => ({ ...prev, successMetrics: newSuccessMetrics.length > 0 ? newSuccessMetrics : [''] }));
                    }}
                    className="px-3 py-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setJobFormData(prev => ({ ...prev, successMetrics: [...prev.successMetrics, ''] }))}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add Success Metric</span>
              </button>
            </div>
          </div>

          {/* Current Solutions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Solutions</label>
            <div className="space-y-3">
              {jobFormData.currentSolutions.map((solution, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    value={solution}
                    onChange={(e) => {
                      const newCurrentSolutions = [...jobFormData.currentSolutions];
                      newCurrentSolutions[index] = e.target.value;
                      setJobFormData(prev => ({ ...prev, currentSolutions: newCurrentSolutions }));
                    }}
                    placeholder="How is this job currently being done?"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      const newCurrentSolutions = jobFormData.currentSolutions.filter((_, i) => i !== index);
                      setJobFormData(prev => ({ ...prev, currentSolutions: newCurrentSolutions.length > 0 ? newCurrentSolutions : [''] }));
                    }}
                    className="px-3 py-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setJobFormData(prev => ({ ...prev, currentSolutions: [...prev.currentSolutions, ''] }))}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add Current Solution</span>
              </button>
            </div>
          </div>

        </div>

        {/* Submit Section */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => {
              setEditingJob(null);
              setJobFormData({
                statement: '',
                jobType: 'micro',
                persona: '',
                painPoints: [''],
                successMetrics: [''],
                currentSolutions: [''],
                bigJobContext: '',
                littleJobContext: '',
                timePerOccurrence: undefined,
                frequency: undefined
              });
              setActiveView('overview');
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateJob}
            disabled={!jobFormData.statement || !jobFormData.persona}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Job
          </button>
        </div>
      </div>

      {/* Job Statement Helper */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Writing Great Job Statements</h4>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Start with "When" to describe the trigger situation</li>
              <li>• Use "I want" to describe the desired outcome (not a solution)</li>
              <li>• End with "so I can" to explain the underlying motivation</li>
              <li>• Focus on the outcome, not specific tools or features</li>
              <li>• Be specific about the context and constraints</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonaDetail = () => {
    const persona = appState.personas.find(p => p.id === selectedPersona);
    if (!persona) return null;

    const personaJobs = appState.jobs.filter(job => job.persona === selectedPersona);

    return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setActiveView('overview')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Framework</span>
          </button>

          <div className="bg-white rounded-lg border p-8 relative">
            {/* Edit/Delete buttons */}
            <div className="absolute top-6 right-6 flex items-center space-x-2">
              <button
                onClick={() => {
                  // TODO: Add edit persona functionality
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${persona.name}? This will also delete all associated jobs.`)) {
                    handleDeletePersona(persona.id);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{persona.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{persona.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Key Responsibilities</h3>
                    <ul className="space-y-1">
                      {persona.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span className="text-gray-700">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Primary Tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {persona.tools.map((tool, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs for this Persona */}
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Jobs for {persona.name} ({personaJobs.length})
            </h2>
          </div>

          {personaJobs.length > 0 ? (
            <div className="divide-y">
              {personaJobs.map((job) => {
                const totalWeeklyMinutes = job.timePerOccurrence && job.frequency ? (() => {
                  const multiplier = {
                    'daily': 5,
                    'weekly': 1,
                    'monthly': 0.25,
                    'as-needed': 1
                  }[job.frequency] || 1;
                  return job.timePerOccurrence * multiplier;
                })() : 0;

                return (
                  <div key={job.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getJobTypeColor(job.jobType)}`}>
                              {job.jobType.toUpperCase()} JOB
                            </span>
                            {job.timePerOccurrence && job.frequency && (
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span>{job.timePerOccurrence} min</span>
                                <span>•</span>
                                <span className="capitalize">{job.frequency}</span>
                                <span>•</span>
                                <span className="font-medium text-orange-600">
                                  {Math.round(totalWeeklyMinutes)} min/week
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleStartEdit(job)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-900 font-medium leading-relaxed">
                          {job.statement}
                        </p>

                        {/* Job Hierarchy Context */}
                        {(job.bigJobContext || job.littleJobContext) && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Job Hierarchy</p>
                            {job.bigJobContext && (
                              <div className="flex items-start space-x-2">
                                <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-800 border border-purple-200 flex-shrink-0 mt-0.5">
                                  BIG JOB
                                </span>
                                <p className="text-sm text-gray-700">{job.bigJobContext}</p>
                              </div>
                            )}
                            {job.littleJobContext && (
                              <div className="flex items-start space-x-2">
                                <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800 border border-blue-200 flex-shrink-0 mt-0.5">
                                  LITTLE JOB
                                </span>
                                <p className="text-sm text-gray-700">{job.littleJobContext}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 font-medium mb-1">Pain Points</p>
                            <ul className="space-y-1">
                              {job.painPoints.slice(0, 3).map((point, index) => (
                                <li key={index} className="text-gray-600 flex items-start space-x-1">
                                  <span className="text-red-400 mt-1">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p className="text-gray-500 font-medium mb-1">Success Metrics</p>
                            <ul className="space-y-1">
                              {job.successMetrics.slice(0, 3).map((metric, index) => (
                                <li key={index} className="text-gray-600 flex items-start space-x-1">
                                  <span className="text-green-400 mt-1">•</span>
                                  <span>{metric}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p className="text-gray-500 font-medium mb-1">Current Solutions</p>
                            <ul className="space-y-1">
                              {job.currentSolutions.slice(0, 3).map((solution, index) => (
                                <li key={index} className="text-gray-600 flex items-start space-x-1">
                                  <span className="text-blue-400 mt-1">•</span>
                                  <span>{solution}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs created yet</h3>
              <p className="text-gray-600 mb-4">Create jobs for this persona to see them here</p>
              <button
                onClick={() => setActiveView('create-job')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Job
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPersonasOverview = () => (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setActiveView('overview')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Framework</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Personas</h1>
            <p className="text-gray-600">Click on any persona to view their jobs and details</p>
          </div>
          <button
            onClick={() => setActiveView('create-persona')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Persona</span>
          </button>
        </div>
      </div>

      {/* Personas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePersonas.map((persona) => {
          const personaJobs = appState.jobs.filter(job => job.persona === persona.id);
          const isExample = ['sarah-chen', 'marcus-rodriguez', 'alex-kim'].includes(persona.id);

          return (
            <div
              key={persona.id}
              onClick={() => {
                setSelectedPersona(persona.id);
                setActiveView('persona-detail');
              }}
              className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow cursor-pointer relative group"
            >
              {isExample && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 rounded">
                    EXAMPLE
                  </span>
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{persona.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{persona.role}</p>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{persona.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {personaJobs.length} {personaJobs.length === 1 ? 'job' : 'jobs'}
                    </span>
                    <span className="text-blue-600 hover:text-blue-800">
                      View details →
                    </span>
                  </div>

                  {persona.tools.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {persona.tools.slice(0, 3).map((tool, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {tool}
                        </span>
                      ))}
                      {persona.tools.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                          +{persona.tools.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Edit/Delete buttons */}
              <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Add edit persona functionality
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 bg-white rounded shadow-sm"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete ${persona.name}? This will also delete all associated jobs.`)) {
                      handleDeletePersona(persona.id);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 bg-white rounded shadow-sm"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {visiblePersonas.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No personas created yet</h3>
          <p className="text-gray-600 mb-4">Create your first persona to get started</p>
          <button
            onClick={() => setActiveView('create-persona')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Persona</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div>
        {activeView === 'overview' && renderOverview()}
        {activeView === 'create-job' && renderCreateJob()}
        {activeView === 'edit-job' && renderEditJob()}
        {activeView === 'persona-detail' && renderPersonaDetail()}
        {activeView === 'personas-overview' && renderPersonasOverview()}
      </div>
    </div>
  );
}