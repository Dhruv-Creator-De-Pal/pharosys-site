# Pharosys - Modern React Dashboard

A modern, responsive website for Pharosys - an offline-first gym operations platform. Built with React, Tailwind CSS, and Framer Motion for smooth premium animations.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or pnpm package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will be available at `http://localhost:5173`

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── SplashScreen.jsx      # Boot sequence animation
│   │   ├── Navigation.jsx         # Top navigation bar
│   │   ├── Hero.jsx               # Hero section with dashboard demo
│   │   ├── FeatureCards.jsx       # Reusable feature cards
│   │   ├── MetricsSection.jsx     # Key metrics display
│   │   ├── CTA.jsx                # Call-to-action section
│   │   └── Footer.jsx             # Footer component
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles & Tailwind
├── index.html                     # HTML entry point
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
└── package.json                   # Project dependencies

```

## ✨ Features

### Splash Screen
- Animated boot sequence on first visit
- Simulates system startup with cascading status messages
- Animated background with twinkling stars
- Smooth fade-out transition to main content
- Session-aware (shows only on first load per session)

### Hero Section
- Modern headline with responsive typography
- Dashboard mockup with system status display
- Feature pills with status indicators
- Hover animations and smooth transitions

### Feature Sections
- Three feature card sections (Features, Reliability, Security)
- Staggered animations on scroll reveal
- Hover lift effects on cards
- Grid layout that adapts to mobile/tablet/desktop

### Metrics Display
- Key performance indicators with animated counters
- Responsive grid layout
- Hover scale effects

### Animations
- **Framer Motion** for all animations
- Scroll-reveal animations (enter viewport = animate)
- Staggered children animations
- Smooth page transitions
- Parallax and glow effects
- Micro-interactions on hover

### Design System
- **Colors**: Dark navy theme with orange and cyan accents
- **Typography**: Space Grotesk font family
- **Spacing**: Consistent padding/margin scale
- **Shadows**: Layered shadow effects for depth
- **Borders**: 1px border with rgba opacity for glass effect

## 🎨 Tailwind Integration

The project uses custom Tailwind configuration with:
- Extended color palette matching Pharosys brand colors
- Custom animations and keyframes
- Responsive typography scale
- Dark mode by default

### Custom Color Tokens
- `navy-dark`: #070b1d (main background)
- `orange`: #ff6b1a (accent)
- `cyan`: #5be1ff (secondary accent)
- `text-primary`: #e9ecff (main text)
- `text-muted`: #9aa4c5 (secondary text)

## 🔧 Configuration Files

### vite.config.js
- React plugin for JSX support
- Development server on port 5173
- Production build optimization with code splitting

### tailwind.config.js
- Extended theme configuration
- Custom animations
- Dark theme colors
- CSS function support

### postcss.config.js
- Tailwind and Autoprefixer integration

## 📝 CSS Classes

Common utility classes used throughout:
- `.btn`, `.btn-primary`, `.btn-ghost` - Button styles
- `.card` - Card component with gradient and glow
- `.chip` - Inline pill badges
- `.glass` - Glass morphism effect

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` directory with:
- Minified CSS and JavaScript
- Code splitting for vendor and animation libraries
- Optimized assets with gzip compression

### Deploy to Server
The `dist/` folder contains all static files ready to serve:

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Apache/PHP Hosting:**
The `.htaccess` file (if present) handles routing.

### Performance Metrics
Build output shows:
- `dist/index.html`: ~0.88 kB (gzip: 0.49 kB)
- `dist/assets/index.css`: ~16.69 kB (gzip: 4.04 kB)
- `dist/assets/vendor.js`: ~133.93 kB (gzip: 43.13 kB)
- `dist/assets/animations.js`: ~108.95 kB (gzip: 36.91 kB)

## 🔍 Browser Support

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📦 Dependencies

### Production
- **react** (18.2.0) - UI framework
- **react-dom** (18.2.0) - DOM renderer
- **framer-motion** (10.16.12) - Animation library

### Development  
- **vite** (5.0.8) - Build tool
- **@vitejs/plugin-react** (4.2.1) - React plugin
- **tailwindcss** (3.3.6) - Utility CSS
- **postcss** (8.4.32) - CSS processing
- **autoprefixer** (10.4.16) - Vendor prefixes

## 🎯 Next Steps

To customize the site:

1. **Update Content**: Edit component files in `src/components/`
2. **Modify Colors**: Update `tailwind.config.js` theme section
3. **Change Animations**: Adjust Framer Motion variants in components
4. **Add Pages**: Create new sections and components as needed
5. **Update Media**: Replace images/logos in `assets/media/`

## 📞 Support

For issues or questions about the Pharosys platform, contact:
- Email: hello@pharosys.com
- Security: security@pharosys.com

## 📄 License

© 2026 Pharosys. All rights reserved.
