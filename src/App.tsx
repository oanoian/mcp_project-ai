import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Server, Cpu, Network, Shield, Layers,
  ChevronRight, Zap, Clock, GitBranch, Box, Terminal,
  BarChart3, Settings, Radio, Search, Command, X,
  CheckCircle2, AlertCircle, Info, TrendingUp, Users,
  Database, Wifi, Play, Pause, RefreshCw, Lock, Key,
  Eye, EyeOff, ShieldAlert, ShieldCheck, Fingerprint
} from 'lucide-react';
import { useAppStore } from './core/store';
import { useToastStore } from './components/Toast';
import { initialProviders, generateAgents, generateTasks, teamConfigs } from './core/data';
import { architectureLayers } from './core/schemas';
import { securityLayers, type SecurityLayer } from './core/security-schemas';
import { certificates, securityRules, securityHeaders, generateSecurityEvents, antiFingerprintConfig, securityMetrics } from './core/security-data';
import { sampleMessages, sampleTaskDelegations, sampleCommunicationFlows, sampleDecisions } from './core/communication-data';
import { useRealtimeSimulation } from './hooks/useRealtimeSimulation';
import type { TeamType } from './core/schemas';

export default function App() {
  const {
    activeView, setActiveView, sidebarOpen, toggleSidebar,
    selectedTeam, setSelectedTeam, agents, tasks, providers, logs, metrics
  } = useAppStore();

  const [initialized, setInitialized] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Initialize real-time simulation
  useRealtimeSimulation();

  useEffect(() => {
    if (!initialized) {
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
        // Initialize communication data
        messages: sampleMessages,
        taskDelegations: sampleTaskDelegations,
        communicationFlows: sampleCommunicationFlows,
        decisions: sampleDecisions,
      });

      // Initial logs
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
        }, i * 200);
      });

      setInitialized(true);
    }
  }, [initialized]);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'main-ai-console' as const, icon: Command, label: 'Main AI Console' },
    { id: 'architecture' as const, icon: Layers, label: 'Architecture' },
    { id: 'security' as const, icon: Shield, label: 'Security' },
    { id: 'dashboard' as const, icon: BarChart3, label: 'Dashboard' },
    { id: 'teams' as const, icon: Network, label: 'Agent Teams' },
    { id: 'providers' as const, icon: Server, label: 'API Providers' },
    { id: 'tasks' as const, icon: GitBranch, label: 'Task Queue' },
    { id: 'mcp-config' as const, icon: Settings, label: 'MCP Config' },
    { id: 'logs' as const, icon: Terminal, label: 'System Logs' },
  ];

  const workingAgents = agents.filter(a => a.status === 'working').length;

  return (
    <div className="min-h-screen bg-[#06060a] text-white flex flex-col font-sans noise">
      {/* Top Bar */}
      <header className="glass-strong sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="p-2 hover:bg-white/5 rounded-lg transition-colors lg:hidden">
              <Network className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 flex items-center justify-center glow-violet">
                  <Box className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#06060a] animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-gradient">MCP Swarm Server</h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">60-Agent Orchestration • v1.0.0</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-xs text-gray-400"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Quick actions...</span>
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[10px]">⌘K</kbd>
            </button>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <Radio className="w-3 h-3 text-green-400 animate-pulse" />
              <span className="text-[11px] text-green-400 font-medium">Live</span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                {Math.round(metrics.messagesPerSecond)} msg/s
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {Math.round(metrics.avgLatency)}ms
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {workingAgents}/60
              </span>
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
              className="w-56 glass border-r border-white/5 flex flex-col shrink-0 fixed lg:static inset-y-0 left-0 z-40 pt-14 lg:pt-0"
            >
              <nav className="p-2 space-y-0.5 flex-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveView(item.id); if (window.innerWidth < 1024) toggleSidebar(); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-all ${
                      activeView === item.id
                        ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/10 text-white border border-violet-500/30 glow-violet'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {activeView === item.id && <ChevronRight className="w-3 h-3 ml-auto" />}
                  </button>
                ))}
              </nav>

              <div className="p-3 border-t border-white/5 space-y-2">
                <div className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">System</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-500">Agents</span>
                    <span className="text-green-400">{workingAgents}/60</span>
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
              {activeView === 'main-ai-console' && <MainAIConsoleView />}
              {activeView === 'architecture' && <ArchitectureView />}
              {activeView === 'security' && <SecurityView />}
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

      {/* Command Palette */}
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

