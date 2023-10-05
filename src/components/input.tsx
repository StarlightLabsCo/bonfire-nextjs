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
}

const Input: FC<InputProps> = ({
  value,
  setValue,
  submit,
  placeholder,
  className: passedClassName,
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

  const computedClassName = cn(
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent',
    'file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    'w-full py-6 pl-4 pr-10 align-middle border-none placeholder:text-neutral-500 rounded-2xl bg-neutral-900',
    passedClassName,
  );

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
    <div className={`relative w-full mt-8`}>
      {recording && <FrequencyVisualizer data={frequencyData} />}
      <div>
        <input
          placeholder={placeholder}
          className={computedClassName}
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
            'absolute w-4 h-4 translate-y-1/2 cursor-pointer text-neutral-500 right-8 bottom-1/2 mr-2',
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
          className={cn(
            'absolute w-4 h-4 translate-y-1/2 cursor-pointer text-neutral-500 right-4 bottom-1/2',
          )}
          onClick={() => {
            submitValue();
          }}
        />
      </div>
    </div>
  );
};

export { Input };
