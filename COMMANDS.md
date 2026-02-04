# Project Commands Reference

## Install Dependencies

```bash
npm install
```

## Development

Start development server (default port 5173):
```bash
npm run dev
```

## Build

Build production version:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Testing

### Unit Tests

Run unit tests:
```bash
npm test
```

Run unit tests (single run):
```bash
npm test -- --run
```

Run unit tests (UI mode):
```bash
npm run test:ui
```

### E2E Tests

Install Playwright browsers (required for first run):
```bash
npx playwright install --with-deps chromium
```

Run E2E tests:
```bash
npm run test:e2e
```

Run E2E tests (UI mode):
```bash
npm run test:e2e:ui
```

View E2E test report:
```bash
npx playwright show-report
```

## Complete Testing Workflow

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps chromium
   ```

3. Run unit tests:
   ```bash
   npm test -- --run
   ```

4. Run E2E tests:
   ```bash
   npm run test:e2e
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

Visit http://localhost:5173 to view the application
