'use client';

import { useState } from 'react';
import { ArrowLeft, Zap, Target, AlertCircle, CheckCircle, ExternalLink, Settings, Database, Cloud, Smartphone } from 'lucide-react';
import { defaultPersonas, sampleAgentOpportunities } from '@/data/sample-data';
import { AgentOpportunity } from '@/lib/types';

export default function AgentOpportunitiesPage() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<AgentOpportunity | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedOpportunity) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setSelectedOpportunity(null)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Opportunities</span>
            </button>

            <div className="bg-white rounded-lg border p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedOpportunity.name}</h1>
                  <p className="text-lg text-gray-600">{selectedOpportunity.description}</p>
                </div>
                <div className="flex space-x-3">
                  <span className={`px-3 py-1 text-sm rounded-full border ${getPriorityColor(selectedOpportunity.priority)}`}>
                    {selectedOpportunity.priority} priority
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full ${getComplexityColor(selectedOpportunity.complexity)}`}>
                    {selectedOpportunity.complexity}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Expected Impact</h3>
                <p className="text-blue-700">{selectedOpportunity.estimatedImpact}</p>
              </div>
            </div>
          </div>

          {/* Implementation Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Technical Requirements */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-6 h-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Technical Requirements</h2>
              </div>

              <ul className="space-y-3">
                {selectedOpportunity.technicalRequirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* System Integrations */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-6 h-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">System Integrations</h2>
              </div>

              <ul className="space-y-3">
                {selectedOpportunity.integrations.map((integration, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Cloud className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">{integration}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Implementation Roadmap */}
          <div className="mt-8 bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Implementation Roadmap</h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-blue-800">Discovery & Planning (Week 1-2)</h4>
                  <p className="text-blue-700 text-sm mt-1">Define detailed requirements, map data sources, create technical architecture</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-green-800">Agent Development (Week 3-6)</h4>
                  <p className="text-green-700 text-sm mt-1">Build agent script, configure topics and actions, implement integrations</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 border border-purple-200 bg-purple-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-purple-800">Testing & Deployment (Week 7-8)</h4>
                  <p className="text-purple-700 text-sm mt-1">Conduct conversation testing, optimize responses, deploy to production</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready to Build This Agent?</h2>
            <p className="text-gray-600 mb-4">
              This agent opportunity is based on proven Agentforce use cases with documented success metrics.
              Contact your Salesforce team to start implementation planning.
            </p>
            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Start Implementation
              </button>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Download Requirements Doc
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Framework</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Agent Opportunities</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              AI automation opportunities identified from your Jobs-to-be-Done analysis. Each opportunity includes
              implementation details, technical requirements, and proven success metrics.
            </p>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleAgentOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedOpportunity(opportunity)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{opportunity.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{opportunity.description}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(opportunity.priority)}`}>
                    {opportunity.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getComplexityColor(opportunity.complexity)}`}>
                    {opportunity.complexity}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                <p className="text-sm text-green-800 font-medium">Expected Impact</p>
                <p className="text-sm text-green-700">{opportunity.estimatedImpact}</p>
              </div>

              <div className="text-xs text-gray-500">
                <p><span className="font-medium">{opportunity.technicalRequirements.length}</span> technical requirements</p>
                <p><span className="font-medium">{opportunity.integrations.length}</span> system integrations</p>
              </div>
            </div>
          ))}
        </div>

        {sampleAgentOpportunities.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Agent Opportunities Yet</h3>
            <p className="text-gray-600">
              Complete more jobs in Building Mode to generate AI automation recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}