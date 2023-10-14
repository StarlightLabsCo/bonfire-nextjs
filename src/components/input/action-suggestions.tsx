'use client';

import { useEffect, useState } from 'react';
import { Suggestions } from './suggestions';
import { useWebSocket } from '../contexts/ws-context';
import { useMessages } from '../contexts/messages-context';

export function ActionSuggestions() {
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

  const submitAction = (suggestion: string) => {
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
  };

  return (
    <Suggestions
      suggestions={suggestions}
      selectSuggestion={(suggestion: string) => submitAction(suggestion)}
    />
  );
}
