'use client';

import { AudioRecorder, pushBase64Audio, setupAudioModule } from '@/lib/audio';
import { createContext, useContext, useEffect, useState } from 'react';
import { WebSocketContext } from './ws-context';

interface AudioProcessorContextType {
  audioContext: AudioContext | null;
  bufferedPlayerNode: AudioWorkletNode | null;
}

export const AudioProcessorContext = createContext<AudioProcessorContextType>({
  audioContext: null,
  bufferedPlayerNode: null,
});

export function AudioContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { socket } = useContext(WebSocketContext);

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [bufferedPlayerNode, setBufferedPlayerNode] =
    useState<AudioWorkletNode | null>(null);
  const [audioRecorder, setAudioRecorder] = useState<AudioRecorder | null>(
    null,
  );

  useEffect(() => {
    async function setupAudio() {
      // ---- Streaming Playback ----
      const { audioContext, bufferedPlayerNode } = await setupAudioModule();

      setAudioContext(audioContext);
      setBufferedPlayerNode(bufferedPlayerNode);

      // ---- Recording ----
      const audioRecorder = new AudioRecorder();
      setAudioRecorder(audioRecorder);

      return () => {
        audioContext.close();
      };
    }
    setupAudio();
  }, []);

  useEffect(() => {
    if (!bufferedPlayerNode || !socket) return;

    function handleMessage(event: MessageEvent) {
      const data = JSON.parse(event.data);

      if (data.audio) {
        pushBase64Audio(audioContext, bufferedPlayerNode, data.audio);
      }
    }

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [audioContext, bufferedPlayerNode, socket]);

  return (
    <AudioProcessorContext.Provider
      value={{ audioContext, bufferedPlayerNode }}
    >
      {children}
    </AudioProcessorContext.Provider>
  );
}
