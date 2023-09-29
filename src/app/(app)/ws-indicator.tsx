import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from './ws-context';

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

  const statusColor = status === 'OPEN' ? 'green' : 'red';

  return (
    <div style={{ position: 'absolute', top: 0, right: 0, color: statusColor }}>
      {status}
    </div>
  );
}
