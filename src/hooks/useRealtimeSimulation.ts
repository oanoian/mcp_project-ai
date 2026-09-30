import { useEffect, useRef } from 'react';
import { useAppStore } from '../core/store';

// Real-time simulation hook - DISABLED (no automatic data generation)
export function useRealtimeSimulation() {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Simulation disabled - no automatic data generation
    // All data must be manually added through the UI
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
}
