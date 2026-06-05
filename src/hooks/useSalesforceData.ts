'use client';

import { useState, useEffect } from 'react';
import { JTBDJob, Persona, AgentOpportunity } from '@/lib/types';
import { SalesforceService } from '@/lib/services/salesforceService';
import { useSalesforceAuth } from './useSalesforceAuth';

interface SalesforceDataState {
  jobs: JTBDJob[];
  personas: Persona[];
  agentOpportunities: AgentOpportunity[];
  loading: boolean;
  error: string | null;
}

export function useSalesforceData() {
  const { authenticated } = useSalesforceAuth();
  const [state, setState] = useState<SalesforceDataState>({
    jobs: [],
    personas: [],
    agentOpportunities: [],
    loading: false,
    error: null,
  });

  // Load data when user is authenticated
  useEffect(() => {
    if (authenticated) {
      loadAllData();
    } else {
      // Clear data when not authenticated
      setState(prev => ({
        ...prev,
        jobs: [],
        personas: [],
        agentOpportunities: [],
        loading: false,
        error: null,
      }));
    }
  }, [authenticated]);

  const loadAllData = async () => {
    if (!authenticated) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const data = await SalesforceService.syncAllData();

      setState(prev => ({
        ...prev,
        jobs: data.jobs,
        personas: data.personas,
        agentOpportunities: data.agentOpportunities,
        loading: false,
      }));
    } catch (error) {
      console.error('Error loading Salesforce data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      }));
    }
  };

  // Job operations
  const createJob = async (job: Omit<JTBDJob, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!authenticated) throw new Error('Not authenticated');

    try {
      const newJob = await SalesforceService.createJob(job);
      setState(prev => ({
        ...prev,
        jobs: [...prev.jobs, newJob],
      }));
      return newJob;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  };

  const updateJob = async (id: string, updates: Partial<JTBDJob>) => {
    if (!authenticated) throw new Error('Not authenticated');

    try {
      const updatedJob = await SalesforceService.updateJob(id, updates);
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.map(job => job.id === id ? updatedJob : job),
      }));
      return updatedJob;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  };

  const deleteJob = async (id: string) => {
    if (!authenticated) throw new Error('Not authenticated');

    try {
      await SalesforceService.deleteJob(id);
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.filter(job => job.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  };

  // Persona operations
  const createPersona = async (persona: Omit<Persona, 'id'>) => {
    if (!authenticated) throw new Error('Not authenticated');

    try {
      const newPersona = await SalesforceService.createPersona(persona);
      setState(prev => ({
        ...prev,
        personas: [...prev.personas, newPersona],
      }));
      return newPersona;
    } catch (error) {
      console.error('Error creating persona:', error);
      throw error;
    }
  };

  const updatePersona = async (id: string, updates: Partial<Persona>) => {
    if (!authenticated) throw new Error('Not authenticated');

    try {
      const updatedPersona = await SalesforceService.updatePersona(id, updates);
      setState(prev => ({
        ...prev,
        personas: prev.personas.map(persona => persona.id === id ? updatedPersona : persona),
      }));
      return updatedPersona;
    } catch (error) {
      console.error('Error updating persona:', error);
      throw error;
    }
  };

  const deletePersona = async (id: string) => {
    if (!authenticated) throw new Error('Not authenticated');

    try {
      await SalesforceService.deletePersona(id);
      setState(prev => ({
        ...prev,
        personas: prev.personas.filter(persona => persona.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting persona:', error);
      throw error;
    }
  };

  // Agent Opportunity operations
  const createAgentOpportunity = async (opportunity: Omit<AgentOpportunity, 'id'>) => {
    if (!authenticated) throw new Error('Not authenticated');

    try {
      const newOpportunity = await SalesforceService.createAgentOpportunity(opportunity);
      setState(prev => ({
        ...prev,
        agentOpportunities: [...prev.agentOpportunities, newOpportunity],
      }));
      return newOpportunity;
    } catch (error) {
      console.error('Error creating agent opportunity:', error);
      throw error;
    }
  };

  const updateAgentOpportunity = async (id: string, updates: Partial<AgentOpportunity>) => {
    if (!authenticated) throw new Error('Not authenticated');

    try {
      const updatedOpportunity = await SalesforceService.updateAgentOpportunity(id, updates);
      setState(prev => ({
        ...prev,
        agentOpportunities: prev.agentOpportunities.map(opp => opp.id === id ? updatedOpportunity : opp),
      }));
      return updatedOpportunity;
    } catch (error) {
      console.error('Error updating agent opportunity:', error);
      throw error;
    }
  };

  const deleteAgentOpportunity = async (id: string) => {
    if (!authenticated) throw new Error('Not authenticated');

    try {
      await SalesforceService.deleteAgentOpportunity(id);
      setState(prev => ({
        ...prev,
        agentOpportunities: prev.agentOpportunities.filter(opp => opp.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting agent opportunity:', error);
      throw error;
    }
  };

  return {
    ...state,
    authenticated,
    // Data operations
    loadAllData,
    // Job operations
    createJob,
    updateJob,
    deleteJob,
    // Persona operations
    createPersona,
    updatePersona,
    deletePersona,
    // Agent Opportunity operations
    createAgentOpportunity,
    updateAgentOpportunity,
    deleteAgentOpportunity,
  };
}