// Salesforce sync endpoint - background data sync
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed - use POST' });
  }

  try {
    const { jobs, personas, agentOpportunities } = req.body;

    console.log('Syncing to Salesforce:', {
      jobs: jobs?.length || 0,
      personas: personas?.length || 0,
      opportunities: agentOpportunities?.length || 0
    });

    // Get access token using Client Credentials flow
    const tokenResponse = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SALESFORCE_CLIENT_ID,
        client_secret: process.env.SALESFORCE_CLIENT_SECRET
      })
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Salesforce authentication failed:', error);
      return res.status(500).json({
        success: false,
        error: 'Salesforce authentication failed',
        message: error
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const results = {
      jobs: { created: 0, updated: 0, errors: [] },
      personas: { created: 0, updated: 0, errors: [] },
      agentOpportunities: { created: 0, updated: 0, errors: [] }
    };

    // Helper function to make Salesforce API calls
    const salesforceApi = {
      query: async (soql) => {
        const response = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v60.0/query?q=${encodeURIComponent(soql)}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`SOQL query failed: ${error}`);
        }

        return response.json();
      },

      create: async (sobjectType, data) => {
        const response = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v60.0/sobjects/${sobjectType}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Create ${sobjectType} failed: ${error}`);
        }

        return response.json();
      },

      update: async (sobjectType, data) => {
        const { Id, ...updateData } = data;
        const response = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v60.0/sobjects/${sobjectType}/${Id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Update ${sobjectType} failed: ${error}`);
        }

        return response.status === 204 ? { success: true } : response.json();
      }
    };

    // Sync Jobs
    if (jobs && jobs.length > 0) {
      for (const job of jobs) {
        try {
          const salesforceJob = {
            Name: job.statement.substring(0, 80), // Salesforce Name field limit
            Job_Statement__c: job.statement,
            Job_Type__c: job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1),
            Persona__c: job.persona,
            Pain_Points__c: job.painPoints.join('\n'),
            Success_Metrics__c: job.successMetrics ? job.successMetrics.join('\n') : '',
            Current_Solutions__c: job.currentSolutions ? job.currentSolutions.join('\n') : '',
            Big_Job_Context__c: job.bigJobContext || '',
            Little_Job_Context__c: job.littleJobContext || '',
            Time_Per_Occurrence__c: job.timePerOccurrence || null,
            Frequency__c: job.frequency || null
          };

          // Check if record already exists
          const existingJobs = await salesforceApi.query(
            `SELECT Id FROM JTBD_Job__c WHERE Name = '${job.statement.substring(0, 80).replace(/'/g, "\\'")}'`
          );

          if (existingJobs.records.length > 0) {
            await salesforceApi.update('JTBD_Job__c', {
              Id: existingJobs.records[0].Id,
              ...salesforceJob
            });
            results.jobs.updated++;
          } else {
            await salesforceApi.create('JTBD_Job__c', salesforceJob);
            results.jobs.created++;
          }
        } catch (error) {
          console.error('Error syncing job:', error);
          results.jobs.errors.push({ job: job.statement, error: error.message });
        }
      }
    }

    // Sync Personas
    if (personas && personas.length > 0) {
      for (const persona of personas) {
        try {
          const salesforcePersona = {
            Name: persona.name,
            Role__c: persona.role,
            Description__c: persona.description,
            Responsibilities__c: persona.responsibilities ? persona.responsibilities.join('\n') : '',
            Pain_Points__c: persona.painPoints ? persona.painPoints.join('\n') : '',
            Tools__c: persona.tools ? persona.tools.join('\n') : '',
            Goals__c: persona.goals ? persona.goals.join('\n') : ''
          };

          const existingPersonas = await salesforceApi.query(
            `SELECT Id FROM JTBD_Persona__c WHERE Name = '${persona.name.replace(/'/g, "\\'")}'`
          );

          if (existingPersonas.records.length > 0) {
            await salesforceApi.update('JTBD_Persona__c', {
              Id: existingPersonas.records[0].Id,
              ...salesforcePersona
            });
            results.personas.updated++;
          } else {
            await salesforceApi.create('JTBD_Persona__c', salesforcePersona);
            results.personas.created++;
          }
        } catch (error) {
          console.error('Error syncing persona:', error);
          results.personas.errors.push({ persona: persona.name, error: error.message });
        }
      }
    }

    // Sync Agent Opportunities
    if (agentOpportunities && agentOpportunities.length > 0) {
      for (const opportunity of agentOpportunities) {
        try {
          const salesforceOpportunity = {
            Name: opportunity.name,
            Description__c: opportunity.description,
            Priority__c: opportunity.priority.charAt(0).toUpperCase() + opportunity.priority.slice(1),
            Estimated_Impact__c: opportunity.estimatedImpact || '',
            Technical_Requirements__c: opportunity.technicalRequirements ? opportunity.technicalRequirements.join('\n') : '',
            Integrations__c: opportunity.integrations ? opportunity.integrations.join('\n') : ''
          };

          const existingOpportunities = await salesforceApi.query(
            `SELECT Id FROM Agent_Opportunity__c WHERE Name = '${opportunity.name.replace(/'/g, "\\'")}'`
          );

          if (existingOpportunities.records.length > 0) {
            await salesforceApi.update('Agent_Opportunity__c', {
              Id: existingOpportunities.records[0].Id,
              ...salesforceOpportunity
            });
            results.agentOpportunities.updated++;
          } else {
            await salesforceApi.create('Agent_Opportunity__c', salesforceOpportunity);
            results.agentOpportunities.created++;
          }
        } catch (error) {
          console.error('Error syncing agent opportunity:', error);
          results.agentOpportunities.errors.push({ opportunity: opportunity.name, error: error.message });
        }
      }
    }

    console.log('Salesforce sync completed:', results);

    return res.status(200).json({
      success: true,
      message: 'Data synced to Salesforce successfully',
      results
    });

  } catch (error) {
    console.error('Salesforce sync failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to sync to Salesforce',
      message: error.message
    });
  }
}