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
    rateLimit: { rpm: 40 }, status: 'connected', latency: 245, uptime: 99.7, totalRequests: 14892, failedRequests: 23,
  },
  {
    id: 'google-gemini', name: 'Google Gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKeyEnv: 'GOOGLE_API_KEY', creditCardRequired: false, freeModelCount: 19,
    maxContextTokens: 1000000, modalities: ['audio', 'image', 'pdf', 'reasoning', 'text', 'video', 'vision'],
    bestModels: ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'],
    rateLimit: { rpm: 15, rpd: 1500 }, status: 'connected', latency: 180, uptime: 99.9, totalRequests: 22451, failedRequests: 8,
  },
  {
    id: 'groq', name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1',
    apiKeyEnv: 'GROQ_API_KEY', creditCardRequired: false, freeModelCount: 12,
    maxContextTokens: 262144, modalities: ['image', 'reasoning', 'text'],
    bestModels: ['moonshotai/kimi-k2-instruct', 'groq/compound'],
    rateLimit: { rpm: 30, rpd: 250 }, status: 'connected', latency: 89, uptime: 99.5, totalRequests: 31204, failedRequests: 45,
  },
  {
    id: 'openrouter', name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1',
    apiKeyEnv: 'OPENROUTER_API_KEY', creditCardRequired: false, freeModelCount: 34,
    maxContextTokens: 1000000, modalities: ['audio', 'code', 'embeddings', 'image', 'reasoning', 'rerank', 'speech', 'text', 'video'],
    bestModels: ['stealth/space-bunny-alpha', 'nvidia/nemotron-3-ultra-550b-a55b:free'],
    rateLimit: { rpd: 1000 }, status: 'connected', latency: 312, uptime: 98.9, totalRequests: 18763, failedRequests: 67,
  },
  {
    id: 'cloudflare', name: 'Cloudflare Workers AI', baseUrl: 'https://api.cloudflare.com/client/v4/accounts/{id}/ai/run',
    apiKeyEnv: 'CLOUDFLARE_API_TOKEN', creditCardRequired: false, freeModelCount: 40,
    maxContextTokens: 262144, modalities: ['code', 'image', 'reasoning', 'text', 'video'],
    bestModels: ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/mistral/mistral-7b-instruct-v0.1'],
    rateLimit: {}, status: 'connected', latency: 156, uptime: 99.8, totalRequests: 9847, failedRequests: 12,
  },
  {
    id: 'mistral', name: 'Mistral AI', baseUrl: 'https://api.mistral.ai/v1',
    apiKeyEnv: 'MISTRAL_API_KEY', creditCardRequired: false, freeModelCount: 15,
    maxContextTokens: 256000, modalities: ['code', 'image', 'text'],
    bestModels: ['mistral-medium-3-5-128b', 'open-mixtral-8x7b'],
    rateLimit: { rpm: 60, tpm: 500000 }, status: 'connected', latency: 203, uptime: 99.4, totalRequests: 15632, failedRequests: 31,
  },
  {
    id: 'cohere', name: 'Cohere', baseUrl: 'https://api.cohere.com/v2',
    apiKeyEnv: 'COHERE_API_KEY', creditCardRequired: false, freeModelCount: 12,
    maxContextTokens: 256000, modalities: ['image', 'text'],
    bestModels: ['command-a-218b', 'command-a-111b', 'command-r'],
    rateLimit: { rpm: 20 }, status: 'connected', latency: 278, uptime: 99.6, totalRequests: 8921, failedRequests: 19,
  },
  {
    id: 'huggingface', name: 'Hugging Face', baseUrl: 'https://router.huggingface.co/v1',
    apiKeyEnv: 'HF_TOKEN', creditCardRequired: false, freeModelCount: 8,
    maxContextTokens: 131072, modalities: ['code', 'image', 'text'],
    bestModels: ['meta-llama-3-1-8b-instruct', 'qwen2-5-coder-7b-instruct'],
    rateLimit: {}, status: 'connected', latency: 342, uptime: 98.2, totalRequests: 6543, failedRequests: 89,
  },
  {
    id: 'cerebras', name: 'Cerebras', baseUrl: 'https://api.cerebras.ai/v1',
    apiKeyEnv: 'CEREBRAS_API_KEY', creditCardRequired: false, freeModelCount: 6,
    maxContextTokens: 131072, modalities: ['reasoning', 'text'],
    bestModels: ['llama3.1-70b', 'zai-glm-4.7'],
    rateLimit: { rpm: 10, rpd: 100 }, status: 'connected', latency: 67, uptime: 99.1, totalRequests: 12876, failedRequests: 34,
  },
  {
    id: 'github-models', name: 'GitHub Models', baseUrl: 'https://models.github.ai/inference',
    apiKeyEnv: 'GITHUB_TOKEN', creditCardRequired: false, freeModelCount: 16,
    maxContextTokens: 1000000, modalities: ['image', 'pdf', 'reasoning', 'text'],
    bestModels: ['Phi-4', 'Mistral-large-2411'],
    rateLimit: {}, status: 'connected', latency: 198, uptime: 99.3, totalRequests: 7654, failedRequests: 22,
  },
  {
    id: 'deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1',
    apiKeyEnv: 'DEEPSEEK_API_KEY', creditCardRequired: false, freeModelCount: 2,
    maxContextTokens: 128000, modalities: ['text'],
    bestModels: ['deepseek-chat-v3-2', 'deepseek-reasoner-r1'],
    rateLimit: {}, status: 'connected', latency: 423, uptime: 97.8, totalRequests: 21345, failedRequests: 156,
  },
  {
    id: 'sambanova', name: 'SambaNova', baseUrl: 'https://api.sambanova.ai/v1',
    apiKeyEnv: 'SAMBANOVA_API_KEY', creditCardRequired: false, freeModelCount: 4,
    maxContextTokens: 128000, modalities: ['image', 'reasoning', 'text'],
    bestModels: ['deepseek-v3-1', 'deepseek-v3-2-preview', 'minimax-m2-7'],
    rateLimit: { rpm: 20, rpd: 20 }, status: 'connected', latency: 289, uptime: 98.7, totalRequests: 4532, failedRequests: 41,
  },
  {
    id: 'llm7', name: 'LLM7.io', baseUrl: 'https://api.llm7.io/v1',
    apiKeyEnv: 'LLM7_API_KEY', creditCardRequired: false, freeModelCount: 20,
    maxContextTokens: 1000000, modalities: ['audio', 'code', 'image', 'pdf', 'reasoning', 'text', 'video', 'vision'],
    bestModels: ['gpt-oss-20b', 'mistral-Nemo-Instruct-2407', 'minimax-m2.7'],
    rateLimit: { rpm: 10 }, status: 'connected', latency: 234, uptime: 99.0, totalRequests: 5678, failedRequests: 28,
  },
  {
    id: 'xai', name: 'xAI', baseUrl: 'https://api.x.ai/v1',
    apiKeyEnv: 'XAI_API_KEY', creditCardRequired: false, freeModelCount: 3,
    maxContextTokens: 2000000, modalities: ['text'],
    bestModels: ['grok-4.3', 'grok-4.1-fast', 'grok-3-mini'],
    rateLimit: {}, status: 'degraded', latency: 567, uptime: 95.2, totalRequests: 3210, failedRequests: 234,
  },
  {
    id: 'kilo-code', name: 'Kilo Code', baseUrl: 'https://api.kilo.ai/api/gateway',
    apiKeyEnv: 'KILO_API_KEY', creditCardRequired: false, freeModelCount: 15,
    maxContextTokens: 1000000, modalities: ['audio', 'code', 'image', 'reasoning', 'text', 'video'],
    bestModels: ['nvidia/nemotron-3-ultra-550b-a55b:free', 'stepfun/step-3.7-flash:free'],
    rateLimit: {}, status: 'connected', latency: 178, uptime: 99.4, totalRequests: 8765, failedRequests: 15,
  },
  {
    id: 'chutes', name: 'Chutes.ai', baseUrl: 'https://api.chutes.ai/v1',
    apiKeyEnv: 'CHUTES_API_KEY', creditCardRequired: false, freeModelCount: 2,
    maxContextTokens: 131072, modalities: ['reasoning', 'text'],
    bestModels: ['deepseek-ai/DeepSeek-R1', 'meta-llama/Meta-Llama-3.1-70B-Instruct'],
    rateLimit: {}, status: 'connected', latency: 345, uptime: 97.5, totalRequests: 2345, failedRequests: 67,
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
  const agents: Agent[] = [];
  const teamTypes: TeamType[] = ['research', 'code', 'architect', 'algorithm', 'frontend', 'backend'];

  for (const team of teamTypes) {
    const providers = teamProviderMap[team];
    const models = teamModelMap[team][0];

    for (let i = 0; i < 10; i++) {
      const providerIdx = i % providers.length;
      const status = agentStatuses[i];
      const now = new Date();

      agents.push({
        id: `${team}-${i + 1}`,
        name: `${team.charAt(0).toUpperCase() + team.slice(1)}-${String(i + 1).padStart(2, '0')}`,
        team,
        slot: i + 1,
        assignedProvider: providers[providerIdx],
        model: models[i],
        status,
        currentTaskId: status === 'working' ? `task-${team}-${i}` : null,
        tasksCompleted: Math.floor(Math.random() * 80) + 20,
        tasksFailed: Math.floor(Math.random() * 5),
        avgResponseTime: Math.floor(Math.random() * 400) + 100,
        tokensUsed: Math.floor(Math.random() * 500000) + 50000,
        initializedAt: new Date(now.getTime() - Math.random() * 86400000).toISOString(),
        lastHeartbeat: new Date(now.getTime() - Math.random() * 30000).toISOString(),
        contextWindow: {
          used: Math.floor(Math.random() * 80000) + 10000,
          max: 128000,
        },
        health: {
          cpu: Math.floor(Math.random() * 60) + 10,
          memory: Math.floor(Math.random() * 50) + 20,
          score: Math.floor(Math.random() * 30) + 70,
        },
      });
    }
  }

  return agents;
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
  const tasks: Task[] = [];
  const teamTypes: TeamType[] = ['research', 'code', 'architect', 'algorithm', 'frontend', 'backend'];
  const priorities: Task['priority'][] = ['critical', 'high', 'medium', 'low'];
  const statuses: Task['status'][] = ['completed', 'completed', 'in_progress', 'in_progress', 'queued', 'review'];

  for (const team of teamTypes) {
    for (let i = 0; i < 10; i++) {
      const status = statuses[i % statuses.length];
      const now = new Date();

      tasks.push({
        id: `task-${team}-${i}`,
        title: taskTemplates[team][i],
        description: `Detailed task for ${team} team - ${taskTemplates[team][i]}`,
        team,
        priority: priorities[i % priorities.length],
        status,
        assignedAgent: status === 'in_progress' || status === 'review' ? `${team}-${i + 1}` : null,
        createdBy: 'lead',
        createdAt: new Date(now.getTime() - Math.random() * 3600000).toISOString(),
        startedAt: status !== 'queued' ? new Date(now.getTime() - Math.random() * 1800000).toISOString() : null,
        completedAt: status === 'completed' ? new Date(now.getTime() - Math.random() * 900000).toISOString() : null,
        result: status === 'completed' ? 'Task completed successfully with verified output.' : null,
        dependencies: [],
        retryCount: 0,
        maxRetries: 3,
        metadata: { estimatedTokens: Math.floor(Math.random() * 5000) + 1000 },
      });
    }
  }

  return tasks;
}
