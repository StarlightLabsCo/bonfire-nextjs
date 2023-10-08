import { cn } from '@/lib/utils';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Icons } from '../icons';
import {
  FC,
  InputHTMLAttributes,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AudioProcessorContext } from '../contexts/audio-context';
import { WebSocketContext } from '../contexts/ws-context';
import { MessageLike, MessagesContext } from '../contexts/messages-context';
import { Suggestions } from './suggestions';
import { Button } from '../ui/button';
import { MessageRole } from '@prisma/client';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  setValue: (value: string) => void;
  submit: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const Input: FC<InputProps> = ({
  value,
  setValue,
  submit,
  placeholder,
  className,
  ...props
}) => {
  const { socket, sendJSON, instanceId } = useContext(WebSocketContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const { audioRecorder, transcription, setTranscription } = useContext(
    AudioProcessorContext,
  );

  const [recording, setRecording] = useState<boolean>(false);

  useEffect(() => {
    if (transcription) {
      setValue(transcription);
    }
  }, [setValue, transcription]);

  function submitValue() {
    submit();
    setTranscription('');
  }

  function getMessagesToUndo() {
    const messagesCopy = [...messages].reverse();
    let generateSuggestionsCount = 0;

    for (let i = 0; i < messagesCopy.length; i++) {
      const message = messagesCopy[i];

      if (message.role === MessageRole.function) {
        const content = JSON.parse(message.content);

        if (content.type === 'generate_suggestions') {
          generateSuggestionsCount++;
          if (generateSuggestionsCount === 2) {
            return messagesCopy.slice(0, i);
          }
        }

        continue;
      }
    }

    return [];
  }

  function removeMessages(messagesToRemove: MessageLike[]) {
    setMessages((messages) =>
      messages.filter((message) => !messagesToRemove.includes(message)),
    );
  }

  function undo() {
    // Step 1: Optimistically remove messages
    const messagesToUndo = getMessagesToUndo();
    removeMessages(messagesToUndo);

    sendJSON({
      type: 'undo',
      payload: {
        instanceId,
      },
    });
  }

  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return <div>Connecting...</div>;
  }

  return (
    <div className={cn(`flex flex-col w-full mt-8`, className)}>
      <div className="flex flex-wrap items-center justify-between mb-2">
        <Suggestions />
        <button
          className="flex flex-row items-center gap-x-2 text-sm px-3 py-1 h-full border rounded-full border-neutral-900 hover:border-neutral-800 text-neutral-600 hover:text-neutral-500 fade-in-2s"
          onClick={undo}
        >
          Undo
          <Icons.undo />
        </button>
      </div>
      <div className="flex items-center px-4 py-2 bg-neutral-900 rounded-2xl disabled:cursor-not-allowed disabled:opacity-50">
        <input
          placeholder={placeholder}
          className="w-full py-2 text-sm placeholder:text-neutral-500 bg-neutral-900 focus:outline-none"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              submit();
            }
          }}
          {...props}
        />
        <Icons.microphone
          className={cn(
            'w-4 h-4 cursor-pointer text-neutral-500 mr-2',
            recording && 'animate-pulse text-red-500',
          )}
          onClick={() => {
            if (!audioRecorder) {
              console.error('Audio recorder not initialized');
              return;
            }

            if (!recording) {
              setTranscription('');
              setValue('');

              setRecording(true);
              audioRecorder.startRecording();
            } else {
              setRecording(false);
              audioRecorder.stopRecording();
            }
          }}
        />
        <PaperPlaneIcon
          className={cn('w-4 h-4 cursor-pointer text-neutral-500')}
          onClick={() => {
            submitValue();
          }}
        />
      </div>
    </div>
  );
};

export { Input };
