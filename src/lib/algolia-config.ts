// Algolia-specific configuration
// Pre-created Google Sheet that bypasses creation permission issues

export const ALGOLIA_CONFIG = {
  // Pre-created spreadsheet in FY27/Algolia/JTBD folder
  GOOGLE_SHEET_ID: '1tqd3Pj9QC3IoYCNr_3MHFZz6N0S3076ns5XXzHbms5I',

  // Pre-configured collaborator info
  COLLABORATOR_NAME: 'Algolia Team',
  COLLABORATOR_EMAIL: 'team@algolia.com', // Replace with actual email

  // Sheet configuration
  SHEET_NAMES: [
    'Jobs Framework',
    'Personas',
    'Agent Opportunities',
    'Analytics'
  ],

  // Folder path (for display only)
  FOLDER_PATH: 'FY27/Algolia/JTBD'
};

// Check if this is the Algolia deployment
export function isAlgoliaDeployment(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if URL contains algolia-specific domain or path
  const hostname = window.location.hostname;
  return hostname.includes('algolia') ||
         hostname.includes('algolia-jtbd') ||
         window.location.pathname.includes('/algolia');
}