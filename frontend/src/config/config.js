const config = {
  // API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
  },
  
  // App Configuration
  app: {
    name: 'ChloroMaster',
    description: 'Sustainable Design and Eco Consulting Services',
    version: '1.0.0',
  },
  
  // Contact Configuration
  contact: {
    email: 'info@chloromaster.com',
    phone: '+20 3 486 0034',
    address: '336 El Geish Road, Royal Plaza, Building D, Mezzanine floor, Gleem 21500, Alexandria, Egypt',
    workingHours: {
      weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
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
