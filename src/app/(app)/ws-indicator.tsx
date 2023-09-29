import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from './ws-context';
import { cn } from '@/lib/utils';

export function WebSocketStatusIndicator() {
  const socket = useContext(WebSocketContext);
  const [status, setStatus] = useState('CLOSED');

  useEffect(() => {
    if (socket) {
      socket.onopen = () => setStatus('OPEN');
      socket.onclose = () => setStatus('CLOSED');
    }
    return () => {
      if (socket) {
        socket.onopen = null;
        socket.onclose = null;
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
