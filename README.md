# JTBD-to-Agentforce Interactive Builder

A comprehensive web application for building Jobs-to-be-Done frameworks and translating them into Agentforce use cases, specifically designed for AMER Mid Market Tech accounts.

![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Overview

Transform customer and employee jobs into powerful Agentforce automation opportunities using authentic Strategyn Jobs-to-be-Done methodology. Built for Solutions Engineers, consultants, and customer success teams working with tech companies like Riverbed, Docker, Riot Games, Moloco, and Algolia.

### Key Features

- **🎓 Learning Mode**: Interactive JTBD methodology training with Strategyn framework
- **🏗️ Building Mode**: Collaborative framework development with Google Sheets integration  
- **📊 Presenting Mode**: Executive dashboards with ROI metrics and visualizations
- **🤖 Agent Opportunities**: Detailed implementation guides for proven Agentforce use cases
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/MitchellBrown-boop/jtbd-agentforce-builder.git

# Navigate to project directory
cd jtbd-agentforce-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the application.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📚 User Guide

### Learning Mode
- **4 Interactive Modules**: JTBD Theory, Needs Framework, Outcome-Driven Innovation, Agentforce Translation
- **Quiz Integration**: Test comprehension with built-in knowledge checks
- **Progress Tracking**: Visual progress indicators across all modules
- **Strategyn Attribution**: Proper credit to Anthony Ulwick's methodology

### Building Mode
- **Persona Management**: Create and manage customer personas
- **Job Creation**: Build JTBD statements using proven templates
- **Google Sheets Integration**: Collaborative framework development
- **Example Data**: Pre-loaded with tech industry examples

### Agent Opportunities
- **Proven Use Cases**: Based on 73%+ success rate implementations
- **Technical Requirements**: Detailed implementation specifications
- **ROI Metrics**: Expected impact and business value
- **Implementation Roadmaps**: Step-by-step deployment guidance

## 🛠️ Customization

### Account-Specific Customization

The framework is designed to be easily customized for different accounts:

1. **Update Configuration** (`src/lib/config.ts`):
   ```typescript
   export const APP_CONFIG = {
     appTitle: 'Your Company JTBD Framework',
     appSubtitle: 'Jobs-to-be-Done + Agentforce Integration',
     // ... other settings
   };
   ```

2. **Replace Sample Data** (`src/data/sample-data.ts`):
   - Update personas to match client roles
   - Customize job examples for specific industry
   - Maintain Learning Mode content (universal methodology)

3. **Branding Updates**:
   - Update colors in `tailwind.config.ts`
   - Replace logos and icons as needed
   - Customize footer attribution

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14.2.35 with TypeScript
- **Styling**: Tailwind CSS with Headless UI components  
- **Icons**: Lucide React
- **Integration**: Google Sheets API (via MCP)
- **Deployment**: Vercel-ready configuration

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── agent-opportunities/ # Agent details page
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # App layout components
│   ├── modes/             # Core application modes
│   └── ui/                # Reusable UI components
├── data/
│   └── sample-data.ts     # Sample personas, jobs, agents
├── lib/
│   ├── config.ts          # App configuration
│   ├── google/            # Google Sheets integration
│   ├── types/             # TypeScript definitions
│   └── utils.ts           # Utility functions
```

## 📊 Agent Opportunities

Based on top-performing Agentforce use cases:

| Agent Type | Success Rate | Primary Use Case |
|------------|-------------|------------------|
| Customer Support Deflection | 73% | Automated inquiry response |
| SDR Research & Qualification | 25%+ conversion | Prospect research automation |
| Slack Operations | 60% faster cycles | Eliminate context switching |
| React Development | 31% faster deployments | Multi-framework support |
| Intelligent Scheduling | 70% time savings | Automated coordination |

## 🤝 Contributing

This project is designed for reuse across different Salesforce accounts and customer engagements.

### Development Guidelines

1. **Maintain Universal Learning Content**: The Learning Mode should remain consistent across all deployments
2. **Customize Building Mode**: Sample data should be tailored for specific accounts/industries  
3. **Preserve Attribution**: Keep Strategyn methodology attribution intact
4. **Test Responsiveness**: Ensure changes work across all device sizes

### Branching Strategy

- `main`: Production-ready code
- `feature/*`: New features and enhancements
- `account/*`: Account-specific customizations

## 📈 Success Metrics

Framework designed around proven outcomes:

- **73% Case Deflection Rate** (Customer Support Agent)
- **60% Faster Deal Cycles** (Slack Operations)  
- **31% Faster Deployments** (React Development)
- **25% Higher Conversion Rates** (SDR Qualification)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👤 Author

**Mitchell Brown**  
Lead Solutions Engineer, Salesforce  
Region: AMER Mid Market | Vertical: Pacific Northwest Tech

- LinkedIn: [Mitchell Brown](https://linkedin.com/in/mitchellbrown-sf)
- Email: mitchell.brown@salesforce.com

## 🙏 Acknowledgments

- **Anthony Ulwick & Strategyn**: Authentic Jobs-to-be-Done methodology
- **Salesforce Agentforce Team**: Use case validation and success metrics
- **AMER Mid Market Tech customers**: Real-world validation and feedback

---

*Built for Salesforce Solutions Engineers to accelerate JTBD discovery and Agentforce implementation planning with mid-market technology companies.*
