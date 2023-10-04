'use client';

import {
  AudioRecorder,
  arrayBufferToBase64,
  bufferBase64Audio,
  setupAudio,
} from '@/lib/audio';
import { createContext, useContext, useEffect, useState } from 'react';
import { WebSocketContext } from './ws-context';

interface AudioProcessorContextType {
  audioContext: AudioContext | null;
  bufferedPlayerNode: AudioWorkletNode | null;
  audioRecorder: AudioRecorder | null;
  transcription: string;
  setTranscription: (transcription: string) => void;
}

export const AudioProcessorContext = createContext<AudioProcessorContextType>({
  audioContext: null,
  bufferedPlayerNode: null,
  audioRecorder: null,
  transcription: '',
  setTranscription: () => {},
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

  const [transcription, setTranscription] = useState<string>('');

  useEffect(() => {
    async function setup() {
      // ---- Streaming Playback ----
      const { audioContext, bufferedPlayerNode } = await setupAudio();

      setAudioContext(audioContext);
      setBufferedPlayerNode(bufferedPlayerNode);

      // ---- Recording ----
      const audioRecorder = new AudioRecorder(audioContext);
      setAudioRecorder(audioRecorder);

      return () => {
        audioContext.close();
      };
    }
    setup();
  }, []);

  useEffect(() => {
    if (!socket) return;
    if (!audioRecorder) return;

    audioRecorder.onmessage = (event) => {
      if (event.data) {
        const rawAudio = event.data as Int16Array;
        const base64Audio = arrayBufferToBase64(rawAudio.buffer);

        socket.send(JSON.stringify({ type: 'voice', payload: base64Audio }));
      } else if (event.type === 'end') {
        console.log('end');
        socket.send(JSON.stringify({ type: 'voice-end' }));
      }
    };
  }, [audioRecorder, socket]);

  useEffect(() => {
    if (!bufferedPlayerNode || !socket) return;

    function handleMessage(event: MessageEvent) {
      const data = JSON.parse(event.data);

      console.log(data);

      if (data.type === 'audio') {
        bufferBase64Audio(audioContext, bufferedPlayerNode, data.payload.audio);
      } else if (data.type === 'transcription') {
        setTranscription(data.payload);
        console.log(data.payload);
      }
    }

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [audioContext, bufferedPlayerNode, socket]);

  return (
    <AudioProcessorContext.Provider
      value={{
        audioContext,
        bufferedPlayerNode,
        audioRecorder,
        transcription,
        setTranscription,
      }}
    >
      {children}
    </AudioProcessorContext.Provider>
  );
}
