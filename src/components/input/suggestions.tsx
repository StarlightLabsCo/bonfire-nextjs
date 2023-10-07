import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../contexts/ws-context';
import { MessagesContext } from '../contexts/messages-context';
import {
  WebSocketResponse,
  WebSocketResponseType,
} from '@/lib/websocket-schema';
import { type } from 'os';

export function Suggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { sendJSON, instanceId } = useContext(WebSocketContext);
  const { messages, setMessages } = useContext(MessagesContext);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role === 'function') {
      const lastMessageContent: {
        type: string;
        payload: string[];
      } = lastMessage && JSON.parse(lastMessage.content);

      if (
        lastMessageContent &&
        lastMessageContent.type === 'generate_suggestions'
      ) {
        setSuggestions(lastMessageContent.payload);
      }
    }
  }, [messages]);

  console.log('SUGGESTIONS ARE STUPID HERES THE INSTANCE', instanceId);

  return (
    <div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="px-3 py-1 border rounded-full border-neutral-900 hover:border-neutral-800 text-neutral-600 hover:text-neutral-500 fade-in-2s"
          onClick={() => {
            sendJSON({
              type: 'add-player-message',
              payload: {
                instanceId,
                content: suggestion,
              },
            });

            setMessages([
              ...messages,
              { id: '', role: 'user', content: suggestion },
            ]);

            setSuggestions([]);
          }}
        >
          <span className="text-sm font-light">{suggestion}</span>
        </button>
      ))}
    </div>
  );
}
