'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { ActionSuggestions } from './action-suggestions';
import { UndoButton } from './undo-button';
import { useWebSocket } from '../contexts/ws-context';
import { useMessages } from '../contexts/messages-context';

interface StoryInputProps {
  instanceId: string;
  className?: string;
}

export function StoryInput({ instanceId, className }: StoryInputProps) {
  const [input, setInput] = useState('');
  const { sendJSON } = useWebSocket();
  const { messages, setMessages } = useMessages();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const submit = () => {
    sendJSON({
      type: 'addPlayerMessage',
      payload: {
        instanceId,
        content: input,
      },
    });

    setMessages([
      ...messages,
      { id: Date.now().toString(), role: 'user', content: input },
    ]);

    setInput('');
    setSuggestions([]);
  };

  return (
    <div className={cn(`flex flex-col w-full mt-2`, className)}>
      <div className="flex flex-wrap items-center justify-between mb-2">
        <ActionSuggestions
          suggestions={suggestions}
          setSuggestions={setSuggestions}
        />
        <UndoButton />
      </div>
      <Input
        placeholder="What do you do?"
        value={input}
        setValue={setInput}
        submit={submit}
      />
    </div>
  );
}