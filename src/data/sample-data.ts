import { Persona, JTBDJob, AgentOpportunity, LearningModule } from '@/lib/types';

// Sample data for AMER Mid Market Tech accounts
// Framework developed by Mitchell Brown, Salesforce Solutions Engineer
// Based on top-performing Agentforce use cases with proven success rates

// Sample Personas for AMER Mid Market Tech Accounts
export const defaultPersonas: Persona[] = [
  {
    id: 'sarah-chen',
    name: 'Example: Sarah Chen',
    role: 'Customer Support Manager',
    description: 'Customer support leader at a mid-market tech company managing support operations across multiple channels and working to improve customer experience through automation.',
    responsibilities: [
      'Manage customer support team and escalation processes',
      'Monitor support metrics and customer satisfaction scores',
      'Handle complex technical inquiries and product questions',
      'Coordinate with product and engineering teams on customer feedback',
      'Develop support documentation and knowledge base content'
    ],
    painPoints: [
      'High volume of repetitive customer inquiries during product launches',
      'Support team overwhelmed during peak usage periods',
      'Customers expect immediate answers outside business hours',
      'Difficulty scaling support operations with company growth',
      'Manual knowledge base searches slow down response times'
    ],
    tools: ['Zendesk', 'Salesforce Service Cloud', 'Slack', 'Confluence', 'Postman', 'GitHub'],
    goals: [
      'Achieve 60%+ case deflection through self-service automation',
      'Maintain high customer satisfaction during rapid company scaling',
      'Reduce average response time to under 4 hours',
      'Enable 24/7 support without increasing headcount'
    ]
  },
  {
    id: 'marcus-rodriguez',
    name: 'Example: Marcus Rodriguez',
    role: 'Sales Development Representative',
    description: 'SDR at a fast-growing tech startup focused on qualifying inbound leads and researching prospects for outbound campaigns.',
    responsibilities: [
      'Qualify inbound leads and schedule discovery calls',
      'Research prospect companies and decision makers',
      'Maintain lead scoring and pipeline data in Salesforce',
      'Coordinate with Account Executives on handoff process',
      'Update CRM with call notes and next steps'
    ],
    painPoints: [
      'Spending too much time researching prospects manually',
      'Inconsistent lead qualification across team members',
      'Difficulty prioritizing leads without clear scoring criteria',
      'Context-switching between multiple research tools and databases',
      'Meeting prep takes significant time away from selling activities'
    ],
    tools: ['Salesforce Sales Cloud', 'Outreach', 'ZoomInfo', 'LinkedIn Sales Navigator', 'Slack', 'Calendly'],
    goals: [
      'Increase qualified meeting conversion rate to 25%+',
      'Reduce research time per prospect from 20 to 5 minutes',
      'Improve lead scoring accuracy and consistency',
      'Enable faster handoff to Account Executives with complete context'
    ]
  },
  {
    id: 'alex-kim',
    name: 'Example: Alex Kim',
    role: 'Engineering Manager',
    description: 'Engineering leader at a React-first tech company managing development workflows and looking to integrate business data without leaving developer tools.',
    responsibilities: [
      'Manage engineering team priorities and sprint planning',
      'Review customer-facing feature requests and technical requirements',
      'Coordinate with sales and customer success on technical implementations',
      'Oversee frontend architecture and React component development',
      'Track engineering metrics and team velocity'
    ],
    painPoints: [
      'Context switching between Slack and Salesforce disrupts development flow',
      'Difficulty accessing customer data needed for technical decisions',
      'Forced to rewrite React components in LWC for Salesforce integration',
      'Engineering team resists using Salesforce proprietary development tools',
      'Manual process to understand customer technical requirements'
    ],
    tools: ['React', 'TypeScript', 'Claude Code', 'GitHub', 'Slack', 'Figma', 'Salesforce (reluctantly)'],
    goals: [
      'Build customer experiences without leaving React ecosystem',
      'Access Salesforce data directly in Slack and development tools',
      'Reduce development cycle time by 30%',
      'Maintain engineering team productivity and tool preferences'
    ]
  }
];

