import type { Provider, Agent, Team, Task, TeamType } from './schemas';

// ============================================================
// PROVIDER DATA (16 Free LLM API Providers)
// ============================================================

export const initialProviders: Provider[] = [
  {
    id: 'nvidia-nim', name: 'NVIDIA NIM', baseUrl: 'https://integrate.api.nvidia.com/v1',
    apiKeyEnv: 'NVIDIA_NIM_API_KEY', creditCardRequired: false, freeModelCount: 132,
    maxContextTokens: 1000000, modalities: ['audio', 'embedding', 'image', 'pdf', 'reasoning', 'rerank', 'text', 'video', 'vision'],
    bestModels: ['z-ai/glm-5.2', 'z-ai/glm-5.3-flash', 'moonshotai/kimi-k2.6'],
    rateLimit: { rpm: 40 }, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'google-gemini', name: 'Google Gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKeyEnv: 'GOOGLE_API_KEY', creditCardRequired: false, freeModelCount: 19,
    maxContextTokens: 1000000, modalities: ['audio', 'image', 'pdf', 'reasoning', 'text', 'video', 'vision'],
    bestModels: ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'],
    rateLimit: { rpm: 15, rpd: 1500 }, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'groq', name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1',
    apiKeyEnv: 'GROQ_API_KEY', creditCardRequired: false, freeModelCount: 12,
    maxContextTokens: 262144, modalities: ['image', 'reasoning', 'text'],
    bestModels: ['moonshotai/kimi-k2-instruct', 'groq/compound'],
    rateLimit: { rpm: 30, rpd: 250 }, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'openrouter', name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1',
    apiKeyEnv: 'OPENROUTER_API_KEY', creditCardRequired: false, freeModelCount: 34,
    maxContextTokens: 1000000, modalities: ['audio', 'code', 'embeddings', 'image', 'reasoning', 'rerank', 'speech', 'text', 'video'],
    bestModels: ['stealth/space-bunny-alpha', 'nvidia/nemotron-3-ultra-550b-a55b:free'],
    rateLimit: { rpd: 1000 }, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'cloudflare', name: 'Cloudflare Workers AI', baseUrl: 'https://api.cloudflare.com/client/v4/accounts/{id}/ai/run',
    apiKeyEnv: 'CLOUDFLARE_API_TOKEN', creditCardRequired: false, freeModelCount: 40,
    maxContextTokens: 262144, modalities: ['code', 'image', 'reasoning', 'text', 'video'],
    bestModels: ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/mistral/mistral-7b-instruct-v0.1'],
    rateLimit: {}, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'mistral', name: 'Mistral AI', baseUrl: 'https://api.mistral.ai/v1',
    apiKeyEnv: 'MISTRAL_API_KEY', creditCardRequired: false, freeModelCount: 15,
    maxContextTokens: 256000, modalities: ['code', 'image', 'text'],
    bestModels: ['mistral-medium-3-5-128b', 'open-mixtral-8x7b'],
    rateLimit: { rpm: 60, tpm: 500000 }, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'cohere', name: 'Cohere', baseUrl: 'https://api.cohere.com/v2',
    apiKeyEnv: 'COHERE_API_KEY', creditCardRequired: false, freeModelCount: 12,
    maxContextTokens: 256000, modalities: ['image', 'text'],
    bestModels: ['command-a-218b', 'command-a-111b', 'command-r'],
    rateLimit: { rpm: 20 }, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'huggingface', name: 'Hugging Face', baseUrl: 'https://router.huggingface.co/v1',
    apiKeyEnv: 'HF_TOKEN', creditCardRequired: false, freeModelCount: 8,
    maxContextTokens: 131072, modalities: ['code', 'image', 'text'],
    bestModels: ['meta-llama-3-1-8b-instruct', 'qwen2-5-coder-7b-instruct'],
    rateLimit: {}, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'cerebras', name: 'Cerebras', baseUrl: 'https://api.cerebras.ai/v1',
    apiKeyEnv: 'CEREBRAS_API_KEY', creditCardRequired: false, freeModelCount: 6,
    maxContextTokens: 131072, modalities: ['reasoning', 'text'],
    bestModels: ['llama3.1-70b', 'zai-glm-4.7'],
    rateLimit: { rpm: 10, rpd: 100 }, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'github-models', name: 'GitHub Models', baseUrl: 'https://models.github.ai/inference',
    apiKeyEnv: 'GITHUB_TOKEN', creditCardRequired: false, freeModelCount: 16,
    maxContextTokens: 1000000, modalities: ['image', 'pdf', 'reasoning', 'text'],
    bestModels: ['Phi-4', 'Mistral-large-2411'],
    rateLimit: {}, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1',
    apiKeyEnv: 'DEEPSEEK_API_KEY', creditCardRequired: false, freeModelCount: 2,
    maxContextTokens: 128000, modalities: ['text'],
    bestModels: ['deepseek-chat-v3-2', 'deepseek-reasoner-r1'],
    rateLimit: {}, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'sambanova', name: 'SambaNova', baseUrl: 'https://api.sambanova.ai/v1',
    apiKeyEnv: 'SAMBANOVA_API_KEY', creditCardRequired: false, freeModelCount: 4,
    maxContextTokens: 128000, modalities: ['image', 'reasoning', 'text'],
    bestModels: ['deepseek-v3-1', 'deepseek-v3-2-preview', 'minimax-m2-7'],
    rateLimit: { rpm: 20, rpd: 20 }, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'llm7', name: 'LLM7.io', baseUrl: 'https://api.llm7.io/v1',
    apiKeyEnv: 'LLM7_API_KEY', creditCardRequired: false, freeModelCount: 20,
    maxContextTokens: 1000000, modalities: ['audio', 'code', 'image', 'pdf', 'reasoning', 'text', 'video', 'vision'],
    bestModels: ['gpt-oss-20b', 'mistral-Nemo-Instruct-2407', 'minimax-m2.7'],
    rateLimit: { rpm: 10 }, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'xai', name: 'xAI', baseUrl: 'https://api.x.ai/v1',
    apiKeyEnv: 'XAI_API_KEY', creditCardRequired: false, freeModelCount: 3,
    maxContextTokens: 2000000, modalities: ['text'],
    bestModels: ['grok-4.3', 'grok-4.1-fast', 'grok-3-mini'],
    rateLimit: {}, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'kilo-code', name: 'Kilo Code', baseUrl: 'https://api.kilo.ai/api/gateway',
    apiKeyEnv: 'KILO_API_KEY', creditCardRequired: false, freeModelCount: 15,
    maxContextTokens: 1000000, modalities: ['audio', 'code', 'image', 'reasoning', 'text', 'video'],
    bestModels: ['nvidia/nemotron-3-ultra-550b-a55b:free', 'stepfun/step-3.7-flash:free'],
    rateLimit: {}, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
  {
    id: 'chutes', name: 'Chutes.ai', baseUrl: 'https://api.chutes.ai/v1',
    apiKeyEnv: 'CHUTES_API_KEY', creditCardRequired: false, freeModelCount: 2,
    maxContextTokens: 131072, modalities: ['reasoning', 'text'],
    bestModels: ['deepseek-ai/DeepSeek-R1', 'meta-llama/Meta-Llama-3.1-70B-Instruct'],
    rateLimit: {}, status: 'disconnected', latency: 0, uptime: 0, totalRequests: 0, failedRequests: 0,
  },
];

// ============================================================
// AGENT GENERATION
// ============================================================

const teamProviderMap: Record<TeamType, string[]> = {
  research: ['nvidia-nim', 'google-gemini', 'openrouter', 'groq', 'deepseek'],
  code: ['huggingface', 'cerebras', 'mistral', 'sambanova', 'cloudflare'],
  architect: ['cohere', 'nvidia-nim', 'openrouter', 'llm7', 'kilo-code'],
  algorithm: ['cerebras', 'groq', 'deepseek', 'chutes', 'nvidia-nim'],
  frontend: ['google-gemini', 'mistral', 'cloudflare', 'github-models', 'llm7'],
  backend: ['sambanova', 'cohere', 'huggingface', 'kilo-code', 'cloudflare'],
};

const teamModelMap: Record<TeamType, string[][]> = {
  research: [
    ['z-ai/glm-5.2', 'moonshotai/kimi-k2.6', 'gemini-3.7-flash', 'gemini-3.5-flash', 'stealth/space-bunny-alpha',
     'nvidia/nemotron-3-ultra-550b-a55b:free', 'moonshotai/kimi-k2-instruct', 'groq/compound', 'deepseek-reasoner-r1', 'z-ai/glm-5.3-flash'],
    [], [], [], [], [], [], [], [], []
  ],
  code: [
    ['qwen2-5-coder-7b-instruct', 'llama3.1-70b', 'mistral-medium-3-5-128b', 'deepseek-v3-1', '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
     'open-mixtral-8x7b', 'deepseek-v3-2-preview', 'zai-glm-4.7', '@cf/mistral/mistral-7b-instruct-v0.1', 'minimax-m2-7'],
    [], [], [], [], [], [], [], [], []
  ],
  architect: [
    ['command-a-218b', 'z-ai/glm-5.3-flash', 'inclusionai/ling-3.0-flash-fin:free', 'minimax-m2.7', 'nvidia/nemotron-3-ultra-550b-a55b:free',
     'command-a-111b', 'gpt-oss-20b', 'stepfun/step-3.7-flash:free', 'command-r', 'nvidia/nemotron-3-super-120b-a12b:free'],
    [], [], [], [], [], [], [], [], []
  ],
  algorithm: [
    ['zai-glm-4.7', 'moonshotai/kimi-k2-instruct-0905', 'deepseek-chat-v3-2', 'deepseek-ai/DeepSeek-R1', 'moonshotai/kimi-k2.6',
     'llama3.1-70b', 'groq/compound', 'meta-llama/Meta-Llama-3.1-70B-Instruct', 'z-ai/glm-5.2', 'moonshotai/kimi-k2-instruct'],
    [], [], [], [], [], [], [], [], []
  ],
  frontend: [
    ['gemini-3.6-flash', 'open-mistral-7b', '@cf/mistral/mistral-7b-instruct-v0.1', 'Phi-4', 'mistral-Nemo-Instruct-2407',
     'gemini-3.5-flash', 'mistral-medium-3-5-128b', '@cf/meta/llama-3.3-70b-instruct-fp8-fast', 'Mistral-large-2411', 'gpt-oss-20b'],
    [], [], [], [], [], [], [], [], []
  ],
  backend: [
    ['minimax-m2-7', 'command-r', 'meta-llama-3-1-8b-instruct', 'nvidia/nemotron-3-super-120b-a12b:free', '@cf/qwen/qwen1.5-7b-chat',
     'deepseek-v3-1', 'command-a-111b', 'qwen2-5-coder-7b-instruct', 'stepfun/step-3.7-flash:free', '@cf/mistral/mistral-7b-instruct-v0.1'],
    [], [], [], [], [], [], [], [], []
  ],
};

const agentStatuses: Agent['status'][] = ['working', 'working', 'working', 'working', 'working', 'working', 'idle', 'idle', 'awaiting_review', 'error'];

export function generateAgents(): Agent[] {
  // Return empty array - no sample agents
  return [];
}

// ============================================================
// TEAM CONFIGURATION
// ============================================================

export const teamConfigs: { id: TeamType; name: string; icon: string; color: string; gradient: string; description: string; capabilities: string[] }[] = [
  {
    id: 'research', name: 'Research Team', icon: '🔬', color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Deep research, literature review, data analysis & fact verification',
    capabilities: ['Literature Review', 'Data Analysis', 'Fact Verification', 'Cross-Referencing', 'Summary Generation'],
  },
  {
    id: 'code', name: 'Code Team', icon: '💻', color: '#10b981',
    gradient: 'from-green-500 to-emerald-500',
    description: 'Code generation, debugging, refactoring & optimization',
    capabilities: ['Code Generation', 'Bug Fixing', 'Refactoring', 'Unit Testing', 'Code Review'],
  },
  {
    id: 'architect', name: 'Architect Team', icon: '🏗️', color: '#8b5cf6',
    gradient: 'from-purple-500 to-violet-500',
    description: 'System design, architecture patterns, scalability & infrastructure',
    capabilities: ['System Design', 'Pattern Selection', 'Scalability Planning', 'Infrastructure', 'Trade-off Analysis'],
  },
  {
    id: 'algorithm', name: 'Algorithm Team', icon: '🧮', color: '#f59e0b',
    gradient: 'from-orange-500 to-amber-500',
    description: 'Algorithm design, complexity analysis, optimization & data structures',
    capabilities: ['Algorithm Design', 'Complexity Analysis', 'Optimization', 'Data Structures', 'Proof Verification'],
  },
  {
    id: 'frontend', name: 'Frontend Team', icon: '🎨', color: '#ec4899',
    gradient: 'from-pink-500 to-rose-500',
    description: 'UI/UX design, component architecture, styling & interactions',
    capabilities: ['UI Design', 'Component Architecture', 'CSS/Styling', 'Accessibility', 'Performance'],
  },
  {
    id: 'backend', name: 'Backend Team', icon: '⚙️', color: '#06b6d4',
    gradient: 'from-teal-500 to-cyan-600',
    description: 'API design, database schema, server logic & integration',
    capabilities: ['API Design', 'Database Schema', 'Server Logic', 'Integration', 'Security'],
  },
];

// ============================================================
// TASK GENERATION
// ============================================================

const taskTemplates: Record<TeamType, string[]> = {
  research: [
    'Analyze transformer attention mechanisms for efficiency gains',
    'Survey RAG implementations across 2024-2026 papers',
    'Compare RLHF vs DPO alignment techniques',
    'Research multimodal fusion architectures',
    'Investigate tokenization efficiency benchmarks',
    'Review federated learning privacy guarantees',
    'Analyze quantum computing impact on cryptography',
    'Study emergent capabilities in LLMs',
    'Survey vector database performance characteristics',
    'Research prompt engineering optimization techniques',
  ],
  code: [
    'Implement WebSocket connection handler with reconnection',
    'Write comprehensive unit tests for auth middleware',
    'Refactor database query layer for N+1 prevention',
    'Build rate limiter with sliding window algorithm',
    'Implement event-driven task queue processor',
    'Create retry logic with exponential backoff',
    'Build circuit breaker for external API calls',
    'Implement graceful shutdown handler',
    'Write migration scripts for schema v2',
    'Create health check endpoint with dependency verification',
  ],
  architect: [
    'Design microservice topology for 60-agent system',
    'Plan event-driven architecture with CQRS pattern',
    'Define API gateway routing strategy',
    'Design horizontal scaling approach for agent pool',
    'Plan disaster recovery with multi-region failover',
    'Design multi-tenant isolation boundaries',
    'Create service mesh configuration',
    'Plan data partitioning strategy',
    'Design cache invalidation strategy',
    'Define observability stack architecture',
  ],
  algorithm: [
    'Optimize graph traversal for dependency resolution',
    'Implement A* pathfinding for task scheduling',
    'Design hash collision resolution strategy',
    'Implement dynamic programming for resource allocation',
    'Optimize sort algorithm for streaming data',
    'Design bloom filter parameters for cache',
    'Implement Merkle tree for data verification',
    'Optimize LRU cache eviction policy',
    'Design load balancing with weighted round-robin',
    'Implement distributed consensus protocol',
  ],
  frontend: [
    'Build responsive dashboard with real-time metrics',
    'Create animation system for agent state transitions',
    'Design component library with design tokens',
    'Implement dark/light mode with CSS variables',
    'Build form validation with Zod schemas',
    'Create data visualization with D3.js integration',
    'Implement drag-and-drop task board',
    'Build virtual scrolling for large agent lists',
    'Create accessibility layer with ARIA support',
    'Implement PWA with offline support',
  ],
  backend: [
    'Build authentication middleware with JWT refresh',
    'Design database schema with proper indexing',
    'Implement file storage with S3-compatible API',
    'Build webhook handler with signature verification',
    'Create queue processor with dead letter queue',
    'Implement full-text search with Elasticsearch',
    'Build notification system with multi-channel support',
    'Create audit logging with immutable records',
    'Implement data pipeline with transformation stages',
    'Build health check system with dependency graph',
  ],
};

export function generateTasks(): Task[] {
  // Return empty array - no sample tasks
  return [];
}
