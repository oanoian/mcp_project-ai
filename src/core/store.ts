import { create } from 'zustand';
import type { Agent, Task, Team, Provider, TeamType, AgentStatus, TaskStatus } from './schemas';
import type { Message, TaskDelegation, CommunicationFlow, DecisionRecord } from './communication-schemas';

// ============================================================
// STATE MANAGEMENT (Zustand Store)
// ============================================================

interface SystemMetrics {
  totalTokensProcessed: number;
  totalTasksCompleted: number;
  totalTasksFailed: number;
  avgLatency: number;
  systemUptime: number;
  messagesPerSecond: number;
  activeConnections: number;
  queueDepth: number;
}

interface LogEntry {
  id: string;
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  source: string;
  team: TeamType | 'system';
  message: string;
  metadata?: Record<string, unknown>;
}

interface AppState {
  // Core state
  agents: Agent[];
  tasks: Task[];
  teams: Team[];
  providers: Provider[];
  logs: LogEntry[];
  metrics: SystemMetrics;

  // Communication state
  messages: Message[];
  taskDelegations: TaskDelegation[];
  communicationFlows: CommunicationFlow[];
  decisions: DecisionRecord[];

  // UI state
  selectedTeam: TeamType | 'all';
  selectedAgent: string | null;
  activeView: 'architecture' | 'security' | 'dashboard' | 'teams' | 'providers' | 'tasks' | 'mcp-config' | 'logs' | 'main-ai-console';
  sidebarOpen: boolean;

  // Actions
  setSelectedTeam: (team: TeamType | 'all') => void;
  setSelectedAgent: (id: string | null) => void;
  setActiveView: (view: AppState['activeView']) => void;
  toggleSidebar: () => void;
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  updateAgentStatus: (agentId: string, status: AgentStatus) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  assignTask: (taskId: string, agentId: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  addTaskDelegation: (delegation: TaskDelegation) => void;
  updateTaskDelegation: (id: string, updates: Partial<TaskDelegation>) => void;
  addDecision: (decision: DecisionRecord) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  agents: [],
  tasks: [],
  teams: [],
  providers: [],
  logs: [],
  metrics: {
    totalTokensProcessed: 0,
    totalTasksCompleted: 0,
    totalTasksFailed: 0,
    avgLatency: 0,
    systemUptime: 0,
    messagesPerSecond: 0,
    activeConnections: 0,
    queueDepth: 0,
  },

  // Communication state
  messages: [],
  taskDelegations: [],
  communicationFlows: [],
  decisions: [],

  selectedTeam: 'all',
  selectedAgent: null,
  activeView: 'architecture',
  sidebarOpen: true,

  setSelectedTeam: (team) => set({ selectedTeam: team }),
  setSelectedAgent: (id) => set({ selectedAgent: id }),
  setActiveView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  addLog: (log) => set((state) => ({
    logs: [
      { ...log, id: `log-${Date.now()}-${Math.random().toString(36).slice(2)}`, timestamp: Date.now() },
      ...state.logs,
    ].slice(0, 200),
  })),

  updateAgentStatus: (agentId, status) => set((state) => ({
    agents: state.agents.map(a => a.id === agentId ? { ...a, status } : a),
  })),

  updateTaskStatus: (taskId, status) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t),
  })),

  assignTask: (taskId, agentId) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, assignedAgent: agentId, status: 'in_progress' as TaskStatus, startedAt: new Date().toISOString() } : t),
    agents: state.agents.map(a => a.id === agentId ? { ...a, currentTaskId: taskId, status: 'working' as AgentStatus } : a),
  })),

  // Communication actions
  addMessage: (message) => set((state) => ({
    messages: [
      { ...message, id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`, timestamp: new Date().toISOString() },
      ...state.messages,
    ].slice(0, 100),
  })),

  addTaskDelegation: (delegation) => set((state) => ({
    taskDelegations: [delegation, ...state.taskDelegations],
  })),

  updateTaskDelegation: (id, updates) => set((state) => ({
    taskDelegations: state.taskDelegations.map(td => td.id === id ? { ...td, ...updates } : td),
  })),

  addDecision: (decision) => set((state) => ({
    decisions: [decision, ...state.decisions],
  })),
}));