// AMER Mid Market Tech Jobs - Based on Top Agentforce Use Cases
export const sampleJobs: JTBDJob[] = [
  {
    id: 'customer-inquiry-deflection',
    statement: 'Example: Respond to common customer product questions and technical inquiries instantly to avoid creating support tickets',
    jobType: 'micro',
    persona: 'sarah-chen',
    painPoints: [
      'High volume of repetitive questions about API integration and feature availability',
      'Customers frustrated by wait times for basic product information',
      'Support team overwhelmed during product launches and high-traffic periods',
      'Knowledge base articles exist but customers struggle to find relevant information'
    ],
    successMetrics: [
      '73% case deflection rate for common product inquiries',
      'Instant response time for customers seeking basic product information',
      '60% reduction in support ticket volume for documentation-available issues',
      '85% customer satisfaction with self-service experience'
    ],
    currentSolutions: [
      'Manual monitoring of support channels during business hours',
      'Copy-paste responses to frequently asked questions',
      'Directing customers to search through extensive documentation'
    ],
    bigJobContext: 'Provide exceptional customer support experience while scaling efficiently with company growth',
    littleJobContext: 'When customers have product questions, I want them to get instant, accurate answers without creating tickets',
    timePerOccurrence: 5,
    frequency: 'daily',
    createdAt: new Date('2026-06-02'),
    updatedAt: new Date('2026-06-02')
  },
  {
    id: 'prospect-research-preparation',
    statement: 'Example: Research prospect company context, stakeholders, and technical requirements before discovery calls',
    jobType: 'micro',
    persona: 'marcus-rodriguez',
    painPoints: [
      'Time-intensive manual research across LinkedIn, company websites, and news sources',
      'Difficult to prioritize prospects without clear qualification scoring criteria',
      'Context-switching between multiple research tools disrupts workflow',
      'Inconsistent research depth leads to poorly prepared discovery calls'
    ],
    successMetrics: [
      'Research time reduced from 20 minutes to 5 minutes per prospect',
      'Meeting preparation quality scores above 90%',
      'Lead qualification consistency improved by 40% across team',
      '25% increase in qualified meeting conversion rate'
    ],
    currentSolutions: [
      'Manual LinkedIn and company website research',
      'Individual ZoomInfo and Sales Navigator searches',
      'Excel tracking sheets for prospect information and notes'
    ],
    bigJobContext: 'Maximize qualified pipeline generation through efficient prospect research and preparation',
    littleJobContext: 'When preparing for prospect calls, I want comprehensive company and stakeholder insights quickly',
    timePerOccurrence: 20,
    frequency: 'daily',
    createdAt: new Date('2026-06-02'),
    updatedAt: new Date('2026-06-02')
  },
  {
    id: 'slack-data-access',
    statement: 'Example: Access customer data and update opportunity information directly from Slack during engineering discussions',
    jobType: 'micro',
    persona: 'alex-kim',
    painPoints: [
      'Context switching from Slack to Salesforce disrupts development workflow',
      'Difficulty accessing customer technical requirements during feature planning',
      'Engineering team resists logging into Salesforce for business context',
      'Manual process to understand customer impact of technical decisions'
    ],
    successMetrics: [
      '60% faster deal context access without leaving Slack',
      'Engineering team engagement with customer data increased by 50%',
      'Context switching reduced from 10+ times per day to zero',
      '30% improvement in technical decision-making speed'
    ],
    currentSolutions: [
      'Manual login to Salesforce when customer context is needed',
      'Asking sales team for customer information via Slack messages',
      'Working without customer context to avoid system switching'
    ],
    bigJobContext: 'Maintain engineering productivity while incorporating customer business context into technical decisions',
    littleJobContext: 'When discussing technical features, I want instant access to customer data without leaving Slack',
    timePerOccurrence: 10,
    frequency: 'as-needed',
    createdAt: new Date('2026-06-02'),
    updatedAt: new Date('2026-06-02')
  },
  {
    id: 'react-salesforce-integration',
    statement: 'Example: Build customer-facing experiences using React components without rewriting everything in Lightning Web Components',
    jobType: 'micro',
    persona: 'alex-kim',
    painPoints: [
      'Forced to rewrite existing React components in LWC for Salesforce integration',
      'Engineering team lacks LWC expertise and resists learning proprietary framework',
      'Significant development time wasted on framework translation rather than features',
      'Inability to leverage existing React component library and design system'
    ],
    successMetrics: [
      'Development cycle time reduced by 31% using existing React components',
      'Zero React-to-LWC rewrites required for customer experiences',
      'Engineering team productivity maintained using preferred tools',
      '2.7x more likely to achieve complete customer view with multi-framework approach'
    ],
    currentSolutions: [
      'Manual rewriting of React components into Lightning Web Components',
      'Building separate React and LWC versions of the same functionality',
      'Avoiding Salesforce integration to keep React ecosystem'
    ],
    bigJobContext: 'Deliver exceptional customer experiences while maintaining engineering team efficiency and tool preferences',
    littleJobContext: 'When building customer features, I want to use React without sacrificing Salesforce data integration',
    createdAt: new Date('2026-06-02'),
    updatedAt: new Date('2026-06-02')
  },
  {
    id: 'lead-qualification-scoring',
    statement: 'Example: Evaluate inbound leads and score them based on qualification criteria to prioritize follow-up activities',
    jobType: 'micro',
    persona: 'marcus-rodriguez',
    painPoints: [
      'Inconsistent lead scoring across team members leads to missed opportunities',
      'Manual evaluation of lead quality takes time away from actual selling',
      'Difficulty prioritizing high-volume inbound leads without clear criteria',
      'No systematic approach to identify highest-value prospects quickly'
    ],
    successMetrics: [
      'Lead qualification consistency improved by 85% across team',
      'Time to identify high-priority leads reduced from hours to minutes',
      'Qualified lead conversion rate increased to 30%+',
      'Systematic scoring eliminates subjective qualification decisions'
    ],
    currentSolutions: [
      'Manual review of lead information and company data',
      'Individual judgment calls on lead quality and priority',
      'Basic BANT qualification through discovery calls'
    ],
    bigJobContext: 'Focus selling effort on highest-value prospects through systematic lead qualification',
    littleJobContext: 'When evaluating leads, I want automated scoring that identifies the best opportunities instantly',
    createdAt: new Date('2026-06-02'),
    updatedAt: new Date('2026-06-02')
  },
  {
    id: 'meeting-scheduling-coordination',
    statement: 'Example: Schedule and coordinate discovery calls with prospects while considering stakeholder availability and preferences',
    jobType: 'micro',
    persona: 'marcus-rodriguez',
    painPoints: [
      'Back-and-forth email coordination for meeting scheduling causes delays',
      'Difficulty coordinating multiple stakeholders across different time zones',
      'Manual calendar management without context about meeting priority',
      'No systematic follow-up for rescheduled or missed meetings'
    ],
    successMetrics: [
      'Meeting coordination time reduced by 70% through automation',
      'Scheduling conflicts eliminated with intelligent calendar management',
      '90% first-time meeting success rate with automated reminders',
      'Personalized scheduling based on prospect history and context'
    ],
    currentSolutions: [
      'Manual back-and-forth email coordination for availability',
      'Calendly links without context or prioritization logic',
      'Individual follow-up for missed meetings and reschedules'
    ],
    bigJobContext: 'Maximize sales team productivity by eliminating administrative coordination tasks',
    littleJobContext: 'When scheduling prospect meetings, I want intelligent coordination that considers priority and context',
    createdAt: new Date('2026-06-02'),
    updatedAt: new Date('2026-06-02')
  }
];

