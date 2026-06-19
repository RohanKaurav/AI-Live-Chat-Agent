# Spur - AI Live Chat Agent

A full-stack, mini AI support agent for a live chat widget

## Features
- **Live Chat UI:** Modern, scrollable interface with typing indicators and auto-scrolling.
- **LLM Integration:** Powered by Google's `gemini-2.5-flash` model for fast, context-aware responses.
- **Session Persistence:** Conversations are saved to PostgreSQL and automatically restored when the user reloads the page.
- **Domain Knowledge:** The AI is contextually aware of the store's shipping, return policies, and support hours.

## Tech Stack
- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **LLM:** Google Gen AI SDK (`gemini-2.5-flash`)

---

## 🚀 Setup Instructions

### 1. Database & Environment Setup
Ensure you have PostgreSQL running. 

Navigate to the `backend` directory and create a `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/spurchat?schema=public"
PORT=3001
GEMINI_API_KEY="your_google_gemini_api_key"

```
## Backend Setup
```
cd backend
npm install
npx prisma migrate dev --name init # Run DB migrations
npm run dev # Start the Express server on port 3001

```
## Frontend Setup

cd frontend/vite-project
npm install
npm run dev # Start Vite on port 5173

```

 ### 🏗️ Architecture Overview
 
 
The backend follows a standard controller-service-data layered architecture to keep concerns strictly separated:

1.routes/chat.ts: The controller layer. It parses requests, orchestrates services, and handles HTTP responses.
2.services/conversation.ts: The database access layer, encapsulating all Prisma calls so business logic doesn't leak SQL/ORM syntax.
3.services/llm.ts: The AI integration layer. Separating this ensures we can easily swap providers (e.g., Anthropic, OpenAI) without touching the route logic.
4.db/client.ts: A robust Prisma singleton setup using @prisma/adapter-pg and the pg driver, configured for pure ESM.

### Interesting Design Decisions

1.Database Schema: Chose a robust 2-table schema (Conversation and Message). Adding a Sender enum directly in PostgreSQL ensures strict data integrity.

2.Session ID Handling: Used localStorage for anonymous session tracking. This mimics how a real widget would identify returning, unauthenticated visitors without needing a full JWT auth system.

### 🤖 LLM Notes

● Provider: Google Gemini (gemini-2.5-flash). Chosen because it offers incredibly fast time-to-first-token, which is critical for live chat UX.

● Prompting Strategy: Implemented a SYSTEM_INSTRUCTION that gives the model a strict persona ("Spur Store support agent") and injects domain-specific FAQs directly into its context window. Every request passes the entire formatted conversation history to maintain contextual memory.


### ⏳ Trade-offs & "If I had more time..."

Due to the weekend time-box, a few trade-offs were made:

1. No Rate Limiting: I would add express-rate-limit combined with a Redis store to prevent abuse of the LLM endpoint.

2. Hardcoded FAQ: The FAQ knowledge is hardcoded into the system prompt. In a production environment, I would move this to a Vector Database (like pgvector) to do Retrieval-Augmented Generation (RAG) so the store owner could dynamically update their knowledge base without code changes.

3. Streaming Responses: Currently, the UI waits for the entire generation to finish before rendering. I would implement Server-Sent Events (SSE) to stream the text token-by-token for a more responsive feel.

4. No Authentication: Implemented a simple UUID system for demo purposes. For a real product, I would tie this to customer IDs or authenticated websocket connections.

Note: Implemented strict cost and abuse controls by capping LLM output to 500 tokens, context history to 20 messages, and user input to 2000 characters.

```