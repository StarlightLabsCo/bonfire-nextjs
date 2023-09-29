'use client';

import { useContext, useEffect } from 'react';
import { WebSocketContext } from './ws-context';
import { WebSocketStatusIndicator } from './ws-indicator';

export function Dashboard() {
  const socket = useContext(WebSocketContext);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
      };
    }
  }, [socket]);

  return (
    <>
      <WebSocketStatusIndicator />
      Dashboard
    </>
  );
}
