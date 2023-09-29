'use client';

import { useContext, useEffect } from 'react';
import { WebSocketContext } from './ws-context';
import { User } from 'next-auth';

export function Lobby({
  user,
}: {
  user: {
    id: string;
  } & User;
}) {
  const socket = useContext(WebSocketContext);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
      };
    }
  }, [socket]);

  return <div className="flex flex-col">lobby</div>;
}
