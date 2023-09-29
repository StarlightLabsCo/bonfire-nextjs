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
    if (socket !== null) {
      return;
    }

    let ws = new WebSocket('ws://localhost:3001');
    setSocket(ws);

    const handleMessage = (event: MessageEvent) => {
      console.log('Message from server:', event.data);

      const data = JSON.parse(event.data);

      if (data.type === 'instance-created') {
        router.push(`/instances/${data.payload.instanceId}`);
      } else if (data.type === 'audio') {
        const audioBase64 = data.payload.audio;
        const audioSrc = `data:audio/wav;base64,${audioBase64}`;
        const audio = new Audio(audioSrc);
        audio.play();
      } else if (data.type === 'error') {
        toast({
          title: 'Error',
          description: data.payload.message,
        });
      }
    };

    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => {
      // TODO: handle this with exponential backoff and also show a toast
      setSocket(null);
      setTimeout(() => {
        ws = new WebSocket('ws://localhost:3001');
        setSocket(ws);
      }, 1000);
    });

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
