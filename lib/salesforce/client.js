// Salesforce REST API client utility
class SalesforceClient {
  constructor(accessToken, instanceUrl) {
    this.accessToken = accessToken;
    this.instanceUrl = instanceUrl;
    this.apiVersion = 'v60.0';
  }

  async request(endpoint, options = {}) {
    const url = `${this.instanceUrl}/services/data/${this.apiVersion}${endpoint}`;

    const config = {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Salesforce API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Salesforce API request failed:', error);
      throw error;
    }
  }

  // JTBD Job operations
  async createJob(jobData) {
    return this.request('/sobjects/JTBD_Job__c/', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  }

  async getJobs(limit = 100) {
    const fields = [
      'Id', 'Name', 'Job_Statement__c', 'Job_Type__c',
      'Pain_Points__c', 'Success_Metrics__c', 'Current_Solutions__c',
      'Frequency__c', 'Time_Per_Occurrence__c', 'Big_Job_Context__c',
      'Little_Job_Context__c', 'Persona__c', 'CreatedDate', 'LastModifiedDate'
    ].join(',');

    return this.request(`/query/?q=SELECT ${fields} FROM JTBD_Job__c ORDER BY CreatedDate DESC LIMIT ${limit}`);
  }

  async getJob(jobId) {
    const fields = [
      'Id', 'Name', 'Job_Statement__c', 'Job_Type__c',
      'Pain_Points__c', 'Success_Metrics__c', 'Current_Solutions__c',
      'Frequency__c', 'Time_Per_Occurrence__c', 'Big_Job_Context__c',
      'Little_Job_Context__c', 'Persona__c', 'CreatedDate', 'LastModifiedDate'
    ].join(',');

    return this.request(`/query/?q=SELECT ${fields} FROM JTBD_Job__c WHERE Id='${jobId}'`);
  }

  async updateJob(jobId, jobData) {
    return this.request(`/sobjects/JTBD_Job__c/${jobId}`, {
      method: 'PATCH',
      body: JSON.stringify(jobData)
    });
  }

  async deleteJob(jobId) {
    return this.request(`/sobjects/JTBD_Job__c/${jobId}`, {
      method: 'DELETE'
    });
  }

  // JTBD Persona operations
  async createPersona(personaData) {
    return this.request('/sobjects/JTBD_Persona__c/', {
      method: 'POST',
      body: JSON.stringify(personaData)
    });
  }

  async getPersonas(limit = 100) {
    const fields = [
      'Id', 'Name', 'Description__c', 'Role__c', 'Responsibilities__c',
      'Goals__c', 'Pain_Points__c', 'Tools__c', 'CreatedDate', 'LastModifiedDate'
    ].join(',');

    return this.request(`/query/?q=SELECT ${fields} FROM JTBD_Persona__c ORDER BY Name ASC LIMIT ${limit}`);
  }

  async getPersona(personaId) {
    const fields = [
      'Id', 'Name', 'Description__c', 'Role__c', 'Responsibilities__c',
      'Goals__c', 'Pain_Points__c', 'Tools__c', 'CreatedDate', 'LastModifiedDate'
    ].join(',');

    return this.request(`/query/?q=SELECT ${fields} FROM JTBD_Persona__c WHERE Id='${personaId}'`);
  }

  async updatePersona(personaId, personaData) {
    return this.request(`/sobjects/JTBD_Persona__c/${personaId}`, {
      method: 'PATCH',
      body: JSON.stringify(personaData)
    });
  }

  // Agent Opportunity operations
  async createAgentOpportunity(opportunityData) {
    return this.request('/sobjects/Agent_Opportunity__c/', {
      method: 'POST',
      body: JSON.stringify(opportunityData)
    });
  }

  async getAgentOpportunities(limit = 100) {
    const fields = [
      'Id', 'Name', 'Description__c', 'Related_Job__c', 'Priority__c',
      'Estimated_Impact__c', 'Technical_Requirements__c', 'Integrations__c',
      'CreatedDate', 'LastModifiedDate'
    ].join(',');

    return this.request(`/query/?q=SELECT ${fields} FROM Agent_Opportunity__c ORDER BY Priority__c ASC, CreatedDate DESC LIMIT ${limit}`);
  }

  async getAgentOpportunity(opportunityId) {
    const fields = [
      'Id', 'Name', 'Description__c', 'Related_Job__c', 'Priority__c',
      'Estimated_Impact__c', 'Technical_Requirements__c', 'Integrations__c',
      'CreatedDate', 'LastModifiedDate'
    ].join(',');

    return this.request(`/query/?q=SELECT ${fields} FROM Agent_Opportunity__c WHERE Id='${opportunityId}'`);
  }

  // User info
  async getUserInfo() {
    return this.request('/query/?q=SELECT Id, Name, Email, Username FROM User WHERE Id=UserInfo.getUserId()');
  }
}

// Helper function to create client from cookies (for API routes)
export function createSalesforceClientFromCookies(cookies) {
  const accessToken = cookies.sf_access_token;
  const instanceUrl = cookies.sf_instance_url;

  if (!accessToken || !instanceUrl) {
    throw new Error('Salesforce authentication required');
  }

  return new SalesforceClient(accessToken, instanceUrl);
}

// Helper function to check if user is authenticated (for client-side)
export function isAuthenticated(cookies) {
  return !!(cookies.sf_access_token && cookies.sf_instance_url);
}

export default SalesforceClient;