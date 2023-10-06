import { useContext } from 'react';
import { WebSocketContext } from './app/ws-context';
import { MessagesContext } from './app/messages-context';

export function Suggestions() {
  const { sendJSON, instanceId } = useContext(WebSocketContext);
  const { messages, setMessages, suggestions, setSuggestions } =
    useContext(MessagesContext);

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

            setMessages([...messages, { role: 'user', content: suggestion }]);

            setSuggestions([]);
          }}
        >
          <span className="text-sm font-light">{suggestion}</span>
        </button>
      ))}
    </div>
  );
}
