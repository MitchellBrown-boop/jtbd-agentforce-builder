# Jobs To Be Done Interactive Builder

## Project Overview

**Reusable JTBD Framework Application**  
Generic Jobs-to-be-Done framework builder with authentic Strategyn methodology integration.  
Designed for cross-account use by SEs and consultants.

## Current Status

✅ **Production Ready:** Fully functional reusable application  
🎯 **Location:** `/workspace/projects/Jobs To Be Done/`  
🌐 **Running at:** http://localhost:3001  

## Key Features

### Learning Mode (100% Reusable)
- Authentic Strategyn JTBD methodology from Anthony Ulwick
- 3 interactive learning modules:
  - JTBD Theory Fundamentals 
  - JTBD Needs Framework
  - Outcome-Driven Innovation Process
- Proper Strategyn attribution (https://strategyn.com/jobs-to-be-done/)

### Building Mode (Configurable)
- JTBD framework creation tools
- Contains sample data (Jordan Brown/Algolia examples for demo)
- Easily customizable via `src/lib/config.ts`

### Additional Modes
- Facilitating Mode: Workshop planning tools
- Presenting Mode: Executive dashboards

## Technical Architecture

**Stack:** Next.js 14.2.35 + TypeScript + Tailwind CSS  
**Integration:** Google Sheets (via MCP) for collaborative framework building  
**Configuration:** `src/lib/config.ts` for easy customization

## Usage for SE Work

### Account Customization
1. Update `src/lib/config.ts` with client branding
2. Replace sample data in Building Mode with client-specific personas/jobs
3. Maintain Learning Mode content (universal Strategyn framework)

### Demo Scenarios
- **Learning:** Teach authentic JTBD methodology to stakeholders
- **Building:** Collaborative framework development with customers
- **Presenting:** Executive-level JTBD insights and outcomes

## Development Commands

```bash
npm run dev     # Start development server
npm run build   # Production build
npm run start   # Production server
```

## Portfolio Value

- **LinkedIn Content:** Reusable SE innovation framework
- **GitHub Showcase:** Professional JTBD implementation
- **Client Conversations:** Demonstrates methodical approach to customer needs

## Files to Customize Per Account

- `src/lib/config.ts` - Branding and labels
- `src/data/sample-data.ts` - Building mode examples (keep Learning mode unchanged)
- `src/components/modes/building-mode.tsx` - Account-specific personas/jobs

---

**Note:** This is the cross-account master version. Account-specific customizations should be done in branches or account folders to preserve the reusable baseline.