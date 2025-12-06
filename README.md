# Notes RAG - AI-Powered Personal Knowledge Base

A modern full-stack RAG (Retrieval-Augmented Generation) application that combines personal note-taking with AI-powered semantic search. Built with Next.js, OpenAI, and PostgreSQL with vector search capabilities.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-blue?style=flat&logo=postgresql)
![Vitest](https://img.shields.io/badge/Tests-Vitest-green?style=flat&logo=vitest)

## 🎥 Demo

![Application Demo](./demo.gif)

> A quick walkthrough of the application showing note management, AI chat, and RAG visualization in action.

## 🎯 What is this?

This project demonstrates a production-ready RAG system where you can:

- **📝 Manage Notes**: Create, edit, organize notes with tags, colors, and pinning
- **🤖 AI Chat**: Ask questions and get answers based on your notes and knowledge base
- **🔍 Semantic Search**: Find relevant information using OpenAI embeddings and vector similarity
- **📊 Visual Results**: See search results visualized in an interactive node graph

Perfect for building a "second brain" or demonstrating RAG architecture to potential employers.

## 🏗️ Architecture

```
┌─────────────┐
│   Next.js   │ ← Server Components + API Routes
│  Frontend   │
└──────┬──────┘
       │
┌──────▼──────────────────────────────┐
│  Vercel AI SDK + OpenAI GPT-4       │ ← Chat & Embeddings
└──────┬──────────────────────────────┘
       │
┌──────▼──────────────────────────────┐
│  PostgreSQL + pgvector              │ ← Vector Similarity Search
│  (Notes, Resources, Embeddings)     │
└─────────────────────────────────────┘
```

### Key Components

- **Frontend**: React 18 with Server/Client Components, shadcn-ui, TailwindCSS
- **Backend**: Next.js App Router API routes, Server Actions
- **AI**: OpenAI GPT-4o for chat, text-embedding-ada-002 for embeddings
- **Database**: PostgreSQL with pgvector extension for vector operations
- **ORM**: Drizzle ORM with type-safe queries
- **Testing**: Vitest with comprehensive unit and integration tests

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ with pgvector extension
- OpenAI API key
- pnpm (recommended) or npm

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/notes-rag.git
cd notes-rag
pnpm install
```

### 2. Database Setup

```bash
# Install pgvector extension in PostgreSQL
# Connect to your database and run:
CREATE EXTENSION vector;
```

### 3. Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/notes_rag"
OPENAI_API_KEY="sk-..."
```

See `.env.example` for reference.

### 4. Database Migration

```bash
# Generate migration files
pnpm db:generate

# Run migrations
pnpm db:migrate

# (Optional) Open Drizzle Studio to view your database
pnpm db:studio
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
notes-rag/
├── app/
│   ├── api/chat/          # AI chat endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── notes/             # Notes management UI
│   ├── chat/              # Chat interface + RAG visualization
│   └── ui/                # Reusable UI components (shadcn)
├── lib/
│   ├── ai/
│   │   ├── provider.ts    # OpenAI configuration
│   │   └── embedding.ts   # Embedding generation & search
│   ├── actions/
│   │   ├── notes.ts       # Note CRUD operations
│   │   └── resources.ts   # Knowledge base operations
│   └── db/
│       ├── schema/        # Database schema (Drizzle)
│       └── migrate.ts     # Migration runner
├── test/                  # Test configuration
└── vitest.config.ts       # Testing setup
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Watch mode (interactive)
pnpm test

# Run once (CI/CD)
pnpm test:run

# Visual UI dashboard
pnpm test:ui

# Coverage report
pnpm test:coverage
```

**Test Coverage:**
- Unit tests for embedding logic (text chunking, vector generation)
- Unit tests for note CRUD operations
- Integration tests for chat API endpoint
- All external dependencies mocked (OpenAI API, database)

## 🔑 Key Features Explained

### 1. Automatic Embeddings

When you create or update a note, the system automatically:
1. Splits the text into semantic chunks (sentences)
2. Generates embeddings using OpenAI's text-embedding-ada-002
3. Stores embeddings in PostgreSQL with pgvector
4. Indexes them for fast similarity search

### 2. Semantic Search

The AI chat uses vector similarity search:
- User query → embedding
- Compare with all stored embeddings using cosine similarity
- Return top 8 results with similarity > 0.5
- AI uses these results to answer questions

### 3. RAG Visualization

Interactive React Flow diagram shows:
- Central query node
- Connected result nodes (notes/resources)
- Color-coded similarity scores
- Draggable, zoomable interface

### 4. AI Tools

The chat assistant has two tools:
- **Search**: Find relevant content in notes/resources
- **Add Resource**: Save new knowledge base items

The AI automatically decides when to use each tool based on the conversation.

## 📊 Database Schema

### Notes
- Stores user notes with title, content, tags, color
- Automatic timestamp tracking
- Pin functionality for important notes

### Resources
- General knowledge base items
- Added via chat or API

### Embeddings
- Links to notes or resources
- Contains text chunks and 1536-dimensional vectors
- HNSW index for fast similarity search

## 🛠️ Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Testing
pnpm test             # Run tests (watch mode)
pnpm test:run         # Run tests once
pnpm test:ui          # Open Vitest UI
pnpm test:coverage    # Generate coverage report

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema to DB (dev only)
pnpm db:studio        # Open Drizzle Studio
pnpm db:drop          # Drop all tables
```

## 🎨 Tech Stack Deep Dive

| Category | Technology | Why? |
|----------|-----------|------|
| **Framework** | Next.js 16 | Server Components, API routes, excellent DX |
| **Language** | TypeScript | Type safety, better tooling |
| **AI** | OpenAI GPT-4 + Embeddings | Industry-standard, reliable |
| **AI SDK** | Vercel AI SDK | Streaming, tool calling, React hooks |
| **Database** | PostgreSQL | Robust, supports vector extension |
| **Vector Search** | pgvector | Native PostgreSQL extension, simpler than separate vector DB |
| **ORM** | Drizzle | Type-safe, performant, great DX |
| **UI** | shadcn-ui + Tailwind | Beautiful, accessible, customizable |
| **Visualization** | React Flow | Interactive node graphs |
| **Testing** | Vitest | Fast, modern, Vite-native |

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | ✅ |
| `NODE_ENV` | Environment (development/production/test) | ❌ |

## 🤝 Contributing

This is a portfolio/demo project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test:run`
5. Submit a pull request

## 📝 License

MIT License - feel free to use this project for learning or as a portfolio piece.

## 🙏 Acknowledgments

- Built following the [Vercel AI SDK RAG Guide](https://sdk.vercel.ai/docs/guides/rag-chatbot)
- UI components from [shadcn-ui](https://ui.shadcn.com)
- Inspired by the "second brain" concept

## 📧 Contact

For questions or feedback, open an issue or reach out via GitHub.

---

**⭐ If this project helped you learn RAG , consider starring it!**
