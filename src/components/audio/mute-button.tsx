import { useState } from 'react';
import { Icons } from '../icons';
import { useAudioProcessor } from '../contexts/audio-context';

export function MuteButton({ className }: { className?: string }) {
  const [muted, setMuted] = useState(false);
  const { setVolume } = useAudioProcessor();

  function mute() {
    setMuted(true);
    setVolume(0);
  }

  function unmute() {
    setMuted(false);
    setVolume(1);
  }

  if (muted) {
    return (
      <button className={className} onClick={unmute}>
        <Icons.speakerMuted />
      </button>
    );
  } else {
    return (
      <button className={className} onClick={mute}>
        <Icons.speakerLoud />
      </button>
    );
  }
}
