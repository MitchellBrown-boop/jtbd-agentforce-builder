import { Persona, JTBDJob, AgentOpportunity, LearningModule } from '@/lib/types';

// Sample data for AMER Mid Market Tech accounts
// Framework developed by Mitchell Brown, Salesforce Solutions Engineer
// Based on top-performing Agentforce use cases with proven success rates

// Sample Personas for AMER Mid Market Tech Accounts
export const defaultPersonas: Persona[] = [
  {
    id: 'sarah-chen',
    name: 'Customer Support Manager',
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
    name: 'Sales Development Representative',
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
    name: 'Engineering Manager',
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
    statement: 'Respond to common customer product questions and technical inquiries instantly to avoid creating support tickets',
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
    statement: 'Research prospect company context, stakeholders, and technical requirements before discovery calls',
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
    statement: 'Access customer data and update opportunity information directly from Slack during engineering discussions',
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
    statement: 'Build customer-facing experiences using React components without rewriting everything in Lightning Web Components',
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
    timePerOccurrence: 120,
    frequency: 'weekly',
    createdAt: new Date('2026-06-02'),
    updatedAt: new Date('2026-06-02')
  },
  {
    id: 'lead-qualification-scoring',
    statement: 'Evaluate inbound leads and score them based on qualification criteria to prioritize follow-up activities',
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
    timePerOccurrence: 15,
    frequency: 'daily',
    createdAt: new Date('2026-06-02'),
    updatedAt: new Date('2026-06-02')
  },
  {
    id: 'meeting-scheduling-coordination',
    statement: 'Schedule and coordinate discovery calls with prospects while considering stakeholder availability and preferences',
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
    timePerOccurrence: 25,
    frequency: 'daily',
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
        content: 'Jobs-to-be-Done Theory provides a framework for understanding what customers are fundamentally trying to accomplish. The key insight: people don\'t want products or services - they "hire" them to get a job done. When customers can get their job done 20% better or more cheaply, they will switch to new solutions.'
      },
      {
        type: 'text',
        content: 'Most companies fail at innovation because they use flawed approaches. The "ideas-first" approach generates solutions before understanding the job. The "needs-first" approach attempts to gather needs but lacks a proper framework for defining what a need actually is. The "technology-first" approach builds capabilities without knowing what job they should help execute.'
      },
      {
        type: 'text',
        content: 'Traditional market research methods are fundamentally flawed. Focus groups ask what customers want, but customers can\'t articulate needs they don\'t know exist. Demographic segmentation groups people by who they are, not what they\'re trying to accomplish. Satisfaction surveys measure how well current solutions work, not what customers are ultimately trying to achieve.'
      },
      {
        type: 'example',
        content: 'Why Traditional Innovation Fails',
        examples: [
          {
            good: 'JTBD Approach: "Customers are trying to get a job done. Let\'s understand that job completely, then create solutions that help them get it done better."',
            bad: 'Ideas-First: "Let\'s brainstorm solutions and test them with customers to see what works."',
            explanation: 'The ideas-first approach is inherently flawed because it starts with solutions rather than understanding what job customers are trying to accomplish. Without knowing the job, companies are essentially guessing, leading to low success rates.'
          }
        ]
      },
      {
        type: 'text',
        content: 'Customers are loyal to getting a job done, not to companies. This creates both opportunity and threat: when a better solution emerges that helps customers get their job done significantly better, they will switch regardless of brand loyalty. Focus on the job the customer is trying to execute, not on customer demographics or product features.'
      },
      {
        type: 'text',
        content: 'The "20% rule" is critical: customers will switch to new solutions when they can get their job done 20% better OR 20% more cheaply. This threshold represents the minimum improvement required to overcome switching costs, learning curves, and the inertia of current solutions.'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'According to Jobs-to-be-Done Theory, what percentage improvement is typically required for customers to switch to a new solution?',
        options: [
          '10% better or cheaper',
          '20% better or cheaper',
          '50% better or cheaper',
          'Any improvement, regardless of size'
        ],
        correctAnswer: 1,
        explanation: 'The "20% rule" states that customers will switch to new solutions when they can get their job done 20% better OR 20% more cheaply. This threshold overcomes switching costs and inertia.'
      },
      {
        id: 'q1b',
        question: 'What is the fundamental flaw with demographic segmentation in traditional market research?',
        options: [
          'Demographics change too frequently to be useful for planning',
          'Demographic data is expensive and difficult to collect accurately',
          'Demographics describe who people are, not what they\'re trying to accomplish',
          'Demographics only work for consumer markets, not B2B environments'
        ],
        correctAnswer: 2,
        explanation: 'Demographic segmentation groups people by who they are (age, income, role) rather than what they\'re trying to accomplish. People with the same demographics often have completely different jobs-to-be-done, making demographic segments less useful for innovation.'
      }
    ],
    completed: false,
    estimatedMinutes: 12
  },

  {
    id: 'job-framework',
    title: 'Jobs-to-be-Done Needs Framework',
    description: 'Master the framework for categorizing and organizing all types of customer needs',
    content: [
      {
        type: 'text',
        content: 'The Jobs-to-be-Done Needs Framework provides a complete structure for understanding what customers are trying to accomplish. At the center is the Core Functional Job - the overall task the customer is trying to execute. This job remains stable over time, while solutions evolve.'
      },
      {
        type: 'text',
        content: 'A Core Functional Job has a universal structure with specific steps: Define, Locate, Prepare, Confirm, Execute, Monitor, Modify, and Conclude. Each step contains 50-150 desired outcome statements that define success metrics. These outcomes are directional (faster, more accurate, more convenient) and measurable.'
      },
      {
        type: 'text',
        content: 'Desired outcomes follow a specific format: "[Direction of improvement] + [metric] + [object of control] + [contextual clarifier]". For example: "Minimize the time it takes to locate relevant customer information when preparing for a support call." This precision enables quantitative measurement of customer satisfaction with current solutions.'
      },
      {
        type: 'example',
        content: 'Core Functional Job Structure',
        examples: [
          {
            good: 'Core Job: "Resolve customer support tickets"\n\nJob Steps:\n• Define: Understand the problem scope\n• Locate: Find relevant information and resources\n• Prepare: Gather tools and access needed\n• Confirm: Validate the approach with stakeholders\n• Execute: Implement the solution\n• Monitor: Track resolution progress\n• Modify: Adjust approach based on results\n• Conclude: Close ticket and document outcome\n\nSample Outcomes:\n• "Minimize the time it takes to understand the customer\'s core issue"\n• "Increase the likelihood of finding relevant solution documentation"\n• "Minimize the effort required to access necessary tools and systems"',
            bad: 'Vague Job: "Handle customer issues" with no defined steps or success metrics',
            explanation: 'The structured approach breaks down the core job into measurable steps with clear desired outcomes. This enables companies to identify where customers struggle and design targeted solutions.'
          }
        ]
      },
      {
        type: 'text',
        content: 'Beyond the Core Functional Job, there are four additional job types: Related Jobs (prerequisite tasks like "plan the communication strategy"), Emotional Jobs (how customers want to feel, like "feel confident in the solution"), Consumption Chain Jobs (acquisition, setup, storage, maintenance, disposal), and Financial Desired Outcomes (reduce cost, increase value, minimize financial risk).'
      },
      {
        type: 'text',
        content: 'The power of this framework lies in completeness and stability. Core functional jobs remain constant while solutions change. By understanding the complete job with all its steps and desired outcomes, companies can innovate systematically rather than hoping to stumble upon the right solution.'
      }
    ],
    quiz: [
      {
        id: 'q2',
        question: 'What is the correct format for writing a desired outcome statement?',
        options: [
          'Customer want + feature description + benefit explanation',
          'Problem statement + current solution + ideal solution',
          'Direction of improvement + metric + object of control + contextual clarifier',
          'Job step + pain point + success criteria + measurement method'
        ],
        correctAnswer: 2,
        explanation: 'Desired outcomes follow the specific format: "[Direction of improvement] + [metric] + [object of control] + [contextual clarifier]" to ensure they are directional, measurable, and actionable.'
      },
      {
        id: 'q2b',
        question: 'Which of the following represents the universal job steps that appear in every Core Functional Job?',
        options: [
          'Plan, Research, Decide, Purchase, Implement, Evaluate, Maintain',
          'Define, Locate, Prepare, Confirm, Execute, Monitor, Modify, Conclude',
          'Discover, Analyze, Design, Build, Test, Deploy, Support, Retire',
          'Identify, Assess, Select, Acquire, Configure, Operate, Optimize'
        ],
        correctAnswer: 1,
        explanation: 'Every Core Functional Job follows the universal structure: Define, Locate, Prepare, Confirm, Execute, Monitor, Modify, and Conclude. This consistency enables systematic analysis across different jobs and industries.'
      }
    ],
    completed: false,
    estimatedMinutes: 16
  },

  {
    id: 'outcome-driven-innovation',
    title: 'Outcome-Driven Innovation Process',
    description: 'Learn the proven process for predictable innovation with 86% success rate',
    content: [
      {
        type: 'text',
        content: 'Outcome-Driven Innovation (ODI) is Strategyn\'s proprietary process that enables companies to conceptualize breakthrough solutions, helping customers get jobs done significantly better and/or more cheaply. It achieves an 86% success rate because it begins with understanding the job-to-be-done rather than generating ideas.'
      },
      {
        type: 'text',
        content: 'The ODI process follows ten systematic steps: I. Define the Job Executor, II. Define the Job-to-be-Done, III. Uncover Customer Needs (desired outcomes), IV. Define the Value Proposition, V. Conduct Competitive Analysis, VI. Formulate Innovation Strategy, VII. Define Customer Segments, VIII. Target Hidden Growth Opportunities, IX. Formulate Market Strategy, X. Formulate Product Strategy.'
      },
      {
        type: 'text',
        content: 'The critical insight is quantitative measurement of unmet needs. ODI uses statistical analysis to measure both the importance of each desired outcome (how much it matters to customers) and satisfaction with current solutions (how well existing options deliver). The "opportunity score" combines these: Importance + (Importance - Satisfaction) = Opportunity.'
      },
      {
        type: 'text',
        content: 'Underserved outcomes (high importance, low satisfaction) represent innovation opportunities. Overserved outcomes (lower importance, high satisfaction) indicate where companies are over-investing in features customers don\'t value. Appropriately served outcomes show competitive parity where differentiation is difficult.'
      },
      {
        type: 'example',
        content: 'ODI Success vs Traditional Approach',
        examples: [
          {
            good: 'ODI Approach: 1) Map complete job with 50-150 desired outcomes 2) Survey 500+ customers to quantify importance/satisfaction 3) Identify underserved outcomes with highest opportunity scores 4) Design solutions targeting those specific unmet needs with measurable improvement',
            bad: 'Traditional: Generate solution ideas through brainstorming → Test concepts with 8-12 customers in focus groups → Iterate based on qualitative feedback → Launch and hope for adoption',
            explanation: 'ODI uses quantitative research with large sample sizes to identify precisely which needs are unmet. Traditional approaches rely on small-sample qualitative research that often produces misleading insights about what customers truly value.'
          }
        ]
      },
      {
        type: 'text',
        content: 'The power of ODI lies in predictability. By measuring exactly which outcomes matter most and are least satisfied, companies can prioritize innovation investments with confidence. This systematic approach removes guesswork and politics from product decisions, replacing them with customer-driven data.'
      },
      {
        type: 'text',
        content: 'ODI also reveals hidden market segments based on unmet needs rather than demographics. Customers who struggle with the same outcomes often represent viable segments regardless of their age, company size, or industry. This needs-based segmentation often uncovers underserved markets that traditional demographic analysis misses.'
      }
    ],
    quiz: [
      {
        id: 'q3',
        question: 'In Outcome-Driven Innovation, how is an "opportunity score" calculated?',
        options: [
          'Market size multiplied by competitive advantage potential',
          'Customer willingness to pay minus current solution cost',
          'Technical feasibility rating plus market demand assessment',
          'Importance + (Importance - Satisfaction)'
        ],
        correctAnswer: 3,
        explanation: 'The opportunity score formula is Importance + (Importance - Satisfaction). This identifies outcomes that matter to customers (high importance) but aren\'t well-served by current solutions (low satisfaction).'
      },
      {
        id: 'q3b',
        question: 'What characterizes an "underserved" outcome in ODI research?',
        options: [
          'High importance to customers, high satisfaction with current solutions',
          'Low importance to customers, low satisfaction with current solutions',
          'High importance to customers, low satisfaction with current solutions',
          'Low importance to customers, high satisfaction with current solutions'
        ],
        correctAnswer: 2,
        explanation: 'Underserved outcomes have high importance (customers care about them) but low satisfaction (current solutions don\'t deliver well). These represent the best innovation opportunities.'
      }
    ],
    completed: false,
    estimatedMinutes: 20
  },

  {
    id: 'jtbd-to-agentforce',
    title: 'JTBD to Agentforce Translation',
    description: 'Bridge Jobs-to-be-Done methodology with Agentforce use case identification and execution',
    content: [
      {
        type: 'text',
        content: 'Jobs-to-be-Done methodology reveals what customers are fundamentally trying to accomplish, while Agentforce provides AI automation to execute those jobs inherently better than humans - faster, more accurate, infinitely scalable, and persistently available. The combination creates predictable innovation in AI use cases.'
      },
      {
        type: 'text',
        content: 'The critical shift in thinking: Instead of asking "How could agents perform the same roles as humans?" ask "What can agents inherently do better than humans?" This aligns perfectly with JTBD\'s core principle - customers will switch when they can get their job done 20% better or cheaper. Agents provide that improvement through capabilities humans cannot match.'
      },
      {
        type: 'text',
        content: 'Agent advantages include: instant access to complete organizational knowledge, 24/7 availability without fatigue, perfect memory and consistency, simultaneous processing of multiple requests, emotion-neutral interactions, and integration across all systems. These capabilities make agents inherently superior for specific job steps, not general human replacement.'
      },
      {
        type: 'example',
        content: 'JTBD Discovery to Agentforce Execution',
        examples: [
          {
            good: 'JTBD Process: 1) Core Job: "Respond to customer support inquiries" 2) Map Steps: Define problem → Locate resources → Prepare response → Execute communication 3) Identify Agent Advantages: instant knowledge access, 24/7 availability, consistent responses 4) Agentforce Solution: Service Agent handles routine inquiries with contextual case routing for complex issues',
            bad: 'Traditional Approach: "We need a chatbot" → Build chatbot → Test with customers → Add features based on complaints → Hope for adoption',
            explanation: 'The JTBD approach starts with understanding the complete job, then identifies where agents have inherent advantages, finally designs solutions that leverage those strengths rather than trying to replicate human capabilities.'
          }
        ]
      },
      {
        type: 'text',
        content: 'Agents excel in five functional excellence areas: Administrative Coordinator (scheduling, booking, status updates), Knowledge Curator (research, documentation, information synthesis), Insights Analyst (data analysis, pattern recognition, forecasting), Personal Concierge (proactive recommendations, personalization), and Technical Builder (code generation, configuration, system setup).'
      },
      {
        type: 'text',
        content: 'Use the Agent Opportunity Framework to match jobs to implementation approaches: Conversational Agent (variable triggers, natural language inputs, judgment-driven responses), AI Workflow (precise triggers, mixed data inputs, interpretative reasoning), or Deterministic Automation (precise triggers, structured inputs, rule-based logic). Each approach serves different job complexity levels.'
      },
      {
        type: 'text',
        content: 'Success metrics should align with JTBD outcomes: measure how much better agents help customers get jobs done, not just technical performance. Track time savings, accuracy improvements, availability increases, and cost reductions. The goal is demonstrable improvement in job execution, not impressive AI capabilities.'
      },
      {
        type: 'text',
        content: 'The JTBD-to-Agentforce translation process creates systematic innovation: understand the complete job, identify underserved outcomes, design agent solutions targeting those specific needs, measure improvement against the 20% threshold. This approach produces agents that customers actually adopt rather than impressive technology they ignore.'
      }
    ],
    quiz: [
      {
        id: 'q4',
        question: 'According to the JTBD-to-Agentforce framework, what makes an agent use case most likely to succeed?',
        options: [
          'Using the most advanced AI technology available',
          'Replacing human workers to reduce operational costs',
          'Targeting job steps where agents have inherent advantages over humans',
          'Building conversational interfaces that mimic human interactions'
        ],
        correctAnswer: 2,
        explanation: 'Success comes from identifying specific job steps where agents have inherent advantages (24/7 availability, instant data access, perfect consistency, infinite scalability) rather than trying to replicate human capabilities or focusing on technology advancement for its own sake.'
      },
      {
        id: 'q4b',
        question: 'In the Agent Opportunity Framework, which implementation approach is best suited for jobs with variable triggers and natural language inputs?',
        options: [
          'Deterministic Automation (precise triggers, structured inputs, rule-based logic)',
          'AI Workflow (precise triggers, mixed inputs, interpretative reasoning)',
          'Conversational Agent (variable triggers, fuzzy inputs, judgment-driven)',
          'Technical Builder (system integration, code generation, configuration)'
        ],
        correctAnswer: 2,
        explanation: 'Conversational Agents are designed for variable triggers and natural language (fuzzy) inputs that require judgment-driven responses. This matches scenarios where customers interact naturally rather than following structured processes.'
      }
    ],
    completed: false,
    estimatedMinutes: 25
  }
];