// AI Agent opportunities for AMER Mid Market Tech - Based on Top Agentforce Use Cases
export const sampleAgentOpportunities: AgentOpportunity[] = [
  {
    id: 'customer-support-deflection-agent',
    name: 'Customer Support Deflection Agent',
    description: 'Automatically handles common customer inquiries with instant, accurate responses to reduce support ticket volume by 73%',
    jobIds: ['customer-inquiry-deflection'],
    priority: 'high',
    complexity: 'moderate',
    estimatedImpact: '73% case deflection rate, instant 24/7 customer response, $4M+ cost savings',
    technicalRequirements: ['Knowledge base integration', 'Intent classification', 'Multi-channel deployment'],
    integrations: ['Salesforce Service Cloud', 'Knowledge Base', 'Live Chat', 'Email Support']
  },
  {
    id: 'sdr-research-qualification-agent',
    name: 'SDR Research & Qualification Agent',
    description: 'Combines account research and lead qualification to prepare SDRs with complete prospect context and scoring',
    jobIds: ['prospect-research-preparation', 'lead-qualification-scoring'],
    priority: 'high',
    complexity: 'complex',
    estimatedImpact: '25% increase in qualified meetings, research time reduced from 20 to 5 minutes',
    technicalRequirements: ['Data aggregation', 'Lead scoring algorithms', 'CRM integration', 'External data sources'],
    integrations: ['Salesforce Sales Cloud', 'ZoomInfo', 'LinkedIn Sales Navigator', 'Outreach']
  },
  {
    id: 'slack-operations-agent',
    name: 'Slack Operations Agent',
    description: 'Surfaces Salesforce data and actions directly in Slack, eliminating context switching for engineering teams',
    jobIds: ['slack-data-access'],
    priority: 'high',
    complexity: 'complex',
    estimatedImpact: '60% faster deal cycles, eliminates toggle tax, maintains engineering workflow',
    technicalRequirements: ['Slack MCP Server', 'Headless Experience Layer', 'Sales Cloud MCP tools'],
    integrations: ['Slack', 'Salesforce Sales Cloud', 'Service Cloud', 'MCP Servers']
  },
  {
    id: 'react-development-agent',
    name: 'React Development Agent',
    description: 'Enables React-native development teams to build on Salesforce without LWC rewrites using Multi-Framework support',
    jobIds: ['react-salesforce-integration'],
    priority: 'high',
    complexity: 'complex',
    estimatedImpact: '31% faster deployments, 2.7x more likely to achieve complete customer view',
    technicalRequirements: ['Multi-Framework support', 'React micro-frontends', 'Headless Experience Layer'],
    integrations: ['Salesforce Multi-Framework (GA June \'26)', 'React Components', 'Lightning Platform']
  },
  {
    id: 'intelligent-scheduling-agent',
    name: 'Intelligent Scheduling Agent',
    description: 'Automates meeting coordination with context-aware prioritization and stakeholder preference learning',
    jobIds: ['meeting-scheduling-coordination'],
    priority: 'medium',
    complexity: 'moderate',
    estimatedImpact: '70% reduction in scheduling coordination time, 90% first-time meeting success',
    technicalRequirements: ['Calendar integration', 'Preference learning', 'Multi-party coordination'],
    integrations: ['Calendly', 'Salesforce Calendar', 'Outlook', 'Google Calendar']
  }
];

