import { useState } from 'react';
import { Input } from './input';
import { useWebSocket } from '../contexts/ws-context';
import { cn } from '@/lib/utils';

interface LobbyInputProps {
  userId: string;
  className?: string;
}

export function LobbyInput({ userId, className }: LobbyInputProps) {
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { sendJSON } = useWebSocket();

  const createWelcome = (description: string) => {
    sendJSON({
      type: 'welcome',
      payload: {},
    });
  };

  const createInstance = (description: string) => {
    sendJSON({
      type: 'create-instance',
      payload: {
        userId: userId,
        description: description,
      },
    });
  };

  const submit = () => {
    setSubmitted(true);
    createWelcome(description);
    createInstance(description);
  };

  return (
    <div className={cn(`flex flex-col w-full mt-8`, className)}>
      <div className="flex flex-wrap items-center justify-between mb-2">
        {/* <ActionSuggestions />
        <UndoButton /> */}
      </div>
      <Input
        value={description}
        setValue={setDescription}
        submit={submit}
        placeholder="Describe your adventure..."
        disabled={submitted}
        className={cn(submitted && 'cursor-not-allowed fade-out-2s')}
      />
    </div>
  );
}
