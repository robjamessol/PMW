# PMW - Personal Workout Manager

A workout app project (future iPhone app).

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native** | Cross-platform mobile framework |
| **Expo** | Simplified iOS/Android deployment |
| **TypeScript** | Type-safe JavaScript (best AI tool support) |
| **React Navigation** | Screen navigation |

**Why this stack?**
- TypeScript/JavaScript has the best AI tool compatibility (largest training data)
- Expo simplifies iOS deployment without needing Xcode for development
- React Native is production-proven with massive community support
- Same codebase works for Android if needed later

## Repository Structure

```
docs/
├── design/       # UI/UX design language and visual guidelines
├── flow/         # App flow diagrams and user journey documentation
├── program/      # Workout program data (Excel sheets, program logic)
├── requirements/ # Feature specs and requirements
└── reference/    # Additional reference materials

src/
├── App.tsx           # App entry point
├── components/       # Reusable UI components
├── screens/          # App screens
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── constants/        # App constants (colors, config)
└── assets/           # Images, fonts, icons

assets/               # Root-level media assets
```

## Getting Started

### 1. Upload Planning Documents

Upload your planning documents to the appropriate folders:

| Document | Folder |
|----------|--------|
| Excel workout programs | `docs/program/` |
| Design language / UI guidelines | `docs/design/` |
| App flow descriptions | `docs/flow/` |
| Feature requirements | `docs/requirements/` |
| Everything else | `docs/reference/` |

### 2. Start Development (when ready)

```bash
cd src

# Install dependencies
npm install

# Start development server
npm start

# Run on iOS simulator
npm run ios
```

## Development Status

**Phase: Planning & Documentation**
