export interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyUrl: string;
  creditCard: string;
  freeModels: number;
  maxContext: string;
  modalities: string[];
  bestModels: string[];
  rateLimit: string;
  status: 'connected' | 'disconnected' | 'pending';
}

export const providers: Provider[] = [
  {
    id: 'nvidia-nim',
    name: 'NVIDIA NIM',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    apiKeyUrl: 'https://build.nvidia.com/settings/api-keys',
    creditCard: 'Phone verification',
    freeModels: 132,
    maxContext: '1M',
    modalities: ['audio', 'embedding', 'image', 'pdf', 'reasoning', 'rerank', 'text', 'video', 'vision'],
    bestModels: ['z-ai/glm-5.2', 'z-ai/glm-5.3-flash', 'moonshotai/kimi-k2.6'],
    rateLimit: 'Up to 40 RPM',
    status: 'connected'
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKeyUrl: 'https://aistudio.google.com/app/apikey',
    creditCard: 'No',
    freeModels: 19,
    maxContext: '1M',
    modalities: ['audio', 'image', 'pdf', 'reasoning', 'text', 'video', 'vision'],
    bestModels: ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'],
    rateLimit: '15 RPM, 1,500 RPD',
    status: 'connected'
  },
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKeyUrl: 'https://console.groq.com/keys',
    creditCard: 'No',
    freeModels: 12,
    maxContext: '262K',
    modalities: ['image', 'reasoning', 'text'],
    bestModels: ['moonshotai/kimi-k2-instruct', 'groq/compound'],
    rateLimit: '30 RPM, 250 RPD',
    status: 'connected'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKeyUrl: 'https://openrouter.ai/workspaces/default/keys',
    creditCard: 'Registration',
    freeModels: 34,
    maxContext: '1M',
    modalities: ['audio', 'code', 'embeddings', 'image', 'reasoning', 'rerank', 'speech', 'text', 'video'],
    bestModels: ['stealth/space-bunny-alpha', 'nvidia/nemotron-3-ultra-550b-a55b:free'],
    rateLimit: '1K RPD',
    status: 'connected'
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Workers AI',
    baseUrl: 'https://api.cloudflare.com/client/v4/accounts/{id}/ai/run',
    apiKeyUrl: 'https://dash.cloudflare.com/profile/api-tokens',
    creditCard: 'No',
    freeModels: 40,
    maxContext: '262K',
    modalities: ['code', 'image', 'reasoning', 'text', 'video'],
    bestModels: ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/mistral/mistral-7b-instruct-v0.1'],
    rateLimit: '10K neurons/day',
    status: 'connected'
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    apiKeyUrl: 'https://console.mistral.ai/api-keys',
    creditCard: 'No',
    freeModels: 15,
    maxContext: '256K',
    modalities: ['code', 'image', 'text'],
    bestModels: ['mistral-medium-3-5-128b', 'open-mixtral-8x7b'],
    rateLimit: '~1 RPS, 500K TPM',
    status: 'connected'
  },
  {
    id: 'cohere',
    name: 'Cohere',
    baseUrl: 'https://api.cohere.com/v2',
    apiKeyUrl: 'https://dashboard.cohere.com/api-keys',
    creditCard: 'No',
    freeModels: 12,
    maxContext: '256K',
    modalities: ['image', 'text'],
    bestModels: ['command-a-218b', 'command-a-111b', 'command-r'],
    rateLimit: '20 RPM',
    status: 'connected'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    baseUrl: 'https://router.huggingface.co/v1',
    apiKeyUrl: 'https://huggingface.co/settings/tokens',
    creditCard: 'No',
    freeModels: 8,
    maxContext: '131K',
    modalities: ['code', 'image', 'text'],
    bestModels: ['meta-llama-3-1-8b-instruct', 'qwen2-5-coder-7b-instruct'],
    rateLimit: 'Credit-metered',
    status: 'connected'
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    baseUrl: 'https://api.cerebras.ai/v1',
    apiKeyUrl: 'https://cloud.cerebras.ai/',
    creditCard: 'No',
    freeModels: 6,
    maxContext: '131K',
    modalities: ['reasoning', 'text'],
    bestModels: ['llama3.1-70b', 'zai-glm-4.7'],
    rateLimit: '10 RPM, 100 RPD',
    status: 'connected'
  },
  {
    id: 'github-models',
    name: 'GitHub Models',
    baseUrl: 'https://models.github.ai/inference',
    apiKeyUrl: 'https://github.com/marketplace/models',
    creditCard: 'No',
    freeModels: 16,
    maxContext: '1M',
    modalities: ['image', 'pdf', 'reasoning', 'text'],
    bestModels: ['Phi-4', 'Mistral-large-2411'],
    rateLimit: 'See provider',
    status: 'connected'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKeyUrl: 'https://platform.deepseek.com/api_keys',
    creditCard: 'Registration',
    freeModels: 2,
    maxContext: '128K',
    modalities: ['text'],
    bestModels: ['deepseek-chat-v3-2', 'deepseek-reasoner-r1'],
    rateLimit: 'Dynamic',
    status: 'connected'
  },
  {
    id: 'sambanova',
    name: 'SambaNova',
    baseUrl: 'https://api.sambanova.ai/v1',
    apiKeyUrl: 'https://cloud.sambanova.ai/apis',
    creditCard: 'Registration',
    freeModels: 4,
    maxContext: '128K',
    modalities: ['image', 'reasoning', 'text'],
    bestModels: ['deepseek-v3-1', 'deepseek-v3-2-preview', 'minimax-m2-7'],
    rateLimit: '20 RPM, 20 RPD',
    status: 'connected'
  },
  {
    id: 'llm7',
    name: 'LLM7.io',
    baseUrl: 'https://api.llm7.io/v1',
    apiKeyUrl: 'https://token.llm7.io/',
    creditCard: 'No',
    freeModels: 20,
    maxContext: '1M',
    modalities: ['audio', 'code', 'image', 'pdf', 'reasoning', 'text', 'video', 'vision'],
    bestModels: ['gpt-oss-20b', 'mistral-Nemo-Instruct-2407', 'minimax-m2.7'],
    rateLimit: '10 RPM, 60 req/hr',
    status: 'connected'
  },
  {
    id: 'xai',
    name: 'xAI',
    baseUrl: 'https://api.x.ai/v1',
    apiKeyUrl: 'https://console.x.ai/',
    creditCard: 'Registration',
    freeModels: 3,
    maxContext: '2M',
    modalities: ['text'],
    bestModels: ['grok-4.3', 'grok-4.1-fast', 'grok-3-mini'],
    rateLimit: 'Credit-based',
    status: 'pending'
  },
  {
    id: 'kilo-code',
    name: 'Kilo Code',
    baseUrl: 'https://api.kilo.ai/api/gateway',
    apiKeyUrl: 'https://app.kilo.ai/profile',
    creditCard: 'No',
    freeModels: 15,
    maxContext: '1M',
    modalities: ['audio', 'code', 'image', 'reasoning', 'text', 'video'],
    bestModels: ['nvidia/nemotron-3-ultra-550b-a55b:free', 'stepfun/step-3.7-flash:free'],
    rateLimit: '200 req/hr',
    status: 'connected'
  },
  {
    id: 'chutes',
    name: 'Chutes.ai',
    baseUrl: 'https://api.chutes.ai/v1',
    apiKeyUrl: 'https://chutes.ai/',
    creditCard: 'Registration',
    freeModels: 2,
    maxContext: '131K',
    modalities: ['reasoning', 'text'],
    bestModels: ['deepseek-ai/DeepSeek-R1', 'meta-llama/Meta-Llama-3.1-70B-Instruct'],
    rateLimit: 'Community-powered',
    status: 'connected'
  }
];
