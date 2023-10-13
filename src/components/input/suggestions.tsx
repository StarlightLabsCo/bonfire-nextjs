import { useEffect, useState } from 'react';
import { useWebSocket } from '../contexts/ws-context';
import { useMessages } from '../contexts/messages-context';

export function Suggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { sendJSON, instanceId } = useWebSocket();
  const { messages, setMessages } = useMessages();

  useEffect(() => {
    if (messages.length > 0) {
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
    } else {
      setSuggestions([]);
    }
  }, [messages]);

  return (
    <div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
      {suggestions &&
        suggestions.map((suggestion, index) => (
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
                {
                  id: Date.now().toString(),
                  role: 'user',
                  content: suggestion,
                },
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
