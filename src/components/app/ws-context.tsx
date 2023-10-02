'use client';

import { createContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { JsonObject } from 'next-auth/adapters';

interface WebSocketContextType {
  socket: WebSocket | null;
  sendJSON: (data: JsonObject) => void;
}

export const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  sendJSON: () => {},
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const sendJSON = (data: JsonObject) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not open. Unable to send data.');
    }
  };

  function handleMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);

    if (data.type === 'instance-created') {
      router.push(`/instances/${data.payload.instanceId}`);
    } else if (data.type === 'error') {
      toast({
        title: 'Error',
        description: data.payload.message,
      });
    }
  }

  useEffect(() => {
    let ws = new WebSocket('ws://localhost:3001');
    setSocket(ws);

    ws.addEventListener('message', handleMessage);

    ws.addEventListener('close', () => {
      setSocket(null);
      setTimeout(() => {
        ws = new WebSocket('ws://localhost:3001');
        setSocket(ws);
      }, 1000);
    });

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, sendJSON }}>
      {children}
    </WebSocketContext.Provider>
  );
}
