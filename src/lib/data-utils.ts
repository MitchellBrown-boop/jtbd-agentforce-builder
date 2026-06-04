import { Persona, JTBDJob, AgentOpportunity } from './types';
import { defaultPersonas, sampleJobs, sampleAgentOpportunities } from '@/data/sample-data';

// Utility functions to filter out sample data when real user data exists

export function getVisiblePersonas(allPersonas: Persona[]): Persona[] {
  // Get personas that are not in the default sample set (real user data)
  const realPersonas = allPersonas.filter(persona =>
    !defaultPersonas.some(sample => sample.id === persona.id)
  );

  // If there are real personas, show only real personas
  // If no real personas exist, show sample personas as examples
  return realPersonas.length > 0 ? realPersonas : allPersonas;
}

export function getVisibleJobs(allJobs: JTBDJob[]): JTBDJob[] {
  // Get jobs that are not in the sample set (real user data)
  const realJobs = allJobs.filter(job =>
    !sampleJobs.some(sample => sample.id === job.id)
  );

  // If there are real jobs, show only real jobs
  // If no real jobs exist, show sample jobs as examples
  return realJobs.length > 0 ? realJobs : allJobs;
}

export function getVisibleAgentOpportunities(allOpportunities: AgentOpportunity[]): AgentOpportunity[] {
  // Get opportunities that are not in the sample set (real user data)
  const realOpportunities = allOpportunities.filter(opportunity =>
    !sampleAgentOpportunities.some(sample => sample.id === opportunity.id)
  );

  // If there are real opportunities, show only real opportunities
  // If no real opportunities exist, show sample opportunities as examples
  return realOpportunities.length > 0 ? realOpportunities : allOpportunities;
}

// Helper function to check if we're showing sample data (for UI indicators)
export function isShowingSampleData(allPersonas: Persona[], allJobs: JTBDJob[], allOpportunities: AgentOpportunity[]) {
  const realPersonas = allPersonas.filter(persona =>
    !defaultPersonas.some(sample => sample.id === persona.id)
  );
  const realJobs = allJobs.filter(job =>
    !sampleJobs.some(sample => sample.id === job.id)
  );
  const realOpportunities = allOpportunities.filter(opportunity =>
    !sampleAgentOpportunities.some(sample => sample.id === opportunity.id)
  );

  return realPersonas.length === 0 && realJobs.length === 0 && realOpportunities.length === 0;
}