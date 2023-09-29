'use client';

import { createContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export const WebSocketContext = createContext<WebSocket | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:3001');
    setSocket(ws);

    ws.onmessage = (event) => {
      console.log('Message from server:', event.data);

      const data = JSON.parse(event.data);

      // TODO: make nicer
      if (data.type === 'instance-created') {
        router.push(`/instances/${data.payload.instanceId}`);
      } else if (data.type === 'error') {
        toast({
          title: 'Error',
          description: data.payload.message,
        });
      } else {
        toast({
          title: 'Success',
          description: data.payload.message,
        });
      }
    };

    // Cleanup WebSocket on unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}
