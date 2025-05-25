# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Commands

### Development
```bash
# Start the development server on http://localhost:3000
npm run dev

# Build the application for production
npm run build

# Start the production server
npm run start

# Run linting
npm run lint

# Generate/update Sensay API SDK from OpenAPI schema
npm run generate-sdk
```

## Project Architecture

This is a Next.js application that demonstrates integration with the Sensay AI API through a chat interface.

### Key Components

1. **Chat Interface**: Located at `src/components/ChatInterface.tsx`, this component provides the main UI for interacting with the Sensay AI API, including:
   - Managing chat messages and state
   - Handling streaming chat responses
   - API key configuration
   - Error handling

2. **Sensay SDK**: Generated TypeScript client for the Sensay API
   - Located in `src/sensay-sdk/`
   - Automatically generated using OpenAPI TypeScript Codegen
   - Provides typed interfaces for API interactions

3. **App Structure**:
   - `src/app/page.tsx`: Main page with tabbed interface for chat demo and code examples
   - `src/components/CodeBlock.tsx`: Component for rendering code examples
   - `src/components/RedeemKeyModal.tsx`: Modal for API key redemption

### Key Dependencies

- **Next.js**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API requests
- **React Syntax Highlighter**: For code highlighting in examples

### Authentication Flow

The application uses API key authentication to interact with the Sensay API:
- API keys can be provided via environment variable (`SENSAY_API_KEY_SECRET`)
- Or entered directly in the UI
- The client automatically creates or reuses a replica at runtime

### Data Flow

1. User inputs message in the chat interface
2. Application sends request to Sensay API using the SDK
3. For streaming responses, chunks are appended to the UI as they arrive
4. Chat history is managed in component state

## Environment Setup

The application requires:
- Node.js >= 18.17.0 (v20+ recommended)
- A Sensay AI API key

Environment variables are set in `.env.local`:
```
SENSAY_API_KEY_SECRET=your_api_key_here
```