# PaperMind AI

**Research Intelligence Platform** — Upload research papers, ask questions powered by RAG, explore knowledge graphs, and switch between cloud and local LLM providers.

## Features

- **PDF Upload & Processing** — Page-by-page text extraction with PyMuPDF, intelligent chunking, and vector indexing
- **RAG-Powered Chat** — Ask questions about papers and receive grounded answers with page citations
- **Multi-Model Support** — Switch between Groq (cloud) and Ollama (local) inference
- **Knowledge Graph** — Visualize concepts and relationships across papers (React Flow + Neo4j)
- **Research Workspace** — Notes, bookmarks, conversation history, and paper management
- **Privacy First** — Run models locally with Ollama; API keys stored server-side only

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, Framer Motion, React Flow |
| Backend | Python 3.11, FastAPI, Pydantic |
| Database | PostgreSQL 16, Qdrant (vectors), Neo4j (graphs, Phase 5) |
| AI | Groq API, Ollama, Sentence Transformers (embeddings) |
| Infrastructure | Docker Compose |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Python](https://python.org/) 3.11+
- [Docker](https://docker.com/) and Docker Compose
- (Optional) [Ollama](https://ollama.com/) for local inference
- (Optional) [Groq API key](https://console.groq.com/) for cloud inference

### 1. Clone and configure

```bash
cd papermind-ai
cp .env.example .env
```

Edit `.env` and set your `GROQ_API_KEY` (or leave empty to use Ollama only).

### 2. Start infrastructure services

```bash
docker compose up postgres qdrant -d
```

This starts PostgreSQL and Qdrant. Wait a few seconds for them to be ready.

### 3. Start the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`. Check health: `http://localhost:8000/api/v1/health`

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### 5. (Optional) Start Ollama

```bash
ollama serve
ollama pull llama3.1
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Application health |
| `POST` | `/api/v1/papers` | Upload a PDF |
| `GET` | `/api/v1/papers` | List papers |
| `GET` | `/api/v1/papers/{id}` | Paper details + status |
| `DELETE` | `/api/v1/papers/{id}` | Delete paper + vectors |
| `POST` | `/api/v1/papers/{id}/chat` | Ask about a paper |
| `POST` | `/api/v1/papers/{id}/summary` | Generate summary |
| `POST` | `/api/v1/papers/chat` | General RAG chat |
| `GET` | `/api/v1/models` | List available models |
| `GET` | `/api/v1/models/health` | Provider status |

## Project Structure

```
papermind-ai/
├── frontend/                 # Next.js 16 + TypeScript
│   └── src/
│       ├── app/              # Pages (landing, dashboard, chat, etc.)
│       ├── components/       # UI components (landing, layout, shared)
│       ├── features/         # Feature modules (papers, chat, graph, notes)
│       └── lib/              # Utilities (API client, env, utils)
├── backend/                  # FastAPI + Python
│   └── app/
│       ├── api/v1/           # API endpoints
│       ├── core/             # Config, logging, security
│       ├── db/               # PostgreSQL + Qdrant connections
│       ├── models/           # SQLAlchemy models
│       ├── providers/        # LLM provider abstraction (Groq, Ollama)
│       ├── rag/              # Ingest, retrieve, prompt build, pipeline
│       └── services/         # PDF extraction, chunking, embeddings
├── data/                     # Uploads and processed files
├── docker-compose.yml        # PostgreSQL + Qdrant + backend
└── .env.example              # Environment variable template
```

## Model Providers

### Groq (Cloud)
- Requires a free API key from [console.groq.com](https://console.groq.com)
- Models: Llama 3.3 70B, Llama 3.1 8B, Mixtral 8x7B, Gemma 2 9B
- Free tier has rate limits — see Groq docs for current quotas

### Ollama (Local)
- Requires Ollama installed and running locally
- No API key needed — everything stays on your machine
- 8GB+ VRAM recommended for 7B models

## Environment Variables

See [.env.example](.env.example) for all available options. Key variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq API key for cloud inference | If using Groq |
| `OLLAMA_BASE_URL` | Ollama server URL | If using Ollama |
| `POSTGRES_PASSWORD` | PostgreSQL password | Yes |
| `EMBEDDING_MODEL` | Sentence Transformers model name | No (default: all-MiniLM-L6-v2) |

## Development Phases

- [x] Phase 1 — Foundation (monorepo, landing page, dashboard shell, Docker)
- [x] Phase 2 — PDF Intelligence (upload, extraction, chunking, embeddings, Qdrant)
- [x] Phase 3 — RAG Chat (retrieval, providers, streaming, citations)
- [ ] Phase 4 — Research Workspace (notes, bookmarks, conversation history)
- [ ] Phase 5 — Knowledge Graph (Neo4j, entity extraction, React Flow visualization)
- [ ] Phase 6 — Production Hardening (auth, tests, CI, rate limiting)
- [ ] Phase 7 — Advanced AI (hybrid search, cross-paper Q&A, GraphRAG)

## License

MIT
