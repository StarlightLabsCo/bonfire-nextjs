'use client';

import { Message } from '@prisma/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { WebSocketContext } from './ws-context';

type MessageLike = Message | { role: 'user'; content: string };

type MessagesContextValue = {
  messages: Array<MessageLike>;
  setMessages: React.Dispatch<React.SetStateAction<Array<MessageLike>>>;
};

export const MessagesContext = createContext<MessagesContextValue>({
  messages: [],
  setMessages: () => {},
});

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const socket = useContext(WebSocketContext);
  const [messages, setMessages] = useState<MessageLike[]>([]);

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'message-append') {
          setMessages((messages) => [...messages, data.payload]);
        }
      });
    }
  }, [socket]);

  return (
    <MessagesContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessagesContext.Provider>
  );
}
