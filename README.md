# FishApp 🐟

**Your Complete Fishing Companion** - A modern Progressive Web App (PWA) that combines AI-powered fish identification, comprehensive fishing tools, and community features in a mobile-first design.

## 🌟 Key Features

### 🔍 **AI Fish Identification**
- **OpenAI Vision API Integration**: Take a photo and get instant fish species identification
- **Multiple Species Suggestions**: Get alternative species matches with confidence scores
- **Detailed Species Information**: Access comprehensive data about identified fish
- **Image Processing**: Automatic image compression and optimization for better results

### 📏 **Length-to-Weight Calculator**
- **Scientific Formulas**: Accurate weight calculations based on fish length
- **Multiple Species Support**: Different calculation formulas for various fish types
- **Real-time Results**: Instant calculations as you input measurements
- **Unit Conversion**: Support for different measurement units

### 🐠 **Species Information Database**
- **Comprehensive Database**: Detailed information on South African fish species
- **Visual Guides**: High-quality images and distribution maps
- **Fishing Tips**: Bait recommendations, best fishing times, and techniques
- **Conservation Status**: Information about protected species and regulations

### 📱 **Personal Catches Gallery**
- **Photo Management**: Store and organize your fishing photos
- **Catch Details**: Record species, weight, length, location, and notes
- **Local Storage**: Secure local storage of your personal fishing memories
- **Image Optimization**: Automatic image compression and resizing

### 🌐 **Public Gallery & Community**
- **Community Sharing**: Share your catches with the fishing community
- **Location-Based Reports**: See what's biting where in real-time
- **Supabase Integration**: Cloud-based storage and sharing
- **Social Features**: Like, comment, and interact with other anglers

### 🎣 **What's Biting Where?**
- **Real-Time Reports**: Live catch reports from fishing locations
- **130+ South African Locations**: Comprehensive database of fishing spots
- **GPS Integration**: Automatic location capture and nearby reports
- **Filtering System**: Filter by species, location, date, and more
- **Spot Names**: Custom location names for specific fishing spots

### 🌊 **Tide & Moon Information**
- **Tide Predictions**: Accurate tide times and heights
- **Moon Phases**: Current moon phase and fishing impact
- **Weather Integration**: Current weather conditions
- **Fishing Calendar**: Best fishing times based on lunar cycles

### 🏆 **Competition Points System**
- **Species Scoring**: Points based on fish species rarity and size
- **Leaderboards**: Track your ranking against other anglers
- **Achievement System**: Unlock badges and milestones
- **Seasonal Competitions**: Monthly and yearly fishing challenges

### 📚 **E-Book Sales**
- **Fishing Guide**: Comprehensive South African fishing guide
- **Digital & Physical Options**: E-book (R25) and hard copy (R100)
- **Email Integration**: Automated purchase request system
- **Professional Templates**: Beautiful email templates for orders

### 🔐 **User Onboarding & Security**
- **Email Verification**: Secure user registration with OTP verification
- **PWA Installation**: Seamless app installation on all devices
- **Database Backup**: Robust user data management in Supabase
- **Device Tracking**: PWA installation status and device information

## 🛠️ Technical Stack

### **Frontend**
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and building
- **Tailwind CSS** for responsive, utility-first styling
- **PWA** with service worker for offline functionality
- **Progressive Web App** features for native app experience

### **Backend & Database**
- **Supabase** for database, authentication, and real-time features
- **PostgreSQL** with custom functions and triggers
- **Row Level Security (RLS)** for data protection
- **Storage** for images and file management
- **Real-time subscriptions** for live updates

### **External Services**
- **OpenAI Vision API** for AI-powered fish identification
- **Email Services** (SendGrid/Mailgun) for verification codes
- **Geolocation API** for location-based features
- **Weather APIs** for tide and weather information

### **PWA Features**
- **Service Worker** for offline functionality and caching
- **Web App Manifest** for native app installation
- **Custom Icons** with creative fishing-themed design
- **Push Notifications** ready for future features
- **App Shortcuts** for quick access to main features

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Supabase account for database
- OpenAI API key for fish identification
- Email service API key (optional for development)

### **Installation**

1. **Clone the repository:**
```bash
git clone <repository-url>
cd FishApp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_EMAIL_API_KEY=your_email_service_api_key
```

4. **Set up the database:**
Run the SQL migrations in your Supabase dashboard:
- `create-users-table.sql` - User management and verification
- `create-catch-reports-table.sql` - Catch reports and location data
- `create-public-gallery-storage.sql` - Public gallery and storage

5. **Start the development server:**
```bash
npm run dev
```

6. **Build for production:**
```bash
npm run build
```

## 📁 Project Structure

