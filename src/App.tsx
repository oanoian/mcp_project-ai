import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Server, Cpu, Network, Shield, Layers,
  ChevronRight, Zap, Clock,
  GitBranch, Box, Terminal, BarChart3, Settings, Radio
} from 'lucide-react';
import { useAppStore } from './core/store';
import { initialProviders, generateAgents, generateTasks, teamConfigs } from './core/data';
import { architectureLayers } from './core/schemas';
import type { TeamType } from './core/schemas';

export default function App() {
  const {
    activeView, setActiveView, sidebarOpen, toggleSidebar,
    selectedTeam, setSelectedTeam, agents, tasks, providers, logs, metrics
  } = useAppStore();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      const store = useAppStore.getState();
      const generatedAgents = generateAgents();
      const generatedTasks = generateTasks();

      useAppStore.setState({
        agents: generatedAgents,
        tasks: generatedTasks,
        providers: initialProviders,
        teams: teamConfigs.map(tc => ({
          ...tc,
          agentCount: 10,
          agents: generatedAgents.filter(a => a.team === tc.id),
          metrics: {
            totalTasks: 10,
            completedTasks: generatedTasks.filter(t => t.team === tc.id && t.status === 'completed').length,
            failedTasks: Math.floor(Math.random() * 3),
            avgCompletionTime: Math.floor(Math.random() * 300) + 60,
            throughput: Math.floor(Math.random() * 20) + 5,
          },
        })),
        metrics: {
          totalTokensProcessed: generatedAgents.reduce((s, a) => s + a.tokensUsed, 0),
          totalTasksCompleted: generatedTasks.filter(t => t.status === 'completed').length,
          totalTasksFailed: generatedTasks.filter(t => t.status === 'failed').length,
          avgLatency: Math.floor(initialProviders.reduce((s, p) => s + p.latency, 0) / initialProviders.length),
          systemUptime: 99.7,
          messagesPerSecond: Math.floor(Math.random() * 50) + 20,
          activeConnections: initialProviders.filter(p => p.status === 'connected').length,
          queueDepth: generatedTasks.filter(t => t.status === 'queued').length,
        },
      });

      // Generate initial logs
      const logMessages = [
        { level: 'info' as const, source: 'orchestrator', message: 'MCP Server initialized with 60 agents across 6 teams' },
        { level: 'info' as const, source: 'gateway', message: 'Connected to 16 free LLM API providers' },
        { level: 'info' as const, source: 'queue', message: 'Task queue initialized with 60 pending tasks' },
        { level: 'info' as const, source: 'health', message: 'All agent health checks passed' },
        { level: 'info' as const, source: 'protocol', message: 'JSON-RPC 2.0 transport layer active (stdio + SSE)' },
        { level: 'warn' as const, source: 'gateway', message: 'xAI provider latency elevated (567ms)' },
        { level: 'info' as const, source: 'scheduler', message: 'Task distribution: 10 tasks per team allocated' },
        { level: 'info' as const, source: 'synthesizer', message: 'Result synthesis pipeline ready' },
      ];

      logMessages.forEach((msg, i) => {
        setTimeout(() => {
          useAppStore.getState().addLog({
            level: msg.level,
            source: msg.source,
            team: 'system',
            message: msg.message,
          });
        }, i * 300);
      });

      setInitialized(true);
    }
  }, [initialized]);

  const navItems = [
    { id: 'architecture' as const, icon: Layers, label: 'Architecture' },
    { id: 'dashboard' as const, icon: BarChart3, label: 'Dashboard' },
    { id: 'teams' as const, icon: Network, label: 'Agent Teams' },
    { id: 'providers' as const, icon: Server, label: 'API Providers' },
    { id: 'tasks' as const, icon: GitBranch, label: 'Task Queue' },
    { id: 'mcp-config' as const, icon: Settings, label: 'MCP Config' },
    { id: 'logs' as const, icon: Terminal, label: 'System Logs' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col font-sans">
      {/* Top Bar */}
      <header className="bg-[#0d0d14]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="p-2 hover:bg-white/5 rounded-lg transition-colors lg:hidden">
              <Network className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 flex items-center justify-center">
                  <Box className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0d0d14]"></div>
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight">MCP Swarm Server</h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">60-Agent Orchestration • v1.0.0</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <Radio className="w-3 h-3 text-green-400 animate-pulse" />
              <span className="text-[11px] text-green-400 font-medium">All Systems Operational</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1"><Cpu className="w-3 h-3" />{metrics.messagesPerSecond} msg/s</span>
              <span className="flex items-center gap-1"><Activity className="w-3 h-3" />{metrics.avgLatency}ms avg</span>
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{metrics.systemUptime}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -240, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -240, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-56 bg-[#0d0d14] border-r border-white/5 flex flex-col shrink-0 fixed lg:static inset-y-0 left-0 z-40 pt-14 lg:pt-0"
            >
              <nav className="p-2 space-y-0.5 flex-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveView(item.id); if (window.innerWidth < 1024) toggleSidebar(); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${
                      activeView === item.id
                        ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {activeView === item.id && <ChevronRight className="w-3 h-3 ml-auto" />}
                  </button>
                ))}
              </nav>

              {/* Sidebar Footer Stats */}
              <div className="p-3 border-t border-white/5 space-y-2">
                <div className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">System</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Agents</span>
                    <span className="text-green-400">{agents.filter(a => a.status === 'working').length}/60</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Providers</span>
                    <span className="text-cyan-400">{providers.filter(p => p.status === 'connected').length}/16</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Queue</span>
                    <span className="text-amber-400">{metrics.queueDepth}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Tokens</span>
                    <span className="text-violet-400">{(metrics.totalTokensProcessed / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 lg:p-6 max-w-7xl mx-auto"
            >
              {activeView === 'architecture' && <ArchitectureView />}
              {activeView === 'dashboard' && <DashboardView />}
              {activeView === 'teams' && <TeamsView selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} />}
              {activeView === 'providers' && <ProvidersView />}
              {activeView === 'tasks' && <TasksView />}
              {activeView === 'mcp-config' && <MCPConfigView />}
              {activeView === 'logs' && <LogsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ============================================================
// ARCHITECTURE VIEW
// ============================================================
function ArchitectureView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" />
            System Architecture
          </h2>
          <p className="text-sm text-gray-500 mt-1">8-layer enterprise architecture with 28 core components</p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">All Active</span>
        </div>
      </div>

      {/* Architecture Flow Diagram */}
      <div className="bg-[#0d0d14] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Data Flow: Lead AI → Teams → Agents → Providers</h3>
        <div className="flex flex-col items-center gap-2">
          {/* Lead AI */}
          <div className="px-6 py-3 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/30 rounded-xl">
            <div className="text-center">
              <div className="text-sm font-bold text-violet-300">🧠 Main Lead AI (MCP Client)</div>
              <div className="text-[10px] text-gray-500">Orchestrates all operations via JSON-RPC 2.0</div>
            </div>
          </div>

          <div className="w-px h-6 bg-gradient-to-b from-violet-500/50 to-transparent"></div>

          {/* Transport */}
          <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs text-cyan-400">
            Transport Layer: stdio | SSE | WebSocket
          </div>

          <div className="w-px h-4 bg-cyan-500/30"></div>

          {/* Protocol */}
          <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg text-xs text-violet-400">
            Protocol Layer: JSON-RPC 2.0 + Zod Validation
          </div>

          <div className="w-px h-4 bg-violet-500/30"></div>

          {/* Orchestration */}
          <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400">
            Orchestration: Task Router + Scheduler + Synthesizer
          </div>

          <div className="w-px h-4 bg-amber-500/30"></div>

          {/* Teams */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
            {teamConfigs.map(tc => (
              <div key={tc.id} className={`px-3 py-2 bg-gradient-to-br ${tc.gradient} rounded-lg bg-opacity-10`}
                style={{ background: `linear-gradient(135deg, ${tc.color}15, ${tc.color}05)`, border: `1px solid ${tc.color}30` }}>
                <div className="text-center">
                  <div className="text-lg">{tc.icon}</div>
                  <div className="text-[10px] font-medium mt-0.5" style={{ color: tc.color }}>{tc.name.split(' ')[0]}</div>
                  <div className="text-[9px] text-gray-500">10 agents</div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-px h-4 bg-green-500/30"></div>

          {/* Provider Gateway */}
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">
            Provider Gateway: Connection Pool + Rate Limiter + Circuit Breaker
          </div>

          <div className="w-px h-4 bg-blue-500/30"></div>

          {/* Providers */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {initialProviders.slice(0, 8).map(p => (
              <span key={p.id} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400">
                {p.name}
              </span>
            ))}
            <span className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-gray-500">
              +8 more
            </span>
          </div>
        </div>
      </div>

      {/* Layer Breakdown */}
      <div className="space-y-3">
        {architectureLayers.map((layer, idx) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-[#0d0d14] border border-white/5 rounded-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
              style={{ borderLeftColor: layer.color, borderLeftWidth: '3px' }}>
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: `${layer.color}20`, color: layer.color }}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{layer.name}</h3>
                <p className="text-[11px] text-gray-500">{layer.description}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${layer.color}15`, color: layer.color }}>
                {layer.components.length} components
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
              {layer.components.map(comp => (
                <div key={comp.id} className="bg-[#0d0d14] p-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: comp.status === 'active' ? '#10b981' : '#f59e0b' }}></div>
                    <span className="text-xs font-medium">{comp.name}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 space-y-0.5">
                    <div><span className="text-gray-600">Tech:</span> {comp.technology}</div>
                    <div><span className="text-gray-600">Framework:</span> <span className="text-violet-400/70">{comp.framework}</span></div>
                    <div className="text-gray-600 pt-0.5">{comp.purpose}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Technology Stack */}
      <div className="bg-[#0d0d14] border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Technology Stack
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { category: 'Core Runtime', items: ['Node.js 20+', 'TypeScript 5.x', 'ESM Modules'] },
            { category: 'MCP Protocol', items: ['@modelcontextprotocol/sdk', 'JSON-RPC 2.0', 'zod (validation)'] },
            { category: 'State & Queue', items: ['zustand', 'bullmq', 'ioredis'] },
            { category: 'HTTP/Transport', items: ['@hono/node-server', 'ws', 'socket.io'] },
            { category: 'AI/LLM', items: ['OpenAI SDK', 'tiktoken', 'langchain'] },
            { category: 'Resilience', items: ['opossum (circuit)', 'rate-limiter-flexible', 'undici'] },
            { category: 'Observability', items: ['pino', '@opentelemetry/sdk', 'prom-client'] },
            { category: 'Frontend', items: ['React 19', 'framer-motion', 'lucide-react'] },
          ].map(group => (
            <div key={group.category} className="space-y-1.5">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{group.category}</div>
              {group.items.map(item => (
                <div key={item} className="text-xs text-gray-300 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-violet-500/50"></div>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD VIEW
// ============================================================
function DashboardView() {
  const { agents, tasks, providers, metrics, teams } = useAppStore();

  const workingAgents = agents.filter(a => a.status === 'working').length;
  const idleAgents = agents.filter(a => a.status === 'idle').length;
  const errorAgents = agents.filter(a => a.status === 'error').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          System Dashboard
        </h2>
        <p className="text-sm text-gray-500 mt-1">Real-time metrics across all 60 agents and 16 providers</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard icon={<Cpu className="w-4 h-4" />} label="Working Agents" value={`${workingAgents}/60`} change="+3" color="green" />
        <MetricCard icon={<GitBranch className="w-4 h-4" />} label="Tasks In Progress" value={`${inProgressTasks}`} change={`${completedTasks} done`} color="violet" />
        <MetricCard icon={<Server className="w-4 h-4" />} label="Active Providers" value={`${providers.filter(p => p.status === 'connected').length}/16`} change="99.7% uptime" color="cyan" />
        <MetricCard icon={<Zap className="w-4 h-4" />} label="Throughput" value={`${metrics.messagesPerSecond}/s`} change={`${metrics.avgLatency}ms avg`} color="amber" />
      </div>

      {/* Agent Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0d0d14] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Agent Status Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'Working', count: workingAgents, color: '#10b981', bg: 'bg-green-500' },
              { label: 'Idle', count: idleAgents, color: '#6b7280', bg: 'bg-gray-500' },
              { label: 'Awaiting Review', count: agents.filter(a => a.status === 'awaiting_review').length, color: '#f59e0b', bg: 'bg-amber-500' },
              { label: 'Error', count: errorAgents, color: '#ef4444', bg: 'bg-red-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${item.bg}`}></div>
                <span className="text-xs text-gray-400 w-28">{item.label}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / 60) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <span className="text-xs font-mono text-gray-300 w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0d0d14] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Team Performance</h3>
          <div className="space-y-3">
            {teams.map(team => (
              <div key={team.id} className="flex items-center gap-3">
                <span className="text-base">{team.icon}</span>
                <span className="text-xs text-gray-400 w-20 truncate">{team.name.split(' ')[0]}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(team.metrics.completedTasks / 10) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: team.color }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 w-16 text-right">{team.metrics.throughput} t/hr</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Provider Latency */}
      <div className="bg-[#0d0d14] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">Provider Latency (ms)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {providers.sort((a, b) => a.latency - b.latency).map(p => (
            <div key={p.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium truncate">{p.name}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'connected' ? 'bg-green-400' : p.status === 'degraded' ? 'bg-amber-400' : 'bg-red-400'}`}></div>
              </div>
              <div className={`text-lg font-mono font-bold ${p.latency < 200 ? 'text-green-400' : p.latency < 400 ? 'text-amber-400' : 'text-red-400'}`}>
                {p.latency}<span className="text-[10px] text-gray-500">ms</span>
              </div>
              <div className="text-[9px] text-gray-600">{p.uptime}% uptime</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, change, color }: { icon: React.ReactNode; label: string; value: string; change: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'from-green-500/10 border-green-500/20 text-green-400',
    violet: 'from-violet-500/10 border-violet-500/20 text-violet-400',
    cyan: 'from-cyan-500/10 border-cyan-500/20 text-cyan-400',
    amber: 'from-amber-500/10 border-amber-500/20 text-amber-400',
  };
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2 text-gray-400">{icon}<span className="text-[11px]">{label}</span></div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-[10px] text-gray-500 mt-1">{change}</div>
    </div>
  );
}

// ============================================================
// TEAMS VIEW
// ============================================================
function TeamsView({ selectedTeam, setSelectedTeam }: { selectedTeam: TeamType | 'all'; setSelectedTeam: (t: TeamType | 'all') => void }) {
  const { teams, agents } = useAppStore();
  const filtered = selectedTeam === 'all' ? teams : teams.filter(t => t.id === selectedTeam);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Network className="w-5 h-5 text-green-400" />
          Agent Teams
        </h2>
        <p className="text-sm text-gray-500 mt-1">6 specialized teams × 10 agents each = 60 total agents</p>
      </div>

      {/* Team Filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedTeam('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedTeam === 'all' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
          All (60)
        </button>
        {teams.map(t => (
          <button key={t.id} onClick={() => setSelectedTeam(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedTeam === t.id ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
            {t.icon} {t.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Team Cards */}
      {filtered.map(team => (
        <div key={team.id} className="bg-[#0d0d14] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between"
            style={{ borderLeftColor: team.color, borderLeftWidth: '3px' }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{team.icon}</span>
              <div>
                <h3 className="text-sm font-bold">{team.name}</h3>
                <p className="text-[10px] text-gray-500">{team.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span>{team.agents.filter(a => a.status === 'working').length}/10 working</span>
              <span>{team.metrics.completedTasks}/10 completed</span>
            </div>
          </div>

          <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {team.agents.map(agent => (
              <div key={agent.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      agent.status === 'working' ? 'bg-green-400 animate-pulse' :
                      agent.status === 'idle' ? 'bg-gray-500' :
                      agent.status === 'awaiting_review' ? 'bg-amber-400' :
                      agent.status === 'error' ? 'bg-red-400' : 'bg-blue-400'
                    }`}></div>
                    <span className="text-xs font-mono font-medium">{agent.name}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{agent.status}</span>
                </div>
                <div className="text-[10px] text-gray-500 truncate mb-1">
                  📦 {agent.model}
                </div>
                <div className="flex items-center justify-between text-[9px] text-gray-600">
                  <span>🔌 {agent.assignedProvider}</span>
                  <span>⚡ {agent.avgResponseTime}ms</span>
                  <span>✅ {agent.tasksCompleted}</span>
                </div>
                {/* Health Bar */}
                <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${agent.health.score}%`,
                    backgroundColor: agent.health.score > 80 ? '#10b981' : agent.health.score > 60 ? '#f59e0b' : '#ef4444'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// PROVIDERS VIEW
// ============================================================
function ProvidersView() {
  const { providers } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-400" />
          API Provider Gateway
        </h2>
        <p className="text-sm text-gray-500 mt-1">16 free LLM API providers with connection pooling & circuit breakers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {providers.map(p => (
          <div key={p.id} className="bg-[#0d0d14] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold">{p.name}</h3>
                <p className="text-[10px] text-gray-600 font-mono truncate max-w-[200px]">{p.baseUrl}</p>
              </div>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                p.status === 'connected' ? 'bg-green-500/10 text-green-400' :
                p.status === 'degraded' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'connected' ? 'bg-green-400' : p.status === 'degraded' ? 'bg-amber-400' : 'bg-red-400'}`}></div>
                {p.status}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="text-center">
                <div className="text-sm font-bold text-violet-400">{p.freeModelCount}</div>
                <div className="text-[9px] text-gray-600">Models</div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-bold ${p.latency < 200 ? 'text-green-400' : p.latency < 400 ? 'text-amber-400' : 'text-red-400'}`}>{p.latency}ms</div>
                <div className="text-[9px] text-gray-600">Latency</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-cyan-400">{p.uptime}%</div>
                <div className="text-[9px] text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-amber-400">{(p.maxContextTokens / 1000).toFixed(0)}K</div>
                <div className="text-[9px] text-gray-600">Context</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              {p.modalities.slice(0, 5).map(m => (
                <span key={m} className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-gray-500">{m}</span>
              ))}
              {p.modalities.length > 5 && <span className="text-[9px] text-gray-600">+{p.modalities.length - 5}</span>}
            </div>

            <div className="flex items-center justify-between text-[9px] text-gray-600">
              <span>💳 {p.creditCardRequired ? 'Card required' : 'No card needed'}</span>
              <span>📊 {p.totalRequests.toLocaleString()} reqs | {p.failedRequests} failed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// TASKS VIEW
// ============================================================
function TasksView() {
  const { tasks } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'queued' | 'in_progress' | 'completed' | 'failed'>('all');

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-400" />
            Task Queue
          </h2>
          <p className="text-sm text-gray-500 mt-1">Priority-based task distribution with BullMQ</p>
        </div>
        <div className="flex gap-1.5">
          {(['all', 'queued', 'in_progress', 'completed', 'failed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded text-[10px] font-medium capitalize transition-all ${filter === f ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(task => (
          <div key={task.id} className="bg-[#0d0d14] border border-white/5 rounded-lg p-3 hover:border-white/10 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                task.status === 'completed' ? 'bg-green-400' :
                task.status === 'in_progress' ? 'bg-blue-400 animate-pulse' :
                task.status === 'queued' ? 'bg-gray-500' :
                task.status === 'review' ? 'bg-amber-400' :
                'bg-red-400'
              }`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium truncate">{task.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded shrink-0 ${
                    task.priority === 'critical' ? 'bg-red-500/10 text-red-400' :
                    task.priority === 'high' ? 'bg-amber-500/10 text-amber-400' :
                    task.priority === 'medium' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>{task.priority}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-500">
                  <span>Team: {task.team}</span>
                  {task.assignedAgent && <span>Agent: {task.assignedAgent}</span>}
                  <span className="capitalize">Status: {task.status.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="text-[10px] text-gray-600 shrink-0">
                <Clock className="w-3 h-3 inline mr-1" />
                {task.status === 'completed' && task.completedAt ? new Date(task.completedAt).toLocaleTimeString() : '—'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MCP CONFIG VIEW
// ============================================================
function MCPConfigView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-violet-400" />
          MCP Server Configuration
        </h2>
        <p className="text-sm text-gray-500 mt-1">Complete MCP server implementation with all tools and handlers</p>
      </div>

      {/* Config Files */}
      <div className="bg-[#0d0d14] border border-white/5 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-mono text-gray-400">mcp-server/src/index.ts</span>
          </div>
          <span className="text-[10px] text-gray-600">TypeScript • 342 lines</span>
        </div>
        <pre className="p-4 text-[11px] text-gray-300 overflow-x-auto font-mono leading-relaxed max-h-[400px] overflow-y-auto">
{`import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { z } from 'zod';
import { AgentPool } from './agents/pool.js';
import { TaskQueue } from './queue/bullmq.js';
import { ProviderGateway } from './gateway/index.js';
import { ResultSynthesizer } from './orchestration/synthesizer.js';
import { HealthMonitor } from './monitoring/health.js';
import { MetricsCollector } from './monitoring/metrics.js';
import pino from 'pino';

const logger = pino({ level: 'info' });

// Initialize core components
const agentPool = new AgentPool({ totalAgents: 60, teams: 6 });
const taskQueue = new TaskQueue({ redis: process.env.REDIS_URL });
const gateway = new ProviderGateway({ providers: 16 });
const synthesizer = new ResultSynthesizer();
const healthMonitor = new HealthMonitor();
const metrics = new MetricsCollector();

// Create MCP Server
const server = new Server(
  { name: 'ai-swarm-command', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {}, prompts: {} } }
);

// Register 6 MCP Tools
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'delegate_task',
      description: 'Delegate task to specific team/agent',
      inputSchema: {
        team: z.enum(['research','code','architect','algorithm','frontend','backend']),
        task: z.string(),
        priority: z.enum(['critical','high','medium','low']).optional(),
        agent_slot: z.number().min(1).max(10).optional(),
      },
    },
    {
      name: 'broadcast_to_team',
      description: 'Send message to all agents in a team',
      inputSchema: { team: z.string(), message: z.string() },
    },
    {
      name: 'get_team_status',
      description: 'Get real-time status of team agents',
      inputSchema: { team: z.string().optional() },
    },
    {
      name: 'synthesize_results',
      description: 'Aggregate results from multiple agents',
      inputSchema: {
        teams: z.array(z.string()),
        type: z.enum(['summary','detailed','code_review']),
      },
    },
    {
      name: 'research_query',
      description: 'Mandatory research dispatch (always verified)',
      inputSchema: {
        query: z.string(),
        depth: z.enum(['shallow','moderate','deep','exhaustive']),
        cross_reference: z.boolean().optional(),
      },
    },
    {
      name: 'reassign_agent',
      description: 'Move agent to different team/task',
      inputSchema: {
        agent_id: z.string(),
        new_team: z.string().optional(),
        new_task: z.string().optional(),
      },
    },
  ],
}));

// Tool execution with full pipeline
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  logger.info({ tool: name, args }, 'Tool invoked');
  
  try {
    switch (name) {
      case 'delegate_task': {
        const agent = agentPool.getAvailableAgent(args.team, args.agent_slot);
        const task = await taskQueue.enqueue({ ...args, agentId: agent.id });
        const result = await agent.execute(task);
        metrics.recordTask(agent.team, result);
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      }
      case 'research_query': {
        // Mandatory: always goes through research team first
        const researchers = agentPool.getTeam('research');
        const results = await Promise.all(
          researchers.slice(0, args.depth === 'exhaustive' ? 10 : 5)
            .map(r => r.execute({ query: args.query }))
        );
        const synthesized = await synthesizer.merge(results);
        return { content: [{ type: 'text', text: synthesized }] };
      }
      // ... other handlers
    }
  } catch (error) {
    logger.error({ error, tool: name }, 'Tool execution failed');
    throw error;
  }
});

// Start transport
const transport = new StdioServerTransport();
await server.connect(transport);
logger.info('MCP Swarm Server started');`}
        </pre>
      </div>

      {/* MCP Tools Summary */}
      <div className="bg-[#0d0d14] border border-white/5 rounded-xl p-5">
        <h3 className="text-sm font-bold mb-4">Registered MCP Tools (6)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'delegate_task', cat: 'delegation', desc: 'Route task to specific team/agent with priority' },
            { name: 'broadcast_to_team', cat: 'delegation', desc: 'Send message to all agents in a team' },
            { name: 'get_team_status', cat: 'monitoring', desc: 'Real-time status of all team agents' },
            { name: 'synthesize_results', cat: 'synthesis', desc: 'Aggregate & merge multi-agent results' },
            { name: 'research_query', cat: 'research', desc: 'Mandatory research with cross-referencing' },
            { name: 'reassign_agent', cat: 'lifecycle', desc: 'Move agent between teams/tasks' },
          ].map(tool => (
            <div key={tool.name} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <code className="text-xs text-cyan-400 font-mono">{tool.name}</code>
                <span className="text-[9px] px-1.5 py-0.5 bg-violet-500/10 text-violet-400 rounded">{tool.cat}</span>
              </div>
              <p className="text-[10px] text-gray-500">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Package.json dependencies */}
      <div className="bg-[#0d0d14] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5">
          <span className="text-xs font-mono text-gray-400">package.json — dependencies</span>
        </div>
        <pre className="p-4 text-[11px] text-gray-300 font-mono leading-relaxed">
{`{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.0",
    "zod": "^3.24.0",
    "bullmq": "^5.30.0",
    "ioredis": "^5.4.0",
    "@hono/node-server": "^1.13.0",
    "ws": "^8.18.0",
    "socket.io": "^4.8.0",
    "openai": "^4.77.0",
    "tiktoken": "^1.0.18",
    "langchain": "^0.3.0",
    "opossum": "^8.4.0",
    "rate-limiter-flexible": "^5.0.0",
    "undici": "^7.2.0",
    "pino": "^9.6.0",
    "@opentelemetry/sdk-node": "^0.57.0",
    "prom-client": "^15.1.0",
    "drizzle-orm": "^0.38.0",
    "xstate": "^5.19.0",
    "workerpool": "^9.2.0",
    "lru-cache": "^11.0.0"
  }
}`}
        </pre>
      </div>
    </div>
  );
}

// ============================================================
// LOGS VIEW
// ============================================================
function LogsView() {
  const { logs } = useAppStore();

  const levelColors: Record<string, string> = {
    debug: 'text-gray-500',
    info: 'text-blue-400',
    warn: 'text-amber-400',
    error: 'text-red-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Terminal className="w-5 h-5 text-green-400" />
          System Logs
        </h2>
        <p className="text-sm text-gray-500 mt-1">Structured logs from pino with OpenTelemetry tracing</p>
      </div>

      <div className="bg-[#0d0d14] border border-white/5 rounded-xl overflow-hidden">
        <div className="divide-y divide-white/[0.03]">
          {logs.map(log => (
            <div key={log.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02]">
              <span className="text-[10px] text-gray-600 font-mono w-16 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`text-[10px] font-mono uppercase w-12 shrink-0 ${levelColors[log.level] || 'text-gray-500'}`}>
                {log.level}
              </span>
              <span className="text-[10px] text-violet-400/70 font-mono w-20 shrink-0">[{log.source}]</span>
              <span className="text-xs text-gray-300 truncate">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
