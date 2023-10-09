import React, { useEffect, useState } from 'react';
import { useWebSocket } from './contexts/ws-context';
import { cn } from '@/lib/utils';

export function WebSocketStatusIndicator() {
  const { socket } = useWebSocket();
  const [status, setStatus] = useState('CLOSED');

  const onOpen = () => {
    setStatus('OPEN');
  };

  const onClose = () => {
    setStatus('CLOSED');
  };

  useEffect(() => {
    if (socket) {
      socket.addEventListener('open', onOpen);
      socket.addEventListener('close', onClose);
    }
    return () => {
      if (socket) {
        socket.removeEventListener('onopen', onOpen);
        socket.removeEventListener('onclose', onClose);
      }
    };
  }, [socket]);

  return (
    <div
      className={cn(
        'w-2 h-2 rounded-full',
        status === 'OPEN' ? 'bg-green-500' : 'bg-red-500',
      )}
    />
  );
}
