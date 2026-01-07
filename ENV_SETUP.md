# Midwestern Bank Admin - Environment Variables

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the API URL in `.env`:**
   - For **Development**: `http://localhost:8000/api`
   - For **Production**: `https://your-production-domain.com/api`

## Environment Variables

### `VITE_API_BASE_URL`
- The base URL for all API requests
- Default: `http://localhost:8000/api`
- Update this for production deployment

## Usage

The environment variables are automatically loaded by Vite when the app starts.

### Development
```bash
npm run dev
```
Uses the `.env` file configuration.

### Production Build
```bash
npm run build
```
Creates an optimized build using the current `.env` settings.

## Example Production Configuration

**.env.production**
```
VITE_API_BASE_URL=https://api.midwesternbank.com/api
```

Then run:
```bash
npm run build
```

This will embed the production API URL into the build.
