import type { Message, TaskDelegation, CommunicationFlow, DecisionRecord } from './communication-schemas';

// ============================================================
// COMMUNICATION DATA (Empty - No Sample Data)
// ============================================================

export const sampleMessages: Message[] = [];
export const sampleTaskDelegations: TaskDelegation[] = [];
export const sampleCommunicationFlows: CommunicationFlow[] = [];
export const sampleDecisions: DecisionRecord[] = [];

// ============================================================
// COMMUNICATION SIMULATION
// ============================================================

export function generateRealtimeMessage(): Message | null {
  // Return null - no automatic message generation
  return null;
}
