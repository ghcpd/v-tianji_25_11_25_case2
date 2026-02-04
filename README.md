# Nutrition Tracker

A modern nutrition tracking web application built with React + TypeScript + Vite.

## Features

- 📝 Log meals (breakfast, lunch, dinner, snacks)
- 🔥 View daily calorie statistics
- 📊 View weekly calorie statistics
- 📈 Last 7 days calorie trend chart
- 💾 Local storage data persistence

## Tech Stack

- React 18
- TypeScript
- Vite
- Recharts (chart library)
- date-fns (date handling)
- Vitest (unit testing)
- Playwright (E2E testing)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will start at http://localhost:5173

## Build

```bash
npm run build
```

## Testing

### Run Unit Tests

```bash
npm test
```

### Run E2E Tests

```bash
npm run test:e2e
```

## Project Structure

```
nutrition-tracker/
├── src/
│   ├── components/      # React components
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── test/           # Test configuration
│   └── App.tsx         # Main application component
├── e2e/                # E2E tests
└── public/             # Static assets
```
