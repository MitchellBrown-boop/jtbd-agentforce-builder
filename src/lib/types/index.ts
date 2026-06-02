// JTBD Framework Types
export interface JTBDJob {
  id: string;
  statement: string;
  jobType: 'big' | 'little' | 'micro';
  persona: string;
  painPoints: string[];
  successMetrics: string[];
  currentSolutions: string[];
  agentOpportunity?: AgentOpportunity;
  bigJobContext?: string; // For micro jobs, shows the Big Job they support
  littleJobContext?: string; // For micro jobs, shows the Little Job they're part of
  timePerOccurrence?: number; // Minutes spent per occurrence
  frequency?: 'daily' | 'weekly' | 'monthly' | 'as-needed'; // How often this job occurs
  createdAt: Date;
  updatedAt: Date;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  responsibilities: string[];
  painPoints: string[];
  tools: string[];
  goals: string[];
}

export interface AgentOpportunity {
  id: string;
  name: string;
  description: string;
  jobIds: string[];
  priority: 'high' | 'medium' | 'low';
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedImpact: string;
  technicalRequirements: string[];
  integrations: string[];
}

// Application Modes
export type AppMode = 'learning' | 'building' | 'facilitating' | 'presenting';

export interface AppState {
  currentMode: AppMode;
  jobs: JTBDJob[];
  personas: Persona[];
  agentOpportunities: AgentOpportunity[];
  googleSheetsConnected: boolean;
  currentWorkshopId?: string;
}

// Learning Mode Types
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  content: LearningContent[];
  quiz?: QuizQuestion[];
  completed: boolean;
  estimatedMinutes?: number;
}

export interface LearningContent {
  type: 'text' | 'example' | 'interactive' | 'video';
  content: string;
  examples?: JTBDExample[];
}

export interface JTBDExample {
  good: string;
  bad: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Workshop Mode Types
export interface WorkshopSession {
  id: string;
  name: string;
  participants: Participant[];
  jobs: JTBDJob[];
  status: 'setup' | 'active' | 'review' | 'completed';
  createdAt: Date;
}

export interface Participant {
  id: string;
  name: string;
  role: string;
  contributions: string[];
}

// Presentation Mode Types
export interface PresentationView {
  mode: 'executive' | 'detailed' | 'technical';
  selectedJobs?: string[];
}

// Google Sheets Integration Types
export interface SheetsConfig {
  spreadsheetId: string;
  worksheetName: string;
  range: string;
}

export interface SheetsData {
  jobs: any[][];
  personas: any[][];
  agents: any[][];
}