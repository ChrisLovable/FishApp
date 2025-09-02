# FishApp 🐟

A modern React-based fishing application with modular components and mobile-first design.

## Features

- **Length-to-Weight Calculator** - Calculate fish weight from length measurements
- **Species Information** - Detailed information about different fish species
- **Personal Gallery** - Store your personal fishing photos and memories
- **Catch Log** - Keep track of your fishing catches and experiences
- **Public Gallery** - Browse and share fishing photos with the community
- **E-book** - Access fishing guides and educational content

## Tech Stack

- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Mobile-first responsive design
- Modular component architecture

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── MainModal.tsx          # Main modal with feature buttons
│   └── buttons/               # Modular button components
│       ├── LengthToWeightButton.tsx
│       ├── SpeciesInfoButton.tsx
│       ├── PersonalGalleryButton.tsx
│       ├── CatchLogButton.tsx
│       ├── PublicGalleryButton.tsx
│       └── EBookButton.tsx
├── App.tsx                    # Main app component
├── main.tsx                   # App entry point
└── index.css                  # Global styles
```

## Design Principles

- **Modular/Refraction Approach**: Each feature button is its own component for maximum reusability
- **Mobile-First**: Designed specifically for mobile devices and PWA usage
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Modern UI**: Gradient backgrounds, smooth animations, and glassmorphism effects