// Learning modules based on Strategyn's authentic Jobs-to-be-Done framework
export const learningModules: LearningModule[] = [
  {
    id: 'jtbd-basics',
    title: 'Jobs-to-be-Done Theory Fundamentals',
    description: 'Learn foundational Jobs-to-be-Done Theory and why traditional innovation approaches fail',
    content: [
      {
        type: 'text',
        content: 'Jobs-to-be-Done Theory provides a framework for understanding what employees are trying to accomplish. The key insight: people don\'t want products or services - they "hire" them to get a job done. When employees can get their job done 20% better or more cheaply, they will switch to new solutions.'
      },
      {
        type: 'text',
        content: 'Most companies fail at innovation because they use flawed approaches. The "ideas-first" approach generates solutions before understanding the job. The "needs-first" approach attempts to gather needs but lacks a proper framework for defining what a need actually is.'
      },
      {
        type: 'example',
        content: 'Why Traditional Innovation Fails',
        examples: [
          {
            good: 'JTBD Approach: "Employees are trying to get a job done. Let\'s understand that job completely, then create solutions that help them get it done better."',
            bad: 'Ideas-First: "Let\'s brainstorm solutions and test them with employees to see what works."',
            explanation: 'The ideas-first approach is inherently flawed because it starts with solutions rather than understanding what job employees are trying to accomplish. Without knowing the job, companies are essentially guessing, leading to low success rates.'
          }
        ]
      },
      {
        type: 'text',
        content: 'Customers are loyal to getting a job done, not to companies. Focus on the job the employee is trying to execute, not on the employee demographics or product features. This shift in perspective is the foundation of predictable innovation success.'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'According to Jobs-to-be-Done Theory, what is the primary reason innovation projects fail?',
        options: [
          'Companies focus on solutions before understanding what job needs to be done',
          'Not enough budget allocated to research and development',
          'Employees resist change and new technology adoption',
          'Market competition makes differentiation impossible'
        ],
        correctAnswer: 0,
        explanation: 'The ideas-first approach - generating solutions before understanding the underlying job - is the primary cause of innovation failure. Companies guess at solutions without understanding what employees are truly trying to accomplish.'
      }
    ],
    completed: false,
    estimatedMinutes: 8
  },

  {
    id: 'job-framework',
    title: 'Jobs-to-be-Done Needs Framework',
    description: 'Master the framework for categorizing and organizing all types of customer needs',
    content: [
      {
        type: 'text',
        content: 'The Jobs-to-be-Done Needs Framework provides a complete structure for understanding what employees are trying to accomplish. At the center is the Core Functional Job - the overall task the employee is trying to execute.'
      },
      {
        type: 'text',
        content: 'A Core Functional Job has specific steps that employees must execute: Define, Locate, Prepare, Confirm, Execute, Monitor, Modify, and Conclude. Each step has 50-150 desired outcome statements that define success metrics.'
      },
      {
        type: 'example',
        content: 'Core Functional Job Structure',
        examples: [
          {
            good: 'Core Job: "Resolve customer support tickets"\n\nJob Steps:\n• Define: Understand the problem scope\n• Locate: Find relevant information and resources\n• Prepare: Gather tools and access needed\n• Confirm: Validate the approach with stakeholders\n• Execute: Implement the solution\n• Monitor: Track resolution progress\n• Modify: Adjust approach based on results\n• Conclude: Close ticket and document outcome',
            bad: 'Vague Job: "Handle customer issues" with no defined steps or success metrics',
            explanation: 'The structured approach breaks down the core job into measurable steps with clear desired outcomes. This enables companies to identify where employees struggle and design targeted solutions.'
          }
        ]
      },
      {
        type: 'text',
        content: 'Beyond the Core Functional Job, there are Related Jobs (enabling tasks), Emotional Jobs (how employees want to feel), Consumption Chain Jobs (acquisition and setup), and Financial Desired Outcomes (cost and value considerations).'
      }
    ],
    quiz: [
      {
        id: 'q2',
        question: 'In the Jobs-to-be-Done Needs Framework, what should you focus on first when an employee requests a specific solution?',
        options: [
          'Identify the Core Functional Job they are trying to execute',
          'Evaluate the features of their requested solution',
          'Understand their budget and timeline constraints',
          'Ask about their current tools and frustrations'
        ],
        correctAnswer: 0,
        explanation: 'When employees request specific solutions, they have already jumped from the job to a solution. You must first understand the Core Functional Job they are trying to execute before evaluating any solutions.'
      }
    ],
    completed: false,
    estimatedMinutes: 12
  },

  {
    id: 'outcome-driven-innovation',
    title: 'Outcome-Driven Innovation Process',
    description: 'Learn the proven process for predictable innovation with 86% success rate',
    content: [
      {
        type: 'text',
        content: 'Outcome-Driven Innovation (ODI) is a process that enables companies to conceptualize new solutions, helping employees get a job done better and/or more cheaply. It has an 86% success rate because it begins with understanding the job-to-be-done.'
      },
      {
        type: 'text',
        content: 'The ODI process follows ten steps: I. Define the Customer, II. Define the Job-to-be-Done, III. Uncover Customer Needs, IV. Define the Value Proposition, V. Conduct Competitive Analysis, VI. Formulate Innovation Strategy, VII. Formulate Market Strategy, VIII. Target Hidden Growth Opportunities, IX. Formulate Market Strategy, X. Formulate Product Strategy.'
      },
      {
        type: 'example',
        content: 'ODI Success vs Traditional Approach',
        examples: [
          {
            good: 'ODI Approach: First understand what job employees are trying to execute, then identify which needs are unmet, finally create solutions that address those unmet needs with measurable improvement.',
            bad: 'Traditional: Generate solution ideas, test them with employees, iterate based on feedback until something works.',
            explanation: 'ODI starts with the job and uses quantitative research methods to identify underserved needs. Traditional approaches start with ideas and rely on trial-and-error, leading to much lower success rates.'
          }
        ]
      },
      {
        type: 'text',
        content: 'The key insight: customers will switch to new solutions when they can get their job done 20% better or more cheaply. ODI makes this predictable by measuring how well current solutions satisfy each step of the job execution process.'
      }
    ],
    quiz: [
      {
        id: 'q3',
        question: 'What is the key advantage of Outcome-Driven Innovation over traditional innovation approaches?',
        options: [
          'ODI starts with understanding the job-to-be-done and measures unmet needs quantitatively',
          'ODI generates more creative ideas through better brainstorming techniques',
          'ODI involves more customer interviews and focus groups for feedback',
          'ODI uses faster prototyping and testing cycles to validate concepts'
        ],
        correctAnswer: 0,
        explanation: 'ODI\'s advantage comes from starting with the job-to-be-done and using quantitative methods to measure how well current solutions satisfy each need. This creates predictable innovation rather than trial-and-error approaches.'
      }
    ],
    completed: false,
    estimatedMinutes: 15
  },

  {
    id: 'jtbd-to-agentforce',
    title: 'JTBD to Agentforce Translation',
    description: 'Bridge Jobs-to-be-Done methodology with Agentforce use case identification and execution',
    content: [
      {
        type: 'text',
        content: 'Jobs-to-be-Done methodology identifies what customers are fundamentally trying to accomplish. Agentforce provides the AI automation layer to execute those jobs inherently better than humans - faster, more accurate, scalable, and persistent.'
      },
      {
        type: 'text',
        content: 'The critical shift in thinking: Instead of asking "How could agents perform the same roles as humans?" ask "What can agents inherently do better than humans?" This aligns perfectly with JTBD\'s core principle - customers will switch when they can get their job done 20% better or cheaper.'
      },
      {
        type: 'example',
        content: 'JTBD Discovery to Agentforce Execution',
        examples: [
          {
            good: 'JTBD Process: 1) Identify Core Functional Job: "Respond to customer support inquiries" 2) Map Job Steps: Define problem → Locate resources → Prepare response → Execute communication 3) Agentforce Solution: Service Agent handles 24/7 with instant access to knowledge base, consistent responses, and automatic case routing',
            bad: 'Traditional Approach: "We need a chatbot" → Build chatbot → Test with customers → Adjust features based on feedback',
            explanation: 'The JTBD approach starts with understanding the complete job execution process, then designs agents to excel at specific steps where they have inherent advantages over humans.'
          }
        ]
      },
      {
        type: 'text',
        content: 'Agents excel in five functional areas: Administrative Coordinator (scheduling, booking, updates), Knowledge Curator (research, documentation), Insights Analyst (data analysis, forecasting), Personal Concierge (proactive suggestions, customization), and Technical Builder (code, configuration, setup).'
      },
      {
        type: 'text',
        content: 'Use the Agent Opportunity Framework to match jobs to solutions: Conversational Agent (variable triggers, fuzzy inputs, judgment-driven), AI Workflow (precise triggers, mixed inputs, interpretative reasoning), or Deterministic Automation (precise triggers, structured inputs, rule-based reasoning).'
      }
    ],
    quiz: [
      {
        id: 'q4',
        question: 'When translating a JTBD discovery into an Agentforce use case, what should be your primary focus?',
        options: [
          'Identify where agents can execute job steps inherently better than humans',
          'Replace all human tasks with automated agents for maximum efficiency',
          'Build the most technically advanced AI solution possible',
          'Focus on the job steps that are currently working well for humans'
        ],
        correctAnswer: 0,
        explanation: 'The key is identifying specific job steps where agents have inherent advantages (24/7 availability, instant data access, consistency, scalability) rather than trying to replicate human capabilities or replace everything.'
      }
    ],
    completed: false,
    estimatedMinutes: 18
  }
];