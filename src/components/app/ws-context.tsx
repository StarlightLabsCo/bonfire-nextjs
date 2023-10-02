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

let exponentialBackoff = 1000;

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
    async function connect() {
      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        throw new Error(
          'NEXT_PUBLIC_BACKEND_URL environment variable is not set.',
        );
      }

      let ws = new WebSocket(`wss://${process.env.NEXT_PUBLIC_BACKEND_URL}`);

      setSocket(ws);

      ws.addEventListener('message', handleMessage);

      ws.addEventListener('open', () => {
        console.log('WebSocket connection established.');
        exponentialBackoff = 1000;

        async function sendAuthToken() {
          let token = await fetch('/api/websocket/', {
            method: 'POST',
          }).then((res) => res.json());

          if (!token) {
            ws.close();
            throw new Error('Unable to fetch WebSocket Auth token.');
          }

          ws.send(
            JSON.stringify({
              type: 'auth',
              payload: token,
            }),
          );
        }

        sendAuthToken();
      });

      ws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
      });

      ws.addEventListener('close', () => {
        setSocket(null);
        setTimeout(() => {
          exponentialBackoff *= 2;
          console.log('WebSocket connection closed. Reconnecting...');
          connect();
        }, exponentialBackoff);
      });

      return () => {
        ws.close();
      };
    }

    connect();
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, sendJSON }}>
      {children}
    </WebSocketContext.Provider>
  );
}
