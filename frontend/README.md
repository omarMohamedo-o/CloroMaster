# ChloroMaster - Professional Sustainable Solutions Website

A modern, professional website for ChloroMaster, a sustainable solutions company. Built with React, Framer Motion, and Tailwind CSS, featuring smooth animations and a responsive design.

## 🚀 Features

### ✨ Professional Design
- **Modern UI/UX**: Clean, professional design with gradient backgrounds and glass morphism effects
- **Responsive Layout**: Fully responsive design that works on all devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Custom Scrollbar**: Branded scrollbar with gradient styling

### 🎭 Advanced Animations
- **Framer Motion**: Smooth, professional animations throughout the site
- **Scroll-triggered Animations**: Elements animate as they come into view
- **Hover Effects**: Interactive hover animations on cards, buttons, and links
- **Floating Elements**: Subtle floating animations for visual appeal
- **Staggered Animations**: Sequential animations for lists and grids

### 📱 Interactive Components
- **Animated Navigation**: Smooth mobile menu with slide animations
- **Contact Form**: Professional form with validation and success states
- **Service Filtering**: Interactive service category filtering
- **Scroll-to-Top**: Animated scroll-to-top button
- **Social Media Links**: Animated social media icons

### 🎨 Visual Enhancements
- **Gradient Text**: Brand-colored gradient text effects
- **Background Decorations**: Animated background elements
- **Card Hover Effects**: Elevated cards with shadow animations
- **Icon Animations**: Rotating and scaling icon effects
- **Loading States**: Professional loading spinners and states

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks and functional components
- **Framer Motion**: Professional animation library
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Comprehensive icon library
- **React Scroll**: Smooth scrolling navigation
- **AOS**: Scroll animation library (legacy support)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CloroMaster
   ```

2. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🏗️ Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Animated navigation with mobile menu
│   │   ├── Hero.jsx            # Hero section with floating elements
│   │   ├── ServicesGrid.jsx    # Interactive services with filtering
│   │   ├── About.jsx           # About section with feature cards
│   │   ├── ContactForm.jsx     # Contact form with validation
│   │   └── Footer.jsx          # Footer with social links
│   ├── data/
│   │   └── services.js         # Services data
│   ├── App.jsx                 # Main app component
│   ├── index.js                # React entry point
│   └── index.css               # Global styles and utilities
├── package.json
└── tailwind.config.js
```

## 🎯 Key Components

### Hero Section
- Animated background elements
- Floating cards with hover effects
- Staggered text animations
- Interactive call-to-action buttons
- Statistics with spring animations

### Services Grid
- Category filtering with smooth transitions
- Card hover animations
- Icon rotations and scaling
- AnimatePresence for smooth filtering

### Contact Form
- Form validation with visual feedback
- Loading states with spinners
- Success message animations
- Contact information cards

### Navigation
- Smooth scroll navigation
- Mobile menu with slide animations
- Dark mode toggle with rotation
- Scroll-based background changes

## 🎨 Customization

### Colors
The brand color is defined in CSS variables:
```css
:root {
  --brand: #40E0D0;
}
```

### Animations
Custom animations are defined in `index.css`:
- `animate-float`: Floating animation
- `animate-pulse-glow`: Pulsing glow effect
- `gradient-text`: Gradient text utility

### Styling
- Tailwind CSS classes for styling
- Custom CSS utilities for special effects
- Responsive design with mobile-first approach

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌙 Dark Mode

Dark mode is implemented with:
- CSS custom properties for theme switching
- Smooth transitions between themes
- Persistent theme preference
- Dark mode specific styling

## 🚀 Performance Optimizations

- **Lazy Loading**: Images and components load as needed
- **Optimized Animations**: Hardware-accelerated animations
- **Minimal Bundle**: Tree-shaking and code splitting
- **Efficient Re-renders**: React.memo and useMemo where appropriate

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please contact:
- Email: info@chloromaster.com
- Phone: +20 3 486 0034

---

**ChloroMaster** - Leading the green revolution with innovative sustainable solutions.
