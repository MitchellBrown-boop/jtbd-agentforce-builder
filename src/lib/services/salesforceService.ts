import { JTBDJob, Persona, AgentOpportunity } from '@/lib/types';

const API_BASE = '/api';

export class SalesforceService {
  // Jobs API
  static async getJobs(): Promise<JTBDJob[]> {
    const response = await fetch(`${API_BASE}/jobs`);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    return response.json();
  }

  static async createJob(job: Omit<JTBDJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<JTBDJob> {
    const response = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error('Failed to create job');
    }
    return response.json();
  }

  static async updateJob(id: string, job: Partial<JTBDJob>): Promise<JTBDJob> {
    const response = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error('Failed to update job');
    }
    return response.json();
  }

  static async deleteJob(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete job');
    }
  }

  // Personas API
  static async getPersonas(): Promise<Persona[]> {
    const response = await fetch(`${API_BASE}/personas`);
    if (!response.ok) {
      throw new Error('Failed to fetch personas');
    }
    return response.json();
  }

  static async createPersona(persona: Omit<Persona, 'id'>): Promise<Persona> {
    const response = await fetch(`${API_BASE}/personas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(persona),
    });
    if (!response.ok) {
      throw new Error('Failed to create persona');
    }
    return response.json();
  }

  static async updatePersona(id: string, persona: Partial<Persona>): Promise<Persona> {
    const response = await fetch(`${API_BASE}/personas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(persona),
    });
    if (!response.ok) {
      throw new Error('Failed to update persona');
    }
    return response.json();
  }

  static async deletePersona(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/personas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete persona');
    }
  }

  // Agent Opportunities API
  static async getAgentOpportunities(): Promise<AgentOpportunity[]> {
    const response = await fetch(`${API_BASE}/opportunities`);
    if (!response.ok) {
      throw new Error('Failed to fetch agent opportunities');
    }
    return response.json();
  }

  static async createAgentOpportunity(opportunity: Omit<AgentOpportunity, 'id'>): Promise<AgentOpportunity> {
    const response = await fetch(`${API_BASE}/opportunities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(opportunity),
    });
    if (!response.ok) {
      throw new Error('Failed to create agent opportunity');
    }
    return response.json();
  }

  static async updateAgentOpportunity(id: string, opportunity: Partial<AgentOpportunity>): Promise<AgentOpportunity> {
    const response = await fetch(`${API_BASE}/opportunities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(opportunity),
    });
    if (!response.ok) {
      throw new Error('Failed to update agent opportunity');
    }
    return response.json();
  }

  static async deleteAgentOpportunity(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/opportunities/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete agent opportunity');
    }
  }

  // Bulk sync - load all data at once
  static async syncAllData(): Promise<{
    jobs: JTBDJob[];
    personas: Persona[];
    agentOpportunities: AgentOpportunity[];
  }> {
    const [jobs, personas, agentOpportunities] = await Promise.all([
      this.getJobs(),
      this.getPersonas(),
      this.getAgentOpportunities(),
    ]);

    return {
      jobs,
      personas,
      agentOpportunities,
    };
  }
}