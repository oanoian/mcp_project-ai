export type TeamType = 'research' | 'code' | 'architect' | 'algorithm' | 'frontend' | 'backend';

export interface Agent {
  id: string;
  name: string;
  team: TeamType;
  slot: number;
  provider: string;
  model: string;
  status: 'active' | 'idle' | 'working' | 'error';
  currentTask: string;
  tasksCompleted: number;
  uptime: string;
  lastPing: string;
}

export interface Team {
  id: TeamType;
  name: string;
  icon: string;
  color: string;
  description: string;
  agents: Agent[];
}

const providerModels: Record<string, { provider: string; models: string[] }[]> = {
  research: [
    { provider: 'nvidia-nim', models: ['z-ai/glm-5.2', 'moonshotai/kimi-k2.6'] },
    { provider: 'google-gemini', models: ['gemini-3.7-flash', 'gemini-3.5-flash'] },
    { provider: 'openrouter', models: ['stealth/space-bunny-alpha', 'nvidia/nemotron-3-ultra-550b-a55b:free'] },
    { provider: 'groq', models: ['moonshotai/kimi-k2-instruct', 'groq/compound'] },
    { provider: 'deepseek', models: ['deepseek-reasoner-r1'] },
  ],
  code: [
    { provider: 'huggingface', models: ['qwen2-5-coder-7b-instruct'] },
    { provider: 'cerebras', models: ['llama3.1-70b'] },
    { provider: 'mistral', models: ['mistral-medium-3-5-128b', 'open-mixtral-8x7b'] },
    { provider: 'sambanova', models: ['deepseek-v3-1', 'deepseek-v3-2-preview'] },
    { provider: 'cloudflare', models: ['@cf/meta/llama-3.3-70b-instruct-fp8-fast'] },
  ],
  architect: [
    { provider: 'cohere', models: ['command-a-218b', 'command-a-111b'] },
    { provider: 'nvidia-nim', models: ['z-ai/glm-5.3-flash'] },
    { provider: 'openrouter', models: ['inclusionai/ling-3.0-flash-fin:free'] },
    { provider: 'llm7', models: ['minimax-m2.7', 'gpt-oss-20b'] },
    { provider: 'kilo-code', models: ['nvidia/nemotron-3-ultra-550b-a55b:free'] },
  ],
  algorithm: [
    { provider: 'cerebras', models: ['zai-glm-4.7'] },
    { provider: 'groq', models: ['moonshotai/kimi-k2-instruct-0905'] },
    { provider: 'deepseek', models: ['deepseek-chat-v3-2'] },
    { provider: 'chutes', models: ['deepseek-ai/DeepSeek-R1'] },
    { provider: 'nvidia-nim', models: ['moonshotai/kimi-k2.6'] },
  ],
  frontend: [
    { provider: 'google-gemini', models: ['gemini-3.6-flash'] },
    { provider: 'mistral', models: ['open-mistral-7b'] },
    { provider: 'cloudflare', models: ['@cf/mistral/mistral-7b-instruct-v0.1'] },
    { provider: 'github-models', models: ['Phi-4'] },
    { provider: 'llm7', models: ['mistral-Nemo-Instruct-2407'] },
  ],
  backend: [
    { provider: 'sambanova', models: ['minimax-m2-7'] },
    { provider: 'cohere', models: ['command-r'] },
    { provider: 'huggingface', models: ['meta-llama-3-1-8b-instruct'] },
    { provider: 'kilo-code', models: ['nvidia/nemotron-3-super-120b-a12b:free'] },
    { provider: 'cloudflare', models: ['@cf/qwen/qwen1.5-7b-chat'] },
  ],
};

const teamConfigs: { id: TeamType; name: string; icon: string; color: string; description: string }[] = [
  { id: 'research', name: 'Research Team', icon: '🔬', color: 'from-blue-500 to-cyan-500', description: 'Deep research, literature review, data analysis & fact verification' },
  { id: 'code', name: 'Code Team', icon: '💻', color: 'from-green-500 to-emerald-500', description: 'Code generation, debugging, refactoring & optimization' },
  { id: 'architect', name: 'Architect Team', icon: '🏗️', color: 'from-purple-500 to-violet-500', description: 'System design, architecture patterns, scalability & infrastructure' },
  { id: 'algorithm', name: 'Algorithm Team', icon: '🧮', color: 'from-orange-500 to-amber-500', description: 'Algorithm design, complexity analysis, optimization & data structures' },
  { id: 'frontend', name: 'Frontend Team', icon: '🎨', color: 'from-pink-500 to-rose-500', description: 'UI/UX design, component architecture, styling & interactions' },
  { id: 'backend', name: 'Backend Team', icon: '⚙️', color: 'from-teal-500 to-cyan-600', description: 'API design, database schema, server logic & integration' },
];

