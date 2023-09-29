'use client';

import { createContext, useEffect, useRef, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export const WebSocketContext = createContext<WebSocket | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const audioContext = useRef<AudioContext | null>(null);
  const audioBufferQueue = useRef<AudioBuffer[]>([]);
  const nextStartTimeRef = useRef<number>(0);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContext.current = new AudioContext();
      nextStartTimeRef.current = audioContext.current.currentTime;
    }

    const scheduleBuffers = () => {
      while (audioBufferQueue.current.length > 0) {
        const audioBuffer = audioBufferQueue.current.shift();
        if (audioBuffer && audioContext.current) {
          if (nextStartTimeRef.current < audioContext.current.currentTime) {
            nextStartTimeRef.current = audioContext.current.currentTime;
          }

          const source = audioContext.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.current.destination);
          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += audioBuffer.duration;
        }
      }
    };

    if (socket !== null) return;

    let ws = new WebSocket('ws://localhost:3001');
    setSocket(ws);

    const handleMessage = async (event: MessageEvent) => {
      console.log('Message from server:', event.data);
      const data = JSON.parse(event.data);

      if (data.type === 'instance-created') {
        router.push(`/instances/${data.payload.instanceId}`);
      } else if (data.type === 'error') {
        toast({
          title: 'Error',
          description: data.payload.message,
        });
      } else if (data.audio) {
        const binaryData = atob(data.audio);
        const len = binaryData.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);

        for (let i = 0; i < len; i++) {
          view[i] = binaryData.charCodeAt(i);
        }

        if (!audioContext.current) return;
        const audioBuffer = await audioContext.current.decodeAudioData(buffer);
        audioBufferQueue.current.push(audioBuffer);
        scheduleBuffers();
      }
    };

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
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}
