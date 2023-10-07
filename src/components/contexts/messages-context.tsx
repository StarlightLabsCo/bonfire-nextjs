'use client';

import { Message } from '@prisma/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { WebSocketContext } from './ws-context';
import { WebSocketResponseType } from '@/lib/websocket-schema';

type MessageLike = Message | { id: string; role: string; content: string };

type MessagesContextValue = {
  messages: Array<MessageLike>;
  setMessages: React.Dispatch<React.SetStateAction<Array<MessageLike>>>;
  suggestions: Array<string>;
  setSuggestions: React.Dispatch<React.SetStateAction<Array<string>>>;
};

export const MessagesContext = createContext<MessagesContextValue>({
  messages: [],
  setMessages: () => {},
  suggestions: [],
  setSuggestions: () => {},
});

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useContext(WebSocketContext);
  const [messages, setMessages] = useState<MessageLike[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        if (data.type === WebSocketResponseType.message) {
          setMessages((messages) => {
            const messageExists = messages.some(
              (message) => message.id === data.payload.id,
            );

            if (messageExists) {
              return messages.map((message) =>
                message.id === data.payload.id
                  ? {
                      id: data.payload.id,
                      role: 'assistant',
                      content: data.payload.content,
                    }
                  : message,
              );
            } else {
              return [
                ...messages,
                {
                  id: data.payload.id,
                  role: 'assistant',
                  content: data.payload.content,
                },
              ];
            }
          });
        } else if (data.type === WebSocketResponseType['message-append']) {
          setMessages((messages) => {
            const messageExists = messages.some(
              (message) => message.id === data.payload.id,
            );

            if (messageExists) {
              return messages.map((message) =>
                message.id === data.payload.id
                  ? {
                      id: data.payload.id,
                      role: 'assistant',
                      content: message.content + data.payload.content,
                    }
                  : message,
              );
            } else {
              console.error(`Message ${data.payload.id} does not exist.`);
              return messages;
            }
          });
        } else if (data.type === WebSocketResponseType.image) {
          setMessages((messages) => {
            const messageExists = messages.some(
              (message) => message.id === data.payload.id,
            );

            if (messageExists) {
              return messages.map((message) =>
                message.id === data.payload.id
                  ? {
                      id: data.payload.id,
                      role: 'function',
                      content: data.payload.content,
                    }
                  : message,
              );
            } else {
              return [
                ...messages,
                {
                  id: data.payload.id,
                  role: 'function',
                  content: data.payload.content,
                },
              ];
            }
          });
        } else if (data.type === WebSocketResponseType.suggestions) {
          setSuggestions(data.payload.content);
        }
      });
    }
  }, [socket]);

  return (
    <MessagesContext.Provider
      value={{ messages, setMessages, suggestions, setSuggestions }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