```
FishApp/
├── public/
│   ├── icon-192x192.svg          # PWA app icon (192x192)
│   ├── icon-512x512.svg          # PWA app icon (512x512)
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service worker
│   ├── browserconfig.xml         # Windows tile configuration
│   └── images/                   # Static images and assets
├── src/
│   ├── components/
│   │   ├── MainModal.tsx         # Main app interface
│   │   ├── OnboardingFlow.tsx    # User onboarding system
│   │   ├── PWAInstallPrompt.tsx  # PWA installation prompt
│   │   ├── buttons/              # Feature button components
│   │   │   ├── IdentifyFishButton.tsx
│   │   │   ├── LengthToWeightButton.tsx
│   │   │   ├── SpeciesInfoButton.tsx
│   │   │   ├── PersonalGalleryButton.tsx
│   │   │   ├── PublicGalleryButton.tsx
│   │   │   ├── WhatsBitingButton.tsx
│   │   │   ├── CompetitionPointsButton.tsx
│   │   │   ├── TideAndMoonButton.tsx
│   │   │   └── EBookButton.tsx
│   │   └── modals/               # Feature modal components
│   │       ├── IdentifyFishModal.tsx
│   │       ├── LengthToWeightModal.tsx
│   │       ├── SpeciesInfoModal.tsx
│   │       ├── PersonalGalleryModal.tsx
│   │       ├── PublicGalleryModal.tsx
│   │       ├── WhatsBitingModal.tsx
│   │       ├── CompetitionPointsModal.tsx
│   │       ├── TideAndMoonModal.tsx
│   │       ├── EBookModal.tsx
│   │       └── EmailVerificationModal.tsx
│   ├── config/
│   │   └── supabase.ts           # Supabase configuration
│   ├── utils/
│   │   ├── openaiVision.ts       # OpenAI Vision API integration
│   │   └── emailService.ts       # Email service utilities
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # App entry point
│   └── App.css                   # Global styles
├── create-users-table.sql        # User management database schema
├── create-catch-reports-table.sql # Catch reports database schema
├── create-public-gallery-storage.sql # Public gallery database schema
├── PRODUCTION-SETUP.md          # Production deployment guide
└── README.md                    # This file
```

## 🎨 Design Principles

### **Mobile-First Approach**
- **Responsive Design**: Optimized for mobile devices with touch-friendly interfaces
- **PWA Features**: Native app experience with offline capabilities
- **Touch Gestures**: Swipe, tap, and pinch-to-zoom support
- **Performance**: Fast loading and smooth animations

### **User Experience**
- **Intuitive Navigation**: Simple, clear interface with logical flow
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Visual Feedback**: Loading states, success messages, and error handling
- **Progressive Enhancement**: Works on all devices, enhanced on modern browsers

### **Modern UI/UX**
- **Glassmorphism Effects**: Modern glass-like design elements
- **Gradient Backgrounds**: Beautiful color transitions and depth
- **Smooth Animations**: Micro-interactions and transitions
- **Consistent Branding**: Cohesive color scheme and typography

## 🔧 Core Functionality Details

### **Fish Identification System**
```typescript
// AI-powered identification with OpenAI Vision API
const identifyFish = async (imageFile: File) => {
  const result = await openaiVision.identifyFish(imageFile)
  return {
    species: result.species,
    confidence: result.confidence,
    alternatives: result.alternatives
  }
}
```

### **Database Schema**
```sql
-- Users table for authentication and PWA tracking
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  email_verified BOOLEAN,
  verification_code VARCHAR(6),
  pwa_installed BOOLEAN,
  device_info JSONB
);

-- Catch reports for community sharing
CREATE TABLE catch_reports (
  id UUID PRIMARY KEY,
  species VARCHAR(100),
  length_cm NUMERIC,
  weight_kg NUMERIC,
  location VARCHAR(100),
  spot_name VARCHAR(100),
  latitude NUMERIC,
  longitude NUMERIC,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP
);
```

### **PWA Configuration**
```json
{
  "name": "FishApp - Your Complete Fishing Companion",
  "short_name": "FishApp",
  "display": "standalone",
  "background_color": "#1e3a8a",
  "theme_color": "#1d4ed8",
  "icons": [
    {
      "src": "/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    }
  ]
}
```

## 🌍 Location Coverage

### **South African Fishing Spots (130+ Locations)**
- **Western Cape**: Cape Town, Hermanus, Gansbaai, Mossel Bay, Knysna
- **Eastern Cape**: Port Elizabeth, East London, Jeffreys Bay, Port Alfred
- **KwaZulu-Natal**: Durban, Richards Bay, Ballito, Umhlanga
- **Northern Cape**: Port Nolloth, Hondeklip Bay, Kleinzee
- **And many more coastal locations with GPS coordinates**

## 📊 Performance & Analytics

### **Key Metrics Tracked**
- User registration and verification rates
- PWA installation success rates
- Feature usage statistics
- Fish identification accuracy
- Community engagement metrics

### **Performance Optimizations**
- **Image Compression**: Automatic optimization for faster loading
- **Lazy Loading**: Components loaded on demand
- **Caching**: Service worker caching for offline functionality
- **Code Splitting**: Modular loading for better performance

## 🔒 Security & Privacy

### **Data Protection**
- **Row Level Security**: Database-level access control
- **Email Verification**: Secure user registration process
- **HTTPS Only**: All communications encrypted
- **No Personal Data Storage**: Minimal data collection policy

### **Privacy Features**
- **Local Storage**: Personal catches stored locally
- **Optional Sharing**: Users choose what to share publicly
- **Data Anonymization**: Community data anonymized
- **GDPR Compliance**: Privacy-first approach

## 🚀 Deployment

### **Production Ready**
- **Environment Configuration**: Separate dev/prod environments
- **Database Migrations**: Automated schema updates
- **Error Handling**: Comprehensive error tracking
- **Monitoring**: Performance and usage analytics

### **Hosting Options**
- **Vercel**: Recommended for React apps
- **Netlify**: Great for static sites with functions
- **AWS/GCP**: For enterprise deployments
- **Self-hosted**: Docker containerization support

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **Code Standards**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Testing**: Unit and integration tests

## 📞 Support & Contact

- **Email**: support@fishapp.com
- **Documentation**: See `PRODUCTION-SETUP.md` for detailed setup
- **Issues**: Use GitHub issues for bug reports
- **Features**: Submit feature requests via GitHub

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Ready to start fishing?** 🎣 Install FishApp today and join the community of passionate anglers!