// Command Palette Component
function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const { setActiveView } = useAppStore();
  const { addToast } = useToastStore();

  const commands = useMemo(() => [
    { id: 'view-architecture', label: 'View Architecture', icon: Layers, action: () => setActiveView('architecture') },
    { id: 'view-dashboard', label: 'View Dashboard', icon: BarChart3, action: () => setActiveView('dashboard') },
    { id: 'view-teams', label: 'View Agent Teams', icon: Network, action: () => setActiveView('teams') },
    { id: 'view-providers', label: 'View API Providers', icon: Server, action: () => setActiveView('providers') },
    { id: 'view-tasks', label: 'View Task Queue', icon: GitBranch, action: () => setActiveView('tasks') },
    { id: 'view-config', label: 'View MCP Config', icon: Settings, action: () => setActiveView('mcp-config') },
    { id: 'view-logs', label: 'View System Logs', icon: Terminal, action: () => setActiveView('logs') },
    { id: 'action-refresh', label: 'Refresh All Data', icon: RefreshCw, action: () => addToast({ type: 'info', title: 'Refreshing data...' }) },
    { id: 'action-pause', label: 'Pause Simulation', icon: Pause, action: () => addToast({ type: 'warning', title: 'Simulation paused' }) },
    { id: 'action-resume', label: 'Resume Simulation', icon: Play, action: () => addToast({ type: 'success', title: 'Simulation resumed' }) },
  ], [setActiveView, addToast]);

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg glass-strong rounded-xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-600"
              autoFocus
            />
            <kbd className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-500">ESC</kbd>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.map(cmd => (
              <button
                key={cmd.id}
                onClick={() => { cmd.action(); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                <cmd.icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-300">{cmd.label}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-sm text-gray-600">No commands found</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Toast Container
function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[90] space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`glass-strong rounded-lg p-3 shadow-xl border-l-4 ${
              toast.type === 'success' ? 'border-l-green-500' :
              toast.type === 'error' ? 'border-l-red-500' :
              toast.type === 'warning' ? 'border-l-amber-500' :
              'border-l-blue-500'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{toast.title}</div>
                {toast.message && <div className="text-xs text-gray-400 mt-0.5">{toast.message}</div>}
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-gray-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Architecture View
function ArchitectureView() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Layers className="w-6 h-6 text-violet-400" />
            <span className="text-gradient">System Architecture</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">8-layer enterprise architecture with 28 core components</p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
            All Active
          </span>
        </div>
      </div>

      {/* Animated Architecture Flow */}
      <div className="glass rounded-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 animate-grid" style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <h3 className="text-sm font-medium text-gray-400 mb-6 relative">Data Flow: Lead AI → Teams → Agents → Providers</h3>
        
        <div className="flex flex-col items-center gap-3 relative">
          {/* Lead AI */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-6 py-4 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/30 rounded-xl glow-violet"
          >
            <div className="text-center">
              <div className="text-base font-bold text-violet-300">🧠 Main Lead AI (MCP Client)</div>
              <div className="text-[11px] text-gray-500">Orchestrates all operations via JSON-RPC 2.0</div>
            </div>
          </motion.div>

          <div className="w-px h-8 bg-gradient-to-b from-violet-500/50 to-transparent"></div>

          {/* Transport */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs text-cyan-400"
          >
            Transport Layer: stdio | SSE | WebSocket
          </motion.div>

          <div className="w-px h-6 bg-cyan-500/30"></div>

          {/* Protocol */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg text-xs text-violet-400"
          >
            Protocol Layer: JSON-RPC 2.0 + Zod Validation
          </motion.div>

          <div className="w-px h-6 bg-violet-500/30"></div>

          {/* Orchestration */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400"
          >
            Orchestration: Task Router + Scheduler + Synthesizer
          </motion.div>

          <div className="w-px h-6 bg-amber-500/30"></div>

          {/* Teams Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
            {teamConfigs.map((tc, idx) => (
              <motion.div
                key={tc.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className="px-3 py-3 rounded-lg hover:scale-105 transition-transform cursor-pointer"
                style={{ 
                  background: `linear-gradient(135deg, ${tc.color}15, ${tc.color}05)`,
                  border: `1px solid ${tc.color}30`
                }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{tc.icon}</div>
                  <div className="text-[11px] font-medium" style={{ color: tc.color }}>{tc.name.split(' ')[0]}</div>
                  <div className="text-[9px] text-gray-500">10 agents</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="w-px h-6 bg-green-500/30"></div>

          {/* Provider Gateway */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400"
          >
            Provider Gateway: Connection Pool + Rate Limiter + Circuit Breaker
          </motion.div>

          <div className="w-px h-6 bg-blue-500/30"></div>

          {/* Providers */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-1.5"
          >
            {initialProviders.slice(0, 8).map(p => (
              <span key={p.id} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400 hover:bg-white/10 transition-colors">
                {p.name}
              </span>
            ))}
            <span className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-gray-500">
              +8 more
            </span>
          </motion.div>
        </div>
      </div>

      {/* Security Layers */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-400" />
          8-Layer Security Architecture (Zero-Trust)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {securityLayers.map((layer, idx) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 rounded-lg border hover:scale-[1.02] transition-all cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${layer.color}10, ${layer.color}05)`,
                borderColor: `${layer.color}30`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                  style={{ backgroundColor: `${layer.color}20`, color: layer.color }}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold" style={{ color: layer.color }}>{layer.name}</div>
                  <div className="text-[9px] text-gray-500">{layer.description}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <div className="flex flex-wrap gap-1">
                {layer.components.map(comp => (
                  <span key={comp.id} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                    {comp.name.split(' ')[0]}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
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
            className="glass rounded-xl overflow-hidden hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
              style={{ borderLeftColor: layer.color, borderLeftWidth: '3px' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
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
                <div key={comp.id} className="bg-[#06060a] p-3 hover:bg-white/[0.02] transition-colors">
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
    </div>
  );
}

// Main AI Console View
function MainAIConsoleView() {
  const { messages, taskDelegations, communicationFlows, decisions, agents, teams } = useAppStore();
  const [activeTab, setActiveTab] = useState<'communication' | 'delegations' | 'flows' | 'decisions'>('communication');
  const [newMessage, setNewMessage] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamType>('research');
  const { addToast } = useToastStore();

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    useAppStore.getState().addMessage({
      from: 'main-ai',
      to: `${selectedTeam}-team`,
      role: 'main_ai',
      type: 'task_delegation',
      channel: 'main_to_team',
      content: newMessage,
      priority: 'high',
      status: 'sent',
      teamId: selectedTeam,
    });

    addToast({
      type: 'success',
      title: 'Task Delegated',
      message: `Task sent to ${selectedTeam} team`,
    });

    setNewMessage('');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Command className="w-6 h-6 text-violet-400" />
          <span className="text-gradient">Main AI Console</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">Real-time orchestration and communication with the 60-agent swarm</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard icon={<Command className="w-4 h-4" />} label="Active Delegations" value={taskDelegations.filter(td => td.status === 'in_progress').length.toString()} change="Tasks in progress" color="violet" />
        <MetricCard icon={<CheckCircle2 className="w-4 h-4" />} label="Completed" value={taskDelegations.filter(td => td.status === 'completed').length.toString()} change="Successfully synthesized" color="green" />
        <MetricCard icon={<Activity className="w-4 h-4" />} label="Messages" value={messages.length.toString()} change="Last 24h" color="cyan" />
        <MetricCard icon={<TrendingUp className="w-4 h-4" />} label="Decisions" value={decisions.length.toString()} change="Based on synthesis" color="amber" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2">
        {[
          { id: 'communication', label: 'Communication', icon: Command },
          { id: 'delegations', label: 'Task Delegations', icon: GitBranch },
          { id: 'flows', label: 'Communication Flows', icon: Activity },
          { id: 'decisions', label: 'Decisions', icon: CheckCircle2 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'communication' && (
            <div className="space-y-4">
              {/* Message Input */}
              <div className="glass rounded-xl p-4">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Command className="w-4 h-4 text-violet-400" />
                  Delegate Task to Team
                </h3>
                <div className="flex gap-2 mb-3">
                  <select
                    value={selectedTeam}
                    onChange={e => setSelectedTeam(e.target.value as TeamType)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white outline-none focus:border-violet-500"
                  >
                    {teams.map(team => (
                      <option key={team.id} value={team.id} className="bg-gray-900">
                        {team.icon} {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Describe the task or query..."
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 outline-none focus:border-violet-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 rounded-lg text-sm text-violet-300 transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>

              {/* Message Stream */}
              <div className="glass rounded-xl p-4">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Real-Time Communication Stream
                </h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.role === 'main_ai' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'main_ai' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-lg p-3 ${
                        msg.role === 'main_ai'
                          ? 'bg-violet-500/20 border border-violet-500/30'
                          : msg.role === 'team_lead'
                          ? 'bg-cyan-500/20 border border-cyan-500/30'
                          : msg.role === 'agent'
                          ? 'bg-green-500/20 border border-green-500/30'
                          : 'bg-gray-500/20 border border-gray-500/30'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-gray-400">{msg.from}</span>
                          <span className="text-[9px] text-gray-600">→</span>
                          <span className="text-[10px] font-bold text-gray-400">{msg.to}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                            msg.type === 'task_delegation' ? 'bg-violet-500/20 text-violet-400' :
                            msg.type === 'task_result' ? 'bg-green-500/20 text-green-400' :
                            msg.type === 'synthesis_result' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {msg.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300 whitespace-pre-wrap">{msg.content}</div>
                        <div className="text-[9px] text-gray-600 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'delegations' && (
            <div className="space-y-3">
              {taskDelegations.map(delegation => (
                <motion.div
                  key={delegation.id}
                  whileHover={{ scale: 1.01 }}
                  className="glass rounded-lg p-4 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold">{delegation.title}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                          delegation.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                          delegation.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                          delegation.status === 'pending' ? 'bg-gray-500/10 text-gray-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {delegation.status.replace('_', ' ')}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                          delegation.priority === 'critical' ? 'bg-red-500/10 text-red-400' :
                          delegation.priority === 'high' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {delegation.priority}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500">{delegation.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10px] mb-3">
                    <div>
                      <span className="text-gray-500">Team:</span>
                      <span className="text-gray-300 ml-2 capitalize">{delegation.team}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Agents:</span>
                      <span className="text-gray-300 ml-2">{delegation.assignedAgents.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Delegated:</span>
                      <span className="text-gray-300 ml-2">{new Date(delegation.delegatedAt).toLocaleTimeString()}</span>
                    </div>
                    {delegation.synthesizedAt && (
                      <div>
                        <span className="text-gray-500">Synthesized:</span>
                        <span className="text-gray-300 ml-2">{new Date(delegation.synthesizedAt).toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>

                  {delegation.results && delegation.results.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <div className="text-[10px] text-gray-500 mb-2">Agent Results ({delegation.results.length}):</div>
                      <div className="space-y-2">
                        {delegation.results.map((result, idx) => (
                          <div key={idx} className="bg-white/[0.02] rounded p-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-mono text-violet-400">{result.agentId}</span>
                              <span className="text-[9px] text-gray-600">Confidence: {Math.round(result.confidence * 100)}%</span>
                            </div>
                            <div className="text-[10px] text-gray-400">{result.result}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {delegation.synthesizedResult && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <div className="text-[10px] text-amber-400 mb-1 font-bold">Synthesized Result:</div>
                      <div className="text-xs text-gray-300 bg-amber-500/5 border border-amber-500/20 rounded p-3">
                        {delegation.synthesizedResult}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'flows' && (
            <div className="space-y-3">
              {communicationFlows.map(flow => (
                <motion.div
                  key={flow.id}
                  whileHover={{ scale: 1.01 }}
                  className="glass rounded-lg p-4 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">Communication Flow</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                        flow.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                        flow.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {flow.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500">
                      Duration: {flow.totalDuration > 0 ? `${(flow.totalDuration / 1000).toFixed(1)}s` : 'In progress'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {flow.flow.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-400">
                          {step.step}
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-[10px] text-violet-400 font-mono">{step.from}</span>
                          <span className="text-[10px] text-gray-600">→</span>
                          <span className="text-[10px] text-cyan-400 font-mono">{step.to}</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] text-gray-300">{step.action}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-600">{step.duration > 0 ? `${(step.duration / 1000).toFixed(1)}s` : '—'}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            step.status === 'completed' ? 'bg-green-400' :
                            step.status === 'pending' ? 'bg-gray-500' :
                            'bg-red-400'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'decisions' && (
            <div className="space-y-3">
              {decisions.map(decision => (
                <motion.div
                  key={decision.id}
                  whileHover={{ scale: 1.01 }}
                  className="glass rounded-lg p-4 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-bold mb-1">{decision.decision}</div>
                      <div className="text-[10px] text-gray-500">{decision.rationale}</div>
                    </div>
                    <div className="text-[10px] text-amber-400 font-mono">
                      {Math.round(decision.confidence * 100)}% confidence
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10px] mb-3">
                    <div>
                      <span className="text-gray-500">Based on:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {decision.basedOn.map((id, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-violet-500/10 text-violet-400 rounded text-[9px]">
                            {id}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Impact:</span>
                      <div className="text-gray-300 mt-1">{decision.impact}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5">
                    <div className="text-[10px] text-gray-500 mb-2">Next Steps:</div>
                    <div className="space-y-1">
                      {decision.nextSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px] text-gray-400">
                          <div className="w-1 h-1 rounded-full bg-violet-400"></div>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[9px] text-gray-600 mt-3">
                    Made at: {new Date(decision.timestamp).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Dashboard View
function DashboardView() {
  const { agents, tasks, providers, metrics, teams } = useAppStore();

  const workingAgents = agents.filter(a => a.status === 'working').length;
  const idleAgents = agents.filter(a => a.status === 'idle').length;
  const errorAgents = agents.filter(a => a.status === 'error').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <span className="text-gradient">System Dashboard</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">Real-time metrics across all 60 agents and 16 providers</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard icon={<Cpu className="w-4 h-4" />} label="Working Agents" value={`${workingAgents}/60`} change="+3 this hour" color="green" />
        <MetricCard icon={<GitBranch className="w-4 h-4" />} label="Tasks In Progress" value={`${inProgressTasks}`} change={`${completedTasks} completed`} color="violet" />
        <MetricCard icon={<Server className="w-4 h-4" />} label="Active Providers" value={`${providers.filter(p => p.status === 'connected').length}/16`} change="99.7% uptime" color="cyan" />
        <MetricCard icon={<Zap className="w-4 h-4" />} label="Throughput" value={`${Math.round(metrics.messagesPerSecond)}/s`} change={`${Math.round(metrics.avgLatency)}ms avg`} color="amber" />
      </div>

      {/* Agent Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" />
            Agent Status Distribution
          </h3>
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

        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            Team Performance
          </h3>
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
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Wifi className="w-4 h-4 text-blue-400" />
          Provider Latency (ms)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {providers.sort((a, b) => a.latency - b.latency).map(p => (
            <div key={p.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-3 hover:border-white/10 transition-all">
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
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-4 cursor-pointer`}
    >
      <div className="flex items-center gap-2 mb-2 text-gray-400">{icon}<span className="text-[11px]">{label}</span></div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-[10px] text-gray-500 mt-1">{change}</div>
    </motion.div>
  );
}

// Teams View
function TeamsView({ selectedTeam, setSelectedTeam }: { selectedTeam: TeamType | 'all'; setSelectedTeam: (t: TeamType | 'all') => void }) {
  const { teams } = useAppStore();
  const filtered = selectedTeam === 'all' ? teams : teams.filter(t => t.id === selectedTeam);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Network className="w-6 h-6 text-green-400" />
          <span className="text-gradient">Agent Teams</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">6 specialized teams × 10 agents each = 60 total agents</p>
      </div>

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

      {filtered.map(team => (
        <motion.div
          key={team.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between"
            style={{ borderLeftColor: team.color, borderLeftWidth: '3px' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{team.icon}</span>
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
              <motion.div
                key={agent.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 hover:border-white/10 transition-all cursor-pointer"
              >
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
                  <span>⚡ {Math.round(agent.avgResponseTime)}ms</span>
                  <span>✅ {agent.tasksCompleted}</span>
                </div>
                <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${agent.health.score}%`,
                    backgroundColor: agent.health.score > 80 ? '#10b981' : agent.health.score > 60 ? '#f59e0b' : '#ef4444'
                  }}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Providers View
function ProvidersView() {
  const { providers } = useAppStore();

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Server className="w-6 h-6 text-blue-400" />
          <span className="text-gradient">API Provider Gateway</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">16 free LLM API providers with connection pooling & circuit breakers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {providers.map(p => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-xl p-4 hover:border-white/10 transition-all cursor-pointer"
          >
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
              <span>📊 {p.totalRequests.toLocaleString()} reqs</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Tasks View
function TasksView() {
  const { tasks } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'queued' | 'in_progress' | 'completed' | 'failed'>('all');

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-amber-400" />
            <span className="text-gradient">Task Queue</span>
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
          <motion.div
            key={task.id}
            whileHover={{ scale: 1.01 }}
            className="glass rounded-lg p-3 hover:border-white/10 transition-all cursor-pointer"
          >
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// MCP Config View
function MCPConfigView() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-violet-400" />
          <span className="text-gradient">MCP Server Configuration</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">Complete MCP server implementation with all tools and handlers</p>
      </div>

      <div className="glass rounded-xl overflow-hidden">
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
import { z } from 'zod';
import { AgentPool } from './agents/pool.js';
import { TaskQueue } from './queue/bullmq.js';
import { ProviderGateway } from './gateway/index.js';

const agentPool = new AgentPool({ totalAgents: 60, teams: 6 });
const taskQueue = new TaskQueue({ redis: process.env.REDIS_URL });
const gateway = new ProviderGateway({ providers: 16 });

const server = new Server(
  { name: 'ai-swarm-command', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {}, prompts: {} } }
);

server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'delegate_task',
      description: 'Delegate task to specific team/agent',
      inputSchema: {
        team: z.enum(['research','code','architect','algorithm','frontend','backend']),
        task: z.string(),
        priority: z.enum(['critical','high','medium','low']).optional(),
      },
    },
    // ... 5 more tools
  ],
}));

const transport = new StdioServerTransport();
await server.connect(transport);`}
        </pre>
      </div>

      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-bold mb-4">Registered MCP Tools (10)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'delegate_task', cat: 'delegation', desc: 'Route task to specific team/agent with priority' },
            { name: 'broadcast_to_team', cat: 'delegation', desc: 'Send message to all agents in a team' },
            { name: 'get_team_status', cat: 'monitoring', desc: 'Real-time status of all team agents' },
            { name: 'synthesize_results', cat: 'synthesis', desc: 'Aggregate & merge multi-agent results' },
            { name: 'research_query', cat: 'research', desc: 'Mandatory research with cross-referencing' },
            { name: 'reassign_agent', cat: 'lifecycle', desc: 'Move agent between teams/tasks' },
            { name: 'verify_certificate', cat: 'security', desc: 'Validate team TLS certificate fingerprint' },
            { name: 'check_security_rules', cat: 'security', desc: 'Check if request violates security rules' },
            { name: 'get_security_events', cat: 'security', desc: 'Retrieve recent security events and alerts' },
            { name: 'rotate_api_key', cat: 'security', desc: 'Rotate API keys for a specific team' },
          ].map(tool => (
            <div key={tool.name} className="bg-white/[0.02] border border-white/5 rounded-lg p-3 hover:border-white/10 transition-all">
              <div className="flex items-center gap-2 mb-1">
                <code className="text-xs text-cyan-400 font-mono">{tool.name}</code>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                  tool.cat === 'security' ? 'bg-red-500/10 text-red-400' : 'bg-violet-500/10 text-violet-400'
                }`}>{tool.cat}</span>
              </div>
              <p className="text-[10px] text-gray-500">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Logs View
function LogsView() {
  const { logs } = useAppStore();

  const levelColors: Record<string, string> = {
    debug: 'text-gray-500',
    info: 'text-blue-400',
    warn: 'text-amber-400',
    error: 'text-red-400',
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Terminal className="w-6 h-6 text-green-400" />
          <span className="text-gradient">System Logs</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">Structured logs from pino with OpenTelemetry tracing</p>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="divide-y divide-white/[0.03]">
          {logs.map(log => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02]"
            >
              <span className="text-[10px] text-gray-600 font-mono w-16 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`text-[10px] font-mono uppercase w-12 shrink-0 ${levelColors[log.level] || 'text-gray-500'}`}>
                {log.level}
              </span>
              <span className="text-[10px] text-violet-400/70 font-mono w-20 shrink-0">[{log.source}]</span>
              <span className="text-xs text-gray-300 truncate">{log.message}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Security View
function SecurityView() {
  const [securityEvents] = useState(generateSecurityEvents());
  const [activeTab, setActiveTab] = useState<'overview' | 'certificates' | 'rules' | 'headers' | 'fingerprint' | 'events'>('overview');

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-400" />
          <span className="text-gradient">Security Command Center</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">Advanced protection with TLS/SSL, anti-fingerprinting, and zero-trust architecture</p>
      </div>

      {/* Security Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="lg:col-span-1 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <span className="text-xs text-gray-400">Security Score</span>
          </div>
          <div className="text-4xl font-bold text-green-400 mb-2">{securityMetrics.securityScore}%</div>
          <div className="text-[10px] text-gray-500">Excellent protection level</div>
          <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${securityMetrics.securityScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
            />
          </div>
        </motion.div>

        <MetricCard icon={<ShieldAlert className="w-4 h-4" />} label="Threats Blocked" value={securityMetrics.totalBlocked.toLocaleString()} change="Last 24h" color="red" />
        <MetricCard icon={<Lock className="w-4 h-4" />} label="Encryption" value={securityMetrics.encryptionStrength.split(' + ')[0]} change={securityMetrics.tlsVersion} color="violet" />
        <MetricCard icon={<Key className="w-4 h-4" />} label="Certificates" value={`${securityMetrics.certificatesValid}/${certificates.length}`} change="All valid" color="cyan" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: Shield },
          { id: 'certificates', label: 'Certificates', icon: Key },
          { id: 'rules', label: 'Security Rules', icon: ShieldAlert },
          { id: 'headers', label: 'Security Headers', icon: Lock },
          { id: 'fingerprint', label: 'Anti-Fingerprint', icon: Fingerprint },
          { id: 'events', label: 'Security Events', icon: AlertCircle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && <SecurityOverview />}
          {activeTab === 'certificates' && <CertificatesView />}
          {activeTab === 'rules' && <SecurityRulesView />}
          {activeTab === 'headers' && <SecurityHeadersView />}
          {activeTab === 'fingerprint' && <AntiFingerprintView />}
          {activeTab === 'events' && <SecurityEventsView events={securityEvents} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SecurityOverview() {
  return (
    <div className="space-y-6">
      {/* Security Architecture Layers */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-400" />
          8-Layer Security Architecture
        </h3>
        <div className="space-y-3">
          {securityLayers.map((layer, idx) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:border-white/10 transition-all"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                style={{ backgroundColor: `${layer.color}20`, color: layer.color }}
              >
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{layer.name}</div>
                <div className="text-[10px] text-gray-500 truncate">{layer.description}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${layer.color}15`, color: layer.color }}>
                  {layer.components.length} components
                </span>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass rounded-xl p-4">
          <div className="text-[10px] text-gray-500 mb-1">Total Blocked</div>
          <div className="text-xl font-bold text-red-400">{securityMetrics.totalBlocked.toLocaleString()}</div>
          <div className="text-[9px] text-gray-600 mt-1">Malicious requests</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="text-[10px] text-gray-500 mb-1">Active Alerts</div>
          <div className="text-xl font-bold text-amber-400">{securityMetrics.totalAlerts}</div>
          <div className="text-[9px] text-gray-600 mt-1">Under monitoring</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="text-[10px] text-gray-500 mb-1">Active Threats</div>
          <div className="text-xl font-bold text-orange-400">{securityMetrics.activeThreats}</div>
          <div className="text-[9px] text-gray-600 mt-1">Being mitigated</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="text-[10px] text-gray-500 mb-1">Rules Enabled</div>
          <div className="text-xl font-bold text-violet-400">{securityMetrics.rulesEnabled}</div>
          <div className="text-[9px] text-gray-600 mt-1">Security policies</div>
        </div>
      </div>
    </div>
  );
}

function CertificatesView() {
  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" />
          TLS/SSL Certificates (6 Teams + Root CA)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {certificates.map(cert => (
            <motion.div
              key={cert.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/[0.02] border border-white/5 rounded-lg p-4 hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-bold">{cert.commonName}</div>
                  <div className="text-[10px] text-gray-500 font-mono">{cert.type.toUpperCase()}</div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                  cert.status === 'valid' ? 'bg-green-500/10 text-green-400' :
                  cert.status === 'expiring' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    cert.status === 'valid' ? 'bg-green-400' :
                    cert.status === 'expiring' ? 'bg-amber-400' : 'bg-red-400'
                  }`}></div>
                  {cert.status}
                </div>
              </div>

              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Team:</span>
                  <span className="text-gray-300 capitalize">{cert.team}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Issuer:</span>
                  <span className="text-gray-300 truncate ml-2">{cert.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Key Size:</span>
                  <span className="text-violet-400">{cert.keySize}-bit RSA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Algorithm:</span>
                  <span className="text-cyan-400">{cert.signatureAlgorithm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Valid Until:</span>
                  <span className="text-gray-300">{new Date(cert.validTo).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Days Left:</span>
                  <span className={cert.daysUntilExpiry > 30 ? 'text-green-400' : 'text-amber-400'}>
                    {cert.daysUntilExpiry} days
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="text-[9px] text-gray-600 mb-1">Fingerprint:</div>
                <div className="text-[9px] font-mono text-gray-400 break-all">{cert.fingerprint}</div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                {cert.autoRenew && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded">Auto-Renew</span>
                )}
                {cert.pinned && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-violet-500/10 text-violet-400 rounded">Pinned</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecurityRulesView() {
  return (
    <div className="space-y-3">
      {securityRules.map(rule => (
        <motion.div
          key={rule.id}
          whileHover={{ scale: 1.01 }}
          className="glass rounded-lg p-4 hover:border-white/10 transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold">{rule.name}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                  rule.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                  rule.severity === 'high' ? 'bg-orange-500/10 text-orange-400' :
                  rule.severity === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {rule.severity}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 bg-white/5 text-gray-400 rounded capitalize">
                  {rule.category}
                </span>
              </div>
              <p className="text-[10px] text-gray-500">{rule.description}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-green-400' : 'bg-gray-500'}`}></div>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-gray-500 mt-2">
            <span>Action: <span className="text-cyan-400">{rule.action.replace('_', ' ')}</span></span>
            <span>Triggered: <span className="text-amber-400">{rule.triggerCount}x</span></span>
            {rule.lastTriggered && (
              <span>Last: <span className="text-gray-400">{new Date(rule.lastTriggered).toLocaleDateString()}</span></span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {rule.conditions.slice(0, 4).map((cond, i) => (
              <span key={i} className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-gray-500">
                {cond}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SecurityHeadersView() {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
        <Lock className="w-4 h-4 text-violet-400" />
        Advanced Security Headers ({securityHeaders.length} headers enforced)
      </h3>
      <div className="space-y-2">
        {securityHeaders.map((header, idx) => (
          <motion.div
            key={header.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.02 }}
            className="bg-white/[0.02] border border-white/5 rounded-lg p-3 hover:border-white/10 transition-all"
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <code className="text-xs text-cyan-400 font-mono">{header.name}</code>
                {header.critical && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded">Critical</span>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full ${header.enforced ? 'bg-green-400' : 'bg-gray-500'}`}></div>
            </div>
            <div className="text-[10px] text-gray-400 font-mono break-all mb-1">{header.value || '(removed)'}</div>
            <div className="text-[9px] text-gray-600">{header.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AntiFingerprintView() {
  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-pink-400" />
          Anti-Fingerprinting Protection
        </h3>
        <p className="text-[11px] text-gray-500 mb-4">
          Advanced browser fingerprinting prevention using noise injection, parameter randomization, and API obfuscation.
          All protections are active and non-3rd party (custom implementation).
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(antiFingerprintConfig).map(([key, enabled]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded-lg border transition-all ${
                enabled
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-white/[0.02] border-white/5'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                <span className="text-xs font-medium capitalize">{key}</span>
              </div>
              <div className="text-[9px] text-gray-500">
                {enabled ? 'Protected' : 'Disabled'}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 rounded-lg">
          <div className="text-xs font-bold text-pink-300 mb-2">🛡️ Protection Methods</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-gray-400">
            <div>• Canvas noise injection (random pixel manipulation)</div>
            <div>• WebGL parameter randomization</div>
            <div>• Audio context fingerprint obfuscation</div>
            <div>• Font enumeration prevention</div>
            <div>• Screen resolution spoofing</div>
            <div>• Timezone randomization</div>
            <div>• Language header rotation</div>
            <div>• Plugin list obfuscation</div>
            <div>• WebRTC IP leak prevention</div>
            <div>• Hardware concurrency masking</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityEventsView({ events }: { events: any[] }) {
  const typeColors: Record<string, string> = {
    blocked: 'text-red-400 bg-red-500/10',
    alert: 'text-amber-400 bg-amber-500/10',
    warning: 'text-orange-400 bg-orange-500/10',
    info: 'text-blue-400 bg-blue-500/10',
    success: 'text-green-400 bg-green-500/10',
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-bold">Security Events (Last 24h)</h3>
        <span className="text-[10px] text-gray-500">{events.length} events</span>
      </div>
      <div className="divide-y divide-white/[0.03] max-h-[500px] overflow-y-auto">
        {events.map(event => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02]"
          >
            <span className="text-[10px] text-gray-600 font-mono w-16 shrink-0">
              {new Date(event.timestamp).toLocaleTimeString()}
            </span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full ${typeColors[event.type]}`}>
              {event.type}
            </span>
            <span className="text-[10px] text-violet-400/70 font-mono w-24 shrink-0">[{event.source}]</span>
            <span className="text-xs text-gray-300 truncate flex-1">{event.details}</span>
            <span className="text-[9px] text-gray-600 font-mono shrink-0">{event.ip}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