const researchTasks = [
  'Analyzing quantum computing papers',
  'Reviewing transformer architectures',
  'Surveying federated learning approaches',
  'Comparing RAG implementations',
  'Studying attention mechanisms',
  'Investigating RLHF techniques',
  'Researching multimodal fusion',
  'Analyzing benchmark datasets',
  'Reviewing safety alignment papers',
  'Studying tokenization methods',
];

const codeTasks = [
  'Refactoring authentication module',
  'Writing unit tests for API layer',
  'Implementing WebSocket handler',
  'Optimizing database queries',
  'Building REST endpoints',
  'Creating middleware pipeline',
  'Implementing caching layer',
  'Writing migration scripts',
  'Building error handling system',
  'Implementing rate limiter',
];

const architectTasks = [
  'Designing microservice topology',
  'Planning event-driven architecture',
  'Defining API gateway patterns',
  'Designing CQRS implementation',
  'Planning service mesh config',
  'Designing circuit breaker patterns',
  'Planning horizontal scaling',
  'Designing data partitioning',
  'Planning disaster recovery',
  'Designing multi-tenant isolation',
];

const algorithmTasks = [
  'Optimizing graph traversal',
  'Implementing A* pathfinding',
  'Designing hash collision strategy',
  'Implementing dynamic programming',
  'Optimizing sort algorithms',
  'Designing bloom filter params',
  'Implementing Merkle tree',
  'Optimizing cache eviction',
  'Designing load balancer algo',
  'Implementing consensus protocol',
];

const frontendTasks = [
  'Building responsive dashboard',
  'Creating animation system',
  'Designing component library',
  'Implementing dark mode',
  'Building form validation',
  'Creating data visualization',
  'Implementing drag-and-drop',
  'Building virtual scroll',
  'Creating accessibility layer',
  'Implementing PWA features',
];

const backendTasks = [
  'Building auth middleware',
  'Designing database schema',
  'Implementing file storage',
  'Building webhook handler',
  'Creating queue processor',
  'Implementing search indexing',
  'Building notification system',
  'Creating audit logging',
  'Implementing data pipeline',
  'Building health check system',
];

const taskMap: Record<TeamType, string[]> = {
  research: researchTasks,
  code: codeTasks,
  architect: architectTasks,
  algorithm: algorithmTasks,
  frontend: frontendTasks,
  backend: backendTasks,
};

const statuses: Agent['status'][] = ['active', 'idle', 'working', 'error'];

function generateAgents(): Team[] {
  return teamConfigs.map((config) => {
    const agents: Agent[] = [];
    const models = providerModels[config.id];

    for (let i = 0; i < 10; i++) {
      const modelGroup = models[i % models.length];
      const model = modelGroup.models[i % modelGroup.models.length];
      const taskList = taskMap[config.id];
      const status = statuses[i < 6 ? 2 : i < 8 ? 0 : i === 8 ? 1 : 3];

      agents.push({
        id: `${config.id}-${i + 1}`,
        name: `${config.name.split(' ')[0]} Agent ${i + 1}`,
        team: config.id,
        slot: i + 1,
        provider: modelGroup.provider,
        model: model,
        status: status,
        currentTask: status === 'working' || status === 'active' ? taskList[i % taskList.length] : 'Awaiting assignment',
        tasksCompleted: Math.floor(Math.random() * 50) + 10,
        uptime: `${Math.floor(Math.random() * 23) + 1}h ${Math.floor(Math.random() * 59)}m`,
        lastPing: `${Math.floor(Math.random() * 30)}s ago`,
      });
    }

    return {
      ...config,
      agents,
    };
  });
}

export const teams: Team[] = generateAgents();
export const allAgents: Agent[] = teams.flatMap(t => t.agents);
