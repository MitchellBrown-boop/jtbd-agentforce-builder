// Application configuration for reusable JTBD Framework Builder
// Supports customer-specific branding via environment variables

export const customerConfig = {
  // Customer branding (from environment variables)
  // Note: NEXT_PUBLIC_ prefix required for client-side access
  name: process.env.NEXT_PUBLIC_CUSTOMER_NAME || 'JTBD Framework Builder',
  logoUrl: process.env.NEXT_PUBLIC_CUSTOMER_LOGO_URL || '/logo.png',
  primaryColor: process.env.NEXT_PUBLIC_BRAND_PRIMARY_COLOR || '#2563eb',
  secondaryColor: process.env.NEXT_PUBLIC_BRAND_SECONDARY_COLOR || '#64748b',
  googleSheetsId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '',
  customDomain: process.env.NEXT_PUBLIC_CUSTOM_DOMAIN || 'jtbd-builder.vercel.app'
};

export const appConfig = {
  // App branding (now uses customer config)
  appTitle: `${customerConfig.name} - JTBD Builder`,
  appSubtitle: 'Jobs-to-be-Done + Agentforce Integration',

  // Footer
  footerText: `Built with Jobs-to-be-Done Framework for ${customerConfig.name}`,

  // Default persona for examples
  defaultPersona: {
    name: 'Support Specialist',
    role: 'Customer Support Representative',
    company: customerConfig.name
  },

  // Learning mode
  learningMode: {
    title: 'Learning Mode',
    description: 'Interactive tutorial and JTBD concepts'
  }
};