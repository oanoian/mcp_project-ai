import { z } from 'zod';

// ============================================================
// MAIN AI COMMUNICATION SCHEMAS
// ============================================================

export const MessageRoleSchema = z.enum(['main_ai', 'team_lead', 'agent', 'system']);
export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const MessageTypeSchema = z.enum([
  'task_delegation',
  'task_result',
  'broadcast',
  'status_update',
  'synthesis_request',
  'synthesis_result',
  'decision',
  'query',
  'response',
  'error',
  'acknowledgment'
]);
export type MessageType = z.infer<typeof MessageTypeSchema>;

export const CommunicationChannelSchema = z.enum([
  'main_to_team',
  'team_to_main',
  'team_to_agent',
  'agent_to_team',
  'agent_to_agent',
  'broadcast',
  'system'
]);
export type CommunicationChannel = z.infer<typeof CommunicationChannelSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  from: z.string(),
  to: z.string(),
  role: MessageRoleSchema,
  type: MessageTypeSchema,
  channel: CommunicationChannelSchema,
  content: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  status: z.enum(['sent', 'delivered', 'read', 'processed', 'failed']).optional(),
  taskId: z.string().optional(),
  teamId: z.string().optional(),
  agentId: z.string().optional(),
  responseTo: z.string().optional(),
});
export type Message = z.infer<typeof MessageSchema>;

export const TaskDelegationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  team: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  deadline: z.string().optional(),
  requirements: z.array(z.string()),
  context: z.string().optional(),
  expectedOutput: z.string().optional(),
  delegatedAt: z.string(),
  delegatedBy: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed', 'cancelled']),
  assignedAgents: z.array(z.string()),
  results: z.array(z.object({
    agentId: z.string(),
    result: z.string(),
    confidence: z.number(),
    timestamp: z.string(),
  })).optional(),
  synthesizedResult: z.string().optional(),
  synthesizedAt: z.string().optional(),
});
export type TaskDelegation = z.infer<typeof TaskDelegationSchema>;

export const SynthesisRequestSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  type: z.enum(['summary', 'detailed', 'code_review', 'architecture_review', 'research_synthesis']),
  requestedBy: z.string(),
  requestedAt: z.string(),
  agentResults: z.array(z.object({
    agentId: z.string(),
    team: z.string(),
    result: z.string(),
    confidence: z.number(),
    tokens: z.number(),
  })),
  synthesisPrompt: z.string(),
});
export type SynthesisRequest = z.infer<typeof SynthesisRequestSchema>;

export const DecisionRecordSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  decision: z.string(),
  rationale: z.string(),
  basedOn: z.array(z.string()), // task IDs or message IDs
  confidence: z.number(),
  impact: z.string(),
  nextSteps: z.array(z.string()),
});
export type DecisionRecord = z.infer<typeof DecisionRecordSchema>;

export const CommunicationFlowSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  flow: z.array(z.object({
    step: z.number(),
    from: z.string(),
    to: z.string(),
    action: z.string(),
    duration: z.number(), // ms
    status: z.enum(['pending', 'completed', 'failed']),
  })),
  totalDuration: z.number(),
  status: z.enum(['in_progress', 'completed', 'failed']),
});
export type CommunicationFlow = z.infer<typeof CommunicationFlowSchema>;
