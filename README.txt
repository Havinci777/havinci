# Havinci - Frontend README

This is the frontend for Havinci, a serverless email intelligence assistant powered by GPT.

## Features

- ChatGPT-style user interface
- Google OAuth2 authentication
- Real-time chat with GPT-powered responses
- Responsive design for desktop and mobile

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   cd frontend
   pnpm install
   ```
3. Update the API endpoints in `src/App.tsx` if your backend is not running on `http://localhost:3000`
4. Start the development server:
   ```
   pnpm run dev
   ```

## Building for Production

To build the frontend for production:

```
pnpm run build
```

The build output will be in the `dist` directory, which can be deployed to any static hosting service.

## Usage

1. Open the application in your browser
2. Click "Login with Google" to authenticate
3. Grant access to your Gmail account (read-only)
4. Start asking questions about your emails
5. Havinci will search your emails and provide intelligent responses

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
