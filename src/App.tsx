import { useState, useEffect } from 'react';
import { providers } from './data/providers';
import { teams, allAgents, type Team, type Agent, type TeamType } from './data/agents';

type TabType = 'overview' | 'teams' | 'providers' | 'mcp-config' | 'logs';

interface LogEntry {
  id: string;
  timestamp: string;
  agent: string;
  team: string;
  action: string;
  status: 'success' | 'info' | 'warning' | 'error';
}

function generateLogs(): LogEntry[] {
  const actions = [
    'Completed research task',
    'Submitted code review',
    'Architecture decision made',
    'Algorithm optimized',
    'Component rendered',
    'API endpoint deployed',
    'Connected to provider',
    'Task delegated from lead',
    'Result synthesized',
    'Heartbeat confirmed',
  ];
  const logs: LogEntry[] = [];
  for (let i = 0; i < 25; i++) {
    const agent = allAgents[Math.floor(Math.random() * allAgents.length)];
    const mins = Math.floor(Math.random() * 60);
    logs.push({
      id: `log-${i}`,
      timestamp: `${mins}m ago`,
      agent: agent.name,
      team: agent.team,
      action: actions[Math.floor(Math.random() * actions.length)],
      status: (['success', 'info', 'warning', 'error'] as const)[Math.floor(Math.random() * 4)],
    });
  }
  return logs.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedTeam, setSelectedTeam] = useState<TeamType | 'all'>('all');
  const [logs] = useState<LogEntry[]>(generateLogs());
  const [tick, setTick] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const totalAgents = allAgents.length;
  const activeAgents = allAgents.filter(a => a.status === 'working' || a.status === 'active').length;
  const connectedProviders = providers.filter(p => p.status === 'connected').length;
  const totalTasks = allAgents.reduce((sum, a) => sum + a.tasksCompleted, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-800 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                M
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  MCP Server Command Center
                </h1>
                <p className="text-xs text-gray-500">60-Agent Multi-Team AI Orchestration System</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Server Online</span>
            </div>
            <div className="hidden sm:block text-xs text-gray-500">
              Uptime: {(tick % 100) + 1}h {tick % 60}m
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-56 bg-gray-900 border-r border-gray-800 transition-transform duration-200 pt-16 lg:pt-0`}>
          <nav className="p-3 space-y-1">
            {([
              { id: 'overview', icon: '📊', label: 'Overview' },
              { id: 'teams', icon: '👥', label: 'Agent Teams' },
              { id: 'providers', icon: '🔌', label: 'API Providers' },
              { id: 'mcp-config', icon: '⚙️', label: 'MCP Config' },
              { id: 'logs', icon: '📋', label: 'Activity Logs' },
            ] as { id: TabType; icon: string; label: string }[]).map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === item.id
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Quick Stats in Sidebar */}
          <div className="p-3 mt-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-2 font-medium">QUICK STATS</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Agents Online</span>
                <span className="text-green-400">{activeAgents}/{totalAgents}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Providers</span>
                <span className="text-cyan-400">{connectedProviders}/{providers.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Tasks Done</span>
                <span className="text-violet-400">{totalTasks.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeTab === 'overview' && <OverviewTab teams={teams} activeAgents={activeAgents} totalAgents={totalAgents} connectedProviders={connectedProviders} totalTasks={totalTasks} />}
          {activeTab === 'teams' && <TeamsTab teams={teams} selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} />}
          {activeTab === 'providers' && <ProvidersTab />}
          {activeTab === 'mcp-config' && <MCPConfigTab />}
          {activeTab === 'logs' && <LogsTab logs={logs} />}
        </main>
      </div>
    </div>
  );
}

// ============= OVERVIEW TAB =============
function OverviewTab({ teams, activeAgents, totalAgents, connectedProviders, totalTasks }: {
  teams: Team[]; activeAgents: number; totalAgents: number; connectedProviders: number; totalTasks: number;
}) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🤖" label="Total Agents" value={totalAgents.toString()} sub="6 teams × 10 agents" color="violet" />
        <StatCard icon="⚡" label="Active Now" value={activeAgents.toString()} sub={`${Math.round(activeAgents/totalAgents*100)}% utilization`} color="green" />
        <StatCard icon="🔌" label="API Providers" value={`${connectedProviders}/${providers.length}`} sub="Connected & ready" color="cyan" />
        <StatCard icon="✅" label="Tasks Completed" value={totalTasks.toLocaleString()} sub="All time" color="amber" />
      </div>

      {/* Architecture Diagram */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>🏛️</span> MCP Server Architecture
        </h2>
        <div className="relative">
          {/* Main Lead */}
          <div className="flex justify-center mb-6">
            <div className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl shadow-lg shadow-violet-500/20">
              <div className="text-center">
                <div className="text-sm font-bold">🧠 Main Lead AI (MCP User)</div>
                <div className="text-xs text-violet-200">Orchestrates all 60 agents</div>
              </div>
            </div>
          </div>

          {/* Connection Lines */}
          <div className="flex justify-center mb-4">
            <div className="w-px h-8 bg-gradient-to-b from-violet-500 to-gray-700"></div>
          </div>

          {/* MCP Protocol Layer */}
          <div className="flex justify-center mb-4">
            <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
              <span className="text-xs text-gray-400">MCP Protocol Layer — JSON-RPC 2.0 | stdio/SSE Transport</span>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <div className="w-px h-6 bg-gray-700"></div>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {teams.map(team => (
              <div key={team.id} className={`bg-gradient-to-br ${team.color} p-0.5 rounded-xl`}>
                <div className="bg-gray-900 rounded-[10px] p-3 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{team.icon}</span>
                    <span className="text-sm font-semibold">{team.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {team.agents.slice(0, 5).map((agent, i) => (
                        <div key={i} className={`w-4 h-4 rounded-full border border-gray-900 ${
                          agent.status === 'working' ? 'bg-green-400' :
                          agent.status === 'active' ? 'bg-blue-400' :
                          agent.status === 'idle' ? 'bg-gray-500' : 'bg-red-400'
                        }`}></div>
                      ))}
                      <div className="w-4 h-4 rounded-full border border-gray-900 bg-gray-700 flex items-center justify-center">
                        <span className="text-[8px]">+5</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {team.agents.filter(a => a.status === 'working').length}/10 working
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>📈</span> Team Performance
        </h2>
        <div className="space-y-3">
          {teams.map(team => {
            const completed = team.agents.reduce((s, a) => s + a.tasksCompleted, 0);
            const working = team.agents.filter(a => a.status === 'working').length;
            const pct = Math.round((working / 10) * 100);
            return (
              <div key={team.id} className="flex items-center gap-4">
                <span className="text-lg w-8">{team.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{team.name}</span>
                    <span className="text-xs text-gray-400">{completed} tasks • {working}/10 active</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${team.color} transition-all duration-1000`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>🔔</span> Recent Activity
        </h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {allAgents.filter(a => a.status === 'working').slice(0, 8).map(agent => (
            <div key={agent.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-gray-400 w-16">{agent.team}</span>
              <span className="text-sm truncate flex-1">{agent.currentTask}</span>
              <span className="text-xs text-gray-500">{agent.lastPing}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string; sub: string; color: string }) {
  const colorMap: Record<string, string> = {
    violet: 'from-violet-500/20 to-violet-600/5 border-violet-500/30',
    green: 'from-green-500/20 to-green-600/5 border-green-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/30',
  };
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{sub}</div>
    </div>
  );
}

// ============= TEAMS TAB =============
function TeamsTab({ teams, selectedTeam, setSelectedTeam }: {
  teams: Team[]; selectedTeam: TeamType | 'all'; setSelectedTeam: (t: TeamType | 'all') => void;
}) {
  const filteredTeams = selectedTeam === 'all' ? teams : teams.filter(t => t.id === selectedTeam);

  return (
    <div className="space-y-6">
      {/* Team Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTeam('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedTeam === 'all' ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          All Teams (60)
        </button>
        {teams.map(team => (
          <button
            key={team.id}
            onClick={() => setSelectedTeam(team.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTeam === team.id ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {team.icon} {team.name.split(' ')[0]} (10)
          </button>
        ))}
      </div>

      {/* Team Cards */}
      {filteredTeams.map(team => (
        <div key={team.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className={`bg-gradient-to-r ${team.color} p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{team.icon}</span>
                <div>
                  <h3 className="text-lg font-bold">{team.name}</h3>
                  <p className="text-sm text-white/70">{team.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {team.agents.filter(a => a.status === 'working').length}/10 Working
                </div>
                <div className="text-xs text-white/60">
                  {team.agents.reduce((s, a) => s + a.tasksCompleted, 0)} total tasks
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {team.agents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const statusColors: Record<string, string> = {
    active: 'bg-blue-400',
    idle: 'bg-gray-500',
    working: 'bg-green-400',
    error: 'bg-red-400',
  };
  const statusLabels: Record<string, string> = {
    active: 'Active',
    idle: 'Idle',
    working: 'Working',
    error: 'Error',
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 hover:border-gray-600 transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${statusColors[agent.status]} ${agent.status === 'working' ? 'animate-pulse' : ''}`}></div>
          <span className="text-sm font-medium">{agent.name}</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
          agent.status === 'working' ? 'bg-green-500/20 text-green-400' :
          agent.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
          agent.status === 'idle' ? 'bg-gray-500/20 text-gray-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {statusLabels[agent.status]}
        </span>
      </div>
      <div className="text-xs text-gray-400 mb-2 truncate">
        📋 {agent.currentTask}
      </div>
      <div className="flex items-center justify-between text-[10px] text-gray-500">
        <span>🔌 {agent.provider}</span>
        <span>📦 {agent.model}</span>
      </div>
      <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
        <span>✅ {agent.tasksCompleted} tasks</span>
        <span>⏱️ {agent.uptime}</span>
      </div>
    </div>
  );
}

// ============= PROVIDERS TAB =============
function ProvidersTab() {
  const [search, setSearch] = useState('');
  const filtered = providers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.modalities.some(m => m.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">API Provider Connections</h2>
          <p className="text-sm text-gray-400">Connected to {providers.filter(p => p.status === 'connected').length} of {providers.length} free LLM API providers</p>
        </div>
        <input
          type="text"
          placeholder="Search providers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-violet-500 w-full sm:w-64"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(provider => (
          <div key={provider.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm">{provider.name}</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5 truncate max-w-[200px]">{provider.baseUrl}</p>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                provider.status === 'connected' ? 'bg-green-500/20 text-green-400' :
                provider.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  provider.status === 'connected' ? 'bg-green-400' :
                  provider.status === 'pending' ? 'bg-amber-400' : 'bg-red-400'
                }`}></div>
                {provider.status}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-violet-400">{provider.freeModels}</div>
                <div className="text-[10px] text-gray-500">Models</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-cyan-400">{provider.maxContext}</div>
                <div className="text-[10px] text-gray-500">Context</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-amber-400">{provider.rateLimit.split(',')[0]}</div>
                <div className="text-[10px] text-gray-500">Rate Limit</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {provider.modalities.slice(0, 5).map(m => (
                <span key={m} className="text-[10px] px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">{m}</span>
              ))}
              {provider.modalities.length > 5 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-800 rounded text-gray-500">+{provider.modalities.length - 5}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">💳 {provider.creditCard}</span>
              <div className="flex gap-1">
                {provider.bestModels.slice(0, 2).map(m => (
                  <span key={m} className="text-[10px] px-1.5 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded text-violet-400 truncate max-w-[120px]">{m}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============= MCP CONFIG TAB =============
function MCPConfigTab() {
  const mcpConfig = `{
  "mcpServers": {
    "ai-swarm-command": {
      "command": "node",
      "args": ["./mcp-server/index.js"],
      "env": {
        "TOTAL_AGENTS": "60",
        "TEAMS": "research,code,architect,algorithm,frontend,backend",
        "AGENTS_PER_TEAM": "10",
        "TRANSPORT": "stdio",
        "LOG_LEVEL": "info"
      }
    }
  }
}`;

  const serverCode = `// MCP Server - AI Swarm Command Center
const { Server } = require('@modelcontextprotocol/sdk/server');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');
const { z } = require('zod');

const server = new Server({
  name: 'ai-swarm-command',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
    resources: {},
    prompts: {},
  }
});

// Team Configuration
const TEAMS = {
  research: { slots: 10, providers: ['nvidia-nim', 'google-gemini', 'openrouter', 'groq', 'deepseek'] },
  code: { slots: 10, providers: ['huggingface', 'cerebras', 'mistral', 'sambanova', 'cloudflare'] },
  architect: { slots: 10, providers: ['cohere', 'nvidia-nim', 'openrouter', 'llm7', 'kilo-code'] },
  algorithm: { slots: 10, providers: ['cerebras', 'groq', 'deepseek', 'chutes', 'nvidia-nim'] },
  frontend: { slots: 10, providers: ['google-gemini', 'mistral', 'cloudflare', 'github-models', 'llm7'] },
  backend: { slots: 10, providers: ['sambanova', 'cohere', 'huggingface', 'kilo-code', 'cloudflare'] },
};

// Register Tools
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'delegate_task',
      description: 'Delegate a task to a specific team or agent',
      inputSchema: z.object({
        team: z.enum(['research', 'code', 'architect', 'algorithm', 'frontend', 'backend']),
        task: z.string(),
        priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
        agent_slot: z.number().min(1).max(10).optional(),
      }),
    },
    {
      name: 'broadcast_to_team',
      description: 'Send a message to all agents in a team',
      inputSchema: z.object({
        team: z.enum(['research', 'code', 'architect', 'algorithm', 'frontend', 'backend']),
        message: z.string(),
      }),
    },
    {
      name: 'get_team_status',
      description: 'Get the current status of all agents in a team',
      inputSchema: z.object({
        team: z.enum(['research', 'code', 'architect', 'algorithm', 'frontend', 'backend']).optional(),
      }),
    },
    {
      name: 'synthesize_results',
      description: 'Collect and synthesize results from multiple agents',
      inputSchema: z.object({
        teams: z.array(z.enum(['research', 'code', 'architect', 'algorithm', 'frontend', 'backend'])),
        synthesis_type: z.enum(['summary', 'detailed', 'code_review', 'architecture_review']),
      }),
    },
    {
      name: 'reassign_agent',
      description: 'Reassign an agent to a different task or team',
      inputSchema: z.object({
        agent_id: z.string(),
        new_team: z.enum(['research', 'code', 'architect', 'algorithm', 'frontend', 'backend']).optional(),
        new_task: z.string().optional(),
      }),
    },
    {
      name: 'research_query',
      description: 'Mandatory research - dispatch to research team for verification',
      inputSchema: z.object({
        query: z.string(),
        depth: z.enum(['shallow', 'moderate', 'deep', 'exhaustive']),
        cross_reference: z.boolean().optional(),
      }),
    },
  ],
}));

// Tool Execution Handler
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'delegate_task':
      return await handleDelegateTask(args);
    case 'broadcast_to_team':
      return await handleBroadcast(args);
    case 'get_team_status':
      return await handleGetStatus(args);
    case 'synthesize_results':
      return await handleSynthesize(args);
    case 'research_query':
      return await handleResearchQuery(args);
    default:
      throw new Error(\`Unknown tool: \${name}\`);
  }
});

async function handleDelegateTask(args) {
  const team = TEAMS[args.team];
  const slot = args.agent_slot || Math.ceil(Math.random() * 10);
  const provider = team.providers[slot % team.providers.length];
  
  // Route to appropriate LLM API
  const response = await callProvider(provider, {
    task: args.task,
    priority: args.priority || 'medium',
    context: \`You are \${args.team} agent #\${slot}\`,
  });
  
  return { content: [{ type: 'text', text: JSON.stringify(response) }] };
}

// Start server
const transport = new StdioServerTransport();
server.connect(transport);`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">MCP Server Configuration</h2>
        <p className="text-sm text-gray-400">Configure the MCP server that orchestrates all 60 AI agents across 6 specialized teams</p>
      </div>

      {/* Connection Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Transport</div>
          <div className="text-sm font-mono text-cyan-400">stdio / SSE</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Protocol</div>
          <div className="text-sm font-mono text-violet-400">JSON-RPC 2.0</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Agent Slots</div>
          <div className="text-sm font-mono text-green-400">60 (6 teams × 10)</div>
        </div>
      </div>

      {/* MCP Config JSON */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-800">
          <span className="text-xs font-medium text-gray-400">mcp.config.json</span>
          <button className="text-xs px-2 py-1 bg-violet-500/20 text-violet-400 rounded hover:bg-violet-500/30">
            Copy
          </button>
        </div>
        <pre className="p-4 text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed">
          {mcpConfig}
        </pre>
      </div>

      {/* Server Code */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-800">
          <span className="text-xs font-medium text-gray-400">mcp-server/index.js</span>
          <button className="text-xs px-2 py-1 bg-violet-500/20 text-violet-400 rounded hover:bg-violet-500/30">
            Copy
          </button>
        </div>
        <pre className="p-4 text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed max-h-[500px] overflow-y-auto">
          {serverCode}
        </pre>
      </div>

      {/* Available Tools */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">🛠️ Available MCP Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'delegate_task', desc: 'Delegate a task to a specific team or agent slot', params: 'team, task, priority, agent_slot' },
            { name: 'broadcast_to_team', desc: 'Send a message to all agents in a team', params: 'team, message' },
            { name: 'get_team_status', desc: 'Get current status of all agents in a team', params: 'team (optional)' },
            { name: 'synthesize_results', desc: 'Collect and synthesize results from multiple agents', params: 'teams[], synthesis_type' },
            { name: 'reassign_agent', desc: 'Reassign an agent to a different task or team', params: 'agent_id, new_team, new_task' },
            { name: 'research_query', desc: 'Mandatory research dispatch to research team', params: 'query, depth, cross_reference' },
          ].map(tool => (
            <div key={tool.name} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
              <div className="text-sm font-mono text-cyan-400 mb-1">{tool.name}</div>
              <div className="text-xs text-gray-400 mb-2">{tool.desc}</div>
              <div className="text-[10px] text-gray-500">Params: {tool.params}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============= LOGS TAB =============
function LogsTab({ logs }: { logs: LogEntry[] }) {
  const statusColors: Record<string, string> = {
    success: 'text-green-400 bg-green-500/10',
    info: 'text-blue-400 bg-blue-500/10',
    warning: 'text-amber-400 bg-amber-500/10',
    error: 'text-red-400 bg-red-500/10',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Activity Logs</h2>
          <p className="text-sm text-gray-400">Real-time communication log between agents and the lead AI</p>
        </div>
        <div className="flex gap-2">
          {['all', 'success', 'info', 'warning', 'error'].map(filter => (
            <button key={filter} className="text-xs px-3 py-1.5 bg-gray-800 rounded-lg text-gray-400 hover:text-white capitalize">
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-800/50">
          {logs.map(log => (
            <div key={log.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/30">
              <span className="text-xs text-gray-500 w-14 shrink-0">{log.timestamp}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[log.status]}`}>
                {log.status}
              </span>
              <span className="text-xs text-violet-400 w-28 truncate shrink-0">{log.agent}</span>
              <span className="text-xs text-gray-500 w-20 shrink-0">[{log.team}]</span>
              <span className="text-sm text-gray-300 truncate">{log.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
