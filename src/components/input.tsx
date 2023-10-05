import { cn } from '@/lib/utils';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Icons } from './icons';
import {
  FC,
  InputHTMLAttributes,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AudioProcessorContext } from './app/audio-context';
import { WebSocketContext } from './app/ws-context';
import FrequencyVisualizer from './frequency-visualizer';

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
  const { socket } = useContext(WebSocketContext);

  const { audioRecorder, transcription, setTranscription } = useContext(
    AudioProcessorContext,
  );
  const [recording, setRecording] = useState<boolean>(false);
  const [frequencyData, setFrequencyData] = useState(new Uint8Array(4));

  useEffect(() => {
    if (!audioRecorder || !recording) return;

    const animate = () => {
      setFrequencyData(audioRecorder.getFrequencyData());
      requestAnimationFrame(animate);
    };
    animate();
  }, [audioRecorder, recording]);

  useEffect(() => {
    if (transcription) {
      setValue(transcription);
    }
  }, [setValue, transcription]);

  function submitValue() {
    submit();
    setTranscription('');
  }

  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return <div>Connecting...</div>;
  }

  return (
    <div className={cn(`flex flex-col w-full mt-8`, className)}>
      <div className="h-9">
        {recording && <FrequencyVisualizer data={frequencyData} />}
      </div>
      <div className="flex h-9 items-center bg-neutral-900 rounded-2xl px-4 py-1 disabled:cursor-not-allowed disabled:opacity-50">
        <input
          placeholder={placeholder}
          className="w-full text-sm placeholder:text-neutral-500 bg-neutral-900 focus:outline-none"
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
