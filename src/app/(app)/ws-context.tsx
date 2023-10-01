'use client';

import { createContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { RingBuffer } from '@/lib/audio';

export const WebSocketContext = createContext<WebSocket | null>(null);

function base64ToUint8Array(base64: string) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToFloat32Array(u8a: Uint8Array) {
  const numSamples = u8a.length / 2; // because 16-bit samples
  const f32Array = new Float32Array(numSamples);
  let ptr = 0;

  for (let i = 0; i < numSamples; i++) {
    // Convert 2 bytes to a 16-bit signed integer
    const sample = (u8a[ptr + 1] << 8) | u8a[ptr];
    ptr += 2;

    // Normalize to [-1, 1]
    f32Array[i] =
      sample < 0x8000 ? sample / 0x8000 : (sample - 0x10000) / 0x8000;
  }

  return f32Array;
}

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [bufferedPlayerNode, setBufferedPlayerNode] =
    useState<AudioWorkletNode | null>(null);

  async function setupAudioModule() {
    const processorCode = `
          // Incorporate RingBuffer inside the AudioWorkletProcessor
          ${RingBuffer.toString()}

          class BufferedPlayerProcessor extends AudioWorkletProcessor {
              constructor() {
                  super();
                  this.ringBuffer = new RingBuffer(44100 * 60); // 60 seconds buffer, adjust as needed
                  this.port.onmessage = event => {
                      if (event.data.push) {
                          this.ringBuffer.push(event.data.push);
                      }
                  };
              }

              process(inputs, outputs) {
                  const output = outputs[0];
                  const outputChannel = output[0];
                  outputChannel.set(this.ringBuffer.pull(outputChannel.length));
                  return true;
              }
          }

          registerProcessor('buffered-player-processor', BufferedPlayerProcessor);
          `;

    const blob = new Blob([processorCode], {
      type: 'application/javascript',
    });
    const blobURL = URL.createObjectURL(blob);

    const audioContextTemp = new AudioContext({
      sampleRate: 44100,
      latencyHint: 'interactive',
    });
    await audioContextTemp.audioWorklet.addModule(blobURL);

    const bufferedPlayerNodeTemp = new AudioWorkletNode(
      audioContextTemp,
      'buffered-player-processor',
    );
    bufferedPlayerNodeTemp.connect(audioContextTemp.destination);

    setAudioContext(audioContextTemp);
    setBufferedPlayerNode(bufferedPlayerNodeTemp);
  }

  useEffect(() => {
    setupAudioModule();
  }, []);

  useEffect(() => {
    if (!bufferedPlayerNode) return;

    function handleMessage(event: MessageEvent) {
      const data = JSON.parse(event.data);

      if (data.type === 'instance-created') {
        router.push(`/instances/${data.payload.instanceId}`);
      } else if (data.type === 'error') {
        toast({
          title: 'Error',
          description: data.payload.message,
        });
      } else if (data.audio) {
        const audio = data.audio;
        const audioBytes = base64ToUint8Array(audio);

        if (bufferedPlayerNode === null) {
          console.log('bufferedPlayerNode is null');
          return;
        }

        audioContext?.resume();

        const audioFloat32Array = uint8ArrayToFloat32Array(audioBytes);

        bufferedPlayerNode.port.postMessage({ push: audioFloat32Array });
      }
    }

    // If the socket doesn't exist, create a new one
    if (socket === null) {
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
    } else {
      // If the socket already exists, update the message handler
      socket.removeEventListener('message', handleMessage);
      socket.addEventListener('message', handleMessage);
    }

    // Clean-up: Remove the message handler when the component is unmounted or when bufferedPlayerNode changes
    return () => {
      if (socket) {
        socket.removeEventListener('message', handleMessage);
      }
    };
  }, [bufferedPlayerNode]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}
