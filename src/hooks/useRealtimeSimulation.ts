import { useEffect, useRef } from 'react';
import { useAppStore } from '../core/store';

// Real-time simulation hook that updates agent statuses and metrics
export function useRealtimeSimulation() {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const simulate = () => {
      const state = useAppStore.getState();
      
      // Randomly update agent statuses
      const agents = [...state.agents];
      const randomIdx = Math.floor(Math.random() * agents.length);
      const agent = agents[randomIdx];
      
      if (agent) {
        const statuses: Array<'working' | 'idle' | 'awaiting_review' | 'error'> = ['working', 'working', 'working', 'idle', 'awaiting_review', 'error'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        agents[randomIdx] = {
          ...agent,
          status: newStatus,
          lastHeartbeat: new Date().toISOString(),
          health: {
            ...agent.health,
            cpu: Math.max(5, Math.min(95, agent.health.cpu + (Math.random() - 0.5) * 10)),
            memory: Math.max(10, Math.min(90, agent.health.memory + (Math.random() - 0.5) * 5)),
            score: Math.max(60, Math.min(100, agent.health.score + (Math.random() - 0.5) * 3)),
          },
          contextWindow: {
            ...agent.contextWindow,
            used: Math.max(0, Math.min(agent.contextWindow.max, agent.contextWindow.used + (Math.random() - 0.3) * 5000)),
          },
        };
        
        useAppStore.setState({ agents });
      }

      // Update metrics
      const metrics = { ...state.metrics };
      metrics.messagesPerSecond = Math.max(10, Math.min(100, metrics.messagesPerSecond + (Math.random() - 0.5) * 5));
      metrics.avgLatency = Math.max(50, Math.min(500, metrics.avgLatency + (Math.random() - 0.5) * 20));
      metrics.totalTokensProcessed += Math.floor(Math.random() * 1000);
      
      useAppStore.setState({ metrics });

      // Add log entry occasionally
      if (Math.random() > 0.7) {
        const logSources = ['orchestrator', 'gateway', 'queue', 'health', 'protocol', 'scheduler', 'synthesizer', 'cache'];
        const logMessages = [
          'Task delegated to research team',
          'Agent health check completed',
          'Response cached for repeated query',
          'Rate limit threshold approaching',
          'Task completed successfully',
          'Provider failover triggered',
          'Context window optimized',
          'Result synthesis in progress',
          'Agent pool rebalanced',
          'Circuit breaker reset',
        ];
        const levels: Array<'info' | 'warn' | 'error' | 'debug'> = ['info', 'info', 'info', 'info', 'warn', 'debug'];
        
        state.addLog({
          level: levels[Math.floor(Math.random() * levels.length)],
          source: logSources[Math.floor(Math.random() * logSources.length)],
          team: 'system',
          message: logMessages[Math.floor(Math.random() * logMessages.length)],
        });
      }
    };

    intervalRef.current = setInterval(simulate, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
}
