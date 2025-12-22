const config = {
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || '/api',
    timeout: 30000,
  },

  // App Configuration
  app: {
    name: 'ChloroMaster',
    description: 'Engineering, Contracting & Supplies - Water Treatment & Chlorination Systems',
    version: '1.0.0',
  },

  // Contact Configuration
  contact: {
    email: 'ChloroMaster@outlook.sa',
    phone: '+20 12 22155310',
    address: '58 Mahaliya 1 - Second District, Obour - Qalyubia',
    addressLink: 'https://maps.google.com/?q=58+Mahaliya+1+Second+District+Obour+Qalyubia+Egypt',
    workingHours: {
      weekdays: 'Sunday - Wednesday: 9:00 AM - 6:00 PM',
      saturday: 'Saturday: 9:00 AM - 2:00 PM',
    },
  },

  // Features Configuration
  features: {
    darkMode: true,
    animations: true,
    contactForm: true,
    services: true,
  },
};

export default config;
