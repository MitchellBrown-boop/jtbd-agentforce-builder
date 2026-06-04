'use client';

import { useState } from 'react';
import { AppState, JTBDJob, Persona, AgentOpportunity } from '@/lib/types';
import { Sheet, ExternalLink, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ALGOLIA_CONFIG, isAlgoliaDeployment } from '@/lib/algolia-config';

interface GoogleSheetsConnectorProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function GoogleSheetsConnector({ appState, updateAppState }: GoogleSheetsConnectorProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
  const [connectionMethod, setConnectionMethod] = useState<'create' | 'existing'>('create');
  const [error, setError] = useState('');
  const [collaboratorName, setCollaboratorName] = useState('');
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [showCollaboratorForm, setShowCollaboratorForm] = useState(false);

  const createNewSpreadsheet = async () => {
    setIsConnecting(true);
    setError('');

    try {
      // Check if this is Algolia deployment - use pre-created sheet
      if (isAlgoliaDeployment() && ALGOLIA_CONFIG.GOOGLE_SHEET_ID !== 'PASTE_SPREADSHEET_ID_HERE') {
        // Use pre-configured Algolia sheet
        const spreadsheetId = ALGOLIA_CONFIG.GOOGLE_SHEET_ID;
        const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

        setSpreadsheetId(spreadsheetId);
        setSpreadsheetUrl(spreadsheetUrl);

        // Set pre-configured collaborator info
        setCollaboratorName(ALGOLIA_CONFIG.COLLABORATOR_NAME);
        setCollaboratorEmail(ALGOLIA_CONFIG.COLLABORATOR_EMAIL);

        updateAppState({
          googleSheetsConnected: true,
          currentWorkshopId: spreadsheetId
        });

        // Auto-sync initial data
        await syncToSheets(spreadsheetId);

        setIsConnecting(false);
        return;
      }

      // Regular flow for non-Algolia deployments
      const response = await fetch('/api/google-sheets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `JTBD Framework - ${new Date().toLocaleDateString()}`,
          sheet_names: ['Jobs Framework', 'Personas', 'Agent Opportunities', 'Analytics']
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // Google authentication failed
          throw new Error(errorData.message || 'Google authentication failed. Please check server configuration.');
        }
        throw new Error(errorData.details || `Failed to create spreadsheet: ${response.statusText}`);
      }

      const result = await response.json();

      // Check for authentication errors
      if (result.error && result.error.includes('authentication')) {
        throw new Error(result.message || 'Google authentication failed. Please check server configuration.');
      }

      // Parse the spreadsheet info
      const idMatch = result.data.match(/ID: ([a-zA-Z0-9-_]+)/);
      const urlMatch = result.data.match(/URL: (https:\/\/docs\.google\.com\/spreadsheets\/[^\s]+)/);

      if (idMatch && urlMatch) {
        setSpreadsheetId(idMatch[1]);
        setSpreadsheetUrl(urlMatch[1]);

        updateAppState({
          googleSheetsConnected: true,
          currentWorkshopId: idMatch[1]
        });

        // Show collaborator form after successful connection
        setShowCollaboratorForm(true);

        // Auto-sync initial data
        await syncToSheets(idMatch[1]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create spreadsheet');
    } finally {
      setIsConnecting(false);
    }
  };

  const connectExistingSpreadsheet = async () => {
    if (!spreadsheetId) {
      setError('Please enter a valid spreadsheet ID');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Verify the spreadsheet exists and get info
      const response = await fetch('/api/google-sheets/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheet_id: spreadsheetId })
      });

      if (!response.ok) {
        throw new Error('Spreadsheet not found or access denied');
      }

      const result = await response.json();
      setSpreadsheetUrl(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);

      updateAppState({
        googleSheetsConnected: true,
        currentWorkshopId: spreadsheetId
      });

      // Auto-sync current data
      await syncToSheets(spreadsheetId);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to spreadsheet');
    } finally {
      setIsConnecting(false);
    }
  };

  const syncToSheets = async (sheetId?: string) => {
    const targetId = sheetId || appState.currentWorkshopId;
    if (!targetId) return;

    setIsSyncing(true);
    setError('');

    try {
      // Sync Jobs data
      const jobsData = formatJobsForSheets(appState.jobs);
      await syncSheetData(targetId, 'Jobs Framework', jobsData);

      // Sync Personas data
      const personasData = formatPersonasForSheets(appState.personas);
      await syncSheetData(targetId, 'Personas', personasData);

      // Sync Agent Opportunities data
      const agentsData = formatAgentOpportunitiesForSheets(appState.agentOpportunities);
      await syncSheetData(targetId, 'Agent Opportunities', agentsData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const syncSheetData = async (spreadsheetId: string, sheetName: string, data: any[][]) => {
    const response = await fetch('/api/google-sheets/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spreadsheet_id: spreadsheetId,
        sheet_name: sheetName,
        data: data
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to sync ${sheetName} data`);
    }
  };

  const formatJobsForSheets = (jobs: JTBDJob[]): any[][] => {
    const headers = [
      'ID', 'Job Statement', 'Job Type', 'Persona',
      'Pain Points', 'Success Metrics', 'Current Solutions', 'Created', 'Updated'
    ];

    const data = jobs.map(job => [
      job.id,
      job.statement,
      job.jobType.toUpperCase(),
      job.persona,
      job.painPoints.join('\n• '),
      job.successMetrics.join('\n• '),
      job.currentSolutions.join('\n• '),
      job.createdAt.toLocaleDateString(),
      job.updatedAt.toLocaleDateString()
    ]);

    return [headers, ...data];
  };

  const formatPersonasForSheets = (personas: Persona[]): any[][] => {
    const headers = [
      'ID', 'Name', 'Role', 'Description', 'Responsibilities',
      'Pain Points', 'Tools', 'Goals'
    ];

    const data = personas.map(persona => [
      persona.id,
      persona.name,
      persona.role,
      persona.description,
      persona.responsibilities.join('\n• '),
      persona.painPoints.join('\n• '),
      persona.tools.join(', '),
      persona.goals.join('\n• ')
    ]);

    return [headers, ...data];
  };

  const formatAgentOpportunitiesForSheets = (opportunities: AgentOpportunity[]): any[][] => {
    const headers = [
      'ID', 'Name', 'Description', 'Related Jobs', 'Priority',
      'Estimated Impact', 'Technical Requirements', 'Integrations'
    ];

    const data = opportunities.map(opportunity => [
      opportunity.id,
      opportunity.name,
      opportunity.description,
      opportunity.jobIds.join(', '),
      opportunity.priority.toUpperCase(),
      opportunity.estimatedImpact,
      opportunity.technicalRequirements.join('\n• '),
      opportunity.integrations.join(', ')
    ]);

    return [headers, ...data];
  };

  const disconnect = () => {
    updateAppState({
      googleSheetsConnected: false,
      currentWorkshopId: undefined
    });
    setSpreadsheetId('');
    setSpreadsheetUrl('');
    setError('');
  };

  if (appState.googleSheetsConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Connected to Google Sheets</h3>
              <p className="text-sm text-green-600">Ready to share with collaborators</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {spreadsheetUrl && (
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open Sheet</span>
              </a>
            )}

            <button
              onClick={() => syncToSheets()}
              disabled={isSyncing}
              className="flex items-center space-x-1 px-3 py-1 text-sm border border-green-300 text-green-700 rounded hover:bg-green-100 disabled:opacity-50"
            >
              {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sheet className="w-3 h-3" />}
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>

            <button
              onClick={disconnect}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Disconnect
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded p-3 border border-green-100">
            <div className="font-medium text-gray-900">Jobs Framework</div>
            <div className="text-gray-600">{appState.jobs.length} jobs synced</div>
          </div>
          <div className="bg-white rounded p-3 border border-green-100">
            <div className="font-medium text-gray-900">Personas</div>
            <div className="text-gray-600">{appState.personas.length} personas synced</div>
          </div>
          <div className="bg-white rounded p-3 border border-green-100">
            <div className="font-medium text-gray-900">Agent Opportunities</div>
            <div className="text-gray-600">{appState.agentOpportunities.length} agents synced</div>
          </div>
        </div>

        {/* Collaborator Setup Form */}
        {showCollaboratorForm && !collaboratorName && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4">
            <h4 className="font-semibold text-yellow-800 mb-3">👥 Add Collaborator Information</h4>
            <p className="text-sm text-yellow-700 mb-4">Who will you be sharing this JTBD framework with?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Collaborator Name</label>
                <input
                  type="text"
                  value={collaboratorName}
                  onChange={(e) => setCollaboratorName(e.target.value)}
                  placeholder="e.g., Jordan Brown"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Collaborator Email</label>
                <input
                  type="email"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                  placeholder="e.g., jordan@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowCollaboratorForm(false);
                  setCollaboratorName('');
                  setCollaboratorEmail('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (collaboratorName && collaboratorEmail) {
                    setShowCollaboratorForm(false);
                  }
                }}
                disabled={!collaboratorName || !collaboratorEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Collaborator Info
              </button>
            </div>
          </div>
        )}

        {/* Sharing Instructions */}
        {collaboratorName && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
            <h4 className="font-semibold text-blue-800 mb-2">📋 Share with {collaboratorName}:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-700 mb-1">1. Share Google Sheet:</p>
                <p className="text-blue-600">Click "Open Sheet" → Share → Add {collaboratorEmail} with Editor access</p>
              </div>
              <div>
                <p className="font-medium text-blue-700 mb-1">2. Share Website:</p>
                <p className="text-blue-600">Send {collaboratorName} this URL: <code className="bg-blue-100 px-1 rounded text-xs">{typeof window !== 'undefined' ? window.location.origin : 'this website URL'}</code></p>
              </div>
            </div>
            <p className="text-xs text-blue-500 mt-2">
              ✅ {collaboratorName} can then use this app to build the framework, and all changes sync to the shared Google Sheet in real-time!
            </p>
            <button
              onClick={() => {
                setShowCollaboratorForm(true);
                setCollaboratorName('');
                setCollaboratorEmail('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2"
            >
              Change collaborator details
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Sheet className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="font-semibold text-gray-900">Connect Google Sheets</h3>
          <p className="text-sm text-gray-600">Enable live collaboration and data export</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Connection Method Selector */}
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="connectionMethod"
              value="create"
              checked={connectionMethod === 'create'}
              onChange={(e) => setConnectionMethod(e.target.value as 'create' | 'existing')}
              className="mr-2"
            />
            <span className="text-sm">Create new spreadsheet</span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="connectionMethod"
              value="existing"
              checked={connectionMethod === 'existing'}
              onChange={(e) => setConnectionMethod(e.target.value as 'create' | 'existing')}
              className="mr-2"
            />
            <span className="text-sm">Connect existing spreadsheet</span>
          </label>
        </div>

        {connectionMethod === 'existing' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spreadsheet ID or URL
            </label>
            <input
              type="text"
              value={spreadsheetId}
              onChange={(e) => {
                const input = e.target.value;
                // Extract ID from URL if full URL is pasted
                const idMatch = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
                setSpreadsheetId(idMatch ? idMatch[1] : input);
              }}
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste the full Google Sheets URL or just the spreadsheet ID
            </p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={connectionMethod === 'create' ? createNewSpreadsheet : connectExistingSpreadsheet}
            disabled={isConnecting || (connectionMethod === 'existing' && !spreadsheetId)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              connectionMethod === 'create' ? <Plus className="w-4 h-4" /> : <Sheet className="w-4 h-4" />
            )}
            <span>
              {isConnecting
                ? 'Connecting...'
                : connectionMethod === 'create'
                  ? 'Create & Connect'
                  : 'Connect Sheet'
              }
            </span>
          </button>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">What gets synced:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Jobs Framework with all pain points and metrics</li>
            <li>• Persona definitions and characteristics</li>
            <li>• Agent opportunities and technical requirements</li>
            <li>• Real-time updates during workshop sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}