import { z } from 'zod';

// ============================================================
// LAYER 1: CORE SCHEMAS (Zod Runtime Validation)
// ============================================================

export const TeamTypeSchema = z.enum([
  'research', 'code', 'architect', 'algorithm', 'frontend', 'backend'
]);
export type TeamType = z.infer<typeof TeamTypeSchema>;

export const AgentStatusSchema = z.enum([
  'initializing', 'idle', 'working', 'awaiting_review', 'error', 'terminated'
]);
export type AgentStatus = z.infer<typeof AgentStatusSchema>;

export const TaskPrioritySchema = z.enum(['critical', 'high', 'medium', 'low']);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const TaskStatusSchema = z.enum([
  'queued', 'dispatched', 'in_progress', 'review', 'completed', 'failed', 'cancelled'
]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TransportSchema = z.enum(['stdio', 'sse', 'http']);
export type Transport = z.infer<typeof TransportSchema>;

export const ProviderStatusSchema = z.enum(['connected', 'degraded', 'disconnected', 'rate_limited']);
export type ProviderStatus = z.infer<typeof ProviderStatusSchema>;

// ============================================================
// LAYER 2: ENTITY SCHEMAS
// ============================================================

export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  baseUrl: z.string().url(),
  apiKeyEnv: z.string(),
  creditCardRequired: z.boolean(),
  freeModelCount: z.number(),
  maxContextTokens: z.number(),
  modalities: z.array(z.string()),
  bestModels: z.array(z.string()),
  rateLimit: z.object({
    rpm: z.number().optional(),
    rpd: z.number().optional(),
    tpm: z.number().optional(),
  }),
  status: ProviderStatusSchema,
  latency: z.number(), // ms
  uptime: z.number(), // percentage
  totalRequests: z.number(),
  failedRequests: z.number(),
});
export type Provider = z.infer<typeof ProviderSchema>;

export const ContextWindowSchema = z.object({
  used: z.number(),
  max: z.number(),
});

export const HealthSchema = z.object({
  cpu: z.number(),
  memory: z.number(),
  score: z.number(),
});

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  team: TeamTypeSchema,
  slot: z.number().min(1).max(10),
  assignedProvider: z.string(),
  model: z.string(),
  status: AgentStatusSchema,
  currentTaskId: z.string().nullable(),
  tasksCompleted: z.number(),
  tasksFailed: z.number(),
  avgResponseTime: z.number(),
  tokensUsed: z.number(),
  initializedAt: z.string(),
  lastHeartbeat: z.string(),
  contextWindow: ContextWindowSchema,
  health: HealthSchema,
});
export type Agent = z.infer<typeof AgentSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  team: TeamTypeSchema,
  priority: TaskPrioritySchema,
  status: TaskStatusSchema,
  assignedAgent: z.string().nullable(),
  createdBy: z.string(),
  createdAt: z.string(),
  startedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  result: z.string().nullable(),
  dependencies: z.array(z.string()),
  retryCount: z.number(),
  maxRetries: z.number(),
  metadata: z.record(z.string(), z.unknown()),
});
export type Task = z.infer<typeof TaskSchema>;

export const TeamMetricsSchema = z.object({
  totalTasks: z.number(),
  completedTasks: z.number(),
  failedTasks: z.number(),
  avgCompletionTime: z.number(),
  throughput: z.number(),
});

export const TeamSchema = z.object({
  id: TeamTypeSchema,
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  gradient: z.string(),
  description: z.string(),
  capabilities: z.array(z.string()),
  agentCount: z.number(),
  agents: z.array(AgentSchema),
  metrics: TeamMetricsSchema,
});
export type Team = z.infer<typeof TeamSchema>;

// ============================================================
// LAYER 3: MCP PROTOCOL SCHEMAS
// ============================================================

export const MCPToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.record(z.string(), z.unknown()),
  category: z.enum(['delegation', 'monitoring', 'synthesis', 'lifecycle', 'research']),
});
export type MCPTool = z.infer<typeof MCPToolSchema>;

