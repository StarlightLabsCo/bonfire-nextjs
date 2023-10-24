'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { JsonObject } from 'next-auth/adapters';
import { WebSocketResponseType } from '@/lib/websocket-schema';

interface WebSocketContextType {
  socket: WebSocket | null;
  socketState: string | null;
  sendJSON: (data: JsonObject) => void;
  instanceId?: string | null;
  setInstanceId?: React.Dispatch<React.SetStateAction<string | null>>;
  adventureSuggestions?: string[] | null;
  setAdventureSuggestions?: React.Dispatch<
    React.SetStateAction<string[] | null>
  >;
}

export const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  socketState: null,
  sendJSON: () => {},
  instanceId: null,
  setInstanceId: () => {},
  adventureSuggestions: null,
  setAdventureSuggestions: () => {},
});

let exponentialBackoff = 1000;

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socketState, setSocketState] = useState<string | null>(null);

  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [adventureSuggestions, setAdventureSuggestions] = useState<
    string[] | null
  >(null);

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

    console.log('data', data);

    if (data.type === WebSocketResponseType['adventure-suggestions']) {
      setAdventureSuggestions(JSON.parse(data.payload.content).payload);
    } else if (data.type === WebSocketResponseType.instance) {
      setAdventureSuggestions(null);
      router.push(`/instances/${data.payload.id}`);
    } else if (data.type === WebSocketResponseType.error) {
      toast({
        title: 'Error',
        description: data.payload.content,
      });
    }
  }

  useEffect(() => {
    console.log('WebSocketProvider mounted.');

    async function connect() {
      console.log('Connecting to WebSocket...');
      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        throw new Error(
          'NEXT_PUBLIC_BACKEND_URL environment variable is not set.',
        );
      }

      // Fetch websocket auth token
      let tokenRequest = await fetch('/api/websocket/', {
        method: 'POST',
      });

      if (tokenRequest.status !== 200) {
        console.error('Unable to fetch websocket token.');
        return;
      }

      let token = await tokenRequest.json();

      // Intialize websocket connection
      let ws = new WebSocket(process.env.NEXT_PUBLIC_BACKEND_URL);

      setSocket(ws);
      setSocketState('connecting');

      ws.addEventListener('message', handleMessage);

      ws.addEventListener('open', () => {
        console.log('WebSocket connection established.');

        setSocketState('open');
        exponentialBackoff = 1000;

        ws.send(
          JSON.stringify({
            type: 'auth',
            payload: token,
          }),
        );
      });

      ws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        ws.close();
      });

      ws.addEventListener('close', () => {
        setSocket(null);
        setSocketState('closed');

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
    <WebSocketContext.Provider
      value={{
        socket,
        socketState,
        sendJSON,
        instanceId,
        setInstanceId,
        adventureSuggestions,
        setAdventureSuggestions,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
