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
        console.log(data);

        if (data.type === 'message-add') {
          setMessages((messages) => [
            ...messages,
            {
              role: 'assistant',
              content: '',
            } as MessageLike,
          ]);
        } else if (data.type === 'message-update') {
          setMessages((messages) => {
            const lastMessage = messages[messages.length - 1];

            if (lastMessage.role === 'assistant') {
              return [
                ...messages.slice(0, messages.length - 1),
                { ...lastMessage, content: lastMessage.content + data.payload },
              ];
            } else {
              return messages;
            }
          });
        } else if (data.type === 'message-set') {
          setMessages((messages) => {
            const lastMessage = messages[messages.length - 1];

            if (lastMessage.role === 'assistant') {
              return [
                ...messages.slice(0, messages.length - 1),
                { ...lastMessage, content: data.payload },
              ];
            } else {
              return messages;
            }
          });
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