export const MCPMessageSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.string().or(z.number()),
  method: z.string(),
  params: z.record(z.string(), z.unknown()).optional(),
});
export type MCPMessage = z.infer<typeof MCPMessageSchema>;

export const MCPErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.unknown().optional(),
});

export const MCPResponseSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.string().or(z.number()),
  result: z.unknown().optional(),
  error: MCPErrorSchema.optional(),
});
export type MCPResponse = z.infer<typeof MCPResponseSchema>;

// ============================================================
// LAYER 4: ARCHITECTURE LAYER DEFINITIONS
// ============================================================

export interface ArchitectureLayer {
  id: string;
  name: string;
  description: string;
  color: string;
  components: ArchitectureComponent[];
}

export interface ArchitectureComponent {
  id: string;
  name: string;
  technology: string;
  framework: string;
  purpose: string;
  status: 'active' | 'planned' | 'deprecated';
}

export const architectureLayers: ArchitectureLayer[] = [
  {
    id: 'transport',
    name: 'Transport Layer',
    description: 'Handles communication protocols between MCP client and server',
    color: '#06b6d4',
    components: [
      { id: 'stdio', name: 'STDIO Transport', technology: 'Node.js Streams', framework: '@modelcontextprotocol/sdk', purpose: 'Local process communication', status: 'active' },
      { id: 'sse', name: 'SSE Transport', technology: 'Server-Sent Events', framework: '@hono/node-server', purpose: 'HTTP streaming for remote clients', status: 'active' },
      { id: 'websocket', name: 'WebSocket Bridge', technology: 'WebSocket', framework: 'ws + socket.io', purpose: 'Real-time bidirectional communication', status: 'active' },
    ],
  },
  {
    id: 'protocol',
    name: 'Protocol Layer',
    description: 'JSON-RPC 2.0 message handling and validation',
    color: '#8b5cf6',
    components: [
      { id: 'jsonrpc', name: 'JSON-RPC 2.0 Engine', technology: 'TypeScript', framework: '@modelcontextprotocol/sdk', purpose: 'Protocol message parsing & routing', status: 'active' },
      { id: 'schema', name: 'Schema Validation', technology: 'Runtime Types', framework: 'zod', purpose: 'Input/output validation for all messages', status: 'active' },
      { id: 'serializer', name: 'Message Serializer', technology: 'JSON', framework: 'Custom', purpose: 'Efficient message encoding/decoding', status: 'active' },
    ],
  },
  {
    id: 'orchestration',
    name: 'Orchestration Layer',
    description: 'Main Lead AI coordination and task distribution',
    color: '#f59e0b',
    components: [
      { id: 'lead-ai', name: 'Lead AI Coordinator', technology: 'LLM API', framework: 'OpenAI-compatible', purpose: 'Central decision maker & task dispatcher', status: 'active' },
      { id: 'router', name: 'Task Router', technology: 'Priority Queue', framework: 'bullmq', purpose: 'Intelligent task routing to teams', status: 'active' },
      { id: 'synthesizer', name: 'Result Synthesizer', technology: 'Map-Reduce', framework: 'Custom', purpose: 'Aggregates multi-agent results', status: 'active' },
      { id: 'scheduler', name: 'Task Scheduler', technology: 'Cron + Queue', framework: 'bullmq + cron', purpose: 'Scheduled & recurring task management', status: 'active' },
    ],
  },
  {
    id: 'team-management',
    name: 'Team Management Layer',
    description: '6 specialized team managers with agent pools',
    color: '#10b981',
    components: [
      { id: 'team-mgr', name: 'Team Manager', technology: 'State Machine', framework: 'xstate', purpose: 'Manages team lifecycle & agent allocation', status: 'active' },
      { id: 'load-bal', name: 'Load Balancer', technology: 'Weighted Round-Robin', framework: 'Custom', purpose: 'Distributes tasks across team agents', status: 'active' },
      { id: 'health-mon', name: 'Health Monitor', technology: 'Heartbeat', framework: 'Custom', purpose: 'Agent health checks & auto-recovery', status: 'active' },
      { id: 'context-mgr', name: 'Context Manager', technology: 'Token Budget', framework: 'tiktoken', purpose: 'Manages context window allocation', status: 'active' },
    ],
  },
  {
    id: 'agent-pool',
    name: 'Agent Pool Layer',
    description: '60 individual AI agents with lifecycle management',
    color: '#ec4899',
    components: [
      { id: 'agent-runtime', name: 'Agent Runtime', technology: 'Async Workers', framework: 'workerpool', purpose: 'Individual agent execution environment', status: 'active' },
      { id: 'state-machine', name: 'Agent State Machine', technology: 'FSM', framework: 'xstate', purpose: 'Agent lifecycle: init→idle→work→review', status: 'active' },
      { id: 'memory', name: 'Agent Memory', technology: 'Vector Store', framework: 'langchain', purpose: 'Short/long-term memory per agent', status: 'active' },
      { id: 'tool-exec', name: 'Tool Executor', technology: 'Sandbox', framework: 'isolated-vm', purpose: 'Safe tool execution per agent', status: 'active' },
    ],
  },
  {
    id: 'provider-gateway',
    name: 'Provider Gateway Layer',
    description: 'Connection pooling & routing to 16+ free LLM APIs',
    color: '#3b82f6',
    components: [
      { id: 'conn-pool', name: 'Connection Pool', technology: 'HTTP/2', framework: 'undici', purpose: 'Persistent connections to API providers', status: 'active' },
      { id: 'rate-limiter', name: 'Rate Limiter', technology: 'Token Bucket', framework: 'rate-limiter-flexible', purpose: 'Per-provider rate limit enforcement', status: 'active' },
      { id: 'fallback', name: 'Fallback Router', technology: 'Circuit Breaker', framework: 'opossum', purpose: 'Auto-failover between providers', status: 'active' },
      { id: 'cache', name: 'Response Cache', technology: 'LRU + Redis', framework: 'ioredis + lru-cache', purpose: 'Cache identical requests', status: 'active' },
    ],
  },
  {
    id: 'state',
    name: 'State & Persistence Layer',
    description: 'System state management and data persistence',
    color: '#f97316',
    components: [
      { id: 'redis', name: 'State Store', technology: 'Redis', framework: 'ioredis', purpose: 'Agent state, task queue, pub/sub', status: 'active' },
      { id: 'postgres', name: 'Task History', technology: 'PostgreSQL', framework: 'drizzle-orm', purpose: 'Persistent task & result storage', status: 'active' },
      { id: 'event-bus', name: 'Event Bus', technology: 'Pub/Sub', framework: 'ioredis + EventEmitter', purpose: 'Inter-agent communication', status: 'active' },
      { id: 'metrics', name: 'Metrics Store', technology: 'Time-Series', framework: 'prom-client', purpose: 'Performance metrics & alerting', status: 'active' },
    ],
  },
  {
    id: 'observability',
    name: 'Observability Layer',
    description: 'Logging, monitoring, tracing, and alerting',
    color: '#ef4444',
    components: [
      { id: 'logger', name: 'Structured Logger', technology: 'JSON Logs', framework: 'pino', purpose: 'High-performance structured logging', status: 'active' },
      { id: 'tracer', name: 'Distributed Tracer', technology: 'OpenTelemetry', framework: '@opentelemetry/sdk-node', purpose: 'End-to-end request tracing', status: 'active' },
      { id: 'dashboard', name: 'Metrics Dashboard', technology: 'React + WebSocket', framework: 'React + zustand', purpose: 'Real-time system visualization', status: 'active' },
      { id: 'alerts', name: 'Alert System', technology: 'Webhook', framework: 'Custom', purpose: 'Threshold-based alerting', status: 'active' },
    ],
  },
];
