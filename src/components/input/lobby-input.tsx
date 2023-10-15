import { useState } from 'react';
import { Input } from './input';
import { useWebSocket } from '../contexts/ws-context';
import { cn } from '@/lib/utils';
import { Suggestions } from './suggestions';

interface LobbyInputProps {
  userId: string;
  className?: string;
}

export function LobbyInput({ userId, className }: LobbyInputProps) {
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { sendJSON, adventureSuggestions, setAdventureSuggestions } =
    useWebSocket();

  const createWelcome = (description: string) => {
    sendJSON({
      type: 'welcome',
      payload: {},
    });
  };

  const createInstance = (description: string) => {
    sendJSON({
      type: 'createInstance',
      payload: {
        userId: userId,
        description: description,
      },
    });
  };

  const submit = (description: string) => {
    setSubmitted(true);
    createWelcome(description);
    createInstance(description);
  };

  return (
    <div
      className={cn(
        `flex flex-col items-center gap-y-2 w-full mt-10`,
        className,
      )}
    >
      <Input
        value={description}
        setValue={setDescription}
        submit={() => submit(description)}
        placeholder="Describe your adventure..."
        disabled={submitted}
        className={cn(submitted && 'cursor-not-allowed fade-out-2s')}
      />
      <Suggestions
        suggestions={adventureSuggestions}
        onSelect={(suggestion) => {
          submit(suggestion);
        }}
        className={cn(submitted && 'cursor-not-allowed fade-out-2s')}
      />
    </div>
  );
}
